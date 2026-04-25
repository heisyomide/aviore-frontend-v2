'use client';

import { useMemo } from 'react';
import { Star } from 'lucide-react';

interface ProductInfoProps {
  title?: string;
  subTitle?: string;
  price?: number | string | null;
  originalPrice?: number | string | null;
  discount?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
}

export function ProductInfo({
  title = "Product Title",
  subTitle = "",
  price = 0,
  originalPrice = 0,
  discount = 0,
  rating = 0,
  reviewCount = 0,
}: ProductInfoProps) {

  /* ================= SAFE CONVERSION ================= */
  // Moved logic into a more stable internal helper
  const parseValue = (val: any): number => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (typeof val === 'string') {
      const parsed = parseFloat(val.replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  /* ================= MEMOIZED DATA ================= */
  const data = useMemo(() => {
    const current = parseValue(price);
    const original = parseValue(originalPrice);
    const safeRating = Math.max(0, parseValue(rating));
    const safeReviews = Math.max(0, parseValue(reviewCount));
    
    const savingsAmount = original > current ? original - current : 0;
    const computedDiscount = discount && discount > 0 
      ? discount 
      : original > 0 ? Math.round((savingsAmount / original) * 100) : 0;

    return {
      current,
      original,
      safeRating,
      safeReviews,
      savingsAmount,
      computedDiscount,
    };
  }, [price, originalPrice, discount, rating, reviewCount]);

  /* ================= UI FORMATTERS ================= */
  const format = (num: number) => num.toLocaleString('en-NG');

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
            {/* SAFE GUARD HERE: Ensure toFixed is called on a number */}
            {(data.safeRating ?? 0).toFixed(1)}
          </span>
          <span className="text-[11px] text-zinc-400">
            ({format(data.safeReviews)} reviews)
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
          {title || "Product Title"}
        </h1>
        {subTitle && (
          <p className="text-zinc-500 font-medium text-lg italic">
            {subTitle}
          </p>
        )}
      </div>

      {/* Price Section */}
      <div className="flex items-baseline gap-4 pt-2">
        <span className="text-4xl font-bold text-[#A4143D] tracking-tighter">
          ₦{format(data.current)}
        </span>

        {data.original > data.current && (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-400 line-through font-medium">
              ₦{format(data.original)}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">
              You save ₦{format(data.savingsAmount)} ({data.computedDiscount}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}