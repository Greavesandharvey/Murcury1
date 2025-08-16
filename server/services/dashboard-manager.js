/**
 * Dashboard Manager Service (Business Patch 007)
 * 
 * Executive dashboards and real-time KPI monitoring for UK furniture retail
 */

class DashboardManager {
  constructor(db) {
    this.db = db;
  }

  // Executive Dashboard Configuration
  static EXECUTIVE_DASHBOARD_CONFIG = {
    name: 'Executive Dashboard',
    type: 'executive',
    description: 'Key performance indicators and business overview for executives',
    widgets: [
      {
        name: 'Daily Sales',
        type: 'kpi',
        position: { x: 0, y: 0, width: 3, height: 2 },
        dataSource: `
          SELECT COALESCE(SUM(total_amount), 0) as value
          FROM orders 
          WHERE DATE(order_date) = CURRENT_DATE
            AND status = 'completed'
        `,
        displayConfig: {
          format: 'currency',
          trend: 'daily',
          target: 5000,
          unit: '£'
        }
      },
      {
        name: 'Monthly Revenue Trend',
        type: 'chart',
        chartType: 'line',
        position: { x: 3, y: 0, width: 6, height: 4 },
        dataSource: `
          SELECT 
            DATE(order_date) as date,
            SUM(total_amount) as revenue
          FROM orders
          WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months'
            AND status = 'completed'
          GROUP BY DATE(order_date)
          ORDER BY date
        `,
        displayConfig: {
          xAxis: 'date',
          yAxis: 'revenue',
          format: 'currency'
        }
      },
      {
        name: 'Top Products This Month',
        type: 'table',
        position: { x: 0, y: 2, width: 6, height: 4 },
        dataSource: `
          SELECT 
            p.name,
            SUM(oi.quantity) as quantity_sold,
            SUM(oi.line_total) as revenue
          FROM products p
          JOIN order_items oi ON p.id = oi.product_id
          JOIN orders o ON oi.order_id = o.id
          WHERE o.order_date >= DATE_TRUNC('month', CURRENT_DATE)
            AND o.status = 'completed'
          GROUP BY p.id, p.name
          ORDER BY revenue DESC
          LIMIT 10
        `,
        displayConfig: {
          columns: ['Product', 'Qty Sold', 'Revenue'],
          formatters: { revenue: 'currency' }
        }
      },
      {
        name: 'Stock Alerts',
        type: 'kpi',
        position: { x: 9, y: 0, width: 3, height: 2 },
        dataSource: `
          SELECT COUNT(*) as value
          FROM products
          WHERE stock_quantity <= 5
            AND active = true
        `,
        displayConfig: {
          format: 'number',
          alert: 'warning',
          threshold: 10,
          unit: 'items'
        }
      },
      {
        name: 'Customer Satisfaction',
        type: 'gauge',
        position: { x: 6, y: 4, width: 3, height: 3 },
        dataSource: `
          SELECT COALESCE(AVG(rating), 0) as value
          FROM customer_feedback
          WHERE feedback_date >= CURRENT_DATE - INTERVAL '30 days'
        `,
        displayConfig: {
          format: 'decimal',
          min: 0,
          max: 5,
          target: 4.5,
          unit: '/5'
        }
      },
      {
        name: 'Order Status Overview',
        type: 'chart',
        chartType: 'doughnut',
        position: { x: 9, y: 2, width: 3, height: 4 },
        dataSource: `
          SELECT 
            status,
            COUNT(*) as count
          FROM orders
          WHERE order_date >= CURRENT_DATE - INTERVAL '7 days'
          GROUP BY status
          ORDER BY count DESC
        `,
        displayConfig: {
          labelKey: 'status',
          valueKey: 'count'
        }
      }
    ]
  };

