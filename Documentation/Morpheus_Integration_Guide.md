# Morpheus Integration Guide (CRITICAL)

## Navigation
- For system overview: [MercuryOne_System_Overview.md](../Overviews/MercuryOne_System_Overview.md)
- For agents/protocol: [MercuryOne_Agent_Protocol.md](../Architecture/MercuryOne_Agent_Protocol.md)
- For business logic: [MercuryOne_Core_Business_Logic.md](../Business_Logic/MercuryOne_Core_Business_Logic.md)
- For suppliers: [MercuryOne_Supplier_Architecture_Guide.md](../Suppliers/MercuryOne_Supplier_Architecture_Guide.md)
- For roadmaps: [MercuryOne_Development_Roadmap.csv](../Roadmaps/MercuryOne_Development_Roadmap.csv)
- For compliance: [MercuryOne_UK_Compliance_Guide.md](../Compliance/MercuryOne_UK_Compliance_Guide.md)

---

**Version**: 6.0 CONSOLIDATED INTEGRATION GUIDE
**Date**: August 11, 2025
**Status**: ✅ PRODUCTION READY - Consolidated from MORPHEUS_INTEGRATION_COMPLETE.md, API_AUTHENTICATION_SPEC.md, and MORPHEUS_REQUIREMENTS.md
**Architecture**: Google Pub/Sub asynchronous message-based communication

---

## 🔐 AUTHENTICATION & CONFIGURATION

### Google Pub/Sub Setup
**Required Environment Variables**:
```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Pub/Sub Topic Configuration
MORPHEUS_TOPIC=morpheus-document-processing
MERCURYONE_TOPIC=mercuryone-business-events
SHARED_TOPIC=cross-system-communications

# Subscription Configuration
MORPHEUS_SUBSCRIPTION=morpheus-processing-sub
MERCURYONE_SUBSCRIPTION=mercuryone-events-sub

# Authentication Tokens
MORPHEUS_API_TOKEN=your-morpheus-api-token
MERCURYONE_API_TOKEN=your-mercuryone-api-token
INTER_SYSTEM_SHARED_SECRET=your-shared-secret
```

### Service Account Permissions
**Required IAM Roles**:
- `pubsub.publisher` - For publishing messages to topics
- `pubsub.subscriber` - For subscribing to message streams  
- `pubsub.editor` - For topic and subscription management
- `monitoring.metricWriter` - For performance monitoring

### Authentication Flow
```typescript
interface AuthenticationContext {
  systemId: 'morpheus' | 'mercuryone';
  sessionToken: string;
  apiKey: string;
  permissions: Permission[];
  expiresAt: Date;
  refreshToken?: string;
}

interface CrossSystemAuth {
  sourceSystem: string;
  targetSystem: string;
  sharedSecret: string;
  messageSignature: string;
  timestamp: Date;
  nonce: string;
}
```

---

## 🚀 PUB/SUB INTEGRATION ARCHITECTURE

### Message Flow Architecture
**Asynchronous Event-Driven Communication**: All inter-system communication via Google Pub/Sub

#### Core Communication Patterns
1. **Document Processing Events**: Morpheus → MercuryOne
2. **Business Status Updates**: MercuryOne → Morpheus  
3. **Cross-System Notifications**: Bidirectional
4. **Agent Communication**: Through dedicated channels

### Topic Configuration
```typescript
interface PubSubTopicConfig {
  topics: {
    documentProcessing: {
      name: "morpheus-document-processing";
      description: "Document capture and OCR events";
      publishers: ["morpheus"];
      subscribers: ["mercuryone"];
    };
    businessEvents: {
      name: "mercuryone-business-events";
      description: "Business process status updates";
      publishers: ["mercuryone"];  
      subscribers: ["morpheus"];
    };
    crossSystemComms: {
      name: "cross-system-communications";
      description: "Shared notifications and alerts";
      publishers: ["morpheus", "mercuryone"];
      subscribers: ["morpheus", "mercuryone"];
    };
  };
}
```

