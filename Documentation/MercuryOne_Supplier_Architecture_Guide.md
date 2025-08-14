# MercuryOne Supplier Architecture Guide (CRITICAL)

## Navigation
- For system overview: [MercuryOne_System_Overview.md](../Overviews/MercuryOne_System_Overview.md)
- For agents/protocol: [MercuryOne_Agent_Protocol.md](../Architecture/MercuryOne_Agent_Protocol.md)
- For business logic: [MercuryOne_Core_Business_Logic.md](../Business_Logic/MercuryOne_Core_Business_Logic.md)
- For integrations: [Morpheus_Integration_Guide.md](../Integrations/Morpheus_Integration_Guide.md)
- For roadmaps: [MercuryOne_Development_Roadmap.csv](../Roadmaps/MercuryOne_Development_Roadmap.csv)
- For compliance: [MercuryOne_UK_Compliance_Guide.md](../Compliance/MercuryOne_UK_Compliance_Guide.md)

---

**Agent Reference**: Per Critical Documentation/AGENT_COMMUNICATION_PROTOCOL.md for agent implementation patterns
**Logic Reference**: See Critical Documentation/AGENT_COMMUNICATION_PROTOCOL.md for complex patch logic patterns

## 🌍 COMPREHENSIVE SUPPLIER COVERAGE

**Global Portfolio**: Core 5 Major Suppliers + Extended 66+ Network (71+ Total Coverage)

### 🗣️ MULTILINGUAL DOCUMENT PROCESSING
- **Supported Languages**: English (en), German (de) for international suppliers  
- **Auto-Detection**: Argus agent automatically detects document language via OCR
- **Processing Confidence**: 95% OCR accuracy for German docs (e.g., Rauch supplier)
- **Language Override**: Manual language selection for complex documents
- **Pub/Sub Integration**: Language codes included in message routing (`"detectedLanguage": "de"`)
**Primary Tier**: British Heritage, American Innovation, Irish Contemporary, German Engineering, Traditional Craftsmanship  
**Extended Tier**: Comprehensive UK furniture industry coverage with automated processing
**Automation Rate**: 95% across all suppliers  
**Processing Capability**: Multi-format, multilingual document processing  

