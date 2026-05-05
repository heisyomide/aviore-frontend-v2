'use client';

import { useMemo } from 'react';
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Variant {
  id: string;
  color: string;
  size: string;
  price: string | number;
  stock: number;
}

interface ProductInfoProps {
  title: string;
  basePrice: number | string;      // maps to product.price (the old "fallback")
  displayPrice: number | string;   // maps to product.displayPrice (the actual UI price)
  totalStock: number;              // maps to product.totalStock
  selectedVariant: Variant | null;
  rating?: number;
  reviewCount?: number;
}

const formatCurrency = (num: number) => 
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(num).replace('NGN', '₦');

export function ProductInfo({
  title,
  basePrice,
  displayPrice,
  totalStock,
  selectedVariant,
  rating = 0,
  reviewCount = 0,
}: ProductInfoProps) {

  const productData = useMemo(() => {
    // 1. Determine active price: Use variant price if selected, otherwise displayPrice
    const currentPrice = selectedVariant 
      ? Number(selectedVariant.price) 
      : Number(displayPrice);

    // 2. Determine original price for discount calculation
    const original = Number(basePrice) > 0 ? Number(basePrice) : currentPrice;

    // 3. Determine stock status
    const activeStock = selectedVariant ? selectedVariant.stock : totalStock;

    return {
      currentPrice,
      originalPrice: original,
      isDiscounted: original > currentPrice && currentPrice > 0,
      percentOff: original > 0 ? Math.round(((original - currentPrice) / original) * 100) : 0,
      stock: activeStock,
      isOutOfStock: activeStock <= 0,
      isLowStock: activeStock > 0 && activeStock <= 5,
    };
  }, [basePrice, displayPrice, totalStock, selectedVariant]);

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em]">
          {productData.isOutOfStock ? (
            <span className="text-red-500 flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-md">
              <AlertCircle size={12} /> Out of Stock
            </span>
          ) : productData.isLowStock ? (
            <span className="text-orange-600 flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-md animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-600" /> 
              Only {productData.stock} Left
            </span>
          ) : (
            <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md">
              <CheckCircle2 size={12} /> In Stock
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold text-zinc-900">{Number(rating).toFixed(1)}</span>
          <span className="text-[11px] text-zinc-400">({reviewCount})</span>
        </div>
      </div>

      {/* Product Title & Badge */}
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-[0.9] uppercase italic">
          {title}
        </h1>
        
        {selectedVariant && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
            <span className="opacity-50">Selected:</span>
            <span>{selectedVariant.color}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>Size {selectedVariant.size}</span>
          </div>
        )}
      </div>

      {/* Pricing Engine */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-5xl font-black text-[#A4143D] tracking-tighter leading-none">
            {formatCurrency(productData.currentPrice)}
          </span>
        </div>

        {productData.isDiscounted && (
          <div className="flex flex-col justify-center border-l border-zinc-200 pl-4">
            <span className="text-sm text-zinc-400 line-through decoration-zinc-300">
              {formatCurrency(productData.originalPrice)}
            </span>
            <span className="text-xs font-black text-emerald-600 uppercase">
              Save {productData.percentOff}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}