import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Status = 'active' | 'pending' | 'completed' | 'archived' | 'error';

interface StatusFilterProps {
  selectedStatuses: Status[];
  onStatusToggle: (status: Status) => void;
  onClearFilter: () => void;
}

const statuses: { value: Status; label: string; colorClass: string }[] = [
  { value: 'active', label: 'Active', colorClass: 'border-green-500 text-green-500 hover:bg-green-500/20' },
  { value: 'pending', label: 'Pending', colorClass: 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/20' },
  { value: 'completed', label: 'Completed', colorClass: 'border-cyan-500 text-cyan-500 hover:bg-cyan-500/20' },
  { value: 'archived', label: 'Archived', colorClass: 'border-gray-500 text-gray-500 hover:bg-gray-500/20' },
  { value: 'error', label: 'Error', colorClass: 'border-red-500 text-red-500 hover:bg-red-500/20' },
];

export function StatusFilter({ selectedStatuses, onStatusToggle, onClearFilter }: StatusFilterProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap font-mono">
      <span className="text-xs text-muted-foreground">
        <span className="text-accent">$</span> filter --status=
      </span>
      <div className="flex flex-wrap gap-1.5">
        {statuses.map(status => (
          <button
            key={status.value}
            onClick={() => onStatusToggle(status.value)}
            className={cn(
              'px-2 py-0.5 text-xs font-mono border rounded transition-all duration-200',
              'glitch-hover',
              status.colorClass,
              selectedStatuses.includes(status.value) 
                ? 'bg-current/20 shadow-[0_0_8px_currentColor]' 
                : 'bg-transparent'
            )}
          >
            [ {status.label} ]
          </button>
        ))}
      </div>
      {selectedStatuses.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilter}
          className="h-6 px-2 text-xs text-muted-foreground font-mono glitch-hover"
        >
          <X className="h-3 w-3 mr-1" />
          --clear
        </Button>
      )}
    </div>
  );
}