  static SALES_DASHBOARD_CONFIG = {
    name: 'Sales Dashboard',
    type: 'sales',
    description: 'Comprehensive sales performance and trends analysis',
    widgets: [
      {
        name: 'Sales Performance',
        type: 'chart',
        chartType: 'bar',
        position: { x: 0, y: 0, width: 6, height: 4 },
        dataSource: `
          SELECT 
            DATE(order_date) as date,
            SUM(total_amount) as daily_sales,
            COUNT(*) as order_count
          FROM orders
          WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
            AND status = 'completed'
          GROUP BY DATE(order_date)
          ORDER BY date
        `,
        displayConfig: {
          xAxis: 'date',
          yAxis: 'daily_sales',
          format: 'currency'
        }
      },
      {
        name: 'Sales by Category',
        type: 'chart',
        chartType: 'pie',
        position: { x: 6, y: 0, width: 6, height: 4 },
        dataSource: `
          SELECT 
            COALESCE(c.name, 'Uncategorized') as category,
            SUM(oi.line_total) as revenue
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          JOIN orders o ON oi.order_id = o.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days'
            AND o.status = 'completed'
          GROUP BY c.name
          ORDER BY revenue DESC
        `,
        displayConfig: {
          labelKey: 'category',
          valueKey: 'revenue',
          format: 'currency'
        }
      }
    ]
  };

  static FINANCIAL_DASHBOARD_CONFIG = {
    name: 'Financial Dashboard',
    type: 'financial',
    description: 'Financial performance and cash flow monitoring',
    widgets: [
      {
        name: 'Revenue vs Target',
        type: 'gauge',
        position: { x: 0, y: 0, width: 4, height: 3 },
        dataSource: `
          SELECT 
            SUM(total_amount) as value,
            100000 as target
          FROM orders
          WHERE DATE_TRUNC('month', order_date) = DATE_TRUNC('month', CURRENT_DATE)
            AND status = 'completed'
        `,
        displayConfig: {
          format: 'currency',
          min: 0,
          max: 150000,
          target: 100000
        }
      },
      {
        name: 'Profit Margin Trend',
        type: 'chart',
        chartType: 'line',
        position: { x: 4, y: 0, width: 8, height: 4 },
        dataSource: `
          SELECT 
            DATE(o.order_date) as date,
            CASE 
              WHEN SUM(oi.line_total) > 0 
              THEN ((SUM(oi.line_total) - SUM(oi.quantity * COALESCE(p.cost_price, 0))) / SUM(oi.line_total)) * 100
              ELSE 0 
            END as margin_percent
          FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          JOIN products p ON oi.product_id = p.id
          WHERE o.order_date >= CURRENT_DATE - INTERVAL '90 days'
            AND o.status = 'completed'
          GROUP BY DATE(o.order_date)
          ORDER BY date
        `,
        displayConfig: {
          xAxis: 'date',
          yAxis: 'margin_percent',
          format: 'percent'
        }
      }
    ]
  };

