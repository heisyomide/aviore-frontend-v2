'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/src/lib/axios';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;

  fetchWishlist: () => Promise<void>;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      fetchWishlist: async () => {
        try {
          set({ loading: true });
          const res = await api.get('/wishlist');
          set({ 
            items: Array.isArray(res.data) ? res.data : [], 
            loading: false 
          });
        } catch (error) {
          console.error('Wishlist fetch failed', error);
          set({ loading: false });
        }
      },

      addToWishlist: async (item) => {
        const currentItems = get().items;
        if (currentItems.some((p) => p.id === item.id)) return;

        const previousItems = [...currentItems];

        set({ items: [...previousItems, item] });

        try {
          await api.post(`/wishlist/${item.id}`);
        } catch (error) {
          console.error('Add to wishlist failed', error);
          set({ items: previousItems }); // rollback
        }
      },

      removeFromWishlist: async (id) => {
        const currentItems = get().items;
        const previousItems = [...currentItems];

        set({ items: currentItems.filter((p) => p.id !== id) });

        try {
          await api.delete(`/wishlist/${id}`);
        } catch (error) {
          console.error('Remove from wishlist failed', error);
          set({ items: previousItems }); // rollback
        }
      },

      // FINAL FIXED VERSION - Self-contained, no circular calls
      toggleWishlist: async (item) => {
        const currentItems = get().items;
        const isCurrentlyWishlisted = currentItems.some((p) => p.id === item.id);

        if (isCurrentlyWishlisted) {
          // Remove
          const previousItems = [...currentItems];
          set({ items: currentItems.filter((p) => p.id !== item.id) });

          try {
            await api.delete(`/wishlist/${item.id}`);
          } catch (error) {
            console.error('Remove from wishlist failed', error);
            set({ items: previousItems });
          }
        } else {
          // Add
          const previousItems = [...currentItems];
          set({ items: [...previousItems, item] });

          try {
            await api.post(`/wishlist/${item.id}`);
          } catch (error) {
            console.error('Add to wishlist failed', error);
            set({ items: previousItems });
          }
        }
      },

      isWishlisted: (id) => {
        return get().items.some((p) => p.id === id);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'aviore-wishlist',
    }
  )
);