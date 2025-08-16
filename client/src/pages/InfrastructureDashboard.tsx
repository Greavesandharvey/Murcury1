import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const fetchMetrics = async () => {
  // In real implementation, fetch from /api/metrics
  // For foundation, return mock data
  return {
    serverLoad: 45, // percentage
    activeConnections: 12,
    queueStatus: 'Healthy',
    recentErrors: 2,
    loadData: [
      { time: '00:00', load: 30 },
      { time: '04:00', load: 45 },
      { time: '08:00', load: 60 },
      { time: '12:00', load: 50 },
      { time: '16:00', load: 40 },
      { time: '20:00', load: 35 },
    ],
    queueData: [
      { name: 'Pending', value: 15 },
      { name: 'Processing', value: 8 },
      { name: 'Completed', value: 120 },
      { name: 'Failed', value: 2 },
    ]
  };
};

export default function InfrastructureDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['infrastructureMetrics'],
    queryFn: fetchMetrics,
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) return <div>Loading infrastructure metrics...</div>;
  if (error) return <div>Error loading metrics: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Infrastructure Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Server Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{data.serverLoad}%</div>
            <Badge variant={data.serverLoad > 80 ? 'destructive' : 'success'}>
              {data.serverLoad > 80 ? 'High' : 'Normal'}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{data.activeConnections}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Queue Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={data.queueStatus === 'Healthy' ? 'success' : 'destructive'}>
              {data.queueStatus}
            </Badge>
            <div className="mt-2">Recent Errors: {data.recentErrors}</div>
          </CardContent>
        </Card>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Server Load Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.loadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="load" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Queue Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.queueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