  /**
   * Create a new dashboard
   */
  async createDashboard(dashboardConfig, userId) {
    try {
      // Create dashboard
      const dashboardResult = await this.db.query(`
        INSERT INTO dashboards (
          dashboard_name, dashboard_type, description, layout_config,
          refresh_interval, created_by, active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        dashboardConfig.name,
        dashboardConfig.type,
        dashboardConfig.description || '',
        JSON.stringify({ widgets: [] }),
        300, // 5 minutes default refresh
        userId,
        true
      ]);

      const dashboard = dashboardResult.rows[0];

      // Create widgets
      const widgets = [];
      for (const widgetConfig of dashboardConfig.widgets) {
        const widgetResult = await this.db.query(`
          INSERT INTO dashboard_widgets (
            dashboard_id, widget_name, widget_type, chart_type, data_source,
            position_x, position_y, width, height, refresh_interval, display_config
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *
        `, [
          dashboard.id,
          widgetConfig.name,
          widgetConfig.type,
          widgetConfig.chartType || null,
          widgetConfig.dataSource,
          widgetConfig.position.x,
          widgetConfig.position.y,
          widgetConfig.position.width,
          widgetConfig.position.height,
          widgetConfig.refreshInterval || 300,
          JSON.stringify(widgetConfig.displayConfig || {})
        ]);
        
        widgets.push(widgetResult.rows[0]);
      }

      return { dashboard, widgets };

    } catch (error) {
      console.error('Error creating dashboard:', error);
      throw error;
    }
  }

  /**
   * Get dashboard with live data
   */
  async getDashboardData(dashboardId) {
    try {
      // Get dashboard
      const dashboardResult = await this.db.query(`
        SELECT * FROM dashboards WHERE id = $1 AND active = true
      `, [dashboardId]);

      if (dashboardResult.rows.length === 0) {
        throw new Error('Dashboard not found');
      }

      const dashboard = dashboardResult.rows[0];

      // Get widgets
      const widgetsResult = await this.db.query(`
        SELECT * FROM dashboard_widgets 
        WHERE dashboard_id = $1 
        ORDER BY position_y, position_x
      `, [dashboardId]);

      const widgets = widgetsResult.rows;

      // Execute widget queries and get data
      const widgetData = await Promise.all(
        widgets.map(async (widget) => {
          try {
            const result = await this.db.query(widget.data_source);
            return {
              ...widget,
              data: result.rows
            };
          } catch (error) {
            console.error(`Error executing widget query for ${widget.widget_name}:`, error);
            return {
              ...widget,
              error: error.message,
              data: []
            };
          }
        })
      );

      return {
        dashboard,
        widgets: widgetData
      };

    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  /**
   * Get available dashboards
   */
  async getDashboards(userId = null) {
    try {
      let query = `
        SELECT 
          d.*,
          u.username as created_by_username,
          (SELECT COUNT(*) FROM dashboard_widgets WHERE dashboard_id = d.id) as widget_count
        FROM dashboards d
        LEFT JOIN users u ON d.created_by = u.id
        WHERE d.active = true
      `;
      
      const params = [];

      if (userId) {
        query += ` AND d.created_by = $1`;
        params.push(userId);
      }

      query += ` ORDER BY d.is_default DESC, d.created_at DESC`;

      const result = await this.db.query(query, params);
      return result.rows;

    } catch (error) {
      console.error('Error getting dashboards:', error);
      throw error;
    }
  }

  /**
   * Update dashboard widget data
   */
  async updateWidgetData(widgetId) {
    try {
      const widgetResult = await this.db.query(`
        SELECT * FROM dashboard_widgets WHERE id = $1
      `, [widgetId]);

      if (widgetResult.rows.length === 0) {
        throw new Error('Widget not found');
      }

      const widget = widgetResult.rows[0];
      const result = await this.db.query(widget.data_source);

      return {
        widgetId: widget.id,
        name: widget.widget_name,
        type: widget.widget_type,
        data: result.rows,
        updatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error updating widget data:', error);
      throw error;
    }
  }

  /**
   * Initialize standard dashboards
   */
  async initializeStandardDashboards(userId = 1) {
    try {
      console.log('Initializing standard dashboards...');

      const standardDashboards = [
        DashboardManager.EXECUTIVE_DASHBOARD_CONFIG,
        DashboardManager.SALES_DASHBOARD_CONFIG,
        DashboardManager.FINANCIAL_DASHBOARD_CONFIG
      ];

      for (const dashboardConfig of standardDashboards) {
        // Check if dashboard already exists
        const existingResult = await this.db.query(`
          SELECT id FROM dashboards WHERE dashboard_name = $1
        `, [dashboardConfig.name]);

        if (existingResult.rows.length === 0) {
          const dashboard = await this.createDashboard(dashboardConfig, userId);
          
          // Set executive dashboard as default
          if (dashboardConfig.type === 'executive') {
            await this.db.query(`
              UPDATE dashboards SET is_default = true WHERE id = $1
            `, [dashboard.dashboard.id]);
          }

          console.log(`Created dashboard: ${dashboardConfig.name}`);
        }
      }

      console.log('Standard dashboards initialization complete');
      return true;

    } catch (error) {
      console.error('Error initializing standard dashboards:', error);
      throw error;
    }
  }

  /**
   * Get dashboard metrics summary
   */
  async getDashboardMetrics() {
    try {
      const metrics = {};

      // Current day sales
      const dailySalesResult = await this.db.query(`
        SELECT COALESCE(SUM(total_amount), 0) as daily_sales
        FROM orders 
        WHERE DATE(order_date) = CURRENT_DATE AND status = 'completed'
      `);
      metrics.daily_sales = parseFloat(dailySalesResult.rows[0].daily_sales || 0);

      // Monthly sales
      const monthlySalesResult = await this.db.query(`
        SELECT COALESCE(SUM(total_amount), 0) as monthly_sales
        FROM orders 
        WHERE DATE_TRUNC('month', order_date) = DATE_TRUNC('month', CURRENT_DATE)
          AND status = 'completed'
      `);
      metrics.monthly_sales = parseFloat(monthlySalesResult.rows[0].monthly_sales || 0);

      // Low stock count
      const lowStockResult = await this.db.query(`
        SELECT COUNT(*) as low_stock_count
        FROM products
        WHERE stock_quantity <= 5 AND active = true
      `);
      metrics.low_stock_count = parseInt(lowStockResult.rows[0].low_stock_count || 0);

      // Customer satisfaction
      const satisfactionResult = await this.db.query(`
        SELECT COALESCE(AVG(rating), 0) as avg_rating
        FROM customer_feedback
        WHERE feedback_date >= CURRENT_DATE - INTERVAL '30 days'
      `);
      metrics.customer_satisfaction = parseFloat(satisfactionResult.rows[0].avg_rating || 0);

      // Order count today
      const orderCountResult = await this.db.query(`
        SELECT COUNT(*) as order_count
        FROM orders 
        WHERE DATE(order_date) = CURRENT_DATE
      `);
      metrics.daily_orders = parseInt(orderCountResult.rows[0].order_count || 0);

      return metrics;

    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  /**
   * Delete dashboard
   */
  async deleteDashboard(dashboardId) {
    try {
      // Delete widgets first
      await this.db.query(`
        DELETE FROM dashboard_widgets WHERE dashboard_id = $1
      `, [dashboardId]);

      // Delete dashboard
      await this.db.query(`
        DELETE FROM dashboards WHERE id = $1
      `, [dashboardId]);

      return true;

    } catch (error) {
      console.error('Error deleting dashboard:', error);
      throw error;
    }
  }

  /**
   * Update dashboard configuration
   */
  async updateDashboard(dashboardId, updates) {
    try {
      const setClause = [];
      const params = [];
      let paramCount = 1;

      if (updates.dashboard_name) {
        setClause.push(`dashboard_name = $${paramCount++}`);
        params.push(updates.dashboard_name);
      }

      if (updates.description) {
        setClause.push(`description = $${paramCount++}`);
        params.push(updates.description);
      }

      if (updates.refresh_interval) {
        setClause.push(`refresh_interval = $${paramCount++}`);
        params.push(updates.refresh_interval);
      }

      if (updates.layout_config) {
        setClause.push(`layout_config = $${paramCount++}`);
        params.push(JSON.stringify(updates.layout_config));
      }

      if (setClause.length === 0) {
        return false;
      }

      setClause.push(`updated_at = NOW()`);
      params.push(dashboardId);

      const query = `
        UPDATE dashboards 
        SET ${setClause.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await this.db.query(query, params);
      return result.rows[0];

    } catch (error) {
      console.error('Error updating dashboard:', error);
      throw error;
    }
  }
}

module.exports = DashboardManager;
