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
  { value: 'active', label: 'Active', colorClass: 'border-green-400 text-green-400 hover:bg-green-400/20' },
  { value: 'pending', label: 'Pending', colorClass: 'border-yellow-400 text-yellow-400 hover:bg-yellow-400/20' },
  { value: 'completed', label: 'Completed', colorClass: 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/20' },
  { value: 'archived', label: 'Archived', colorClass: 'border-gray-400 text-gray-400 hover:bg-gray-400/20' },
  { value: 'error', label: 'Error', colorClass: 'border-red-400 text-red-400 hover:bg-red-400/20' },
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
