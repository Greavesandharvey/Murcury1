/**
 * Report Engine Service (Business Patch 007)
 * 
 * Comprehensive business intelligence and reporting for UK furniture retail
 * Implements proven legacy business logic for financial, sales, inventory, and supplier reports
 */

class ReportEngine {
  constructor(db) {
    this.db = db;
  }

  // UK Furniture Reports Configuration
  static UK_FURNITURE_REPORTS = {
    // Financial Reports
    'profit_loss': {
      name: 'Profit & Loss Statement',
      category: 'financial',
      description: 'Complete P&L statement with revenue and expenses',
      sql: `
        SELECT 
          a.account_name,
          a.account_type,
          COALESCE(SUM(CASE WHEN a.account_type IN ('revenue') THEN je.credit_amount - je.debit_amount ELSE je.debit_amount - je.credit_amount END), 0) as amount
        FROM chart_of_accounts a
        LEFT JOIN journal_entry_lines je ON a.id = je.account_id
        LEFT JOIN journal_entries j ON je.journal_entry_id = j.id
        WHERE j.entry_date BETWEEN $1 AND $2
          AND j.status = 'posted'
          AND a.account_type IN ('revenue', 'expense')
        GROUP BY a.id, a.account_name, a.account_type, a.trial_balance_order
        ORDER BY a.trial_balance_order
      `,
      parameters: ['start_date', 'end_date']
    },
    
    'balance_sheet': {
      name: 'Balance Sheet',
      category: 'financial',
      description: 'Financial position statement showing assets, liabilities, and equity',
      sql: `
        SELECT 
          a.account_name,
          a.account_type,
          a.balance_sheet_category,
          COALESCE(a.current_balance, 0) as balance
        FROM chart_of_accounts a
        WHERE a.account_type IN ('asset', 'liability', 'equity')
          AND a.active = true
        ORDER BY a.trial_balance_order
      `,
      parameters: ['as_of_date']
    },

    'cash_flow': {
      name: 'Cash Flow Statement',
      category: 'financial',
      description: 'Cash receipts and payments analysis',
      sql: `
        SELECT 
          DATE(j.entry_date) as entry_date,
          j.description,
          SUM(CASE WHEN a.account_type = 'asset' AND a.account_name LIKE '%Cash%' THEN je.debit_amount - je.credit_amount ELSE 0 END) as cash_flow
        FROM journal_entries j
        JOIN journal_entry_lines je ON j.id = je.journal_entry_id
        JOIN chart_of_accounts a ON je.account_id = a.id
        WHERE j.entry_date BETWEEN $1 AND $2
          AND j.status = 'posted'
          AND a.account_name LIKE '%Cash%'
        GROUP BY DATE(j.entry_date), j.description
        ORDER BY entry_date DESC
      `,
      parameters: ['start_date', 'end_date']
    },

    // Sales Reports
    'sales_summary': {
      name: 'Sales Summary Report',
      category: 'sales',
      description: 'Daily sales performance and trends',
      sql: `
        SELECT 
          DATE(o.order_date) as order_date,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as total_sales,
          SUM(o.vat_amount) as total_vat,
          AVG(o.total_amount) as average_order_value,
          COUNT(DISTINCT o.customer_id) as unique_customers
        FROM orders o
        WHERE o.order_date BETWEEN $1 AND $2
          AND o.status = 'completed'
        GROUP BY DATE(o.order_date)
        ORDER BY order_date DESC
      `,
      parameters: ['start_date', 'end_date']
    },

    'product_performance': {
      name: 'Product Performance Analysis',
      category: 'sales',
      description: 'Detailed product sales analysis with profitability',
      sql: `
        SELECT 
          p.name as product_name,
          p.sku,
          COALESCE(c.name, 'Uncategorized') as category_name,
          COALESCE(s.name, 'Unknown') as supplier_name,
          COUNT(oi.id) as times_sold,
          SUM(oi.quantity) as total_quantity,
          SUM(oi.line_total) as total_revenue,
          AVG(oi.unit_price) as average_selling_price,
          p.cost_price,
          SUM(oi.line_total) - (SUM(oi.quantity) * COALESCE(p.cost_price, 0)) as gross_profit,
          CASE 
            WHEN SUM(oi.line_total) > 0 
            THEN ((SUM(oi.line_total) - (SUM(oi.quantity) * COALESCE(p.cost_price, 0))) / SUM(oi.line_total)) * 100
            ELSE 0 
          END as margin_percent
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE o.order_date BETWEEN $1 AND $2
          AND o.status = 'completed'
        GROUP BY p.id, p.name, p.sku, c.name, s.name, p.cost_price
        HAVING COUNT(oi.id) > 0
        ORDER BY total_revenue DESC
      `,
      parameters: ['start_date', 'end_date']
    },

    'customer_analysis': {
      name: 'Customer Analysis Report',
      category: 'sales',
      description: 'Customer behavior and lifetime value analysis',
      sql: `
        SELECT 
          c.id as customer_id,
          CONCAT(c.first_name, ' ', c.last_name) as customer_name,
          c.email,
          COUNT(o.id) as total_orders,
          SUM(o.total_amount) as total_spent,
          AVG(o.total_amount) as average_order_value,
          MIN(o.order_date) as first_order_date,
          MAX(o.order_date) as last_order_date,
          EXTRACT(days FROM (MAX(o.order_date) - MIN(o.order_date))) as customer_lifespan_days
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        WHERE o.order_date BETWEEN $1 AND $2
          AND o.status = 'completed'
        GROUP BY c.id, c.first_name, c.last_name, c.email
        HAVING COUNT(o.id) > 0
        ORDER BY total_spent DESC
      `,
      parameters: ['start_date', 'end_date']
    },

    // Inventory Reports  
    'stock_valuation': {
      name: 'Stock Valuation Report',
      category: 'inventory',
      description: 'Current inventory value and status analysis',
      sql: `
        SELECT 
          p.sku,
          p.name as product_name,
          COALESCE(c.name, 'Uncategorized') as category_name,
          COALESCE(s.name, 'Unknown') as supplier_name,
          p.stock_quantity,
          COALESCE(p.cost_price, 0) as cost_price,
          COALESCE(p.selling_price, 0) as selling_price,
          (p.stock_quantity * COALESCE(p.cost_price, 0)) as cost_value,
          (p.stock_quantity * COALESCE(p.selling_price, 0)) as retail_value,
          CASE 
            WHEN p.stock_quantity <= 0 THEN 'Out of Stock'
            WHEN p.stock_quantity <= 5 THEN 'Low Stock'
            ELSE 'In Stock'
          END as stock_status
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE p.active = true
        ORDER BY cost_value DESC
      `,
      parameters: []
    },

    'inventory_movement': {
      name: 'Inventory Movement Report',
      category: 'inventory',
      description: 'Product sales velocity and turnover analysis',
      sql: `
        SELECT 
          p.sku,
          p.name as product_name,
          p.stock_quantity as current_stock,
          SUM(oi.quantity) as quantity_sold,
          CASE 
            WHEN SUM(oi.quantity) > 0 
            THEN CAST(p.stock_quantity AS DECIMAL) / (SUM(oi.quantity) / EXTRACT(days FROM ($2::date - $1::date + 1))) 
            ELSE NULL 
          END as days_of_stock,
          COUNT(DISTINCT o.id) as orders_containing_product
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        WHERE (o.order_date BETWEEN $1 AND $2 OR o.order_date IS NULL)
          AND (o.status = 'completed' OR o.status IS NULL)
          AND p.active = true
        GROUP BY p.id, p.sku, p.name, p.stock_quantity
        ORDER BY days_of_stock ASC NULLS LAST
      `,
      parameters: ['start_date', 'end_date']
    },

    // Supplier Reports
    'supplier_performance': {
      name: 'Supplier Performance Report',
      category: 'suppliers',
      description: 'Supplier delivery and performance metrics',
      sql: `
        SELECT 
          s.name as supplier_name,
          s.contact_email,
          COUNT(DISTINCT po.id) as purchase_orders,
          SUM(COALESCE(po.total_amount, 0)) as total_purchases,
          AVG(COALESCE(po.total_amount, 0)) as average_po_value,
          COUNT(CASE WHEN po.status = 'delivered' THEN 1 END) as delivered_orders,
          COUNT(CASE WHEN po.expected_delivery_date < CURRENT_DATE AND po.status != 'delivered' THEN 1 END) as overdue_orders,
          AVG(CASE WHEN po.status = 'delivered' AND po.delivered_date IS NOT NULL THEN EXTRACT(days FROM po.delivered_date - po.order_date) END) as avg_delivery_days
        FROM suppliers s
        LEFT JOIN purchase_orders po ON s.id = po.supplier_id
        WHERE (po.order_date BETWEEN $1 AND $2 OR po.order_date IS NULL)
          AND s.active = true
        GROUP BY s.id, s.name, s.contact_email
        ORDER BY total_purchases DESC
      `,
      parameters: ['start_date', 'end_date']
    },

    'supplier_products': {
      name: 'Supplier Product Analysis',
      category: 'suppliers',
      description: 'Product range and performance by supplier',
      sql: `
        SELECT 
          s.name as supplier_name,
          COUNT(p.id) as total_products,
          COUNT(CASE WHEN p.active = true THEN 1 END) as active_products,
          SUM(p.stock_quantity) as total_stock_units,
          SUM(p.stock_quantity * COALESCE(p.cost_price, 0)) as total_stock_value,
          AVG(COALESCE(p.cost_price, 0)) as avg_cost_price,
          AVG(COALESCE(p.selling_price, 0)) as avg_selling_price
        FROM suppliers s
        LEFT JOIN products p ON s.id = p.supplier_id
        WHERE s.active = true
        GROUP BY s.id, s.name
        ORDER BY total_stock_value DESC
      `,
      parameters: []
    }
  };

