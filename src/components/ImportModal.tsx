import { useState, useRef } from 'react';
import { DataEntry, Tag } from '@/types/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

// Zod schemas for input validation
const TagColorSchema = z.enum(['red', 'orange', 'amber', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'pink', 'rose']);

const TagSchema = z.object({
  id: z.string().max(100),
  name: z.string().max(100),
  color: TagColorSchema,
});

const StoreSchema = z.object({
  id: z.string().max(100),
  name: z.string().max(200),
  description: z.string().max(2000),
});

const DataEntrySchema = z.object({
  id: z.string().max(100),
  country: z.string().max(10),
  machineId: z.string().max(200),
  description: z.string().max(2000),
  category: z.string().max(100),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['active', 'pending', 'completed', 'archived', 'error']),
  tags: z.array(z.string().max(100)).max(50),
  email: z.enum(['yes', 'no']),
  auth: z.enum(['auto', 'pass']),
  url: z.string().max(2000).optional(),
  notes: z.string().max(10000).optional(),
  password: z.string().max(500).optional(),
  owner: z.string().max(200).optional(),
  orders: z.string().max(10000).optional(),
  stores: z.array(StoreSchema).max(100).optional(),
  createdAt: z.string().max(100),
  updatedAt: z.string().max(100),
});

const ImportDataSchema = z.object({
  entries: z.array(DataEntrySchema).max(10000),
  tags: z.array(TagSchema).max(500).optional(),
});

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

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large: Maximum 10MB allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    try {
      // Parse JSON first
      let data: unknown;
      try {
        data = JSON.parse(jsonContent);
      } catch {
        toast.error('Parse error: Invalid JSON syntax');
        return;
      }

      // Validate with zod schema
      const result = ImportDataSchema.safeParse(data);
      
      if (!result.success) {
        const firstError = result.error.errors[0];
        const path = firstError.path.join('.');
        toast.error(`Validation error: ${path ? `${path} - ` : ''}${firstError.message}`);
        return;
      }

      const validatedData = result.data;
      const entries = validatedData.entries as DataEntry[];
      const tags = (validatedData.tags || []) as Tag[];
      
      onImport(entries, tags);
      toast.success(`Imported ${entries.length} entries`);
      setJsonContent('');
      onClose();
    } catch (error) {
      toast.error('Import error: Unexpected error occurred');
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
