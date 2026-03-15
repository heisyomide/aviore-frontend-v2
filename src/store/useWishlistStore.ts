import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set: any) => ({
      items: [] as any[],
      addItem: (product: any) => 
        set((state: any) => ({ 
          items: [...state.items, product] 
        })),
      removeItem: (id: string) => 
        set((state: any) => ({ 
          items: state.items.filter((i: any) => i.id !== id) 
        })),
    }),
    {
      name: 'wishlist-storage', // This is the key that will appear in your localStorage
      storage: createJSONStorage(() => localStorage), // This forces it to save to the browser
    }
  )
);