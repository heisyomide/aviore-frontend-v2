'use client';

import { useMemo, useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';

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
  basePrice = 0,
  totalStock,
  selectedVariant,
  rating = 0,
  reviewCount = 0,
}: ProductInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const data = useMemo(() => {
    const variantPrice = Number(selectedVariant?.price);
    const variantStock = Number(selectedVariant?.stock);

    const currentPrice = !isNaN(variantPrice) && variantPrice > 0 ? variantPrice : displayPrice;
    const stock = !isNaN(variantStock) ? variantStock : totalStock;
    const originalPrice = basePrice > 0 ? basePrice : displayPrice;
    const isDiscounted = originalPrice > currentPrice;

    return {
      currentPrice: Math.max(0, currentPrice),
      originalPrice: Math.max(0, originalPrice),
      isDiscounted,
      percent: originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0,
      stock,
      isLowStock: stock > 0 && stock <= 5,
      isOutOfStock: stock === 0,
    };
  }, [selectedVariant, displayPrice, basePrice, totalStock]);

  const format = (num: number) => num.toLocaleString('en-NG');

  return (
    <div className="space-y-4">
      {/* 1. DELIVERY STRIP (Moved to top like Temu for better flow) */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-base animate-pulse">🚚</span>
            <p className="text-[13px] font-bold text-zinc-800">
              Arrives in NG in as little as 7 days
            </p>
          </div>
          <span className="text-zinc-300 text-sm">›</span>
        </div>
      </div>

      {/* 2. TITLE SECTION (The "Demoted" Style Fix) */}
      <div className="relative group">
        <div className="flex items-start justify-between gap-4">
          <h1
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              text-[16px] lg:text-[20px] 
              font-semibold leading-snug text-zinc-900 
              cursor-pointer transition-all duration-300
              ${isExpanded ? 'block' : 'line-clamp-2'}
            `}
          >
            {title}
          </h1>
          
          {/* Arrow toggle for long titles */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {selectedVariant && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
          <span className="text-xs font-semibold text-blue-700">
            {[selectedVariant.color, selectedVariant.size]
              .filter(Boolean)
              .join(' • ')}
          </span>
        </div>
        )}
      </div>

      {/* 3. PRICE SECTION */}
      <div className="flex items-baseline gap-2.5">
        <span className="text-3xl font-bold text-[#A4143D] tracking-tight">
          ₦{format(data.currentPrice)}
        </span>

        {data.isDiscounted && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400 line-through">
              ₦{format(data.originalPrice)}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              -{data.percent}%
            </span>
          </div>
        )}
      </div>

      {/* 4. REVIEWS & STOCK STATUS */}
      <div className="flex items-center gap-4 pt-1 border-t border-zinc-50">
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-zinc-900">{Number(rating).toFixed(1)}</span>
          <span className="text-xs text-zinc-400">({reviewCount})</span>
        </div>

        <div className="h-3 w-px bg-zinc-200" />

        <div className="text-[12px] font-bold">
          {data.isOutOfStock ? (
            <span className="text-red-500">Out of Stock</span>
          ) : (
            <span className="text-emerald-600">In Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}