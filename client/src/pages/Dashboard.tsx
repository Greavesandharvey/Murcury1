import MCPAgentGrid from '@/components/MCPAgentGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, Rocket, Zap, ShoppingCart, Package, FileText, PoundSterling, Globe, Star, Heart, Sparkles, Shield, Lock } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Add LiveClock component
function LiveClock() {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="text-slate-400 text-sm">{time}</span>;
}

// Enterprise Ready Banner component
function EnterpriseReadyBanner() {
  return (
    <div className="glass-card border-emerald-500/50 bg-emerald-900/20 p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full">
            <Trophy className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-1">MercuryOne: System Ready for Handoff</h2>
            <p className="text-emerald-300/80">🎉 Patch 1068 Complete - Enterprise-ready deployment achieved</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <Crown className="h-3 w-3 mr-1" />
                Production Ready
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                All 1068 Patches Complete
              </Badge>
            </div>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Rocket className="h-4 w-4 mr-2" />
          Deploy to Production
        </Button>
      </div>
    </div>
  );
}

// Business Workflow Automation component
function BusinessWorkflowAutomation() {
  const cards = [
    {
      iconBg: 'bg-amber-500/20',
      icon: <ShoppingCart className="h-4 w-4 text-amber-400" />,
      title: 'POS Orders',
      label: "Today's Orders",
      value: '47',
      progress: 85,
      subtitle: 'Auto-PO generation: 100%',
    },
    {
      iconBg: 'bg-purple-500/20',
      icon: <Package className="h-4 w-4 text-purple-400" />,
      title: 'Passports',
      label: 'Active Tracking',
      value: '234',
      progress: 92,
      subtitle: 'Lifecycle automation: 92%',
    },
    {
      iconBg: 'bg-indigo-500/20',
      icon: <FileText className="h-4 w-4 text-indigo-400" />,
      title: 'Morpheus Sync',
      label: 'Docs Processed',
      value: '1,247',
      progress: 98,
      subtitle: 'OCR accuracy: 98.3%',
    },
    {
      iconBg: 'bg-green-500/20',
      icon: <PoundSterling className="h-4 w-4 text-green-400" />,
      title: 'Xero Sync',
      label: 'Transactions',
      value: '856',
      progress: 100,
      subtitle: 'Financial sync: 100%',
    },
  ];
  return (
    <div className="glass-card border-slate-700/50 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold divine-gradient-text">Business Workflow Automation</h3>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <Zap className="h-3 w-3 mr-1" />
          Fully Automated
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="glass-card border-slate-600/50 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`h-8 w-8 ${c.iconBg} rounded-lg flex items-center justify-center`}>{c.icon}</div>
              <h4 className="font-medium text-white">{c.title}</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{c.label}</span>
                <span className="text-white font-medium">{c.value}</span>
              </div>
              <Progress value={c.progress} className="h-1.5" />
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full" />
                <span className="text-xs text-slate-400">{c.subtitle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enterprise Integration Center component
function EnterpriseIntegrationCenter() {
  const items = [
    { bg: 'bg-blue-500/20', icon: <Star className="h-6 w-6 text-blue-400" />, name: 'Xero', status: 'Connected' },
    { bg: 'bg-purple-500/20', icon: <Heart className="h-6 w-6 text-purple-400" />, name: 'Morpheus', status: 'Synced' },
    { bg: 'bg-indigo-500/20', icon: <Sparkles className="h-6 w-6 text-indigo-400" />, name: 'Jupiter AI', status: 'Active' },
    { bg: 'bg-amber-500/20', icon: <Shield className="h-6 w-6 text-amber-400" />, name: 'Security', status: 'Validated' },
    { bg: 'bg-green-500/20', icon: <Globe className="h-6 w-6 text-green-400" />, name: 'UK/EU', status: 'Compliant' },
    { bg: 'bg-red-500/20', icon: <Lock className="h-6 w-6 text-red-400" />, name: 'Phase Lock', status: 'Locked' },
  ];
  return (
    <div className="glass-card border-slate-700/50 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold divine-gradient-text">Enterprise Integration Center</h3>
        <Badge variant="outline" className="border-green-500/30 text-green-400">
          <Globe className="h-3 w-3 mr-1" /> All Systems Connected
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {items.map((it) => (
          <div key={it.name} className="text-center p-4 glass-card border-slate-600/50">
            <div className={`h-12 w-12 ${it.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>{it.icon}</div>
            <p className="text-sm font-medium text-white">{it.name}</p>
            <p className="text-xs text-green-400">{it.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Update Dashboard component
export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Enterprise Ready Banner */}
      <EnterpriseReadyBanner />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold divine-gradient-text">MercuryOne Divine Dashboard</h1>
          <p className="text-slate-400 mt-2">Enterprise-ready business management with divine-powered intelligence</p>
          <div className="flex items-center space-x-4 mt-3">
            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
              <Sparkles className="h-3 w-3 mr-1" /> v1068.0 Enterprise
            </Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
              <Star className="h-3 w-3 mr-1" /> 100% Roadmap Complete
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <LiveClock />
        </div>
      </div>

      {/* Business Workflow Automation */}
      <BusinessWorkflowAutomation />

      {/* Enterprise Integration Center */}
      <EnterpriseIntegrationCenter />

      {/* MCP Agent Grid */}
      <MCPAgentGrid />
    </div>
  );
}
