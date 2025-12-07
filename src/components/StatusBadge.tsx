import { cn } from '@/lib/utils';

type Status = 'active' | 'pending' | 'completed' | 'archived';

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-primary/15 text-primary border-primary/30',
  },
  pending: {
    label: 'Pending',
    className: 'bg-warning/15 text-warning border-warning/30',
  },
  completed: {
    label: 'Completed',
    className: 'bg-success/15 text-success border-success/30',
  },
  archived: {
    label: 'Archived',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
