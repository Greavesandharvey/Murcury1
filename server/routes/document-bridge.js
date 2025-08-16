/**
 * Document Bridge Routes (Patch 006)
 * 
 * API endpoints for DocumentMatcher Bridge functionality
 * Connects Morpheus document capture to MercuryOne passport system
 */

const DocumentBridgeService = require('../services/document-bridge');
const DocumentBridge = require('../document-bridge');

module.exports = (app, db) => {
  const bridgeService = new DocumentBridgeService(db);
  const documentBridge = new DocumentBridge(db);

  /**
   * POST /api/document-bridge/passport
   * Create a new document passport from Morpheus document
   */
  app.post('/api/document-bridge/passport', async (req, res) => {
    try {
      const { 
        documentId, 
        documentType, 
        ocrData, 
        ocrConfidence, 
        fileQuality,
        processingStage,
        capturedAt 
      } = req.body;

      // Validate required fields
      if (!documentId || !ocrData) {
        return res.status(400).json({
          error: 'Missing required fields: documentId, ocrData'
        });
      }

      const morpheusDocument = {
        documentId,
        documentType,
        ocrData,
        ocrConfidence,
        fileQuality,
        processingStage,
        capturedAt,
        status: 'processing'
      };

      const passport = await bridgeService.createDocumentPassport(morpheusDocument);

      res.status(201).json({
        success: true,
        passport: passport,
        message: 'Document passport created successfully'
      });

    } catch (error) {
      console.error('Error creating document passport:', error);
      res.status(500).json({
        error: 'Failed to create document passport',
        details: error.message
      });
    }
  });

  /**
   * GET /api/document-bridge/passport/:passportId
   * Get passport status and details
   */
  app.get('/api/document-bridge/passport/:passportId', async (req, res) => {
    try {
      const { passportId } = req.params;
      
      const status = await bridgeService.getPassportStatus(passportId);
      
      res.json({
        success: true,
        data: status
      });

    } catch (error) {
      console.error('Error getting passport status:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Passport not found',
          passport_id: req.params.passportId
        });
      }

      res.status(500).json({
        error: 'Failed to get passport status',
        details: error.message
      });
    }
  });

  /**
   * POST /api/document-bridge/supplier-identification
   * Process supplier identification for a document
   */
  app.post('/api/document-bridge/supplier-identification', async (req, res) => {
    try {
      const { passportId, ocrData } = req.body;

      if (!passportId || !ocrData) {
        return res.status(400).json({
          error: 'Missing required fields: passportId, ocrData'
        });
      }

      const result = await bridgeService.processSupplierIdentification(passportId, ocrData);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error processing supplier identification:', error);
      res.status(500).json({
        error: 'Failed to process supplier identification',
        details: error.message
      });
    }
  });

  /**
   * PUT /api/document-bridge/passport/:passportId/phase
   * Transition passport to next phase
   */
  app.put('/api/document-bridge/passport/:passportId/phase', async (req, res) => {
    try {
      const { passportId } = req.params;
      const { fromPhase, toPhase, context } = req.body;

      if (!fromPhase || !toPhase) {
        return res.status(400).json({
          error: 'Missing required fields: fromPhase, toPhase'
        });
      }

      const updatedPassport = await bridgeService.transitionPhase(
        passportId, 
        fromPhase, 
        toPhase, 
        context || {}
      );

      res.json({
        success: true,
        passport: updatedPassport,
        message: `Phase transitioned from ${fromPhase} to ${toPhase}`
      });

    } catch (error) {
      console.error('Error transitioning phase:', error);
      
      if (error.message.includes('Invalid phase transition')) {
        return res.status(400).json({
          error: 'Invalid phase transition',
          details: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to transition phase',
        details: error.message
      });
    }
  });

  /**
   * PUT /api/document-bridge/passport/:passportId/confidence
   * Update confidence scoring for a passport
   */
  app.put('/api/document-bridge/passport/:passportId/confidence', async (req, res) => {
    try {
      const { passportId } = req.params;
      const { confidenceType, confidence, details } = req.body;

      if (!confidenceType || confidence === undefined) {
        return res.status(400).json({
          error: 'Missing required fields: confidenceType, confidence'
        });
      }

      if (confidence < 0 || confidence > 1) {
        return res.status(400).json({
          error: 'Confidence must be between 0.00 and 1.00'
        });
      }

      await bridgeService.updateConfidence(passportId, confidenceType, confidence, details || {});

      res.json({
        success: true,
        message: `Confidence updated: ${confidenceType} = ${confidence}`
      });

    } catch (error) {
      console.error('Error updating confidence:', error);
      
      if (error.message.includes('Invalid confidence type')) {
        return res.status(400).json({
          error: 'Invalid confidence type',
          details: error.message
        });
      }

      res.status(500).json({
        error: 'Failed to update confidence',
        details: error.message
      });
    }
  });

  /**
   * GET /api/document-bridge/processing-queue
   * Get documents in processing queue
   */
  app.get('/api/document-bridge/processing-queue', async (req, res) => {
    try {
      const { agent, status, limit = 50 } = req.query;
      
      let query = `
        SELECT pq.*, p.document_type, p.current_phase, p.confidence_score,
               s.name as supplier_name
        FROM document_processing_queue pq
        JOIN document_passports p ON pq.passport_id = p.passport_id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (agent) {
        query += ` AND pq.agent_name = $${paramCount++}`;
        params.push(agent);
      }

      if (status) {
        query += ` AND pq.status = $${paramCount++}`;
        params.push(status);
      }

      query += ` ORDER BY pq.priority DESC, pq.created_at ASC LIMIT $${paramCount}`;
      params.push(limit);

      const result = await db.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });

    } catch (error) {
      console.error('Error getting processing queue:', error);
      res.status(500).json({
        error: 'Failed to get processing queue',
        details: error.message
      });
    }
  });

  /**
   * GET /api/document-bridge/metrics
   * Get document bridge performance metrics
   */
  app.get('/api/document-bridge/metrics', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      // Get recent metrics
      let query = `
        SELECT * FROM document_bridge_metrics 
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (startDate) {
        query += ` AND metric_date >= $${paramCount++}`;
        params.push(startDate);
      }

      if (endDate) {
        query += ` AND metric_date <= $${paramCount++}`;
        params.push(endDate);
      }

      query += ` ORDER BY metric_date DESC LIMIT 30`;

      const metricsResult = await db.query(query, params);

      // Get current day statistics
      const currentStatsResult = await db.query(`
        SELECT 
          COUNT(*) as total_passports,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
          AVG(confidence_score) as average_confidence,
          COUNT(CASE WHEN current_phase = 'manual_review' THEN 1 END) as manual_reviews
        FROM document_passports 
        WHERE DATE(created_at) = CURRENT_DATE
      `);

      // Get processing queue statistics
      const queueStatsResult = await db.query(`
        SELECT 
          agent_name,
          COUNT(*) as queued_items,
          COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
        FROM document_processing_queue
        WHERE DATE(created_at) = CURRENT_DATE
        GROUP BY agent_name
      `);

      res.json({
        success: true,
        data: {
          historical_metrics: metricsResult.rows,
          current_stats: currentStatsResult.rows[0],
          queue_stats: queueStatsResult.rows
        }
      });

    } catch (error) {
      console.error('Error getting metrics:', error);
      res.status(500).json({
        error: 'Failed to get metrics',
        details: error.message
      });
    }
  });

  /**
   * GET /api/document-bridge/passports
   * Get list of document passports with filtering
   */
  app.get('/api/document-bridge/passports', async (req, res) => {
    try {
      const { 
        status, 
        phase, 
        supplier_id, 
        date_from, 
        date_to, 
        limit = 50, 
        offset = 0 
      } = req.query;

      let query = `
        SELECT p.*, s.name as supplier_name, s.code as supplier_code,
               mb.bridge_status, mb.ocr_confidence,
               ct.supplier_identification_confidence
        FROM document_passports p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        LEFT JOIN morpheus_document_bridge mb ON p.passport_id = mb.passport_id
        LEFT JOIN document_confidence_tracking ct ON p.passport_id = ct.passport_id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (status) {
        query += ` AND p.status = $${paramCount++}`;
        params.push(status);
      }

      if (phase) {
        query += ` AND p.current_phase = $${paramCount++}`;
        params.push(phase);
      }

      if (supplier_id) {
        query += ` AND p.supplier_id = $${paramCount++}`;
        params.push(supplier_id);
      }

      if (date_from) {
        query += ` AND p.created_at >= $${paramCount++}`;
        params.push(date_from);
      }

      if (date_to) {
        query += ` AND p.created_at <= $${paramCount++}`;
        params.push(date_to);
      }

      query += ` ORDER BY p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
      params.push(limit, offset);

      const result = await db.query(query, params);

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) FROM document_passports p WHERE 1=1
      `;
      const countParams = [];
      let countParamCount = 1;

      if (status) {
        countQuery += ` AND p.status = $${countParamCount++}`;
        countParams.push(status);
      }

      if (phase) {
        countQuery += ` AND p.current_phase = $${countParamCount++}`;
        countParams.push(phase);
      }

      if (supplier_id) {
        countQuery += ` AND p.supplier_id = $${countParamCount++}`;
        countParams.push(supplier_id);
      }

      if (date_from) {
        countQuery += ` AND p.created_at >= $${countParamCount++}`;
        countParams.push(date_from);
      }

      if (date_to) {
        countQuery += ` AND p.created_at <= $${countParamCount++}`;
        countParams.push(date_to);
      }

      const countResult = await db.query(countQuery, countParams);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          total: parseInt(countResult.rows[0].count),
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: parseInt(offset) + result.rows.length < parseInt(countResult.rows[0].count)
        }
      });

    } catch (error) {
      console.error('Error getting passports:', error);
      res.status(500).json({
        error: 'Failed to get passports',
        details: error.message
      });
    }
  });

  /**
   * POST /api/document-bridge/manual-feedback
   * Submit manual feedback for document processing improvement
   */
  app.post('/api/document-bridge/manual-feedback', async (req, res) => {
    try {
      const { 
        passportId, 
        feedbackType, 
        corrections, 
        accuracy, 
        notes 
      } = req.body;

      if (!passportId || !feedbackType) {
        return res.status(400).json({
          error: 'Missing required fields: passportId, feedbackType'
        });
      }

      // Update confidence tracking with feedback
      await db.query(`
        UPDATE document_confidence_tracking 
        SET manual_corrections = $1, accuracy_feedback = $2, feedback_notes = $3, updated_at = NOW()
        WHERE passport_id = $4
      `, [
        JSON.stringify(corrections || {}),
        accuracy,
        notes,
        passportId
      ]);

      // Log feedback event
      await bridgeService.logBusinessEvent(passportId, 'manual_feedback', {
        feedback_type: feedbackType,
        corrections: corrections,
        accuracy: accuracy,
        notes: notes
      });

      res.json({
        success: true,
        message: 'Feedback submitted successfully'
      });

    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({
        error: 'Failed to submit feedback',
        details: error.message
      });
    }
  });

  /**
   * GET /api/document-bridge/stats
   * Get bridge system statistics
   */
  app.get('/api/document-bridge/stats', async (req, res) => {
    try {
      const stats = await documentBridge.getStats();
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Error getting bridge stats:', error);
      res.status(500).json({
        error: 'Failed to get bridge stats',
        details: error.message
      });
    }
  });

  /**
   * POST /api/document-bridge/test
   * Run document bridge tests
   */
  app.post('/api/document-bridge/test', async (req, res) => {
    try {
      const testResults = await documentBridge.runTests();
      
      res.json({
        success: true,
        data: testResults,
        passed_tests: testResults.passed_tests,
        total_tests: testResults.total_tests,
        accuracy: testResults.performance_metrics.supplier_identification_accuracy
      });

    } catch (error) {
      console.error('Error running bridge tests:', error);
      res.status(500).json({
        error: 'Failed to run bridge tests',
        details: error.message
      });
    }
  });

  /**
   * POST /api/document-bridge/initialize
   * Initialize the document bridge system
   */
  app.post('/api/document-bridge/initialize', async (req, res) => {
    try {
      const result = await documentBridge.initialize();
      
      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error initializing document bridge:', error);
      res.status(500).json({
        error: 'Failed to initialize document bridge',
        details: error.message
      });
    }
  });

  /**
   * POST /api/document-bridge/morpheus-webhook
   * Webhook endpoint for Morpheus document processing
   */
  app.post('/api/document-bridge/morpheus-webhook', async (req, res) => {
    try {
      const morpheusPayload = req.body;
      
      if (!morpheusPayload.documentId) {
        return res.status(400).json({
          error: 'Missing required field: documentId'
        });
      }

      const result = await documentBridge.handleMorpheusDocument(morpheusPayload);
      
      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error handling Morpheus document:', error);
      res.status(500).json({
        error: 'Failed to handle Morpheus document',
        details: error.message
      });
    }
  });
};
