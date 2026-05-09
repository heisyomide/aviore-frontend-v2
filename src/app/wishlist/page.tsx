'use client';

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  Heart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { Navbar } from '@/src/components/navbar/Navbar';

import { Container } from '@/src/components/layout/Container';

import { FeaturedBrandsSection } from '@/src/components/FeaturedBrand';

import { WishlistCard } from '@/src/components/product/WishlistCard';

import { useWishlistStore } from '@/src/store/useWishlistStore';

export default function WishlistPage() {
  const {
    items,
    loading,
    fetchWishlist,
  } = useWishlistStore();

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);

    fetchWishlist();
  }, [fetchWishlist]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar />

      <Container className="pt-10 pb-24">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-zinc-100 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#A4143D]">
              <Sparkles
                size={14}
                fill="currentColor"
              />

              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Curated Luxury
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-zinc-900">
              My{' '}
              <span className="text-[#A4143D]">
                Wishlist
              </span>
            </h1>
          </div>

          <div className="px-5 py-3 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.25em]">
            {items.length}{' '}
            {items.length === 1
              ? 'Item'
              : 'Items'}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full border-2 border-[#A4143D] border-t-transparent animate-spin" />

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
              Loading Wishlist...
            </p>
          </div>
        ) : items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {items.map((item) => (
                <motion.div
                  key={
                    item.productId
                  }
                  layout
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                >
                  <WishlistCard
                    item={item}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </Container>

      <FeaturedBrandsSection />
    </div>
  );
}

function EmptyWishlist() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#A4143D]/10 blur-3xl rounded-full" />

        <div className="relative h-32 w-32 rounded-full bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
          <Heart
            size={50}
            className="text-zinc-300"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <h2 className="text-4xl font-black uppercase italic tracking-tight text-zinc-900 mb-4">
        Wishlist Empty
      </h2>

      <p className="max-w-sm text-sm text-zinc-400 leading-relaxed mb-10">
        Save products you love and build
        your personal luxury collection.
      </p>

      <Link
        href="/shop"
        className="h-14 px-8 rounded-full bg-[#A4143D] text-white inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] hover:bg-black transition"
      >
        Explore Collection

        <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}