const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function verifyAPI() {
  try {
    console.log('Testing API connection...');
    
    // Test customer data
    const customerData = {
      type: 'individual',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '01234 567890',
      addressLine1: '123 Test Street',
      city: 'London',
      postcode: 'SW1A 1AA'
    };
    
    // Test creating a customer
    console.log('\nTesting POST /api/customers...');
    const createResponse = await fetch('http://localhost:5000/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    
    console.log('Response status:', createResponse.status);
    const responseText = await createResponse.text();
    console.log('Response text:', responseText);
    
    let customerId;
    if (createResponse.ok && responseText) {
      try {
        const data = JSON.parse(responseText);
        console.log('Created customer:', data);
        customerId = data.id;
      } catch (e) {
        console.error('Error parsing response:', e);
      }
    }
    
    // Test fetching customers
    console.log('\nTesting GET /api/customers...');
    const getResponse = await fetch('http://localhost:5000/api/customers');
    console.log('Response status:', getResponse.status);
    
    if (getResponse.ok) {
      const customers = await getResponse.json();
      console.log(`Found ${customers.length} customers:`, customers);
    }
    
    // If we have a customer ID, test fetching a single customer
    if (customerId) {
      console.log(`\nTesting GET /api/customers/${customerId}...`);
      const getOneResponse = await fetch(`http://localhost:5000/api/customers/${customerId}`);
      console.log('Response status:', getOneResponse.status);
      
      if (getOneResponse.ok) {
        const customer = await getOneResponse.json();
        console.log('Retrieved customer:', customer);
      }
    }
    
    console.log('\nAPI verification complete.');
  } catch (error) {
    console.error('Error during API verification:', error);
  }
}

verifyAPI();
