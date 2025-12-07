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
  red: 'border-tag-red/60 text-tag-red bg-tag-red/10 hover:bg-tag-red/20',
  orange: 'border-tag-orange/60 text-tag-orange bg-tag-orange/10 hover:bg-tag-orange/20',
  amber: 'border-tag-amber/60 text-tag-amber bg-tag-amber/10 hover:bg-tag-amber/20',
  lime: 'border-tag-lime/60 text-tag-lime bg-tag-lime/10 hover:bg-tag-lime/20',
  green: 'border-tag-green/60 text-tag-green bg-tag-green/10 hover:bg-tag-green/20',
  teal: 'border-tag-teal/60 text-tag-teal bg-tag-teal/10 hover:bg-tag-teal/20',
  cyan: 'border-tag-cyan/60 text-tag-cyan bg-tag-cyan/10 hover:bg-tag-cyan/20',
  blue: 'border-tag-blue/60 text-tag-blue bg-tag-blue/10 hover:bg-tag-blue/20',
  indigo: 'border-tag-indigo/60 text-tag-indigo bg-tag-indigo/10 hover:bg-tag-indigo/20',
  purple: 'border-tag-purple/60 text-tag-purple bg-tag-purple/10 hover:bg-tag-purple/20',
  pink: 'border-tag-pink/60 text-tag-pink bg-tag-pink/10 hover:bg-tag-pink/20',
  rose: 'border-tag-rose/60 text-tag-rose bg-tag-rose/10 hover:bg-tag-rose/20',
};

export function TagBadge({ tag, size = 'md', onRemove, onClick, selected }: TagBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border font-mono transition-all cursor-default',
        colorClasses[tag.color],
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        onClick && 'cursor-pointer glitch-hover',
        selected && 'ring-1 ring-offset-1 ring-offset-background ring-primary glow-box'
      )}
      onClick={onClick}
    >
      <span className="opacity-60">[</span>
      {tag.name}
      <span className="opacity-60">]</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 hover:text-destructive transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
