import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (item) => {
        const exists = get().items.some((p) => p.id === item.id);

        if (exists) {
          set({
            items: get().items.filter((p) => p.id !== item.id),
          });
        } else {
          set({
            items: [...get().items, item],
          });
        }
      },

      removeFromWishlist: (id) => {
        set({
          items: get().items.filter((p) => p.id !== id),
        });
      },

      isWishlisted: (id) => {
        return get().items.some((p) => p.id === id);
      },
    }),
    {
      name: 'aviore-wishlist',
    }
  )
);