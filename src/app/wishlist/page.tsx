'use client';

import { useWishlistStore } from '../../store/useWishlistStore';
import { ProductCard } from '../../components/product/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/src/components/navbar/Navbar';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="p-8 bg-gray-50 rounded-full mb-6 text-gray-200">
            <Heart size={64} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
            Wishlist is Empty
          </h2>
          <p className="text-sm font-medium text-gray-400 mb-10 max-w-xs italic">
            Your curated collection is currently empty. Start marking artifacts to save them to your registry.
          </p>
          <Link
            href="/shop"
            className="px-10 py-4 bg-[#A4143D] text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-[#A4143D]/20 transition-all flex items-center gap-3"
          >
            Explore Collection <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto bg-[#FDFCFB] py-20 px-6 min-h-screen">
       <Navbar />
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Heart size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Saved Artifacts
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
            My Wishlist
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Registry Count
            </span>
            <span className="text-xs font-bold text-gray-900">
              {items.length} Items Reserved
            </span>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
      >
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </main>
  );
}