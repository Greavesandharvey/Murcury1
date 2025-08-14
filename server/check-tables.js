const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  user: 'mercuryone',
  host: 'localhost',
  database: 'mercuryone',
  password: 'mercuryone',
  port: 5432,
});

async function checkTables() {
  try {
    // Get list of tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Check suppliers table structure
    console.log('\nChecking suppliers table structure:');
    const suppliersResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'suppliers'
      ORDER BY ordinal_position
    `);
    
    console.log('Suppliers table columns:');
    suppliersResult.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type}, ${row.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
    });
    
    // Check products table structure
    console.log('\nChecking products table structure:');
    const productsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'products'
      ORDER BY ordinal_position
    `);
    
    console.log('Products table columns:');
    productsResult.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type}, ${row.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
    });
    
  } catch (error) {
    console.error('Error checking tables:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();