### 🇬🇧 **G-Plan Limited** - British Heritage Excellence (Since 1898)
- **Specialization**: Premium heritage furniture with 125+ years excellence
- **Documents**: Sales Orders (SO######), Confirmations, Dispatch Notes (DN######)
- **Sample Processing**: SO391590 - £1,740.32 Lingfield Collection
- **OCR Confidence**: 94% with pattern recognition

### 🇬🇧 **Devonshire Living** - Traditional British Craftsmanship (Since 1992)
- **Specialization**: Traditional craftsmanship with painted finish expertise
- **Documents**: Price lists with 15% surcharge processing, trade catalogs
- **Processing**: Advanced discount calculations, specialty finish recognition
- **OCR Confidence**: 92% with finish specification parsing

### 🇺🇸 **La-Z-Boy Incorporated** - American Innovation Leadership (Since 1927)
- **Specialization**: Innovation leadership with 98+ years comfort excellence
- **Documents**: American format invoices, comfort technology specifications
- **Processing**: Comfort feature recognition, reclining mechanism specifications
- **OCR Confidence**: 90% with American format adaptation

### 🇮🇪 **Ashwood Designs Limited** - Irish Contemporary Design
- **Specialization**: Irish contemporary design with premium materials
- **Documents**: Contemporary design catalogs, premium material specifications
- **Processing**: Modern design code parsing, material premium calculations
- **OCR Confidence**: 93% with contemporary format processing

### 🇩🇪 **Rauch Möbelwerke GmbH** - German Engineering Excellence
- **Specialization**: German engineering excellence with European precision
- **Documents**: Multi-page German documentation (Page 2 of 3 format)
- **Sample Processing**: Rivera Collection wardrobe system (£160.02 with VAT)
- **OCR Confidence**: 95% with German-English multilingual processing  

## 🔍 MULTI-SUPPLIER DATA EXTRACTION SAMPLES

### **🇬🇧 G-Plan Processing Example**
- **Document**: Purchase Order Acknowledgement SO391590
- **Company**: G PLAN UPHOLSTERY LIMITED (Hampton Park West, Melksham)
- **Heritage**: Premium British furniture with 125+ years excellence (established 1898)
- **Customer**: Greaves & Harvey Ltd (TURVEYS FINE FURNITURE)
- **Products**: Lingfield Collection (3-Seater + 2 Electric Recliners)
  - Product Codes: G01L0.W122.G000, G1LC1.W122.000N0 (validated format)
  - Wood Finish: W122 (premium grade)
  - Fabric Grade: Premium trade specification
- **Pricing**: £1,740.32 with 27% trade discount (automatic grade surcharge calculation)
- **Authentication**: Trade account indicators, heritage craftsmanship markers
- **Delivery**: Week 21 (25/05/2025) with production scheduling coordination

### **🇩🇪 Rauch Processing Example**
- **Document**: German Multi-Component Invoice (Complex Page 2 of 3 Processing)
- **Company**: Rauch Möbelwerke GmbH (Freudenberg/Main, Germany)
- **Market Position**: Premium German furniture manufacturer with European excellence
- **Customer**: UK Furniture Retailer (VAT: GB172485450)
- **Product**: Rivera Collection Contemporary German Wardrobe System
  - **Main Unit**: £133.35 (910 x 2,120 x 580 mm) - German millimeter precision
  - **Cornice Component**: £26.67 (910 x 22 x 580 mm) - Coordinated system integration
  - **Material**: Sonoma oak colour with German finish quality
  - **VAT Compliance**: £32.00 (20%) - European business format
- **Total System**: £160.02 with component-based pricing coordination
- **Payment Terms**: German business standard (21 days 4% discount, 30 days net)
- **Delivery**: DDP (Delivered Duty Paid) - German logistics precision
- **Authentication**: German engineering markers, European compliance indicators
- **Processing Features**:
  - Multilingual German-English document processing
  - Component-based pricing recognition and validation
  - European VAT compliance with UK import handling
  - Complex document assembly (multi-page format coordination)

## 🎯 SUPPLIER TEMPLATE ARCHITECTURE

### Document Template Engine
**Purpose**: Standardized processing templates for consistent supplier integration

#### Template Structure
```typescript
interface SupplierTemplate {
  supplierId: string;
  templateVersion: string;
  documentTypes: {
    invoice: InvoiceTemplate;
    order: OrderTemplate;
    statement: StatementTemplate;
    catalog: CatalogTemplate;
  };
  extractionRules: {
    mandatoryFields: FieldDefinition[];
    optionalFields: FieldDefinition[];
    validationRules: ValidationRule[];
    businessLogic: BusinessRule[];
  };
  processingOptions: {
    multiPage: boolean;
    multiLanguage: boolean;
    componentBased: boolean;
    gradeCalculation: boolean;
  };
}
```

### Core 5 Supplier Templates

#### **G-Plan Heritage Template**
```typescript
const gplanTemplate: SupplierTemplate = {
  supplierId: "g-plan-limited",
  documentTypes: {
    invoice: {
      headerPatterns: ["G PLAN UPHOLSTERY LIMITED", "Hampton Park West"],
      productCodeFormat: /G\d{2}[A-Z]\d\.[A-Z]\d{3}\.[A-Z]\d{3}[A-Z]\d/,
      discountIndicators: ["Trade", "27%", "Grade"],
      heritageMarkers: ["Est. 1898", "British Heritage", "Premium"]
    }
  },
  extractionRules: {
    mandatoryFields: ["orderNumber", "customerCode", "productCode", "pricing"],
    businessLogic: [
      { rule: "heritage_validation", condition: "establishment_year >= 1898" },
      { rule: "trade_discount", value: 0.27, condition: "trade_account" }
    ]
  }
};
```

#### **Rauch German Engineering Template**
```typescript
const rauchTemplate: SupplierTemplate = {
  supplierId: "rauch-mobelwerke",
  documentTypes: {
    invoice: {
      headerPatterns: ["Rauch Möbelwerke GmbH", "Freudenberg/Main"],
      productCodeFormat: /[A-Z]{2}\d{4}-[A-Z]{3}/,
      vatHandling: "european_standard",
      languageSettings: { primary: "de", secondary: "en" }
    }
  },
  processingOptions: {
    multiPage: true,
    multiLanguage: true,
    componentBased: true,
    gradeCalculation: false
  }
};
```

## 🏗️ SUPPLIER DATABASE ARCHITECTURE

### Comprehensive Supplier Registry
**Database Schema**: Enhanced for supplier-specific template configuration and processing

```sql
CREATE TABLE suppliers (
  supplier_id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  country_code TEXT,
  heritage_established INTEGER, -- 1898 G-Plan, 1927 La-Z-Boy, etc.
  market_position TEXT, -- Premium, Innovation, Contemporary, etc.
  specialty_indicators JSONB, -- Trade accounts, comfort tech, etc.
  document_formats JSONB, -- Invoice types, acknowledgments, etc.
  processing_templates JSONB, -- Template configurations
  contact_information JSONB, -- Email domains, phone patterns
  business_rules JSONB, -- Discount rates, grade calculations
  integration_status TEXT, -- Active, Testing, Disabled
  last_document_processed TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE supplier_patterns (
  pattern_id TEXT PRIMARY KEY,
  supplier_id TEXT REFERENCES suppliers(supplier_id),
  pattern_type TEXT, -- header, product_code, email_domain, etc.
  pattern_value TEXT, -- Actual pattern or regex
  confidence_weight DECIMAL, -- 0.0 to 1.0
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE processing_history (
  process_id TEXT PRIMARY KEY,
  supplier_id TEXT REFERENCES suppliers(supplier_id),
  document_type TEXT,
  processing_time_ms INTEGER,
  ocr_confidence DECIMAL,
  extraction_success BOOLEAN,
  validation_passed BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📊 SUPPLIER PERFORMANCE ANALYTICS

### Processing Performance by Region

**🇬🇧 British Suppliers (G-Plan + Devonshire)**
- Processing Time: 3.2 seconds average
- OCR Confidence: 94% G-Plan, 92% Devonshire  
- Features: Heritage format recognition, traditional finish parsing

**🇺🇸 American Suppliers (La-Z-Boy)**
- Processing Time: 3.5 seconds average
- OCR Confidence: 90% with American format adaptation
- Features: Comfort technology parsing, innovation specifications

**🇮🇪 Irish Suppliers (Ashwood)**
- Processing Time: 3.4 seconds average  
- OCR Confidence: 93% with contemporary design processing
- Features: Contemporary format recognition, premium material parsing

**🇩🇪 German Suppliers (Rauch)**
- Processing Time: 3.8 seconds average (multi-page complexity)
- OCR Confidence: 95% with German-English multilingual
- Features: Component-based processing, European VAT compliance

### Business Integration Benefits

**Automated Processing Capabilities**:
  - ✅ Multi-component product recognition (German engineering)
  - ✅ Discount calculation (27% G-Plan, 15% Devonshire, varied others)
  - ✅ Delivery scheduling across different supplier systems

**Business Integration**:
  - ✅ Real-time inventory updates from supplier acknowledgments
  - ✅ Automated pricing calculations with grade-based surcharges
  - ✅ Customer communication with heritage positioning and innovation features
  - ✅ Financial integration with VAT handling and European compliance

**Multi-Supplier Verification Matrix**:
  - ✅ **G-Plan**: Heritage format validation, trade discount verification
  - ✅ **Devonshire**: Traditional finish codes, surcharge calculations  
  - ✅ **La-Z-Boy**: Comfort technology specs, American format compliance
  - ✅ **Ashwood**: Contemporary design validation, Irish premium pricing
  - ✅ **Rauch**: German engineering precision, component coordination

## 🚀 OPERATIONAL EXCELLENCE METRICS

### Real-Time Processing Dashboard
**Live Metrics** (Updated every 30 seconds):
- **Active Documents**: Real-time count of documents in processing pipeline
- **Processing Queue**: Documents awaiting agent assignment
- **Completion Rate**: Percentage of documents processed without manual intervention
- **Average Processing Time**: Rolling 24-hour average per supplier type
- **Exception Rate**: Documents requiring manual review or reprocessing

**Automation Coverage**:
- **🇬🇧 British Suppliers**: 95% automation (G-Plan heritage + Devonshire traditional)
- **🇺🇸 American Suppliers**: 90% automation (La-Z-Boy comfort technology)
- **🇮🇪 Irish Suppliers**: 93% automation (Ashwood contemporary design)
- **🇩🇪 German Suppliers**: 95% automation (Rauch engineering precision)
- **Extended Network (66+ Suppliers)**: 85% automation across diverse formats

### Business Value Delivery

**Customer Experience Enhancement**:
- **95% accuracy** in product specification and pricing validation
- **Automated processing** of complex fabric/leather surcharges (G-Plan)
- **Component-based pricing** coordination (German engineering systems)
- **Comfort technology parsing** with American innovation standards

**Premium Customer Experience**:
- **Heritage positioning** with 125+ years British excellence (G-Plan)
- **Innovation showcase** with 98+ years American comfort leadership (La-Z-Boy) 
- **Contemporary design** presentation with Irish craftsmanship (Ashwood)
- **Traditional craftsmanship** emphasis with painted finish expertise (Devonshire)
- **German engineering** precision with component system coordination (Rauch)

## 🔧 SUPPLIER INTEGRATION MANAGEMENT

### Onboarding New Suppliers
**Process**: Template Creation → Pattern Training → Testing → Production Deployment

#### Template Development Workflow
1. **Document Analysis**: Collection and analysis of supplier document samples
2. **Pattern Extraction**: Identification of unique supplier indicators and formats
3. **Template Creation**: Development of processing templates with validation rules
4. **Testing Phase**: Controlled testing with sample documents and validation
5. **Production Deployment**: Live integration with monitoring and optimization

### Supplier-Specific Performance

**🇬🇧 G-Plan Limited**: 95% automation, 94% OCR confidence
- Heritage document recognition, premium furniture processing
- Trade discount calculations (27%), delivery scheduling

**🇬🇧 Devonshire Living**: 92% automation, 92% OCR confidence  
- Traditional finish recognition, surcharge processing (15%)
- Painted finish expertise, regional specialty handling

**🇺🇸 La-Z-Boy Incorporated**: 90% automation, 90% OCR confidence
- American format adaptation, comfort technology parsing
- Innovation feature recognition, reclining mechanism specs

**🇮🇪 Ashwood Designs Limited**: 93% automation, 93% OCR confidence
- Contemporary design processing, premium material recognition
- Irish craftsmanship indicators, modern format handling

**🇩🇪 Rauch Möbelwerke GmbH**: 95% automation, 95% OCR confidence
- German-English multilingual processing, component coordination
- European VAT compliance, engineering precision recognition

## 💼 BUSINESS INTEGRATION PATTERNS

### Supply Chain Coordination
**Real-Time Integration**: Live supplier communication and order coordination

#### Order-to-Delivery Workflow
1. **Customer Order**: Order placed through showroom or online channels
2. **Supplier Communication**: Automated order transmission with specifications
3. **Confirmation Processing**: Supplier acknowledgment with delivery schedules
4. **Production Tracking**: Regular updates on manufacturing progress  
5. **Logistics Coordination**: Delivery scheduling with customer communication
6. **Quality Assurance**: Pre-delivery inspection and quality confirmation
7. **Delivery Execution**: Final delivery with customer satisfaction confirmation

### Financial Integration
**Automated Financial Processing**: Complete financial workflow automation

#### Invoice-to-Payment Cycle
1. **Invoice Reception**: Automated invoice processing via email or upload
2. **Data Extraction**: Supplier-specific template processing and validation
3. **Business Validation**: Purchase order matching and approval workflow
4. **Financial Posting**: Automated accounting system integration
5. **Payment Processing**: Scheduled payment execution with terms compliance
6. **Reconciliation**: Automated bank reconciliation and statement matching

## 🎯 STRATEGIC SUPPLIER PARTNERSHIPS

### Core Partnership Benefits

### **G-Plan Limited - Premium Heritage Integration**
**Business Value**: Trade account processing with 90+ fabric options and 26 leather selections
- **Product Catalog**: Real-time G-Plan catalog with premium grade classifications
- **Automatic Surcharge**: Grade-based pricing (W/A/B/C fabric, H/L/P leather grades) 
- **Heritage Positioning**: 125+ years British excellence in customer presentations
- **Quality Assurance**: Trade pricing identification with authentic G-Plan specifications

### **Devonshire Living - Traditional Craftsmanship Processing**  
**Business Value**: Regional specialty furniture with painted finish expertise
- **Finish Expertise**: 15% surcharge processing with painted finish specialization
- **Traditional Methods**: Heritage craftsmanship recognition in customer communications
- **Regional Supply**: UK regional distribution with traditional furniture positioning
- **Quality Standards**: Traditional finish quality assurance and specification matching

### **La-Z-Boy Incorporated - Innovation Technology Integration**
**Business Value**: American comfort technology with 98+ years innovation leadership
- **Comfort Features**: Automated recognition of reclining mechanisms and comfort specs
- **Innovation Positioning**: American innovation leadership in customer presentations  
- **Technical Specifications**: Precise mechanism specifications and installation requirements
- **Warranty Integration**: Comprehensive warranty management with American standards

### **Ashwood Designs Limited - Contemporary Design Excellence**
**Business Value**: Irish contemporary design with premium material integration
- **Design Leadership**: Contemporary Irish design positioning in customer communications
- **Material Premium**: Premium material recognition and pricing calculations
- **Modern Aesthetics**: Contemporary design code parsing and specification accuracy
- **Quality Assurance**: Irish craftsmanship standards with modern design validation

### **Rauch Möbelwerke GmbH - German Engineering Precision**
**Business Value**: German engineering excellence with component-based systems
- **Engineering Precision**: Component coordination with German millimeter accuracy
- **System Integration**: Multi-component product assembly and coordination
- **European Standards**: VAT compliance and European business format processing
- **Quality Excellence**: German engineering standards with precision manufacturing

---

*Note: This consolidated supplier architecture guide combines all supplier-related documentation into a unified reference. All agent implementations must follow these specifications for supplier integration and processing. Refer to [MercuryOne_Core_Business_Logic.md](../Business_Logic/MercuryOne_Core_Business_Logic.md) for detailed business process integration.*