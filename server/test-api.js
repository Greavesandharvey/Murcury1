// For Node.js v18 and above, use built-in fetch
// For older Node.js versions, uncomment the line below:
// import fetch from 'node-fetch';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Use the direct database connection to check what's happening
const { Pool } = require('pg');
const pool = new Pool({
  user: 'mercuryone',
  host: 'localhost',
  database: 'mercuryone',
  password: 'mercuryone',
  port: 5432,
});

async function testCustomerAPI() {
  try {
    // Check if server is running by making a simple GET request
    console.log('Testing server connection...');
    try {
      const pingResponse = await fetch('http://localhost:5000/api/customers');
      console.log('Server is running. Status:', pingResponse.status);
    } catch (pingError) {
      console.error('Server connection failed:', pingError.message);
      console.log('Make sure the server is running on port 5000');
      return;
    }

    // Test data for a new customer
    const customerData = {
      type: 'individual',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '01234 567890',
      addressLine1: '123 Main Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      country: 'United Kingdom'
    };

    console.log('\nSending request to create customer:', JSON.stringify(customerData, null, 2));

    // Make the API request
    const response = await fetch('http://localhost:5000/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    console.log('Raw response text:', responseText);
    
    if (response.ok) {
      try {
        if (responseText) {
          const data = JSON.parse(responseText);
          console.log('Success! Created customer:', data);
        } else {
          console.log('Response was empty but status was OK');
        }
      } catch (parseError) {
        console.error('Error parsing success response:', parseError.message);
      }
    } else {
      console.error('Error response status:', response.status);
      console.error('Error response text:', responseText);
      
      try {
        if (responseText) {
          const errorJson = JSON.parse(responseText);
          console.error('Parsed error:', errorJson);
        }
      } catch (parseError) {
        console.error('Could not parse error as JSON:', parseError.message);
      }
    }
    
    // Check if the customer was actually created in the database
    console.log('\nChecking database for the customer...');
    const result = await pool.query("SELECT * FROM customers WHERE email = 'john.doe@example.com'");
    
    if (result.rows.length > 0) {
      console.log('Customer found in database:', result.rows[0]);
    } else {
      console.log('Customer NOT found in database. API call may have failed silently.');
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  } finally {
    await pool.end();
  }
}

testCustomerAPI();
