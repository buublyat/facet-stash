import { cn } from '@/lib/utils';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

type Priority = 'low' | 'medium' | 'high';

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { label: string; icon: React.ElementType; className: string }> = {
  low: {
    label: 'Low',
    icon: ArrowDown,
    className: 'text-muted-foreground',
  },
  medium: {
    label: 'Medium',
    icon: ArrowRight,
    className: 'text-warning',
  },
  high: {
    label: 'High',
    icon: ArrowUp,
    className: 'text-destructive',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;
  
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-medium', config.className)}>
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
}
