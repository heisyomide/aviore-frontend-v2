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

      setShowToast: (open: boolean) => set({ showToast: open }),

      syncWithBackend: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const { data } = await api.get('/cart');
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
        const selectedItems = items.filter((i: CartItem) => i.selected && !i.isOutOfStock);
        const subtotal = selectedItems.reduce((sum: number, i: CartItem) => sum + (i.price * i.quantity), 0);
        const count = selectedItems.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
        set({ subtotal, totalItems: count });
      },

      addItem: async (item) => {
        const { items } = get();
        const token = localStorage.getItem('token');

        if (token) {
          try {
            await api.post('/cart/add', { productId: item.id, quantity: item.quantity });
          } catch (e) {
            console.error("BACKEND_INGESTION_FAILED");
          }
        }

        const existing = items.find((i: CartItem) => i.id === item.id);
        let updatedItem: CartItem;

        if (existing) {
          updatedItem = { 
            ...existing, 
            quantity: Math.min(existing.quantity + item.quantity, existing.stock) 
          };
          set({
            items: items.map((i: CartItem) => i.id === item.id ? updatedItem : i),
          });
        } else {
          updatedItem = { 
            ...item, 
            selected: true, 
            isOutOfStock: item.stock <= 0 
          };
          set({ items: [...items, updatedItem] });
        }

        set({ lastAddedItem: updatedItem, showToast: true });
        get().calculateTotals();
      },

      updateQuantity: async (id: string, quantity: number) => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            await api.patch(`/cart/item/${id}`, { quantity });
          } catch (e) { console.error(e); }
        }

        set({
          items: get().items.map((i: CartItem) =>
            i.id === id ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stock) } : i
          ),
        });
        get().calculateTotals();
      },

      removeItem: async (id: string) => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            await api.delete(`/cart/item/${id}`);
          } catch (e) { console.error(e); }
        }

        set({ items: get().items.filter((i: CartItem) => i.id !== id) });
        get().calculateTotals();
      },

      toggleSelect: (id: string) => {
        set({
          items: get().items.map((i: CartItem) =>
            i.id === id ? { ...i, selected: !i.selected } : i
          ),
        });
        get().calculateTotals();
      },

      toggleSelectAll: (selected: boolean) => {
        set({
          items: get().items.map((i: CartItem) => ({ 
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
      partialize: (state: CartState) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['showToast', 'lastAddedItem'].includes(key))
      ) as CartState,
    }
  )
);