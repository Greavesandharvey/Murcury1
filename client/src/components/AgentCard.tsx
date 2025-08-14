import { Monitor, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'classnames';

interface AgentCardProps {
  name: string;
  role: string;
  specialty: string;
  tasks: number;
  efficiency: number;
  status: 'active' | 'standby' | 'offline';
  variant:
    | 'janus'
    | 'juno'
    | 'saturn'
    | 'athena'
    | 'vulcan'
    | 'hercules'
    | 'mars'
    | 'neptune'
    | 'minerva'
    | 'apollo';
  icon?: React.ReactNode;
}

export default function AgentCard({
  name,
  role,
  specialty,
  tasks,
  efficiency,
  status,
  variant,
  icon,
}: AgentCardProps) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'active':
        return 'text-emerald-400';
      case 'standby':
        return 'text-yellow-400';
      case 'offline':
        return 'text-red-400';
      default:
        return '';
    }
  };

  const efficiencyColor = () => {
    if (efficiency >= 95) return 'text-emerald-400';
    if (efficiency >= 90) return 'text-blue-400';
    if (efficiency >= 80) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className={clsx('agent-card p-4 space-y-3', variant)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
            {icon || <Activity className="w-4 h-4 text-white" />}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{name}</h3>
            <p className="text-xs text-gray-400">{role}</p>
          </div>
        </div>
        <span className={clsx('text-xs capitalize', getStatusColor(status))}>{status}</span>
      </div>

      <div className="text-xs text-gray-300">
        Specialty: <span className="text-white">{specialty}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-lg font-bold text-white">{tasks}</div>
          <div className="text-xs text-gray-400">Tasks</div>
        </div>
        <div>
          <div className={clsx('text-lg font-bold', efficiencyColor())}>{efficiency}%</div>
          <div className="text-xs text-gray-400">Efficiency</div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="monitor-button text-xs">
          <Monitor className="w-3 h-3 mr-1" /> Monitor
        </Button>
      </div>
    </div>
  );
}
