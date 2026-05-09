'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/src/lib/axios';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  vendorId: string;
  stock: number;
  quantity: number;
  selected: boolean;
  isOutOfStock: boolean;
  color?: string;
  size?: string;
  variant?: any;
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
  setShowToast: (show: boolean) => void;
  calculateTotals: () => void;

  addItem: (item: Omit<CartItem, 'selected' | 'isOutOfStock'>) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;
  syncWithBackend: () => Promise<void>;
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
      setShowToast: (show) => set({ showToast: show }),

      calculateTotals: () => {
        const items = get().items || [];
        const activeItems = items.filter((i) => i.selected && !i.isOutOfStock);

        const subtotal = activeItems.reduce((sum, i) => {
          return sum + (Number(i.price) || 0) * (Number(i.quantity) || 0);
        }, 0);

        const totalItems = activeItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

        set({ subtotal, totalItems });
      },

      addItem: async (incomingItem) => {
        if (!incomingItem?.id) return;

        const { items } = get();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const existingIndex = items.findIndex((i) =>
          (i.variantId && i.variantId === incomingItem.variantId) ||
          (!i.variantId && i.id === incomingItem.id)
        );

        let updatedItems = [...items];
        let targetItem: CartItem;

        if (existingIndex > -1) {
          const existing = items[existingIndex];
          const newQty = Math.min(
            existing.quantity + (incomingItem.quantity || 1),
            Number(existing.stock) || 999
          );
          targetItem = { ...existing, quantity: newQty };
          updatedItems[existingIndex] = targetItem;
        } else {
          targetItem = {
            ...incomingItem,
            selected: true,
            isOutOfStock: (Number(incomingItem.stock) || 0) <= 0,
            quantity: incomingItem.quantity || 1,
          };
          updatedItems.push(targetItem);
        }

        set({ 
          items: updatedItems, 
          lastAddedItem: targetItem, 
          showToast: true 
        });

        get().calculateTotals();

        // Backend sync
        if (token) {
          try {
            await api.post('/cart/add', {
              productId: incomingItem.productId,
              variantId: incomingItem.variantId,
              quantity: incomingItem.quantity || 1,
            });
          } catch (e) {
            console.error("Failed to sync add to cart", e);
          }
        }
      },

      updateQuantity: async (id: string, quantity: number) => {
        const { items } = get();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const updatedItems = items.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, Math.min(quantity, Number(item.stock) || 999)) }
            : item
        );

        set({ items: updatedItems });
        get().calculateTotals();

        if (token) {
          try {
            await api.patch(`/cart/item/${id}`, { quantity });
          } catch (e) {
            console.error("Quantity update failed", e);
          }
        }
      },

      removeItem: async (id: string) => {
        const { items } = get();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        set({ items: items.filter((i) => i.id !== id) });
        get().calculateTotals();

        if (token) {
          try {
            await api.delete(`/cart/item/${id}`);
          } catch (e) {
            console.error("Remove item failed", e);
          }
        }
      },

      toggleSelect: (id: string) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, selected: !i.selected } : i
          ),
        });
        get().calculateTotals();
      },

      toggleSelectAll: (selected: boolean) => {
        set({
          items: get().items.map((i) => ({
            ...i,
            selected: i.isOutOfStock ? false : selected,
          })),
        });
        get().calculateTotals();
      },

      clearCart: () => set({ 
        items: [], 
        totalItems: 0, 
        subtotal: 0, 
        lastAddedItem: null, 
        showToast: false 
      }),

// Replace your syncWithBackend with this version
syncWithBackend: async () => {
  if (typeof window === 'undefined') return;
  const token = localStorage.getItem('token');
  if (!token || get().isSyncing) return;

  set({ isSyncing: true });
  try {
    const { data } = await api.get('/cart');
    
    // Using a more robust mapping to ensure no zeros
    const mapped = (data?.items || []).map((item: any) => {
      const product = item.product;
      const variants = product?.variants || [];

      // Look for the CHEAPEST variant price, fallback to product price
      const variantPrices = variants
        .map((v: any) => Number(v?.price) || 0)
        .filter((p: number) => p > 0);

      const calculatedPrice = variantPrices.length > 0
        ? Math.min(...variantPrices)
        : Number(product?.price || 0);

      // Sum all variant stock
      const totalStock = variants.length > 0
        ? variants.reduce((sum: number, v: any) => sum + (Number(v?.stock) || 0), 0)
        : Number(product?.stock || 0);

      return {
        id: String(item.id),
        productId: String(item.productId),
        variantId: item.variantId,
        name: product?.title || 'Product Name',
        price: calculatedPrice || 0,
        image: product?.images?.[0]?.imageUrl || '/placeholder.jpg',
        vendorId: String(product?.vendorId || ''),
        stock: totalStock,
        quantity: Number(item.quantity) || 1,
        selected: true,
        isOutOfStock: totalStock <= 0,
        color: item.color,
        size: item.size,
      };
    });

    // Only update if we actually got data back to prevent flashing zeros
    if (mapped.length > 0) {
      set({ items: mapped });
    }
    
    get().calculateTotals();
  } catch (err) {
    console.error("Cart sync failed:", err);
  } finally {
    set({ isSyncing: false });
  }
},
    }),

    {
      name: 'aviorè-cart-v2',
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.calculateTotals();
        state?.syncWithBackend();
      },
    }
  )
);