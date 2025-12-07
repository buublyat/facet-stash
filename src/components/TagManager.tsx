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
  const [newTagColor, setNewTagColor] = useState<TagColor>('blue');

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
      <DialogContent className="sm:max-w-[450px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Manage Tags</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Create New Tag</Label>
            <div className="flex gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button onClick={handleAddTag} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {tagColors.map(color => (
                <button
                  key={color}
                  className={cn(
                    'w-6 h-6 rounded-full transition-all',
                    colorClasses[color],
                    newTagColor === color && 'ring-2 ring-offset-2 ring-foreground/50'
                  )}
                  onClick={() => setNewTagColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Tags</Label>
            <div className="border rounded-lg p-3 max-h-[250px] overflow-y-auto scrollbar-thin">
              {tags.length > 0 ? (
                <div className="space-y-2">
                  {tags.map(tag => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <TagBadge tag={tag} size="sm" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tags created yet
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
