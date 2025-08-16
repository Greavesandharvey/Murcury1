/**
 * KPI Manager Service (Business Patch 007)
 * 
 * Key Performance Indicators management for UK furniture retail
 * Automated KPI calculation, tracking, and trend analysis
 */

class KPIManager {
  constructor(db) {
    this.db = db;
  }

  // UK Furniture Retail KPIs
  static UK_FURNITURE_KPIS = {
    'daily_sales': {
      name: 'Daily Sales Revenue',
      category: 'financial',
      description: 'Total sales revenue for the current day',
      formula: `
        SELECT COALESCE(SUM(total_amount), 0) as value
        FROM orders 
        WHERE DATE(order_date) = $1
          AND status = 'completed'
      `,
      target: 5000,
      unit: '£',
      frequency: 'daily',
      trendDirection: 'higher_better'
    },

    'weekly_sales': {
      name: 'Weekly Sales Revenue',
      category: 'financial',
      description: 'Total sales revenue for the current week',
      formula: `
        SELECT COALESCE(SUM(total_amount), 0) as value
        FROM orders 
        WHERE order_date >= DATE_TRUNC('week', $1::date)
          AND order_date < DATE_TRUNC('week', $1::date) + INTERVAL '7 days'
          AND status = 'completed'
      `,
      target: 35000,
      unit: '£',
      frequency: 'weekly',
      trendDirection: 'higher_better'
    },

    'gross_margin': {
      name: 'Gross Margin Percentage',
      category: 'financial',
      description: 'Gross profit margin as percentage of revenue',
      formula: `
        SELECT 
          CASE 
            WHEN SUM(oi.line_total) > 0 
            THEN ((SUM(oi.line_total) - SUM(oi.quantity * COALESCE(p.cost_price, 0))) / SUM(oi.line_total)) * 100
            ELSE 0 
          END as value
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE DATE(o.order_date) = $1
          AND o.status = 'completed'
      `,
      target: 40,
      unit: '%',
      frequency: 'daily',
      trendDirection: 'higher_better'
    },

    'average_order_value': {
      name: 'Average Order Value',
      category: 'sales',
      description: 'Average value per completed order',
      formula: `
        SELECT COALESCE(AVG(total_amount), 0) as value
        FROM orders 
        WHERE DATE(order_date) = $1
          AND status = 'completed'
      `,
      target: 800,
      unit: '£',
      frequency: 'daily',
      trendDirection: 'higher_better'
    },

    'order_fulfillment_rate': {
      name: 'Order Fulfillment Rate',
      category: 'operational',
      description: 'Percentage of orders completed successfully',
      formula: `
        SELECT 
          CASE 
            WHEN COUNT(*) > 0 
            THEN (COUNT(CASE WHEN status = 'completed' THEN 1 END)::DECIMAL / COUNT(*)) * 100
            ELSE 0 
          END as value
        FROM orders 
        WHERE DATE(order_date) = $1
      `,
      target: 95,
      unit: '%',
      frequency: 'daily',
      trendDirection: 'higher_better'
    },

    'inventory_turnover': {
      name: 'Inventory Turnover Days',
      category: 'operational',
      description: 'Average days to turn over inventory',
      formula: `
        SELECT 
          CASE 
            WHEN AVG(p.stock_quantity * COALESCE(p.cost_price, 0)) > 0
            THEN (AVG(p.stock_quantity * COALESCE(p.cost_price, 0)) / GREATEST((
              SELECT COALESCE(SUM(oi.quantity * COALESCE(p2.cost_price, 0)), 1) / 365.0
              FROM order_items oi
              JOIN orders o ON oi.order_id = o.id
              JOIN products p2 ON oi.product_id = p2.id
              WHERE o.order_date >= $1::date - INTERVAL '365 days'
                AND o.status = 'completed'
            ), 1))
            ELSE 0
          END as value
        FROM products p
        WHERE p.active = true
      `,
      target: 45,
      unit: 'days',
      frequency: 'weekly',
      trendDirection: 'lower_better'
    },

    'customer_satisfaction': {
      name: 'Customer Satisfaction Score',
      category: 'customer',
      description: 'Average customer satisfaction rating',
      formula: `
        SELECT COALESCE(AVG(rating), 0) as value
        FROM customer_feedback
        WHERE feedback_date >= $1::date - INTERVAL '30 days'
      `,
      target: 4.5,
      unit: '/5',
      frequency: 'weekly',
      trendDirection: 'higher_better'
    },

    'low_stock_items': {
      name: 'Low Stock Items Count',
      category: 'operational',
      description: 'Number of products with low stock levels',
      formula: `
        SELECT COUNT(*) as value
        FROM products
        WHERE stock_quantity <= 5
          AND active = true
      `,
      target: 5,
      unit: 'items',
      frequency: 'daily',
      trendDirection: 'lower_better'
    },

    'new_customers': {
      name: 'New Customers This Month',
      category: 'customer',
      description: 'Number of new customers acquired this month',
      formula: `
        SELECT COUNT(*) as value
        FROM customers
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', $1::date)
      `,
      target: 50,
      unit: 'customers',
      frequency: 'monthly',
      trendDirection: 'higher_better'
    },

    'repeat_customer_rate': {
      name: 'Repeat Customer Rate',
      category: 'customer',
      description: 'Percentage of customers with multiple orders',
      formula: `
        SELECT 
          CASE 
            WHEN COUNT(DISTINCT o.customer_id) > 0 
            THEN (COUNT(DISTINCT CASE WHEN customer_order_count > 1 THEN o.customer_id END)::DECIMAL / COUNT(DISTINCT o.customer_id)) * 100
            ELSE 0 
          END as value
        FROM orders o
        JOIN (
          SELECT customer_id, COUNT(*) as customer_order_count
          FROM orders
          WHERE status = 'completed'
          GROUP BY customer_id
        ) cc ON o.customer_id = cc.customer_id
        WHERE DATE_TRUNC('month', o.order_date) = DATE_TRUNC('month', $1::date)
          AND o.status = 'completed'
      `,
      target: 30,
      unit: '%',
      frequency: 'monthly',
      trendDirection: 'higher_better'
    }
  };

