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
      
      // Try to insert a test customer
      console.log('\nAttempting to insert a test customer...');
      const insertResult = await pool.query(`
        INSERT INTO customers (
          type, first_name, last_name, email, phone, 
          address_line_1, city, postcode, country,
          active, marketing_preferences
        ) VALUES (
          'individual', 'Test', 'User', 'test@example.com', '01234 567890',
          '123 Test Street', 'London', 'SW1A 1AA', 'United Kingdom',
          true, '{"email": false, "phone": false, "post": false, "sms": false}'
        ) RETURNING id
      `);
      
      if (insertResult.rows.length > 0) {
        const testCustomerId = insertResult.rows[0].id;
        console.log(`Successfully inserted test customer with ID: ${testCustomerId}`);
        
        // Clean up - delete the test customer
        await pool.query('DELETE FROM customers WHERE id = $1', [testCustomerId]);
        console.log('Test customer deleted');
      }
    } else {
      console.log('Customers table does not exist!');
    }
    
  } catch (error) {
    console.error('Error checking customers table:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

checkCustomersTable();