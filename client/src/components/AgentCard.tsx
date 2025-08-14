import { Monitor, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    | 'apollo'
    | 'iris'
    | 'argus'
    | 'daedalus';
  icon?: React.ReactNode;
  bgColor?: string;
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
  bgColor = 'bg-slate-500/20',
}: AgentCardProps) {
  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">ACTIVE</Badge>;
      case 'standby':
        return <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">STANDBY</Badge>;
      case 'offline':
        return <Badge className="bg-red-500/20 text-red-400 text-xs">OFFLINE</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 text-xs">UNKNOWN</Badge>;
    }
  };

  const efficiencyColor = () => {
    if (efficiency >= 95) return 'text-emerald-400';
    if (efficiency >= 90) return 'text-blue-400';
    if (efficiency >= 80) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          {icon || <Activity className="w-5 h-5 text-white" />}
        </div>
        {getStatusBadge(status)}
      </div>
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-white">{name}</h4>
        <p className="text-xs text-slate-400">{role.split(' & ')[0]}</p>
        {role.split(' & ')[1] && <p className="text-xs text-slate-400">{role.split(' & ')[1]}</p>}
      </div>
      <div className="mb-3">
        <p className="text-xs text-slate-500">Specialty: {specialty.split(' & ')[0]}</p>
        {specialty.split(' & ')[1] && <p className="text-xs text-slate-500">{specialty.split(' & ')[1]}</p>}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-white">{tasks}</div>
          <div className="text-xs text-slate-400">Tasks</div>
        </div>
        <div>
          <div className={clsx('text-lg font-bold', efficiencyColor())}>{efficiency}%</div>
          <div className="text-xs text-slate-400">Efficiency</div>
        </div>
      </div>
      <Button size="sm" className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-xs">
        <Monitor className="w-3 h-3 mr-1" /> Monitor
      </Button>
    </div>
  );
}
