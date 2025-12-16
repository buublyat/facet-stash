import { useState } from 'react';
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
import { Eye, EyeOff, Copy, ExternalLink, Package, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { OrdersModal } from './OrdersModal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MachineDetailModalProps {
  open: boolean;
  onClose: () => void;
  entry: DataEntry | null;
  tags: Tag[];
  onUpdateEntry?: (entry: DataEntry) => void;
}

export function MachineDetailModal({ open, onClose, entry, tags, onUpdateEntry }: MachineDetailModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  
  // Edit states
  const [editingUrl, setEditingUrl] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  
  // Edit values
  const [urlValue, setUrlValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [notesValue, setNotesValue] = useState('');
  
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const startEditUrl = () => {
    setUrlValue(entry.url || '');
    setEditingUrl(true);
  };

  const saveUrl = () => {
    if (onUpdateEntry) {
      onUpdateEntry({ ...entry, url: urlValue, updatedAt: new Date().toISOString() });
    }
    setEditingUrl(false);
  };

  const startEditEmail = () => {
    setEmailValue(entry.owner || '');
    setEditingEmail(true);
  };

  const saveEmail = () => {
    if (onUpdateEntry) {
      onUpdateEntry({ ...entry, owner: emailValue, updatedAt: new Date().toISOString() });
    }
    setEditingEmail(false);
  };

  const startEditPassword = () => {
    setPasswordValue(entry.password || '');
    setEditingPassword(true);
  };

  const savePassword = () => {
    if (onUpdateEntry) {
      onUpdateEntry({ ...entry, password: passwordValue, updatedAt: new Date().toISOString() });
    }
    setEditingPassword(false);
  };

  const startEditNotes = () => {
    setNotesValue(entry.notes || '');
    setEditingNotes(true);
  };

  const saveNotes = () => {
    if (onUpdateEntry) {
      onUpdateEntry({ ...entry, notes: notesValue, updatedAt: new Date().toISOString() });
    }
    setEditingNotes(false);
  };

  const currentEmail = entry.email === 'yes' ? 'yes' : 'no';
  const currentAuth = entry.auth === 'pass' ? 'pass' : 'auto';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in bg-card border-border terminal-border font-mono">
        <DialogHeader>
          <DialogTitle className="text-primary glow font-bold">
            <span className="text-muted-foreground">$</span> cat /proc/{entry.machineId}<span className="animate-blink">_</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Left Column */}
          <div className="space-y-4">
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

            {/* Email and Auth */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Status */}
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">-- STATUS</span>
              <div className="mt-1">
                <StatusBadge status={entry.status} />
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
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-4 md:border-l md:border-border md:pl-6">
            {/* Orders Button */}
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">-- ORDERS</span>
              <div className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => setOrdersModalOpen(true)}
                  className="font-mono text-xs border-accent text-accent hover:bg-accent hover:text-accent-foreground glitch-hover"
                >
                  <Package className="h-3 w-3 mr-2" />
                  [ VIEW ORDERS ]
                </Button>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* URL */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">-- URL</span>
                {!editingUrl && (
                  <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={startEditUrl}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {editingUrl ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                    className="h-7 text-xs font-mono bg-background border-border"
                    placeholder="https://..."
                  />
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-success" onClick={saveUrl}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => setEditingUrl(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  {entry.url ? (
                    <>
                      <a 
                        href={entry.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-info hover:underline truncate max-w-[200px]"
                      >
                        {entry.url}
                      </a>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(entry.url!, 'URL')}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <a href={entry.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Email */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">-- EMAIL</span>
                {!editingEmail && (
                  <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={startEditEmail}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {editingEmail ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    className="h-7 text-xs font-mono bg-background border-border"
                    placeholder="email@example.com"
                  />
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-success" onClick={saveEmail}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => setEditingEmail(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <p className="text-foreground mt-1">{entry.owner || '—'}</p>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">-- PASSWORD</span>
                {!editingPassword && (
                  <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={startEditPassword}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {editingPassword ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="text"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="h-7 text-xs font-mono bg-background border-border"
                    placeholder="password"
                  />
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-success" onClick={savePassword}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive" onClick={() => setEditingPassword(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  {entry.password ? (
                    <>
                      <p className="text-destructive font-mono">
                        {showPassword ? entry.password : '••••••••'}
                      </p>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(entry.password!, 'Password')}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">-- NOTES</span>
                {!editingNotes && (
                  <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={startEditNotes}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {editingNotes ? (
                <div className="flex flex-col gap-2 mt-1">
                  <Textarea
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    className="text-xs font-mono bg-background border-border min-h-[60px]"
                    placeholder="// Notes..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-success text-xs" onClick={saveNotes}>
                      <Check className="h-3 w-3 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-destructive text-xs" onClick={() => setEditingNotes(false)}>
                      <X className="h-3 w-3 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground mt-1 whitespace-pre-wrap text-xs">
                  {entry.notes || '// No notes'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* EOF indicator */}
        <div className="text-center text-muted-foreground text-xs pt-4">
          [EOF]
        </div>
      </DialogContent>

      {/* Orders Modal */}
      <OrdersModal
        open={ordersModalOpen}
        onClose={() => setOrdersModalOpen(false)}
        entry={entry}
        onUpdateEntry={onUpdateEntry!}
      />
    </Dialog>
  );
}
