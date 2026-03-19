import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string; // Map to title if necessary in your components
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
  
  // 🚀 NEW: Feedback States for Rule 12
  lastAddedItem: CartItem | null;
  showToast: boolean;
  setShowToast: (open: boolean) => void;

  addItem: (item: Omit<CartItem, 'selected' | 'isOutOfStock'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleSelect: (id: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,
      
      // 🚀 Initial Feedback State
      lastAddedItem: null,
      showToast: false,

      setShowToast: (open) => set({ showToast: open }),

      calculateTotals: () => {
        const { items } = get();
        const selectedItems = items.filter((i) => i.selected && !i.isOutOfStock);
        const subtotal = selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const count = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
        set({ subtotal, totalItems: count });
      },

      addItem: (item) => {
        const { items } = get();
        
        // Clean price logic for consistency
        const cleanPrice = typeof item.price === 'string' 
          ? parseFloat(String(item.price).replace(/,/g, '')) 
          : item.price;

        const existing = items.find((i) => i.id === item.id);
        let updatedItem: CartItem;

        if (existing) {
          updatedItem = { 
            ...existing, 
            quantity: Math.min(existing.quantity + item.quantity, existing.stock) 
          };
          set({
            items: items.map((i) => i.id === item.id ? updatedItem : i),
          });
        } else {
          updatedItem = { 
            ...item, 
            price: cleanPrice, 
            selected: true, 
            isOutOfStock: item.stock <= 0 
          };
          set({ items: [...items, updatedItem] });
        }

        // 🚀 TRIGGER FEEDBACK (Rule 12)
        // We set the toast to true and store the specific item that was just interacted with
        set({ 
          lastAddedItem: updatedItem, 
          showToast: true 
        });

        get().calculateTotals();
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

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        get().calculateTotals();
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stock) } : i
          ),
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
    }),
    { 
      name: 'aviorè-cart-v4',
      // We exclude showToast from persistence so the popup doesn't 
      // appear randomly when the user reloads the page.
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['showToast', 'lastAddedItem'].includes(key))
      ) as CartState,
    }
  )
);