### Message Schema Definitions
```typescript
interface DocumentProcessingMessage {
  messageId: string;
  sourceSystem: "morpheus";
  targetSystem: "mercuryone";
  eventType: "document_captured" | "ocr_completed" | "processing_failed";
  timestamp: Date;
  payload: {
    documentId: string;
    documentType: "invoice" | "order" | "statement" | "receipt";
    supplierId?: string;
    ocrData: OCRExtractionResult;
    metadata: DocumentMetadata;
    processingStatus: ProcessingStatus;
  };
  authentication: MessageAuthentication;
}

interface BusinessEventMessage {
  messageId: string;
  sourceSystem: "mercuryone";
  targetSystem: "morpheus";
  eventType: "order_created" | "customer_updated" | "processing_complete";
  timestamp: Date;
  payload: {
    businessObjectId: string;
    businessObjectType: string;
    status: BusinessStatus;
    relatedDocuments: string[];
    customerImpact: CustomerImpactData;
  };
  authentication: MessageAuthentication;
}
```

## 📱 MORPHEUS MOBILE WEB INTEGRATION

### Document Capture Integration
**Purpose**: Seamless mobile document capture with real-time processing feedback

#### Camera Integration
```typescript
interface DocumentCapture {
  captureSettings: {
    resolution: 'high' | 'medium' | 'auto';
    format: 'pdf' | 'jpg' | 'png';
    compression: number;
    multiPage: boolean;
  };
  processing: {
    ocrEngine: 'google' | 'aws' | 'azure';
    languageDetection: boolean;
    confidenceThreshold: number;
    autoRotation: boolean;
  };
  integration: {
    pubsubTopic: string;
    messageFormat: 'json' | 'protobuf';
    reliability: 'at_least_once' | 'exactly_once';
  };
}
```

#### Real-Time Processing Feedback
```typescript
interface ProcessingFeedback {
  documentId: string;
  processingStage: 'capture' | 'ocr' | 'validation' | 'business_processing';
  status: 'in_progress' | 'completed' | 'failed';
  progress: {
    currentStep: number;
    totalSteps: number;
    estimatedCompletion: Date;
  };
  results: {
    ocrConfidence: number;
    supplierIdentified: boolean;
    dataExtractionSuccess: boolean;
    validationPassed: boolean;
  };
}
```

### Mobile Agent Architecture
**3 Dedicated Morpheus Agents**: Specialized for mobile document processing

#### **Iris Agent - Document Capture Specialist**
```typescript
interface IrisCapabilities {
  documentCapture: {
    cameraOptimization: boolean;
    autoFocus: boolean;
    edgeDetection: boolean;
    lightingAdjustment: boolean;
  };
  qualityAssurance: {
    blurDetection: boolean;
    contrastValidation: boolean;
    resolutionCheck: boolean;
    formatValidation: boolean;
  };
  integration: {
    pubsubPublishing: boolean;
    realTimeUpload: boolean;
    offlineQueuing: boolean;
    progressReporting: boolean;
  };
}
```

#### **Argus Agent - OCR Processing Specialist**  
```typescript
interface ArgusCapabilities {
  ocrProcessing: {
    multiLanguageSupport: string[]; // ['en', 'de']
    confidenceScoring: boolean;
    layoutAnalysis: boolean;
    tableExtraction: boolean;
  };
  businessIntelligence: {
    supplierIdentification: boolean;
    documentTypeDetection: boolean;
    keyFieldExtraction: boolean;
    validationRules: boolean;
  };
  integration: {
    pubsubMessaging: boolean;
    resultsCaching: boolean;
    errorHandling: boolean;
    performanceLogging: boolean;
  };
}
```

#### **Daedalus Agent - Mobile System Integration**
```typescript
interface DaedalusCapabilities {
  systemIntegration: {
    pubsubCoordination: boolean;
    messageRouting: boolean;
    errorRecovery: boolean;
    statusSynchronization: boolean;
  };
  mobileOptimization: {
    offlineSupport: boolean;
    dataCompression: boolean;
    batteryOptimization: boolean;
    networkAdaptation: boolean;
  };
  businessWorkflow: {
    workflowCoordination: boolean;
    statusReporting: boolean;
    exceptionHandling: boolean;
    performanceMonitoring: boolean;
  };
}
```

## 🔄 BUSINESS WORKFLOW INTEGRATION

