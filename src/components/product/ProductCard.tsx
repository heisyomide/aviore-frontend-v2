'use client';

import React, { useState, useMemo, memo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, ImageOff, Zap } from 'lucide-react';

import { Rating } from '../ui/Rating';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

import {
  safeNumber,
  safeString,
  safeArray,
  safeImage,
  formatMoney
} from '@/src/utils/safe';

/* ====================== MODERN PRODUCT CARD ====================== */
export function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => setMounted(true), []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

  const data = useMemo(() => {
    const price = safeNumber(product?.price);
    const rating = safeNumber(product?.averageRating ?? product?.rating ?? 0);
    const firstImg = product?.variants?.[0]?.images?.[0]?.imageUrl || 
                     product?.images?.[0]?.imageUrl || 
                     product?.image;

    return {
      id: safeString(product?.id),
      name: safeString(product?.title || product?.name, 'Product'),
      category: safeString(product?.category?.name, 'New Arrival'),
      price,
      oldPrice: safeNumber(product?.oldPrice),
      stock: safeNumber(product?.stock),
      rating,
      reviewCount: safeNumber(product?.reviewCount),
      discount: safeNumber(product?.discount),
      image: firstImg ? (firstImg.startsWith('http') ? firstImg : `${apiBase}/uploads/${firstImg}`) : '/placeholder.png',
      vendorId: safeString(product?.vendorId),
    };
  }, [product, apiBase]);

  const isHearted = mounted && data.id ? isWishlisted?.(data.id) : false;

  const handleNavigate = () => data.id && router.push(`/product/${data.id}`);

  return (
    <div 
      onClick={handleNavigate}
      className="group relative flex flex-col bg-white transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-[2rem] overflow-hidden border border-zinc-50"
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        {data.image !== '/placeholder.png' ? (
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300">
            <ImageOff size={32} strokeWidth={1.5} />
          </div>
        )}

        {/* TOP OVERLAYS */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          {data.discount > 0 ? (
            <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter">
              -{data.discount}%
            </span>
          ) : <div />}
          
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(data); }}
            className={`h-10 w-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
              isHearted ? 'bg-[#A4143D] text-white' : 'bg-white/80 text-zinc-900 shadow-sm hover:bg-white'
            }`}
          >
            <Heart size={18} fill={isHearted ? 'currentColor' : 'none'} strokeWidth={2} />
          </button>
        </div>

        {/* BOTTOM QUICK ADD (Slides up on Hover) */}
        <div className="absolute inset-x-3 bottom-3 translate-y-12 transition-transform duration-500 group-hover:translate-y-0 hidden md:block">
          <button
            onClick={(e) => { e.stopPropagation(); addItem({...data, quantity: 1}); }}
            className="w-full bg-black/90 hover:bg-black backdrop-blur-md text-white py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {data.category}
          </p>
          <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-[#A4143D] transition-colors">
            {data.name}
          </h3>
        </div>

        {/* PRICE & RATING */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {data.oldPrice > data.price && (
              <span className="text-[10px] text-zinc-300 line-through font-medium">
                ₦{data.oldPrice.toLocaleString()}
              </span>
            )}
            <span className="text-lg font-bold text-zinc-950 tracking-tighter">
              ₦{data.price.toLocaleString()}
            </span>
          </div>
          
          <Rating rate={data.rating} count={data.reviewCount} />
        </div>

        {/* STOCK STATUS PILL */}
        <div className="pt-2 border-t border-zinc-50 flex items-center justify-between">
          <StockIndicator stock={data.stock} />
          <div className="md:hidden">
            <button 
              onClick={(e) => { e.stopPropagation(); addItem({...data, quantity: 1}); }}
              className="h-9 w-9 bg-zinc-950 text-white rounded-xl flex items-center justify-center shadow-lg shadow-zinc-200"
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const StockIndicator = ({ stock }: { stock: number }) => {
  if (stock <= 0) return <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Out of Stock</span>;
  if (stock < 5) return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">Low Stock</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Available</span>
    </div>
  );
};