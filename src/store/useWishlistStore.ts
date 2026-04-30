'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  initialized: boolean;

  initWishlist: () => Promise<void>;

  fetchWishlist: () => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<void>;

  isWishlisted: (id: string) => boolean;

  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      initialized: false,

      // 🚀 INIT (IMPORTANT - FIXES REFRESH ISSUE)
      initWishlist: async () => {
        if (get().initialized) return;

        try {
          await get().fetchWishlist();
        } finally {
          set({ initialized: true });
        }
      },

      // 📡 FETCH FROM API
      fetchWishlist: async () => {
        try {
          set({ loading: true });

          const res = await api.get('/wishlist');

          const data = Array.isArray(res.data) ? res.data : [];

          const safeData: WishlistItem[] = data.map((item: any) => ({
            id: String(item.id),
            name: item.name || 'Product',
            price: Number(item.price) || 0,
            image: item.image || '/placeholder.png',
          }));

          set({ items: safeData });
        } catch (error) {
          console.error('Wishlist fetch failed', error);
          toast.error('Failed to load wishlist');
        } finally {
          set({ loading: false });
        }
      },

      // ❤️ TOGGLE (BEST METHOD — no need separate add/remove)
      toggleWishlist: async (item) => {
        if (!item?.id) return;

        const { items } = get();
        const exists = items.some((p) => p.id === item.id);

        const safeItem: WishlistItem = {
          id: String(item.id),
          name: item.name || 'Product',
          price: Number(item.price) || 0,
          image: item.image || '/placeholder.png',
        };

        // 🔥 OPTIMISTIC UPDATE
        set({
          items: exists
            ? items.filter((p) => p.id !== item.id)
            : [...items, safeItem],
        });

        try {
          if (exists) {
            await api.delete(`/wishlist/${item.id}`);
            toast.success('Removed from wishlist');
          } else {
            await api.post(`/wishlist/${item.id}`);
            toast.success('Added to wishlist');
          }
        } catch (error) {
          // ❌ ROLLBACK
          set({ items });
          toast.error('Something went wrong');
        }
      },

      // 🔍 CHECK
      isWishlisted: (id) => {
        if (!id) return false;
        return get().items.some((p) => p.id === id);
      },

      // 🧹 CLEAR (LOGOUT USE)
      clearWishlist: () => set({ items: [], initialized: false }),
    }),
    {
      name: 'aviore-wishlist',
    }
  )
);