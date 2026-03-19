// src/components/product/SkeletonGrid.tsx
import { ProductSkeleton } from "./ProductSkeleton";

export function SkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
      {Array(count).fill(null).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}