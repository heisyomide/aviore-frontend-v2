'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Truck, ImageOff, Star } from 'lucide-react';

import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import toast from 'react-hot-toast';

export function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  // Smart data extraction with proper variant support
  const data = useMemo(() => {
    // Price: Use lowest variant price, fallback to base price
    const variantPrices = (product?.variants || []).map((v: any) => 
      Number(v?.price) || 0
    ).filter((p: number) => p > 0);

    const displayPrice = variantPrices.length > 0 
      ? Math.min(...variantPrices) 
      : Number(product?.price) || 0;

    // Stock: Sum from all variants, fallback to base stock
    const totalStock = (product?.variants || []).reduce((sum: number, v: any) => {
      return sum + (Number(v?.stock) || 0);
    }, 0) || Number(product?.stock) || 0;

    // Image priority: Variant image > General image
    const firstVariantImage = product?.variants?.[0]?.images?.[0]?.imageUrl;
    const generalImage = product?.images?.[0]?.imageUrl || product?.image;

    const imageUrl = firstVariantImage || generalImage;
    const finalImage = imageUrl 
      ? (imageUrl.startsWith('http') 
          ? imageUrl 
          : `${apiBase}/uploads/${imageUrl.replace(/^\//, '')}`)
      : '/placeholder.png';

    return {
      id: String(product?.id || ''),
      name: String(product?.title || product?.name || 'Product'),
      price: displayPrice,
      stock: totalStock,
      rating: Number(product?.averageRating || product?.rating || 0),
      reviewCount: Number(product?.reviewCount || 0),
      image: finalImage,
      origin: String(product?.origin || 'LOCAL'),
      category: String(product?.category?.name || 'General'),
    };
  }, [product, apiBase]);

  const isHearted = mounted && data.id ? isWishlisted(data.id) : false;

  const handleNavigate = () => {
    if (data.id) router.push(`/product/${data.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!data.id) return;

    const firstVariant = product?.variants?.[0];

    addItem({
      id: data.id,
      name: data.name,
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
      className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.985]"
    >
      {/* Image Container */}
      <div className="relative aspect-square m-2 rounded-xl bg-zinc-50 overflow-hidden">
        {data.image !== '/placeholder.png' ? (
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-contain transition-transform group-hover:scale-105 duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300">
            <ImageOff size={32} />
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm border border-white/70 hover:bg-white transition-all active:scale-90 z-10"
        >
          <Heart 
            size={15} 
            className={isHearted ? "fill-[#A4143D] text-[#A4143D]" : "text-zinc-500"} 
          />
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-md border border-zinc-100 hover:bg-[#A4143D] hover:text-white transition-all active:scale-90 z-10"
        >
          <ShoppingCart size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 line-clamp-2 leading-tight">
            {data.name}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1">
            {data.origin} • {data.category}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-[#A4143D]">
            ₦{data.price.toLocaleString()}
          </span>
          {data.stock > 0 && data.stock <= 10 && (
            <span className="text-[10px] font-bold text-red-500">
              Only {data.stock} left
            </span>
          )}
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-zinc-700">
              {data.rating.toFixed(1)}
            </span>
            {data.reviewCount > 0 && (
              <span className="text-zinc-400">({data.reviewCount})</span>
            )}
          </div>

          <div className={`font-medium ${data.stock > 0 ? 'text-emerald-600' : 'text-zinc-400'}`}>
            {data.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>
      </div>
    </div>
  );
}