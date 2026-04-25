import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products?: any[] | null;
}

export function ProductGrid({ products }: ProductGridProps) {
  // 1. Guard against non-array or empty data
  const safeProducts = Array.isArray(products) 
    ? products.filter(p => p && typeof p === 'object') 
    : [];

  if (safeProducts.length === 0) {
    return (
      <div className="w-full py-20 text-center border-2 border-dashed border-zinc-100 rounded-[2.5rem]">
        <p className="text-zinc-400 text-sm font-medium">No products found in this collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
      {safeProducts.map((p, idx) => (
        <ProductCard 
          key={p.id || `grid-item-${idx}`} 
          product={p} 
        />
      ))}
    </div>
  );
}