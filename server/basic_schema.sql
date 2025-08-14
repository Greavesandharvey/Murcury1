-- Basic schema with required tables for price list functionality

-- Check if users table exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      role TEXT DEFAULT 'user' NOT NULL, -- 'admin' | 'user' | 'manager'
      active BOOLEAN DEFAULT true NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
    
    -- Insert a default admin user
    INSERT INTO users (username, email, password_hash, first_name, last_name, role)
    VALUES ('admin', 'admin@mercuryone.com', 'password_hash_placeholder', 'Admin', 'User', 'admin');
  END IF;
END
$$;

-- Check if suppliers table exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'suppliers') THEN
    -- Create suppliers table
    CREATE TABLE suppliers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      contact_name TEXT,
      email TEXT,
      phone TEXT,
      address_line_1 TEXT,
      address_line_2 TEXT,
      city TEXT,
      county TEXT,
      postcode TEXT,
      country TEXT DEFAULT 'United Kingdom',
      vat_number TEXT,
      website TEXT,
      payment_terms INTEGER DEFAULT 30,
      minimum_margin DECIMAL(5,2) DEFAULT 30.00,
      pricing_rule_id INTEGER,
      active BOOLEAN DEFAULT true NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  END IF;
END
$$;

-- Add code column to suppliers if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'suppliers' AND column_name = 'code'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN code TEXT UNIQUE;
  END IF;
END
$$;

-- Insert sample suppliers if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM suppliers WHERE name = 'G-Plan Furniture') THEN
    INSERT INTO suppliers (name, code, contact_name, email, minimum_margin)
    VALUES ('G-Plan Furniture', 'GPLAN', 'John Smith', 'contact@gplan.com', 35.00);
  END IF;
  
  IF NOT EXISTS (SELECT FROM suppliers WHERE name = 'Parker Knoll') THEN
    INSERT INTO suppliers (name, code, contact_name, email, minimum_margin)
    VALUES ('Parker Knoll', 'PARKER', 'Jane Doe', 'sales@parkerknoll.com', 40.00);
  END IF;
  
  IF NOT EXISTS (SELECT FROM suppliers WHERE name = 'Alstons Upholstery') THEN
    INSERT INTO suppliers (name, code, contact_name, email, minimum_margin)
    VALUES ('Alstons Upholstery', 'ALSTONS', 'Mike Johnson', 'info@alstons.com', 30.00);
  END IF;
  
  IF NOT EXISTS (SELECT FROM suppliers WHERE name = 'Ercol Furniture') THEN
    INSERT INTO suppliers (name, code, contact_name, email, minimum_margin)
    VALUES ('Ercol Furniture', 'ERCOL', 'Sarah Williams', 'orders@ercol.com', 45.00);
  END IF;
END
$$;

-- Check if products table exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    -- Create products table
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      sku TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      supplier_id INTEGER REFERENCES suppliers(id),
      category_id INTEGER,
      model TEXT,
      type TEXT,
      material TEXT,
      cost_price DECIMAL(10,2) NOT NULL,
      selling_price DECIMAL(10,2) NOT NULL,
      stock_quantity INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  END IF;
END
$$;

-- Make sure products table has all required columns
DO $$
BEGIN
  -- Add model column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'model'
  ) THEN
    ALTER TABLE products ADD COLUMN model TEXT;
  END IF;
  
  -- Add type column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'type'
  ) THEN
    ALTER TABLE products ADD COLUMN type TEXT;
  END IF;
  
  -- Add material column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'material'
  ) THEN
    ALTER TABLE products ADD COLUMN material TEXT;
  END IF;
  
  -- Add cost_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'cost_price'
  ) THEN
    ALTER TABLE products ADD COLUMN cost_price DECIMAL(10,2) DEFAULT 0.00 NOT NULL;
  END IF;
  
  -- Add selling_price column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'selling_price'
  ) THEN
    ALTER TABLE products ADD COLUMN selling_price DECIMAL(10,2) DEFAULT 0.00 NOT NULL;
  END IF;
END
$$;

-- Insert sample products if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM products WHERE sku = 'GP-SOFA-001') THEN
    INSERT INTO products (sku, name, description, supplier_id, model, type, material, cost_price, selling_price)
    VALUES ('GP-SOFA-001', 'G-Plan Washington 3 Seater Sofa', 'Comfortable 3 seater sofa', 
            (SELECT id FROM suppliers WHERE name = 'G-Plan Furniture' LIMIT 1), 
            'Washington', 'Sofa', 'Fabric', 500.00, 999.99);
  END IF;
  
  IF NOT EXISTS (SELECT FROM products WHERE sku = 'PK-CHAIR-001') THEN
    INSERT INTO products (sku, name, description, supplier_id, model, type, material, cost_price, selling_price)
    VALUES ('PK-CHAIR-001', 'Parker Knoll Wycombe Wing Chair', 'Classic wing chair', 
            (SELECT id FROM suppliers WHERE name = 'Parker Knoll' LIMIT 1), 
            'Wycombe', 'Chair', 'Leather', 350.00, 799.99);
  END IF;
  
  IF NOT EXISTS (SELECT FROM products WHERE sku = 'AL-SOFA-001') THEN
    INSERT INTO products (sku, name, description, supplier_id, model, type, material, cost_price, selling_price)
    VALUES ('AL-SOFA-001', 'Alstons Camden Corner Sofa', 'L-shaped corner sofa', 
            (SELECT id FROM suppliers WHERE name = 'Alstons Upholstery' LIMIT 1), 
            'Camden', 'Corner Sofa', 'Fabric', 650.00, 1299.99);
  END IF;
END
$$;
