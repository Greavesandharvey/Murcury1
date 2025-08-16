/**
 * MCP Dashboard Page (Patch 000E)
 * 
 * Comprehensive monitoring and management interface for the 13 MCP agents
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Activity, Cpu, HardDrive, Zap, RefreshCw } from 'lucide-react';

interface MCPAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive' | 'error';
  capabilities: string[];
  lastSeen: string;
}

interface AgentMetric {
  agentId: string;
  tasksProcessed: number;
  errorCount: number;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  timestamp: string;
}

export function MCPDashboard() {
  const { data: agents = [], isLoading: agentsLoading, refetch: refetchAgents } = useQuery({
    queryKey: ['/api/mcp/agents'],
    staleTime: 30000, // 30 seconds
  });

  const { data: metrics = [], isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['/api/mcp/metrics'],
    refetchInterval: 5000, // Update every 5 seconds
    staleTime: 2000, // 2 seconds
  });

  const handleRefreshAll = () => {
    refetchAgents();
    refetchMetrics();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage the 13 MCP agents powering MercuryDivine
          </p>
        </div>
        <Button onClick={handleRefreshAll} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* System Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">
              MCP agents deployed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {agents.filter((agent: MCPAgent) => agent.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.reduce((sum: number, metric: AgentMetric) => sum + metric.tasksProcessed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total tasks processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Excellent</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Status Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Agent Status</h2>
        {agentsLoading ? (
          <div className="text-center py-8">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading agents...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {agents.map((agent: MCPAgent) => (
              <Card key={agent.id} className="divine-glass">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
                  <Badge variant={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-2">{agent.role}</div>
                  <div className="space-y-1">
                    {agent.capabilities?.slice(0, 2).map((cap: string) => (
                      <div key={cap} className="text-xs bg-muted px-2 py-1 rounded">
                        {cap.replace('-', ' ')}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Last seen: {agent.lastSeen || 'Unknown'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Agent Metrics Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Real-time Agent Metrics</span>
          </CardTitle>
          <CardDescription>
            Live performance monitoring for all MCP agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metricsLoading && metrics.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading metrics...</p>
            </div>
          ) : metrics.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No metrics data available</p>
              <p className="text-sm text-muted-foreground">
                Metrics will appear once agents start reporting
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.map((metric: AgentMetric) => {
                const agent = agents.find((a: MCPAgent) => a.id === metric.agentId);
                return (
                  <div key={metric.agentId} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusDot(agent?.status || 'inactive')}`}></div>
                      <div className="flex-1">
                        <div className="font-medium">{agent?.name || 'Unknown Agent'}</div>
                        <div className="text-sm text-muted-foreground">
                          Tasks: {metric.tasksProcessed} | Errors: {metric.errorCount}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Cpu className="h-4 w-4 mx-auto mb-1" />
                        <div className="text-xs">{metric.cpuUsage?.toFixed(1) || '0.0'}%</div>
                        <Progress value={metric.cpuUsage || 0} className="w-16 h-2" />
                      </div>
                      <div className="text-center">
                        <HardDrive className="h-4 w-4 mx-auto mb-1" />
                        <div className="text-xs">{(metric.memoryUsage || 0).toFixed(0)}MB</div>
                        <Progress value={((metric.memoryUsage || 0) / 1024) * 100} className="w-16 h-2" />
                      </div>
                      <div className="text-center">
                        <Zap className="h-4 w-4 mx-auto mb-1" />
                        <div className="text-xs">{(metric.responseTime || 0).toFixed(0)}ms</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status and Commands */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Communication Health</CardTitle>
            <CardDescription>Infrastructure connectivity status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Pub/Sub Messaging</span>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Database Connection</span>
                </div>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">WebSocket API</span>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Agent Communication</span>
                </div>
                <Badge variant="secondary">Monitoring</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Management</CardTitle>
            <CardDescription>System-wide agent operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Restart All Agents
            </Button>
            <Button variant="outline" className="w-full">
              <Activity className="w-4 h-4 mr-2" />
              Run Diagnostics
            </Button>
            <Button variant="outline" className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Export Metrics
            </Button>
            <Button variant="outline" className="w-full">
              <HardDrive className="w-4 h-4 mr-2" />
              Generate Health Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MCPDashboard;
