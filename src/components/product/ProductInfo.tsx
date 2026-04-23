'use client';

import { Star } from 'lucide-react';

interface ProductInfoProps {
  title: string;
  subTitle?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
}

export function ProductInfo({ 
  title, 
  subTitle, 
  price, 
  originalPrice, 
  discount,
  rating = 4.8,
  reviewCount = 128
}: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* 1. Status & Social Proof */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-bold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> In Stock
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold text-zinc-900">{rating}</span>
          <span className="text-[11px] text-zinc-400">({reviewCount} reviews)</span>
        </div>
      </div>

      {/* 2. Title Section */}
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 leading-tight">
          {title}
        </h1>
        <p className="text-zinc-500 font-medium text-lg italic">
          {subTitle || "Designer Selection"}
        </p>
      </div>

      {/* 3. Price Display */}
      <div className="flex items-baseline gap-4 pt-2">
        <span className="text-4xl font-bold text-[#A4143D] tracking-tighter">
          ₦{price.toLocaleString()}
        </span>
        {originalPrice && (
          <div className="flex flex-col">
            <span className="text-sm text-zinc-400 line-through font-medium">
              ₦{originalPrice.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">
              You save ₦{(originalPrice - price).toLocaleString()} ({discount}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}