### End-to-End Document Processing
**Complete Workflow**: Mobile Capture → OCR Processing → Business Integration → Customer Communication

#### Processing Pipeline
1. **Mobile Capture** (Morpheus - Iris)
   - Document photographed on mobile device
   - Quality validation and optimization
   - Secure upload to cloud processing

2. **OCR Processing** (Morpheus - Argus)
   - Advanced OCR with language detection
   - Supplier identification and confidence scoring
   - Data extraction with business context

3. **Cross-System Messaging** (Morpheus - Daedalus)
   - Pub/Sub message creation with authentication
   - Reliable delivery to MercuryOne system
   - Status tracking and error handling

4. **Business Processing** (MercuryOne - All Agents)
   - Document passport creation and routing
   - Business logic application and validation
   - System integration and customer updates

### Message Reliability & Error Handling
```typescript
interface MessageReliability {
  deliveryGuarantees: {
    atLeastOnce: boolean;
    exactlyOnce: boolean;
    duplicateDetection: boolean;
    orderingGuarantees: boolean;
  };
  errorHandling: {
    automaticRetry: RetryPolicy;
    deadLetterQueue: boolean;
    exponentialBackoff: boolean;
    circuitBreaker: boolean;
  };
  monitoring: {
    messageLatency: boolean;
    deliverySuccess: boolean;
    errorRates: boolean;
    systemHealth: boolean;
  };
}
```

---

## 📊 PERFORMANCE MONITORING & ANALYTICS

### Real-Time Integration Metrics
**Comprehensive Monitoring**: End-to-end performance tracking across both systems

#### Key Performance Indicators
```typescript
interface IntegrationKPIs {
  documentProcessing: {
    captureToOcrTime: number;        // Morpheus internal processing
    ocrToBusinessTime: number;       // Cross-system message delivery
    businessProcessingTime: number; // MercuryOne processing
    totalEndToEndTime: number;      // Complete workflow duration
  };
  messageReliability: {
    deliverySuccessRate: number;     // % messages delivered successfully
    averageDeliveryTime: number;     // Pub/Sub delivery latency
    errorRate: number;               // % messages requiring retry
    duplicateRate: number;           // % duplicate message detection
  };
  systemHealth: {
    morpheusUptime: number;          // Mobile system availability
    mercuryOneUptime: number;        // Business system availability
    pubsubHealth: number;            // Message system availability
    overallSystemHealth: number;     // Combined system health
  };
}
```

### Business Impact Analytics
**Operational Excellence Metrics**: Measuring business value delivery

#### Customer Experience Metrics
- **Document Processing Speed**: Average 45 seconds mobile capture to business integration
- **Processing Accuracy**: 95% success rate without manual intervention  
- **Customer Communication**: Real-time status updates via mobile and desktop
- **Error Resolution**: Automated error handling with manual escalation for complex issues

#### Business Process Improvement
- **Reduced Manual Entry**: 90% reduction in manual document data entry
- **Improved Accuracy**: 98% accuracy in document data extraction
- **Faster Processing**: 75% reduction in document processing time
- **Enhanced Visibility**: Real-time processing status across all business operations

---

## 🛠️ IMPLEMENTATION REQUIREMENTS

### Technical Prerequisites
**System Requirements**: Minimum specifications for reliable integration

#### MercuryOne Requirements
- **Database**: PostgreSQL with Pub/Sub message logging
- **Authentication**: Service account with Pub/Sub permissions
- **Networking**: Outbound HTTPS access to Google Cloud APIs
- **Storage**: Minimum 100GB for document and message archiving

#### Morpheus Requirements  
- **Mobile Platform**: React Mobile Web with offline support
- **Camera Access**: High-resolution document capture capabilities
- **Network**: 4G/5G/WiFi connectivity with offline queuing
- **Authentication**: Secure token management with renewal

### Development Roadmap Enhancements
**Missing Components**: Features requiring development for complete integration

#### High Priority Enhancements
1. **Advanced OCR Confidence Scoring**
   - **Current**: Basic OCR with success/failure status
   - **Required**: Detailed confidence scoring per field
   - **Business Impact**: Reduced manual validation requirements

