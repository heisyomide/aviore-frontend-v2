'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

export interface WishlistItem {
  id: string;         // wishlist row id
  productId: string;  // product id
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  initialized: boolean;

  initWishlist: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (item: Omit<WishlistItem, 'id'> & { id: string }) => Promise<void>;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      initialized: false,

      // Initialize on app load / page mount
      initWishlist: async () => {
        if (get().initialized) return;
        await get().fetchWishlist();
        set({ initialized: true });
      },

      fetchWishlist: async () => {
        try {
          set({ loading: true });
          const res = await api.get('/wishlist');

          const data = Array.isArray(res.data) ? res.data : res.data?.items || [];

const safeItems: WishlistItem[] = data.map((item: any) => ({
  id: String(item.id),          // wishlist row ID
  productId: String(item.productId), // product ID
  name: item.product?.title || 'Product',
  price: Number(item.product?.price) || 0,
  image: item.product?.images?.[0]?.imageUrl || '/placeholder.jpg',
  color: item.color,
  size: item.size,
}));

          set({ items: safeItems });
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
          toast.error('Could not load wishlist');
        } finally {
          set({ loading: false });
        }
      },

toggleWishlist: async (item) => {
  if (!item?.id) return;

  const { items } = get();

  const exists = items.some(
    (p) => p.productId === item.id
  );

  const safeItem: WishlistItem = {
    id: String(item.id),
    productId: String(item.id),
    name: item.name || 'Product',
    price: Number(item.price) || 0,
    image: item.image || '/placeholder.jpg',
    color: item.color,
    size: item.size,
  };

  // Optimistic update
  set({
    items: exists
      ? items.filter((p) => p.productId !== item.id)
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
    console.error(error);

    // rollback
    set({ items });

    toast.error('Action failed. Please try again.');
  }
},

      isWishlisted: (id: string) => {
        if (!id) return false;
        return get().items.some(
  (p) => p.productId === id
);
      },

      clearWishlist: () => set({ items: [], initialized: false }),
    }),

    {
      name: 'aviorè-wishlist-v2',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initWishlist();   // Important: Auto fetch after rehydrate
        }
      },
    }
  )
);