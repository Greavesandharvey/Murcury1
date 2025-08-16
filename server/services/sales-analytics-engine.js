/**
 * Sales Analytics Engine (Business Patch 007)
 * 
 * Advanced sales analytics with caching for UK furniture retail
 * Provides comprehensive sales insights, trends, and performance analysis
 */

class SalesAnalyticsEngine {
  constructor(db) {
    this.db = db;
    this.cacheExpiry = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  }

  /**
   * Generate comprehensive sales analytics with caching
   */
  async generateSalesAnalytics(startDate, endDate) {
    try {
      const cacheKey = `sales_analytics_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
      
      // Check cache first
      const cached = await this.getCachedAnalytics(cacheKey);
      if (cached) {
        return cached.data_payload;
      }

      // Generate fresh analytics
      console.log(`Generating sales analytics for ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

      const analytics = {
        summary: await this.getSalesSummary(startDate, endDate),
        trends: await this.getSalesTrends(startDate, endDate),
        products: await this.getProductPerformance(startDate, endDate),
        customers: await this.getCustomerAnalysis(startDate, endDate),
        categories: await this.getCategoryAnalysis(startDate, endDate),
        margins: await this.getMarginAnalysis(startDate, endDate),
        forecasting: await this.getSalesForecasting(startDate, endDate),
        seasonality: await this.getSeasonalityAnalysis(startDate, endDate)
      };

      // Cache the results
      await this.cacheAnalytics(cacheKey, analytics);

      return analytics;

    } catch (error) {
      console.error('Error generating sales analytics:', error);
      throw error;
    }
  }

  /**
   * Get sales summary metrics
   */
  async getSalesSummary(startDate, endDate) {
    try {
      const result = await this.db.query(`
        SELECT 
          COUNT(DISTINCT o.id) as total_orders,
          COUNT(DISTINCT o.customer_id) as unique_customers,
          SUM(o.total_amount) as total_revenue,
          AVG(o.total_amount) as average_order_value,
          SUM(o.vat_amount) as total_vat,
          COUNT(DISTINCT DATE(o.order_date)) as active_days,
          MIN(o.order_date) as first_order,
          MAX(o.order_date) as last_order,
          -- Growth metrics
          (SELECT SUM(total_amount) 
           FROM orders 
           WHERE order_date BETWEEN $1::date - ($2::date - $1::date) AND $1::date - INTERVAL '1 day'
             AND status = 'completed'
          ) as previous_period_revenue
        FROM orders o
        WHERE o.order_date BETWEEN $1 AND $2
          AND o.status = 'completed'
      `, [startDate, endDate]);

      const summary = result.rows[0];
      
      // Calculate growth rate
      const currentRevenue = parseFloat(summary.total_revenue || 0);
      const previousRevenue = parseFloat(summary.previous_period_revenue || 0);
      const growthRate = previousRevenue > 0 ? 
        ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      return {
        ...summary,
        total_revenue: currentRevenue,
        average_order_value: parseFloat(summary.average_order_value || 0),
        total_vat: parseFloat(summary.total_vat || 0),
        total_orders: parseInt(summary.total_orders || 0),
        unique_customers: parseInt(summary.unique_customers || 0),
        active_days: parseInt(summary.active_days || 0),
        growth_rate: growthRate
      };

    } catch (error) {
      console.error('Error getting sales summary:', error);
      throw error;
    }
  }

  /**
   * Get sales trends over time
   */
  async getSalesTrends(startDate, endDate) {
    try {
      const result = await this.db.query(`
        SELECT 
          DATE(o.order_date) as date,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as daily_revenue,
          AVG(o.total_amount) as avg_order_value,
          COUNT(DISTINCT o.customer_id) as unique_customers,
          -- Running totals
          SUM(SUM(o.total_amount)) OVER (ORDER BY DATE(o.order_date)) as cumulative_revenue,
          -- Day of week analysis
          EXTRACT(dow FROM o.order_date) as day_of_week,
          TO_CHAR(o.order_date, 'Day') as day_name
        FROM orders o
        WHERE o.order_date BETWEEN $1 AND $2
          AND o.status = 'completed'
        GROUP BY DATE(o.order_date), EXTRACT(dow FROM o.order_date), TO_CHAR(o.order_date, 'Day')
        ORDER BY date
      `, [startDate, endDate]);

      return result.rows.map(row => ({
        ...row,
        daily_revenue: parseFloat(row.daily_revenue || 0),
        avg_order_value: parseFloat(row.avg_order_value || 0),
        cumulative_revenue: parseFloat(row.cumulative_revenue || 0),
        order_count: parseInt(row.order_count || 0),
        unique_customers: parseInt(row.unique_customers || 0)
      }));

    } catch (error) {
      console.error('Error getting sales trends:', error);
      throw error;
    }
  }

