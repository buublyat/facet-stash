import { useState, useEffect } from 'react';
import { DataEntry, Store } from '@/types/data';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { generateId } from '@/lib/storage';

interface OrdersModalProps {
  open: boolean;
  onClose: () => void;
  entry: DataEntry | null;
  onUpdateEntry: (entry: DataEntry) => void;
}

export function OrdersModal({ open, onClose, entry, onUpdateEntry }: OrdersModalProps) {
  const [ordersText, setOrdersText] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [expandedStores, setExpandedStores] = useState<Set<string>>(new Set());
  const [newStoreName, setNewStoreName] = useState('');

  useEffect(() => {
    if (entry) {
      setOrdersText(entry.orders || '');
      setStores(entry.stores || []);
      setExpandedStores(new Set());
      setNewStoreName('');
    }
  }, [entry, open]);

  if (!entry) return null;

  const handleSave = () => {
    onUpdateEntry({
      ...entry,
      orders: ordersText,
      stores: stores,
      updatedAt: new Date().toISOString(),
    });
    toast.success('Orders saved');
    onClose();
  };

  const handleAddStore = () => {
    if (!newStoreName.trim()) {
      toast.error('Enter a store name');
      return;
    }
    const newStore: Store = {
      id: generateId(),
      name: newStoreName.trim(),
      description: '',
    };
    setStores([...stores, newStore]);
    setNewStoreName('');
    setExpandedStores(new Set([...expandedStores, newStore.id]));
  };

  const handleDeleteStore = (storeId: string) => {
    setStores(stores.filter(s => s.id !== storeId));
    const newExpanded = new Set(expandedStores);
    newExpanded.delete(storeId);
    setExpandedStores(newExpanded);
  };

  const handleUpdateStoreDescription = (storeId: string, description: string) => {
    setStores(stores.map(s => 
      s.id === storeId ? { ...s, description } : s
    ));
  };

  const toggleStore = (storeId: string) => {
    const newExpanded = new Set(expandedStores);
    if (newExpanded.has(storeId)) {
      newExpanded.delete(storeId);
    } else {
      newExpanded.add(storeId);
    }
    setExpandedStores(newExpanded);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in bg-card border-border terminal-border font-mono">
        <DialogHeader>
          <DialogTitle className="text-primary glow font-bold">
            <span className="text-muted-foreground">$</span> cat /orders/{entry.machineId}<span className="animate-blink">_</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stores Section */}
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">-- STORES</Label>
            
            {/* Add Store Input */}
            <div className="flex gap-2 mt-2">
              <Input
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                placeholder="$ Enter store name..."
                className="bg-background border-border focus:border-primary font-mono text-sm flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddStore()}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddStore}
                className="font-mono text-xs border-success text-success hover:bg-success hover:text-success-foreground"
              >
                <Plus className="h-3 w-3 mr-1" />
                [ADD]
              </Button>
            </div>

            {/* Store List */}
            <div className="mt-3 space-y-2">
              {stores.length === 0 ? (
                <p className="text-muted-foreground text-xs">// No stores added</p>
              ) : (
                stores.map((store) => (
                  <Collapsible
                    key={store.id}
                    open={expandedStores.has(store.id)}
                    onOpenChange={() => toggleStore(store.id)}
                  >
                    <div className="border border-border bg-background">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-2">
                            {expandedStores.has(store.id) ? (
                              <ChevronDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-primary font-mono text-sm">{store.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStore(store.id);
                            }}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-2 pt-0 border-t border-border">
                          <Textarea
                            value={store.description}
                            onChange={(e) => handleUpdateStoreDescription(store.id, e.target.value)}
                            placeholder="# Enter store description..."
                            rows={3}
                            className="bg-background border-border focus:border-primary font-mono text-xs resize-none"
                          />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))
              )}
            </div>
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
              rows={8}
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
