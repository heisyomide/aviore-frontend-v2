'use client';

import { Link } from 'lucide-react';
import { ProductCard } from './product/ProductCard';

interface FeaturedProductsProps {
  products: any[];
  title?: string;
}

export function FeaturedProducts({ products, title = "Featured & Trending" }: FeaturedProductsProps) {
  // Safety check: if no products exist yet, don't render a ghost section
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12 bg-white">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
            {title}
          </h2>
          <div className="h-1 w-12 bg-[#A4143D]" />
        </div>
        <Link 
          href="/shop" 
          className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#A4143D] transition-colors"
        >
          View_All_Artifacts
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}