  /**
   * Generate a report from template
   */
  async generateReport(templateId, parameters, userId) {
    try {
      // Get report template
      const templateResult = await this.db.query(`
        SELECT * FROM report_templates WHERE id = $1 AND active = true
      `, [templateId]);

      if (templateResult.rows.length === 0) {
        throw new Error('Report template not found');
      }

      const template = templateResult.rows[0];

      // Create report instance
      const instanceResult = await this.db.query(`
        INSERT INTO report_instances (
          template_id, instance_name, generated_by, parameters_used,
          data_from_date, data_to_date, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        templateId,
        `${template.report_name} - ${new Date().toISOString()}`,
        userId,
        JSON.stringify(parameters),
        parameters.start_date || null,
        parameters.end_date || null,
        'generating'
      ]);

      const instance = instanceResult.rows[0];

      try {
        const startTime = Date.now();
        
        // Execute report query
        const reportData = await this.executeReportQuery(template, parameters);
        
        // Generate report file
        const filePath = await this.generateReportFile(template, reportData, parameters);
        
        const generationTime = Math.round((Date.now() - startTime) / 1000);

        // Update instance with results
        await this.db.query(`
          UPDATE report_instances 
          SET status = 'completed', file_path = $1, record_count = $2, 
              generation_time_seconds = $3
          WHERE id = $4
        `, [filePath, reportData.length, generationTime, instance.id]);

        return { 
          instance: { ...instance, status: 'completed' }, 
          data: reportData, 
          filePath 
        };

      } catch (error) {
        // Update instance with error
        await this.db.query(`
          UPDATE report_instances 
          SET status = 'failed', error_message = $1
          WHERE id = $2
        `, [error.message, instance.id]);

        throw error;
      }

    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Execute report query with parameters
   */
  async executeReportQuery(template, parameters) {
    try {
      let sql = template.sql_query;
      const paramValues = [];

      // Use predefined reports if available
      const reportKey = template.report_name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      if (ReportEngine.UK_FURNITURE_REPORTS[reportKey]) {
        const reportDef = ReportEngine.UK_FURNITURE_REPORTS[reportKey];
        sql = reportDef.sql;
        
        // Map parameters in order
        reportDef.parameters.forEach(param => {
          if (parameters[param]) {
            paramValues.push(parameters[param]);
          }
        });
      } else if (sql) {
        // Use template SQL with parameter substitution
        const paramKeys = Object.keys(parameters).sort();
        paramKeys.forEach(key => {
          paramValues.push(parameters[key]);
        });
      }

      // Execute query
      const result = await this.db.query(sql, paramValues);
      return result.rows;

    } catch (error) {
      console.error('Error executing report query:', error);
      throw new Error(`Report query failed: ${error.message}`);
    }
  }

  /**
   * Generate report file (simplified for now)
   */
  async generateReportFile(template, data, parameters) {
    try {
      const fileName = `${template.report_name.replace(/\s+/g, '_')}_${Date.now()}.json`;
      const filePath = `reports/${fileName}`;
      
      const reportData = {
        template: template.report_name,
        category: template.report_category,
        parameters,
        generatedAt: new Date().toISOString(),
        recordCount: data.length,
        data
      };

      // In production, this would generate PDF/Excel files
      console.log(`Generated report file: ${filePath}`);
      
      return filePath;

    } catch (error) {
      console.error('Error generating report file:', error);
      throw error;
    }
  }

  /**
   * Get available report templates
   */
  async getReportTemplates(category = null) {
    try {
      let query = `
        SELECT * FROM report_templates 
        WHERE active = true
      `;
      const params = [];

      if (category) {
        query += ` AND report_category = $1`;
        params.push(category);
      }

      query += ` ORDER BY report_category, report_name`;

      const result = await this.db.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Error getting report templates:', error);
      throw error;
    }
  }

  /**
   * Get report instances with filtering
   */
  async getReportInstances(filters = {}) {
    try {
      let query = `
        SELECT 
          ri.*,
          rt.report_name,
          rt.report_category,
          u.username as generated_by_username
        FROM report_instances ri
        JOIN report_templates rt ON ri.template_id = rt.id
        LEFT JOIN users u ON ri.generated_by = u.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (filters.status) {
        query += ` AND ri.status = $${paramCount++}`;
        params.push(filters.status);
      }

      if (filters.category) {
        query += ` AND rt.report_category = $${paramCount++}`;
        params.push(filters.category);
      }

      if (filters.start_date) {
        query += ` AND ri.generated_date >= $${paramCount++}`;
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        query += ` AND ri.generated_date <= $${paramCount++}`;
        params.push(filters.end_date);
      }

      query += ` ORDER BY ri.generated_date DESC`;

      if (filters.limit) {
        query += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
      }

      const result = await this.db.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Error getting report instances:', error);
      throw error;
    }
  }

  /**
   * Initialize standard UK furniture retail reports
   */
  async initializeStandardReports() {
    try {
      console.log('Initializing standard UK furniture retail reports...');

      for (const [reportKey, reportDef] of Object.entries(ReportEngine.UK_FURNITURE_REPORTS)) {
        // Check if template already exists
        const existingResult = await this.db.query(`
          SELECT id FROM report_templates 
          WHERE report_name = $1
        `, [reportDef.name]);

        if (existingResult.rows.length === 0) {
          // Create new template
          await this.db.query(`
            INSERT INTO report_templates (
              report_name, report_category, report_type, description,
              sql_query, parameters, active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            reportDef.name,
            reportDef.category,
            'detailed',
            reportDef.description || reportDef.name,
            reportDef.sql,
            JSON.stringify(reportDef.parameters),
            true
          ]);

          console.log(`Created report template: ${reportDef.name}`);
        }
      }

      console.log('Standard reports initialization complete');
      return true;

    } catch (error) {
      console.error('Error initializing standard reports:', error);
      throw error;
    }
  }

  /**
   * Get sample report data for testing
   */
  async getSampleReportData(reportName) {
    try {
      const reportKey = reportName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      
      if (!ReportEngine.UK_FURNITURE_REPORTS[reportKey]) {
        throw new Error(`Sample data not available for report: ${reportName}`);
      }

      const reportDef = ReportEngine.UK_FURNITURE_REPORTS[reportKey];
      
      // Use last 30 days as default date range
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      const parameters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        as_of_date: endDate.toISOString().split('T')[0]
      };

      const data = await this.executeReportQuery(
        { report_name: reportDef.name, sql_query: reportDef.sql }, 
        parameters
      );

      return {
        reportName: reportDef.name,
        category: reportDef.category,
        description: reportDef.description,
        parameters,
        data
      };

    } catch (error) {
      console.error('Error getting sample report data:', error);
      throw error;
    }
  }
}

module.exports = ReportEngine;
