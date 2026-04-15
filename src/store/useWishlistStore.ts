import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios'; // Or your custom api instance

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  // Actions
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  isWishlisted: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      // 1. Fetch from Backend on Login/App Load
      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get('/wishlist');
          // Assuming your backend returns { productId: string, product: WishlistItem }[]
          const formattedItems = response.data.map((entry: any) => entry.product);
          set({ items: formattedItems, isLoading: false });
        } catch (error) {
          console.error("Failed to sync wishlist", error);
          set({ isLoading: false });
        }
      },

      // 2. Toggle (Add/Remove) with Backend Sync
      toggleWishlist: async (item) => {
        const { items } = get();
        const exists = items.some((p) => p.id === item.id);

        // Optimistic UI Update (Update UI immediately)
        if (exists) {
          set({ items: items.filter((p) => p.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }

        try {
          if (exists) {
            // Call your DELETE :productId controller
            await axios.delete(`/wishlist/${item.id}`);
          } else {
            // Call your POST :productId controller
            await axios.post(`/wishlist/${item.id}`);
          }
        } catch (error) {
          // Revert UI if the backend call fails
          console.error("Backend sync failed, reverting UI");
          set({ items }); 
        }
      },

      isWishlisted: (id) => {
        return get().items.some((p) => p.id === id);
      },
    }),
    {
      name: 'aviore-wishlist',
      // We still use persist so the items show up instantly 
      // even before the fetchWishlist finishes.
    }
  )
);