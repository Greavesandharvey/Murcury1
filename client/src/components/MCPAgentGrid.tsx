import AgentCard from './AgentCard';
import {
  Crown,
  FileText,
  AlertTriangle,
  Eye,
  Flame,
  Dumbbell,
  Sword,
  Waves,
  Brain,
  Sun,
} from 'lucide-react';

const agentData = [
  {
    name: 'Janus',
    role: 'Lifecycle Commander',
    specialty: 'Passport Validation & Audit Trail',
    tasks: 34,
    efficiency: 94.1,
    status: 'active' as const,
    variant: 'janus' as const,
    icon: <Crown className="w-4 h-4 text-purple-300" />,
  },
  {
    name: 'Juno',
    role: 'Document Intelligence',
    specialty: 'Schema Validation & Invoice Routing',
    tasks: 28,
    efficiency: 96.4,
    status: 'active' as const,
    variant: 'juno' as const,
    icon: <FileText className="w-4 h-4 text-blue-300" />,
  },
  {
    name: 'Saturn',
    role: 'Classification Agent',
    specialty: 'Stock Email Assets & Organization',
    tasks: 15,
    efficiency: 99.2,
    status: 'active' as const,
    variant: 'saturn' as const,
    icon: <AlertTriangle className="w-4 h-4 text-amber-300" />,
  },
  {
    name: 'Athena',
    role: 'BI Data Collection',
    specialty: 'GDPR & Visual Compliance',
    tasks: 19,
    efficiency: 97.8,
    status: 'active' as const,
    variant: 'athena' as const,
    icon: <Eye className="w-4 h-4 text-teal-300" />,
  },
  {
    name: 'Vulcan',
    role: 'Auto Repair Orchestrator',
    specialty: 'Lifecycle Validation Remediation',
    tasks: 12,
    efficiency: 91.5,
    status: 'active' as const,
    variant: 'vulcan' as const,
    icon: <Flame className="w-4 h-4 text-orange-300" />,
  },
  {
    name: 'Hercules',
    role: 'Performance Orchestrator',
    specialty: 'Roadmap Regression Testing',
    tasks: 8,
    efficiency: 88.7,
    status: 'standby' as const,
    variant: 'hercules' as const,
    icon: <Dumbbell className="w-4 h-4 text-green-300" />,
  },
  {
    name: 'Mars',
    role: 'Crisis Management',
    specialty: 'ORP Process & Security Audit',
    tasks: 3,
    efficiency: 92.1,
    status: 'standby' as const,
    variant: 'mars' as const,
    icon: <Sword className="w-4 h-4 text-red-300" />,
  },
  {
    name: 'Neptune',
    role: 'Deep Data Analysis',
    specialty: 'IoT Compliance & Ledger Sync',
    tasks: 6,
    efficiency: 94.8,
    status: 'active' as const,
    variant: 'neptune' as const,
    icon: <Waves className="w-4 h-4 text-blue-300" />,
  },
  {
    name: 'Minerva',
    role: 'AI Logic Decisions',
    specialty: 'Rapid Validation & Reasoning',
    tasks: 11,
    efficiency: 96.3,
    status: 'active' as const,
    variant: 'minerva' as const,
    icon: <Brain className="w-4 h-4 text-teal-300" />,
  },
  {
    name: 'Apollo',
    role: 'Insight & Intelligence',
    specialty: 'IoT Testing & Wholesale Validation',
    tasks: 7,
    efficiency: 93.4,
    status: 'standby' as const,
    variant: 'apollo' as const,
    icon: <Sun className="w-4 h-4 text-amber-300" />,
  },
];

export default function MCPAgentGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-purple-300">MercuryOne Agents</h2>
          <p className="text-sm text-gray-400">10 Business Management Agents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {agentData.map((agent) => (
          <AgentCard key={agent.name} {...agent} />
        ))}
      </div>
    </div>
  );
}
