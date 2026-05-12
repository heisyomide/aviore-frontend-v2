import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products?: any[] | null;
}

export function ProductGrid({ products }: ProductGridProps) {
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
    /**
     * 🔥 THE TEMU FIX: 
     * 1. gap-2 on mobile (approx 8px) vs gap-3+ on desktop.
     * 2. Removed heavy side padding to utilize screen width.
     */
    <div className="
      grid 
      grid-cols-2 
      sm:grid-cols-3 
      md:grid-cols-4 
      lg:grid-cols-5 
      xl:grid-cols-6 
      2xl:grid-cols-7 
      gap-x-2 gap-y-4 
      md:gap-4 
      lg:gap-6 
      px-2 md:px-0
    ">
      {safeProducts.map((p, idx) => (
        <ProductCard 
          key={p.id || `grid-item-${idx}`} 
          product={p} 
        />
      ))}
    </div>
  );
}