# MercuryOne UK Compliance Guide (CRITICAL)

## Navigation
- For system overview: [MercuryOne_System_Overview.md](../Overviews/MercuryOne_System_Overview.md)
- For technical architecture: [MercuryOne_Technical_Architecture.md](../Architecture/MercuryOne_Technical_Architecture.md)
- For agents/protocol: [MercuryOne_Agent_Protocol.md](../Architecture/MercuryOne_Agent_Protocol.md)
- For business logic: [MercuryOne_Core_Business_Logic.md](../Business_Logic/MercuryOne_Core_Business_Logic.md)
- For suppliers: [MercuryOne_Supplier_Architecture_Guide.md](../Suppliers/MercuryOne_Supplier_Architecture_Guide.md)
- For integrations: [Morpheus_Integration_Guide.md](../Integrations/Morpheus_Integration_Guide.md)
- For roadmaps: [MercuryOne_Development_Roadmap.csv](../Roadmaps/MercuryOne_Development_Roadmap.csv)

---

**Version:** v1.1  
**Last Updated:** August 11, 2025  
**Status:** ✅ CRITICAL BUSINESS DOCUMENTATION — Legal compliance requirements

---

## CHANGE LOG
- **2025-08-06**: ELEVATED TO CRITICAL STATUS - Protected legal compliance documentation
- **2025-08-06**: Updated agent references to AGENT_COMMUNICATION_PROTOCOL.md
- **2025-07-31**: Initial master documentation creation in /Documentation folder

---

## 🎯 COMPLIANCE SCOPE

MercuryOne operates as a British business system and must maintain strict compliance with:
- **UK GDPR** (Data Protection Act 2018, as amended by Data (Use and Access) Act 2025 - DUAA, phased implementation through 2026)
- **UK VAT Regulations** (HMRC Requirements with 2025 updates: EU import safety/security declarations, 20% VAT on private school fees, UK-wide medicines licensing)
- **Financial Audit Standards** (UK Financial Reporting with DUAA 2025 data innovation compliance)
- **Business Registration Requirements** (Companies House)

---

## 🛡️ GDPR ENFORCEMENT (Agent-Monitored)

### Data Protection by Design
- **Mars Agent**: Enforces data access controls and session security
- **Athena Agent**: Monitors data processing compliance and audit trails
- **Neptune Agent**: Validates financial data handling and retention

### Personal Data Handling
```typescript
// Customer data fields (GDPR protected)
interface CustomerData {
  id: string;              // Business identifier only
  name: string;            // Encrypted in logs
  email: string;           // Masked in reports  
  phone?: string;          // Optional, encrypted
  address: string;         // Encrypted, audit logged
  totalOrders: number;     // Aggregated only
  totalSpent: number;      // Financial audit trail
  lastOrderDate: Date;     // Retention policy applied
}
```

### GDPR Compliance Agents

> **Agent Building Reference**: For detailed agent implementation guidance, refer to `Critical Documentation/AGENT_COMMUNICATION_PROTOCOL.md`

- **Janus**: Audit logs all customer data access and modifications
- **Vulcan**: Identifies and flags potential data protection violations
- **Hercules**: Tests data anonymization and deletion procedures
- **Saturn**: Alerts on data retention policy violations

### Data Subject Rights (Automated)
- **Right to Access**: Automated data export via `/profile` system
- **Right to Rectification**: Customer profile editing with audit trail
- **Right to Erasure**: Anonymization workflow triggered by customer request
- **Data Portability**: JSON/CSV export of customer data on request

---

## 💷 VAT COMPLIANCE (Neptune-Managed)

### VAT Rate Validation
```typescript
// UK VAT codes (HMRC compliant)
interface VATCode {
  code: string;           // Standard, Reduced, Zero, Exempt
  rate: number;           // 20%, 5%, 0%, N/A
  description: string;    // HMRC category description
  isDefault: boolean;     // Default for product category
  hmrcReference: string;  // Official HMRC code
}
```

### Neptune VAT Enforcement
- **Real-time Validation**: Checks VAT codes against HMRC rates
- **Xero Synchronization**: Validates VAT calculations with accounting system
- **Compliance Reporting**: Generates VAT return preparation data
- **Audit Trail**: Logs all VAT rate changes and calculations

### VAT Compliance Checks
- **Product VAT Assignment**: All products must have valid VAT codes
- **Invoice VAT Calculation**: Automatic VAT computation and validation
- **Xero VAT Reconciliation**: Daily sync validates VAT consistency
- **HMRC Rate Updates**: Automatic VAT rate updates from official sources

---

## 📊 FINANCIAL AUDIT COMPLIANCE

### Audit Logging (Jupiter Coordination)
```typescript
// Audit trail structure
interface AuditLog {
  id: string;
  timestamp: Date;        // ISO 8601 format
  userId: string;         // User performing action
  action: string;         // Specific action taken
  entityType: string;     // customers, orders, products, etc.
  entityId: string;       // ID of affected entity
  beforeState?: object;   // Pre-change state
  afterState: object;     // Post-change state
  ipAddress: string;      // Security audit
  sessionId: string;      // Session tracking
  complianceFlags: string[]; // GDPR, VAT, DUAA2025, VAT2025, etc.
  duaaCompliance: boolean; // DUAA 2025 compliance flag for data innovation tracking
  vatCompliance2025: boolean; // 2025 VAT regulation compliance flag
}
```

---

## 🔒 FINAL COMPLIANCE STATEMENT

UK compliance is non-negotiable for MercuryOne operations.  
All agents actively monitor and enforce compliance requirements.  
Violations trigger immediate remediation and regulatory notification.