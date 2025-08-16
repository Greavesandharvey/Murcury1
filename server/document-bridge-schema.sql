-- DocumentMatcher Bridge Schema (Patch 006)
-- Implements document linking service with confidence scoring and passport lifecycle integration

-- Document passports for the business process spine
CREATE TABLE IF NOT EXISTS document_passports (
  id SERIAL PRIMARY KEY,
  passport_id TEXT NOT NULL UNIQUE,
  document_id TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('invoice', 'order', 'quote', 'receipt', 'statement', 'price_list')),
  current_phase TEXT NOT NULL DEFAULT 'intake' CHECK (current_phase IN ('intake', 'identification', 'extraction', 'processing', 'integration', 'completed', 'failed')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'exception')),
  
  -- Document metadata
  supplier_id INTEGER REFERENCES suppliers(id),
  customer_id INTEGER REFERENCES customers(id),
  order_id TEXT,
  total_value DECIMAL(10,2),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Processing tracking
  current_agent TEXT,
  next_agent TEXT,
  escalation_path JSONB DEFAULT '[]',
  business_rules JSONB DEFAULT '{}',
  
  -- Confidence and quality metrics
  confidence_score DECIMAL(3,2) DEFAULT 0.00 CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00),
  quality_metrics JSONB DEFAULT '{}',
  
  -- Audit trail
  phase_history JSONB DEFAULT '[]',
  agent_actions JSONB DEFAULT '[]',
  business_events JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP
);

-- Document processing queue for agent coordination
CREATE TABLE IF NOT EXISTS document_processing_queue (
  id SERIAL PRIMARY KEY,
  passport_id TEXT NOT NULL REFERENCES document_passports(passport_id),
  agent_name TEXT NOT NULL,
  processing_stage TEXT NOT NULL,
  priority INTEGER DEFAULT 50,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Processing context
  processing_context JSONB DEFAULT '{}',
  error_details JSONB,
  
  -- Status tracking
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'retrying')),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Document confidence tracking for pattern learning
CREATE TABLE IF NOT EXISTS document_confidence_tracking (
  id SERIAL PRIMARY KEY,
  passport_id TEXT NOT NULL REFERENCES document_passports(passport_id),
  supplier_id INTEGER REFERENCES suppliers(id),
  
  -- Pattern confidence scores
  supplier_identification_confidence DECIMAL(3,2) DEFAULT 0.00,
  document_type_confidence DECIMAL(3,2) DEFAULT 0.00,
  field_extraction_confidence DECIMAL(3,2) DEFAULT 0.00,
  business_validation_confidence DECIMAL(3,2) DEFAULT 0.00,
  
  -- Pattern details
  identified_patterns JSONB DEFAULT '{}',
  extraction_results JSONB DEFAULT '{}',
  validation_results JSONB DEFAULT '{}',
  
  -- Learning feedback
  manual_corrections JSONB DEFAULT '{}',
  accuracy_feedback BOOLEAN,
  feedback_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Agent communication log for debugging and monitoring
CREATE TABLE IF NOT EXISTS agent_communication_log (
  id SERIAL PRIMARY KEY,
  passport_id TEXT REFERENCES document_passports(passport_id),
  
  -- Communication details
  source_agent TEXT NOT NULL,
  target_agent TEXT NOT NULL,
  message_type TEXT NOT NULL,
  message_content JSONB NOT NULL,
  
  -- Status tracking
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'processed', 'failed')),
  response_content JSONB,
  processing_time_ms INTEGER,
  
  -- Error handling
  error_details JSONB,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Morpheus integration tracking
CREATE TABLE IF NOT EXISTS morpheus_document_bridge (
  id SERIAL PRIMARY KEY,
  passport_id TEXT NOT NULL REFERENCES document_passports(passport_id),
  
  -- Morpheus document details
  morpheus_document_id TEXT NOT NULL,
  morpheus_processing_stage TEXT,
  morpheus_status TEXT,
  
  -- OCR and processing results
  ocr_confidence DECIMAL(3,2),
  ocr_results JSONB DEFAULT '{}',
  supplier_identified BOOLEAN DEFAULT false,
  data_extraction_success BOOLEAN DEFAULT false,
  validation_passed BOOLEAN DEFAULT false,
  
  -- Bridge status
  bridge_status TEXT DEFAULT 'pending' CHECK (bridge_status IN ('pending', 'linked', 'processing', 'completed', 'failed')),
  link_confidence DECIMAL(3,2) DEFAULT 0.00,
  
  -- Integration timestamps
  morpheus_captured_at TIMESTAMP,
  bridge_linked_at TIMESTAMP,
  processing_completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Performance metrics for monitoring
CREATE TABLE IF NOT EXISTS document_bridge_metrics (
  id SERIAL PRIMARY KEY,
  metric_date DATE DEFAULT CURRENT_DATE,
  
  -- Processing volumes
  documents_processed INTEGER DEFAULT 0,
  successful_matches INTEGER DEFAULT 0,
  failed_matches INTEGER DEFAULT 0,
  manual_interventions INTEGER DEFAULT 0,
  
  -- Performance metrics
  average_processing_time_seconds DECIMAL(8,2),
  average_confidence_score DECIMAL(3,2),
  supplier_identification_accuracy DECIMAL(3,2),
  data_extraction_accuracy DECIMAL(3,2),
  
  -- Agent performance
  agent_performance_metrics JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  UNIQUE(metric_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_document_passports_passport_id ON document_passports(passport_id);
CREATE INDEX IF NOT EXISTS idx_document_passports_current_phase ON document_passports(current_phase);
CREATE INDEX IF NOT EXISTS idx_document_passports_status ON document_passports(status);
CREATE INDEX IF NOT EXISTS idx_document_passports_supplier_id ON document_passports(supplier_id);
CREATE INDEX IF NOT EXISTS idx_document_passports_created_at ON document_passports(created_at);

CREATE INDEX IF NOT EXISTS idx_processing_queue_agent_name ON document_processing_queue(agent_name);
CREATE INDEX IF NOT EXISTS idx_processing_queue_status ON document_processing_queue(status);
CREATE INDEX IF NOT EXISTS idx_processing_queue_priority ON document_processing_queue(priority DESC);

CREATE INDEX IF NOT EXISTS idx_confidence_tracking_passport_id ON document_confidence_tracking(passport_id);
CREATE INDEX IF NOT EXISTS idx_confidence_tracking_supplier_id ON document_confidence_tracking(supplier_id);

CREATE INDEX IF NOT EXISTS idx_agent_communication_passport_id ON agent_communication_log(passport_id);
CREATE INDEX IF NOT EXISTS idx_agent_communication_created_at ON agent_communication_log(created_at);

CREATE INDEX IF NOT EXISTS idx_morpheus_bridge_passport_id ON morpheus_document_bridge(passport_id);
CREATE INDEX IF NOT EXISTS idx_morpheus_bridge_document_id ON morpheus_document_bridge(morpheus_document_id);
CREATE INDEX IF NOT EXISTS idx_morpheus_bridge_status ON morpheus_document_bridge(bridge_status);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_document_passports_updated_at BEFORE UPDATE ON document_passports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_processing_queue_updated_at BEFORE UPDATE ON document_processing_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_confidence_tracking_updated_at BEFORE UPDATE ON document_confidence_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_communication_updated_at BEFORE UPDATE ON agent_communication_log FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_morpheus_bridge_updated_at BEFORE UPDATE ON morpheus_document_bridge FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bridge_metrics_updated_at BEFORE UPDATE ON document_bridge_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
