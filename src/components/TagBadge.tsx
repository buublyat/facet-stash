import { Tag, TagColor } from '@/types/data';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagBadgeProps {
  tag: Tag;
  size?: 'sm' | 'md';
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
}

const colorClasses: Record<TagColor, string> = {
  red: 'bg-tag-red/15 text-tag-red border-tag-red/30 hover:bg-tag-red/25',
  orange: 'bg-tag-orange/15 text-tag-orange border-tag-orange/30 hover:bg-tag-orange/25',
  amber: 'bg-tag-amber/15 text-tag-amber border-tag-amber/30 hover:bg-tag-amber/25',
  lime: 'bg-tag-lime/15 text-tag-lime border-tag-lime/30 hover:bg-tag-lime/25',
  green: 'bg-tag-green/15 text-tag-green border-tag-green/30 hover:bg-tag-green/25',
  teal: 'bg-tag-teal/15 text-tag-teal border-tag-teal/30 hover:bg-tag-teal/25',
  cyan: 'bg-tag-cyan/15 text-tag-cyan border-tag-cyan/30 hover:bg-tag-cyan/25',
  blue: 'bg-tag-blue/15 text-tag-blue border-tag-blue/30 hover:bg-tag-blue/25',
  indigo: 'bg-tag-indigo/15 text-tag-indigo border-tag-indigo/30 hover:bg-tag-indigo/25',
  purple: 'bg-tag-purple/15 text-tag-purple border-tag-purple/30 hover:bg-tag-purple/25',
  pink: 'bg-tag-pink/15 text-tag-pink border-tag-pink/30 hover:bg-tag-pink/25',
  rose: 'bg-tag-rose/15 text-tag-rose border-tag-rose/30 hover:bg-tag-rose/25',
};

export function TagBadge({ tag, size = 'md', onRemove, onClick, selected }: TagBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium transition-all cursor-default',
        colorClasses[tag.color],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        onClick && 'cursor-pointer',
        selected && 'ring-2 ring-offset-1 ring-primary/50'
      )}
      onClick={onClick}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
