import MCPAgentGrid from '@/components/MCPAgentGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShoppingCart, Package, Users, PoundSterling } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6 p-6" style={{ background: 'linear-gradient(145deg, hsl(240, 30%, 7%), hsl(240, 25%, 10%))' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Jupiter Master Controller Panel</h1>
        <p className="text-slate-400">System Operational</p>
      </div>

      {/* Quick Metrics (placeholder) */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="glass-card border-slate-700/50 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">14</div>
          <div className="text-sm text-slate-400">Active Agents</div>
          <div className="text-xs text-emerald-400 mt-1">100% Online</div>
        </div>
        <div className="glass-card border-slate-700/50 p-4 text-center">
          <div className="text-2xl font-bold text-amber-400 mb-1">0</div>
          <div className="text-sm text-slate-400">Documents Processed</div>
          <div className="text-xs text-amber-400 mt-1">Today</div>
        </div>
        <div className="glass-card border-slate-700/50 p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">0%</div>
          <div className="text-sm text-slate-400">Automation Rate</div>
          <div className="text-xs text-purple-400 mt-1">Target: 85%</div>
        </div>
        <div className="glass-card border-slate-700/50 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-400 mb-1">0</div>
          <div className="text-sm text-slate-400">Purchase Messages</div>
          <div className="text-xs text-indigo-400 mt-1">This Hour</div>
        </div>
      </div>

      {/* MCP Agent Grid */}
      <MCPAgentGrid />
    </div>
  );
}
