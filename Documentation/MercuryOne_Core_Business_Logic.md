# MercuryOne Core Business Logic Guide (CRITICAL)

## Navigation
- For system overview: [MercuryOne_System_Overview.md](../Overviews/MercuryOne_System_Overview.md)
- For agents/protocol: [MercuryOne_Agent_Protocol.md](../Architecture/MercuryOne_Agent_Protocol.md)
- For suppliers: [MercuryOne_Supplier_Architecture_Guide.md](../Suppliers/MercuryOne_Supplier_Architecture_Guide.md)
- For integrations: [Morpheus_Integration_Guide.md](../Integrations/Morpheus_Integration_Guide.md)
- For roadmaps: [MercuryOne_Development_Roadmap.csv](../Roadmaps/MercuryOne_Development_Roadmap.csv)
- For compliance: [MercuryOne_UK_Compliance_Guide.md](../Compliance/MercuryOne_UK_Compliance_Guide.md)

---

**Version**: 5.0 CONSOLIDATED BUSINESS LOGIC
**Date**: August 11, 2025
**Status**: ✅ PRODUCTION READY - Consolidated from BUSINESS_LOGIC.md, DOCUMENT_PROCESSING_COMPLETE.md, and PASSPORT_SYSTEM_SPINE.md
**Architecture**: Complete business logic framework with document processing and passport lifecycle

---

## 🎯 OVERVIEW

This consolidated guide provides the complete business logic framework for MercuryOne, combining core business operations, document processing workflows, and the passport lifecycle management system. This replaces the previous fragmented documentation with a unified source of truth.

### Core Business Components
- **DocumentMatcher**: Intelligent supplier identification and document routing
- **Product Creator**: Automated product catalogue management
- **Customer Manager**: Complete customer lifecycle management
- **Order Processing**: End-to-end order workflow management
- **Passport System**: Document-centric business process spine

---

## 📄 DOCUMENT PROCESSING FRAMEWORK

### DocumentMatcher Logic System
**Purpose**: Intelligent supplier identification and document routing with 95% accuracy

#### Supplier Pattern Recognition
```typescript
interface SupplierPattern {
  supplierId: string;
  patterns: {
    documentHeaders: string[];
    emailDomains: string[];
    productCodes: RegExp[];
    addressPatterns: string[];
    phonePatterns: string[];
    vatNumbers: string[];
  };
  confidence: {
    documentType: number;
    supplierMatch: number;
    dataExtraction: number;
  };
}
```

#### Core 5 Major Suppliers + Extended 66+ Network
**Total Coverage**: 71+ suppliers with automated processing

1. **G-Plan Limited** (UK Premium Heritage)
   - **Patterns**: SO######, DN######, heritage format recognition
   - **Confidence**: 94% OCR with trade discount validation
   - **Processing**: Heritage craftsmanship markers, 27% trade discount

2. **Devonshire Living** (Traditional Craftsmanship)
   - **Patterns**: 15% surcharge processing, painted finish codes
   - **Confidence**: 92% with specialty finish parsing
   - **Processing**: Traditional finish recognition, surcharge calculations

3. **La-Z-Boy Incorporated** (American Innovation)
   - **Patterns**: American format invoices, comfort technology specs
   - **Confidence**: 90% with American format adaptation
   - **Processing**: Reclining mechanism specs, comfort feature recognition

4. **Ashwood Designs Limited** (Irish Contemporary)
   - **Patterns**: Contemporary design catalogs, premium material specs
   - **Confidence**: 93% with contemporary format processing
   - **Processing**: Modern design codes, material premium calculations

5. **Rauch Möbelwerke GmbH** (German Engineering)
   - **Patterns**: Multi-page German documentation, component-based pricing
   - **Confidence**: 95% with multilingual German-English processing
   - **Processing**: Component coordination, German engineering precision

### Document Processing Pipeline
**Workflow**: OCR → Pattern Match → Data Extract → Validate → Route → Process

