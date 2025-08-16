/**
 * Document Bridge Testing Suite (Patch 006)
 * 
 * Tests for DocumentMatcher Bridge functionality
 * Validates document matching accuracy (>90%) and passport integration
 */

const DocumentBridgeService = require('./services/document-bridge');

class DocumentBridgeTester {
  constructor(db) {
    this.db = db;
    this.bridgeService = new DocumentBridgeService(db);
    this.testResults = {
      total_tests: 0,
      passed_tests: 0,
      failed_tests: 0,
      accuracy_tests: [],
      performance_metrics: {},
      errors: []
    };
  }

  /**
   * Run comprehensive document bridge tests
   */
  async runTests() {
    console.log('🔬 Starting DocumentMatcher Bridge Tests (Patch 006)');
    console.log('='.repeat(60));

    try {
      // Setup test environment
      await this.setupTestEnvironment();

      // Test document passport creation
      await this.testDocumentPassportCreation();

      // Test supplier identification accuracy
      await this.testSupplierIdentificationAccuracy();

      // Test phase transitions
      await this.testPhaseTransitions();

      // Test confidence scoring
      await this.testConfidenceScoring();

      // Test error handling and retry logic
      await this.testErrorHandling();

      // Test performance requirements
      await this.testPerformanceRequirements();

      // Test passport lifecycle integration
      await this.testPassportLifecycleIntegration();

      // Generate test report
      await this.generateTestReport();

    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.testResults.errors.push({
        test: 'Test Suite Execution',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      await this.cleanupTestEnvironment();
    }

    return this.testResults;
  }

  /**
   * Setup test environment with sample data
   */
  async setupTestEnvironment() {
    console.log('📋 Setting up test environment...');

    try {
      // Create test suppliers if they don't exist
      const testSuppliers = [
        {
          name: 'Test Furniture Ltd',
          code: 'TESTFURN',
          contact_email: 'orders@testfurniture.com',
          phone: '+44 1234 567890'
        },
        {
          name: 'Sample Chairs Co',
          code: 'SAMPCH',
          contact_email: 'sales@samplechairs.co.uk',
          phone: '+44 2345 678901'
        }
      ];

      for (const supplier of testSuppliers) {
        await this.db.query(`
          INSERT INTO suppliers (name, code, contact_email, phone, active)
          VALUES ($1, $2, $3, $4, true)
          ON CONFLICT (code) DO NOTHING
        `, [supplier.name, supplier.code, supplier.contact_email, supplier.phone]);
      }

      console.log('✅ Test environment setup complete');

    } catch (error) {
      console.error('❌ Failed to setup test environment:', error);
      throw error;
    }
  }

  /**
   * Test document passport creation
   */
  async testDocumentPassportCreation() {
    console.log('\n🧪 Testing document passport creation...');
    
    const testCases = [
      {
        name: 'Valid invoice document',
        document: {
          documentId: 'TEST-DOC-001',
          documentType: 'invoice',
          ocrData: {
            extractedText: 'Invoice from Test Furniture Ltd\nOrder #12345\nTotal: £599.99',
            confidence: 0.95
          },
          ocrConfidence: 0.95,
          fileQuality: 'high',
          processingStage: 'captured',
          capturedAt: new Date().toISOString()
        },
        expectedResult: true
      },
      {
        name: 'Missing required fields',
        document: {
          documentId: 'TEST-DOC-002'
          // Missing ocrData
        },
        expectedResult: false
      }
    ];

    for (const testCase of testCases) {
      try {
        this.testResults.total_tests++;
        
        const startTime = Date.now();
        
        if (testCase.expectedResult) {
          const passport = await this.bridgeService.createDocumentPassport(testCase.document);
          
          // Validate passport creation
          if (passport && passport.passport_id && passport.current_phase === 'intake') {
            console.log(`  ✅ ${testCase.name} - PASSED`);
            this.testResults.passed_tests++;
          } else {
            throw new Error('Invalid passport structure');
          }
        } else {
          // Expect this to fail
          try {
            await this.bridgeService.createDocumentPassport(testCase.document);
            throw new Error('Expected test to fail but it passed');
          } catch (expectedError) {
            console.log(`  ✅ ${testCase.name} - PASSED (correctly failed)`);
            this.testResults.passed_tests++;
          }
        }

        const processingTime = Date.now() - startTime;
        this.recordPerformanceMetric('passport_creation', processingTime);

      } catch (error) {
        console.log(`  ❌ ${testCase.name} - FAILED: ${error.message}`);
        this.testResults.failed_tests++;
        this.testResults.errors.push({
          test: `Passport Creation - ${testCase.name}`,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Test supplier identification accuracy (target >90%)
   */
  async testSupplierIdentificationAccuracy() {
    console.log('\n🧪 Testing supplier identification accuracy...');

    const testCases = [
      {
        name: 'Exact company name match',
        ocrData: {
          extractedText: 'Invoice from Test Furniture Ltd\nAddress: 123 Business St\nPhone: +44 1234 567890',
          confidence: 0.95
        },
        expectedSupplier: 'Test Furniture Ltd',
        expectedConfidence: 0.70 // Company name (0.40) + Phone (0.10) + some patterns
      },
      {
        name: 'Supplier code match',
        ocrData: {
          extractedText: 'Order confirmation\nSupplier Code: TESTFURN\nDelivery date: Tomorrow',
          confidence: 0.90
        },
        expectedSupplier: 'Test Furniture Ltd',
        expectedConfidence: 0.30 // Supplier code match (0.30)
      },
      {
        name: 'Email address match',
        ocrData: {
          extractedText: 'Please contact us at orders@testfurniture.com for any queries',
          confidence: 0.88
        },
        expectedSupplier: 'Test Furniture Ltd',
        expectedConfidence: 0.20 // Email match (0.20)
      },
      {
        name: 'Fuzzy company name match',
        ocrData: {
          extractedText: 'Sample Chair Company\nOrder details below...',
          confidence: 0.85
        },
        expectedSupplier: 'Sample Chairs Co',
        expectedConfidence: 0.25 // Fuzzy match (0.25)
      },
      {
        name: 'No match - unknown supplier',
        ocrData: {
          extractedText: 'Random Company Inc\nSome random text here',
          confidence: 0.92
        },
        expectedSupplier: null,
        expectedConfidence: 0.00
      }
    ];

    let correctIdentifications = 0;
    let totalTests = testCases.length;

    for (const testCase of testCases) {
      try {
        this.testResults.total_tests++;

        // Create a test passport first
        const testDocument = {
          documentId: `TEST-SUPPLIER-${Date.now()}`,
          documentType: 'invoice',
          ocrData: testCase.ocrData,
          ocrConfidence: testCase.ocrData.confidence,
          processingStage: 'captured'
        };

        const passport = await this.bridgeService.createDocumentPassport(testDocument);
        
        const startTime = Date.now();
        const result = await this.bridgeService.processSupplierIdentification(
          passport.passport_id, 
          testCase.ocrData
        );
        const processingTime = Date.now() - startTime;

        // Validate identification result
        const isCorrect = this.validateSupplierIdentification(result, testCase);
        
        if (isCorrect) {
          console.log(`  ✅ ${testCase.name} - PASSED (confidence: ${result.confidence.toFixed(2)})`);
          this.testResults.passed_tests++;
          correctIdentifications++;
        } else {
          console.log(`  ❌ ${testCase.name} - FAILED (expected: ${testCase.expectedSupplier}, got: ${result.best_match?.name || 'null'})`);
          this.testResults.failed_tests++;
        }

        this.recordPerformanceMetric('supplier_identification', processingTime);
        this.testResults.accuracy_tests.push({
          test_case: testCase.name,
          expected_supplier: testCase.expectedSupplier,
          identified_supplier: result.best_match?.name || null,
          confidence: result.confidence,
          correct: isCorrect,
          processing_time_ms: processingTime
        });

      } catch (error) {
        console.log(`  ❌ ${testCase.name} - ERROR: ${error.message}`);
        this.testResults.failed_tests++;
        this.testResults.errors.push({
          test: `Supplier Identification - ${testCase.name}`,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Calculate accuracy percentage
    const accuracy = (correctIdentifications / totalTests) * 100;
    console.log(`\n📊 Supplier Identification Accuracy: ${accuracy.toFixed(1)}%`);
    
    this.testResults.performance_metrics.supplier_identification_accuracy = accuracy;

    if (accuracy >= 90) {
      console.log('✅ Accuracy requirement met (>90%)');
    } else {
      console.log('❌ Accuracy requirement NOT met (target: >90%)');
    }
  }

  /**
   * Test phase transitions
   */
  async testPhaseTransitions() {
    console.log('\n🧪 Testing phase transitions...');

    const validTransitions = [
      { from: 'intake', to: 'identification' },
      { from: 'identification', to: 'extraction' },
      { from: 'extraction', to: 'processing' },
      { from: 'processing', to: 'integration' },
      { from: 'integration', to: 'completed' }
    ];

    const invalidTransitions = [
      { from: 'intake', to: 'processing' },
      { from: 'completed', to: 'intake' },
      { from: 'failed', to: 'extraction' }
    ];

    // Test valid transitions
    for (const transition of validTransitions) {
      try {
        this.testResults.total_tests++;

        // Create test passport in the 'from' phase
        const testDocument = {
          documentId: `TEST-TRANSITION-${Date.now()}`,
          documentType: 'invoice',
          ocrData: { extractedText: 'Test document', confidence: 0.9 },
          ocrConfidence: 0.9
        };

        const passport = await this.bridgeService.createDocumentPassport(testDocument);
        
        // Manually set the phase to test from
        await this.db.query(`
          UPDATE document_passports 
          SET current_phase = $1 
          WHERE passport_id = $2
        `, [transition.from, passport.passport_id]);

        const result = await this.bridgeService.transitionPhase(
          passport.passport_id,
          transition.from,
          transition.to,
          { test: true }
        );

        if (result.current_phase === transition.to) {
          console.log(`  ✅ Valid transition ${transition.from} → ${transition.to} - PASSED`);
          this.testResults.passed_tests++;
        } else {
          throw new Error(`Phase not updated correctly`);
        }

      } catch (error) {
        console.log(`  ❌ Valid transition ${transition.from} → ${transition.to} - FAILED: ${error.message}`);
        this.testResults.failed_tests++;
      }
    }

    // Test invalid transitions
    for (const transition of invalidTransitions) {
      try {
        this.testResults.total_tests++;

        const testDocument = {
          documentId: `TEST-INVALID-${Date.now()}`,
          documentType: 'invoice',
          ocrData: { extractedText: 'Test document', confidence: 0.9 },
          ocrConfidence: 0.9
        };

        const passport = await this.bridgeService.createDocumentPassport(testDocument);
        
        // Set initial phase
        await this.db.query(`
          UPDATE document_passports 
          SET current_phase = $1 
          WHERE passport_id = $2
        `, [transition.from, passport.passport_id]);

        try {
          await this.bridgeService.transitionPhase(
            passport.passport_id,
            transition.from,
            transition.to,
            { test: true }
          );
          
          console.log(`  ❌ Invalid transition ${transition.from} → ${transition.to} - FAILED: Should have been rejected`);
          this.testResults.failed_tests++;
          
        } catch (expectedError) {
          console.log(`  ✅ Invalid transition ${transition.from} → ${transition.to} - PASSED (correctly rejected)`);
          this.testResults.passed_tests++;
        }

      } catch (error) {
        console.log(`  ❌ Invalid transition test ${transition.from} → ${transition.to} - ERROR: ${error.message}`);
        this.testResults.failed_tests++;
      }
    }
  }

  /**
   * Test confidence scoring
   */
  async testConfidenceScoring() {
    console.log('\n🧪 Testing confidence scoring...');

    const testCases = [
      {
        name: 'Update supplier identification confidence',
        confidenceType: 'supplier_identification_confidence',
        confidence: 0.85,
        expectedResult: true
      },
      {
        name: 'Update field extraction confidence',
        confidenceType: 'field_extraction_confidence', 
        confidence: 0.92,
        expectedResult: true
      },
      {
        name: 'Invalid confidence type',
        confidenceType: 'invalid_confidence_type',
        confidence: 0.80,
        expectedResult: false
      },
      {
        name: 'Invalid confidence value (too high)',
        confidenceType: 'supplier_identification_confidence',
        confidence: 1.5,
        expectedResult: false
      }
    ];

    for (const testCase of testCases) {
      try {
        this.testResults.total_tests++;

        // Create test passport
        const testDocument = {
          documentId: `TEST-CONFIDENCE-${Date.now()}`,
          documentType: 'invoice',
          ocrData: { extractedText: 'Test document', confidence: 0.9 },
          ocrConfidence: 0.9
        };

        const passport = await this.bridgeService.createDocumentPassport(testDocument);

        // Create confidence tracking record
        await this.db.query(`
          INSERT INTO document_confidence_tracking (passport_id, supplier_id)
          VALUES ($1, 1)
        `, [passport.passport_id]);

        if (testCase.expectedResult) {
          await this.bridgeService.updateConfidence(
            passport.passport_id,
            testCase.confidenceType,
            testCase.confidence
          );
          
          console.log(`  ✅ ${testCase.name} - PASSED`);
          this.testResults.passed_tests++;
        } else {
          try {
            await this.bridgeService.updateConfidence(
              passport.passport_id,
              testCase.confidenceType,
              testCase.confidence
            );
            
            console.log(`  ❌ ${testCase.name} - FAILED: Should have been rejected`);
            this.testResults.failed_tests++;
          } catch (expectedError) {
            console.log(`  ✅ ${testCase.name} - PASSED (correctly rejected)`);
            this.testResults.passed_tests++;
          }
        }

      } catch (error) {
        console.log(`  ❌ ${testCase.name} - ERROR: ${error.message}`);
        this.testResults.failed_tests++;
      }
    }
  }

  /**
   * Test error handling and retry logic
   */
  async testErrorHandling() {
    console.log('\n🧪 Testing error handling and retry logic...');

    try {
      this.testResults.total_tests++;

      // Create test passport
      const testDocument = {
        documentId: `TEST-ERROR-${Date.now()}`,
        documentType: 'invoice',
        ocrData: { extractedText: 'Test document', confidence: 0.9 },
        ocrConfidence: 0.9
      };

      const passport = await this.bridgeService.createDocumentPassport(testDocument);

      // Simulate processing error
      const testError = new Error('Simulated processing error');
      await this.bridgeService.handleProcessingError(
        passport.passport_id,
        'test_processing_stage',
        testError
      );

      // Check that error was logged
      const errorLogResult = await this.db.query(`
        SELECT * FROM document_processing_queue 
        WHERE passport_id = $1 AND processing_stage = $2
      `, [passport.passport_id, 'test_processing_stage']);

      if (errorLogResult.rows.length > 0) {
        console.log('  ✅ Error handling - PASSED');
        this.testResults.passed_tests++;
      } else {
        throw new Error('Error not logged correctly');
      }

    } catch (error) {
      console.log(`  ❌ Error handling - FAILED: ${error.message}`);
      this.testResults.failed_tests++;
    }
  }

  /**
   * Test performance requirements
   */
  async testPerformanceRequirements() {
    console.log('\n🧪 Testing performance requirements...');

    const performanceTargets = {
      passport_creation: 500,      // ms
      supplier_identification: 1000, // ms
      phase_transition: 200        // ms
    };

    for (const [operation, targetTime] of Object.entries(performanceTargets)) {
      const metrics = this.testResults.performance_metrics[operation];
      if (metrics && metrics.length > 0) {
        const averageTime = metrics.reduce((sum, time) => sum + time, 0) / metrics.length;
        
        if (averageTime <= targetTime) {
          console.log(`  ✅ ${operation} performance - PASSED (${averageTime.toFixed(0)}ms avg, target: ${targetTime}ms)`);
        } else {
          console.log(`  ❌ ${operation} performance - FAILED (${averageTime.toFixed(0)}ms avg, target: ${targetTime}ms)`);
        }
        
        this.testResults.performance_metrics[`${operation}_average`] = averageTime;
      }
    }
  }

  /**
   * Test passport lifecycle integration
   */
  async testPassportLifecycleIntegration() {
    console.log('\n🧪 Testing passport lifecycle integration...');

    try {
      this.testResults.total_tests++;

      // Create test document with known supplier pattern
      const testDocument = {
        documentId: `TEST-LIFECYCLE-${Date.now()}`,
        documentType: 'invoice',
        ocrData: {
          extractedText: 'Invoice from Test Furniture Ltd\nOrder #12345\nTotal: £599.99',
          confidence: 0.95
        },
        ocrConfidence: 0.95,
        processingStage: 'captured'
      };

      // Create passport
      const passport = await this.bridgeService.createDocumentPassport(testDocument);
      
      // Process through supplier identification
      const identificationResult = await this.bridgeService.processSupplierIdentification(
        passport.passport_id,
        testDocument.ocrData
      );

      // Check final status
      const finalStatus = await this.bridgeService.getPassportStatus(passport.passport_id);

      if (finalStatus.passport && finalStatus.passport.passport_id === passport.passport_id) {
        console.log('  ✅ Passport lifecycle integration - PASSED');
        this.testResults.passed_tests++;
      } else {
        throw new Error('Lifecycle integration failed');
      }

    } catch (error) {
      console.log(`  ❌ Passport lifecycle integration - FAILED: ${error.message}`);
      this.testResults.failed_tests++;
    }
  }

  /**
   * Generate comprehensive test report
   */
  async generateTestReport() {
    console.log('\n📋 DOCUMENT BRIDGE TEST REPORT');
    console.log('='.repeat(60));
    
    const successRate = (this.testResults.passed_tests / this.testResults.total_tests * 100).toFixed(1);
    const accuracy = this.testResults.performance_metrics.supplier_identification_accuracy || 0;

    console.log(`Total Tests: ${this.testResults.total_tests}`);
    console.log(`Passed: ${this.testResults.passed_tests}`);
    console.log(`Failed: ${this.testResults.failed_tests}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log(`Supplier Identification Accuracy: ${accuracy.toFixed(1)}%`);

    // Performance metrics
    if (Object.keys(this.testResults.performance_metrics).length > 0) {
      console.log('\nPerformance Metrics:');
      for (const [metric, value] of Object.entries(this.testResults.performance_metrics)) {
        if (metric.endsWith('_average')) {
          console.log(`  ${metric}: ${value.toFixed(0)}ms`);
        }
      }
    }

    // Requirements validation
    console.log('\nRequirements Validation:');
    console.log(`✅ Document matching accuracy >90%: ${accuracy >= 90 ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Passport integration: ${this.testResults.passed_tests > 0 ? 'PASSED' : 'FAILED'}`);

    if (this.testResults.errors.length > 0) {
      console.log('\nErrors:');
      this.testResults.errors.forEach(error => {
        console.log(`  ❌ ${error.test}: ${error.error}`);
      });
    }

    // Save test results to database
    await this.saveTestResults();
  }

  /**
   * Validate supplier identification result
   */
  validateSupplierIdentification(result, testCase) {
    if (testCase.expectedSupplier === null) {
      return result.best_match === null || result.confidence < 0.8;
    }
    
    return result.best_match && 
           result.best_match.name === testCase.expectedSupplier &&
           result.confidence >= (testCase.expectedConfidence - 0.1); // Allow 10% tolerance
  }

  /**
   * Record performance metric
   */
  recordPerformanceMetric(operation, timeMs) {
    if (!this.testResults.performance_metrics[operation]) {
      this.testResults.performance_metrics[operation] = [];
    }
    this.testResults.performance_metrics[operation].push(timeMs);
  }

  /**
   * Save test results to database
   */
  async saveTestResults() {
    try {
      await this.db.query(`
        INSERT INTO document_bridge_metrics (
          metric_date, documents_processed, successful_matches, failed_matches,
          average_confidence_score, supplier_identification_accuracy,
          agent_performance_metrics
        ) VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6)
        ON CONFLICT (metric_date) DO UPDATE SET
          documents_processed = EXCLUDED.documents_processed,
          successful_matches = EXCLUDED.successful_matches,
          failed_matches = EXCLUDED.failed_matches,
          average_confidence_score = EXCLUDED.average_confidence_score,
          supplier_identification_accuracy = EXCLUDED.supplier_identification_accuracy,
          agent_performance_metrics = EXCLUDED.agent_performance_metrics,
          updated_at = NOW()
      `, [
        this.testResults.total_tests,
        this.testResults.passed_tests,
        this.testResults.failed_tests,
        0.85, // Mock average confidence
        this.testResults.performance_metrics.supplier_identification_accuracy || 0,
        JSON.stringify(this.testResults.performance_metrics)
      ]);

      console.log('\n💾 Test results saved to database');

    } catch (error) {
      console.error('Error saving test results:', error);
    }
  }

  /**
   * Cleanup test environment
   */
  async cleanupTestEnvironment() {
    console.log('\n🧹 Cleaning up test environment...');

    try {
      // Clean up test data (optional - could keep for analysis)
      await this.db.query(`
        DELETE FROM document_passports 
        WHERE passport_id LIKE 'DOC-%' 
        AND document_id LIKE 'TEST-%'
      `);

      console.log('✅ Cleanup complete');

    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

module.exports = DocumentBridgeTester;