  /**
   * Calculate all KPIs for a given date
   */
  async calculateKPIs(date = new Date()) {
    try {
      console.log(`Calculating KPIs for ${date.toISOString().split('T')[0]}...`);

      for (const [kpiKey, kpiDef] of Object.entries(KPIManager.UK_FURNITURE_KPIS)) {
        await this.calculateKPI(kpiKey, kpiDef, date);
      }

      console.log('KPI calculation completed');
      return true;

    } catch (error) {
      console.error('Error calculating KPIs:', error);
      throw error;
    }
  }

  /**
   * Calculate individual KPI
   */
  async calculateKPI(kpiKey, kpiDef, date) {
    try {
      // Get or create KPI definition
      let kpiDefinition = await this.getOrCreateKPIDefinition(kpiKey, kpiDef);

      // Calculate KPI value
      const result = await this.db.query(kpiDef.formula, [date]);
      const actualValue = parseFloat(result.rows[0]?.value || 0);

      // Calculate variance
      const targetValue = kpiDef.target;
      const varianceValue = actualValue - targetValue;
      const variancePercent = targetValue !== 0 ? (varianceValue / targetValue) * 100 : 0;

      // Determine status
      const status = this.determineKPIStatus(actualValue, targetValue, kpiDef.trendDirection);

      // Store KPI value
      const periodDate = date.toISOString().split('T')[0];
      await this.db.query(`
        INSERT INTO kpi_values (
          kpi_id, period_date, actual_value, target_value, 
          variance_value, variance_percent, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (kpi_id, period_date) 
        DO UPDATE SET
          actual_value = EXCLUDED.actual_value,
          target_value = EXCLUDED.target_value,
          variance_value = EXCLUDED.variance_value,
          variance_percent = EXCLUDED.variance_percent,
          status = EXCLUDED.status,
          calculated_at = NOW()
      `, [
        kpiDefinition.id,
        periodDate,
        actualValue,
        targetValue,
        varianceValue,
        variancePercent,
        status
      ]);

      console.log(`KPI ${kpiKey}: ${actualValue} (target: ${targetValue}, status: ${status})`);

    } catch (error) {
      console.error(`Error calculating KPI ${kpiKey}:`, error);
      throw error;
    }
  }

