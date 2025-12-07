import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Tags, 
  Download, 
  Upload, 
  Trash2,
  FileJson,
  FileSpreadsheet,
  Terminal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddEntry: () => void;
  onManageTags: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImport: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export function ActionToolbar({
  searchQuery,
  onSearchChange,
  onAddEntry,
  onManageTags,
  onExportJSON,
  onExportCSV,
  onImport,
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 font-mono text-xs uppercase tracking-wider glitch-hover">
              <Download className="h-4 w-4" />
              [EXPORT]
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border font-mono">
            <DropdownMenuItem onClick={onExportJSON} className="text-xs">
              <FileJson className="h-4 w-4 mr-2" />
              export --format=json
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportCSV} className="text-xs">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              export --format=csv
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" onClick={onImport} className="gap-2 font-mono text-xs uppercase tracking-wider glitch-hover">
          <Upload className="h-4 w-4" />
          [IMPORT]
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
