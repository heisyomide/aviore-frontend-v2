'use client';

import { useMemo } from 'react';
import { Star } from 'lucide-react';

interface ProductInfoProps {
  title: string;
  displayPrice: number;
  basePrice?: number;
  totalStock: number;
  selectedVariant: any | null;
  rating?: number;
  reviewCount?: number;
}

export function ProductInfo({
  title,
  displayPrice,
  basePrice = 0,        // ✅ default
  totalStock,
  selectedVariant,
  rating = 0,
  reviewCount = 0,
}: ProductInfoProps) {

  const data = useMemo(() => {
    const variantPrice = Number(selectedVariant?.price);
    const variantStock = Number(selectedVariant?.stock);

    const currentPrice =
      !isNaN(variantPrice) && variantPrice > 0
        ? variantPrice
        : displayPrice;

    const stock =
      !isNaN(variantStock)
        ? variantStock
        : totalStock;

    const originalPrice =
      basePrice > 0 ? basePrice : displayPrice;

    const isDiscounted = originalPrice > currentPrice;

    return {
      currentPrice: Math.max(0, currentPrice),
      originalPrice: Math.max(0, originalPrice),
      isDiscounted,
      percent:
        originalPrice > 0
          ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
          : 0,
      stock,
      isLowStock: stock > 0 && stock <= 5,
      isOutOfStock: stock === 0,
    };
  }, [selectedVariant, displayPrice, basePrice, totalStock]);

  const format = (num: number) => num.toLocaleString('en-NG');

return (
  <div className="space-y-5">

    {/* STOCK + REVIEWS */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
        {data.isOutOfStock ? (
          <span className="text-red-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Out of Stock
          </span>
        ) : data.isLowStock ? (
          <span className="text-orange-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Only {data.stock} Left
          </span>
        ) : (
          <span className="text-emerald-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            In Stock
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
        <Star
          size={12}
          className="fill-yellow-400 text-yellow-400"
        />

        <span className="text-[11px] font-semibold text-zinc-900">
          {Number(rating).toFixed(1)}
        </span>

        <span className="text-[11px] text-zinc-400">
          ({reviewCount} reviews)
        </span>
      </div>
    </div>

    {/* DELIVERY STRIP */}
    <div className="bg-[#F7F8F9] border border-zinc-200 rounded-2xl overflow-hidden">

      <button
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">

          {/* MOVING TRUCK */}
          <div className="text-emerald-600 text-lg animate-bounce">
            🚚
          </div>

          <div className="text-left">
            <p className="text-sm font-bold text-zinc-900">
              Arrives in NG in as little as 7 days
            </p>

            <p className="text-xs text-zinc-500">
              Fast nationwide delivery
            </p>
          </div>
        </div>

        <span className="text-zinc-400 text-lg">
          ›
        </span>
      </button>
    </div>

/* TITLE */
<div className="space-y-2">

  <div className="flex items-start gap-2">

    <h1
      className="
        flex-1
        text-[15px]
        lg:text-[17px]
        font-medium
        leading-[1.45]
        text-zinc-900
        line-clamp-2
      "
    >
      {title}
    </h1>

    <button
      className="
        shrink-0
        text-zinc-400
        text-lg
        leading-none
        pt-[1px]
      "
    >
      ˅
    </button>
  </div>

  {selectedVariant && (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full">
      <span className="text-[11px] font-medium text-blue-700">
        {[selectedVariant.color, selectedVariant.size]
          .filter(Boolean)
          .join(' • ')}
      </span>
    </div>
  )}
</div>

    {/* PRICE */}
    <div className="flex items-end gap-3 pt-1 flex-wrap">

      <span className="text-[42px] leading-none font-black text-[#A4143D] tracking-tight">
        ₦{format(data.currentPrice)}
      </span>

      {data.isDiscounted && (
        <div className="pb-1">
          <div className="text-sm text-zinc-400 line-through">
            ₦{format(data.originalPrice)}
          </div>

          <div className="text-xs font-bold text-emerald-600">
            Save {data.percent}%
          </div>
        </div>
      )}
    </div>
  </div>
);
}