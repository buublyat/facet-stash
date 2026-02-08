import { useState } from 'react';
import { Sheet } from '@/types/data';
import { generateId } from '@/lib/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ChevronDown, Plus, Trash2, Edit2, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

interface SheetSelectorProps {
  sheets: Sheet[];
  activeSheetId: string;
  onSelectSheet: (sheetId: string) => void;
  onCreateSheet: (sheet: Sheet) => void;
  onRenameSheet: (sheetId: string, newName: string) => void;
  onDeleteSheet: (sheetId: string) => void;
}

export const SheetSelector = ({
  sheets,
  activeSheetId,
  onSelectSheet,
  onCreateSheet,
  onRenameSheet,
  onDeleteSheet,
}: SheetSelectorProps) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newSheetName, setNewSheetName] = useState('');
  const [editingSheet, setEditingSheet] = useState<Sheet | null>(null);

  const activeSheet = sheets.find(s => s.id === activeSheetId);

  const handleCreateSheet = () => {
    if (!newSheetName.trim()) {
      toast.error('Sheet name required');
      return;
    }
    const sheet: Sheet = {
      id: generateId(),
      name: newSheetName.trim(),
      entries: [],
      createdAt: new Date().toISOString(),
    };
    onCreateSheet(sheet);
    setNewSheetName('');
    setCreateDialogOpen(false);
    toast.success(`Sheet "${sheet.name}" created`);
  };

  const handleRenameSheet = () => {
    if (!editingSheet || !newSheetName.trim()) {
      toast.error('Sheet name required');
      return;
    }
    onRenameSheet(editingSheet.id, newSheetName.trim());
    setNewSheetName('');
    setEditingSheet(null);
    setRenameDialogOpen(false);
    toast.success('Sheet renamed');
  };

  const handleDeleteSheet = () => {
    if (!editingSheet) return;
    if (sheets.length === 1) {
      toast.error('Cannot delete the last sheet');
      return;
    }
    onDeleteSheet(editingSheet.id);
    setEditingSheet(null);
    setDeleteDialogOpen(false);
    toast.success(`Sheet "${editingSheet.name}" deleted`);
  };

  const openRenameDialog = (sheet: Sheet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSheet(sheet);
    setNewSheetName(sheet.name);
    setRenameDialogOpen(true);
  };

  const openDeleteDialog = (sheet: Sheet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSheet(sheet);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-mono gap-2 min-w-[160px] justify-between">
            <span className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              <span className="truncate max-w-[120px]">{activeSheet?.name || 'Select Sheet'}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-[240px] bg-card border-border z-50"
        >
          {sheets.map(sheet => (
            <DropdownMenuItem
              key={sheet.id}
              className={`font-mono cursor-pointer group ${
                sheet.id === activeSheetId ? 'bg-primary/10 text-primary' : ''
              }`}
              onClick={() => onSelectSheet(sheet.id)}
            >
              <span className="flex-1 truncate">{sheet.name}</span>
              <span className="text-xs text-muted-foreground mr-2">
                {sheet.entries.length}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => openRenameDialog(sheet, e)}
                  className="p-1 hover:text-accent"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                {sheets.length > 1 && (
                  <button
                    onClick={(e) => openDeleteDialog(sheet, e)}
                    className="p-1 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="font-mono cursor-pointer text-accent"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            [ NEW SHEET ]
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Sheet Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="terminal-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-mono text-primary glow">
              $ new_sheet<span className="animate-blink">_</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-mono">--name</label>
              <Input
                value={newSheetName}
                onChange={(e) => setNewSheetName(e.target.value)}
                placeholder="Enter sheet name..."
                className="font-mono"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateSheet()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              [ ESC ]
            </Button>
            <Button onClick={handleCreateSheet}>
              [ CREATE ]
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Sheet Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="terminal-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-mono text-primary glow">
              $ rename_sheet<span className="animate-blink">_</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-mono">--name</label>
              <Input
                value={newSheetName}
                onChange={(e) => setNewSheetName(e.target.value)}
                placeholder="Enter new name..."
                className="font-mono"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleRenameSheet()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              [ ESC ]
            </Button>
            <Button onClick={handleRenameSheet}>
              [ SAVE ]
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Sheet Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="terminal-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-mono text-destructive">
              $ rm -rf "{editingSheet?.name}"<span className="animate-blink">_</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground font-mono text-sm">
            This will permanently delete the sheet and all {editingSheet?.entries.length || 0} entries.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              [ N ] ABORT
            </Button>
            <Button variant="destructive" onClick={handleDeleteSheet}>
              [ Y ] CONFIRM
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
