/**
 * DocumentMatcher Bridge Service (Patch 006)
 * 
 * Purpose: Bridge service connecting Morpheus document capture to MercuryOne passport system
 * Agent Owner: Janus
 * 
 * Implements:
 * - Document linking interface with confidence scoring and lifecycle status
 * - Document bridge with status monitoring and confidence scoring
 * - Document linking and passport integration
 */

const { v4: uuidv4 } = require('uuid');

class DocumentBridgeService {
  constructor(db) {
    this.db = db;
    this.agents = {
      janus: 'Janus',      // Gatekeeper - document validation and passport creation
      juno: 'Juno',        // Supplier identification and pattern matching
      argus: 'Argus',      // OCR processing (Morpheus)
      daedalus: 'Daedalus' // Schema memory and enrichment (Morpheus)
    };
    this.confidenceThresholds = {
      supplier_identification: 0.80,
      document_type: 0.85,
      field_extraction: 0.90,
      business_validation: 0.95
    };
  }

  /**
   * Create a new document passport from Morpheus document capture
   * 
   * @param {Object} morpheusDocument - Document data from Morpheus
   * @returns {Object} Created passport with initial confidence scoring
   */
  async createDocumentPassport(morpheusDocument) {
    try {
      const passportId = `DOC-${Date.now()}-${uuidv4().substr(0, 8)}`;
      
      // Create passport record
      const passportResult = await this.db.query(`
        INSERT INTO document_passports (
          passport_id, document_id, document_type, current_phase, status,
          current_agent, confidence_score, quality_metrics, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *
      `, [
        passportId,
        morpheusDocument.documentId,
        morpheusDocument.documentType || 'unknown',
        'intake',
        'in_progress',
        this.agents.janus,
        0.00,
        JSON.stringify({
          ocr_confidence: morpheusDocument.ocrConfidence || 0,
          file_quality: morpheusDocument.fileQuality || 'unknown',
          processing_stage: 'intake'
        })
      ]);

      // Create Morpheus bridge record
      await this.db.query(`
        INSERT INTO morpheus_document_bridge (
          passport_id, morpheus_document_id, morpheus_processing_stage,
          morpheus_status, ocr_confidence, ocr_results, bridge_status,
          morpheus_captured_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `, [
        passportId,
        morpheusDocument.documentId,
        morpheusDocument.processingStage || 'captured',
        morpheusDocument.status || 'processing',
        morpheusDocument.ocrConfidence || 0.00,
        JSON.stringify(morpheusDocument.ocrData || {}),
        'linked',
        new Date(morpheusDocument.capturedAt || Date.now())
      ]);

      // Log passport creation event
      await this.logBusinessEvent(passportId, 'passport_created', {
        agent: this.agents.janus,
        document_id: morpheusDocument.documentId,
        initial_confidence: 0.00
      });

      // Queue for supplier identification
      await this.queueForProcessing(passportId, this.agents.juno, 'supplier_identification', {
        ocr_data: morpheusDocument.ocrData,
        document_type: morpheusDocument.documentType
      });

      return passportResult.rows[0];

    } catch (error) {
      console.error('Error creating document passport:', error);
      throw new Error(`Failed to create document passport: ${error.message}`);
    }
  }

