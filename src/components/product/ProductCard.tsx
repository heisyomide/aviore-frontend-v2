'use client';

import { useMemo, MouseEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Zap,
  ImageOff,
  Heart,
  Truck,
} from 'lucide-react';
import { Rating } from '../ui/Rating';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

/* ================= TYPES ================= */

type ProductImage =
  | string
  | {
      imageUrl?: string;
      url?: string;
    };

type Product = {
  id: string;
  title?: string;
  name?: string;
  price?: number;
  oldPrice?: number;
  discount?: number;
  image?: string;
  images?: ProductImage[];
  variants?: {
    images: {
      imageUrl: string;
      url?: string;
    }[];
  }[];

  vendorId?: string;
  stock?: number;

  averageRating?: number;
  rating?: number;
  reviews?: unknown[];
  reviewCount?: number;

  /* 🚚 DELIVERY */
  deliveryMin?: number;
  deliveryMax?: number;
  deliveryUnit?: 'days' | 'hours';
};

interface ProductCardProps {
  product: Product;
}

/* ================= MAIN ================= */

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000';

  /* ================= DERIVED ================= */

  const resolvedImage = useMemo(() => {
    const firstVariantImage =
      product.variants?.[0]?.images?.[0];

    let raw: string | undefined;

    if (typeof firstVariantImage === 'string') {
      raw = firstVariantImage;
    } else {
      raw =
        firstVariantImage?.imageUrl ||
        firstVariantImage?.url;
    }

    raw = raw || product.image;

    if (!raw) return null;

    return raw.startsWith('http')
      ? raw
      : `${apiBase}/uploads/${raw.replace(/^\//, '')}`;
  }, [product, apiBase]);

  const name =
    product.title ||
    product.name ||
    'Unknown Product';

  const price = Number(product.price) || 0;
  const stock = Number(product.stock) || 0;

  const rating =
    product.averageRating ||
    product.rating ||
    5;

  const reviewCount = Array.isArray(product.reviews)
    ? product.reviews.length
    : product.reviewCount || 0;

  const wishlisted = isWishlisted(product.id);

  /* ================= ACTIONS ================= */

  const handleNavigate = () => {
    router.push(`/product/${product.id}`);
  };

  const handleQuickAdd = (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (!product.id || !product.vendorId) return;

    addItem({
      id: product.id,
      name,
      price,
      image: resolvedImage || '/placeholder.png',
      vendorId: product.vendorId,
      stock,
      quantity: 1,
    });
  };

  const handleWishlist = async (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    await toggleWishlist({
      id: product.id,
      name,
      price,
      image: resolvedImage || '/placeholder.png',
    });
  };

  /* ================= UI ================= */

  return (
    <div
      onClick={handleNavigate}
      className="group relative cursor-pointer rounded-2xl bg-white p-3 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <ProductImageSection
        image={resolvedImage}
        name={name}
        discount={product.discount}
        onQuickAdd={handleQuickAdd}
        onWishlist={handleWishlist}
        wishlisted={wishlisted}
      />

      <div className="space-y-3 px-1">
        <h3 className="line-clamp-2 h-8 text-[11px] font-black uppercase tracking-tight text-gray-500 group-hover:text-black">
          {name}
        </h3>

        {/* 💰 PRICE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black italic text-[#A4143D]">
              ₦{price.toLocaleString()}
            </span>

            {product.oldPrice && (
              <span className="text-[10px] text-gray-300 line-through">
                ₦{product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 active:scale-90 md:hidden"
          >
            <ShoppingCart size={14} />
          </button>
        </div>

        {/* 🚚 DELIVERY */}
        <DeliveryBadge product={product} />

        {/* ⭐ RATING + STOCK */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <Rating rate={rating} count={reviewCount} />
          <StockBadge stock={stock} />
        </div>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function DeliveryBadge({
  product,
}: {
  product: Product;
}) {
  if (!product.deliveryMin || !product.deliveryMax)
    return null;

  return (
    <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600 uppercase">
      <Truck size={12} />
      {product.deliveryMin}-{product.deliveryMax}{' '}
      {product.deliveryUnit || 'days'} delivery
    </div>
  );
}

function ProductImageSection({
  image,
  name,
  discount,
  onQuickAdd,
  onWishlist,
  wishlisted,
}: {
  image: string | null;
  name: string;
  discount?: number;
  onQuickAdd: (
    e: MouseEvent<HTMLButtonElement>
  ) => void;
  onWishlist: (
    e: MouseEvent<HTMLButtonElement>
  ) => void;
  wishlisted: boolean;
}) {
  return (
    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gray-50">
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full items-center justify-center opacity-20">
          <ImageOff size={24} />
        </div>
      )}

      {discount && (
        <div className="absolute left-2 top-2 bg-[#A4143D] px-2 py-1 text-[10px] font-black text-white">
          -{discount}%
        </div>
      )}

      <button
        onClick={onWishlist}
        className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full ${
          wishlisted
            ? 'bg-[#A4143D] text-white'
            : 'bg-white'
        }`}
      >
        <Heart
          size={16}
          fill={wishlisted ? 'currentColor' : 'none'}
        />
      </button>

      <div className="absolute inset-x-0 bottom-0 hidden translate-y-full p-3 transition group-hover:translate-y-0 md:block">
        <button
          onClick={onQuickAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[10px] font-black uppercase"
        >
          <Zap size={12} />
          Quick Add
        </button>
      </div>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const low = stock < 10;

  return (
    <span
      className={`px-2 py-1 text-[8px] font-black uppercase ${
        low
          ? 'bg-orange-50 text-orange-600'
          : 'bg-emerald-50 text-emerald-600'
      }`}
    >
      {low ? `Only ${stock}` : 'In Stock'}
    </span>
  );
}