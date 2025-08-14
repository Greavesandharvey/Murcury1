const fs = require('fs');
const { Pool } = require('pg');
const path = require('path');

// Database connection
const pool = new Pool({
  user: 'mercuryone',
  host: 'localhost',
  database: 'mercuryone',
  password: 'mercuryone',
  port: 5432,
});

async function executeSchemaFile(filePath) {
  try {
    console.log(`Reading schema file: ${filePath}`);
    const schema = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Executing schema from ${path.basename(filePath)}...`);
    await pool.query(schema);
    console.log(`Schema from ${path.basename(filePath)} executed successfully!`);
    
    return true;
  } catch (error) {
    console.error(`Error executing schema from ${path.basename(filePath)}:`, error.message);
    if (error.position) {
      console.error(`Error at position ${error.position}`);
      const schema = fs.readFileSync(filePath, 'utf8');
      const errorContext = schema.substring(
        Math.max(0, error.position - 50),
        Math.min(schema.length, error.position + 50)
      );
      console.error(`Context: ...${errorContext}...`);
    }
    return false;
  }
}

async function executeAllSchemas() {
  try {
    // Schema files in order of execution
    const schemaFiles = [
      path.join(__dirname, 'basic_schema.sql'),
      path.join(__dirname, 'price_list_schema_update.sql')
    ];
    
    // Execute each schema file in order
    for (const file of schemaFiles) {
      if (fs.existsSync(file)) {
        const success = await executeSchemaFile(file);
        if (!success) {
          console.error(`Failed to execute ${path.basename(file)}, stopping execution.`);
          break;
        }
      } else {
        console.warn(`Schema file not found: ${file}`);
      }
    }
    
    // Check what tables were created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\nTables in database:');
    result.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('Error in schema execution process:', error.message);
  } finally {
    await pool.end();
  }
}

executeAllSchemas();