  /**
   * Get product performance analysis
   */
  async getProductPerformance(startDate, endDate) {
    try {
      const result = await this.db.query(`
        SELECT 
          p.id,
          p.name,
          p.sku,
          COALESCE(c.name, 'Uncategorized') as category_name,
          COALESCE(s.name, 'Unknown') as supplier_name,
          SUM(oi.quantity) as quantity_sold,
          SUM(oi.line_total) as revenue,
          AVG(oi.unit_price) as avg_selling_price,
          COUNT(DISTINCT oi.order_id) as orders_containing,
          RANK() OVER (ORDER BY SUM(oi.line_total) DESC) as revenue_rank,
          -- Profitability analysis
          p.cost_price,
          SUM(oi.line_total) - (SUM(oi.quantity) * COALESCE(p.cost_price, 0)) as gross_profit,
          CASE 
            WHEN SUM(oi.line_total) > 0 
            THEN ((SUM(oi.line_total) - (SUM(oi.quantity) * COALESCE(p.cost_price, 0))) / SUM(oi.line_total)) * 100
            ELSE 0 
          END as margin_percent,
          -- Velocity metrics
          p.stock_quantity as current_stock,
          CASE 
            WHEN SUM(oi.quantity) > 0 
            THEN p.stock_quantity::DECIMAL / (SUM(oi.quantity) / EXTRACT(days FROM ($2::date - $1::date + 1)))
            ELSE NULL 
          END as days_of_stock
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        JOIN orders o ON oi.order_id = o.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE o.order_date BETWEEN $1 AND $2
          AND o.status = 'completed'
        GROUP BY p.id, p.name, p.sku, c.name, s.name, p.cost_price, p.stock_quantity
        ORDER BY revenue DESC
        LIMIT 50
      `, [startDate, endDate]);

      return result.rows.map(row => ({
        ...row,
        revenue: parseFloat(row.revenue || 0),
        avg_selling_price: parseFloat(row.avg_selling_price || 0),
        gross_profit: parseFloat(row.gross_profit || 0),
        margin_percent: parseFloat(row.margin_percent || 0),
        cost_price: parseFloat(row.cost_price || 0),
        quantity_sold: parseInt(row.quantity_sold || 0),
        orders_containing: parseInt(row.orders_containing || 0),
        revenue_rank: parseInt(row.revenue_rank || 0),
        current_stock: parseInt(row.current_stock || 0),
        days_of_stock: row.days_of_stock ? parseFloat(row.days_of_stock) : null
      }));

    } catch (error) {
      console.error('Error getting product performance:', error);
      throw error;
    }
  }

