import { useState } from 'react';
import { DataEntry, Tag, SortConfig, SortDirection } from '@/types/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { TagBadge } from './TagBadge';
import { StatusBadge } from './StatusBadge';

import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DataTableProps {
  entries: DataEntry[];
  tags: Tag[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (entry: DataEntry) => void;
  onDelete: (ids: string[]) => void;
  onViewDetails: (entry: DataEntry) => void;
}

type SortableKey = 'country' | 'machineId' | 'category' | 'priority' | 'status' | 'createdAt' | 'updatedAt';

export function DataTable({
  entries,
  tags,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  onViewDetails,
}: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (key: SortableKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const tagMap = new Map(tags.map(t => [t.id, t]));

  const allSelected = entries.length > 0 && selectedIds.length === entries.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < entries.length;

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(entries.map(e => e.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortableKey }) => {
    if (sortConfig?.key !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1 text-primary" />
      : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
  };

  return (
    <div className="terminal-border bg-card overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/50">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-destructive/80" />
          <span className="w-3 h-3 rounded-full bg-warning/80" />
          <span className="w-3 h-3 rounded-full bg-success/80" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">
          ~/data-manager $ ls -la --entries={entries.length}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-12 text-muted-foreground font-mono text-xs">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
                aria-label="Select all"
                className={cn(someSelected && 'opacity-50')}
              />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors font-mono text-xs uppercase tracking-wider w-20"
              onClick={() => handleSort('country')}
            >
              <span className="flex items-center">
                COUNTRY
                <SortIcon columnKey="country" />
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors font-mono text-xs uppercase tracking-wider"
              onClick={() => handleSort('machineId')}
            >
              <span className="flex items-center">
                MACHINE_ID
                <SortIcon columnKey="machineId" />
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors font-mono text-xs uppercase tracking-wider"
              onClick={() => handleSort('status')}
            >
              <span className="flex items-center">
                STATUS
                <SortIcon columnKey="status" />
              </span>
            </TableHead>
            <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">TAGS</TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors font-mono text-xs uppercase tracking-wider"
              onClick={() => handleSort('updatedAt')}
            >
              <span className="flex items-center">
                MODIFIED
                <SortIcon columnKey="updatedAt" />
              </span>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry, index) => (
              <TableRow 
                key={entry.id}
                className={cn(
                  'group transition-colors border-border',
                  selectedIds.includes(entry.id) && 'bg-primary/5'
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(entry.id)}
                    onCheckedChange={() => toggleOne(entry.id)}
                    aria-label={`Select ${entry.machineId}`}
                  />
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm text-info font-bold tracking-wider">
                    {entry.country || '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <div 
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onViewDetails(entry)}
                  >
                    <p className="font-mono text-sm text-foreground hover:text-primary">
                      <span className="text-muted-foreground">{String(index).padStart(2, '0')}.</span>{' '}
                      <span className="underline underline-offset-2 decoration-primary/50 hover:decoration-primary">
                        {entry.machineId}
                      </span>
                    </p>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs font-mono mt-0.5 pl-6">
                        # {entry.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={entry.status} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.slice(0, 3).map(tagId => {
                      const tag = tagMap.get(tagId);
                      return tag ? (
                        <TagBadge key={tagId} tag={tag} size="sm" />
                      ) : null;
                    })}
                    {entry.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground px-1 font-mono">
                        +{entry.tags.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {format(new Date(entry.updatedAt), 'yyyy-MM-dd')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-background border-border font-mono text-xs z-50 shadow-lg shadow-primary/10">
                      <DropdownMenuItem onClick={() => onEdit(entry)}>
                        <Pencil className="h-3 w-3 mr-2" />
                        vim {index + 1}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem 
                        onClick={() => onDelete([entry.id])}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        rm -rf
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="font-mono text-muted-foreground">
                  <p className="text-sm">$ ls -la</p>
                  <p className="text-xs mt-1">drwxr-xr-x 0 entries found</p>
                  <p className="text-xs text-primary mt-2">{">"} No data. Run [NEW] to create entry.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
