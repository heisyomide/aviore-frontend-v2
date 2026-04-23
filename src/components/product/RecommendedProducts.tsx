'use client';

import { ProductCard } from './ProductCard';

interface RecommendedProductsProps {
  products: any[];
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  return (
    <div className="mt-32 mb-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">You May Also Like</h2>
          <p className="text-zinc-400 text-sm mt-1">Curated selections based on your style.</p>
        </div>
        <button className="text-[11px] font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-600 hover:border-zinc-300 transition-all">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <div key={product.id} className="animate-in fade-in zoom-in-95 duration-700">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}