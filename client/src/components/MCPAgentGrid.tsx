import AgentCard from './AgentCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Crown,
  FileCheck,
  Bell,
  Eye,
  Wrench,
  TestTube,
  Shield,
  Waves,
  Brain,
  Sun,
  Zap,
  Activity,
  BarChart3,
  ScanEye,
} from 'lucide-react';

// MercuryOne Agents
const mercuryAgentData = [
  {
    name: 'Janus',
    role: 'Lifecycle Compliance',
    specialty: 'Passport Validation & Audit Trail',
    tasks: 34,
    efficiency: 94.1,
    status: 'active' as const,
    variant: 'janus' as const,
    icon: <Shield className="w-5 h-5 text-blue-400" />,
    bgColor: 'bg-blue-500/20',
  },
  {
    name: 'Juno',
    role: 'Document Schema Validation',
    specialty: 'Schema Validation & Invoice Routing',
    tasks: 28,
    efficiency: 96.4,
    status: 'active' as const,
    variant: 'juno' as const,
    icon: <FileCheck className="w-5 h-5 text-indigo-400" />,
    bgColor: 'bg-indigo-500/20',
  },
  {
    name: 'Saturn',
    role: 'Delay & Notification Agent',
    specialty: 'Slack Email Alerts & Organization',
    tasks: 15,
    efficiency: 99.2,
    status: 'active' as const,
    variant: 'saturn' as const,
    icon: <Bell className="w-5 h-5 text-yellow-400" />,
    bgColor: 'bg-yellow-500/20',
  },
  {
    name: 'Athena',
    role: 'UI Drift Detection',
    specialty: 'GDPR & Visual Compliance',
    tasks: 19,
    efficiency: 97.8,
    status: 'active' as const,
    variant: 'athena' as const,
    icon: <Eye className="w-5 h-5 text-teal-400" />,
    bgColor: 'bg-teal-500/20',
  },
  {
    name: 'Vulcan',
    role: 'Auto-Repair Suggestions',
    specialty: 'Lifecycle Violation Remediation',
    tasks: 12,
    efficiency: 91.5,
    status: 'active' as const,
    variant: 'vulcan' as const,
    icon: <Wrench className="w-5 h-5 text-orange-400" />,
    bgColor: 'bg-orange-500/20',
  },
  {
    name: 'Hercules',
    role: 'Performance Orchestrator',
    specialty: 'Roadmap Regression Testing',
    tasks: 8,
    efficiency: 88.7,
    status: 'standby' as const,
    variant: 'hercules' as const,
    icon: <TestTube className="w-5 h-5 text-purple-400" />,
    bgColor: 'bg-purple-500/20',
  },
  {
    name: 'Mars',
    role: 'Security Enforcement',
    specialty: 'ORP Process & Security Audit',
    tasks: 3,
    efficiency: 92.1,
    status: 'standby' as const,
    variant: 'mars' as const,
    icon: <Shield className="w-5 h-5 text-red-400" />,
    bgColor: 'bg-red-500/20',
  },
  {
    name: 'Neptune',
    role: 'Xero Financial Sync',
    specialty: 'VAT Compliance & Ledger Sync',
    tasks: 6,
    efficiency: 94.8,
    status: 'active' as const,
    variant: 'neptune' as const,
    icon: <Waves className="w-5 h-5 text-cyan-400" />,
    bgColor: 'bg-cyan-500/20',
  },
  {
    name: 'Minerva',
    role: 'Frontend Crash Detection',
    specialty: 'Rapid Validation & Reasoning',
    tasks: 11,
    efficiency: 96.3,
    status: 'active' as const,
    variant: 'minerva' as const,
    icon: <Brain className="w-5 h-5 text-emerald-400" />,
    bgColor: 'bg-emerald-500/20',
  },
  {
    name: 'Apollo',
    role: 'CI Diagnostics',
    specialty: 'API Testing & Webhook Validation',
    tasks: 7,
    efficiency: 93.4,
    status: 'standby' as const,
    variant: 'apollo' as const,
    icon: <Sun className="w-5 h-5 text-yellow-400" />,
    bgColor: 'bg-yellow-500/20',
  },
];

// Morpheus Agents
const morpheusAgentData = [
  {
    name: 'Iris',
    role: 'Document Intake Coordinator',
    specialty: 'Mobile/Email Scan Normalization',
    tasks: 42,
    efficiency: 97.6,
    status: 'active' as const,
    variant: 'iris' as const,
    icon: <Eye className="w-5 h-5 text-violet-400" />,
    bgColor: 'bg-violet-500/20',
  },
  {
    name: 'Argus',
    role: 'OCR Processing Engine',
    specialty: 'OCR & Schema Enrichment',
    tasks: 67,
    efficiency: 94.3,
    status: 'active' as const,
    variant: 'argus' as const,
    icon: <ScanEye className="w-5 h-5 text-amber-400" />,
    bgColor: 'bg-amber-500/20',
  },
  {
    name: 'Daedalus',
    role: 'Schema Memory & Learning',
    specialty: 'Supplier Pattern Learning',
    tasks: 23,
    efficiency: 98.1,
    status: 'active' as const,
    variant: 'daedalus' as const,
    icon: <Brain className="w-5 h-5 text-indigo-400" />,
    bgColor: 'bg-indigo-500/20',
  },
];

export default function MCPAgentGrid() {
  return (
    <div className="glass-card border-slate-700/50 bg-slate-900/90 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">MCP Agent Control Center</h2>
          <p className="text-slate-400">13 specialized agents organized by platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            All Systems Operational
          </Badge>
          <Button size="sm" className="bg-slate-700 hover:bg-slate-600">
            <Activity className="w-4 h-4 mr-2" />
            Agent Settings  
          </Button>
        </div>
      </div>

      {/* Jupiter Supreme Commander Bar */}
      <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-400">Jupiter</h3>
              <p className="text-slate-300 text-sm">Master Controller & Orchestrator</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">247</div>
              <div className="text-xs text-slate-400">Active Commands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">13/13</div>
              <div className="text-xs text-slate-400">Agents Online</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-purple-400">Agent Orchestration &</div>
              <div className="text-sm font-semibold text-purple-400">System Logs</div>
              <div className="text-xs text-slate-400">Core Function</div>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Supreme Command Active
            </Badge>
          </div>
        </div>
        <div className="mt-3 text-right">
          <span className="text-sm text-slate-400">99.8% efficiency</span>
          <span className="ml-4 text-xs text-slate-500">Monitor</span>
        </div>
      </div>

      {/* MercuryOne Agents Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">MercuryOne Agents</h3>
          <span className="text-sm text-slate-400">10 Business Management Agents</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {mercuryAgentData.map((agent) => (
            <AgentCard key={agent.name} {...agent} />
          ))}
        </div>
      </div>

      {/* Morpheus Agents Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Morpheus Agents</h3>
          <span className="text-sm text-slate-400">3 Mobile Document Processing Agents</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {morpheusAgentData.map((agent) => (
            <AgentCard key={agent.name} {...agent} />
          ))}
        </div>
      </div>

      {/* System Status Footer */}
      <div className="border-t border-slate-700/50 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-slate-400">Last Updated: Just now</span>
            <span className="text-emerald-400">✓ All Systems Operational</span>
            <span className="text-slate-400">Response Time: <span className="text-emerald-400">12ms</span></span>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
              <Activity className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
