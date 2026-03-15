import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

      calculateTotals: () => {
        const { items } = get();
        const selectedItems = items.filter((i) => i.selected && !i.isOutOfStock);
        const subtotal = selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const count = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
        set({ subtotal, totalItems: count });
      },

      addItem: (item) => {
        const { items } = get();
        // Ensure price is a clean number
        const cleanPrice = typeof item.price === 'string' 
          ? parseFloat(String(item.price).replace(/,/g, '')) 
          : item.price;

        const existing = items.find((i) => i.id === item.id);

        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          });
        } else {
          set({ 
            items: [...items, { 
              ...item, 
              price: cleanPrice, 
              selected: true, 
              isOutOfStock: item.stock <= 0 
            }] 
          });
        }
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

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),
    }),
    { name: 'aviorè-cart-v4' }
  )
);