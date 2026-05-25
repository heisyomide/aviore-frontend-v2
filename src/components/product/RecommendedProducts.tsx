'use client';

import { useMemo } from 'react';
import { ProductCard } from './ProductCard';

interface RecommendedProductsProps {
  products?: any[] | null;
  allProducts?: any[] | null;
  currentProductId?: string;
}

export function RecommendedProducts({
  products,
  allProducts,
  currentProductId,
}: RecommendedProductsProps) {

  const mergedProducts = useMemo(() => {
    // 1. Safety normalization and filter out the current item from recommended list
    const recommended = Array.isArray(products)
      ? products.filter((p) => p && p.id !== currentProductId)
      : [];

    // 2. Safety normalization and filter out the current item from general fallback list
    const general = Array.isArray(allProducts)
      ? allProducts.filter((p) => p && p.id !== currentProductId)
      : [];

    // 3. Use a Map to merge and keep unique products (retaining recommended order)
    const uniqueMap = new Map();

    // Loop through recommended items first (high priority)
    recommended.forEach((product) => {
      uniqueMap.set(product.id, product);
    });

    // Backfill with general products until the grid looks full
    general.forEach((product) => {
      if (!uniqueMap.has(product.id)) {
        uniqueMap.set(product.id, product);
      }
    });

    // 4. Extract array values and slice down to a clean number (e.g., 4 or 8 items)
    // This prevents rendering hundreds of background catalog items at once
    return Array.from(uniqueMap.values()).slice(0, 4);

  }, [products, allProducts, currentProductId]);

  if (mergedProducts.length === 0) return null;

  return (
    <div className="mt-32 mb-20">
      <div className="flex items-end justify-between mb-10 px-4 sm:px-0">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            You May Also Like
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            Curated selections based on your style.
          </p>
        </div>

        <button
          type="button"
          className="text-[11px] font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-600 hover:border-zinc-300 transition-all"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {mergedProducts.map((product, idx) => (
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