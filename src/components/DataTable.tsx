import { useState } from 'react';
import { DataEntry, Tag, SortConfig, SortDirection } from '@/types/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { TagBadge } from './TagBadge';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal, 
  Pencil, 
  Copy, 
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
  onDuplicate: (entry: DataEntry) => void;
  onDelete: (ids: string[]) => void;
}

type SortableKey = 'title' | 'category' | 'priority' | 'status' | 'createdAt' | 'updatedAt';

export function DataTable({
  entries,
  tags,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDuplicate,
  onDelete,
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
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
                aria-label="Select all"
                className={cn(someSelected && 'opacity-50')}
              />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort('title')}
            >
              <span className="flex items-center">
                Title
                <SortIcon columnKey="title" />
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort('category')}
            >
              <span className="flex items-center">
                Category
                <SortIcon columnKey="category" />
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort('priority')}
            >
              <span className="flex items-center">
                Priority
                <SortIcon columnKey="priority" />
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort('status')}
            >
              <span className="flex items-center">
                Status
                <SortIcon columnKey="status" />
              </span>
            </TableHead>
            <TableHead>Tags</TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleSort('updatedAt')}
            >
              <span className="flex items-center">
                Updated
                <SortIcon columnKey="updatedAt" />
              </span>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.length > 0 ? (
            sortedEntries.map((entry) => (
              <TableRow 
                key={entry.id}
                className={cn(
                  'group transition-colors',
                  selectedIds.includes(entry.id) && 'bg-primary/5'
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(entry.id)}
                    onCheckedChange={() => toggleOne(entry.id)}
                    aria-label={`Select ${entry.title}`}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{entry.title}</p>
                    {entry.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{entry.category || '—'}</span>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={entry.priority} />
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
                      <span className="text-xs text-muted-foreground px-2 py-0.5">
                        +{entry.tags.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(entry.updatedAt), 'MMM d, yyyy')}
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
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onEdit(entry)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(entry)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete([entry.id])}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <p className="text-muted-foreground">No entries found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
