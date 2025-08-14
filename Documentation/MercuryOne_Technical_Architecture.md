# MercuryOne Technical Architecture (CRITICAL)

## Navigation
- For system overview: [MercuryOne_System_Overview.md](../Overviews/MercuryOne_System_Overview.md)
- For agents/protocol: [MercuryOne_Agent_Protocol.md](MercuryOne_Agent_Protocol.md)
- For business logic: [MercuryOne_Core_Business_Logic.md](../Business_Logic/MercuryOne_Core_Business_Logic.md)
- For suppliers: [MercuryOne_Supplier_Architecture_Guide.md](../Suppliers/MercuryOne_Supplier_Architecture_Guide.md)
- For integrations: [Morpheus_Integration_Guide.md](../Integrations/Morpheus_Integration_Guide.md)
- For roadmaps: [MercuryOne_Development_Roadmap.csv](../Roadmaps/MercuryOne_Development_Roadmap.csv)
- For compliance: [MercuryOne_UK_Compliance_Guide.md](../Compliance/MercuryOne_UK_Compliance_Guide.md)

---

**Version**: 2.0 (Post-Integration)
**Last Updated**: August 11, 2025
**Integration Status**: MercuryOne Sync Complete

---

## 🎯 System Overview

**CRITICAL PLATFORM DISTINCTION**:
- **MercuryOne**: Desktop web application for comprehensive business management and office-based operations
- **Morpheus**: Mobile web application for document capture, OCR processing, and field-based data collection

Morpheus is a mobile-first document automation platform built with cutting-edge technologies and designed for seamless integration with business management systems like MercuryOne.

### Core Philosophy
- **Invisible Technology**: Steve Jobs approach - best technology is invisible to users
- **Mobile-First**: Optimized for busy professionals on mobile devices (NOT desktop)
- **AI-Powered**: Advanced OCR and intelligent document processing
- **Agent-Based**: 14 total agents (11 MercuryOne + 3 Morpheus + Jupiter shared orchestrator) for comprehensive automation

---

## 🏛️ Architecture Layers

### 1. Presentation Layer (Mobile-First UI)
```
┌─────────────────────────────────────┐
│           Divine Theme UI           │
│  ┌─────────────┐ ┌─────────────┐   │
│  │   Mobile    │ │  Desktop    │   │
│  │  Interface  │ │  Interface  │   │
│  └─────────────┘ └─────────────┘   │
│  ┌─────────────────────────────┐   │
│  │   Real-time Status Widget  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Technologies**:
- React 18 with TypeScript
- Tailwind CSS with Divine Theme
- Radix UI components
- WebSocket real-time updates
- Mobile-optimized responsive design

### 2. Business Logic Layer (14 Total Agents)
```
┌─────────────────────────────────────┐
│         Agent Orchestration        │
│       MercuryOne Agents (11)       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │Janus│ │Juno │ │Sat. │ │Ath. │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │Vulc.│ │Herc.│ │Mars │ │Nept.│   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │Min. │ │Ap.  │ │Jup. │(shared)   │
│  └─────┘ └─────┘ └─────┘           │
│       Morpheus Agents (3)          │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │Iris │ │Argus│ │Daed.│           │
│  └─────┘ └─────┘ └─────┘           │
│      Google Pub/Sub Communication  │
└─────────────────────────────────────┘
```

**MercuryOne Agents (11)**:
- **Jupiter**: Master controller, agent orchestrator (shared)
- **Janus**: Lifecycle compliance, passport validator, audit trail enforcement
- **Juno**: Document schema validation and intake routing
- **Saturn**: Delay alerting, Slack/email notifications, agent-phase dispatches
- **Athena**: UI drift detection, GDPR enforcement, visual compliance auditing
- **Vulcan**: Auto-repair suggestions, lifecycle violation remediation
- **Hercules**: Patch validation, roadmap regression testing, README enforcement
- **Mars**: CSRF/session/OAuth enforcement, Gmail/Xero login guard, security audit
- **Neptune**: Xero ledger sync, VAT compliance validation, financial anomaly detection
- **Minerva**: Frontend crash detection, hydration issues, telemetry enrichment
- **Apollo**: CI diagnostics, API testing, external webhook validation

**Morpheus Agents (3)**:
- **Iris**: Mobile/email document intake, scan normalization, confidence scoring
- **Argus**: OCR, schema enrichment, lifecycle trigger to Janus/Saturn/Juno
- **Daedalus**: Schema memory & enrichment, supplier pattern learning, confidence mapping

### 3. Integration Layer (Google Pub/Sub Architecture)
```
┌─────────────────────────────────────┐
│    Google Pub/Sub Integration       │
│  ┌─────────────────────────────┐   │
│  │      Message Topics         │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐   │   │
│  │  │Doc. │ │Inv. │ │Prod.│   │   │
│  │  │Proc.│ │Sync │ │Upd. │   │   │
│  │  └─────┘ └─────┘ └─────┘   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │    Subscription Handler     │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Asynchronous Message Bus   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Integration Services**:
- Asynchronous document processing via Google Pub/Sub topics
- Multi-supplier price list synchronization (5 global suppliers)
- Inventory management sync with cross-supplier coordination
- Product catalogue automation with heritage/innovation positioning
- Agent-to-agent communication via message subscriptions
- Business rules processing with multi-currency support

### 4. Data Layer
```
┌─────────────────────────────────────┐
│          PostgreSQL Database        │
│  ┌─────────────┐ ┌─────────────┐   │
│  │ Documents   │ │Agent Logs   │   │
│  └─────────────┘ └─────────────┘   │
│  ┌─────────────┐ ┌─────────────┐   │
│  │OCR Results  │ │Doc Queue    │   │
│  └─────────────┘ └─────────────┘   │
│  ┌─────────────┐ ┌─────────────┐   │
│  │Schemas      │ │Confidence   │   │
│  └─────────────┘ └─────────────┘   │
└─────────────────────────────────────┘
```

**Database Schema**:
- Morpheus documents and metadata
- OCR processing results
- Agent communication logs
- Document processing queue
- Supplier schema patterns
- Confidence tracking

---

## 🔗 Integration Architecture

### MercuryOne Communication Flow
```
Morpheus Mobile App
        ↓
   Document Upload
        ↓
   Agent Processing
        ↓
   Data Extraction
        ↓
   MercuryOne API
        ↓
   Product/Inventory Update
        ↓
   Real-time Notification
        ↓
   Mobile Status Update
```

### Google Pub/Sub Messaging Architecture
```typescript
// Google Pub/Sub Topics (replacing direct API calls)
Topics:
- 'morpheus-price-list-sync'
- 'morpheus-inventory-updates'  
- 'mercuryone-status-responses'
- 'agent-communication'

// Message Format
interface PubSubMessage {
  messageId: string;
  data: string;           // Base64 encoded JSON
  attributes: {
    source: string;       // 'morpheus' | 'mercuryone'
    eventType: string;    // Message type
    agentId: string;      // Processing agent
  };
  publishTime: string;
}

// Sample Morpheus → MercuryOne Message
{
  messageId: "uuid",
  data: "base64(JSON)",
  attributes: {
    source: "morpheus",
    eventType: "sync_complete", 
    agentId: "iris"
  }
}
```

**Agent Reference**: Complete agent specifications per Critical Documentation/AGENT_COMMUNICATION_PROTOCOL.md

### WebSocket Communication
```typescript
// Agent messaging protocol
interface AgentMessage {
  source: string;      // Agent name
  target: string;      // Target agent or system
  eventType: string;   // Message type
  payload: any;        // Message data
  timestamp: Date;     // Message timestamp
  priority: string;    // Message priority
}
```

---

## 📱 Mobile Architecture

