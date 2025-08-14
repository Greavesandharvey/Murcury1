const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  user: 'mercuryone',
  host: 'localhost',
  database: 'mercuryone',
  password: 'mercuryone',
  port: 5432,
});

async function checkCustomersTable() {
  try {
    // Check if customers table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'customers'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log(`Customers table exists: ${tableExists}`);
    
    if (tableExists) {
      // Check customers table structure
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'customers'
        ORDER BY ordinal_position
      `);
      
      console.log('\nCustomers table columns:');
      columnsResult.rows.forEach(row => {
        console.log(`- ${row.column_name} (${row.data_type}, ${row.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
      
      // Check if there are any customers
      const countResult = await pool.query('SELECT COUNT(*) FROM customers');
      console.log(`\nTotal customers: ${countResult.rows[0].count}`);
    } else {
      console.log('Creating customers table from mercuryone_schema.sql...');
      
      // Read the schema file
      const fs = require('fs');
      const path = require('path');
      const schemaPath = path.join(__dirname, '..', 'mercuryone_schema.sql');
      
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('Customers table created successfully!');
      } else {
        console.error('Schema file not found:', schemaPath);
      }
    }
    
  } catch (error) {
    console.error('Error checking customers table:', error.message);
  } finally {
    await pool.end();
  }
}

checkCustomersTable();
