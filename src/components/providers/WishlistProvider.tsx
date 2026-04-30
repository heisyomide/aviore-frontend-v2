'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/src/store/useWishlistStore';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return <>{children}</>;
}