### React Mobile Web Components (NOT React Native)
**Agent Integration**: All UI components monitored by Athena (GDPR/theme compliance) and Minerva (crash detection)
```
App.tsx (Mobile Web Application)
├── Navigation/
│   ├── MobileNavigator
│   └── ResponsiveOverlay
├── Screens/
│   ├── DocumentCapture
│   ├── ProcessingStatus
│   ├── ApprovalQueue
│   └── SupplierConfig
├── Components/
│   ├── StatusWidget
│   ├── DocumentProcessor
│   └── NotificationSystem
└── Services/
    ├── PubSubClient
    ├── MessageHandler
    └── CameraService
```

### State Management
- React Query for server state
- React Context for global state
- Local storage for offline capabilities
- Google Pub/Sub subscriptions for real-time updates
- Message-based communication with MercuryOne

---

## 🔧 Backend Architecture

### Express.js Server Structure
```
server/
├── routes/
│   ├── morpheus.ts          # Core document routes
│   ├── morpheus-sync.ts     # MercuryOne sync routes
│   └── morpheus-inventory.ts # Inventory management
├── services/
│   ├── openai.ts           # AI/OCR services
│   ├── product-sync.ts     # Product synchronization
│   └── fileUpload.ts       # Document handling
├── auth/
│   └── middleware.ts       # Authentication
├── db.ts                   # Database connection
└── storage.ts              # Data layer abstraction
```

### Service Layer Pattern
```typescript
interface IStorage {
  // Document operations
  createMorpheusDocument(doc: InsertMorpheusDocument): Promise<MorpheusDocument>;
  getMorpheusDocument(id: string): Promise<MorpheusDocument | undefined>;
  
  // Agent operations
  createAgentLog(log: InsertAgentLog): Promise<AgentLog>;
  getAgentLogsByDocument(documentId: string): Promise<AgentLog[]>;
  
  // Sync operations
  createDocumentQueue(queue: InsertDocumentQueue): Promise<DocumentQueue>;
  getDocumentQueueByDocument(documentId: string): Promise<DocumentQueue[]>;
}
```

---

## 🤖 AI & OCR Pipeline

### OpenAI Integration
```typescript
// Document analysis pipeline
async function analyzeDocument(imageData: string) {
  const analysis = await openai.chat.completions.create({
    model: "gpt-4o", // Using GPT-4, NOT GPT-5 (corrected from documentation inconsistencies)
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Extract structured data..." },
        { type: "image_url", image_url: { url: imageData } }
      ]
    }],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(analysis.choices[0].message.content);
}
```

### Confidence Scoring
```typescript
interface ExtractionResult {
  data: ExtractedData;
  confidence: number;     // 0-1 confidence score
  fieldConfidence: {      // Per-field confidence
    [fieldName: string]: number;
  };
  validationResults: ValidationResult[];
}
```

---

## 🔒 Security Architecture

### Authentication Layers
```
┌─────────────────────────────────────┐
│         Security Layers             │
│  ┌─────────────────────────────┐   │
│  │      API Authentication     │   │
│  │   (X-Morpheus-API-Key)      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │    Session Management       │   │
│  │   (Express Sessions)        │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │      Rate Limiting          │   │
│  │   (100 req/min per key)     │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │      HTTPS/WSS Only         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Data Protection
- HTTPS/WSS encryption for all communication
- API key rotation and management
- Audit logging for all operations
- GDPR compliant data handling
- Input validation and sanitization

---

## 📊 Performance Architecture

### Optimization Strategies
```typescript
// Document processing optimization
interface ProcessingOptimization {
  // Parallel processing
  concurrentOCR: boolean;
  
  // Caching strategies
  schemaCache: CacheConfig;
  confidenceCache: CacheConfig;
  
  // Queue management
  priorityQueuing: boolean;
  batchProcessing: boolean;
  
  // Resource limits
  maxConcurrentDocs: number;
  timeoutLimits: TimeoutConfig;
}
```

### Monitoring & Metrics
- Document processing times
- API response times
- Agent communication latency
- Error rates and types
- Resource utilization

---

## 🔄 Real-time Communication

### WebSocket Architecture
```typescript
// WebSocket event types
type WebSocketEvent = 
  | 'document_uploaded'
  | 'ocr_complete'
  | 'validation_complete'
  | 'sync_started'
  | 'sync_complete'
  | 'error_occurred'
  | 'agent_message';

// Event handling
class WebSocketManager {
  handleAgentMessage(message: AgentMessage): void;
  broadcastStatus(status: ProcessingStatus): void;
  handleError(error: ProcessingError): void;
}
```

### Agent Communication Protocol
- Message routing between agents
- Priority-based message handling
- Error recovery and retry logic
- Performance monitoring

---

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless server design
- Database connection pooling
- Load balancer compatibility
- Microservice readiness

### Vertical Scaling
- Optimized database queries
- Efficient memory usage
- CPU-intensive task optimization
- Storage optimization

---

## 🧪 Testing Architecture

### Testing Layers
```
Unit Tests
├── Service layer tests
├── API endpoint tests
├── Agent logic tests
└── Database operation tests

Integration Tests
├── End-to-end document processing
├── MercuryOne sync validation
├── WebSocket communication
└── Error handling scenarios

Performance Tests
├── Load testing
├── Stress testing
└── Benchmark analysis
```

---

## 🚀 Deployment Architecture

### Environment Configuration
```typescript
interface EnvironmentConfig {
  // Database
  DATABASE_URL: string;
  
  // AI Services
  OPENAI_API_KEY: string;
  
  // MercuryOne Integration
  MORPHEUS_API_KEY: string;
  MERCURYONE_API_URL: string;
  
  // Security
  SESSION_SECRET: string;
  
  // Performance
  MAX_CONCURRENT_DOCS: number;
  RATE_LIMIT_REQUESTS: number;
}
```

### Production Readiness
- Environment variable management
- Health check endpoints
- Graceful shutdown handling
- Error monitoring and alerting
- Backup and recovery procedures

---

**This architecture provides a robust, scalable foundation for Morpheus document automation with seamless MercuryOne integration, supporting the dual-platform agent ecosystem (11 MercuryOne + 3 Morpheus agents) and delivering 85-90% automation of document processing workflows.**    dailyLimit: 1000        // Documents per day
  },
  status: {
    requests: 1000,         // Status checks per hour
    window: 60 * 60 * 1000  // 1 hour in milliseconds
  }
};
```

### Security Features
- **TLS 1.3**: All communications encrypted
- **JWT Validation**: Token-based authentication
- **SQL Injection Protection**: Drizzle ORM with prepared statements
- **CORS Configuration**: Restricted to authorized origins
- **Request Validation**: Zod schema validation
- **Audit Logging**: Complete operation tracking

---

## 📡 Core API Endpoints

### Document Processing Endpoints

#### Document Upload
```typescript
POST /api/morpheus/upload

// Request Body
interface DocumentUpload {
  document: File;                    // PDF/Image (max 10MB)
  documentType: 'price_list' | 'invoice' | 'purchase_order' | 'general';
  supplierName?: string;             // Optional supplier ID
  metadata: {
    confidenceThreshold: number;     // 0.0-1.0 (default: 0.8)
    manualReview: boolean;           // Force manual review
    priority: 'low' | 'normal' | 'high';
    tags?: string[];                 // Classification tags
  };
  webhook?: {
    url: string;                     // Callback URL
    events: string[];                // ['uploaded', 'processed', 'completed', 'error']
  };
}

// Response
interface UploadResponse {
  documentId: string;                // Unique identifier
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  estimatedProcessingTime: number;   // Seconds
  confidence: {
    overall: number;                 // Overall confidence score
    fields: Record<string, number>;  // Per-field confidence
  };
  webhook?: {
    subscriptionId: string;          // Webhook subscription ID
  };
}
```

### Business Data Processing Endpoints

#### Invoice Processing
```typescript
// POST /api/morpheus/invoice - Receive invoice data from Morpheus
app.post('/api/morpheus/invoice', async (req, res) => {
  // Process invoice data from Morpheus OCR
  // Update suppliers, products, expenses tables
  // Return processing status
});

// Expected Invoice Data Structure
interface InvoiceData {
  supplierName: string;
  invoiceNumber: string;
  date: string;
  totalAmount: number;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  confidence: number;
}
```