#### Processing Confidence Matrix
```typescript
interface ProcessingConfidence {
  ocrAccuracy: number;        // 90-95% across suppliers
  supplierMatch: number;      // Pattern recognition confidence
  dataExtraction: number;     // Field extraction accuracy
  validationPass: boolean;    // Business logic validation
}
```

#### Multi-Format Document Support
- **PDF Processing**: Advanced OCR with layout recognition
- **Image Processing**: High-resolution document scanning
- **Email Integration**: Attachment extraction and processing
- **Multi-Page Support**: Complex document assembly (German 3-page formats)

---

## 🏗️ PRODUCT CREATOR SYSTEM

### Automated Product Catalogue Management
**Purpose**: Intelligent product creation with supplier integration and pricing management

#### Product Data Structure
```typescript
interface ProductData {
  productId: string;
  supplierId: string;
  productCodes: {
    supplierCode: string;
    internalSku: string;
    barcode?: string;
  };
  specifications: {
    dimensions: { width: number; height: number; depth: number; };
    materials: string[];
    finishes: string[];
    categories: string[];
  };
  pricing: {
    tradePrice: number;
    retailPrice: number;
    discountTiers: DiscountTier[];
    vatRate: number;
  };
  suppliers: {
    primarySupplier: string;
    alternativeSuppliers: string[];
    leadTimes: Record<string, number>;
  };
}
```

#### Supplier-Specific Product Integration
- **G-Plan**: Heritage collections with fabric/leather grade classifications
- **Devonshire**: Traditional finishes with painted specialty options
- **La-Z-Boy**: Comfort technology with mechanism specifications
- **Ashwood**: Contemporary designs with premium material options
- **Rauch**: Component-based systems with German engineering precision

### Automated Pricing Engine
- **Trade Discount Recognition**: Automatic tier identification (27% G-Plan, 15% Devonshire)
- **Grade-Based Surcharges**: Fabric grades (W/A/B/C), Leather grades (H/L/P)
- **Component Pricing**: Multi-part product coordination (German systems)
- **VAT Integration**: 20% UK VAT with international supplier compliance

---

## 👥 CUSTOMER MANAGER SYSTEM

### Complete Customer Lifecycle Management
**Purpose**: Unified customer management with order history and communication tracking

#### Customer Data Architecture
```typescript
interface CustomerProfile {
  customerId: string;
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContact: 'email' | 'phone' | 'post';
  };
  addresses: {
    billing: Address;
    delivery: Address[];
    preferences: DeliveryPreferences;
  };
  business: {
    tradeAccount: boolean;
    vatNumber?: string;
    creditLimit?: number;
    paymentTerms: string;
  };
  history: {
    orders: OrderSummary[];
    communications: CommunicationLog[];
    preferences: CustomerPreferences;
  };
}
```

#### Customer Segmentation
- **Retail Customers**: Walk-in and online consumers
- **Trade Customers**: Business accounts with credit facilities
- **VIP Customers**: High-value customers with premium service
- **Repeat Customers**: Loyalty program participants

### Communication Management
- **Order Updates**: Automated status notifications
- **Delivery Coordination**: Scheduling and confirmation
- **After-Sales Support**: Warranty and service management
- **Marketing Integration**: Targeted campaigns and promotions

---

## 📋 ORDER PROCESSING WORKFLOW

### End-to-End Order Management
**Purpose**: Complete order lifecycle from enquiry to delivery with real-time tracking

#### Order Processing Pipeline
```typescript
interface OrderWorkflow {
  enquiry: {
    source: 'showroom' | 'online' | 'phone' | 'email';
    customer: CustomerProfile;
    products: ProductEnquiry[];
    requirements: SpecialRequirements;
  };
  quotation: {
    pricing: DetailedPricing;
    availability: StockStatus[];
    leadTimes: DeliverySchedule;
    terms: BusinessTerms;
  };
  order: {
    confirmation: OrderConfirmation;
    payment: PaymentDetails;
    production: ProductionSchedule;
    logistics: DeliveryPlanning;
  };
  fulfillment: {
    dispatch: DispatchDetails;
    delivery: DeliveryExecution;
    completion: OrderCompletion;
    afterSales: SupportServices;
  };
}
```

