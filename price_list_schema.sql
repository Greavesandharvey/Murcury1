-- Price list imports and tracking
CREATE TABLE price_list_imports (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  original_file_path TEXT,
  import_date TIMESTAMP DEFAULT NOW() NOT NULL,
  imported_by INTEGER REFERENCES users(id),
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending' | 'processing' | 'review' | 'approved' | 'rejected' | 'applied'
  total_rows INTEGER DEFAULT 0,
  processed_rows INTEGER DEFAULT 0,
  valid_rows INTEGER DEFAULT 0,
  error_rows INTEGER DEFAULT 0,
  notes TEXT,
  review_date TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id),
  applied_date TIMESTAMP,
  applied_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Individual price list items before approval
CREATE TABLE price_list_items (
  id SERIAL PRIMARY KEY,
  import_id INTEGER REFERENCES price_list_imports(id) NOT NULL,
  row_number INTEGER NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id) NOT NULL,
  -- Product identification (multiple possible fields)
  supplier_sku TEXT,
  model TEXT,
  type TEXT,
  material TEXT,
  description TEXT,
  -- Pricing information
  current_cost_price DECIMAL(10,2),
  new_cost_price DECIMAL(10,2) NOT NULL,
  cost_price_change DECIMAL(10,2), -- Calculated difference
  cost_price_change_percent DECIMAL(5,2), -- Percentage change
  current_selling_price DECIMAL(10,2),
  suggested_selling_price DECIMAL(10,2),
  new_selling_price DECIMAL(10,2),
  margin_percent DECIMAL(5,2), -- Calculated margin
  -- Product matching
  matched_product_id INTEGER REFERENCES products(id),
  match_confidence INTEGER DEFAULT 0, -- 0-100 confidence score
  match_method TEXT, -- 'exact_sku' | 'fuzzy_name' | 'manual' | 'none'
  -- Status and validation
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending' | 'matched' | 'unmatched' | 'approved' | 'rejected'
  validation_errors TEXT[], -- Array of error messages
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Pricing rules and margins
CREATE TABLE pricing_rules (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id),
  category_id INTEGER REFERENCES categories(id),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL, -- 'margin_percent' | 'markup_percent' | 'fixed_amount'
  rule_value DECIMAL(10,2) NOT NULL,
  minimum_margin_percent DECIMAL(5,2) DEFAULT 20.00, -- Minimum margin protection
  applies_to TEXT DEFAULT 'all' NOT NULL, -- 'all' | 'new_products' | 'existing_products'
  active BOOLEAN DEFAULT true NOT NULL,
  priority INTEGER DEFAULT 0, -- Higher number = higher priority
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Price change history
CREATE TABLE price_change_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  import_id INTEGER REFERENCES price_list_imports(id),
  change_type TEXT NOT NULL, -- 'cost_price' | 'selling_price' | 'both'
  old_cost_price DECIMAL(10,2),
  new_cost_price DECIMAL(10,2),
  old_selling_price DECIMAL(10,2),
  new_selling_price DECIMAL(10,2),
  margin_change DECIMAL(5,2), -- Margin difference
  reason TEXT, -- 'supplier_update' | 'manual_adjustment' | 'margin_rule'
  changed_by INTEGER REFERENCES users(id),
  effective_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
