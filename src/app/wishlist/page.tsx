'use client';

import React, { useEffect, useState } from 'react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { ProductCard } from '../../components/product/ProductCard';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/src/components/navbar/Navbar';
import { Container } from '../../components/layout/Container';
import { FeaturedBrandsSection } from '@/src/components/FeaturedBrand';

export default function WishlistPage() {
  const { items, loading, initWishlist } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initialize and handle hydration
  useEffect(() => {
    setIsMounted(true);
    initWishlist();
  }, [initWishlist]);

  // 2. Prevent Hydration mismatch (Error #310)
  if (!isMounted) {
    return <div className="min-h-screen bg-[#FDFCFB]" />;
  }

  // 3. Loading State (Keep the Navbar visible for better UX)
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFB]">
        <Navbar />
        <Container className="pt-24 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-2 border-[#A4143D] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Fetching your artifacts...
          </p>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar />

      <Container className="pt-12 pb-24">
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <EmptyWishlist key="empty" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header Section */}
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10 mb-12">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#A4143D]">
                    <Sparkles size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                      Curated Selection
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                    My <span className="text-[#A4143D]">Wishlist</span>
                  </h1>
                </div>
                
                <div className="bg-zinc-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {items.length} {items.length === 1 ? 'Artifact' : 'Artifacts'} Reserved
                </div>
              </header>

              {/* Grid Section */}
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10"
              >
                <AnimatePresence>
                  {items.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      <FeaturedBrandsSection />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#A4143D]/5 blur-3xl rounded-full" />
        <div className="relative p-10 bg-white border border-zinc-100 rounded-full text-zinc-200 shadow-sm">
          <Heart size={64} strokeWidth={1} />
        </div>
      </div>
      
      <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
        Your Wishlist is Empty
      </h2>
      <p className="text-sm font-medium text-zinc-400 mb-10 max-w-xs italic leading-relaxed">
        You haven't saved any luxury artifacts yet. Start exploring the collection to curate your style.
      </p>
      
      <Link
        href="/shop"
        className="px-10 py-5 bg-[#A4143D] text-white font-black rounded-full uppercase tracking-widest text-[10px] hover:bg-black hover:shadow-2xl hover:shadow-[#A4143D]/20 transition-all duration-500 flex items-center gap-3"
      >
        Explore Collection <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}