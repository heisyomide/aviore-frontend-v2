'use client';

import { ProductGrid } from '../product/ProductGrid';

interface StoreCollectionsProps {
  title: string;
  products: any[];
}

export function StoreCollections({
  title,
  products,
}: StoreCollectionsProps) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-2xl font-black tracking-tight">
          {title}
        </h3>

        <button className="text-sm font-bold text-[#A4143D]">
          View All
        </button>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}