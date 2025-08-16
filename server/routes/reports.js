/**
 * Reports API Routes (Business Patch 007)
 * 
 * Comprehensive business intelligence and reporting API for UK furniture retail
 */

const ReportEngine = require('../services/report-engine');
const DashboardManager = require('../services/dashboard-manager');
const KPIManager = require('../services/kpi-manager');
const SalesAnalyticsEngine = require('../services/sales-analytics-engine');

module.exports = (app, db) => {
  const reportEngine = new ReportEngine(db);
  const dashboardManager = new DashboardManager(db);
  const kpiManager = new KPIManager(db);
  const analyticsEngine = new SalesAnalyticsEngine(db);

  /**
   * GET /api/report-templates
   * Get available report templates
   */
  app.get('/api/report-templates', async (req, res) => {
    try {
      const { category } = req.query;
      const templates = await reportEngine.getReportTemplates(category);
      
      res.json({
        success: true,
        data: templates
      });

    } catch (error) {
      console.error('Error getting report templates:', error);
      res.status(500).json({
        error: 'Failed to get report templates',
        details: error.message
      });
    }
  });

  /**
   * POST /api/reports/generate
   * Generate a new report
   */
  app.post('/api/reports/generate', async (req, res) => {
    try {
      const { templateId, parameters } = req.body;
      const userId = req.user?.id || 1; // Default user for now

      if (!templateId) {
        return res.status(400).json({
          error: 'Missing required field: templateId'
        });
      }

      const result = await reportEngine.generateReport(templateId, parameters || {}, userId);
      
      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({
        error: 'Failed to generate report',
        details: error.message
      });
    }
  });

  /**
   * GET /api/report-instances
   * Get report instances with filtering
   */
  app.get('/api/report-instances', async (req, res) => {
    try {
      const filters = {
        status: req.query.status,
        category: req.query.category,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        limit: parseInt(req.query.limit) || 50
      };

      const instances = await reportEngine.getReportInstances(filters);
      
      res.json({
        success: true,
        data: instances
      });

    } catch (error) {
      console.error('Error getting report instances:', error);
      res.status(500).json({
        error: 'Failed to get report instances',
        details: error.message
      });
    }
  });

  /**
   * GET /api/reports/sample/:reportName
   * Get sample data for a report
   */
  app.get('/api/reports/sample/:reportName', async (req, res) => {
    try {
      const { reportName } = req.params;
      const sampleData = await reportEngine.getSampleReportData(reportName);
      
      res.json({
        success: true,
        data: sampleData
      });

    } catch (error) {
      console.error('Error getting sample report data:', error);
      res.status(500).json({
        error: 'Failed to get sample report data',
        details: error.message
      });
    }
  });

  /**
   * GET /api/dashboards
   * Get available dashboards
   */
  app.get('/api/dashboards', async (req, res) => {
    try {
      const userId = req.query.user_id ? parseInt(req.query.user_id) : null;
      const dashboards = await dashboardManager.getDashboards(userId);
      
      res.json({
        success: true,
        data: dashboards
      });

    } catch (error) {
      console.error('Error getting dashboards:', error);
      res.status(500).json({
        error: 'Failed to get dashboards',
        details: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/:id
   * Get dashboard with live data
   */
  app.get('/api/dashboard/:id', async (req, res) => {
    try {
      const dashboardId = parseInt(req.params.id);
      const dashboardData = await dashboardManager.getDashboardData(dashboardId);
      
      res.json({
        success: true,
        data: dashboardData
      });

    } catch (error) {
      console.error('Error getting dashboard data:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Dashboard not found'
        });
      }

      res.status(500).json({
        error: 'Failed to get dashboard data',
        details: error.message
      });
    }
  });

  /**
   * POST /api/dashboards
   * Create a new dashboard
   */
  app.post('/api/dashboards', async (req, res) => {
    try {
      const { dashboardConfig } = req.body;
      const userId = req.user?.id || 1;

      if (!dashboardConfig) {
        return res.status(400).json({
          error: 'Missing required field: dashboardConfig'
        });
      }

      const result = await dashboardManager.createDashboard(dashboardConfig, userId);
      
      res.status(201).json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error creating dashboard:', error);
      res.status(500).json({
        error: 'Failed to create dashboard',
        details: error.message
      });
    }
  });

  /**
   * PUT /api/dashboard/:id
   * Update dashboard configuration
   */
  app.put('/api/dashboard/:id', async (req, res) => {
    try {
      const dashboardId = parseInt(req.params.id);
      const updates = req.body;

      const result = await dashboardManager.updateDashboard(dashboardId, updates);
      
      if (!result) {
        return res.status(400).json({
          error: 'No valid updates provided'
        });
      }

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error updating dashboard:', error);
      res.status(500).json({
        error: 'Failed to update dashboard',
        details: error.message
      });
    }
  });

  /**
   * DELETE /api/dashboard/:id
   * Delete a dashboard
   */
  app.delete('/api/dashboard/:id', async (req, res) => {
    try {
      const dashboardId = parseInt(req.params.id);
      await dashboardManager.deleteDashboard(dashboardId);
      
      res.json({
        success: true,
        message: 'Dashboard deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting dashboard:', error);
      res.status(500).json({
        error: 'Failed to delete dashboard',
        details: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/metrics
   * Get dashboard summary metrics
   */
  app.get('/api/dashboard/metrics', async (req, res) => {
    try {
      const metrics = await dashboardManager.getDashboardMetrics();
      
      res.json({
        success: true,
        data: metrics
      });

    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      res.status(500).json({
        error: 'Failed to get dashboard metrics',
        details: error.message
      });
    }
  });

  /**
   * PUT /api/dashboard/widget/:id/refresh
   * Refresh widget data
   */
  app.put('/api/dashboard/widget/:id/refresh', async (req, res) => {
    try {
      const widgetId = parseInt(req.params.id);
      const result = await dashboardManager.updateWidgetData(widgetId);
      
      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error refreshing widget data:', error);
      res.status(500).json({
        error: 'Failed to refresh widget data',
        details: error.message
      });
    }
  });

  /**
   * GET /api/kpis
   * Get KPI dashboard
   */
  app.get('/api/kpis', async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();
      const dashboard = await kpiManager.getKPIDashboard(date);
      
      res.json({
        success: true,
        data: dashboard
      });

    } catch (error) {
      console.error('Error getting KPI dashboard:', error);
      res.status(500).json({
        error: 'Failed to get KPI dashboard',
        details: error.message
      });
    }
  });

  /**
   * GET /api/kpis/trends/:kpiName
   * Get KPI trends over time
   */
  app.get('/api/kpis/trends/:kpiName', async (req, res) => {
    try {
      const { kpiName } = req.params;
      const days = parseInt(req.query.days) || 30;
      
      const trends = await kpiManager.getKPITrends(kpiName, days);
      
      res.json({
        success: true,
        data: trends
      });

    } catch (error) {
      console.error('Error getting KPI trends:', error);
      res.status(500).json({
        error: 'Failed to get KPI trends',
        details: error.message
      });
    }
  });

  /**
   * GET /api/kpis/summary
   * Get KPI summary statistics
   */
  app.get('/api/kpis/summary', async (req, res) => {
    try {
      const summary = await kpiManager.getKPISummary();
      
      res.json({
        success: true,
        data: summary
      });

    } catch (error) {
      console.error('Error getting KPI summary:', error);
      res.status(500).json({
        error: 'Failed to get KPI summary',
        details: error.message
      });
    }
  });

  /**
   * GET /api/kpis/alerts
   * Get KPI alerts for critical/warning KPIs
   */
  app.get('/api/kpis/alerts', async (req, res) => {
    try {
      const days = parseInt(req.query.days) || 7;
      const alerts = await kpiManager.getKPIAlerts(days);
      
      res.json({
        success: true,
        data: alerts
      });

    } catch (error) {
      console.error('Error getting KPI alerts:', error);
      res.status(500).json({
        error: 'Failed to get KPI alerts',
        details: error.message
      });
    }
  });

  /**
   * POST /api/kpis/calculate
   * Calculate KPIs for a specific date
   */
  app.post('/api/kpis/calculate', async (req, res) => {
    try {
      const date = req.body.date ? new Date(req.body.date) : new Date();
      await kpiManager.calculateKPIs(date);
      
      res.json({
        success: true,
        message: `KPIs calculated for ${date.toISOString().split('T')[0]}`
      });

    } catch (error) {
      console.error('Error calculating KPIs:', error);
      res.status(500).json({
        error: 'Failed to calculate KPIs',
        details: error.message
      });
    }
  });

  /**
   * PUT /api/kpis/:kpiName/target
   * Update KPI target value
   */
  app.put('/api/kpis/:kpiName/target', async (req, res) => {
    try {
      const { kpiName } = req.params;
      const { target } = req.body;

      if (target === undefined) {
        return res.status(400).json({
          error: 'Missing required field: target'
        });
      }

      const result = await kpiManager.updateKPITarget(kpiName, target);
      
      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error updating KPI target:', error);
      res.status(500).json({
        error: 'Failed to update KPI target',
        details: error.message
      });
    }
  });

  /**
   * GET /api/sales-analytics
   * Get comprehensive sales analytics
   */
  app.get('/api/sales-analytics', async (req, res) => {
    try {
      const { start_date, end_date, period } = req.query;

      let analytics;
      if (period) {
        analytics = await analyticsEngine.getPeriodicAnalytics(period);
      } else if (start_date && end_date) {
        analytics = await analyticsEngine.generateSalesAnalytics(
          new Date(start_date),
          new Date(end_date)
        );
      } else {
        // Default to last 30 days
        analytics = await analyticsEngine.getPeriodicAnalytics('last_30_days');
      }
      
      res.json({
        success: true,
        data: analytics
      });

    } catch (error) {
      console.error('Error getting sales analytics:', error);
      res.status(500).json({
        error: 'Failed to get sales analytics',
        details: error.message
      });
    }
  });

  /**
   * GET /api/sales-analytics/summary
   * Get sales summary for quick overview
   */
  app.get('/api/sales-analytics/summary', async (req, res) => {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      const summary = await analyticsEngine.getSalesSummary(startDate, endDate);
      
      res.json({
        success: true,
        data: summary
      });

    } catch (error) {
      console.error('Error getting sales summary:', error);
      res.status(500).json({
        error: 'Failed to get sales summary',
        details: error.message
      });
    }
  });

  /**
   * POST /api/reports/initialize
   * Initialize standard reports, dashboards, and KPIs
   */
  app.post('/api/reports/initialize', async (req, res) => {
    try {
      console.log('Initializing reports system...');
      
      // Initialize standard reports
      await reportEngine.initializeStandardReports();
      
      // Initialize standard dashboards
      await dashboardManager.initializeStandardDashboards();
      
      // Initialize standard KPIs
      await kpiManager.initializeStandardKPIs();
      
      // Calculate initial KPIs
      await kpiManager.calculateKPIs();

      res.json({
        success: true,
        message: 'Reports system initialized successfully',
        components: {
          reports: 'Standard UK furniture retail reports created',
          dashboards: 'Executive, Sales, and Financial dashboards created',
          kpis: 'Standard KPIs initialized and calculated'
        }
      });

    } catch (error) {
      console.error('Error initializing reports system:', error);
      res.status(500).json({
        error: 'Failed to initialize reports system',
        details: error.message
      });
    }
  });

  /**
   * POST /api/reports/cache/clear
   * Clear expired analytics cache
   */
  app.post('/api/reports/cache/clear', async (req, res) => {
    try {
      const clearedCount = await analyticsEngine.clearExpiredCache();
      
      res.json({
        success: true,
        message: `Cleared ${clearedCount} expired cache entries`
      });

    } catch (error) {
      console.error('Error clearing cache:', error);
      res.status(500).json({
        error: 'Failed to clear cache',
        details: error.message
      });
    }
  });

  /**
   * GET /api/reports/health
   * Check reports system health
   */
  app.get('/api/reports/health', async (req, res) => {
    try {
      // Check database connectivity
      await db.query('SELECT 1');
      
      // Check that key tables exist
      const tableChecks = await Promise.all([
        db.query("SELECT COUNT(*) FROM report_templates"),
        db.query("SELECT COUNT(*) FROM dashboards"),
        db.query("SELECT COUNT(*) FROM kpi_definitions")
      ]);

      const health = {
        status: 'healthy',
        database: 'connected',
        components: {
          report_templates: parseInt(tableChecks[0].rows[0].count),
          dashboards: parseInt(tableChecks[1].rows[0].count),
          kpi_definitions: parseInt(tableChecks[2].rows[0].count)
        },
        last_check: new Date().toISOString()
      };

      res.json({
        success: true,
        data: health
      });

    } catch (error) {
      console.error('Error checking reports health:', error);
      res.status(500).json({
        success: false,
        error: 'Reports system health check failed',
        details: error.message
      });
    }
  });
};
