import { DataEntry, Tag } from '@/types/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TagBadge } from './TagBadge';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface MachineDetailModalProps {
  open: boolean;
  onClose: () => void;
  entry: DataEntry | null;
  tags: Tag[];
  onUpdateEntry?: (entry: DataEntry) => void;
}

export function MachineDetailModal({ open, onClose, entry, tags, onUpdateEntry }: MachineDetailModalProps) {
  if (!entry) return null;

  const tagMap = new Map(tags.map(t => [t.id, t]));

  const handleEmailChange = (value: 'yes' | 'no') => {
    if (onUpdateEntry) {
      onUpdateEntry({
        ...entry,
        email: value,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleAuthChange = (value: 'auto' | 'pass') => {
    if (onUpdateEntry) {
      onUpdateEntry({
        ...entry,
        auth: value,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const currentEmail = entry.email === 'yes' ? 'yes' : 'no';
  const currentAuth = entry.auth === 'pass' ? 'pass' : 'auto';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl animate-scale-in bg-card border-border terminal-border font-mono">
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

          {/* Email, Auth, Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">-- EMAIL</span>
              <div className="flex gap-1 mt-1">
                <Button
                  size="sm"
                  variant={currentEmail === 'yes' ? 'default' : 'outline'}
                  onClick={() => handleEmailChange('yes')}
                  className={`h-7 px-2 text-xs font-mono ${
                    currentEmail === 'yes' 
                      ? 'bg-success hover:bg-success/90 text-success-foreground border-success' 
                      : 'border-border hover:border-success/50 hover:text-success'
                  }`}
                >
                  [ YES ]
                </Button>
                <Button
                  size="sm"
                  variant={currentEmail === 'no' ? 'default' : 'outline'}
                  onClick={() => handleEmailChange('no')}
                  className={`h-7 px-2 text-xs font-mono ${
                    currentEmail === 'no' 
                      ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive' 
                      : 'border-border hover:border-destructive/50 hover:text-destructive'
                  }`}
                >
                  [ NO ]
                </Button>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">-- AUTH</span>
              <div className="flex gap-1 mt-1">
                <Button
                  size="sm"
                  variant={currentAuth === 'auto' ? 'default' : 'outline'}
                  onClick={() => handleAuthChange('auto')}
                  className={`h-7 px-2 text-xs font-mono ${
                    currentAuth === 'auto' 
                      ? 'bg-info hover:bg-info/90 text-info-foreground border-info' 
                      : 'border-border hover:border-info/50 hover:text-info'
                  }`}
                >
                  [ AUTO ]
                </Button>
                <Button
                  size="sm"
                  variant={currentAuth === 'pass' ? 'default' : 'outline'}
                  onClick={() => handleAuthChange('pass')}
                  className={`h-7 px-2 text-xs font-mono ${
                    currentAuth === 'pass' 
                      ? 'bg-warning hover:bg-warning/90 text-warning-foreground border-warning' 
                      : 'border-border hover:border-warning/50 hover:text-warning'
                  }`}
                >
                  [ PASS ]
                </Button>
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