#### Multi-Supplier Coordination
- **Supplier Communication**: Automated order transmission
- **Delivery Coordination**: Multi-supplier delivery scheduling
- **Quality Control**: Pre-delivery inspection protocols
- **Customer Communication**: Real-time status updates

### Order Status Management
- **Real-Time Tracking**: Live order status across all stages
- **Exception Handling**: Automated issue detection and resolution
- **Communication Automation**: Customer and supplier notifications
- **Performance Metrics**: Order processing analytics and optimization

---

## 🛂 PASSPORT SYSTEM SPINE

### Document-Centric Business Process Management
**Purpose**: Unified business process spine with document-triggered workflows and comprehensive audit trails

The Passport System provides the foundational architecture for MercuryOne's business processes, treating documents as "passports" that travel through defined business phases with complete traceability.

#### Passport Architecture
```typescript
interface BusinessPassport {
  passportId: string;
  documentType: 'invoice' | 'order' | 'quote' | 'receipt' | 'statement';
  currentPhase: BusinessPhase;
  status: PassportStatus;
  metadata: {
    supplierId?: string;
    customerId?: string;
    orderId?: string;
    totalValue?: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
  };
  audit: {
    phaseHistory: PhaseTransition[];
    agentActions: AgentAction[];
    businessEvents: BusinessEvent[];
    timestamps: ProcessTimestamps;
  };
  routing: {
    currentAgent: AgentId;
    nextAgent?: AgentId;
    escalationPath: AgentId[];
    businessRules: RoutingRule[];
  };
}
```

#### Business Phase Definitions
**Phase 1: Document Intake**
- **Trigger**: Document received via email, upload, or scan
- **Agents**: Iris (capture), Argus (OCR), Janus (validation)
- **Actions**: Document digitization, format validation, metadata extraction
- **Transition**: Valid document → Phase 2, Invalid document → Exception handling

**Phase 2: Supplier Identification**
- **Trigger**: Valid document with extractable supplier indicators
- **Agents**: Juno (pattern matching), Saturn (validation)
- **Actions**: Supplier pattern recognition, confidence scoring, database matching
- **Transition**: Identified supplier → Phase 3, Unknown supplier → Manual review

**Phase 3: Data Extraction & Validation**
- **Trigger**: Confirmed supplier with processing templates
- **Agents**: Athena (extraction), Vulcan (validation), Hercules (enrichment)
- **Actions**: Field extraction, business rule validation, data enrichment
- **Transition**: Valid data → Phase 4, Validation errors → Exception handling

**Phase 4: Business Processing**
- **Trigger**: Validated business data ready for system integration
- **Agents**: Mars (inventory), Neptune (financials), Minerva (customers)
- **Actions**: Inventory updates, financial posting, customer management
- **Transition**: Processing complete → Phase 5, Business errors → Exception handling

**Phase 5: Integration & Completion**
- **Trigger**: Successful business processing requiring system updates
- **Agents**: Apollo (integration), Jupiter (orchestration)
- **Actions**: System updates, notification dispatch, audit completion
- **Transition**: Integration complete → Archive, Integration errors → Exception handling

#### Phase Trigger Matrix
| Current Phase | Trigger Event | Target Phase | Responsible Agent | Validation Required |
|---------------|---------------|--------------|-------------------|-------------------|
| Intake | Document Received | Identification | Janus | Format validation |
| Identification | Supplier Matched | Extraction | Juno | Pattern confidence > 80% |
| Extraction | Data Validated | Processing | Athena | Business rule compliance |
| Processing | Business Complete | Integration | Mars/Neptune | Transaction success |
| Integration | System Updated | Archive | Apollo | Audit trail complete |

#### Agent Responsibilities in Passport Flow
**Janus (Gatekeeper)**
- Document format validation and security scanning
- Initial passport creation and metadata assignment
- Access control and permission validation
- Exception routing for invalid documents

**Data Processing Agents (Juno, Athena, Vulcan)**
- Supplier identification and confidence scoring
- Field extraction with business context
- Data validation against business rules
- Quality assurance and error detection

