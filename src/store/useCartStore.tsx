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
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  lastAddedItem: CartItem | null;
  showToast: boolean;
  _hasHydrated: boolean; // 🚀 New: Hydration tracker
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

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setShowToast: (open) => set({ showToast: open }),

      syncWithBackend: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const { data } = await api.get('/cart');
          if (!data?.items) return;

          const mappedItems: CartItem[] = data.items.map((item: any) => ({
            id: item.productId,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image || '/placeholder.jpg',
            vendorId: item.product.vendorId,
            stock: item.product.stock || 99,
            quantity: item.quantity,
            selected: true,
            isOutOfStock: (item.product.stock || 0) <= 0
          }));

          set({ items: mappedItems });
          get().calculateTotals();
        } catch (err) {
          console.error("REGISTRY_SYNC_FAILURE", err);
        }
      },

      calculateTotals: () => {
        const { items } = get();
        const activeItems = items.filter((i) => i.selected && !i.isOutOfStock);
        const subtotal = activeItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const count = activeItems.reduce((sum, i) => sum + i.quantity, 0);
        set({ subtotal, totalItems: count });
      },

      addItem: async (incomingItem) => {
        const { items } = get();
        const token = localStorage.getItem('token');

        // 🚨 FIX: Strict Item Identification
        const existingItemIndex = items.findIndex((i) => i.id === incomingItem.id);
        let updatedItems = [...items];
        let targetItem: CartItem;

        if (existingItemIndex > -1) {
          // Item exists: Update quantity only
          const existingItem = items[existingItemIndex];
          const newQty = Math.min(existingItem.quantity + incomingItem.quantity, existingItem.stock);
          
          targetItem = { ...existingItem, quantity: newQty };
          updatedItems[existingItemIndex] = targetItem;
        } else {
          // New item: Initialize properties
          targetItem = { 
            ...incomingItem, 
            selected: true, 
            isOutOfStock: incomingItem.stock <= 0 
          };
          updatedItems.push(targetItem);
        }

        // 🚀 Optimistic UI Update
        set({ items: updatedItems, lastAddedItem: targetItem, showToast: true });
        get().calculateTotals();

        // Backend sync (Async background)
        if (token) {
          try {
            await api.post('/cart/add', { 
              productId: incomingItem.id, 
              quantity: incomingItem.quantity 
            });
          } catch (e) {
            console.error("INGESTION_ERROR: Backend out of sync");
          }
        }
      },

      updateQuantity: async (id, quantity) => {
        const { items } = get();
        const token = localStorage.getItem('token');

        const updatedItems = items.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stock) } : i
        );

        set({ items: updatedItems });
        get().calculateTotals();

        if (token) {
          try {
            await api.patch(`/cart/item/${id}`, { quantity });
          } catch (e) { console.error("QTY_SYNC_FAILURE"); }
        }
      },

      removeItem: async (id) => {
        const token = localStorage.getItem('token');
        set({ items: get().items.filter((i) => i.id !== id) });
        get().calculateTotals();

        if (token) {
          try {
            await api.delete(`/cart/item/${id}`);
          } catch (e) { console.error("REMOVAL_SYNC_FAILURE"); }
        }
      },

      toggleSelect: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, selected: !i.selected } : i
          ),
        });
        get().calculateTotals();
      },

      toggleSelectAll: (selected) => {
        set({
          items: get().items.map((i) => ({ 
            ...i, 
            selected: i.isOutOfStock ? false : selected 
          })),
        });
        get().calculateTotals();
      },

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0, lastAddedItem: null, showToast: false }),
    }),
    { 
      name: 'aviorè-registry-v1',
      // Ensure specific UI states aren't saved to localStorage
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        subtotal: state.subtotal
      }) as CartState,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);