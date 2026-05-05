'use client';

import { useMemo } from 'react';
import { Star } from 'lucide-react';

interface ProductInfoProps {
  title: string;
  price: number | string;           // Base product price (fallback)
  selectedVariant: any | null;
  rating?: number;
  reviewCount?: number;
}

export function ProductInfo({
  title,
  price,
  selectedVariant,
  rating = 0,
  reviewCount = 0,
}: ProductInfoProps) {

const data = useMemo(() => {
  const basePrice = Number(price) || 0;

  const currentPrice =
    selectedVariant?.price !== undefined
      ? Number(selectedVariant.price)
      : basePrice;

  const stock = selectedVariant?.stock ?? 0;

  const isDiscounted = basePrice > currentPrice;

  return {
    currentPrice: Math.max(0, currentPrice),
    originalPrice: Math.max(0, basePrice),
    isDiscounted,
    savings: Math.max(0, basePrice - currentPrice),
    percent:
      basePrice > 0
        ? Math.round(((basePrice - currentPrice) / basePrice) * 100)
        : 0,
    isLowStock: stock > 0 && stock <= 5,
    isOutOfStock: stock === 0,
  };
}, [price, selectedVariant]);

  const format = (num: number) => num.toLocaleString('en-NG');

  return (
    <div className="space-y-6">
      {/* Stock Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
          {data.isOutOfStock ? (
            <span className="text-red-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Out of Stock
            </span>
          ) : data.isLowStock ? (
            <span className="text-orange-500 flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Only {selectedVariant?.stock} Left
            </span>
          ) : (
            <span className="text-emerald-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> In Stock
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold text-zinc-900">
            {Number(rating).toFixed(1)}
          </span>
          <span className="text-[11px] text-zinc-400">
            ({reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none uppercase">
          {title}
        </h1>
{selectedVariant && (
  <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-bold text-blue-600">
    {[selectedVariant.color, selectedVariant.size]
      .filter(Boolean)
      .join(' • ')}
  </div>
)}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-4 pt-2">
        <span className="text-5xl font-black text-[#A4143D] tracking-tighter">
          ₦{format(data.currentPrice)}
        </span>

        {data.isDiscounted && (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-400 line-through">
              ₦{format(data.originalPrice)}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              Save {data.percent}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}