**Business Logic Agents (Mars, Neptune, Minerva)**
- Inventory management and stock updates
- Financial processing and account posting
- Customer relationship management
- Business workflow execution

**Integration Agents (Apollo, Jupiter)**
- Cross-system data synchronization
- Notification and communication management
- Audit trail completion and archiving
- Performance monitoring and optimization

#### Passport Lifecycle Events
```typescript
interface PassportEvent {
  eventId: string;
  passportId: string;
  eventType: 'phase_transition' | 'agent_action' | 'business_event' | 'exception';
  timestamp: Date;
  agent: AgentId;
  details: {
    fromPhase?: BusinessPhase;
    toPhase?: BusinessPhase;
    action: string;
    result: 'success' | 'failure' | 'exception';
    metadata: Record<string, any>;
  };
  audit: {
    userId?: string;
    correlationId: string;
    businessContext: BusinessContext;
  };
}
```

### Exception Handling & Recovery
**Exception Types**
- **Technical Exceptions**: OCR failures, network issues, system errors
- **Business Exceptions**: Invalid data, rule violations, workflow conflicts
- **Process Exceptions**: Agent unavailable, timeout conditions, resource constraints

**Recovery Mechanisms**
- **Automatic Retry**: Configurable retry policies for transient errors
- **Manual Review**: Human intervention for complex business decisions
- **Alternative Routing**: Fallback agents and backup processing paths
- **Escalation Procedures**: Management notification for critical failures

### Performance Monitoring & Analytics
**Key Metrics**
- **Processing Time**: Average time per phase and overall passport lifecycle
- **Success Rate**: Percentage of passports completing without exceptions
- **Agent Performance**: Individual agent efficiency and error rates
- **Business Impact**: Financial and operational metrics per passport type

**Optimization Features**
- **Bottleneck Detection**: Automated identification of processing constraints
- **Load Balancing**: Dynamic agent assignment based on capacity
- **Predictive Routing**: Machine learning-based optimal path selection
- **Continuous Improvement**: Automated business rule refinement

---

## 🔄 BUSINESS WORKFLOW INTEGRATION

### Cross-System Process Coordination
The consolidated business logic framework integrates all components through the Passport System spine, ensuring seamless workflow execution across the entire business operation.

#### Unified Business Process Flow
1. **Document Reception**: All business documents enter through the Passport System
2. **Intelligent Routing**: DocumentMatcher identifies and routes to appropriate processors
3. **Product Integration**: Product Creator manages catalogue updates and pricing
4. **Customer Management**: Customer Manager handles all customer interactions
5. **Order Processing**: Order workflow manages complete sales lifecycle
6. **System Integration**: All processes integrate through standardized interfaces

### Real-Time Business Intelligence
- **Process Visibility**: Real-time dashboard showing all active passports
- **Performance Analytics**: Comprehensive metrics on business process efficiency
- **Exception Management**: Centralized handling of all business exceptions
- **Audit Compliance**: Complete audit trails for regulatory compliance

---

## 📊 BUSINESS METRICS & KPIs

### Core Business Performance Indicators
- **Document Processing**: 95% automation rate across all supplier types
- **Order Accuracy**: >99% accuracy in order processing and fulfillment
- **Customer Satisfaction**: Automated tracking and improvement systems
- **Financial Controls**: Real-time financial monitoring and compliance
- **Operational Efficiency**: Continuous process optimization and improvement

### Supplier Performance Metrics
- **Processing Speed**: 3.2 seconds average for British suppliers, 3.8 seconds for international
- **OCR Accuracy**: 90-95% across all supplier document formats
- **Data Validation**: >98% accuracy in extracted business data
- **Exception Rate**: <5% documents requiring manual intervention

---

*Note: This consolidated business logic guide replaces all previous fragmented documentation. All agent implementations must follow these specifications for business certification and system integration. Refer to [MercuryOne_Agent_Protocol.md](../Architecture/MercuryOne_Agent_Protocol.md) for detailed agent communication patterns.*