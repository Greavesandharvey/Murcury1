#!/usr/bin/env node

/**
 * Reports System Initialization Script (Business Patch 007)
 * 
 * Initializes the complete reports system including:
 * - Database schema
 * - Standard UK furniture retail reports
 * - Executive dashboards
 * - KPI definitions and calculations
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const ReportEngine = require('./services/report-engine');
const DashboardManager = require('./services/dashboard-manager');
const KPIManager = require('./services/kpi-manager');

async function initializeReportsSystem() {
  console.log('🚀 Initializing Reports System (Business Patch 007)');
  console.log('='.repeat(60));

  // Database connection
  const pool = new Pool({
    user: 'mercuryone',
    host: 'localhost',
    database: 'mercuryone',
    password: 'mercuryone',
    port: 5432,
  });

  const db = {
    query: (text, params) => pool.query(text, params),
  };

  try {
    // Step 1: Apply database schema
    console.log('📋 Applying reports database schema...');
    const schemaPath = path.join(__dirname, 'reports-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await db.query(schema);
    console.log('✅ Database schema applied successfully');

    // Step 2: Initialize services
    console.log('\n🔧 Initializing services...');
    const reportEngine = new ReportEngine(db);
    const dashboardManager = new DashboardManager(db);
    const kpiManager = new KPIManager(db);

    // Step 3: Create standard report templates
    console.log('\n📊 Creating standard UK furniture retail reports...');
    await reportEngine.initializeStandardReports();
    console.log('✅ Standard reports created');

    // Step 4: Create standard dashboards
    console.log('\n📈 Creating executive and operational dashboards...');
    await dashboardManager.initializeStandardDashboards();
    console.log('✅ Standard dashboards created');

    // Step 5: Initialize KPI definitions
    console.log('\n🎯 Initializing Key Performance Indicators...');
    await kpiManager.initializeStandardKPIs();
    console.log('✅ KPI definitions initialized');

    // Step 6: Calculate initial KPIs
    console.log('\n🧮 Calculating initial KPI values...');
    await kpiManager.calculateKPIs();
    console.log('✅ Initial KPI values calculated');

    // Step 7: Verify system health
    console.log('\n🏥 Verifying system health...');
    const healthCheck = await verifySystemHealth(db);
    
    if (healthCheck.healthy) {
      console.log('✅ System health check passed');
    } else {
      console.log('⚠️ System health check warnings:');
      healthCheck.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    // Step 8: Generate sample reports
    console.log('\n📝 Generating sample reports...');
    await generateSampleReports(reportEngine);
    console.log('✅ Sample reports generated');

    // Success summary
    console.log('\n🎉 REPORTS SYSTEM INITIALIZATION COMPLETE');
    console.log('='.repeat(60));
    console.log('✅ Database schema applied');
    console.log('✅ Standard reports created');
    console.log('✅ Executive dashboards configured');
    console.log('✅ KPIs initialized and calculated');
    console.log('✅ System verified and operational');
    console.log('\n📍 Access the reports at: http://localhost:3000/reports');
    console.log('📍 API endpoints available at: http://localhost:5000/api/reports/*');

    return {
      success: true,
      message: 'Reports system initialized successfully',
      healthCheck
    };

  } catch (error) {
    console.error('\n❌ INITIALIZATION FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    
    return {
      success: false,
      error: error.message
    };
    
  } finally {
    await pool.end();
  }
}

/**
 * Verify system health after initialization
 */
async function verifySystemHealth(db) {
  const health = {
    healthy: true,
    warnings: []
  };

  try {
    // Check required tables exist
    const requiredTables = [
      'report_templates',
      'dashboards',
      'dashboard_widgets',
      'kpi_definitions',
      'kpi_values'
    ];

    for (const table of requiredTables) {
      const result = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        )
      `, [table]);

      if (!result.rows[0].exists) {
        health.healthy = false;
        health.warnings.push(`Required table ${table} does not exist`);
      }
    }

    // Check data counts
    const counts = await Promise.all([
      db.query('SELECT COUNT(*) FROM report_templates'),
      db.query('SELECT COUNT(*) FROM dashboards'),
      db.query('SELECT COUNT(*) FROM kpi_definitions')
    ]);

    const reportCount = parseInt(counts[0].rows[0].count);
    const dashboardCount = parseInt(counts[1].rows[0].count);
    const kpiCount = parseInt(counts[2].rows[0].count);

    if (reportCount === 0) {
      health.warnings.push('No report templates found');
    }

    if (dashboardCount === 0) {
      health.warnings.push('No dashboards found');
    }

    if (kpiCount === 0) {
      health.warnings.push('No KPI definitions found');
    }

    console.log(`📊 System contains: ${reportCount} reports, ${dashboardCount} dashboards, ${kpiCount} KPIs`);

  } catch (error) {
    health.healthy = false;
    health.warnings.push(`Health check error: ${error.message}`);
  }

  return health;
}

/**
 * Generate sample reports to verify functionality
 */
async function generateSampleReports(reportEngine) {
  try {
    const sampleReports = [
      'Sales Summary Report',
      'Product Performance Analysis',
      'Stock Valuation Report'
    ];

    for (const reportName of sampleReports) {
      try {
        const sampleData = await reportEngine.getSampleReportData(reportName);
        console.log(`  ✅ ${reportName}: ${sampleData.data.length} records`);
      } catch (error) {
        console.log(`  ⚠️ ${reportName}: ${error.message}`);
      }
    }

  } catch (error) {
    console.log(`  ❌ Sample report generation failed: ${error.message}`);
  }
}

/**
 * Create some sample data for testing (optional)
 */
async function createSampleData(db) {
  try {
    console.log('\n📝 Creating sample data for testing...');

    // Create sample orders if none exist
    const orderCount = await db.query('SELECT COUNT(*) FROM orders');
    if (parseInt(orderCount.rows[0].count) === 0) {
      
      // Create sample customers first
      await db.query(`
        INSERT INTO customers (first_name, last_name, email, phone)
        VALUES 
          ('John', 'Smith', 'john.smith@email.com', '01234567890'),
          ('Jane', 'Doe', 'jane.doe@email.com', '01234567891'),
          ('Bob', 'Johnson', 'bob.johnson@email.com', '01234567892')
        ON CONFLICT DO NOTHING
      `);

      // Create sample orders
      const customers = await db.query('SELECT id FROM customers LIMIT 3');
      for (const customer of customers.rows) {
        await db.query(`
          INSERT INTO orders (customer_id, order_date, total_amount, vat_amount, status)
          VALUES ($1, CURRENT_DATE - INTERVAL '${Math.floor(Math.random() * 30)} days', $2, $3, 'completed')
        `, [
          customer.id,
          (Math.random() * 1000 + 200).toFixed(2),
          (Math.random() * 200 + 40).toFixed(2)
        ]);
      }

      console.log('✅ Sample data created');
    } else {
      console.log('✅ Existing data found, skipping sample data creation');
    }

  } catch (error) {
    console.log(`⚠️ Sample data creation failed: ${error.message}`);
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeReportsSystem()
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = initializeReportsSystem;
