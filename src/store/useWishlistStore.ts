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

      // Fetch wishlist from backend
      fetchWishlist: async () => {
        try {
          set({ loading: true });
          const res = await api.get('/wishlist');
          set({ 
            items: Array.isArray(res.data) ? res.data : [], 
            loading: false 
          });
        } catch (error) {
          console.error('Wishlist fetch failed:', error);
          set({ loading: false });
        }
      },

      // Add item to wishlist with optimistic update + rollback
      addToWishlist: async (item) => {
        const currentItems = get().items;
        const exists = currentItems.some((p) => p.id === item.id);

        if (exists) return;

        const previousItems = [...currentItems];

        // Optimistic update
        set({ items: [...previousItems, item] });

        try {
          await api.post(`/wishlist/${item.id}`);
        } catch (error) {
          console.error('Add to wishlist failed:', error);
          // Rollback on failure
          set({ items: previousItems });
        }
      },

      // Remove item from wishlist with optimistic update + rollback
      removeFromWishlist: async (id) => {
        const currentItems = get().items;
        const previousItems = [...currentItems];

        // Optimistic update
        set({ items: currentItems.filter((p) => p.id !== id) });

        try {
          await api.delete(`/wishlist/${id}`);
        } catch (error) {
          console.error('Remove from wishlist failed:', error);
          // Rollback on failure
          set({ items: previousItems });
        }
      },

      // Toggle wishlist - Clean version without circular dependency
      toggleWishlist: async (item) => {
        const isCurrentlyWishlisted = get().items.some((p) => p.id === item.id);

        if (isCurrentlyWishlisted) {
          await get().removeFromWishlist(item.id);
        } else {
          await get().addToWishlist(item);
        }
      },

      // Check if item is in wishlist
      isWishlisted: (id: string) => {
        return get().items.some((p) => p.id === id);
      },

      // Clear entire wishlist
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'aviore-wishlist',
      // Optional: Only persist items, not loading state
      partialize: (state) => ({ items: state.items }),
    }
  )
);