2. **Multi-Document Session Management**
   - **Current**: Single document processing
   - **Required**: Batch document processing with session correlation
   - **Business Impact**: Improved efficiency for multi-page invoices

3. **Real-Time Processing Dashboard**
   - **Current**: Basic status updates
   - **Required**: Live processing dashboard with agent status
   - **Business Impact**: Enhanced operational visibility

4. **Advanced Error Recovery**
   - **Current**: Basic retry mechanisms
   - **Required**: Intelligent error categorization and recovery
   - **Business Impact**: Reduced manual intervention requirements

#### Medium Priority Enhancements
5. **Offline Processing Capabilities**
   - **Current**: Online processing only
   - **Required**: Full offline capture with sync capabilities
   - **Business Impact**: Field operation support

6. **Advanced Document Templates**
   - **Current**: Basic supplier pattern matching
   - **Required**: Machine learning-based template evolution
   - **Business Impact**: Improved processing accuracy

7. **Customer Portal Integration**
   - **Current**: Internal processing only
   - **Required**: Customer-facing status portal
   - **Business Impact**: Enhanced customer experience

8. **Advanced Analytics Dashboard**
   - **Current**: Basic performance metrics
   - **Required**: Comprehensive business intelligence
   - **Business Impact**: Data-driven business optimization

#### Integration Development Plan
**Phase 1**: Core reliability improvements (Priority 1-2)
**Phase 2**: Advanced processing features (Priority 3-4)  
**Phase 3**: Customer experience enhancements (Priority 5-6)
**Phase 4**: Business intelligence platform (Priority 7-8)

---

## 🔒 SECURITY & COMPLIANCE

### Data Protection Framework
**Comprehensive Security**: Multi-layer security across mobile and desktop platforms

#### Message Security
```typescript
interface MessageSecurity {
  encryption: {
    inTransit: "TLS 1.3";
    atRest: "AES-256";
    keyManagement: "Google Cloud KMS";
  };
  authentication: {
    messageSignature: "HMAC-SHA256";
    tokenValidation: "JWT with RSA";
    systemAuthentication: "Service Account";
  };
  compliance: {
    dataRetention: "7 years UK compliance";
    auditLogging: "Complete message audit trail";
    gdprCompliance: "Data subject rights support";
  };
}
```

#### Mobile Security
- **Device Security**: Biometric authentication for document access
- **Data Protection**: Local data encryption with automatic cleanup
- **Network Security**: Certificate pinning and request validation
- **Privacy Controls**: User consent management and data minimization

### UK GDPR Compliance Integration
**Data Subject Rights**: Complete compliance with UK data protection regulations

#### Data Processing Lawfulness
- **Legitimate Interest**: Business process automation and customer service
- **Consent Management**: Explicit consent for data processing and storage
- **Data Minimization**: Processing only necessary data for business purposes
- **Purpose Limitation**: Data used only for specified business operations

# Agent Build Guides

This section provides detailed implementation guides for Morpheus agents requiring specific build documentation, including ML pipeline specifications, configuration examples, and deployment notes.

## Daedalus Build Guide

### Overview
Daedalus handles supplier pattern learning and schema enrichment for 71+ suppliers, enabling automated document processing (e.g., price lists, invoices). This guide details the ML pipeline, configuration, and deployment for scalability, enhanced with flowcharts, API schemas, and error-handling examples per industry standards.

### Build Details
#### Core Logic
Daedalus uses a neural network (pre-trained on 22 core suppliers, extensible to 71+) for pattern recognition. It processes OCR outputs from Argus, maps document fields to schemas, and refines patterns via feedback loops.

**Pseudocode**:
```javascript
// Main pattern learning and enrichment process
function daedalusProcessDocument(ocrOutput, supplierId) {
  // Load pre-trained model and supplier schema
  const model = loadNeuralNetwork('models/supplier_patterns.pt');
  const schema = loadSupplierSchema(supplierId); // From PostgreSQL via Drizzle ORM

  // Extract features from OCR output
  const features = extractFeatures(ocrOutput); // Regex + text embeddings
  const confidenceScores = model.predict(features); // Predict field mappings

  // Validate and enrich schema
  if (confidenceScores.max() > SCHEMA_CONFIDENCE_THRESHOLD) {
    const enrichedFields = mapFieldsToSchema(features, schema, confidenceScores);
    updateSupplierSchema(supplierId, enrichedFields); // Save to DB
    publishToPubSub('daedalus_feedback', { supplierId, enrichedFields }); // Feedback to Argus/Janus
  } else {
    queueForManualReview(ocrOutput, supplierId); // Low confidence triggers review
  }

  // Train model incrementally
  if (shouldRetrain(confidenceScores)) {
    const trainingData = prepareTrainingData(ocrOutput, enrichedFields);
    model.fineTune(trainingData);
    saveModel('models/supplier_patterns.pt');
  }
}
```

