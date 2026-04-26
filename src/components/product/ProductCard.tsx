'use client';

import React, { useState, useMemo, useEffect, memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, ImageOff } from 'lucide-react';

import { Rating } from '../ui/Rating';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

import {
  safeNumber,
  safeString,
  safeArray,
  formatMoney
} from '@/src/utils/safe';

/* ====================== TYPES ====================== */
interface ProductCardProps {
  product: any;
}

/* ====================== HELPERS ====================== */
const resolveImage = (product: any, apiBase: string) => {
  const variantImage = product?.variants?.[0]?.images?.[0]?.imageUrl;
  const productImage = product?.images?.[0]?.imageUrl || product?.image;

  const raw = variantImage || productImage;

  if (!raw) return '/placeholder.png';

  return raw.startsWith('http')
    ? raw
    : `${apiBase}/uploads/${raw.replace(/^\//, '')}`;
};

/* ====================== MAIN ====================== */
export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

  /* ================= NORMALIZED DATA ================= */
  const data = useMemo(() => {
    const price = safeNumber(product?.price);
    const oldPrice = safeNumber(product?.oldPrice);

    return {
      id: safeString(product?.id),
      name: safeString(product?.title || product?.name, 'Product'),
      category: safeString(product?.category?.name, 'New Arrival'),
      price,
      oldPrice,
      stock: safeNumber(product?.stock),
      rating: safeNumber(product?.averageRating ?? product?.rating),
      reviewCount: safeNumber(product?.reviewCount),
      discount: safeNumber(product?.discount),
      vendorId: safeString(product?.vendorId),
      image: resolveImage(product, apiBase),
    };
  }, [product, apiBase]);

  const isHearted =
    mounted && data.id ? isWishlisted?.(data.id) : false;

  /* ================= HANDLERS ================= */
  const navigate = () => {
    if (!data.id) return;
    router.push(`/product/${data.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!data.id || !data.vendorId) return;

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

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!data.id) return;

    toggleWishlist?.({
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image,
    });
  };

  /* ================= UI ================= */
  return (
    <div
      onClick={navigate}
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-zinc-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
    >
      <ProductImage
        image={data.image}
        name={data.name}
        discount={data.discount}
        isHearted={isHearted}
        onWishlist={handleWishlist}
        onQuickAdd={handleQuickAdd}
      />

      <ProductContent data={data} onQuickAdd={handleQuickAdd} />
    </div>
  );
}

/* ================= IMAGE SECTION ================= */
const ProductImage = memo(
  ({ image, name, discount, isHearted, onWishlist, onQuickAdd }: any) => {
    return (
      <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden">
        {image !== '/placeholder.png' ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300">
            <ImageOff size={32} />
          </div>
        )}

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-black text-white text-[10px] px-2 py-1 rounded-full font-bold">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={onWishlist}
          className={`absolute right-3 top-3 h-10 w-10 flex items-center justify-center rounded-full transition ${
            isHearted
              ? 'bg-black text-white'
              : 'bg-white/80 text-zinc-900'
          }`}
        >
          <Heart size={18} fill={isHearted ? 'currentColor' : 'none'} />
        </button>

        {/* Hover Quick Add */}
        <div className="absolute inset-x-3 bottom-3 translate-y-12 group-hover:translate-y-0 transition duration-500 hidden md:block">
          <button
            onClick={onQuickAdd}
            className="w-full bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  }
);

ProductImage.displayName = 'ProductImage';

/* ================= CONTENT ================= */
const ProductContent = memo(({ data, onQuickAdd }: any) => {
  return (
    <div className="p-5 flex flex-col space-y-3">
      <div>
        <p className="text-[10px] text-zinc-400 uppercase">
          {data.category}
        </p>
        <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1">
          {data.name}
        </h3>
      </div>

      {/* Price */}
      <div className="flex justify-between items-end">
        <div>
          {data.oldPrice > data.price && (
            <p className="text-xs line-through text-zinc-300">
              {formatMoney(data.oldPrice)}
            </p>
          )}
          <p className="text-lg font-bold text-zinc-950">
            {formatMoney(data.price)}
          </p>
        </div>

        <Rating rate={data.rating} count={data.reviewCount} />
      </div>

      {/* Bottom */}
      <div className="flex justify-between items-center pt-2 border-t">
        <StockIndicator stock={data.stock} />

        {/* Mobile Quick Add */}
        <button
          onClick={onQuickAdd}
          className="md:hidden h-9 w-9 bg-black text-white rounded-lg flex items-center justify-center"
        >
          <ShoppingBag size={14} />
        </button>
      </div>
    </div>
  );
});

ProductContent.displayName = 'ProductContent';

/* ================= STOCK ================= */
const StockIndicator = ({ stock }: { stock: number }) => {
  if (stock <= 0)
    return <span className="text-xs text-red-500">Out of stock</span>;

  if (stock < 5)
    return <span className="text-xs text-orange-500">Low stock</span>;

  return <span className="text-xs text-emerald-500">Available</span>;
};