import { useState, useRef } from 'react';
import { DataEntry, Tag } from '@/types/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileJson } from 'lucide-react';
import { toast } from 'sonner';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (entries: DataEntry[], tags: Tag[]) => void;
}

export function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const [jsonContent, setJsonContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(jsonContent);
      
      if (!data.entries || !Array.isArray(data.entries)) {
        throw new Error('Invalid format: missing entries array');
      }
      
      const entries: DataEntry[] = data.entries;
      const tags: Tag[] = data.tags || [];
      
      onImport(entries, tags);
      toast.success(`Imported ${entries.length} entries`);
      setJsonContent('');
      onClose();
    } catch (error) {
      toast.error('Invalid JSON format. Please check your data.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Import Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Upload JSON File</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full h-20 border-dashed gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5" />
              Click to select a JSON file
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or paste JSON</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>JSON Content</Label>
            <Textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              placeholder='{"entries": [...], "tags": [...]}'
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <FileJson className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Expected Format:</p>
                <pre className="mt-1 text-xs">{`{
  "entries": [...],
  "tags": [...]
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!jsonContent.trim()}>
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
