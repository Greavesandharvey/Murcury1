/**
 * Document Bridge UI Component (Patch 006)
 * 
 * Interface for monitoring document processing and passport lifecycle
 * Provides document linking interface with status monitoring and confidence scoring
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Activity,
  TrendingUp,
  Users
} from 'lucide-react';

interface DocumentPassport {
  passport_id: string;
  document_id: string;
  document_type: string;
  current_phase: string;
  status: string;
  supplier_id?: number;
  supplier_name?: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

interface DocumentBridgeStats {
  passports: {
    total_passports: number;
    completed: number;
    in_progress: number;
    failed: number;
    average_confidence: number;
  };
  queue: Array<{
    status: string;
    count: number;
  }>;
  last_updated: string;
}

export const DocumentBridge: React.FC = () => {
  const [passports, setPassports] = useState<DocumentPassport[]>([]);
  const [stats, setStats] = useState<DocumentBridgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load passports
      const passportsResponse = await fetch('/api/document-bridge/passports?limit=20');
      if (!passportsResponse.ok) throw new Error('Failed to load passports');
      const passportsData = await passportsResponse.json();
      setPassports(passportsData.data || []);

      // Load stats
      const statsResponse = await fetch('/api/document-bridge/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'processing': return 'bg-blue-500';
      case 'identification': return 'bg-yellow-500';
      case 'extraction': return 'bg-purple-500';
      case 'integration': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'exception': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const runBridgeTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/document-bridge/test', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to run tests');
      
      const results = await response.json();
      alert(`Tests completed: ${results.passed_tests}/${results.total_tests} passed`);
      
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run tests');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading document bridge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Bridge</h1>
          <p className="text-gray-600">Morpheus → MercuryOne document processing pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline" size="sm">
            Refresh
          </Button>
          <Button onClick={runBridgeTests} variant="outline" size="sm">
            Run Tests
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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Passports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passports.total_passports}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.passports.total_passports > 0 
                  ? Math.round((stats.passports.completed / stats.passports.total_passports) * 100)
                  : 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getConfidenceColor(stats.passports.average_confidence || 0)}`}>
                {Math.round((stats.passports.average_confidence || 0) * 100)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.passports.in_progress}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Document Passports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Document Passports</CardTitle>
          <CardDescription>
            Recent document processing pipeline activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No document passports found
            </div>
          ) : (
            <div className="space-y-3">
              {passports.map((passport) => (
                <div
                  key={passport.passport_id}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedPassport === passport.passport_id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPassport(
                    selectedPassport === passport.passport_id ? null : passport.passport_id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(passport.status)}
                      <div>
                        <div className="font-medium text-gray-900">
                          {passport.passport_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {passport.document_type} • {passport.supplier_name || 'Unknown Supplier'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={`${getPhaseColor(passport.current_phase)} text-white`}
                      >
                        {passport.current_phase}
                      </Badge>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getConfidenceColor(passport.confidence_score)}`}>
                          {Math.round(passport.confidence_score * 100)}% confidence
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(passport.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar for confidence */}
                  <div className="mt-3">
                    <Progress 
                      value={passport.confidence_score * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Expanded details */}
                  {selectedPassport === passport.passport_id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Document ID:</span><br />
                          <span className="text-gray-600">{passport.document_id}</span>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span><br />
                          <span className="text-gray-600">{passport.status}</span>
                        </div>
                        <div>
                          <span className="font-medium">Created:</span><br />
                          <span className="text-gray-600">
                            {new Date(passport.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span><br />
                          <span className="text-gray-600">
                            {new Date(passport.updated_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Performance */}
      {stats && stats.queue && stats.queue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Queue Status</CardTitle>
            <CardDescription>
              Current agent processing queue status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.queue.map((item) => (
                <div key={item.status} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {item.count}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {item.status.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentBridge;