  /**
   * Process supplier identification with confidence scoring
   * 
   * @param {string} passportId - Document passport ID
   * @param {Object} ocrData - OCR extracted data
   * @returns {Object} Supplier identification results with confidence
   */
  async processSupplierIdentification(passportId, ocrData) {
    try {
      // Get supplier patterns for matching
      const suppliersResult = await this.db.query(`
        SELECT id, name, code, contact_email, phone 
        FROM suppliers 
        WHERE active = true
      `);
      
      const suppliers = suppliersResult.rows;
      let bestMatch = null;
      let maxConfidence = 0;
      const identificationResults = [];

      // Pattern matching logic
      for (const supplier of suppliers) {
        const confidence = await this.calculateSupplierConfidence(supplier, ocrData);
        
        identificationResults.push({
          supplier_id: supplier.id,
          supplier_name: supplier.name,
          confidence: confidence,
          matched_patterns: this.getMatchedPatterns(supplier, ocrData)
        });

        if (confidence > maxConfidence) {
          maxConfidence = confidence;
          bestMatch = supplier;
        }
      }

      // Update passport with identification results
      if (bestMatch && maxConfidence >= this.confidenceThresholds.supplier_identification) {
        await this.db.query(`
          UPDATE document_passports 
          SET supplier_id = $1, current_phase = 'identification', 
              confidence_score = $2, updated_at = NOW()
          WHERE passport_id = $3
        `, [bestMatch.id, maxConfidence, passportId]);

        // Record confidence tracking
        await this.db.query(`
          INSERT INTO document_confidence_tracking (
            passport_id, supplier_id, supplier_identification_confidence,
            identified_patterns, created_at
          ) VALUES ($1, $2, $3, $4, NOW())
        `, [
          passportId,
          bestMatch.id,
          maxConfidence,
          JSON.stringify(identificationResults)
        ]);

        // Queue for data extraction
        await this.queueForProcessing(passportId, this.agents.daedalus, 'data_extraction', {
          supplier_id: bestMatch.id,
          supplier_patterns: this.getSupplierPatterns(bestMatch),
          identification_confidence: maxConfidence
        });

        await this.logBusinessEvent(passportId, 'supplier_identified', {
          supplier_id: bestMatch.id,
          supplier_name: bestMatch.name,
          confidence: maxConfidence
        });

      } else {
        // Low confidence - mark for manual review
        await this.db.query(`
          UPDATE document_passports 
          SET status = 'exception', current_phase = 'manual_review',
              confidence_score = $1, updated_at = NOW()
          WHERE passport_id = $2
        `, [maxConfidence, passportId]);

        await this.logBusinessEvent(passportId, 'manual_review_required', {
          reason: 'low_supplier_confidence',
          max_confidence: maxConfidence,
          threshold: this.confidenceThresholds.supplier_identification
        });
      }

      return {
        passport_id: passportId,
        best_match: bestMatch,
        confidence: maxConfidence,
        all_results: identificationResults,
        requires_manual_review: maxConfidence < this.confidenceThresholds.supplier_identification
      };

    } catch (error) {
      console.error('Error processing supplier identification:', error);
      await this.handleProcessingError(passportId, 'supplier_identification', error);
      throw error;
    }
  }

  /**
   * Calculate supplier confidence based on pattern matching
   * 
   * @param {Object} supplier - Supplier data
   * @param {Object} ocrData - OCR extracted text and data
   * @returns {number} Confidence score (0.00 - 1.00)
   */
  async calculateSupplierConfidence(supplier, ocrData) {
    let confidence = 0.00;
    const text = (ocrData.extractedText || '').toLowerCase();
    const patterns = [];

    // Company name matching (weighted 40%)
    if (text.includes(supplier.name.toLowerCase())) {
      confidence += 0.40;
      patterns.push('company_name_exact');
    } else if (this.fuzzyMatch(supplier.name.toLowerCase(), text)) {
      confidence += 0.25;
      patterns.push('company_name_fuzzy');
    }

    // Code matching (weighted 30%)
    if (supplier.code && text.includes(supplier.code.toLowerCase())) {
      confidence += 0.30;
      patterns.push('supplier_code');
    }

    // Email matching (weighted 20%)
    if (supplier.contact_email && text.includes(supplier.contact_email.toLowerCase())) {
      confidence += 0.20;
      patterns.push('email_address');
    }

    // Phone matching (weighted 10%)
    if (supplier.phone && this.normalizePhone(text).includes(this.normalizePhone(supplier.phone))) {
      confidence += 0.10;
      patterns.push('phone_number');
    }

    return Math.min(confidence, 1.00);
  }

  /**
   * Process document lifecycle transitions
   * 
   * @param {string} passportId - Document passport ID
   * @param {string} fromPhase - Current phase
   * @param {string} toPhase - Target phase
   * @param {Object} context - Processing context
   */
  async transitionPhase(passportId, fromPhase, toPhase, context = {}) {
    try {
      // Validate transition
      const validTransitions = {
        'intake': ['identification', 'failed'],
        'identification': ['extraction', 'manual_review', 'failed'],
        'extraction': ['processing', 'failed'],
        'processing': ['integration', 'failed'],
        'integration': ['completed', 'failed'],
        'manual_review': ['identification', 'failed'],
        'failed': [], // Terminal state
        'completed': [] // Terminal state
      };

      if (!validTransitions[fromPhase]?.includes(toPhase)) {
        throw new Error(`Invalid phase transition from ${fromPhase} to ${toPhase}`);
      }

      // Update passport
      const updateResult = await this.db.query(`
        UPDATE document_passports 
        SET current_phase = $1, updated_at = NOW(),
            phase_history = phase_history || $2::jsonb
        WHERE passport_id = $3 AND current_phase = $4
        RETURNING *
      `, [
        toPhase,
        JSON.stringify([{
          from_phase: fromPhase,
          to_phase: toPhase,
          timestamp: new Date().toISOString(),
          context: context
        }]),
        passportId,
        fromPhase
      ]);

      if (updateResult.rows.length === 0) {
        throw new Error(`Failed to transition passport ${passportId} - phase mismatch or not found`);
      }

      await this.logBusinessEvent(passportId, 'phase_transition', {
        from_phase: fromPhase,
        to_phase: toPhase,
        context: context
      });

      return updateResult.rows[0];

    } catch (error) {
      console.error('Error transitioning phase:', error);
      throw error;
    }
  }

