-- Customers with UK-specific fields
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  type TEXT DEFAULT 'individual' NOT NULL, -- 'individual' | 'business'
  title TEXT, -- "Mr", "Mrs", "Dr", "Prof"
  first_name TEXT,
  last_name TEXT,
  company_name TEXT, -- For business customers
  email TEXT,
  phone TEXT,
  mobile TEXT,
  -- UK Address Standards
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  county TEXT, -- UK county
  postcode TEXT, -- UK postcode format
  country TEXT DEFAULT 'United Kingdom',
  -- Business details
  date_of_birth DATE,
  marketing_preferences JSONB DEFAULT '{}', -- Email, phone, post, SMS
  notes TEXT,
  credit_limit DECIMAL(10,2) DEFAULT 0.00,
  payment_terms INTEGER DEFAULT 30, -- Days
  vat_number TEXT, -- For business customers
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Customer contacts for business customers
CREATE TABLE customer_contacts (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) NOT NULL,
  contact_type TEXT NOT NULL, -- 'primary' | 'billing' | 'delivery' | 'accounts'
  title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  position TEXT, -- Job title
  email TEXT,
  phone TEXT,
  mobile TEXT,
  notes TEXT,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Customer addresses for multiple delivery locations
CREATE TABLE customer_addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) NOT NULL,
  address_type TEXT NOT NULL, -- 'billing' | 'delivery' | 'work' | 'other'
  address_name TEXT, -- "Home", "Office", "Holiday Home"
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  county TEXT,
  postcode TEXT NOT NULL,
  country TEXT DEFAULT 'United Kingdom',
  delivery_instructions TEXT,
  is_default BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Communication log
CREATE TABLE customer_communications (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) NOT NULL,
  communication_type TEXT NOT NULL, -- 'email' | 'phone' | 'letter' | 'visit'
  direction TEXT NOT NULL, -- 'inbound' | 'outbound'
  subject TEXT,
  content TEXT,
  staff_member TEXT,
  communication_date TIMESTAMP DEFAULT NOW() NOT NULL,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
