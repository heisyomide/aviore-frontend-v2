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
  _hasHydrated: boolean;
  isSyncing: boolean; // 🔒 New: Sync Lock
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

      /**
       * 🔄 FIRM BACKEND SYNC
       * Only fetch from backend; let frontend calculate totals to stay fast.
       */
      syncWithBackend: async () => {
        const token = localStorage.getItem('token');
        if (!token || get().isSyncing) return;

        set({ isSyncing: true });
        try {
          const { data } = await api.get('/cart');
          if (!data?.items) return;

          const mappedItems: CartItem[] = data.items.map((item: any) => ({
            id: item.productId,
            name: item.product.title, // Mapping title to name
            price: Number(item.product.price),
            image: item.product.images?.[0]?.imageUrl || '/placeholder.jpg',
            vendorId: item.product.vendorId,
            stock: item.product.stock || 0,
            quantity: item.quantity,
            selected: true,
            isOutOfStock: (item.product.stock || 0) <= 0
          }));

          set({ items: mappedItems });
          get().calculateTotals();
        } catch (err) {
          console.error("CART_SYNC_ERROR", err);
        } finally {
          set({ isSyncing: false });
        }
      },

      calculateTotals: () => {
        const { items } = get();
        const activeItems = items.filter((i) => i.selected && !i.isOutOfStock);
        const subtotal = activeItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const count = activeItems.reduce((sum, i) => sum + i.quantity, 0);
        set({ subtotal, totalItems: count });
      },

      /**
       * ➕ ATOMIC ADD ITEM
       * Updates UI first, then tells the backend.
       */
      addItem: async (incomingItem) => {
        const { items } = get();
        const token = localStorage.getItem('token');

        const existingItemIndex = items.findIndex((i) => i.id === incomingItem.id);
        let updatedItems = [...items];
        let targetItem: CartItem;

        if (existingItemIndex > -1) {
          const existingItem = items[existingItemIndex];
          const newQty = Math.min(existingItem.quantity + incomingItem.quantity, existingItem.stock);
          targetItem = { ...existingItem, quantity: newQty };
          updatedItems[existingItemIndex] = targetItem;
        } else {
          targetItem = { 
            ...incomingItem, 
            selected: true, 
            isOutOfStock: incomingItem.stock <= 0 
          };
          updatedItems.push(targetItem);
        }

        // 🚀 Firm UI Update
        set({ items: updatedItems, lastAddedItem: targetItem, showToast: true });
        get().calculateTotals();

        // Background POST to Backend
        if (token) {
          try {
            await api.post('/cart/add', { 
              productId: incomingItem.id, 
              quantity: incomingItem.quantity 
            });
            // Optional: Re-sync to ensure stock and prices are accurate
            // get().syncWithBackend(); 
          } catch (e) {
            console.error("BACKEND_INGESTION_FAILED");
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
          } catch (e) { console.error("QUANTITY_SYNC_FAILED"); }
        }
      },

      removeItem: async (id) => {
        const { items } = get();
        const token = localStorage.getItem('token');
        
        // Optimistic Remove
        set({ items: items.filter((i) => i.id !== id) });
        get().calculateTotals();

        if (token) {
          try {
            // Finding the cartItem ID (which might be different from productId)
            // If your backend delete needs the CartItem ID, ensure you map it in syncWithBackend
            await api.delete(`/cart/item/${id}`);
          } catch (e) { console.error("REMOVAL_SYNC_FAILED"); }
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