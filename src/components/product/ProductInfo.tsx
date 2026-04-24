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

  /* ================= SAFE NUMBER ================= */
  const toSafeNumber = (value: any): number => {
    if (value == null) return 0;

    if (typeof value === 'number') {
      return isNaN(value) ? 0 : value;
    }

    if (typeof value === 'string') {
      // Remove currency symbols, commas, spaces
      const cleaned = value.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  };

  /* ================= MEMOIZED VALUES ================= */
  const {
    currentPrice,
    origPrice,
    safeRating,
    safeReviewCount,
    savings,
    discountPercent,
  } = useMemo(() => {
    const currentPrice = toSafeNumber(price);
    const origPrice = toSafeNumber(originalPrice);

    const safeRating = Math.max(0, toSafeNumber(rating));
    const safeReviewCount = Math.max(0, toSafeNumber(reviewCount));

    const savings = origPrice > currentPrice ? origPrice - currentPrice : 0;

    const discountPercent =
      discount && discount > 0
        ? discount
        : origPrice > 0
        ? Math.round((savings / origPrice) * 100)
        : 0;

    return {
      currentPrice,
      origPrice,
      safeRating,
      safeReviewCount,
      savings,
      discountPercent,
    };
  }, [price, originalPrice, discount, rating, reviewCount]);

  /* ================= SAFE FORMATTERS ================= */
  const formatMoney = (value: number) => {
    try {
      return Number(value || 0).toLocaleString();
    } catch {
      return '0';
    }
  };

  const formatNumber = (value: number) => {
    try {
      return Number(value || 0).toLocaleString();
    } catch {
      return '0';
    }
  };

  /* ================= UI ================= */
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
  {(Number(rating) || 0).toFixed(1)}
</span>

          <span className="text-[11px] text-zinc-400">
            ({formatNumber(safeReviewCount)} reviews)
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
          {title}
        </h1>

        {subTitle ? (
          <p className="text-zinc-500 font-medium text-lg italic">
            {subTitle}
          </p>
        ) : null}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-4 pt-2">
        <span className="text-4xl font-bold text-[#A4143D] tracking-tighter">
          ₦{formatMoney(currentPrice)}
        </span>

        {origPrice > currentPrice && (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-400 line-through font-medium">
              ₦{formatMoney(origPrice)}
            </span>

            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">
              You save ₦{formatMoney(savings)} ({discountPercent}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 