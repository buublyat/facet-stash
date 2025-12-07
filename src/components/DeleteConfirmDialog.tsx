import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export function DeleteConfirmDialog({ open, onClose, onConfirm, count }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="animate-scale-in bg-card border-border terminal-border font-mono">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive glow font-bold">
            <span className="text-muted-foreground">$</span> rm -rf --confirm<span className="animate-blink">_</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-mono text-xs">
            <span className="text-warning">WARNING:</span> This action cannot be undone.
            <br />
            <span className="text-foreground">{count}</span> {count === 1 ? 'entry' : 'entries'} will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="font-mono text-xs glitch-hover">[N] ABORT</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-mono text-xs glitch-hover"
          >
            [Y] CONFIRM DELETE
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
