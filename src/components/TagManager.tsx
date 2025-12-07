import { useState } from 'react';
import { Tag, TagColor } from '@/types/data';
import { generateId } from '@/lib/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TagBadge } from './TagBadge';
import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagManagerProps {
  open: boolean;
  onClose: () => void;
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const tagColors: TagColor[] = [
  'red', 'orange', 'amber', 'lime', 'green', 'teal', 
  'cyan', 'blue', 'indigo', 'purple', 'pink', 'rose'
];

const colorClasses: Record<TagColor, string> = {
  red: 'bg-tag-red',
  orange: 'bg-tag-orange',
  amber: 'bg-tag-amber',
  lime: 'bg-tag-lime',
  green: 'bg-tag-green',
  teal: 'bg-tag-teal',
  cyan: 'bg-tag-cyan',
  blue: 'bg-tag-blue',
  indigo: 'bg-tag-indigo',
  purple: 'bg-tag-purple',
  pink: 'bg-tag-pink',
  rose: 'bg-tag-rose',
};

export function TagManager({ open, onClose, tags, onTagsChange }: TagManagerProps) {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<TagColor>('cyan');

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag: Tag = {
      id: generateId(),
      name: newTagName.trim(),
      color: newTagColor,
    };
    
    onTagsChange([...tags, newTag]);
    setNewTagName('');
  };

  const handleDeleteTag = (tagId: string) => {
    onTagsChange(tags.filter(t => t.id !== tagId));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] animate-scale-in bg-card border-border terminal-border font-mono">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-primary glow">
            <span className="text-muted-foreground">$</span> tag --manage<span className="animate-blink">_</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">--new-tag</Label>
            <div className="flex gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="tag_name"
                className="flex-1 bg-background border-border font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button onClick={handleAddTag} size="icon" className="glitch-hover">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tagColors.map(color => (
                <button
                  key={color}
                  className={cn(
                    'w-5 h-5 transition-all',
                    colorClasses[color],
                    newTagColor === color && 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110'
                  )}
                  onClick={() => setNewTagColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">--existing-tags</Label>
            <div className="border border-border p-3 max-h-[250px] overflow-y-auto bg-background">
              {tags.length > 0 ? (
                <div className="space-y-2">
                  {tags.map((tag, index) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-2 border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">{String(index).padStart(2, '0')}.</span>
                        <TagBadge tag={tag} size="sm" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive glitch-hover"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  // no tags found
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="font-mono text-xs glitch-hover">[DONE]</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
