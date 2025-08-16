/**
 * DocumentMatcher Bridge Index (Patch 006)
 * 
 * Main entry point for the DocumentMatcher Bridge system
 * Agent Owner: Janus
 */

const DocumentBridgeService = require('../services/document-bridge');
const DocumentBridgeTester = require('../test-document-bridge');

class DocumentBridge {
  constructor(db) {
    this.db = db;
    this.service = new DocumentBridgeService(db);
    this.tester = new DocumentBridgeTester(db);
    this.initialized = false;
  }

  /**
   * Initialize the document bridge system
   */
  async initialize() {
    try {
      console.log('🔗 Initializing DocumentMatcher Bridge (Patch 006)...');

      // Apply database schema
      await this.applySchema();

      // Verify system health
      await this.healthCheck();

      this.initialized = true;
      console.log('✅ DocumentMatcher Bridge initialized successfully');

      return {
        success: true,
        message: 'DocumentMatcher Bridge initialized',
        version: '1.0.0',
        agent_owner: 'Janus'
      };

    } catch (error) {
      console.error('❌ Failed to initialize DocumentMatcher Bridge:', error);
      throw error;
    }
  }

  /**
   * Apply database schema for document bridge
   */
  async applySchema() {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const schemaPath = path.join(__dirname, '..', 'document-bridge-schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      await this.db.query(schema);
      console.log('📋 Document bridge schema applied');

    } catch (error) {
      console.error('❌ Failed to apply schema:', error);
      throw error;
    }
  }

  /**
   * Health check for document bridge system
   */
  async healthCheck() {
    try {
      // Check database connectivity
      await this.db.query('SELECT 1');

      // Check required tables exist
      const tables = [
        'document_passports',
        'document_processing_queue', 
        'document_confidence_tracking',
        'agent_communication_log',
        'morpheus_document_bridge',
        'document_bridge_metrics'
      ];

      for (const table of tables) {
        const result = await this.db.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = $1
          )
        `, [table]);

        if (!result.rows[0].exists) {
          throw new Error(`Required table ${table} does not exist`);
        }
      }

      console.log('🏥 Document bridge health check passed');

    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  }

  /**
   * Run document bridge tests
   */
  async runTests() {
    if (!this.initialized) {
      await this.initialize();
    }

    return await this.tester.runTests();
  }

  /**
   * Get bridge service instance
   */
  getService() {
    if (!this.initialized) {
      throw new Error('DocumentMatcher Bridge not initialized');
    }
    return this.service;
  }

  /**
   * Get system statistics
   */
  async getStats() {
    try {
      const stats = await this.db.query(`
        SELECT 
          COUNT(*) as total_passports,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
          AVG(confidence_score) as average_confidence
        FROM document_passports
      `);

      const queueStats = await this.db.query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM document_processing_queue
        GROUP BY status
      `);

      return {
        passports: stats.rows[0],
        queue: queueStats.rows,
        last_updated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error getting bridge stats:', error);
      throw error;
    }
  }

  /**
   * Morpheus integration handler
   */
  async handleMorpheusDocument(morpheusPayload) {
    try {
      if (!this.initialized) {
        throw new Error('DocumentMatcher Bridge not initialized');
      }

      // Create document passport from Morpheus data
      const passport = await this.service.createDocumentPassport(morpheusPayload);

      // Process supplier identification
      if (morpheusPayload.ocrData) {
        const identificationResult = await this.service.processSupplierIdentification(
          passport.passport_id,
          morpheusPayload.ocrData
        );

        return {
          success: true,
          passport_id: passport.passport_id,
          identification_result: identificationResult,
          next_phase: passport.current_phase
        };
      }

      return {
        success: true,
        passport_id: passport.passport_id,
        current_phase: passport.current_phase
      };

    } catch (error) {
      console.error('Error handling Morpheus document:', error);
      throw error;
    }
  }
}

module.exports = DocumentBridge;