  /**
   * Get customer analysis
   */
  async getCustomerAnalysis(startDate, endDate) {
    try {
      // Customer segments
      const segmentResult = await this.db.query(`
        SELECT 
          CASE 
            WHEN order_count = 1 THEN 'New'
            WHEN order_count BETWEEN 2 AND 5 THEN 'Regular'
            WHEN order_count > 5 THEN 'VIP'
            ELSE 'Other'
          END as segment,
          COUNT(*) as customer_count,
          SUM(total_spent) as segment_revenue,
          AVG(total_spent) as avg_customer_value
        FROM (
          SELECT 
            o.customer_id,
            COUNT(o.id) as order_count,
            SUM(o.total_amount) as total_spent
          FROM orders o
          WHERE o.order_date BETWEEN $1 AND $2
            AND o.status = 'completed'
          GROUP BY o.customer_id
        ) customer_stats
        GROUP BY segment
        ORDER BY segment_revenue DESC
      `, [startDate, endDate]);

      // Top customers
      const topCustomersResult = await this.db.query(`
        SELECT 
          c.id,
          CONCAT(c.first_name, ' ', c.last_name) as name,
          c.email,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as total_spent,
          AVG(o.total_amount) as avg_order_value,
          MIN(o.order_date) as first_order,
          MAX(o.order_date) as last_order
        FROM customers c
        JOIN orders o ON c.id = o.customer_id
        WHERE o.order_date BETWEEN $1 AND $2
          AND o.status = 'completed'
        GROUP BY c.id, c.first_name, c.last_name, c.email
        ORDER BY total_spent DESC
        LIMIT 20
      `, [startDate, endDate]);

      // Customer acquisition
      const acquisitionResult = await this.db.query(`
        SELECT 
          DATE_TRUNC('week', c.created_at) as week,
          COUNT(*) as new_customers
        FROM customers c
        WHERE c.created_at BETWEEN $1 AND $2
        GROUP BY DATE_TRUNC('week', c.created_at)
        ORDER BY week
      `, [startDate, endDate]);

      return {
        segments: segmentResult.rows.map(row => ({
          ...row,
          customer_count: parseInt(row.customer_count || 0),
          segment_revenue: parseFloat(row.segment_revenue || 0),
          avg_customer_value: parseFloat(row.avg_customer_value || 0)
        })),
        top_customers: topCustomersResult.rows.map(row => ({
          ...row,
          order_count: parseInt(row.order_count || 0),
          total_spent: parseFloat(row.total_spent || 0),
          avg_order_value: parseFloat(row.avg_order_value || 0)
        })),
        acquisition: acquisitionResult.rows.map(row => ({
          ...row,
          new_customers: parseInt(row.new_customers || 0)
        }))
      };

    } catch (error) {
      console.error('Error getting customer analysis:', error);
      throw error;
    }
  }

  /**
   * Get category analysis
   */
  async getCategoryAnalysis(startDate, endDate) {
    try {
      const result = await this.db.query(`
        SELECT 
          COALESCE(c.name, 'Uncategorized') as category_name,
          COUNT(DISTINCT oi.product_id) as products_sold,
          SUM(oi.quantity) as quantity_sold,
          SUM(oi.line_total) as revenue,
          AVG(oi.unit_price) as avg_selling_price,
          -- Calculate percentage of total revenue
          (SUM(oi.line_total) / (
            SELECT SUM(line_total) 
            FROM order_items oi2 
            JOIN orders o2 ON oi2.order_id = o2.id 
            WHERE o2.order_date BETWEEN $1 AND $2 
              AND o2.status = 'completed'
          )) * 100 as revenue_percentage,
          -- Profitability by category
          SUM(oi.line_total) - SUM(oi.quantity * COALESCE(p.cost_price, 0)) as gross_profit,
          CASE 
            WHEN SUM(oi.line_total) > 0 
            THEN ((SUM(oi.line_total) - SUM(oi.quantity * COALESCE(p.cost_price, 0))) / SUM(oi.line_total)) * 100
            ELSE 0 
          END as margin_percent
        FROM categories c
        RIGHT JOIN products p ON c.id = p.category_id
        JOIN order_items oi ON p.id = oi.product_id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.order_date BETWEEN $1 AND $2
          AND o.status = 'completed'
        GROUP BY c.id, c.name
        ORDER BY revenue DESC
      `, [startDate, endDate]);

      return result.rows.map(row => ({
        ...row,
        products_sold: parseInt(row.products_sold || 0),
        quantity_sold: parseInt(row.quantity_sold || 0),
        revenue: parseFloat(row.revenue || 0),
        avg_selling_price: parseFloat(row.avg_selling_price || 0),
        revenue_percentage: parseFloat(row.revenue_percentage || 0),
        gross_profit: parseFloat(row.gross_profit || 0),
        margin_percent: parseFloat(row.margin_percent || 0)
      }));

    } catch (error) {
      console.error('Error getting category analysis:', error);
      throw error;
    }
  }

