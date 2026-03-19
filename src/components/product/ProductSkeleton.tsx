// src/components/product/ProductSkeleton.tsx
import { Skeleton } from "../ui/Skeleton";

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-100">
      {/* Image Area */}
      <Skeleton className="aspect-square w-full rounded-lg mb-3" />
      
      {/* Title Lines */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      {/* Price Area */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center border-t border-gray-50 pt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}