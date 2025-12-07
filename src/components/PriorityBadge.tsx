import { cn } from '@/lib/utils';

type Priority = 'low' | 'medium' | 'high';

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { label: string; bars: string; className: string }> = {
  low: {
    label: 'LOW',
    bars: '▂░░',
    className: 'text-muted-foreground',
  },
  medium: {
    label: 'MED',
    bars: '▂▄░',
    className: 'text-warning',
  },
  high: {
    label: 'HIGH',
    bars: '▂▄▆',
    className: 'text-destructive',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-mono text-xs', config.className)}>
      <span className="tracking-tighter">{config.bars}</span>
      <span className="uppercase text-[10px] tracking-wider">{config.label}</span>
    </span>
  );
}
