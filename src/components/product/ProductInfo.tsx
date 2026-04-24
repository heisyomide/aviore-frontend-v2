'use client';

import { Star } from 'lucide-react';

interface ProductInfoProps {
  title?: string;
  subTitle?: string;
  price?: number | string | null | undefined;
  originalPrice?: number | string | null | undefined;
  discount?: number;
  rating?: number;
  reviewCount?: number;
}

export function ProductInfo({
  title = "Product Title",
  subTitle = "",
  price = 0,
  originalPrice = 0,
  discount = 0,
  rating = 4.8,
  reviewCount = 128,
}: ProductInfoProps) {

  // Ultra-safe number conversion
  const currentPrice = toSafeNumber(price);
  const origPrice = toSafeNumber(originalPrice);

  const savings = origPrice > currentPrice ? origPrice - currentPrice : 0;
  const discountPercent = discount > 0 
    ? discount 
    : origPrice > 0 
      ? Math.round((savings / origPrice) * 100) 
      : 0;

  return (
    <div className="space-y-6">
      {/* Status & Rating */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-bold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          In Stock
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold text-zinc-900">
            {rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-zinc-400">
            ({Number(reviewCount).toLocaleString()} reviews)
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
          {title}
        </h1>
        {subTitle && (
          <p className="text-zinc-500 font-medium text-lg italic">
            {subTitle}
          </p>
        )}
      </div>

      {/* Price - Most Defensive Section */}
      <div className="flex items-baseline gap-4 pt-2">
        <span className="text-4xl font-bold text-[#A4143D] tracking-tighter">
          ₦{currentPrice.toLocaleString()}
        </span>

        {origPrice > currentPrice && (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-400 line-through font-medium">
              ₦{origPrice.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">
              You save ₦{savings.toLocaleString()} ({discountPercent}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====================== Safe Helper ====================== */
function toSafeNumber(value: any): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}