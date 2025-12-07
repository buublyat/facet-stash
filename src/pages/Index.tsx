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
import { Database } from 'lucide-react';

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
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      toast.success('Entry updated');
    } else {
      setEntries(prev => [entry, ...prev]);
      toast.success('Entry created');
    }
  };

  const handleDuplicateEntry = (entry: DataEntry) => {
    const duplicate: DataEntry = {
      ...entry,
      id: generateId(),
      title: `${entry.title} (Copy)`,
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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Data Manager</h1>
              <p className="text-sm text-muted-foreground">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} • {tags.length} tags
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
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
          <TagFilter
            tags={tags}
            selectedTags={filterTags}
            onTagToggle={handleTagToggle}
            onClearFilter={() => setFilterTags([])}
          />
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