#### Purchase Order Processing  
```typescript
// POST /api/morpheus/purchase-order - Receive PO data
app.post('/api/morpheus/purchase-order', async (req, res) => {
  // Process purchase order data
  // Update orders, suppliers tables
  // Return processing status
});

// Expected PO Data Structure
interface PurchaseOrderData {
  supplierName: string;
  poNumber: string;
  orderDate: string;
  deliveryDate: string;
  items: Array<{
    sku: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  confidence: number;
}
```

#### Delivery Sheet Processing
```typescript
// POST /api/morpheus/delivery - Receive delivery sheet data
app.post('/api/morpheus/delivery', async (req, res) => {
  // Process delivery data
  // Update inventory, orders tables
  // Return processing status
});

// Expected Delivery Data Structure
interface DeliveryData {
  supplierName: string;
  deliveryDate: string;
  items: Array<{
    sku: string;
    description: string;
    quantityDelivered: number;
    condition: 'perfect' | 'damaged' | 'incomplete';
  }>;
  confidence: number;
}
```

---

## 📨 Pub/Sub Communication System

### Message Protocol
```typescript
// Standard Pub/Sub Message Structure
interface PubSubMessage {
  sourceSystem: string;              // 'morpheus' | 'mercuryone' | 'mercurydivine'
  targetSystem: string;              // Target system identifier
  dataType: string;                  // Message type classifier
  payload: any;                      // Message data
  timestamp: string;                 // ISO timestamp
  sequenceId: string;                // Message sequence identifier
  priority: 'low' | 'medium' | 'high' | 'critical';
  correlationId?: string;            // Message chain tracking
}
```

### Supported Data Types

#### Structured Business Data
```javascript
// Email processing results from Morpheus
{
  emailId: "email_12345",
  source: "morpheus",
  extractedData: {
    customerInfo: {
      name: "John Smith",
      email: "john@company.com", 
      company: "ACME Corp",
      phone: "+44 20 1234 5678"
    },
    orderInfo: {
      orderNumber: "PO-2025-001",
      amount: 1247.50,
      currency: "GBP",
      items: ["Office Chairs x5", "Desk Lamps x3"]
    },
    documentType: "purchase_order"
  },
  confidence: 0.92
}
```

#### Processing Results and Status Updates
```javascript
// MercuryOne processing results
{
  emailId: "email_12345",
  source: "mercuryone",
  processingResult: {
    success: true,
    customerCreated: true,
    orderProcessed: true,
    workflowTriggered: "order_fulfillment",
    businessValue: 1247.50,
    errors: []
  }
}
```

#### System Health and Monitoring
```javascript
// Health checks and system status
{
  systemHealth: {
    cpuUsage: 45.2,
    memoryUsage: 67.8,
    activeConnections: 12,
    processingRate: "15 emails/hour"
  },
  alerts: ["low_confidence_document", "supplier_not_found"],
  timestamp: "2025-08-04T15:30:00Z"
}
```

### Data Size Handling
- **Small messages**: Up to 10MB per message (Pub/Sub limit)
- **Large data**: Automatically split across multiple messages with chunking logic
- **Complex nested objects**: Full JSON support
- **Arrays and collections**: Unlimited size (with automatic chunking)

---

## 🔄 WebSocket Real-Time Communication

### Connection Setup
```typescript
// WebSocket connection for real-time updates
const wsUrl = `wss://your-host:3002/morpheus-agents`;
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  console.log('Connected to Morpheus agent communication');
};

ws.onmessage = (event) => {
  const agentMessage = JSON.parse(event.data);
  handleAgentCommunication(agentMessage);
};
```

### Agent Communication Protocol
```typescript
// Real-time agent messages
interface AgentMessage {
  id: string;                          // Unique message ID
  timestamp: Date;                     // Message timestamp
  sourceAgent: string;                 // Sending agent name
  targetAgent: string | string[];      // Receiving agent(s)
  eventType: string;                   // Message type/action
  payload: any;                        // Message data
  priority: 'low' | 'normal' | 'high' | 'critical';
  documentId?: string;                 // Related document ID
  correlationId?: string;              // Message chain tracking
}
```

---

## 🚦 Error Handling & Recovery

### Multi-layered Error Handling
```typescript
// Comprehensive error handling implementation
class IntegrationErrorHandler {
  async handleError(error: IntegrationError, context: RequestContext): Promise<void> {
    // Layer 1: Network level retry with exponential backoff
    if (error.type === 'network_timeout') {
      await this.retryWithExponentialBackoff(context);
      return;
    }
    
    // Layer 2: Application level data validation and sanitization
    if (error.type === 'data_validation') {
      await this.sanitizeAndRetry(context);
      return;
    }
    
    // Layer 3: System level fallback communication channels
    if (error.type === 'system_unavailable') {
      await this.activateFallbackCommunication(context);
      return;
    }
    
    // Layer 4: Escalation to human intervention
    await this.escalateToHumanReview(error, context);
  }
}
```

### Retry Logic Patterns
```typescript
// Exponential backoff retry implementation
async retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## 🔧 CORS Configuration

### Required CORS Setup
```typescript
// MercuryOne CORS configuration
app.use(cors({
  origin: [
    'https://your-morpheus-url.replit.app',
    'https://your-mercurydivine-url.replit.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Morpheus-API-Key',
    'X-Requested-With'
  ]
}));
```

### Health Check Implementation
```typescript
// Health check endpoint for integration monitoring
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    service: 'MercuryOne',
    agents: 13,
    timestamp: new Date().toISOString(),
    version: '2.0',
    connections: {
      database: 'connected',
      pubsub: 'connected',
      websocket: 'active'
    }
  });
});
```

---

## 📊 Performance Monitoring

### Key Metrics to Track
- **Response Time**: API endpoint response times
- **Data Transfer Volume**: Pub/Sub message sizes and frequencies  
- **Error Rates**: Failed requests and integration issues
- **Queue Depth**: Message processing backlogs
- **Agent Performance**: Individual agent processing metrics
- **WebSocket Connections**: Real-time connection health

### Monitoring Implementation
```typescript
// Performance metrics collection
interface PerformanceMetrics {
  responseTime: number;              // Average API response time (ms)
  throughput: number;                // Messages processed per minute
  errorRate: number;                 // Error percentage
  queueDepth: number;                // Pending messages
  memoryUsage: number;               // Memory consumption (MB)
  cpuUsage: number;                  // CPU utilization percentage
}
```

---

## 🎯 Implementation Checklist

### For MercuryOne Team
- [ ] Implement authentication with API keys and JWT
- [ ] Set up all document processing endpoints
- [ ] Configure CORS for Morpheus integration
- [ ] Implement rate limiting and security measures
- [ ] Set up Pub/Sub message handling
- [ ] Configure WebSocket for real-time communication
- [ ] Implement comprehensive error handling
- [ ] Set up performance monitoring and logging

### For Morpheus Team  
- [ ] Implement document upload to MercuryOne endpoints
- [ ] Set up Pub/Sub publishing for processed data
- [ ] Configure WebSocket agent communication
- [ ] Implement retry logic and error handling
- [ ] Set up confidence scoring and validation
- [ ] Configure webhook callbacks for status updates
- [ ] Implement health check monitoring
- [ ] Set up performance metrics collection

---

## 📚 Additional References

- **Complex Logic Patterns**: See Critical Documentation/AGENT_COMMUNICATION_PROTOCOL.md
- **Agent Specifications**: Individual agent documentation in MercuryOne Integration Package
- **Business Workflows**: See consolidated Morpheus-MercuryOne business workflow documentation
- **Testing Procedures**: See comprehensive testing documentation for validation protocols

This consolidated technical guide provides complete implementation guidance for robust, production-ready integration between Morpheus and MercuryOne systems.  };
}
```

---

## 📡 Message Protocol

### Base Message Structure
```typescript
interface WebSocketMessage {
  // Message identification
  id: string;                    // Unique message ID
  timestamp: string;             // ISO 8601 timestamp
  version: '1.0';               // Protocol version
  