#### Flowchart
Visualizes the pattern learning and feedback process.

```mermaid
graph TD
    A[Receive OCR Output from Argus] --> B[Load Neural Network Model]
    B --> C[Load Supplier Schema from DB]
    C --> D[Extract Features: Regex + Embeddings]
    D --> E[Predict Field Mappings]
    E --> F{Confidence > Threshold?}
    F -->|Yes| G[Map Fields to Schema]
    G --> H[Update Schema in DB]
    H --> I[Publish Feedback to Pub/Sub]
    F -->|No| J[Queue for Manual Review]
    E --> K{Should Retrain?}
    K -->|Yes| L[Prepare Training Data]
    L --> M[Fine-Tune Model]
    M --> N[Save Updated Model]
```

#### API Schema
Daedalus exposes a feedback endpoint for integration with Argus/Janus.

**OpenAPI Schema**:
```yaml
/daedalus/feedback:
  post:
    summary: Publish feedback for supplier pattern updates
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              supplierId:
                type: string
                example: "SUPP123"
              enrichedFields:
                type: object
                additionalProperties: true
                example: { "productCode": "PC123", "price": 99.99 }
    responses:
      '200':
        description: Feedback published successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  example: "published"
      '400':
        description: Invalid input
```

#### Error-Handling Examples
Handles low-confidence OCR results and training failures.

**Example**:
```javascript
try {
  const confidenceScores = model.predict(features);
  if (confidenceScores.max() < SCHEMA_CONFIDENCE_THRESHOLD) {
    throw new Error(`Low confidence score: ${confidenceScores.max()}`);
  }
} catch (error) {
  console.error(`Daedalus Error: ${error.message}`);
  queueForManualReview(ocrOutput, supplierId, { error: error.message });
  publishToPubSub('daedalus_error', { supplierId, error: error.message });
}

try {
  model.fineTune(trainingData);
} catch (error) {
  console.error(`Training Error: ${error.message}`);
  logTrainingFailure(supplierId, error);
  // Fallback to last stable model
  model = loadNeuralNetwork('models/supplier_patterns_backup.pt');
}
```

#### Configuration
Daedalus requires ML-specific environment variables and a `.mcp-agentrc.json` for integration settings.

**Example `.mcp-agentrc.json`**:
```json
{
  "agent": "daedalus",
  "enabled": true,
  "mlConfig": {
    "modelPath": "models/supplier_patterns.pt",
    "confidenceThreshold": 0.9,
    "retrainInterval": "24h",
    "maxTrainingSamples": 1000
  },
  "pubSub": {
    "topic": "daedalus_feedback",
    "subscription": "daedalus_inbound"
  },
  "database": {
    "schemaTable": "supplier_schemas",
    "connection": "postgresql://user:pass@localhost:5432/morpheus"
  }
}
```

#### Dependencies
- **Internal**: Argus (OCR output, Patch 003), Iris (document intake, Patch 002), MercuryOne Supplier Database (Patch 083).
- **External**: TensorFlow.js (ML model), PostgreSQL/Drizzle (schema storage), Google Pub/Sub (feedback loops).
- **Libraries**: `tesseract.js` (OCR preprocessing), `node-postgres` (DB access).

#### Deployment Notes
- **Environment**: Deploy on Google Cloud Run with GPU support for ML training. Allocate 4 vCPUs, 8GB RAM for 71+ suppliers.
- **Scaling**: Use horizontal scaling (multiple instances) for high document volumes. Configure Pub/Sub retries (Patch 070) to handle load spikes.
- **Testing**: Validate with 10+ supplier documents (e.g., multilingual German invoices). Ensure >90% field mapping accuracy per Morpheus_Integration_Guide.md.

