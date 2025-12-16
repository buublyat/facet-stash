import { useState, useEffect } from 'react';
import { DataEntry } from '@/types/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface OrdersModalProps {
  open: boolean;
  onClose: () => void;
  entry: DataEntry | null;
  onUpdateEntry: (entry: DataEntry) => void;
}

export function OrdersModal({ open, onClose, entry, onUpdateEntry }: OrdersModalProps) {
  const [ordersText, setOrdersText] = useState('');
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    if (entry) {
      setOrdersText(entry.orders || '');
      setStoreName(entry.storeName || '');
    }
  }, [entry, open]);

  if (!entry) return null;

  const handleSave = () => {
    onUpdateEntry({
      ...entry,
      orders: ordersText,
      storeName: storeName,
      updatedAt: new Date().toISOString(),
    });
    toast.success('Orders saved');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] animate-scale-in bg-card border-border terminal-border font-mono">
        <DialogHeader>
          <DialogTitle className="text-primary glow font-bold">
            <span className="text-muted-foreground">$</span> cat /orders/{entry.machineId}<span className="animate-blink">_</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Store Name */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">-- STORE_NAME</Label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="$ Enter store name..."
              className="bg-background border-border focus:border-primary font-mono text-sm mt-1"
            />
          </div>

          <Separator className="bg-border" />

          {/* Orders */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">-- ORDERS</Label>
            <Textarea
              value={ordersText}
              onChange={(e) => setOrdersText(e.target.value)}
              placeholder="# Enter order information here...
# 
# Example:
# Order #001 - 2024-01-15
# - Product: Server License
# - Quantity: 5
# - Status: Delivered"
              rows={12}
              className="bg-background border-border focus:border-primary font-mono text-sm resize-none mt-1"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="font-mono text-xs glitch-hover">
            [ESC]
          </Button>
          <Button onClick={handleSave} className="font-mono text-xs glitch-hover">
            [SAVE] :wq
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