  /**
   * Queue document for agent processing
   * 
   * @param {string} passportId - Document passport ID
   * @param {string} agentName - Target agent name
   * @param {string} processingStage - Processing stage
   * @param {Object} context - Processing context
   */
  async queueForProcessing(passportId, agentName, processingStage, context = {}) {
    try {
      await this.db.query(`
        INSERT INTO document_processing_queue (
          passport_id, agent_name, processing_stage, priority,
          processing_context, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [
        passportId,
        agentName,
        processingStage,
        context.priority || 50,
        JSON.stringify(context),
        'queued'
      ]);

      await this.logAgentCommunication(
        'system',
        agentName,
        'queue_assignment',
        {
          passport_id: passportId,
          processing_stage: processingStage,
          context: context
        }
      );

    } catch (error) {
      console.error('Error queuing for processing:', error);
      throw error;
    }
  }

  /**
   * Get passport status with full details
   * 
   * @param {string} passportId - Document passport ID
   * @returns {Object} Complete passport status
   */
  async getPassportStatus(passportId) {
    try {
      const passportResult = await this.db.query(`
        SELECT p.*, s.name as supplier_name, s.code as supplier_code,
               mb.morpheus_document_id, mb.bridge_status, mb.ocr_confidence,
               ct.supplier_identification_confidence, ct.field_extraction_confidence
        FROM document_passports p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        LEFT JOIN morpheus_document_bridge mb ON p.passport_id = mb.passport_id
        LEFT JOIN document_confidence_tracking ct ON p.passport_id = ct.passport_id
        WHERE p.passport_id = $1
      `, [passportId]);

      if (passportResult.rows.length === 0) {
        throw new Error(`Passport not found: ${passportId}`);
      }

      const passport = passportResult.rows[0];

      // Get processing queue status
      const queueResult = await this.db.query(`
        SELECT * FROM document_processing_queue 
        WHERE passport_id = $1 
        ORDER BY created_at DESC
      `, [passportId]);

      // Get recent agent communications
      const communicationsResult = await this.db.query(`
        SELECT * FROM agent_communication_log 
        WHERE passport_id = $1 
        ORDER BY created_at DESC 
        LIMIT 10
      `, [passportId]);

      return {
        passport: passport,
        processing_queue: queueResult.rows,
        recent_communications: communicationsResult.rows,
        overall_confidence: passport.confidence_score,
        estimated_completion: this.estimateCompletionTime(passport),
        next_actions: this.getNextActions(passport)
      };

    } catch (error) {
      console.error('Error getting passport status:', error);
      throw error;
    }
  }

  /**
   * Update document confidence based on processing results
   * 
   * @param {string} passportId - Document passport ID
   * @param {string} confidenceType - Type of confidence to update
   * @param {number} confidence - Confidence score (0.00 - 1.00)
   * @param {Object} details - Additional details
   */
  async updateConfidence(passportId, confidenceType, confidence, details = {}) {
    try {
      const validTypes = [
        'supplier_identification_confidence',
        'document_type_confidence', 
        'field_extraction_confidence',
        'business_validation_confidence'
      ];

      if (!validTypes.includes(confidenceType)) {
        throw new Error(`Invalid confidence type: ${confidenceType}`);
      }

      // Update confidence tracking
      await this.db.query(`
        UPDATE document_confidence_tracking 
        SET ${confidenceType} = $1, updated_at = NOW()
        WHERE passport_id = $2
      `, [confidence, passportId]);

      // Calculate overall confidence
      const confidenceResult = await this.db.query(`
        SELECT 
          COALESCE(supplier_identification_confidence, 0) as supplier_conf,
          COALESCE(document_type_confidence, 0) as doc_type_conf,
          COALESCE(field_extraction_confidence, 0) as field_conf,
          COALESCE(business_validation_confidence, 0) as business_conf
        FROM document_confidence_tracking 
        WHERE passport_id = $1
      `, [passportId]);

      if (confidenceResult.rows.length > 0) {
        const conf = confidenceResult.rows[0];
        const overallConfidence = (
          conf.supplier_conf * 0.3 +
          conf.doc_type_conf * 0.2 +
          conf.field_conf * 0.3 +
          conf.business_conf * 0.2
        );

        // Update passport overall confidence
        await this.db.query(`
          UPDATE document_passports 
          SET confidence_score = $1, updated_at = NOW()
          WHERE passport_id = $2
        `, [overallConfidence, passportId]);
      }

    } catch (error) {
      console.error('Error updating confidence:', error);
      throw error;
    }
  }

  /**
   * Handle processing errors and implement retry logic
   * 
   * @param {string} passportId - Document passport ID
   * @param {string} processingStage - Current processing stage
   * @param {Error} error - Error that occurred
   */
  async handleProcessingError(passportId, processingStage, error) {
    try {
      // Update processing queue with error
      await this.db.query(`
        UPDATE document_processing_queue 
        SET status = 'failed', error_details = $1, updated_at = NOW()
        WHERE passport_id = $2 AND processing_stage = $3 AND status = 'processing'
      `, [
        JSON.stringify({
          error_message: error.message,
          error_stack: error.stack,
          timestamp: new Date().toISOString()
        }),
        passportId,
        processingStage
      ]);

      // Check if retry is possible
      const retryResult = await this.db.query(`
        SELECT retry_count, max_retries 
        FROM document_processing_queue 
        WHERE passport_id = $1 AND processing_stage = $2
        ORDER BY created_at DESC LIMIT 1
      `, [passportId, processingStage]);

      if (retryResult.rows.length > 0) {
        const { retry_count, max_retries } = retryResult.rows[0];
        
        if (retry_count < max_retries) {
          // Queue for retry
          await this.db.query(`
            UPDATE document_processing_queue 
            SET status = 'retrying', retry_count = retry_count + 1, updated_at = NOW()
            WHERE passport_id = $1 AND processing_stage = $2
          `, [passportId, processingStage]);
        } else {
          // Max retries exceeded - mark passport as failed
          await this.db.query(`
            UPDATE document_passports 
            SET status = 'failed', updated_at = NOW()
            WHERE passport_id = $1
          `, [passportId]);
        }
      }

      await this.logBusinessEvent(passportId, 'processing_error', {
        processing_stage: processingStage,
        error_message: error.message,
        retry_count: retryResult.rows[0]?.retry_count || 0
      });

    } catch (logError) {
      console.error('Error handling processing error:', logError);
    }
  }

  /**
   * Log business events for audit trail
   */
  async logBusinessEvent(passportId, eventType, details) {
    try {
      await this.db.query(`
        UPDATE document_passports 
        SET business_events = business_events || $1::jsonb, updated_at = NOW()
        WHERE passport_id = $2
      `, [
        JSON.stringify([{
          event_type: eventType,
          timestamp: new Date().toISOString(),
          details: details
        }]),
        passportId
      ]);
    } catch (error) {
      console.error('Error logging business event:', error);
    }
  }

  /**
   * Log agent communications
   */
  async logAgentCommunication(sourceAgent, targetAgent, messageType, content) {
    try {
      await this.db.query(`
        INSERT INTO agent_communication_log (
          source_agent, target_agent, message_type, message_content,
          status, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `, [
        sourceAgent,
        targetAgent,
        messageType,
        JSON.stringify(content),
        'sent'
      ]);
    } catch (error) {
      console.error('Error logging agent communication:', error);
    }
  }

  // Utility methods
  fuzzyMatch(needle, haystack) {
    const words = needle.split(' ');
    let matches = 0;
    for (const word of words) {
      if (word.length > 3 && haystack.includes(word)) {
        matches++;
      }
    }
    return matches / words.length > 0.6;
  }

  normalizePhone(phone) {
    return phone.replace(/[\s\-\(\)]/g, '');
  }

  getMatchedPatterns(supplier, ocrData) {
    // Implementation for pattern extraction
    return [];
  }

  getSupplierPatterns(supplier) {
    // Implementation for supplier pattern retrieval
    return {};
  }

  estimateCompletionTime(passport) {
    // Implementation for completion time estimation
    const averageProcessingTimes = {
      'intake': 30,      // seconds
      'identification': 60,
      'extraction': 120,
      'processing': 300,
      'integration': 60
    };
    
    return averageProcessingTimes[passport.current_phase] || 60;
  }

  getNextActions(passport) {
    // Implementation for next action recommendations
    const nextActions = {
      'intake': ['Document validation', 'OCR processing'],
      'identification': ['Supplier pattern matching', 'Confidence scoring'],
      'extraction': ['Field extraction', 'Data validation'],
      'processing': ['Business logic application', 'System integration'],
      'integration': ['Final validation', 'Archive preparation']
    };
    
    return nextActions[passport.current_phase] || [];
  }
}

module.exports = DocumentBridgeService;
