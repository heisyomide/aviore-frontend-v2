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

  addToWishlist: (
    item: WishlistItem,
  ) => Promise<void>;

  removeFromWishlist: (
    id: string,
  ) => Promise<void>;

  toggleWishlist: (
    item: WishlistItem,
  ) => Promise<void>;

  isWishlisted: (
    id: string,
  ) => boolean;

  clearWishlist: () => void;
}

export const useWishlistStore =
  create<WishlistStore>()(
    persist(
      (set, get) => ({
        items: [],
        loading: false,

        /**
         * FETCH FROM BACKEND
         */
        fetchWishlist: async () => {
          try {
            set({ loading: true });

            const res =
              await api.get('/wishlist');

            const items =
              res.data || [];

            set({
              items,
              loading: false,
            });
          } catch (error) {
            console.error(
              'Wishlist fetch failed',
              error,
            );

            set({
              loading: false,
            });
          }
        },

        /**
         * ADD
         */
        addToWishlist: async (
          item,
        ) => {
          const exists =
            get().items.some(
              (p) =>
                p.id === item.id,
            );

          if (exists) return;

          /**
           * OPTIMISTIC UI
           */
          set({
            items: [
              ...get().items,
              item,
            ],
          });

          try {
            await api.post(
              `/wishlist/${item.id}`,
            );
          } catch (error) {
            console.error(
              'Add wishlist failed',
              error,
            );

            /**
             * ROLLBACK
             */
            set({
              items:
                get().items.filter(
                  (p) =>
                    p.id !==
                    item.id,
                ),
            });
          }
        },

        /**
         * REMOVE
         */
        removeFromWishlist:
          async (id) => {
            const previous =
              get().items;

            set({
              items:
                previous.filter(
                  (p) =>
                    p.id !== id,
                ),
            });

            try {
              await api.delete(
                `/wishlist/${id}`,
              );
            } catch (error) {
              console.error(
                'Remove wishlist failed',
                error,
              );

              /**
               * ROLLBACK
               */
              set({
                items: previous,
              });
            }
          },

        /**
         * TOGGLE
         */
        toggleWishlist:
          async (item) => {
            const exists =
              get().isWishlisted(
                item.id,
              );

            if (exists) {
              await get().removeFromWishlist(
                item.id,
              );
            } else {
              await get().addToWishlist(
                item,
              );
            }
          },

        /**
         * CHECK
         */
        isWishlisted: (id) => {
          return get().items.some(
            (p) => p.id === id,
          );
        },

        clearWishlist: () =>
          set({ items: [] }),
      }),
      {
        name: 'aviore-wishlist',
      },
    ),
  );