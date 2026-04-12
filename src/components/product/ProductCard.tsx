'use client';

import { useMemo, MouseEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, ImageOff, Heart } from 'lucide-react';
import { Rating } from '../ui/Rating';
import { useCartStore } from '../../store/useCartStore';

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
  vendorId?: string;
  stock?: number;
  averageRating?: number;
  rating?: number;
  reviews?: unknown[];
  reviewCount?: number;
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({
  product,
}: ProductCardProps) {
  const router = useRouter();

  const addItem = useCartStore(
    (state) => state.addItem
  );

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000';

const resolvedImage = useMemo(() => {
  const firstImage = product.images?.[0];

  let rawImage: string | undefined;

  if (typeof firstImage === 'string') {
    rawImage = firstImage;
  } else {
    rawImage =
      firstImage?.imageUrl ||
      firstImage?.url;
  }

  rawImage = rawImage || product.image;

  if (!rawImage) return null;

  return rawImage.startsWith('http')
    ? rawImage
    : `${apiBase}/uploads/${rawImage.replace(
        /^\//,
        ''
      )}`;
}, [product.images, product.image, apiBase]);

  const productName =
    product.title ||
    product.name ||
    'Unknown Product';

  const price =
    Number(product.price) || 0;

  const stock =
    Number(product.stock) || 0;

  const rating =
    product.averageRating ||
    product.rating ||
    5;

  const reviewCount = Array.isArray(
    product.reviews
  )
    ? product.reviews.length
    : product.reviewCount || 0;

  const handleNavigate = () => {
    if (!product.id) return;

    router.push(
      `/product/${product.id}`
    );
  };

  const handleQuickAdd = (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (
      !product.id ||
      !product.vendorId
    )
      return;

    addItem({
      id: product.id,
      name: productName,
      price,
      image:
        resolvedImage ||
        '/placeholder.png',
      vendorId: product.vendorId,
      stock,
      quantity: 1,
    });
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative cursor-pointer rounded-2xl border border-transparent bg-white p-3 transition-all duration-500 hover:-translate-y-1.5 hover:border-gray-100 hover:shadow-2xl"
    >
      <ProductImageSection
        image={resolvedImage}
        name={productName}
        discount={product.discount}
        onQuickAdd={handleQuickAdd}
      />

      <div className="space-y-3 px-1">
        <h3 className="line-clamp-2 h-8 text-[11px] font-black uppercase tracking-tight text-gray-500 transition-colors group-hover:text-black">
          {productName}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-black italic tracking-tighter text-[#A4143D]">
              ₦{price.toLocaleString()}
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

        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <Rating
            rate={rating}
            count={reviewCount}
          />

          <StockBadge stock={stock} />
        </div>
      </div>
    </div>
  );
}

function ProductImageSection({
  image,
  name,
  discount,
  onQuickAdd,
}: {
  image: string | null;
  name: string;
  discount?: number;
  onQuickAdd: (
    e: MouseEvent<HTMLButtonElement>
  ) => void;
}) {
  return (
    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-gray-50 bg-gray-50">
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 opacity-20">
          <ImageOff size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest">
            No Media
          </span>
        </div>
      )}

      {discount ? (
        <div className="absolute left-2 top-2 z-10 rounded-md bg-[#A4143D] px-2 py-1 text-[10px] font-black text-white shadow-lg">
          -{discount}%
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-linear-to-t from-black/40 to-transparent p-3 transition-transform duration-500 group-hover:translate-y-0 md:block">
        <button
          onClick={onQuickAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[10px] font-black uppercase tracking-widest text-black shadow-xl transition-all hover:bg-[#A4143D] hover:text-white active:scale-90"
        >
          <Zap
            size={12}
            fill="currentColor"
          />
          Quick Add
        </button>
      </div>
    </div>
  );
}

function StockBadge({
  stock,
}: {
  stock: number;
}) {
  const lowStock = stock < 10;

  return (
    <span
      className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-tighter ${
        lowStock
          ? 'animate-pulse bg-orange-50 text-orange-600'
          : 'bg-emerald-50 text-emerald-600'
      }`}
    >
      {lowStock
        ? `Only ${stock} Left`
        : 'In Stock'}
    </span>
  );
}