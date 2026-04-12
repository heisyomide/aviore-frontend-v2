'use client';

import { useMemo, MouseEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Zap,
  ImageOff,
  Heart,
} from 'lucide-react';

import { Rating } from '../ui/Rating';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

interface ProductCardProps {
  product: {
    id: string;
    title?: string;
    name?: string;
    price?: number;
    oldPrice?: number;
    image?: string;
    images?: { imageUrl: string }[];
    vendorId?: string;
    stock?: number;
    discount?: number;
    rating?: number;
    averageRating?: number;
    reviews?: any[];
    reviewCount?: number;
  };
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const router = useRouter();

  const addItem = useCartStore(
    (state) => state.addItem
  );

  const addToWishlist = useWishlistStore(
    (state) => state.addToWishlist
  );

  const isWishlisted = useWishlistStore((state) =>
    state.isWishlisted(product.id)
  );

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000';

  /**
   * 🖼️ Resolve product image
   */
  const resolvedImage = useMemo(() => {
    const rawValue =
      product.images?.[0]?.imageUrl ||
      product.image;

    if (!rawValue || typeof rawValue !== 'string') {
      return null;
    }

    return rawValue.startsWith('http')
      ? rawValue
      : `${apiBase}/uploads/${rawValue.replace(
          /^\//,
          ''
        )}`;
  }, [product.images, product.image, apiBase]);

  /**
   * 📦 Navigate to product details
   */
  const handleNavigate = () => {
    if (!product.id) return;
    router.push(`/product/${product.id}`);
  };

  /**
   * 🛒 Quick add to cart
   */
const handleQuickAdd = (e: React.MouseEvent) => {
  e.stopPropagation();

  if (!product?.id || !product?.vendorId) return;

  addItem({
    id: product.id,
    name: product.title || product.name || "Unknown Product",
    price: Number(product.price) || 0,
    image: resolvedImage || "/placeholder.png",
    vendorId: product.vendorId,
    stock: Number(product.stock) || 0,
    quantity: 1,
  });
};

  /**
   * ❤️ Add / remove wishlist
   */
  const handleWishlist = (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (!product.id) return;

    addToWishlist({
      id: product.id,
      name:
        product.title ||
        product.name ||
        'Unknown Product',
      price: product.price || 0,
      image:
        resolvedImage || '/placeholder.png',
    });
  };

  const displayName =
    product.title ||
    product.name ||
    'Unknown Product';

  const displayPrice = Number(
    product.price || 0
  );

  const reviewCount = Array.isArray(
    product.reviews
  )
    ? product.reviews.length
    : product.reviewCount || 0;

  const rating =
    product.averageRating ||
    product.rating ||
    5;

  return (
    <div
      onClick={handleNavigate}
      className="group relative cursor-pointer rounded-2xl border border-transparent bg-white p-3 transition-all duration-500 hover:-translate-y-1.5 hover:border-gray-100 hover:shadow-2xl"
    >
      {/* 🖼️ IMAGE SECTION */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-gray-50 bg-gray-50 flex items-center justify-center">
        {resolvedImage ? (
          <Image
            src={resolvedImage}
            alt={displayName}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20">
            <ImageOff size={24} />
            <span className="text-[8px] font-black uppercase tracking-widest">
              No Media
            </span>
          </div>
        )}

        {/* ❤️ Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-all hover:scale-110"
        >
          <Heart
            size={16}
            className={`transition-all ${
              isWishlisted
                ? 'fill-[#A4143D] text-[#A4143D]'
                : 'text-gray-500'
            }`}
          />
        </button>

        {/* 💸 Discount badge */}
        {product.discount ? (
          <div className="absolute left-2 top-2 z-10 rounded-md bg-[#A4143D] px-2 py-1 text-[10px] font-black text-white shadow-lg">
            -{product.discount}%
          </div>
        ) : null}

        {/* 🛒 Hover quick add */}
        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-gradient-to-t from-black/40 to-transparent p-3 transition-transform duration-500 group-hover:translate-y-0 md:block">
          <button
            onClick={handleQuickAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[10px] font-black uppercase tracking-widest text-black shadow-xl transition-all hover:bg-[#A4143D] hover:text-white active:scale-90"
          >
            <Zap size={12} fill="currentColor" />
            Quick Add
          </button>
        </div>
      </div>

      {/* 📝 PRODUCT INFO */}
      <div className="space-y-3 px-1">
        <h3 className="line-clamp-2 h-8 text-[11px] font-black uppercase tracking-tight text-gray-500 transition-colors group-hover:text-black">
          {displayName}
        </h3>

        {/* 💰 Price */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-black italic tracking-tighter text-[#A4143D]">
              ₦{displayPrice.toLocaleString()}
            </span>

            {product.oldPrice && (
              <span className="text-[10px] text-gray-300 line-through">
                ₦
                {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-black transition-all active:scale-90 active:bg-[#A4143D] active:text-white md:hidden"
          >
            <ShoppingCart
              size={14}
              strokeWidth={3}
            />
          </button>
        </div>

        {/* ⭐ Rating + stock */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <Rating
            rate={rating}
            count={reviewCount}
          />

          <span
            className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-tighter ${
              (product.stock || 0) < 10
                ? 'animate-pulse bg-orange-50 text-orange-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {(product.stock || 0) < 10
              ? `Only ${product.stock} Left`
              : 'In Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}