import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DataEntry, Tag, Sheet } from '@/types/data';
import { 
  loadSheets,
  saveSheets,
  loadActiveSheetId,
  saveActiveSheetId,
  generateId,
  exportToJSON,
  exportToCSV,
  downloadFile 
} from '@/lib/storage';
import { DataTable } from '@/components/DataTable';
import { ActionToolbar } from '@/components/ActionToolbar';
import { TagFilter } from '@/components/TagFilter';
import { CountryFilter } from '@/components/CountryFilter';
import { StatusFilter } from '@/components/StatusFilter';
import { EntryModal } from '@/components/EntryModal';
import { TagManager } from '@/components/TagManager';
import { ImportModal } from '@/components/ImportModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { MachineDetailModal } from '@/components/MachineDetailModal';
import { SheetSelector } from '@/components/SheetSelector';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Terminal, BarChart3 } from 'lucide-react';

const Index = () => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [activeSheetId, setActiveSheetId] = useState<string>('default');
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterCountries, setFilterCountries] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<('active' | 'pending' | 'completed' | 'archived' | 'error')[]>([]);
  
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [detailEntry, setDetailEntry] = useState<DataEntry | null>(null);

  useEffect(() => {
    setSheets(loadSheets());
    setActiveSheetId(loadActiveSheetId());
    setIsInitialized(true);
  }, []);

  // Save sheets when they change
  useEffect(() => {
    if (isInitialized) {
      saveSheets(sheets);
    }
  }, [sheets, isInitialized]);

  // Save active sheet ID when it changes
  useEffect(() => {
    if (isInitialized) {
      saveActiveSheetId(activeSheetId);
    }
  }, [activeSheetId, isInitialized]);

  // Get active sheet with entries and tags
  const activeSheet = useMemo(() => {
    return sheets.find(s => s.id === activeSheetId) || sheets[0];
  }, [sheets, activeSheetId]);

  const entries = activeSheet?.entries || [];
  const tags = activeSheet?.tags || [];

  // Helper to update entries in the active sheet
  const updateEntries = (updater: (prev: DataEntry[]) => DataEntry[]) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === activeSheetId 
        ? { ...sheet, entries: updater(sheet.entries) }
        : sheet
    ));
  };

  // Helper to update tags in the active sheet
  const updateTags = (updater: (prev: Tag[]) => Tag[]) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === activeSheetId 
        ? { ...sheet, tags: updater(sheet.tags) }
        : sheet
    ));
  };

  const availableCountries = useMemo(() => {
    const countries = new Set(entries.map(e => e.country?.toUpperCase()).filter(Boolean));
    return Array.from(countries).sort() as string[];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = filterTags.length === 0 ||
        filterTags.every(tagId => entry.tags.includes(tagId));
      
      const matchesCountry = filterCountries.length === 0 ||
        filterCountries.includes(entry.country?.toUpperCase());
      
      const matchesStatus = filterStatuses.length === 0 ||
        filterStatuses.includes(entry.status);
      
      return matchesSearch && matchesTags && matchesCountry && matchesStatus;
    });
  }, [entries, searchQuery, filterTags, filterCountries, filterStatuses]);

  const handleCountryToggle = (country: string) => {
    setFilterCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleStatusToggle = (status: 'active' | 'pending' | 'completed' | 'archived' | 'error') => {
    setFilterStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

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
      updateEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
      toast.success('Entry updated successfully');
    } else {
      updateEntries(prev => [entry, ...prev]);
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
    updateEntries(prev => [duplicate, ...prev]);
    toast.success('Entry duplicated');
  };

  const handleDeleteEntries = (ids: string[]) => {
    setPendingDeleteIds(ids);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    updateEntries(prev => prev.filter(e => !pendingDeleteIds.includes(e.id)));
    setSelectedIds(prev => prev.filter(id => !pendingDeleteIds.includes(id)));
    toast.success(`Deleted ${pendingDeleteIds.length} ${pendingDeleteIds.length === 1 ? 'entry' : 'entries'}`);
    setDeleteDialogOpen(false);
    setPendingDeleteIds([]);
  };

  const handleTagsChange = (newTags: Tag[]) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === activeSheetId 
        ? { ...sheet, tags: newTags }
        : sheet
    ));
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
    
    setSheets(prev => prev.map(sheet => 
      sheet.id === activeSheetId 
        ? { 
            ...sheet, 
            entries: [...importedEntries, ...sheet.entries],
            tags: newTags.length > 0 ? [...sheet.tags, ...newTags] : sheet.tags
          }
        : sheet
    ));
  };

  // Sheet management handlers
  const handleSelectSheet = (sheetId: string) => {
    setActiveSheetId(sheetId);
    setSelectedIds([]);
  };

  const handleCreateSheet = (sheet: Sheet) => {
    setSheets(prev => [...prev, sheet]);
    setActiveSheetId(sheet.id);
    setSelectedIds([]);
  };

  const handleRenameSheet = (sheetId: string, newName: string) => {
    setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, name: newName } : s));
  };

  const handleDeleteSheet = (sheetId: string) => {
    setSheets(prev => {
      const filtered = prev.filter(s => s.id !== sheetId);
      // If deleting active sheet, switch to first remaining
      if (sheetId === activeSheetId && filtered.length > 0) {
        setActiveSheetId(filtered[0].id);
      }
      return filtered;
    });
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Scanlines overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-50" />

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-3">
              <SheetSelector
                sheets={sheets}
                activeSheetId={activeSheetId}
                onSelectSheet={handleSelectSheet}
                onCreateSheet={handleCreateSheet}
                onRenameSheet={handleRenameSheet}
                onDeleteSheet={handleDeleteSheet}
              />
              <Button asChild variant="outline" className="font-mono">
                <Link to="/dashboard">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
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
          selectedCount={selectedIds.length}
          onDeleteSelected={() => handleDeleteEntries(selectedIds)}
          onExportJSON={handleExportJSON}
          onImport={() => setImportModalOpen(true)}
        />

        <div className="terminal-border bg-card p-3 space-y-3">
          <CountryFilter
            selectedCountries={filterCountries}
            onCountryToggle={handleCountryToggle}
            onClearFilter={() => setFilterCountries([])}
            availableCountries={availableCountries}
          />
          <StatusFilter
            selectedStatuses={filterStatuses}
            onStatusToggle={handleStatusToggle}
            onClearFilter={() => setFilterStatuses([])}
          />
          {tags.length > 0 && (
            <TagFilter
              tags={tags}
              selectedTags={filterTags}
              onTagToggle={handleTagToggle}
              onClearFilter={() => setFilterTags([])}
            />
          )}
        </div>

        <DataTable
          entries={filteredEntries}
          tags={tags}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntries}
          onViewDetails={setDetailEntry}
        />

        {/* Footer */}
        <div className="text-center text-muted-foreground font-mono text-xs py-4">
          <span className="text-muted-foreground">[</span>
          EOF
          <span className="text-muted-foreground">]</span>
          {' '}• LocalStorage v1.0 • 
          <span className="text-primary"> Connection: SECURE </span>
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

      <MachineDetailModal
        open={!!detailEntry}
        onClose={() => setDetailEntry(null)}
        entry={detailEntry}
        tags={tags}
        onUpdateEntry={(updatedEntry) => {
          updateEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
          setDetailEntry(updatedEntry);
        }}
      />
    </div>
  );
};

export default Index;
