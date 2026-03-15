'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Sparkles, PackageOpen, Loader2 } from 'lucide-react';

// 1. Define a robust interface to handle external grid styling
interface ProductGridProps {
  title: string;
  products: any[];
  loading?: boolean;
  className?: string; // Crucial: Fixed the TypeScript "Property does not exist" error
}

export function ProductGrid({ title, products, loading, className = "" }: ProductGridProps) {
  const [localCategory, setLocalCategory] = useState('All');
  
  // Sync local category with the Sidebar Title if the parent section changes
  useEffect(() => {
    setLocalCategory('All');
  }, [title]);

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Beauty'];

  // 2. Optimized Hierarchy-Aware Filter
  const filtered = useMemo(() => {
    if (localCategory === 'All') return products;

    const target = localCategory.toLowerCase().trim();
    return products.filter((p) => {
      const currentCat = p.category?.name?.toLowerCase() || "";
      const parentCat = p.category?.parent?.name?.toLowerCase() || "";
      const grandParentCat = p.category?.parent?.parent?.name?.toLowerCase() || "";

      return (
        currentCat.includes(target) || 
        parentCat.includes(target) || 
        grandParentCat.includes(target)
      );
    });
  }, [localCategory, products]);

  return (
    <section className="w-full space-y-8">
      {/* --- GRID HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Curated_Selection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase italic tracking-tighter leading-none">
            {localCategory === 'All' ? title : localCategory}
          </h2>
        </div>

        {/* --- PILL NAVIGATION --- */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setLocalCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                localCategory === cat 
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-xl scale-105' 
                  : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* --- GRID DISPLAY ENGINE --- */}
      {loading ? (
        <div className={className || "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-zinc-50 rounded-[2.5rem] animate-pulse border border-zinc-100 flex items-center justify-center">
                <Loader2 className="animate-spin text-zinc-200" size={24} />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        /* 🚀 The "Anti-Squash" Grid: Uses passed className or fallback */
        <div className={className || "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"}>
          {filtered.map((product) => (
            <div key={product.id} className="min-w-0"> {/* min-w-0 prevents text-crushing in CSS grid */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        /* --- EMPTY STATE --- */
        <div className="flex flex-col items-center justify-center py-32 space-y-6 border border-dashed border-zinc-200 rounded-[3rem] bg-zinc-50/50">
          <div className="p-8 bg-white rounded-full shadow-sm border border-zinc-100 text-zinc-200">
            <PackageOpen size={40} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Inventory_Empty
            </p>
            <p className="text-[9px] font-bold text-zinc-300 uppercase">No items found in {localCategory}</p>
          </div>
        </div>
      )}
    </section>
  );
}