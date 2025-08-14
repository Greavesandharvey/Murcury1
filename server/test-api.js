// For Node.js v18 and above, use built-in fetch
// For older Node.js versions, uncomment the line below:
// import fetch from 'node-fetch';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCustomerAPI() {
  try {
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

    console.log('Sending request to create customer:', JSON.stringify(customerData, null, 2));

    // Make the API request
    const response = await fetch('http://localhost:5000/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Created customer:', data);
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Parsed error:', errorJson);
      } catch (parseError) {
        console.error('Could not parse error as JSON:', parseError.message);
      }
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testCustomerAPI();
