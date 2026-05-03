'use client';

import { useMemo } from 'react';
import { Star } from 'lucide-react';

interface ProductInfoProps {
  title: string;
  subTitle?: string;
  price: number | string; // The original product price
  selectedVariant: any | null; // The currently picked Matrix row
  rating?: number;
  reviewCount?: number;
}

export function ProductInfo({
  title,
  subTitle = "",
  price,
  selectedVariant,
  rating = 0,
  reviewCount = 0,
}: ProductInfoProps) {

  const parseValue = (val: any): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^\d.-]/g, '')) || 0;
  };

  const data = useMemo(() => {
    // 🔥 LOGIC: Use variant price if it exists, otherwise fallback to basePrice
    const variantPrice = parseValue(selectedVariant?.price);
    const currentPrice = variantPrice > 0 ? variantPrice : parseValue(price);
    
    // If you have an original/discount price on the variant, you'd map it here too
    const original = parseValue(price); 
    const isDiscounted = original > currentPrice;

    return {
      currentPrice,
      originalPrice: original,
      isDiscounted,
      savings: original - currentPrice,
      percent: Math.round(((original - currentPrice) / original) * 100),
      isLowStock: selectedVariant?.stock > 0 && selectedVariant?.stock < 5,
      isOutOfStock: selectedVariant?.stock === 0
    };
  }, [price, selectedVariant]);

  const format = (num: number) => num.toLocaleString('en-NG');

  return (
    <div className="space-y-6">
      {/* Status Indicators */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
          {data.isOutOfStock ? (
            <span className="text-red-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Out of Stock
            </span>
          ) : data.isLowStock ? (
            <span className="text-orange-500 flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Only {selectedVariant.stock} Left
            </span>
          ) : (
            <span className="text-emerald-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> In Stock
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold text-zinc-900">{Number(rating).toFixed(1)}</span>
          <span className="text-[11px] text-zinc-400">({format(reviewCount)} reviews)</span>
        </div>
      </div>

      {/* Title & Badge */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none uppercase">
          {title}
        </h1>
        {selectedVariant && (
          <div className="inline-block px-2 py-1 bg-blue-50 border border-blue-100 rounded text-[10px] font-black text-blue-600 uppercase">
            {selectedVariant.color} / {selectedVariant.size}
          </div>
        )}
      </div>

      {/* Price Section - Swaps instantly with Variant selection */}
      <div className="flex items-baseline gap-4 pt-2">
        <span className="text-5xl font-black text-[#A4143D] tracking-tighter transition-all duration-300">
          ₦{format(data.currentPrice)}
        </span>

        {data.isDiscounted && (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-400 line-through font-bold">
              ₦{format(data.originalPrice)}
            </span>
            <span className="text-[10px] font-black text-emerald-600 uppercase">
              Save ₦{format(data.savings)} ({data.percent}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
