import { cn } from '@/lib/utils';

type Status = 'active' | 'pending' | 'completed' | 'archived' | 'error';

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; prefix: string; className: string }> = {
  active: {
    label: 'ACTIVE',
    prefix: '●',
    className: 'text-primary border-primary/40 bg-primary/10',
  },
  pending: {
    label: 'PENDING',
    prefix: '◐',
    className: 'text-warning border-warning/40 bg-warning/10',
  },
  completed: {
    label: 'DONE',
    prefix: '✓',
    className: 'text-success border-success/40 bg-success/10',
  },
  archived: {
    label: 'ARCHIVED',
    prefix: '▣',
    className: 'text-muted-foreground border-muted bg-muted/50',
  },
  error: {
    label: 'ERROR',
    prefix: '✕',
    className: 'text-destructive border-destructive/40 bg-destructive/10',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-mono uppercase tracking-wider',
        config.className
      )}
    >
      <span className="animate-pulse">{config.prefix}</span>
      {config.label}
    </span>
  );
}
