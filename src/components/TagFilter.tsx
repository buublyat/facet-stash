import { Tag } from '@/types/data';
import { TagBadge } from './TagBadge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onClearFilter: () => void;
}

export function TagFilter({ tags, selectedTags, onTagToggle, onClearFilter }: TagFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground">Filter by tags:</span>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <TagBadge
            key={tag.id}
            tag={tag}
            size="sm"
            onClick={() => onTagToggle(tag.id)}
            selected={selectedTags.includes(tag.id)}
          />
        ))}
      </div>
      {selectedTags.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilter}
          className="h-6 px-2 text-xs text-muted-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
