'use client';

import React, { useState, useMemo, memo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ImageOff, Heart, Truck } from 'lucide-react';

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

/* ====================== TYPES ====================== */
interface Product {
  id?: string;
  title?: string;
  name?: string;
  price?: any;
  oldPrice?: any;
  stock?: any;
  discount?: any;
  averageRating?: any;
  rating?: any;
  reviewCount?: any;
  reviews?: any[];
  vendorId?: string;
  image?: any;
  images?: any[];
  variants?: any[];
  origin?: string;
  deliveryMin?: any;
  deliveryMax?: any;
  deliveryUnit?: string;
}

/* ====================== IMAGE RESOLVER ====================== */
const resolveImage = (product: Product, apiBase: string) => {
  const variantImg = product?.variants?.[0]?.images?.[0];

  const raw =
    safeImage(variantImg) ||
    safeImage(product?.image) ||
    safeImage(safeArray(product?.images)[0]);

  if (!raw) return '/placeholder.png';

  return raw.startsWith('http')
    ? raw
    : `${apiBase}/uploads/${raw.replace(/^\//, '')}`;
};

/* ====================== MAIN ====================== */
export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => setMounted(true), []);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

  /* ================= SAFE DATA ================= */
  const data = useMemo(() => {
    const price = safeNumber(product?.price);
    const oldPrice = safeNumber(product?.oldPrice);
    const stock = safeNumber(product?.stock);

    const rating = safeNumber(
      product?.averageRating ?? product?.rating ?? 0
    );

    const reviewCount = Array.isArray(product?.reviews)
      ? product.reviews.length
      : safeNumber(product?.reviewCount);

    return {
      id: safeString(product?.id),
      name: safeString(product?.title || product?.name, 'Unknown Product'),
      price,
      oldPrice,
      stock,
      rating,
      reviewCount,
      discount: safeNumber(product?.discount),
      image: resolveImage(product, apiBase),
      vendorId: safeString(product?.vendorId),
    };
  }, [product, apiBase]);

  const isHearted = mounted && data.id
    ? isWishlisted?.(data.id)
    : false;

  /* ================= HANDLERS ================= */
  const handleNavigate = () => {
    if (data.id) router.push(`/product/${data.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!data.id || !data.vendorId) {
      console.error('Invalid cart data:', data);
      return;
    }

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

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!data.id) return;

    try {
      await toggleWishlist?.({
        id: data.id,
        name: data.name,
        price: data.price,
        image: data.image,
      });
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      onClick={handleNavigate}
      className="group relative cursor-pointer rounded-2xl bg-white p-3 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl border border-transparent hover:border-gray-100"
    >
      <ProductImageSection
        image={data.image}
        name={data.name}
        discount={data.discount}
        isHearted={isHearted}
        onQuickAdd={handleQuickAdd}
        onWishlist={handleWishlist}
      />

      <div className="space-y-3 px-1 mt-3">
        <h3 className="line-clamp-2 h-8 text-[11px] font-black uppercase tracking-tight text-gray-500 group-hover:text-black">
          {data.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black italic text-[#A4143D]">
              {formatMoney(data.price)}
            </span>

            {data.oldPrice > 0 && (
              <span className="text-[10px] text-gray-300 line-through">
                {formatMoney(data.oldPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 active:scale-95 md:hidden"
          >
            <ShoppingCart size={14} />
          </button>
        </div>

        <DeliveryBadge
          origin={product?.origin}
          min={product?.deliveryMin}
          max={product?.deliveryMax}
          unit={product?.deliveryUnit}
        />

        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <Rating rate={data.rating} count={data.reviewCount} />
          <StockStatus stock={data.stock} />
        </div>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

const ProductImageSection = memo(
  ({ image, name, discount, isHearted, onQuickAdd, onWishlist }: any) => (
    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gray-50">
      {image !== '/placeholder.png' ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gray-100">
          <ImageOff size={24} />
        </div>
      )}

      {discount > 0 && (
        <div className="absolute left-2 top-2 bg-[#A4143D] px-2 py-1 text-[10px] text-white font-black">
          -{discount}%
        </div>
      )}

      <button
        onClick={onWishlist}
        className={`absolute right-2 top-2 h-9 w-9 flex items-center justify-center rounded-full ${
          isHearted
            ? 'bg-[#A4143D] text-white'
            : 'bg-white text-gray-400'
        }`}
      >
        <Heart size={16} fill={isHearted ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
);

const DeliveryBadge = memo(({ origin, min, max, unit }: any) => {
  if (!origin) return null;

  const isLocal = safeString(origin).toUpperCase() === 'LOCAL';

  return (
    <div className={`flex items-center gap-1 text-[9px] font-bold uppercase ${
      isLocal ? 'text-emerald-600' : 'text-blue-600'
    }`}>
      <Truck size={12} />
      <span>{isLocal ? 'Fast Local Delivery' : 'Ships Worldwide'}</span>
      {min != null && max != null && (
        <>
          <span className="opacity-40">•</span>
          <span>{min}-{max} {unit || 'days'}</span>
        </>
      )}
    </div>
  );
});

const StockStatus = memo(({ stock }: { stock: number }) => {
  if (stock <= 0) {
    return <span className="text-[8px] font-black text-red-500">Out of Stock</span>;
  }

  return stock < 10 ? (
    <span className="text-[8px] font-black text-orange-600">
      Only {stock} Left
    </span>
  ) : (
    <span className="text-[8px] font-black text-emerald-600">
      In Stock
    </span>
  );
});

ProductImageSection.displayName = 'ProductImageSection';
DeliveryBadge.displayName = 'DeliveryBadge';
StockStatus.displayName = 'StockStatus';