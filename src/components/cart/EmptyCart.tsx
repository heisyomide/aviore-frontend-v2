'use client';

import { ShoppingBag, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Container } from '../layout/Container';
import { ProductGrid } from '../product/ProductGrid';

// 🚀 Mock suggestions for the Discovery Loop
const SUGGESTIONS = Array(4).fill(null).map((_, index) => ({
  id: `sug-${index}`,
  name: `Trending Artifact ${index + 1}`,
  title: `Trending Artifact ${index + 1}`,
  price: 15000 + (index * 500),
  image: `https://picsum.photos/400/400?random=${index + 90}`,
  rating: 4.9,
  reviews: 88,
  discount: 15,
  stock: 5
}));

export function EmptyCart() {
  return (
    <div className="bg-white min-h-[80vh] flex flex-col">
      <Container className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        
        {/* 1. THE ZERO STATE - Rule 12 (Visual Polish) */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
            <ShoppingBag size={48} className="text-gray-200" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-brand rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
             <TrendingUp size={20} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 mb-4">
          Your Registry is <span className="text-gray-300">Empty</span>
        </h2>
        
        <p className="text-sm font-bold text-gray-500 max-w-xs mb-10 uppercase tracking-tight">
          Don't let your legacy wait. Explore our curated artifacts and start your collection.
        </p>

        <Link 
          href="/"
          className="group bg-[#111] text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 hover:bg-brand transition-all active:scale-95 shadow-xl shadow-black/10"
        >
          Start Discovering
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* 2. THE DISCOVERY LOOP - Rule 1 */}
        <div className="w-full mt-24 border-t border-gray-100 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-brand rounded-full" />
              <h3 className="text-xl font-black italic uppercase tracking-tighter">
                Trending <span className="text-gray-400">Right Now</span>
              </h3>
            </div>
            <Link href="/best-sellers" className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline">
              View All
            </Link>
          </div>

          <ProductGrid products={SUGGESTIONS} />
        </div>
      </Container>
    </div>
  );
}