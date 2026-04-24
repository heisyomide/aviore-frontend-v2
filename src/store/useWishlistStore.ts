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
            items: res.data || [], 
            loading: false 
          });
        } catch (error) {
          console.error('Wishlist fetch failed', error);
          set({ loading: false });
        }
      },

      addToWishlist: async (item) => {
        const exists = get().items.some((p) => p.id === item.id);
        if (exists) return;

        const previousItems = get().items;

        set({ items: [...previousItems, item] });

        try {
          await api.post(`/wishlist/${item.id}`);
        } catch (error) {
          console.error('Add to wishlist failed', error);
          set({ items: previousItems }); // rollback
        }
      },

      removeFromWishlist: async (id) => {
        const previousItems = get().items;

        set({ items: previousItems.filter((p) => p.id !== id) });

        try {
          await api.delete(`/wishlist/${id}`);
        } catch (error) {
          console.error('Remove from wishlist failed', error);
          set({ items: previousItems }); // rollback
        }
      },

      // FIXED: No longer calls get().isWishlisted inside toggleWishlist
      toggleWishlist: async (item) => {
        const isCurrentlyWishlisted = get().items.some((p) => p.id === item.id);

        if (isCurrentlyWishlisted) {
          await get().removeFromWishlist(item.id);
        } else {
          await get().addToWishlist(item);
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