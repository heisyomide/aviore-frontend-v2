'use client';

import { useMemo } from 'react';
import { ProductCard } from './ProductCard';

interface RecommendedProductsProps {
  products?: any[] | null;
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  // 1. Guard against non-array inputs
  const safeProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => p !== null && typeof p === 'object');
  }, [products]);

  // 2. Hide section if empty
  if (safeProducts.length === 0) return null;

  return (
    <div className="mt-32 mb-20">
      <div className="flex items-end justify-between mb-10 px-4 sm:px-0">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">You May Also Like</h2>
          <p className="text-zinc-400 text-sm mt-1">Curated selections based on your style.</p>
        </div>
        <button 
          type="button"
          className="text-[11px] font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-600 hover:border-zinc-300 transition-all"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {safeProducts.map((product, idx) => (
          <div 
            key={product.id || `rec-${idx}`} 
            className="animate-in fade-in zoom-in-95 duration-700"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}