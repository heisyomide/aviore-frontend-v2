'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Heart,
  Truck,
  ImageOff,
  Star,
} from 'lucide-react';

import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { safeNumber, safeString } from '@/src/utils/safe';
import toast from 'react-hot-toast';

/* ====================== TEMU-STYLE PRODUCT CARD ====================== */

export function ProductCard({ product }: { product: any }) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const data = useMemo(() => {
    const variants = Array.isArray(product?.variants)
      ? product.variants
      : [];

    /* ================= PRICE ================= */

    const variantPrices = variants
      .map((v: any) => Number(v?.price) || 0)
      .filter((p: number) => p > 0);

    const displayPrice =
      Number(product?.displayPrice) > 0
        ? Number(product?.displayPrice)
        : variantPrices.length > 0
        ? Math.min(...variantPrices)
        : Number(product?.price || 0);

    /* ================= STOCK ================= */

    const totalStock =
      Number(product?.totalStock) > 0
        ? Number(product?.totalStock)
        : variants.length > 0
        ? variants.reduce(
            (sum: number, v: any) =>
              sum + (Number(v?.stock) || 0),
            0
          )
        : Number(product?.stock || 0);

    /* ================= IMAGE ================= */

    const variantImage =
      variants?.[0]?.images?.[0]?.imageUrl;

    const productImage =
      product?.images?.[0]?.imageUrl ||
      product?.image ||
      product?.img;

    const imageUrl = variantImage || productImage;

    const finalImage = imageUrl
      ? imageUrl.startsWith('http')
        ? imageUrl
        : `${apiBase}/uploads/${imageUrl.replace(/^\//, '')}`
      : '/placeholder.png';

    /* ================= RANDOM SOLD COUNT ================= */

    const soldSeed =
      Number(product?.reviewCount || 0) > 0
        ? `${Math.floor(
            Math.random() * 90 + 10
          )}K+ sold`
        : `${Math.floor(
            Math.random() * 900 + 100
          )}+ sold`;

    /* ================= DISCOUNT ================= */

    const oldPrice =
      Number(product?.oldPrice) > 0
        ? Number(product?.oldPrice)
        : Math.floor(displayPrice * 1.35);

    const discount =
      Math.round(
        ((oldPrice - displayPrice) / oldPrice) * 100
      ) || 15;

    return {
      id: safeString(product?.id),

      name: safeString(
        product?.title || product?.name,
        'Product'
      ),

      image: finalImage,

      price: displayPrice,

      oldPrice,

      stock: totalStock,

      rating:
        safeNumber(product?.averageRating) || 4.8,

      reviewCount:
        safeNumber(product?.reviewCount) || 0,

      soldSeed,

      discount,

      vendorId: safeString(product?.vendorId),

      origin: safeString(product?.origin || 'LOCAL'),
    };
  }, [product, apiBase]);

  const isHearted =
    mounted && data.id
      ? isWishlisted?.(data.id)
      : false;

  const handleNavigate = () => {
    if (!data.id) return;
    router.push(`/product/${data.id}`);
  };

  const handleWishlist = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    toggleWishlist({
      id: data.id,
      name: data.name,
      image: data.image,
      price: data.price,
    });

    toast.success(
      isHearted
        ? 'Removed from wishlist'
        : 'Added to wishlist'
    );
  };

  const handleAddToCart = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const firstVariant =
      product?.variants?.[0];

    addItem({
      id: data.id,
      productId: data.id,
      name: data.name,
      image: data.image,
      price: data.price,
      stock: data.stock,
      quantity: 1,
      vendorId: data.vendorId,

      variantId: firstVariant?.id,
      color: firstVariant?.color,
      size: firstVariant?.size,
    });

    toast.success('Added to cart');
  };

  return (
    <div
      onClick={handleNavigate}
      className="
        bg-white
        rounded-xl
        overflow-hidden
        cursor-pointer
        border border-zinc-100
        active:scale-[0.99]
        transition-all
      "
    >
      {/* ================= IMAGE ================= */}

      <div className="relative aspect-[0.92] bg-[#F7F7F7] overflow-hidden">
        {data.image !== '/placeholder.png' ? (
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-300">
            <ImageOff size={26} />
          </div>
        )}

        {/* Discount Badge */}

        <div className="absolute top-2 left-2 z-10">
          <div className="bg-[#A4143D] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            -{data.discount}%
          </div>
        </div>

        {/* Wishlist */}

        <button
          onClick={handleWishlist}
          className="
            absolute
            top-2
            right-2
            z-10
            w-8
            h-8
            rounded-full
            bg-white/95
            flex
            items-center
            justify-center
            shadow-md
          "
        >
          <Heart
            size={14}
            className={
              isHearted
                ? 'fill-[#A4143D] text-[#A4143D]'
                : 'text-zinc-500'
            }
          />
        </button>

        {/* Cart */}

        <button
          onClick={handleAddToCart}
          className="
            absolute
            bottom-2
            right-2
            z-10
            w-9
            h-9
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            shadow-lg
            border border-zinc-100
          "
        >
          <ShoppingCart
            size={16}
            className="text-zinc-700"
          />
        </button>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="px-2.5 py-2 space-y-1.5">
        {/* Title */}

        <h3
          className="
            text-[13px]
            leading-[1.2]
            font-semibold
            text-zinc-900
            line-clamp-2
            min-h-[32px]
          "
        >
          {data.name}
        </h3>

        {/* Rating + Sold */}

        <div className="flex items-center gap-1 flex-wrap">
          <div className="flex items-center gap-0.5">
            <Star
              size={11}
              className="fill-black text-black"
            />
            <span className="text-[11px] font-bold text-black">
              {data.rating.toFixed(1)}
            </span>
          </div>

          <span className="text-[11px] text-zinc-500">
            🔥 {data.soldSeed}
          </span>
        </div>

        {/* Tiny Promo Strip */}

        <div className="flex items-center gap-1 flex-wrap">
          <span className="bg-[#F97316] text-white text-[9px] font-bold px-1.5 py-[2px] rounded">
            Saved ₦
            {Math.floor(
              data.oldPrice - data.price
            ).toLocaleString()}
          </span>

          <span className="text-[9px] text-[#F97316] font-bold">
            11:59:29
          </span>
        </div>

        {/* Marketing Text */}

        <p className="text-[11px] font-medium text-[#F97316] truncate">
          BEST-SELLING ITEM | Limited deal
        </p>

        {/* PRICE */}

        <div className="flex items-end gap-1 flex-wrap">
          <span className="text-[22px] font-black text-[#F97316] tracking-tight leading-none">
            ₦{data.price.toLocaleString()}
          </span>

          <span className="text-[11px] text-zinc-400 line-through mb-[2px]">
            ₦{data.oldPrice.toLocaleString()}
          </span>
        </div>

        {/* STOCK */}

        <div className="min-h-[18px]">
          {data.stock > 0 &&
          data.stock <= 5 ? (
            <span className="text-[10px] font-bold text-red-500 uppercase">
              Only {data.stock} left
            </span>
          ) : data.stock > 0 ? (
            <span className="text-[10px] font-bold text-emerald-600 uppercase">
              In stock
            </span>
          ) : (
            <span className="text-[10px] font-bold text-zinc-300 uppercase">
              Out of stock
            </span>
          )}
        </div>

        {/* SHIPPING */}

        <div className="flex items-center gap-1 pt-1 text-zinc-500">
          <Truck size={11} />

          <span className="text-[10px] truncate">
            {data.origin === 'LOCAL'
              ? 'Fast Local Delivery'
              : 'Ships Worldwide'}
          </span>
        </div>
      </div>
    </div>
  );
}