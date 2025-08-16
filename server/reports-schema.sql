-- Business Patch 007: Reports Complete Dashboard Schema
-- Comprehensive Business Intelligence and Reporting for UK Furniture Retail

-- Report definitions and templates
CREATE TABLE IF NOT EXISTS report_templates (
  id SERIAL PRIMARY KEY,
  report_name TEXT NOT NULL,
  report_category TEXT NOT NULL CHECK (report_category IN ('financial', 'sales', 'inventory', 'suppliers', 'customers')),
  report_type TEXT NOT NULL CHECK (report_type IN ('summary', 'detailed', 'analytical', 'comparison')),
  description TEXT,
  sql_query TEXT, -- Base SQL for data retrieval
  parameters JSONB DEFAULT '{}', -- Report parameters and filters
  chart_config JSONB DEFAULT '{}', -- Chart display configuration
  table_config JSONB DEFAULT '{}', -- Table display configuration
  schedule_config JSONB DEFAULT '{}', -- Automated scheduling settings
  access_roles TEXT[] DEFAULT '{}', -- User roles that can access this report
  created_by INTEGER REFERENCES users(id),
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Generated report instances
CREATE TABLE IF NOT EXISTS report_instances (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES report_templates(id) NOT NULL,
  instance_name TEXT NOT NULL,
  generated_by INTEGER REFERENCES users(id),
  generated_date TIMESTAMP DEFAULT NOW() NOT NULL,
  parameters_used JSONB DEFAULT '{}', -- Parameters used for this instance
  data_from_date DATE,
  data_to_date DATE,
  status TEXT DEFAULT 'generating' NOT NULL CHECK (status IN ('generating', 'completed', 'failed')),
  file_path TEXT, -- Path to generated file (PDF, Excel, etc.)
  file_size INTEGER,
  record_count INTEGER,
  generation_time_seconds INTEGER,
  error_message TEXT,
  shared_with TEXT[] DEFAULT '{}', -- User IDs who have access
  expires_at TIMESTAMP, -- Auto-deletion date
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Dashboard configurations
CREATE TABLE IF NOT EXISTS dashboards (
  id SERIAL PRIMARY KEY,
  dashboard_name TEXT NOT NULL,
  dashboard_type TEXT NOT NULL CHECK (dashboard_type IN ('executive', 'sales', 'operations', 'financial')),
  description TEXT,
  layout_config JSONB NOT NULL DEFAULT '{}', -- Widget positions and sizes
  refresh_interval INTEGER DEFAULT 300, -- Seconds between auto-refresh
  access_roles TEXT[] DEFAULT '{}', -- User roles that can access
  is_default BOOLEAN DEFAULT false,
  created_by INTEGER REFERENCES users(id),
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Dashboard widgets
CREATE TABLE IF NOT EXISTS dashboard_widgets (
  id SERIAL PRIMARY KEY,
  dashboard_id INTEGER REFERENCES dashboards(id) NOT NULL,
  widget_name TEXT NOT NULL,
  widget_type TEXT NOT NULL CHECK (widget_type IN ('kpi', 'chart', 'table', 'gauge', 'trend')),
  data_source TEXT NOT NULL, -- SQL query or API endpoint
  chart_type TEXT CHECK (chart_type IN ('line', 'bar', 'pie', 'doughnut', 'area')), -- 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  refresh_interval INTEGER DEFAULT 300,
  display_config JSONB DEFAULT '{}', -- Colors, formatting, etc.
  filter_config JSONB DEFAULT '{}', -- Available filters
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Key Performance Indicators tracking
CREATE TABLE IF NOT EXISTS kpi_definitions (
  id SERIAL PRIMARY KEY,
  kpi_name TEXT NOT NULL,
  kpi_category TEXT NOT NULL CHECK (kpi_category IN ('financial', 'sales', 'operational', 'customer')),
  description TEXT,
  calculation_formula TEXT NOT NULL, -- SQL or formula
  target_value DECIMAL(12,2),
  warning_threshold DECIMAL(12,2),
  critical_threshold DECIMAL(12,2),
  unit_of_measure TEXT, -- '£', '%', 'days', 'count'
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  trend_direction TEXT DEFAULT 'higher_better' NOT NULL CHECK (trend_direction IN ('higher_better', 'lower_better')),
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Historical KPI values
CREATE TABLE IF NOT EXISTS kpi_values (
  id SERIAL PRIMARY KEY,
  kpi_id INTEGER REFERENCES kpi_definitions(id) NOT NULL,
  period_date DATE NOT NULL,
  actual_value DECIMAL(12,2) NOT NULL,
  target_value DECIMAL(12,2),
  variance_value DECIMAL(12,2), -- actual - target
  variance_percent DECIMAL(5,2), -- (actual - target) / target * 100
  status TEXT NOT NULL CHECK (status IN ('excellent', 'good', 'warning', 'critical')),
  notes TEXT,
  calculated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(kpi_id, period_date)
);

-- Report scheduling
CREATE TABLE IF NOT EXISTS report_schedules (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES report_templates(id) NOT NULL,
  schedule_name TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  schedule_time TIME, -- Time of day to run
  schedule_day INTEGER, -- Day of week (1-7) or month (1-31)
  parameters JSONB DEFAULT '{}', -- Default parameters for scheduled run
  email_recipients TEXT[] DEFAULT '{}', -- Email addresses to send to
  email_subject TEXT,
  email_body TEXT,
  last_run_date TIMESTAMP,
  next_run_date TIMESTAMP,
  active BOOLEAN DEFAULT true NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Sales analytics cache (for performance)
CREATE TABLE IF NOT EXISTS sales_analytics_cache (
  id SERIAL PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  cache_date DATE NOT NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('daily_sales', 'product_performance', 'customer_analysis', 'sales_analytics')),
  aggregation_level TEXT CHECK (aggregation_level IN ('daily', 'weekly', 'monthly')),
  data_payload JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Financial accounts for balance sheet and P&L (if not exists)
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id SERIAL PRIMARY KEY,
  account_code TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  balance_sheet_category TEXT CHECK (balance_sheet_category IN ('current_assets', 'fixed_assets', 'current_liabilities', 'long_term_liabilities', 'equity')),
  current_balance DECIMAL(12,2) DEFAULT 0.00,
  trial_balance_order INTEGER,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Journal entries for financial reporting (if not exists)
CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  entry_number TEXT NOT NULL UNIQUE,
  entry_date DATE NOT NULL,
  description TEXT NOT NULL,
  reference TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'reversed')),
  total_debit DECIMAL(12,2) NOT NULL,
  total_credit DECIMAL(12,2) NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Journal entry lines
CREATE TABLE IF NOT EXISTS journal_entry_lines (
  id SERIAL PRIMARY KEY,
  journal_entry_id INTEGER REFERENCES journal_entries(id) NOT NULL,
  account_id INTEGER REFERENCES chart_of_accounts(id) NOT NULL,
  debit_amount DECIMAL(12,2) DEFAULT 0.00,
  credit_amount DECIMAL(12,2) DEFAULT 0.00,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Orders table extensions (if columns don't exist)
DO $$
BEGIN
  -- Add order_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'order_date'
  ) THEN
    ALTER TABLE orders ADD COLUMN order_date TIMESTAMP DEFAULT NOW();
  END IF;
  
  -- Add total_amount column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0.00;
  END IF;
  
  -- Add vat_amount column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'vat_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN vat_amount DECIMAL(10,2) DEFAULT 0.00;
  END IF;
  
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'status'
  ) THEN
    ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'processing', 'completed', 'cancelled'));
  END IF;
END
$$;

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  order_date TIMESTAMP DEFAULT NOW() NOT NULL,
  total_amount DECIMAL(10,2) DEFAULT 0.00,
  vat_amount DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Purchase orders table for supplier reports (if not exists)
CREATE TABLE IF NOT EXISTS purchase_orders (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id) NOT NULL,
  po_number TEXT NOT NULL UNIQUE,
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  delivered_date DATE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Customer feedback table for satisfaction KPI
CREATE TABLE IF NOT EXISTS customer_feedback (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  order_id INTEGER REFERENCES orders(id),
  rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
  feedback_text TEXT,
  feedback_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_templates_category ON report_templates(report_category);
CREATE INDEX IF NOT EXISTS idx_report_instances_template_id ON report_instances(template_id);
CREATE INDEX IF NOT EXISTS idx_report_instances_generated_date ON report_instances(generated_date);

CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_dashboard_id ON dashboard_widgets(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_type ON dashboard_widgets(widget_type);

CREATE INDEX IF NOT EXISTS idx_kpi_values_kpi_id ON kpi_values(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_values_period_date ON kpi_values(period_date);
CREATE INDEX IF NOT EXISTS idx_kpi_values_status ON kpi_values(status);

CREATE INDEX IF NOT EXISTS idx_sales_analytics_cache_key ON sales_analytics_cache(cache_key, cache_date);
CREATE INDEX IF NOT EXISTS idx_sales_analytics_cache_type ON sales_analytics_cache(data_type, aggregation_level);
CREATE INDEX IF NOT EXISTS idx_sales_analytics_cache_expires ON sales_analytics_cache(expires_at);

CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_status ON journal_entries(status);
CREATE INDEX IF NOT EXISTS idx_journal_entry_lines_account_id ON journal_entry_lines(account_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
DROP TRIGGER IF EXISTS update_report_templates_updated_at ON report_templates;
CREATE TRIGGER update_report_templates_updated_at BEFORE UPDATE ON report_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dashboards_updated_at ON dashboards;
CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dashboard_widgets_updated_at ON dashboard_widgets;
CREATE TRIGGER update_dashboard_widgets_updated_at BEFORE UPDATE ON dashboard_widgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chart_of_accounts_updated_at ON chart_of_accounts;
CREATE TRIGGER update_chart_of_accounts_updated_at BEFORE UPDATE ON chart_of_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_journal_entries_updated_at ON journal_entries;
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchase_orders_updated_at ON purchase_orders;
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
