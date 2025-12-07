import { useState, useEffect, useMemo } from 'react';
import { DataEntry, Tag } from '@/types/data';
import { 
  loadEntries, 
  saveEntries, 
  loadTags, 
  saveTags, 
  generateId,
  exportToJSON,
  exportToCSV,
  downloadFile 
} from '@/lib/storage';
import { DataTable } from '@/components/DataTable';
import { ActionToolbar } from '@/components/ActionToolbar';
import { TagFilter } from '@/components/TagFilter';
import { EntryModal } from '@/components/EntryModal';
import { TagManager } from '@/components/TagManager';
import { ImportModal } from '@/components/ImportModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { toast } from 'sonner';
import { Terminal } from 'lucide-react';

const Index = () => {
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);

  useEffect(() => {
    setEntries(loadEntries());
    setTags(loadTags());
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      saveEntries(entries);
    }
  }, [entries]);

  useEffect(() => {
    if (tags.length > 0) {
      saveTags(tags);
    }
  }, [tags]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = filterTags.length === 0 ||
        filterTags.every(tagId => entry.tags.includes(tagId));
      
      return matchesSearch && matchesTags;
    });
  }, [entries, searchQuery, filterTags]);

  const handleAddEntry = () => {
    setEditingEntry(null);
    setEntryModalOpen(true);
  };

  const handleEditEntry = (entry: DataEntry) => {
    setEditingEntry(entry);
    setEntryModalOpen(true);
  };

  const handleSaveEntry = (entry: DataEntry) => {
    if (editingEntry) {
      setEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
      toast.success('Entry updated successfully');
    } else {
      setEntries(prev => [entry, ...prev]);
      toast.success('Entry created successfully');
    }
  };

  const handleDuplicateEntry = (entry: DataEntry) => {
    const duplicate: DataEntry = {
      ...entry,
      id: generateId(),
      machineId: `${entry.machineId}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEntries(prev => [duplicate, ...prev]);
    toast.success('Entry duplicated');
  };

  const handleDeleteEntries = (ids: string[]) => {
    setPendingDeleteIds(ids);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setEntries(prev => prev.filter(e => !pendingDeleteIds.includes(e.id)));
    setSelectedIds(prev => prev.filter(id => !pendingDeleteIds.includes(id)));
    toast.success(`Deleted ${pendingDeleteIds.length} ${pendingDeleteIds.length === 1 ? 'entry' : 'entries'}`);
    setDeleteDialogOpen(false);
    setPendingDeleteIds([]);
  };

  const handleTagsChange = (newTags: Tag[]) => {
    setTags(newTags);
  };

  const handleTagToggle = (tagId: string) => {
    setFilterTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleExportJSON = () => {
    const json = exportToJSON(entries, tags);
    downloadFile(json, 'data-export.json', 'application/json');
    toast.success('Exported as JSON');
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(entries, tags);
    downloadFile(csv, 'data-export.csv', 'text/csv');
    toast.success('Exported as CSV');
  };

  const handleImport = (importedEntries: DataEntry[], importedTags: Tag[]) => {
    const existingTagIds = new Set(tags.map(t => t.id));
    const newTags = importedTags.filter(t => !existingTagIds.has(t.id));
    
    if (newTags.length > 0) {
      setTags(prev => [...prev, ...newTags]);
    }
    
    setEntries(prev => [...importedEntries, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Scanlines overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-50" />

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 terminal-border bg-primary/10">
              <Terminal className="h-6 w-6 text-primary glow" />
            </div>
            <div className="font-mono">
              <h1 className="text-lg font-bold text-primary glow tracking-wider">
                DATA_MANAGER<span className="animate-blink">_</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">$</span> entries: {entries.length} | tags: {tags.length} | selected: {selectedIds.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {/* ASCII art divider */}
        <div className="text-center text-muted-foreground/30 font-mono text-xs overflow-hidden select-none">
          ═══════════════════════════════════════════════════════════════════
        </div>

        <ActionToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddEntry={handleAddEntry}
          onManageTags={() => setTagManagerOpen(true)}
          onExportJSON={handleExportJSON}
          onExportCSV={handleExportCSV}
          onImport={() => setImportModalOpen(true)}
          selectedCount={selectedIds.length}
          onDeleteSelected={() => handleDeleteEntries(selectedIds)}
        />

        {tags.length > 0 && (
          <div className="terminal-border bg-card p-3">
            <TagFilter
              tags={tags}
              selectedTags={filterTags}
              onTagToggle={handleTagToggle}
              onClearFilter={() => setFilterTags([])}
            />
          </div>
        )}

        <DataTable
          entries={filteredEntries}
          tags={tags}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEditEntry}
          onDuplicate={handleDuplicateEntry}
          onDelete={handleDeleteEntries}
        />

        {/* Footer */}
        <div className="text-center text-muted-foreground/30 font-mono text-xs py-4">
          <span className="text-muted-foreground/50">[</span>
          EOF
          <span className="text-muted-foreground/50">]</span>
          {' '}• LocalStorage v1.0 • 
          <span className="text-primary/50"> Connection: SECURE </span>
        </div>
      </main>

      <EntryModal
        open={entryModalOpen}
        onClose={() => setEntryModalOpen(false)}
        onSave={handleSaveEntry}
        entry={editingEntry}
        tags={tags}
      />

      <TagManager
        open={tagManagerOpen}
        onClose={() => setTagManagerOpen(false)}
        tags={tags}
        onTagsChange={handleTagsChange}
      />

      <ImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        count={pendingDeleteIds.length}
      />
    </div>
  );
};

export default Index;
