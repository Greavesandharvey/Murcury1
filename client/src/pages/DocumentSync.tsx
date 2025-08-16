/**
 * Document Sync Page (Patch 000E)
 * 
 * Monitor document flow between Morpheus and MercuryOne systems
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, RefreshCw, Activity } from 'lucide-react';

interface SyncStatus {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  totalToday: number;
}

interface RecentDocument {
  id: string;
  filename: string;
  type: string;
  size: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  source: string;
  confidence?: number;
}

interface IrisAgentStatus {
  connectionHealth: number;
  processingRate: number;
  lastHeartbeat: string;
  documentsInQueue: number;
  errorRate: number;
}

export function DocumentSync() {
  const { data: syncStatus, isLoading: statusLoading, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/document-sync/status'],
    refetchInterval: 2000, // Update every 2 seconds
    staleTime: 1000,
  });

  const { data: recentDocuments = [], isLoading: documentsLoading, refetch: refetchDocuments } = useQuery({
    queryKey: ['/api/document-sync/recent'],
    refetchInterval: 5000, // Update every 5 seconds
    staleTime: 2000,
  });

  const { data: irisStatus, isLoading: irisLoading, refetch: refetchIris } = useQuery({
    queryKey: ['/api/document-sync/iris-status'],
    refetchInterval: 3000, // Update every 3 seconds
    staleTime: 1500,
  });

  const handleRefreshAll = () => {
    refetchStatus();
    refetchDocuments();
    refetchIris();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Upload className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (health: number) => {
    if (health >= 90) return 'Excellent';
    if (health >= 70) return 'Good';
    if (health >= 50) return 'Warning';
    return 'Critical';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Sync</h1>
          <p className="text-muted-foreground">
            Monitor document flow between Morpheus and MercuryOne
          </p>
        </div>
        <Button onClick={handleRefreshAll} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Sync Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Upload</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStatus?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              Documents waiting for processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{syncStatus?.processing || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently being processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{syncStatus?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{syncStatus?.failed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Processing errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Iris Agent Status */}
      <Card className="divine-gradient-subtle">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              (irisStatus?.connectionHealth || 0) >= 90 ? 'bg-green-500' : 
              (irisStatus?.connectionHealth || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span>Iris Agent - Document Bridge</span>
          </CardTitle>
          <CardDescription>
            Real-time communication bridge status and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {irisLoading ? (
            <div className="text-center py-4">
              <Activity className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading Iris status...</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-sm font-medium mb-2">Connection Health</div>
                <Progress value={irisStatus?.connectionHealth || 0} className="mb-2" />
                <div className={`text-xs ${getHealthColor(irisStatus?.connectionHealth || 0)}`}>
                  {(irisStatus?.connectionHealth || 0)}% - {getHealthStatus(irisStatus?.connectionHealth || 0)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Processing Rate</div>
                <div className="text-2xl font-bold">{irisStatus?.processingRate || 0}/min</div>
                <div className="text-xs text-muted-foreground">Documents per minute</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Queue Size</div>
                <div className="text-2xl font-bold">{irisStatus?.documentsInQueue || 0}</div>
                <div className="text-xs text-muted-foreground">Documents waiting</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Error Rate</div>
                <div className={`text-2xl font-bold ${
                  (irisStatus?.errorRate || 0) < 5 ? 'text-green-600' : 
                  (irisStatus?.errorRate || 0) < 15 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {(irisStatus?.errorRate || 0).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Failed documents</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Document Activity</CardTitle>
          <CardDescription>
            Latest documents processed through the sync pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentsLoading && recentDocuments.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading document activity...</p>
            </div>
          ) : recentDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent document activity</p>
              <p className="text-sm text-muted-foreground">
                Documents will appear here once Morpheus starts uploading
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDocuments.map((doc: RecentDocument) => (
                <div key={doc.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(doc.status)}
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{doc.filename}</div>
                    <div className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size} • from {doc.source}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {doc.timestamp}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {doc.confidence && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Confidence</div>
                        <div className={`text-sm font-medium ${
                          doc.confidence >= 90 ? 'text-green-600' : 
                          doc.confidence >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {doc.confidence}%
                        </div>
                      </div>
                    )}
                    <Badge variant={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pipeline Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Processing Pipeline</CardTitle>
            <CardDescription>Document flow through processing stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Upload & Validation</span>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Content Extraction</span>
                </div>
                <Badge variant="default">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Classification</span>
                </div>
                <Badge variant="default">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Data Integration</span>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Document sync management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Restart Sync Pipeline
            </Button>
            <Button variant="outline" className="w-full">
              <Activity className="w-4 h-4 mr-2" />
              Test Morpheus Connection
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              View Processing Logs
            </Button>
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Manual Document Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DocumentSync;
