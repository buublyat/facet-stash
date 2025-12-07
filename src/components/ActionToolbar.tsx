import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Tags, 
  Trash2
} from 'lucide-react';

interface ActionToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddEntry: () => void;
  onManageTags: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export function ActionToolbar({
  searchQuery,
  onSearchChange,
  onAddEntry,
  onManageTags,
  selectedCount,
  onDeleteSelected,
}: ActionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 terminal-border bg-card">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
          ~/search$
        </span>
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="grep -i 'pattern'"
          className="pl-24 font-mono bg-background border-border focus:border-primary focus:ring-primary"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-blink">▋</span>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onAddEntry} className="gap-2 font-mono text-xs uppercase tracking-wider glitch-hover">
          <Plus className="h-4 w-4" />
          [NEW]
        </Button>

        <Button variant="outline" onClick={onManageTags} className="gap-2 font-mono text-xs uppercase tracking-wider glitch-hover">
          <Tags className="h-4 w-4" />
          [TAGS]
        </Button>

        {selectedCount > 0 && (
          <Button 
            variant="destructive" 
            onClick={onDeleteSelected}
            className="gap-2 font-mono text-xs uppercase tracking-wider glitch-hover"
          >
            <Trash2 className="h-4 w-4" />
            rm -rf ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
}
