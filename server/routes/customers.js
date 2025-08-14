// Customer API routes with UK-specific validation

// UK Postcode validation functions
function validateUKPostcode(postcode) {
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  return ukPostcodeRegex.test(postcode.replace(/\s/g, ''));
}

function formatUKPostcode(postcode) {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  } else if (cleaned.length === 7) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  return cleaned;
}

// UK Counties List
const UK_COUNTIES = [
  "Bedfordshire", "Berkshire", "Bristol", "Buckinghamshire", "Cambridgeshire",
  "Cheshire", "City of London", "Cornwall", "Cumbria", "Derbyshire", "Devon",
  "Dorset", "Durham", "East Riding of Yorkshire", "East Sussex", "Essex",
  "Gloucestershire", "Greater London", "Greater Manchester", "Hampshire",
  "Herefordshire", "Hertfordshire", "Isle of Wight", "Kent", "Lancashire",
  "Leicestershire", "Lincolnshire", "Merseyside", "Norfolk", "North Yorkshire",
  "Northamptonshire", "Northumberland", "Nottinghamshire", "Oxfordshire",
  "Rutland", "Shropshire", "Somerset", "South Yorkshire", "Staffordshire",
  "Suffolk", "Surrey", "Tyne and Wear", "Warwickshire", "West Midlands",
  "West Sussex", "West Yorkshire", "Wiltshire", "Worcestershire"
];

module.exports = function(app, db) {
  // Get customers with search and filtering
  app.get("/api/customers", async (req, res) => {
    const { search, type } = req.query;
    
    try {
      let query = "SELECT * FROM customers WHERE active = true";
      const params = [];

      // Apply search filter
      if (search) {
        query += " AND (first_name ILIKE $1 OR last_name ILIKE $1 OR company_name ILIKE $1 OR email ILIKE $1 OR postcode ILIKE $1)";
        params.push(`%${search}%`);
      }

      // Apply type filter
      if (type && type !== "all") {
        const paramIndex = params.length + 1;
        query += ` AND type = $${paramIndex}`;
        params.push(type);
      }

      query += " ORDER BY last_name, first_name";
      
      const result = await db.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  // Create new customer
  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = req.body;
      
      // Validate UK postcode
      if (customerData.postcode && !validateUKPostcode(customerData.postcode)) {
        return res.status(400).json({ error: "Invalid UK postcode format" });
      }

      // Format postcode
      if (customerData.postcode) {
        customerData.postcode = formatUKPostcode(customerData.postcode);
      }

      // Handle marketing preferences
      const marketingPreferences = {
        email: customerData.marketingEmail || false,
        phone: customerData.marketingPhone || false,
        post: customerData.marketingPost || false,
        sms: customerData.marketingSMS || false,
      };

      // Remove individual marketing fields and add as JSONB
      const { 
        marketingEmail, 
        marketingPhone, 
        marketingPost, 
        marketingSMS,
        ...cleanData 
      } = customerData;
      
      // Convert field names to snake_case for database
      const dbFields = {
        type: cleanData.type,
        title: cleanData.title,
        first_name: cleanData.firstName,
        last_name: cleanData.lastName,
        company_name: cleanData.companyName,
        email: cleanData.email,
        phone: cleanData.phone,
        mobile: cleanData.mobile,
        address_line_1: cleanData.addressLine1,
        address_line_2: cleanData.addressLine2,
        city: cleanData.city,
        county: cleanData.county,
        postcode: cleanData.postcode,
        country: cleanData.country || 'United Kingdom',
        date_of_birth: cleanData.dateOfBirth,
        marketing_preferences: marketingPreferences,
        notes: cleanData.notes,
        credit_limit: cleanData.creditLimit || 0,
        payment_terms: cleanData.paymentTerms || 30,
        vat_number: cleanData.vatNumber
      };

      // Build query
      const fields = Object.keys(dbFields);
      const values = Object.values(dbFields);
      const placeholders = values.map((_, i) => `$${i + 1}`);
      
      const query = `
        INSERT INTO customers (${fields.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
      `;

      const result = await db.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ error: "Failed to create customer" });
    }
  });

  // Update customer
  app.put("/api/customers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const customerData = req.body;
      
      // Validate UK postcode
      if (customerData.postcode && !validateUKPostcode(customerData.postcode)) {
        return res.status(400).json({ error: "Invalid UK postcode format" });
      }

      // Format postcode
      if (customerData.postcode) {
        customerData.postcode = formatUKPostcode(customerData.postcode);
      }

      // Handle marketing preferences
      const marketingPreferences = {
        email: customerData.marketingEmail || false,
        phone: customerData.marketingPhone || false,
        post: customerData.marketingPost || false,
        sms: customerData.marketingSMS || false,
      };

      // Remove individual marketing fields and add as JSONB
      const { 
        marketingEmail, 
        marketingPhone, 
        marketingPost, 
        marketingSMS,
        ...cleanData 
      } = customerData;
      
      // Convert field names to snake_case for database
      const dbFields = {
        type: cleanData.type,
        title: cleanData.title,
        first_name: cleanData.firstName,
        last_name: cleanData.lastName,
        company_name: cleanData.companyName,
        email: cleanData.email,
        phone: cleanData.phone,
        mobile: cleanData.mobile,
        address_line_1: cleanData.addressLine1,
        address_line_2: cleanData.addressLine2,
        city: cleanData.city,
        county: cleanData.county,
        postcode: cleanData.postcode,
        country: cleanData.country || 'United Kingdom',
        date_of_birth: cleanData.dateOfBirth,
        marketing_preferences: marketingPreferences,
        notes: cleanData.notes,
        credit_limit: cleanData.creditLimit || 0,
        payment_terms: cleanData.paymentTerms || 30,
        vat_number: cleanData.vatNumber,
        updated_at: new Date()
      };

      // Build query
      const setClause = Object.entries(dbFields)
        .map(([key, _], i) => `${key} = $${i + 1}`)
        .join(', ');
      
      const values = [...Object.values(dbFields), id];
      
      const query = `
        UPDATE customers
        SET ${setClause}
        WHERE id = $${values.length}
        RETURNING *
      `;

      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Failed to update customer" });
    }
  });

  // Get customer by ID
  app.get("/api/customers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const query = "SELECT * FROM customers WHERE id = $1";
      const result = await db.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });

  // Delete customer (soft delete)
  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const query = "UPDATE customers SET active = false, updated_at = NOW() WHERE id = $1 RETURNING *";
      const result = await db.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ error: "Failed to delete customer" });
    }
  });
};