  /**
   * Get or create KPI definition
   */
  async getOrCreateKPIDefinition(kpiKey, kpiDef) {
    try {
      // Try to get existing definition
      let result = await this.db.query(`
        SELECT * FROM kpi_definitions WHERE kpi_name = $1
      `, [kpiKey]);

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      // Create new definition
      result = await this.db.query(`
        INSERT INTO kpi_definitions (
          kpi_name, kpi_category, description, calculation_formula,
          target_value, unit_of_measure, frequency, trend_direction, active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        kpiKey,
        kpiDef.category,
        kpiDef.description || kpiDef.name,
        kpiDef.formula,
        kpiDef.target,
        kpiDef.unit,
        kpiDef.frequency,
        kpiDef.trendDirection || 'higher_better',
        true
      ]);

      return result.rows[0];

    } catch (error) {
      console.error('Error getting/creating KPI definition:', error);
      throw error;
    }
  }

  /**
   * Determine KPI status based on performance
   */
  determineKPIStatus(actualValue, targetValue, trendDirection) {
    if (trendDirection === 'lower_better') {
      if (actualValue <= targetValue * 0.8) return 'excellent';
      if (actualValue <= targetValue) return 'good';
      if (actualValue <= targetValue * 1.2) return 'warning';
      return 'critical';
    } else {
      if (actualValue >= targetValue * 1.2) return 'excellent';
      if (actualValue >= targetValue) return 'good';
      if (actualValue >= targetValue * 0.8) return 'warning';
      return 'critical';
    }
  }

  /**
   * Get KPI trends over time
   */
  async getKPITrends(kpiName, days = 30) {
    try {
      const result = await this.db.query(`
        SELECT 
          kd.kpi_name,
          kd.description,
          kd.unit_of_measure,
          kd.target_value,
          kd.trend_direction,
          kv.period_date,
          kv.actual_value,
          kv.variance_value,
          kv.variance_percent,
          kv.status
        FROM kpi_definitions kd
        JOIN kpi_values kv ON kd.id = kv.kpi_id
        WHERE kd.kpi_name = $1
          AND kv.period_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY kv.period_date DESC
      `, [kpiName]);

      return result.rows;

    } catch (error) {
      console.error('Error getting KPI trends:', error);
      throw error;
    }
  }

  /**
   * Get current KPI dashboard
   */
  async getKPIDashboard(date = new Date()) {
    try {
      const periodDate = date.toISOString().split('T')[0];

      const result = await this.db.query(`
        SELECT 
          kd.kpi_name,
          kd.description,
          kd.kpi_category,
          kd.unit_of_measure,
          kd.target_value,
          kd.trend_direction,
          kv.actual_value,
          kv.variance_value,
          kv.variance_percent,
          kv.status,
          kv.period_date
        FROM kpi_definitions kd
        LEFT JOIN kpi_values kv ON kd.id = kv.kpi_id AND kv.period_date = $1
        WHERE kd.active = true
        ORDER BY kd.kpi_category, kd.kpi_name
      `, [periodDate]);

      // Group by category
      const dashboard = {};
      result.rows.forEach(kpi => {
        if (!dashboard[kpi.kpi_category]) {
          dashboard[kpi.kpi_category] = [];
        }
        dashboard[kpi.kpi_category].push(kpi);
      });

      return dashboard;

    } catch (error) {
      console.error('Error getting KPI dashboard:', error);
      throw error;
    }
  }

  /**
   * Get KPI summary statistics
   */
  async getKPISummary() {
    try {
      const result = await this.db.query(`
        SELECT 
          kd.kpi_category,
          COUNT(*) as total_kpis,
          COUNT(CASE WHEN kv.status = 'excellent' THEN 1 END) as excellent_count,
          COUNT(CASE WHEN kv.status = 'good' THEN 1 END) as good_count,
          COUNT(CASE WHEN kv.status = 'warning' THEN 1 END) as warning_count,
          COUNT(CASE WHEN kv.status = 'critical' THEN 1 END) as critical_count
        FROM kpi_definitions kd
        LEFT JOIN kpi_values kv ON kd.id = kv.kpi_id 
          AND kv.period_date = CURRENT_DATE
        WHERE kd.active = true
        GROUP BY kd.kpi_category
        ORDER BY kd.kpi_category
      `);

      return result.rows;

    } catch (error) {
      console.error('Error getting KPI summary:', error);
      throw error;
    }
  }

  /**
   * Get alerts for critical KPIs
   */
  async getKPIAlerts(days = 7) {
    try {
      const result = await this.db.query(`
        SELECT 
          kd.kpi_name,
          kd.description,
          kd.kpi_category,
          kd.unit_of_measure,
          kd.target_value,
          kv.actual_value,
          kv.variance_percent,
          kv.status,
          kv.period_date
        FROM kpi_definitions kd
        JOIN kpi_values kv ON kd.id = kv.kpi_id
        WHERE kv.status IN ('warning', 'critical')
          AND kv.period_date >= CURRENT_DATE - INTERVAL '${days} days'
          AND kd.active = true
        ORDER BY 
          CASE kv.status 
            WHEN 'critical' THEN 1 
            WHEN 'warning' THEN 2 
            ELSE 3 
          END,
          kv.period_date DESC
      `);

      return result.rows;

    } catch (error) {
      console.error('Error getting KPI alerts:', error);
      throw error;
    }
  }

  /**
   * Initialize standard KPIs
   */
  async initializeStandardKPIs() {
    try {
      console.log('Initializing standard UK furniture retail KPIs...');

      for (const [kpiKey, kpiDef] of Object.entries(KPIManager.UK_FURNITURE_KPIS)) {
        await this.getOrCreateKPIDefinition(kpiKey, kpiDef);
        console.log(`Initialized KPI: ${kpiDef.name}`);
      }

      console.log('Standard KPIs initialization complete');
      return true;

    } catch (error) {
      console.error('Error initializing standard KPIs:', error);
      throw error;
    }
  }

  /**
   * Update KPI target value
   */
  async updateKPITarget(kpiName, newTarget) {
    try {
      const result = await this.db.query(`
        UPDATE kpi_definitions 
        SET target_value = $1, updated_at = NOW()
        WHERE kpi_name = $2 AND active = true
        RETURNING *
      `, [newTarget, kpiName]);

      if (result.rows.length === 0) {
        throw new Error(`KPI not found: ${kpiName}`);
      }

      return result.rows[0];

    } catch (error) {
      console.error('Error updating KPI target:', error);
      throw error;
    }
  }

  /**
   * Get KPI performance over time
   */
  async getKPIPerformance(kpiName, startDate, endDate) {
    try {
      const result = await this.db.query(`
        SELECT 
          kv.period_date,
          kv.actual_value,
          kv.target_value,
          kv.variance_percent,
          kv.status
        FROM kpi_definitions kd
        JOIN kpi_values kv ON kd.id = kv.kpi_id
        WHERE kd.kpi_name = $1
          AND kv.period_date BETWEEN $2 AND $3
        ORDER BY kv.period_date
      `, [kpiName, startDate, endDate]);

      return result.rows;

    } catch (error) {
      console.error('Error getting KPI performance:', error);
      throw error;
    }
  }
}

module.exports = KPIManager;
