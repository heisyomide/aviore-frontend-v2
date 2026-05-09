'use client';

import React, { useState, useMemo, memo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Truck, ImageOff, Star } from 'lucide-react';

import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { safeNumber, safeString, formatMoney } from '@/src/utils/safe';
import toast from 'react-hot-toast';

/* ====================== EXACT MATCH PRODUCT CARD ====================== */
export function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => setMounted(true), []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

const data = useMemo(() => {
  const variants = product?.variants || [];

  // PRICE
  const variantPrices = variants
    .map((v: any) => Number(v?.price) || 0)
    .filter((p: number) => p > 0);

  const displayPrice =
    variantPrices.length > 0
      ? Math.min(...variantPrices)
      : Number(product?.price || 0);

  // STOCK
  const totalStock =
    variants.length > 0
      ? variants.reduce(
          (sum: number, v: any) =>
            sum + (Number(v?.stock) || 0),
          0
        )
      : Number(product?.stock || 0);

  // IMAGE
  const firstVariantImage =
    variants?.[0]?.images?.[0]?.imageUrl;

  const generalImage =
    product?.images?.[0]?.imageUrl ||
    product?.image;

  const imageUrl =
    firstVariantImage || generalImage;

  const finalImage = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${apiBase}/uploads/${imageUrl.replace(/^\//, '')}`
    : '/placeholder.png';

  return {
    id: safeString(product?.id),
    name: safeString(
      product?.title || product?.name,
      'Product Name'
    ),
    subTitle: safeString(
      product?.subTitle || 'Premium Quality'
    ),
    origin: safeString(
      product?.origin || 'LOCAL'
    ),

    // ✅ FIXED
    price: displayPrice,
    stock: totalStock,

    oldPrice: safeNumber(
      product?.oldPrice || displayPrice * 1.2
    ),

    rating: safeNumber(
      product?.averageRating ||
      product?.rating,
      0
    ),

    reviewCount: safeNumber(
      product?.reviewCount,
      0
    ),

    discount: safeNumber(
      product?.discount,
      15
    ),

    image: finalImage,
    vendorId: safeString(product?.vendorId),
  };
}, [product, apiBase]);

  const isHearted = mounted && data.id ? isWishlisted?.(data.id) : false;

  const handleNavigate = () => data.id && router.push(`/product/${data.id}`);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!data.id) return;

    const firstVariant = product?.variants?.[0];

    addItem({
      id: data.id,
      name: data.name,
      productId: data.id,
      price: data.price,
      image: data.image,
      vendorId: String(product?.vendorId || ''),
      stock: data.stock,
      quantity: 1,
      color: firstVariant?.color,
      size: firstVariant?.size,
      variantId: firstVariant?.id,
    });

    toast.success('Added to cart');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();

    toggleWishlist({
      id: data.id,
      
      name: data.name,
      price: data.price,
      image: data.image,
    });

    toast.success(isHearted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div 
      onClick={handleNavigate}
      className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* 1. IMAGE CONTAINER (Exactly like sample) */}
      <div className="relative aspect-square m-2 rounded-xl bg-zinc-50 overflow-hidden">
        {data.image !== '/placeholder.png' ? (
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300"><ImageOff size={24} /></div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-2 left-2">
          <span className="bg-[#A4143D] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            -{data.discount}%
          </span>
        </div>

        <button
          onClick= {handleWishlist}
          className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-zinc-50 transition-transform active:scale-90"
        >
          <Heart size={14} className={isHearted ? "fill-[#A4143D] text-[#A4143D]" : "text-zinc-400"} />
        </button>

        <button
          onClick= {handleAddToCart}
          className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-zinc-50 transition-transform active:scale-90 hover:text-[#A4143D]"
        >
          <ShoppingCart size={14} className="text-zinc-600" />
        </button>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="p-3 pt-1 space-y-2">
        {/* Title & Subtitle */}
        <div className="space-y-0.5">
          <h3 className="text-[13px] font-bold text-zinc-900 truncate">{data.name}</h3>
          <p className="text-[10px] text-zinc-400 font-medium">
            {data.subTitle} • <span className="text-emerald-600">{data.origin}</span>
          </p>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-[#A4143D]">
            ₦{data.price.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-300 line-through">
            ₦{data.oldPrice.toLocaleString()}
          </span>
        </div>

{/* Rating & Stock/Urgency Row */}
<div className="flex items-center justify-between pt-1 min-h-[20px]">
  
  {/* 1. SEEDED RATING LOGIC */}
  <div className="flex items-center gap-1">
    {data.reviewCount > 0 ? (
      <>
        <Star size={10} className="fill-yellow-400 text-yellow-400" />
        <span className="text-[11px] font-bold text-zinc-800">
          {(data.rating || 4.5).toFixed(1)} 
        </span>
        <span className="text-[10px] text-zinc-400">
          ({data.reviewCount})
        </span>
      </>
    ) : (
      // Badge for new items instead of 0.0
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter bg-zinc-50 px-2 py-0.5 rounded-md">
        New Arrival
      </span>
    )}
  </div>

  {/* 2. DYNAMIC URGENCY LOGIC */}
  <div className="flex flex-col items-end">
    {data.stock > 0 && data.stock <= 5 ? (
      // RED URGENCY: Only shown if stock is critical
      <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter animate-pulse">
        Only {data.stock} Left
      </span>
    ) : data.stock > 0 ? (
      // SUBTLE STOCK: Standard in-stock signal
      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
        In Stock
      </span>
    ) : (
      // SOLD OUT: Greyed out
      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter">
        Out of Stock
      </span>
    )}
  </div>

</div>

        {/* Delivery Footer */}
        <div className="pt-2 border-t border-zinc-50 flex items-center gap-2 text-zinc-500">
          <Truck size={12} className="shrink-0" />
          <span className="text-[10px] font-medium truncate">
            {data.origin === 'LOCAL' ? 'Fast Local Delivery • 1-3 days' : 'Ships Worldwide • 5-10 days'}
          </span>
        </div>
      </div>
    </div>
  );
}