  /**
   * Get margin analysis
   */
  async getMarginAnalysis(startDate, endDate) {
    try {
      const result = await this.db.query(`
        SELECT 
          DATE(o.order_date) as date,
          SUM(oi.line_total) as revenue,
          SUM(oi.quantity * COALESCE(p.cost_price, 0)) as cost_of_goods,
          SUM(oi.line_total) - SUM(oi.quantity * COALESCE(p.cost_price, 0)) as gross_profit,
          CASE 
            WHEN SUM(oi.line_total) > 0 
            THEN ((SUM(oi.line_total) - SUM(oi.quantity * COALESCE(p.cost_price, 0))) / SUM(oi.line_total)) * 100
            ELSE 0 
          END as margin_percent
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.order_date BETWEEN $1 AND $2
          AND o.status = 'completed'
        GROUP BY DATE(o.order_date)
        ORDER BY date
      `, [startDate, endDate]);

      return result.rows.map(row => ({
        ...row,
        revenue: parseFloat(row.revenue || 0),
        cost_of_goods: parseFloat(row.cost_of_goods || 0),
        gross_profit: parseFloat(row.gross_profit || 0),
        margin_percent: parseFloat(row.margin_percent || 0)
      }));

    } catch (error) {
      console.error('Error getting margin analysis:', error);
      throw error;
    }
  }

  /**
   * Get sales forecasting based on trends
   */
  async getSalesForecasting(startDate, endDate) {
    try {
      // Simple linear trend analysis
      const trendResult = await this.db.query(`
        SELECT 
          DATE(order_date) as date,
          SUM(total_amount) as daily_revenue,
          ROW_NUMBER() OVER (ORDER BY DATE(order_date)) as day_number
        FROM orders
        WHERE order_date BETWEEN $1 AND $2
          AND status = 'completed'
        GROUP BY DATE(order_date)
        ORDER BY date
      `, [startDate, endDate]);

      const data = trendResult.rows;
      if (data.length < 7) {
        return { message: 'Insufficient data for forecasting', forecast: [] };
      }

      // Calculate trend (simplified linear regression)
      const n = data.length;
      const sumX = data.reduce((sum, row) => sum + parseInt(row.day_number), 0);
      const sumY = data.reduce((sum, row) => sum + parseFloat(row.daily_revenue), 0);
      const sumXY = data.reduce((sum, row) => sum + (parseInt(row.day_number) * parseFloat(row.daily_revenue)), 0);
      const sumX2 = data.reduce((sum, row) => sum + Math.pow(parseInt(row.day_number), 2), 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - Math.pow(sumX, 2));
      const intercept = (sumY - slope * sumX) / n;

      // Generate forecast for next 7 days
      const forecast = [];
      const lastDay = parseInt(data[data.length - 1].day_number);
      const lastDate = new Date(data[data.length - 1].date);

      for (let i = 1; i <= 7; i++) {
        const forecastDate = new Date(lastDate);
        forecastDate.setDate(lastDate.getDate() + i);
        const predictedRevenue = slope * (lastDay + i) + intercept;

        forecast.push({
          date: forecastDate.toISOString().split('T')[0],
          predicted_revenue: Math.max(0, predictedRevenue),
          confidence: Math.max(0.5, 1 - (i * 0.1)) // Decreasing confidence over time
        });
      }

      return {
        trend: { slope, intercept },
        forecast: forecast,
        historical_average: sumY / n
      };

    } catch (error) {
      console.error('Error getting sales forecasting:', error);
      throw error;
    }
  }

