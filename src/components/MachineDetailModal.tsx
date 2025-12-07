import { DataEntry, Tag } from '@/types/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TagBadge } from './TagBadge';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface MachineDetailModalProps {
  open: boolean;
  onClose: () => void;
  entry: DataEntry | null;
  tags: Tag[];
}

export function MachineDetailModal({ open, onClose, entry, tags }: MachineDetailModalProps) {
  if (!entry) return null;

  const tagMap = new Map(tags.map(t => [t.id, t]));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg animate-scale-in bg-card border-border terminal-border font-mono">
        <DialogHeader>
          <DialogTitle className="text-primary glow font-bold">
            <span className="text-muted-foreground">$</span> cat /proc/{entry.machineId}<span className="animate-blink">_</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">-- COUNTRY</span>
              <p className="text-info font-bold text-lg">{entry.country || '—'}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">-- MACHINE_ID</span>
              <p className="text-foreground">{entry.machineId}</p>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Description */}
          {entry.description && (
            <>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">-- DESCRIPTION</span>
                <p className="text-foreground mt-1 whitespace-pre-wrap">
                  # {entry.description}
                </p>
              </div>
              <Separator className="bg-border" />
            </>
          )}

          {/* Category, Priority, Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">-- CATEGORY</span>
              <p className="text-accent mt-1">
                {entry.category ? `/${entry.category.toLowerCase().replace(/\s+/g, '-')}` : '—'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">-- PRIORITY</span>
              <div className="mt-1">
                <PriorityBadge priority={entry.priority} />
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">-- STATUS</span>
              <div className="mt-1">
                <StatusBadge status={entry.status} />
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Tags */}
          <div>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">-- TAGS</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {entry.tags.length > 0 ? (
                entry.tags.map(tagId => {
                  const tag = tagMap.get(tagId);
                  return tag ? <TagBadge key={tagId} tag={tag} /> : null;
                })
              ) : (
                <span className="text-muted-foreground text-xs">No tags assigned</span>
              )}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground uppercase tracking-wider">-- CREATED_AT</span>
              <p className="text-foreground mt-1">
                {format(new Date(entry.createdAt), 'yyyy-MM-dd HH:mm:ss')}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground uppercase tracking-wider">-- MODIFIED_AT</span>
              <p className="text-foreground mt-1">
                {format(new Date(entry.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
              </p>
            </div>
          </div>

          {/* EOF indicator */}
          <div className="text-center text-muted-foreground text-xs pt-2">
            [EOF]
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