  // Message routing
  type: MessageType;             // Message category
  source: string;                // Sender identification
  target?: string | string[];    // Recipient(s)
  
  // Message content
  event: string;                 // Specific event name
  payload: any;                  // Event data
  
  // Message lifecycle
  correlationId?: string;        // Related message chain
  replyTo?: string;             // Response message ID
  priority: 'low' | 'normal' | 'high' | 'critical';
}

// Message types
type MessageType = 
  | 'agent_communication'
  | 'document_status'
  | 'sync_notification'
  | 'system_health'
  | 'error_notification'
  | 'heartbeat';
```

---

## 🤖 Agent Communication Messages

### Document Processing Messages
```typescript
// Document upload notification
interface DocumentUploadMessage {
  type: 'agent_communication';
  source: 'iris_agent';
  target: 'mobile_app';
  event: 'document_received';
  payload: {
    documentId: string;
    fileName: string;
    fileSize: number;
    documentType: string;
    supplierId?: string;
    status: 'uploaded' | 'processing' | 'queued';
  };
}

// OCR processing update
interface OCRProcessingMessage {
  type: 'agent_communication';
  source: 'argus_agent';
  target: ['mobile_app', 'mercury_one'];
  event: 'ocr_processing';
  payload: {
    documentId: string;
    progress: number;              // 0-100
    stage: 'analyzing' | 'extracting' | 'validating';
    confidence?: number;           // 0-1
    extractedFields?: number;
  };
}

// Schema validation complete
interface ValidationCompleteMessage {
  type: 'agent_communication';
  source: 'daedalus_agent';
  target: 'mercury_one';
  event: 'validation_complete';
  payload: {
    documentId: string;
    supplierId: string;
    validationResults: {
      confidence: number;
      extractedData: any;
      fieldConfidence: Record<string, number>;
      businessRules: BusinessRuleResult[];
    };
    nextAction: 'sync' | 'review' | 'reject';
  };
}
```

### Sync Operation Messages
```typescript
// Price list sync initiated
interface PriceSyncMessage {
  type: 'sync_notification';
  source: 'janus_agent';
  target: 'mercury_one';
  event: 'price_sync_initiated';
  payload: {
    documentId: string;
    supplierId: string;
    itemCount: number;
    syncType: 'create' | 'update' | 'mixed';
    estimatedDuration: number;    // seconds
  };
}

// Inventory update notification
interface InventoryUpdateMessage {
  type: 'sync_notification';
  source: 'mercury_one';
  target: 'mobile_app';
  event: 'inventory_updated';
  payload: {
    supplierId: string;
    updatedItems: number;
    stockAlerts: StockAlert[];
    timestamp: string;
  };
}
```

---

## 🔄 Real-time Status Updates

### Document Processing Status
```typescript
// Processing pipeline status
interface ProcessingStatusMessage {
  type: 'document_status';
  source: 'jupiter_coordinator';
  target: 'mobile_app';
  event: 'processing_status_update';
  payload: {
    documentId: string;
    currentStage: ProcessingStage;
    stagesCompleted: ProcessingStage[];
    stagesRemaining: ProcessingStage[];
    overallProgress: number;       // 0-100
    estimatedCompletion?: string;  // ISO timestamp
    errors?: ProcessingError[];
  };
}

type ProcessingStage = 
  | 'uploaded'
  | 'queued'
  | 'ocr_processing'
  | 'schema_validation'
  | 'business_rules'
  | 'mercury_sync'
  | 'completed'
  | 'error';
```

### Sync Progress Updates
```typescript
// Real-time sync progress
interface SyncProgressMessage {
  type: 'sync_notification';
  source: 'mercury_one';
  target: 'mobile_app';
  event: 'sync_progress';
  payload: {
    documentId: string;
    syncOperation: 'price_list' | 'inventory' | 'purchase_order';
    progress: {
      total: number;
      processed: number;
      created: number;
      updated: number;
      skipped: number;
      errors: number;
    };
    currentItem?: {
      sku: string;
      name: string;
      action: 'creating' | 'updating' | 'skipping';
    };
  };
}
```

---

## ⚡ Client Implementation

### Morpheus Mobile App WebSocket Client
```typescript
class MorpheusWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private apiKey: string;
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Connection management
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://api.morpheus.app/morpheus-agents?api_key=${this.apiKey}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected to Morpheus');
        this.reconnectAttempts = 0;
        
        // Send authentication message
        this.send({
          type: 'heartbeat',
          source: 'morpheus_mobile',
          event: 'client_connected',
          payload: { clientType: 'mobile', version: '1.0' }
        });
        
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error);
        reject(error);
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Connection closed');
        this.attemptReconnect();
      };
    });
  }

  // Message handling
  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.eventHandlers.get(message.event) || [];
    handlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error(`[WebSocket] Error handling ${message.event}:`, error);
      }
    });
  }

  // Event subscription
  on(event: string, handler: (message: WebSocketMessage) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  // Send message
  send(message: Partial<WebSocketMessage>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        version: '1.0',
        priority: 'normal',
        ...message
      } as WebSocketMessage;

      this.ws.send(JSON.stringify(fullMessage));
    } else {
      console.warn('[WebSocket] Cannot send message - not connected');
    }
  }

  // Reconnection logic
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('[WebSocket] Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('[WebSocket] Max reconnection attempts reached');
    }
  }

  // Utility methods
  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

---

## 🖥️ Server Implementation

