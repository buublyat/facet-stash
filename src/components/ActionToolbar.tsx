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
  FileSpreadsheet
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
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search entries..."
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onAddEntry} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>

        <Button variant="outline" onClick={onManageTags} className="gap-2">
          <Tags className="h-4 w-4" />
          Tags
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportJSON}>
              <FileJson className="h-4 w-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" onClick={onImport} className="gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>

        {selectedCount > 0 && (
          <Button 
            variant="destructive" 
            onClick={onDeleteSelected}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
}