## Argus Build Guide

### Overview
Argus processes OCR and triggers lifecycles for document automation, supporting 95% accuracy. This guide provides build details, including pseudocode, flowchart, API schema, and error-handling examples, per Patch 076.

### Build Details
#### Core Logic
Argus uses Tesseract for OCR and classifies documents to trigger lifecycles.

**Pseudocode**:
```javascript
// OCR and lifecycle trigger
function processDocument(image) {
  const ocrResult = runTesseractOCR(image); // Tesseract.js
  const documentType = classifyDocument(ocrResult); // ML-based
  const confidence = documentType.confidence;

  if (confidence > OCR_CONFIDENCE_THRESHOLD) {
    const schema = mapToSchema(ocrResult, documentType);
    triggerLifecycle(documentType, schema); // Publish to Janus
    saveOCRLog(image.id, { documentType, confidence });
    publishToPubSub('argus_result', { imageId: image.id, schema });
  } else {
    queueForManualReview(image, { reason: 'low_confidence', confidence });
  }
}
```

#### Flowchart
Visualizes the OCR and lifecycle trigger process.

```mermaid
graph TD
    A[Receive Image] --> B[Run Tesseract OCR]
    B --> C[Classify Document]
    C --> D{Confidence > Threshold?}
    D -->|Yes| E[Map to Schema]
    E --> F[Trigger Lifecycle]
    F --> G[Save OCR Log]
    G --> H[Publish Result to Pub/Sub]
    D -->|No| I[Queue for Manual Review]
```

#### API Schema
Argus exposes a document processing endpoint.

**OpenAPI Schema**:
```yaml
/argus/process:
  post:
    summary: Process document image for OCR and lifecycle trigger
    requestBody:
      content:
        multipart/form-data:
          schema:
            type: object
            properties:
              image:
                type: string
                format: binary
    responses:
      '200':
        description: Document processed
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  example: "processed"
                schema:
                  type: object
                  example: { "productCode": "PC123" }
      '400':
        description: Invalid image
```

#### Error-Handling Examples
Handles OCR failures and low-confidence results.

**Example**:
```javascript
try {
  const ocrResult = runTesseractOCR(image);
  if (!ocrResult) throw new Error('OCR processing failed');
} catch (error) {
  console.error(`Argus OCR Error: ${error.message}`);
  queueForManualReview(image, { error: error.message });
  publishToPubSub('argus_error', { imageId: image.id, error: error.message });
}

try {
  const confidence = documentType.confidence;
  if (confidence < OCR_CONFIDENCE_THRESHOLD) {
    throw new Error(`Low confidence: ${confidence}`);
  }
} catch (error) {
  console.error(`Argus Classification Error: ${error.message}`);
  queueForManualReview(image, { reason: 'low_confidence', error: error.message });
}
```

#### Configuration
Example `.mcp-agentrc.json`:

```json
{
  "agent": "argus",
  "enabled": true,
  "ocrConfig": {
    "tesseractPath": "/usr/bin/tesseract",
    "confidenceThreshold": 0.85
  },
  "pubSub": {
    "topic": "argus_result"
  }
}
```

#### Dependencies
- **Internal**: Iris (Patch 002), Janus (Patch 082), Documentation Generator (Patch 091).
- **External**: Tesseract.js (OCR), PostgreSQL/Drizzle (logs), Google Pub/Sub.
- **Libraries**: `tesseract.js`, `node-postgres`.

#### Deployment Notes
- **Environment**: Deploy on Google Cloud Run with 2 vCPUs, 4GB RAM.
- **Scaling**: Use multiple instances for high document volumes; configure Pub/Sub retries (Patch 070).
- **Testing**: Test OCR with 10+ diverse documents (e.g., faded receipts); verify >90% accuracy.

---

*Note: This consolidated integration guide provides complete specifications for Morpheus-MercuryOne integration. All implementations must follow these patterns for reliable cross-system communication. Refer to [MercuryOne_Agent_Protocol.md](../Architecture/MercuryOne_Agent_Protocol.md) for detailed agent communication specifications.*