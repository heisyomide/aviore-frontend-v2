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
          // Ensure we always save an array, even if API returns null/error
          const data = Array.isArray(res.data) ? res.data : [];
          set({ items: data, loading: false });
        } catch (error) {
          console.error('Wishlist fetch failed', error);
          set({ loading: false });
        }
      },

      addToWishlist: async (item) => {
        // Defensive check: Do not add if item or ID is missing
        if (!item?.id) return;

        const currentItems = get().items || [];
        if (currentItems.some((p) => p?.id === item.id)) return;

        const previousItems = [...currentItems];
        
        // Sanitize item data before adding to store
        const safeItem: WishlistItem = {
          id: String(item.id),
          name: String(item.name || 'Product'),
          price: Number(item.price) || 0,
          image: String(item.image || '/placeholder.png'),
        };

        set({ items: [...previousItems, safeItem] });

        try {
          await api.post(`/wishlist/${safeItem.id}`);
        } catch (error) {
          console.error('Add to wishlist failed', error);
          set({ items: previousItems }); // Rollback on failure
        }
      },

      removeFromWishlist: async (id) => {
        if (!id) return;
        
        const currentItems = get().items || [];
        const previousItems = [...currentItems];
        set({ items: currentItems.filter((p) => p?.id !== id) });

        try {
          await api.delete(`/wishlist/${id}`);
        } catch (error) {
          console.error('Remove from wishlist failed', error);
          set({ items: previousItems }); // Rollback
        }
      },

      toggleWishlist: async (item) => {
        if (!item?.id) return;

        const currentItems = get().items || [];
        const isCurrentlyWishlisted = currentItems.some((p) => p?.id === item.id);

        if (isCurrentlyWishlisted) {
          const previousItems = [...currentItems];
          set({ items: currentItems.filter((p) => p?.id !== item.id) });
          try {
            await api.delete(`/wishlist/${item.id}`);
          } catch (error) {
            set({ items: previousItems });
          }
        } else {
          const previousItems = [...currentItems];
          const safeItem: WishlistItem = {
            id: String(item.id),
            name: String(item.name || 'Product'),
            price: Number(item.price) || 0,
            image: String(item.image || '/placeholder.png'),
          };
          set({ items: [...previousItems, safeItem] });
          try {
            await api.post(`/wishlist/${safeItem.id}`);
          } catch (error) {
            set({ items: previousItems });
          }
        }
      },

      isWishlisted: (id) => {
        if (!id) return false;
        const items = get().items || [];
        return items.some((p) => p?.id === id);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'aviore-wishlist',
      // Only rehydrate after mounting to avoid hydration mismatches
      skipHydration: true, 
    }
  )
);