  /**
   * Get seasonality analysis
   */
  async getSeasonalityAnalysis(startDate, endDate) {
    try {
      const result = await this.db.query(`
        SELECT 
          EXTRACT(month FROM order_date) as month,
          TO_CHAR(order_date, 'Month') as month_name,
          EXTRACT(dow FROM order_date) as day_of_week,
          TO_CHAR(order_date, 'Day') as day_name,
          COUNT(*) as order_count,
          SUM(total_amount) as revenue,
          AVG(total_amount) as avg_order_value
        FROM orders
        WHERE order_date BETWEEN $1 AND $2
          AND status = 'completed'
        GROUP BY 
          EXTRACT(month FROM order_date), TO_CHAR(order_date, 'Month'),
          EXTRACT(dow FROM order_date), TO_CHAR(order_date, 'Day')
        ORDER BY month, day_of_week
      `, [startDate, endDate]);

      // Group by month and day of week
      const byMonth = {};
      const byDayOfWeek = {};

      result.rows.forEach(row => {
        const monthKey = row.month_name.trim();
        const dayKey = row.day_name.trim();

        if (!byMonth[monthKey]) {
          byMonth[monthKey] = { order_count: 0, revenue: 0, avg_order_value: 0, count: 0 };
        }
        if (!byDayOfWeek[dayKey]) {
          byDayOfWeek[dayKey] = { order_count: 0, revenue: 0, avg_order_value: 0, count: 0 };
        }

        byMonth[monthKey].order_count += parseInt(row.order_count);
        byMonth[monthKey].revenue += parseFloat(row.revenue);
        byMonth[monthKey].count += 1;

        byDayOfWeek[dayKey].order_count += parseInt(row.order_count);
        byDayOfWeek[dayKey].revenue += parseFloat(row.revenue);
        byDayOfWeek[dayKey].count += 1;
      });

      // Calculate averages
      Object.keys(byMonth).forEach(month => {
        byMonth[month].avg_order_value = byMonth[month].revenue / byMonth[month].order_count || 0;
      });

      Object.keys(byDayOfWeek).forEach(day => {
        byDayOfWeek[day].avg_order_value = byDayOfWeek[day].revenue / byDayOfWeek[day].order_count || 0;
      });

      return {
        by_month: byMonth,
        by_day_of_week: byDayOfWeek
      };

    } catch (error) {
      console.error('Error getting seasonality analysis:', error);
      throw error;
    }
  }

  /**
   * Get cached analytics
   */
  async getCachedAnalytics(cacheKey) {
    try {
      const result = await this.db.query(`
        SELECT data_payload, expires_at
        FROM sales_analytics_cache
        WHERE cache_key = $1 AND expires_at > NOW()
      `, [cacheKey]);

      if (result.rows.length > 0) {
        console.log(`Using cached analytics for ${cacheKey}`);
        return result.rows[0];
      }

      return null;

    } catch (error) {
      console.error('Error getting cached analytics:', error);
      return null;
    }
  }

  /**
   * Cache analytics data
   */
  async cacheAnalytics(cacheKey, analytics) {
    try {
      const expiresAt = new Date(Date.now() + this.cacheExpiry);

      await this.db.query(`
        INSERT INTO sales_analytics_cache (
          cache_key, cache_date, data_type, aggregation_level,
          data_payload, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (cache_key) DO UPDATE SET
          data_payload = EXCLUDED.data_payload,
          expires_at = EXCLUDED.expires_at,
          created_at = NOW()
      `, [
        cacheKey,
        new Date(),
        'sales_analytics',
        'daily',
        JSON.stringify(analytics),
        expiresAt
      ]);

      console.log(`Cached analytics for ${cacheKey} until ${expiresAt}`);

    } catch (error) {
      console.error('Error caching analytics:', error);
      // Don't throw error - caching failure shouldn't break analytics
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache() {
    try {
      const result = await this.db.query(`
        DELETE FROM sales_analytics_cache 
        WHERE expires_at < NOW()
      `);

      console.log(`Cleared ${result.rowCount} expired cache entries`);
      return result.rowCount;

    } catch (error) {
      console.error('Error clearing expired cache:', error);
      throw error;
    }
  }

  /**
   * Get analytics for specific time periods
   */
  async getPeriodicAnalytics(period = 'last_30_days') {
    try {
      let startDate, endDate;
      const now = new Date();

      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date();
          break;
        case 'yesterday':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'last_7_days':
          startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
          endDate = new Date();
          break;
        case 'last_30_days':
          startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
          endDate = new Date();
          break;
        case 'this_month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date();
          break;
        case 'last_month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        default:
          throw new Error(`Invalid period: ${period}`);
      }

      return await this.generateSalesAnalytics(startDate, endDate);

    } catch (error) {
      console.error('Error getting periodic analytics:', error);
      throw error;
    }
  }
}

module.exports = SalesAnalyticsEngine;