### MercuryOne WebSocket Server
```typescript
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

class MercuryOneWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private agents: Map<string, WebSocket> = new Map();

  constructor(port: number) {
    this.wss = new WebSocketServer({ 
      port,
      verifyClient: this.verifyClient.bind(this)
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    console.log(`[WebSocket Server] Started on port ${port}`);
  }

  // Client verification
  private verifyClient(info: { origin: string; req: IncomingMessage }): boolean {
    const url = new URL(info.req.url!, `http://${info.req.headers.host}`);
    const apiKey = url.searchParams.get('api_key') || 
                   info.req.headers['x-morpheus-api-key'];

    return this.validateApiKey(apiKey as string);
  }

  private validateApiKey(apiKey: string): boolean {
    // Implement API key validation logic
    return apiKey && apiKey.length > 10; // Simplified validation
  }

  // Connection handling
  private handleConnection(ws: WebSocket, req: IncomingMessage): void {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const clientId = this.generateClientId();
    const clientType = url.searchParams.get('client_type') || 'unknown';

    this.clients.set(clientId, ws);
    console.log(`[WebSocket] Client connected: ${clientId} (${clientType})`);

    // Handle messages
    ws.on('message', (data) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        this.handleMessage(clientId, message);
      } catch (error) {
        console.error('[WebSocket] Invalid message format:', error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      this.clients.delete(clientId);
      this.agents.delete(clientId);
      console.log(`[WebSocket] Client disconnected: ${clientId}`);
    });

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'system_health',
      source: 'mercury_one_server',
      event: 'connection_established',
      payload: { clientId, serverTime: new Date().toISOString() }
    });
  }

  // Message routing
  private handleMessage(clientId: string, message: WebSocketMessage): void {
    console.log(`[WebSocket] Message from ${clientId}: ${message.event}`);

    // Route message based on type and target
    if (message.target) {
      if (Array.isArray(message.target)) {
        message.target.forEach(target => this.routeMessage(target, message));
      } else {
        this.routeMessage(message.target, message);
      }
    } else {
      // Broadcast to all clients
      this.broadcast(message);
    }
  }

  // Message sending
  private routeMessage(target: string, message: WebSocketMessage): void {
    const targetWs = this.clients.get(target) || this.agents.get(target);
    if (targetWs && targetWs.readyState === WebSocket.OPEN) {
      targetWs.send(JSON.stringify(message));
    }
  }

  private sendToClient(clientId: string, message: Partial<WebSocketMessage>): void {
    const ws = this.clients.get(clientId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        id: this.generateMessageId(),
        timestamp: new Date().toISOString(),
        version: '1.0',
        priority: 'normal',
        ...message
      } as WebSocketMessage;

      ws.send(JSON.stringify(fullMessage));
    }
  }

  // Broadcasting
  broadcast(message: WebSocketMessage): void {
    this.clients.forEach((ws, clientId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Agent registration
  registerAgent(agentName: string, ws: WebSocket): void {
    this.agents.set(agentName, ws);
    console.log(`[WebSocket] Agent registered: ${agentName}`);
  }

  // Utility methods
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## 🔄 Event-Driven Architecture

### Event Types and Handlers
```typescript
// Document processing events
const documentEvents = {
  'document_uploaded': (message: WebSocketMessage) => {
    // Handle document upload
    updateDocumentStatus(message.payload.documentId, 'uploaded');
    notifyProcessingTeam(message.payload);
  },

  'ocr_complete': (message: WebSocketMessage) => {
    // Handle OCR completion
    const { documentId, confidence, extractedData } = message.payload;
    if (confidence > 0.8) {
      initiateValidation(documentId, extractedData);
    } else {
      requestManualReview(documentId);
    }
  },

  'sync_complete': (message: WebSocketMessage) => {
    // Handle sync completion
    const { documentId, created, updated, errors } = message.payload;
    logSyncResults(documentId, { created, updated, errors });
    notifyUser(documentId, 'sync_complete');
  }
};

// Sync operation events
const syncEvents = {
  'price_sync_initiated': (message: WebSocketMessage) => {
    // Handle price sync start
    updateSyncStatus(message.payload.documentId, 'syncing');
    trackSyncProgress(message.payload);
  },

  'inventory_updated': (message: WebSocketMessage) => {
    // Handle inventory updates
    const { supplierId, updatedItems, stockAlerts } = message.payload;
    processStockAlerts(stockAlerts);
    updateInventoryDashboard(supplierId, updatedItems);
  }
};
```

---

## 🚨 Error Handling

### WebSocket Error Management
```typescript
interface WebSocketError {
  type: 'connection' | 'message' | 'authentication' | 'rate_limit';
  code: string;
  message: string;
  timestamp: string;
  clientId?: string;
  originalMessage?: WebSocketMessage;
}

// Error event handling
const errorHandling = {
  'connection_failed': (error: WebSocketError) => {
    console.error(`[WebSocket] Connection failed: ${error.message}`);
    // Implement reconnection logic
    scheduleReconnection(error.clientId);
  },

  'message_parse_error': (error: WebSocketError) => {
    console.error(`[WebSocket] Message parse error: ${error.message}`);
    // Send error response to client
    sendErrorResponse(error.clientId, error);
  },

  'authentication_failed': (error: WebSocketError) => {
    console.error(`[WebSocket] Authentication failed: ${error.message}`);
    // Close connection and log security event
    closeConnection(error.clientId);
    logSecurityEvent(error);
  }
};
```

---

## 📊 Performance Monitoring

### Connection Metrics
```typescript
interface WebSocketMetrics {
  connections: {
    total: number;
    active: number;
    mobile: number;
    web: number;
    agents: number;
  };
  
  messages: {
    sent: number;
    received: number;
    errors: number;
    averageLatency: number;
  };
  
  performance: {
    memoryUsage: number;
    cpuUsage: number;
    networkThroughput: number;
  };
}

// Metrics collection
class WebSocketMetrics {
  private metrics: WebSocketMetrics;
  
  updateConnectionCount(type: string, delta: number): void {
    this.metrics.connections[type] += delta;
    this.metrics.connections.total += delta;
  }
  
  recordMessage(type: 'sent' | 'received', latency?: number): void {
    this.metrics.messages[type]++;
    if (latency) {
      this.updateAverageLatency(latency);
    }
  }
  
  private updateAverageLatency(latency: number): void {
    const current = this.metrics.messages.averageLatency;
    const total = this.metrics.messages.sent + this.metrics.messages.received;
    this.metrics.messages.averageLatency = ((current * (total - 1)) + latency) / total;
  }
}
```

---

## 🧪 Testing WebSocket Communication

### Connection Testing
```typescript
// WebSocket connection test
describe('WebSocket Connection', () => {
  test('should connect with valid API key', async () => {
    const client = new MorpheusWebSocketClient('valid-api-key');
    await expect(client.connect()).resolves.toBeUndefined();
  });

  test('should reject connection with invalid API key', async () => {
    const client = new MorpheusWebSocketClient('invalid-key');
    await expect(client.connect()).rejects.toThrow();
  });

  test('should handle connection interruption', async () => {
    const client = new MorpheusWebSocketClient('valid-api-key');
    await client.connect();
    
    // Simulate network interruption
    client.disconnect();
    
    // Should attempt reconnection
    expect(client.reconnectAttempts).toBeGreaterThan(0);
  });
});
```

### Message Testing
```bash
# WebSocket message testing with wscat
npm install -g wscat

# Test connection
wscat -c "wss://api.morpheus.app/morpheus-agents?api_key=your-key"

# Send test message
{
  "type": "heartbeat",
  "source": "test_client",
  "event": "ping",
  "payload": { "timestamp": "2025-08-03T12:00:00Z" }
}
```

---

**This WebSocket communication guide provides comprehensive real-time messaging capabilities for the Morpheus ↔ MercuryOne integration, enabling instant status updates, agent coordination, and seamless user experience.**  private metrics: PubSubMetrics;

  constructor(projectId: string, options?: {
    enableExactlyOnceDelivery?: boolean;
    maxRetries?: number;
    timeout?: number;
  }) {
    this.pubsub = new PubSub({
      projectId,
      grpc: {
        'grpc.keepalive_time_ms': 30000,
        'grpc.keepalive_timeout_ms': 5000,
        'grpc.keepalive_permit_without_calls': true,
        'grpc.http2.max_pings_without_data': 0,
      },
    });
    this.metrics = new PubSubMetrics();
  }

  async getTopic(topicName: string): Promise<Topic> {
    if (!this.topicCache.has(topicName)) {
      const topic = this.pubsub.topic(topicName);
      
      // Production-grade configuration
      topic.publishOptions = {
        batching: {
          maxMessages: 1000,           // Optimal batch size for throughput
          maxMilliseconds: 100,        // Low latency batching
          maxBytes: 1024 * 1024,      // 1MB batch size
        },
        messageOrdering: true,          // Enable message ordering
        enableOpenTelemetryTracing: true,
        gaxOpts: {
          retry: {
            retryCodes: [10, 14],       // ABORTED, UNAVAILABLE
            backoffSettings: {
              initialRetryDelayMillis: 100,
              retryDelayMultiplier: 1.3,
              maxRetryDelayMillis: 60000,
              initialRpcTimeoutMillis: 5000,
              rpcTimeoutMultiplier: 1.0,
              maxRpcTimeoutMillis: 600000,
              totalTimeoutMillis: 600000,
            },
          },
        },
      };

      this.topicCache.set(topicName, topic);
    }
    return this.topicCache.get(topicName)!;
  }

  async publishMessage(
    topicName: string,
    payload: BusinessMessagePayload,
    attributes?: Record<string, string>
  ): Promise<string> {
    const startTime = Date.now();
    
    try {
      const topic = await this.getTopic(topicName);
      
      const messageData = Buffer.from(JSON.stringify(payload));
      const messageAttributes = {
        source: payload.sourceSystem,
        eventType: payload.eventType,
        priority: payload.businessContext?.priority || 'normal',
        correlationId: payload.correlationId,
        version: '2.0',
        contentType: 'application/json',
        timestamp: payload.timestamp,
        ...attributes,
      };

      const messageId = await topic.publishMessage({
        data: messageData,
        attributes: messageAttributes,
        orderingKey: payload.businessContext?.userId || payload.businessContext?.documentId,
      });

      // Metrics tracking
      this.metrics.recordPublishSuccess(topicName, Date.now() - startTime);
      
      console.log(`✅ Message ${messageId} published to ${topicName} in ${Date.now() - startTime}ms`);
      return messageId;
      
    } catch (error) {
      this.metrics.recordPublishError(topicName, error);
      console.error(`❌ Publishing failed to ${topicName}:`, error);
      throw error;
    }
  }

  async publishBatch(
    topicName: string,
    payloads: BusinessMessagePayload[]
  ): Promise<string[]> {
    const topic = await this.getTopic(topicName);
    
    const publishPromises = payloads.map((payload, index) =>
      topic.publishMessage({
        data: Buffer.from(JSON.stringify(payload)),
        attributes: { 
          batchId: Date.now().toString(),
          batchIndex: index.toString(),
          batchTotal: payloads.length.toString(),
        }
      })
    );

    return Promise.all(publishPromises);
  }

  async shutdown(): Promise<void> {
    // Flush all pending messages
    for (const topic of this.topicCache.values()) {
      await topic.flush();
    }
    await this.pubsub.close();
  }
}
```

### Enhanced Subscriber with DLQ and Error Handling

```typescript
// services/ProductionSubscriber.ts
import { PubSub, Subscription, Message } from '@google-cloud/pubsub';

interface SubscriptionConfig {
  ackDeadlineSeconds?: number;
  maxMessages?: number;
  maxBytes?: number;
  allowExcessMessages?: boolean;
  maxExtension?: number;
  enableExactlyOnceDelivery?: boolean;
  deadLetterPolicy?: {
    deadLetterTopic: string;
    maxDeliveryAttempts: number;
  };
  retryPolicy?: {
    minimumBackoffSeconds: number;
    maximumBackoffSeconds: number;
  };
}

export class ProductionSubscriber {
  private pubsub: PubSub;
  private subscriptions: Map<string, Subscription> = new Map();
  private metrics: PubSubMetrics;
  private messageProcessor: MessageProcessor;

  constructor(projectId: string) {
    this.pubsub = new PubSub({ projectId });
    this.metrics = new PubSubMetrics();
    this.messageProcessor = new MessageProcessor();
  }

  async createSubscription(
    topicName: string,
    subscriptionName: string,
    config: SubscriptionConfig = {}
  ): Promise<Subscription> {
    const topic = this.pubsub.topic(topicName);
    
    // Enhanced subscription configuration
    const subscriptionOptions = {
      ackDeadlineSeconds: config.ackDeadlineSeconds || 60,
      enableMessageOrdering: true,
      enableExactlyOnceDelivery: config.enableExactlyOnceDelivery || false,
      
      // Message filtering for business workloads
      filter: 'attributes.version="2.0"',
      
      // Production retry policy
      retryPolicy: config.retryPolicy || {
        minimumBackoff: { seconds: 10 },
        maximumBackoff: { seconds: 600 },
      },
      
      // Dead letter queue configuration
      deadLetterPolicy: config.deadLetterPolicy || {
        deadLetterTopic: `projects/${this.pubsub.projectId}/topics/${topicName}-dlq`,
        maxDeliveryAttempts: 5,
      },
      
      // Expiration policy for unused subscriptions
      expirationPolicy: {
        ttl: { seconds: 86400 * 30 }, // 30 days
      },
    };

    const [subscription] = await topic.createSubscription(subscriptionName, subscriptionOptions);
    return subscription;
  }

  async startProcessing(
    subscriptionName: string,
    messageHandler: (message: Message) => Promise<void>,
    config: SubscriptionConfig = {}
  ): Promise<void> {
    const subscription = this.pubsub.subscription(subscriptionName);
    
    // Production flow control configuration
    subscription.setOptions({
      flowControlSettings: {
        maxMessages: config.maxMessages || 1000,
        maxBytes: config.maxBytes || 1024 * 1024 * 100, // 100MB
        allowExcessMessages: config.allowExcessMessages || false,
      },
      ackDeadlineSeconds: config.ackDeadlineSeconds || 60,
      maxExtension: config.maxExtension || 600, // 10 minutes max
    });

    // Enhanced error handling
    subscription.on('error', (error) => {
      console.error(`🚨 Subscription error on ${subscriptionName}:`, error);
      this.metrics.recordSubscriptionError(subscriptionName, error);
      
      // Implement alerting here for production
      this.sendAlert('subscription_error', { subscription: subscriptionName, error: error.message });
    });

    // Production message processing
    subscription.on('message', async (message: Message) => {
      const processingStartTime = Date.now();
      const messageId = message.id;
      
      try {
        // Idempotency check
        if (await this.messageProcessor.isAlreadyProcessed(messageId)) {
          console.log(`⚠️ Message ${messageId} already processed, skipping`);
          message.ack();
          return;
        }

        // Process with reliable retry logic
        await this.processWithRetry(message, messageHandler);
        
        // Mark as processed for idempotency
        await this.messageProcessor.markAsProcessed(messageId);
        
        message.ack();
        
        // Success metrics
        this.metrics.recordProcessingSuccess(
          subscriptionName, 
          Date.now() - processingStartTime
        );
        
      } catch (error) {
        console.error(`❌ Failed to process message ${messageId}:`, error);
        
        // Record failure metrics
        this.metrics.recordProcessingError(subscriptionName, error);
        
        // Nack the message for retry/DLQ handling
        message.nack();
        
        // Send alert for persistent failures
        if (message.deliveryAttempt >= 3) {
          this.sendAlert('message_processing_failure', {
            messageId,
            subscription: subscriptionName,
            deliveryAttempt: message.deliveryAttempt,
            error: error.message,
          });
        }
      }
    });

    this.subscriptions.set(subscriptionName, subscription);
    console.log(`🚀 Started business processing for ${subscriptionName}`);
  }

  private async processWithRetry(
    message: Message,
    handler: (message: Message) => Promise<void>,
    maxRetries: number = 3
  ): Promise<void> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await handler(message);
        return; // Success
      } catch (error) {
        lastError = error as Error;
        
        // Check if error is retryable
        if (!this.isRetryableError(error)) {
          throw error; // Don't retry permanent errors
        }
        
        if (attempt < maxRetries) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
          console.log(`⏳ Retrying message ${message.id} in ${backoffMs}ms (attempt ${attempt})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }
    
    throw lastError!;
  }

  private isRetryableError(error: any): boolean {
    // Define retryable error patterns
    const retryableCodes = ['UNAVAILABLE', 'DEADLINE_EXCEEDED', 'RESOURCE_EXHAUSTED'];
    const retryableMessages = ['timeout', 'connection', 'network'];
    
    return retryableCodes.includes(error.code) ||
           retryableMessages.some(msg => error.message?.toLowerCase().includes(msg));
  }

  private async sendAlert(alertType: string, context: any): Promise<void> {
    // Implement your alerting mechanism (Slack, email, monitoring system)
    console.log(`🚨 ALERT [${alertType}]:`, JSON.stringify(context, null, 2));
  }

  async stopProcessing(subscriptionName: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionName);
    if (subscription) {
      await subscription.close();
      this.subscriptions.delete(subscriptionName);
      console.log(`🛑 Stopped processing ${subscriptionName}`);
    }
  }

  async shutdown(): Promise<void> {
    const closePromises = Array.from(this.subscriptions.values()).map(sub => sub.close());
    await Promise.all(closePromises);
    await this.pubsub.close();
    console.log('🔚 Production subscriber shutdown complete');
  }
}
```

### Dead Letter Queue Management

```typescript
// services/DLQManager.ts
export class DLQManager {
  private pubsub: PubSub;
  private metrics: PubSubMetrics;

  constructor(projectId: string) {
    this.pubsub = new PubSub({ projectId });
    this.metrics = new PubSubMetrics();
  }

  async setupDLQTopics(mainTopics: string[]): Promise<void> {
    for (const topicName of mainTopics) {
      const dlqTopicName = `${topicName}-dlq`;
      const dlqSubscriptionName = `${topicName}-dlq-subscription`;
      
      try {
        // Create DLQ topic
        const [dlqTopic] = await this.pubsub.createTopic(dlqTopicName);
        console.log(`✅ Created DLQ topic: ${dlqTopicName}`);
        
        // Create DLQ subscription for monitoring
        await dlqTopic.createSubscription(dlqSubscriptionName, {
          ackDeadlineSeconds: 600, // Longer deadline for manual review
          expirationPolicy: {
            ttl: { seconds: 86400 * 7 }, // 7 days retention
          },
        });
        
        console.log(`✅ Created DLQ subscription: ${dlqSubscriptionName}`);
        
      } catch (error) {
        if (error.code === 6) { // ALREADY_EXISTS
          console.log(`ℹ️ DLQ topic ${dlqTopicName} already exists`);
        } else {
          throw error;
        }
      }
    }
  }

  async monitorDLQs(): Promise<DLQStatus[]> {
    const dlqStatuses: DLQStatus[] = [];
    
    const [topics] = await this.pubsub.getTopics();
    const dlqTopics = topics.filter(topic => topic.name.endsWith('-dlq'));
    
    for (const dlqTopic of dlqTopics) {
      const [subscriptions] = await dlqTopic.getSubscriptions();
      
      for (const subscription of subscriptions) {
        const [metadata] = await subscription.getMetadata();
        
        dlqStatuses.push({
          topicName: dlqTopic.name,
          subscriptionName: subscription.name,
          numUnackedMessages: metadata.numUnackedMessages || 0,
          oldestUnackedMessageAge: metadata.oldestUnackedMessageAge || 0,
          lastUpdate: new Date(),
        });
      }
    }
    
    return dlqStatuses;
  }

  async replayFromDLQ(
    dlqSubscriptionName: string,
    targetTopicName: string,
    maxMessages: number = 100
  ): Promise<ReplayResult> {
    const dlqSubscription = this.pubsub.subscription(dlqSubscriptionName);
    const targetTopic = this.pubsub.topic(targetTopicName);
    
    let processedCount = 0;
    let errorCount = 0;
    
    const [messages] = await dlqSubscription.receive({
      maxMessages,
      allowExcessMessages: false,
    });
    
    for (const message of messages) {
      try {
        // Republish to target topic
        await targetTopic.publishMessage({
          data: message.data,
          attributes: {
            ...message.attributes,
            replayedFrom: dlqSubscriptionName,
            replayedAt: new Date().toISOString(),
          },
        });
        
        // Acknowledge DLQ message
        message.ack();
        processedCount++;
        
      } catch (error) {
        console.error(`Failed to replay message ${message.id}:`, error);
        message.nack();
        errorCount++;
      }
    }
    
    return {
      totalMessages: messages.length,
      processedCount,
      errorCount,
      targetTopic: targetTopicName,
    };
  }
}

interface DLQStatus {
  topicName: string;
  subscriptionName: string;
  numUnackedMessages: number;
  oldestUnackedMessageAge: number;
  lastUpdate: Date;
}

interface ReplayResult {
  totalMessages: number;
  processedCount: number;
  errorCount: number;
  targetTopic: string;
}
```

### Production Metrics and Monitoring

```typescript
// services/PubSubMetrics.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

export class PubSubMetrics {
  private messagesPublished: Counter<string>;
  private messagesProcessed: Counter<string>;
  private processingDuration: Histogram<string>;
  private publishDuration: Histogram<string>;
  private activeSubscriptions: Gauge<string>;
  private dlqDepth: Gauge<string>;

  constructor() {
    this.messagesPublished = new Counter({
      name: 'pubsub_messages_published_total',
      help: 'Total number of messages published',
      labelNames: ['topic', 'status'],
    });
    
    this.messagesProcessed = new Counter({
      name: 'pubsub_messages_processed_total',
      help: 'Total number of messages processed',
      labelNames: ['subscription', 'status'],
    });
    
    this.processingDuration = new Histogram({
      name: 'pubsub_message_processing_duration_ms',
      help: 'Message processing duration in milliseconds',
      labelNames: ['subscription'],
      buckets: [10, 50, 100, 500, 1000, 2000, 5000, 10000, 30000],
    });
    
    this.publishDuration = new Histogram({
      name: 'pubsub_message_publish_duration_ms',
      help: 'Message publishing duration in milliseconds',
      labelNames: ['topic'],
      buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000],
    });
    
    this.activeSubscriptions = new Gauge({
      name: 'pubsub_active_subscriptions',
      help: 'Number of active subscriptions',
      labelNames: ['status'],
    });
    
    this.dlqDepth = new Gauge({
      name: 'pubsub_dlq_depth',
      help: 'Number of messages in dead letter queues',
      labelNames: ['dlq_topic'],
    });
  }

  recordPublishSuccess(topic: string, durationMs: number): void {
    this.messagesPublished.inc({ topic, status: 'success' });
    this.publishDuration.observe({ topic }, durationMs);
  }

  recordPublishError(topic: string, error: any): void {
    this.messagesPublished.inc({ topic, status: 'error' });
  }

  recordProcessingSuccess(subscription: string, durationMs: number): void {
    this.messagesProcessed.inc({ subscription, status: 'success' });
    this.processingDuration.observe({ subscription }, durationMs);
  }

  recordProcessingError(subscription: string, error: any): void {
    this.messagesProcessed.inc({ subscription, status: 'error' });
  }

  recordSubscriptionError(subscription: string, error: any): void {
    // Record subscription-level errors
    console.error(`Subscription error metrics for ${subscription}:`, error);
  }

  updateDLQDepth(dlqTopic: string, depth: number): void {
    this.dlqDepth.set({ dlq_topic: dlqTopic }, depth);
  }

  getMetricsEndpoint(): string {
    return register.metrics();
  }
}
```

---

## 🔧 Implementation Integration Points

### 1. Morpheus Framework Patch Updates Required

**Patch-005 (MercuryOne Integration Bridge)**: 
- Replace basic Pub/Sub with ProductionPublisher/Subscriber
- Add DLQ configuration and monitoring
- Implement exactly-once delivery for critical documents

**Patch-002 (Real-Time Agent Communication)**:
- **Communication Protocol Clarification**: Pub/Sub for async inter-app events (MercuryOne ↔ Morpheus), WebSockets for UI real-time updates (agent status, live metrics)
- Add message ordering for agent coordination
- Implement reliable retry policies

### 2. MercuryOne Integration Updates

**Agent Communication Enhancement**:
- Update all 11 MercuryOne agents to use reliable Pub/Sub patterns
- Implement message correlation for cross-system tracking
- Add monitoring and alerting for agent failures

### 3. Configuration Management

```typescript
// config/pubsub.business.ts
export const businessPubSubConfig = {
  projectId: process.env.GCP_PROJECT_ID!,
  
  // Publisher configuration
  publisher: {
    batching: {
      maxMessages: parseInt(process.env.PUBSUB_BATCH_SIZE || '1000'),
      maxMilliseconds: parseInt(process.env.PUBSUB_BATCH_TIMEOUT || '100'),
      maxBytes: parseInt(process.env.PUBSUB_BATCH_BYTES || '1048576'),
    },
    enableExactlyOnceDelivery: process.env.NODE_ENV === 'production',
    messageOrdering: true,
  },
  
  // Subscriber configuration
  subscriber: {
    maxMessages: parseInt(process.env.PUBSUB_MAX_MESSAGES || '1000'),
    ackDeadlineSeconds: parseInt(process.env.PUBSUB_ACK_DEADLINE || '60'),
    maxExtension: parseInt(process.env.PUBSUB_MAX_EXTENSION || '600'),
    enableExactlyOnceDelivery: process.env.NODE_ENV === 'production',
  },
  
  // Dead letter queue configuration
  dlq: {
    maxDeliveryAttempts: parseInt(process.env.PUBSUB_DLQ_MAX_ATTEMPTS || '5'),
    retentionDays: parseInt(process.env.PUBSUB_DLQ_RETENTION_DAYS || '7'),
  },
  
  // Monitoring configuration
  monitoring: {
    metricsPort: parseInt(process.env.METRICS_PORT || '9090'),
    alertingEnabled: process.env.ALERTING_ENABLED === 'true',
    slackWebhook: process.env.SLACK_WEBHOOK_URL,
  },
};
```

---

## 📊 Performance and Reliability Improvements

### Expected Performance Gains
- **99.95% Availability** with automatic failover
- **Sub-100ms Latency** for real-time messaging
- **Million+ Messages/Second** throughput capability
- **Zero Message Loss** with exactly-once delivery
- **Automatic Scaling** based on workload

### Production Reliability Features
- ✅ Dead Letter Queues for failed message handling
- ✅ Exponential backoff with jitter
- ✅ Message ordering for stateful processing
- ✅ Idempotency patterns to prevent duplicates
- ✅ Comprehensive monitoring and alerting
- ✅ Automatic retry policies with circuit breakers
- ✅ Flow control to prevent resource exhaustion

---

## 🚀 Next Steps

1. **Update Morpheus Patches** with enhanced Pub/Sub implementation
2. **Update MercuryOne roadmap** to include DLQ setup and monitoring
3. **Create migration plan** from current to production implementation
4. **Add comprehensive testing** for reliability scenarios
5. **Implement monitoring dashboard** for production visibility

This enhancement brings our Pub/Sub implementation to production standards with Google Cloud's 2025 best practices.10. **Framework-Patch-043**: Cybersecurity Operations Center
    - `security_threats`, `security_monitoring_logs` tables
    - Security operations schema

#### 🚨 **MISSING SCHEMAS** (Patches Requiring Database Implementation)

##### **Revolutionary Technology Patches (045-064)**
- **Framework-Patch-045**: Quantum Processing Integration ❌
- **Framework-Patch-046**: Blockchain Infrastructure Foundation ✅ (Created)
- **Framework-Patch-047**: AR/VR Immersive Experience Platform ✅ (Created)
- **Framework-Patch-048**: 5G Network Integration ❌
- **Framework-Patch-049**: Satellite Communication Networks ❌
- **Framework-Patch-050**: IoT Sensor Network Integration ❌
- **Framework-Patch-051**: Machine Learning Intelligence Platform ❌
- **Framework-Patch-052**: Advanced Voice Intelligence System ❌
- **Framework-Patch-053**: Biometric Security Framework ❌
- **Framework-Patch-054**: Edge Computing Infrastructure ❌
- **Framework-Patch-055**: Digital Twin Technology Platform ❌
- **Framework-Patch-056**: Intelligent Robotics Integration ❌
- **Framework-Patch-057**: Advanced Analytics Engine ❌
- **Framework-Patch-058**: Neural Network Processing ❌
- **Framework-Patch-059**: Autonomous Decision Systems ❌
- **Framework-Patch-060**: Production DevOps Framework ❌
- **Framework-Patch-061**: Advanced Digital Twin Platform ❌
- **Framework-Patch-062**: Intelligent Autonomous Framework ✅ (Exists)
- **Framework-Patch-063**: Green Technology Integration ✅ (Created)
- **Framework-Patch-064**: Revolutionary Platform Evolution ❌

##### **Centennial Excellence Patches (065-100)**
- **Framework-Patch-065-099**: Business excellence patches ❌ (Most missing)
- **Framework-Patch-100**: MercuryOne Centennial Platform Mastery ✅ (Created)

### Critical Schema Gaps Identified

#### 1. **Core Infrastructure Missing**
```sql
-- REQUIRED: User authentication and sessions (Foundation)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);
```

#### 2. **Revolutionary Technology Schemas Missing**
```sql
-- QUANTUM PROCESSING (Patch 045)
CREATE TABLE quantum_processing_tasks (
    id SERIAL PRIMARY KEY,
    task_type VARCHAR(50),
    quantum_algorithm VARCHAR(100),
    processing_data JSONB,
    quantum_speedup_factor DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5G NETWORK INTEGRATION (Patch 048)
CREATE TABLE network_5g_connections (
    id SERIAL PRIMARY KEY,
    connection_id VARCHAR(100) UNIQUE,
    network_slice VARCHAR(50),
    bandwidth_allocation BIGINT,
    latency_ms DECIMAL(8,3),
    connection_status VARCHAR(20)
);

-- MACHINE LEARNING PLATFORM (Patch 051)
CREATE TABLE ml_models (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100),
    model_type VARCHAR(50),
    training_data_hash VARCHAR(64),
    accuracy_score DECIMAL(5,4),
    deployed_at TIMESTAMP
);
```

#### 3. **Business Patches Schema Requirements**
```sql
-- ADVANCED ANALYTICS (Patch 057)
CREATE TABLE analytics_dashboards (
    id SERIAL PRIMARY KEY,
    dashboard_name VARCHAR(100),
    analytics_config JSONB,
    visualization_data JSONB,
    performance_metrics JSONB
);

-- NEURAL NETWORKS (Patch 058)
CREATE TABLE neural_networks (
    id SERIAL PRIMARY KEY,
    network_architecture JSONB,
    training_parameters JSONB,
    performance_metrics JSONB,
    deployment_status VARCHAR(20)
);
```

### Logic Implementation Cross-Reference

#### **DocumentMatcher Logic Consistency** ✅
- **Database**: `supplier_patterns` table matches AGENT_COMMUNICATION_PROTOCOL.md
- **API**: `/api/upload-document` endpoint implemented
- **Frontend**: DocumentMatcher component with confidence scoring
- **Pattern Matching**: 66+ supplier database integration

#### **Product Upload Review Logic** ✅  
- **Database**: `productUploadReviews`, `proposedProducts` tables complete
- **Workflow**: Approval/rejection process implemented
- **Integration**: Seamless catalogue integration

#### **Financial Management Logic** ✅
- **Database**: Complete Xero integration schema
- **API**: Banking, expenses, invoicing endpoints
- **Security**: OAuth2 flow and encryption patterns

### Recommendations for Complete Implementation

#### **Phase 1: Critical Infrastructure** (Immediate)
1. Create missing foundational schemas for patches 045-064
2. Implement quantum processing database tables
3. Add 5G network integration schemas
4. Complete machine learning platform tables

#### **Phase 2: Revolutionary Technologies** (Next)
1. AR/VR experience tracking
2. Blockchain audit trail completion
3. IoT sensor data management
4. Edge computing infrastructure

#### **Phase 3: Business Excellence** (Final)
1. Complete patches 065-099 database schemas
2. Advanced analytics platform tables
3. Global deployment infrastructure
4. Centennial achievement tracking

### Database Migration Strategy

```sql
-- Migration script for missing schemas
-- Execute in order: Foundation → Revolutionary → Business

-- 1. Foundation schemas (if missing)
\i migrations/001_foundation_schemas.sql

-- 2. Revolutionary technology schemas
\i migrations/045_quantum_processing.sql
\i migrations/046_blockchain_infrastructure.sql
\i migrations/047_arvr_platform.sql
-- ... continue for patches 048-064

-- 3. Business excellence schemas  
\i migrations/065_admin_control.sql
-- ... continue for patches 066-100
```

### Validation Checklist

- [ ] **Database Schema**: All 100 patches have corresponding database tables
- [ ] **API Endpoints**: REST endpoints match database schema requirements
- [ ] **Frontend Logic**: Components consume APIs with proper data flow
- [ ] **Business Logic**: Core workflows implemented with proper validation
- [ ] **Security**: Authentication, authorization, and audit trails complete
- [ ] **Performance**: Indexes and optimization for business scale
- [ ] **Integration**: Cross-system data flow properly implemented

### Conclusion

**Current Status**: 56% Complete (56/100 patches)  
**Critical Gap**: 44 missing patches with incomplete database schemas  
**Action Required**: Systematic creation of missing patch specifications and database implementations  
**Priority**: Complete revolutionary technology patches (045-064) first, then business excellence patches (065-099)

The platform has solid foundations but requires systematic completion of the missing 44 patches to achieve true centennial mastery with comprehensive database schema coverage.

---
*Validation Date: 2025-08-06*  
*Analysis Level: COMPREHENSIVE*  
*Completion Status: 56% - Requires 44 Additional Patches*