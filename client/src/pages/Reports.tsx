/**
 * Reports Page (Business Patch 007)
 * 
 * Comprehensive business intelligence and reporting interface for UK furniture retail
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  FileText,
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Building,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Refresh
} from "lucide-react";
import { Layout } from "../components/Layout";

interface KPI {
  kpi_name: string;
  description: string;
  kpi_category: string;
  unit_of_measure: string;
  target_value: number;
  actual_value: number;
  variance_percent: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  period_date: string;
}

interface SalesAnalytics {
  summary: {
    total_orders: number;
    unique_customers: number;
    total_revenue: number;
    average_order_value: number;
    growth_rate: number;
  };
  trends: Array<{
    date: string;
    daily_revenue: number;
    order_count: number;
    cumulative_revenue: number;
  }>;
  products: Array<{
    name: string;
    sku: string;
    revenue: number;
    quantity_sold: number;
    margin_percent: number;
  }>;
  categories: Array<{
    category_name: string;
    revenue: number;
    revenue_percentage: number;
  }>;
}

interface DashboardMetrics {
  daily_sales: number;
  monthly_sales: number;
  low_stock_count: number;
  customer_satisfaction: number;
  daily_orders: number;
}

interface ReportTemplate {
  id: number;
  report_name: string;
  report_category: string;
  description: string;
}

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [kpiData, setKpiData] = useState<Record<string, KPI[]>>({});
  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics | null>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data in parallel
      const [kpisRes, analyticsRes, metricsRes, templatesRes] = await Promise.all([
        fetch('/api/kpis').then(res => res.json()),
        fetch('/api/sales-analytics?period=last_30_days').then(res => res.json()),
        fetch('/api/dashboard/metrics').then(res => res.json()),
        fetch('/api/report-templates').then(res => res.json())
      ]);

      if (kpisRes.success) setKpiData(kpisRes.data);
      if (analyticsRes.success) setSalesAnalytics(analyticsRes.data);
      if (metricsRes.success) setDashboardMetrics(metricsRes.data);
      if (templatesRes.success) setReportTemplates(templatesRes.data);

    } catch (err) {
      console.error('Error loading reports data:', err);
      setError('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedReport) return;

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: parseInt(selectedReport),
          parameters: dateRange
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Report generated successfully!');
      } else {
        alert('Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report');
    }
  };

  const initializeReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports/initialize', {
        method: 'POST'
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Reports system initialized successfully!');
        await loadInitialData();
      } else {
        alert('Failed to initialize reports system');
      }
    } catch (err) {
      console.error('Error initializing reports:', err);
      alert('Failed to initialize reports system');
    } finally {
      setLoading(false);
    }
  };

  const calculateKPIs = async () => {
    try {
      const response = await fetch('/api/kpis/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date() })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('KPIs calculated successfully!');
        await loadInitialData();
      } else {
        alert('Failed to calculate KPIs');
      }
    } catch (err) {
      console.error('Error calculating KPIs:', err);
      alert('Failed to calculate KPIs');
    }
  };

  const getKPIIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getKPIColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{kpi.description}</CardTitle>
        {getKPIIcon(kpi.status)}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">
              {kpi.unit_of_measure === '£' && '£'}
              {kpi.actual_value?.toFixed(kpi.unit_of_measure === '%' ? 1 : 2)}
              {kpi.unit_of_measure === '%' && '%'}
              {kpi.unit_of_measure === 'days' && ' days'}
              {kpi.unit_of_measure === '/5' && '/5'}
              {kpi.unit_of_measure === 'items' && ' items'}
            </div>
            <p className="text-xs text-muted-foreground">
              Target: {kpi.unit_of_measure === '£' && '£'}{kpi.target_value}
              {kpi.unit_of_measure === '%' && '%'}
              {kpi.unit_of_measure === 'days' && ' days'}
              {kpi.unit_of_measure === '/5' && '/5'}
              {kpi.unit_of_measure === 'items' && ' items'}
            </p>
          </div>
          <div className="flex items-center">
            {kpi.variance_percent > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm ml-1 ${getKPIColor(kpi.status)}`}>
              {Math.abs(kpi.variance_percent || 0).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="mt-2">
          <Badge variant={kpi.status === 'excellent' || kpi.status === 'good' ? 'default' : 'destructive'}>
            {kpi.status.toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  if (loading && !salesAnalytics) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading reports...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Business intelligence and performance reporting</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadInitialData} variant="outline" size="sm">
              <Refresh className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={calculateKPIs} variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Calculate KPIs
            </Button>
            <Button onClick={initializeReports} variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Initialize System
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Executive KPIs */}
            {Object.keys(kpiData).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
                {Object.entries(kpiData).map(([category, kpis]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-medium mb-3 capitalize">{category.replace('_', ' ')} KPIs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {kpis.map((kpi) => (
                        <KPICard key={kpi.kpi_name} kpi={kpi} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Metrics Cards */}
            {dashboardMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£{dashboardMetrics.daily_sales.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£{dashboardMetrics.monthly_sales.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{dashboardMetrics.low_stock_count}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Orders</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardMetrics.daily_orders}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardMetrics.customer_satisfaction.toFixed(1)}/5</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Charts */}
            {salesAnalytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Trend (Last 30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesAnalytics.trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => [`£${parseFloat(value).toFixed(2)}`, 'Revenue']} />
                        <Line type="monotone" dataKey="daily_revenue" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={salesAnalytics.categories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category_name, revenue_percentage }) => 
                            `${category_name} (${revenue_percentage?.toFixed(1)}%)`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {salesAnalytics.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`£${parseFloat(value).toFixed(2)}`, 'Revenue']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="text-green-600 font-semibold">
                        £{salesAnalytics?.summary?.total_revenue?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order:</span>
                      <span>£{salesAnalytics?.summary?.average_order_value?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate:</span>
                      <span className={salesAnalytics?.summary?.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {salesAnalytics?.summary?.growth_rate?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Orders:</span>
                      <span className="font-semibold">{salesAnalytics?.summary?.total_orders || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unique Customers:</span>
                      <span>{salesAnalytics?.summary?.unique_customers || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Order Value:</span>
                      <span>£{salesAnalytics?.summary?.average_order_value?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly Target:</span>
                      <span>£100,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current:</span>
                      <span className="font-semibold">£{dashboardMetrics?.monthly_sales?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span>{((dashboardMetrics?.monthly_sales || 0) / 100000 * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            {salesAnalytics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Sales Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesAnalytics.trends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value: any) => [`£${parseFloat(value).toFixed(2)}`, 'Revenue']} />
                          <Bar dataKey="daily_revenue" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cumulative Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={salesAnalytics.trends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value: any) => [`£${parseFloat(value).toFixed(2)}`, 'Cumulative Revenue']} />
                          <Area 
                            type="monotone" 
                            dataKey="cumulative_revenue" 
                            stroke="#82ca9d" 
                            fill="#82ca9d" 
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Products Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Product</th>
                            <th className="text-left p-2">SKU</th>
                            <th className="text-right p-2">Qty Sold</th>
                            <th className="text-right p-2">Revenue</th>
                            <th className="text-right p-2">Margin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesAnalytics.products.slice(0, 10).map((product, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2 font-medium">{product.name}</td>
                              <td className="p-2 font-mono text-sm">{product.sku}</td>
                              <td className="p-2 text-right">{product.quantity_sold}</td>
                              <td className="p-2 text-right">£{product.revenue.toFixed(2)}</td>
                              <td className="p-2 text-right">{product.margin_percent.toFixed(1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">£89,240</div>
                  <p className="text-xs text-muted-foreground">At cost price</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {dashboardMetrics?.low_stock_count || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Require reordering</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Turnover Days</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">Average days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Create detailed reports for financial analysis, sales performance, and inventory management
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Report Type</label>
                      <Select value={selectedReport} onValueChange={setSelectedReport}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.report_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Date</label>
                        <input
                          type="date"
                          value={dateRange.start_date}
                          onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">End Date</label>
                        <input
                          type="date"
                          value={dateRange.end_date}
                          onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={generateReport}
                      disabled={!selectedReport}
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Available Reports</h3>
                    <div className="space-y-2">
                      {reportTemplates.map((template) => (
                        <div key={template.id} className="border rounded p-3">
                          <div className="font-medium">{template.report_name}</div>
                          <div className="text-sm text-muted-foreground">{template.description}</div>
                          <Badge variant="outline" className="mt-1">
                            {template.report_category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
