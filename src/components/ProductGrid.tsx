'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from './product/ProductCard';

// Standardized categories for the filter bar
const CATEGORIES = ['All', 'Home & Kitchen', 'Beauty & Health', 'Sports & Outdoors', 'Electronics', 'Men\'s Clothing'];

interface ProductGridProps {
  title?: string; // Optional: Grid might be used inside a row with its own title
  products: any[];
  className?: string; // Correctly added and used below
}

export function ProductGrid({ title, products, className = "" }: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full">
      {/* 🚀 1. CONDITIONAL HEADER: Only shows if a title is provided */}
      {title && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-zinc-100 pb-6">
          <div className="space-y-1">
            <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em]">Curated_Selection</span>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900">{title}</h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg' 
                    : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 🚀 2. DYNAMIC GRID ENGINE */}
      {/* If className is passed from ProductRow, it overrides the default responsive grid */}
      {products.length > 0 ? (
        <div className={className || "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10"}>
          {products.map((product) => (
            <div key={product.id} className="w-full min-w-0">
               <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center border border-dashed border-zinc-200 rounded-[2.5rem] bg-zinc-50/50">
          <p className="text-zinc-400 font-bold italic uppercase text-[10px] tracking-[0.2em] text-center">
            Zero_Inventory_Detected_In_{activeCategory.replace(' ', '_')}
          </p>
        </div>
      )}
    </div>
  );
}