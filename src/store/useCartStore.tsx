import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/src/lib/axios';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  vendorId: string;
  stock: number;
  quantity: number;
  selected: boolean;
  isOutOfStock: boolean;
  variant?: any; 
  size?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  lastAddedItem: CartItem | null;
  showToast: boolean;
  _hasHydrated: boolean;
  isSyncing: boolean;
  setHasHydrated: (state: boolean) => void;
  setShowToast: (open: boolean) => void;
  syncWithBackend: () => Promise<void>;
  calculateTotals: () => void;
  addItem: (item: Omit<CartItem, 'selected' | 'isOutOfStock'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,
      lastAddedItem: null,
      showToast: false,
      _hasHydrated: false,
      isSyncing: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setShowToast: (open) => set({ showToast: open }),

      syncWithBackend: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token || get().isSyncing) return;

        set({ isSyncing: true });
        try {
          const { data } = await api.get('/cart');
          const remoteItems = Array.isArray(data?.items) ? data.items : [];

          const mappedItems: CartItem[] = remoteItems.map((item: any) => ({
            id: String(item.productId || ''),
            name: String(item.product?.title || 'Product'),
            price: Number(item.product?.price) || 0,
            image: item.product?.images?.[0]?.imageUrl || '/placeholder.jpg',
            vendorId: String(item.product?.vendorId || ''),
            stock: Number(item.product?.stock) || 0,
            quantity: Number(item.quantity) || 1,
            selected: true,
            isOutOfStock: (Number(item.product?.stock) || 0) <= 0
          })).filter((item: CartItem) => item.id); // Fixed TS7006 here

          set({ items: mappedItems });
          get().calculateTotals();
        } catch (err) {
          console.error("CART_SYNC_ERROR", err);
        } finally {
          set({ isSyncing: false });
        }
      },

      calculateTotals: () => {
        const items = get().items || [];
        const activeItems = items.filter((i) => i && i.selected && !i.isOutOfStock);
        
        const subtotal = activeItems.reduce((sum, i) => {
          const itemPrice = Number(i.price) || 0;
          const itemQty = Number(i.quantity) || 0;
          return sum + (itemPrice * itemQty);
        }, 0);

        const count = activeItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
        
        set({ subtotal, totalItems: count });
      },

      addItem: async (incomingItem) => {
        if (!incomingItem?.id) return;

        const { items } = get();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const existingItemIndex = items.findIndex((i) => i.id === incomingItem.id);
        let updatedItems = [...items];
        let targetItem: CartItem;

        if (existingItemIndex > -1) {
          const existingItem = items[existingItemIndex];
          const safeStock = Number(existingItem.stock) || 0;
          const newQty = Math.min(existingItem.quantity + incomingItem.quantity, safeStock);
          targetItem = { ...existingItem, quantity: newQty };
          updatedItems[existingItemIndex] = targetItem;
        } else {
          targetItem = { 
            ...incomingItem, 
            id: String(incomingItem.id),
            price: Number(incomingItem.price) || 0,
            selected: true, 
            isOutOfStock: (Number(incomingItem.stock) || 0) <= 0 
          };
          updatedItems.push(targetItem);
        }

        set({ items: updatedItems, lastAddedItem: targetItem, showToast: true });
        get().calculateTotals();

        if (token) {
          try {
            await api.post('/cart/add', { 
              productId: incomingItem.id, 
              quantity: incomingItem.quantity 
            });
          } catch (e) {
            console.error("BACKEND_ADD_FAILED", e);
          }
        }
      },

      updateQuantity: async (id, quantity) => {
        if (!id) return;
        const { items } = get();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const updatedItems = items.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(Math.max(1, Number(quantity) || 1), Number(i.stock) || 1) } : i
        );

        set({ items: updatedItems });
        get().calculateTotals();

        if (token) {
          try {
            await api.patch(`/cart/item/${id}`, { quantity });
          } catch (e) { console.error("QUANTITY_SYNC_FAILED", e); }
        }
      },

      removeItem: async (id) => {
        if (!id) return;
        const { items } = get();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        set({ items: items.filter((i) => i.id !== id) });
        get().calculateTotals();

        if (token) {
          try {
            await api.delete(`/cart/item/${id}`);
          } catch (e) { console.error("REMOVAL_SYNC_FAILED", e); }
        }
      },

      toggleSelect: (id) => {
        set({
          items: (get().items || []).map((i) =>
            i.id === id ? { ...i, selected: !i.selected } : i
          ),
        });
        get().calculateTotals();
      },

      toggleSelectAll: (selected) => {
        set({
          items: (get().items || []).map((i) => ({ 
            ...i, 
            selected: i.isOutOfStock ? false : !!selected 
          })),
        });
        get().calculateTotals();
      },

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0, lastAddedItem: null, showToast: false }),
    }),
    { 
      name: 'aviorè-registry-v1',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        subtotal: state.subtotal
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.calculateTotals();
      }
    }
  )
);