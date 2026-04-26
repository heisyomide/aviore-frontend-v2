'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, ImageOff, Truck } from 'lucide-react';

import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

import {
  safeNumber,
  safeString,
  formatMoney
} from '@/src/utils/safe';

export function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

  const data = useMemo(() => {
    const price = safeNumber(product?.price);

    const image =
      product?.variants?.[0]?.images?.[0]?.imageUrl ||
      product?.images?.[0]?.imageUrl ||
      product?.image;

    return {
      id: safeString(product?.id),
      name: safeString(product?.title, 'Product'),
      category: safeString(product?.category?.name, 'Premium Quality'),
      origin: safeString(product?.origin, 'Local'),
      price,
      oldPrice: safeNumber(product?.oldPrice),
      stock: safeNumber(product?.stock),
      rating: safeNumber(product?.averageRating ?? product?.rating),
      reviewCount: safeNumber(product?.reviewCount),
      discount: safeNumber(product?.discount),
      deliveryMin: product?.deliveryMin,
      deliveryMax: product?.deliveryMax,
      image: image
        ? image.startsWith('http')
          ? image
          : `${apiBase}/uploads/${image}`
        : '/placeholder.png',
      vendorId: safeString(product?.vendorId),
    };
  }, [product, apiBase]);

  const isHearted =
    mounted && data.id ? isWishlisted?.(data.id) : false;

  const navigate = () => {
    if (data.id) router.push(`/product/${data.id}`);
  };

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    addItem({
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image,
      vendorId: data.vendorId,
      stock: data.stock,
      quantity: 1,
    });
  };

  const wishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist?.(data);
  };

  return (
    <div
      onClick={navigate}
      className="group bg-[#fafafa] rounded-2xl overflow-hidden border border-zinc-100 hover:shadow-md transition"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] bg-zinc-100">
        {data.image !== '/placeholder.png' ? (
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-300">
            <ImageOff size={28} />
          </div>
        )}

        {/* Discount */}
        {data.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] px-2 py-1 rounded-md font-semibold">
            -{data.discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={wishlist}
          className="absolute top-3 right-3 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow"
        >
          <Heart
            size={18}
            fill={isHearted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Quick Add */}
        <button
          onClick={quickAdd}
          className="absolute bottom-3 right-3 h-11 w-11 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ShoppingBag size={16} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-zinc-900">
          {data.name}
        </h3>

        {/* META */}
        <p className="text-xs text-zinc-500">
          {data.category} •{' '}
          <span className="text-green-600 font-medium">
            {data.origin}
          </span>
        </p>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-bold text-lg">
            {formatMoney(data.price)}
          </span>

          {data.oldPrice > data.price && (
            <span className="text-xs line-through text-zinc-400">
              {formatMoney(data.oldPrice)}
            </span>
          )}
        </div>

        {/* RATING + STOCK */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-600">
            ⭐ {data.rating} ({data.reviewCount})
          </span>

          <span className="text-green-600 font-medium">
            {data.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* DELIVERY */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 border-t pt-3">
          <Truck size={14} />
          <span>
            {data.origin === 'Local'
              ? `Fast Local Delivery • ${data.deliveryMin || 1}-${data.deliveryMax || 3} days`
              : `Ships Worldwide • ${data.deliveryMin || 5}-${data.deliveryMax || 10} days`}
          </span>
        </div>
      </div>
    </div>
  );
}