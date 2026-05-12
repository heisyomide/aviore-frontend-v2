'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

export interface WishlistItem {     // wishlist row id
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
  toggleWishlist: (item: {
  id: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
}) => Promise<void>;
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
          
        } finally {
          set({ loading: false });
        }
      },

toggleWishlist: async (product) => {
  if (!product?.id) return;

  const { items } = get();

  const exists = items.some(
    (p) => p.productId === product.id
  );

  const optimisticItem: WishlistItem = {
    productId: product.id,
    name: product.name || 'Product',
    price: Number(product.price) || 0,
    image: product.image || '/placeholder.jpg',
    color: product.color,
    size: product.size,
  };

  // optimistic UI
  set({
    items: exists
      ? items.filter(
          (p) => p.productId !== product.id
        )
      : [...items, optimisticItem],
  });

  try {
    if (exists) {
      await api.delete(`/wishlist/${product.id}`);
      toast.success('Removed from wishlist');
    } else {
      await api.post(`/wishlist/${product.id}`);
      toast.success('Added to wishlist');
    }

    // IMPORTANT
    await get().fetchWishlist();

  } catch (error) {
    console.error(error);

    // rollback
    set({ items });

    toast.error('Wishlist sync failed');
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