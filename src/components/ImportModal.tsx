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
      toast.error('Parse error: Invalid JSON format');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in bg-card border-border terminal-border font-mono">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-primary glow">
            <span className="text-muted-foreground">$</span> import --data<span className="animate-blink">_</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">--file</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full h-20 border-dashed gap-2 font-mono text-xs glitch-hover"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5" />
              [CLICK TO SELECT .json FILE]
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-mono">// or paste data</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">--stdin</Label>
            <Textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              placeholder='{"entries": [...], "tags": [...]}'
              rows={8}
              className="font-mono text-xs bg-background border-border"
            />
          </div>

          <div className="border border-border p-3 bg-background">
            <div className="flex items-start gap-2">
              <FileJson className="h-4 w-4 text-accent mt-0.5" />
              <div className="text-xs text-muted-foreground font-mono">
                <p className="text-foreground">// Expected format:</p>
                <pre className="mt-1 text-[10px] text-muted-foreground">{`{
  "entries": [...],
  "tags": [...]
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="font-mono text-xs glitch-hover">
            [CANCEL]
          </Button>
          <Button onClick={handleImport} disabled={!jsonContent.trim()} className="font-mono text-xs glitch-hover">
            [IMPORT]
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
