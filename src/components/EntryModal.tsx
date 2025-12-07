import { useState, useEffect } from 'react';
import { DataEntry, Tag } from '@/types/data';
import { generateId } from '@/lib/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagBadge } from './TagBadge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus } from 'lucide-react';

interface EntryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: DataEntry) => void;
  entry?: DataEntry | null;
  tags: Tag[];
}

const defaultEntry: Omit<DataEntry, 'id' | 'createdAt' | 'updatedAt'> = {
  country: '',
  machineId: '',
  description: '',
  category: '',
  priority: 'medium',
  status: 'active',
  tags: [],
};

export function EntryModal({ open, onClose, onSave, entry, tags }: EntryModalProps) {
  const [formData, setFormData] = useState(defaultEntry);
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);

  useEffect(() => {
    if (entry) {
      setFormData({
        country: entry.country,
        machineId: entry.machineId,
        description: entry.description,
        category: entry.category,
        priority: entry.priority,
        status: entry.status,
        tags: entry.tags,
      });
    } else {
      setFormData(defaultEntry);
    }
  }, [entry, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    onSave({
      id: entry?.id || generateId(),
      ...formData,
      createdAt: entry?.createdAt || now,
      updatedAt: now,
    });
    onClose();
  };

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const selectedTags = tags.filter(t => formData.tags.includes(t.id));
  const availableTags = tags.filter(t => !formData.tags.includes(t.id));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in bg-card border-border terminal-border font-mono">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-primary glow">
            <span className="text-muted-foreground">$</span> {entry ? 'vim --edit' : 'touch --new'}<span className="animate-blink">_</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-xs text-muted-foreground uppercase tracking-wider">--country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value.toUpperCase().slice(0, 2) }))}
                placeholder="US"
                maxLength={2}
                className="bg-background border-border focus:border-primary font-mono uppercase"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="machineId" className="text-xs text-muted-foreground uppercase tracking-wider">--machine_id</Label>
              <Input
                id="machineId"
                value={formData.machineId}
                onChange={(e) => setFormData(prev => ({ ...prev, machineId: e.target.value }))}
                placeholder="SRV-2024-001"
                required
                className="bg-background border-border focus:border-primary font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs text-muted-foreground uppercase tracking-wider">--description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="# Add notes here..."
              rows={3}
              className="bg-background border-border focus:border-primary font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs text-muted-foreground uppercase tracking-wider">--category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="/work, /personal"
                className="bg-background border-border focus:border-primary font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-xs text-muted-foreground uppercase tracking-wider">--priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="bg-background border-border font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border font-mono">
                  <SelectItem value="low">▂░░ LOW</SelectItem>
                  <SelectItem value="medium">▂▄░ MEDIUM</SelectItem>
                  <SelectItem value="high">▂▄▆ HIGH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs text-muted-foreground uppercase tracking-wider">--status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'pending' | 'completed' | 'archived') => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="bg-background border-border font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border font-mono">
                <SelectItem value="active">● ACTIVE</SelectItem>
                <SelectItem value="pending">◐ PENDING</SelectItem>
                <SelectItem value="completed">✓ COMPLETED</SelectItem>
                <SelectItem value="archived">▣ ARCHIVED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">--tags</Label>
            <div className="flex flex-wrap gap-2 min-h-[32px] p-2 border border-border bg-background">
              {selectedTags.map(tag => (
                <TagBadge
                  key={tag.id}
                  tag={tag}
                  size="sm"
                  onRemove={() => toggleTag(tag.id)}
                />
              ))}
              <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px] text-muted-foreground font-mono"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    [ADD]
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 bg-card border-border" align="start">
                  <div className="flex flex-wrap gap-1">
                    {availableTags.length > 0 ? (
                      availableTags.map(tag => (
                        <TagBadge
                          key={tag.id}
                          tag={tag}
                          size="sm"
                          onClick={() => {
                            toggleTag(tag.id);
                            setTagPopoverOpen(false);
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground p-2 font-mono">// no tags available</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="font-mono text-xs glitch-hover">
              [ESC]
            </Button>
            <Button type="submit" className="font-mono text-xs glitch-hover">
              [SAVE] :wq
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
