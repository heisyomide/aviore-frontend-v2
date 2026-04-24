'use client';

import React, { useState, useMemo, memo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, ImageOff, Heart, Truck } from 'lucide-react';

import { Rating } from '../ui/Rating';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { safeNumber } from '@/src/utils/safe';

/* ====================== Safe Helpers ====================== */
const toSafeNumber = (value: any): number => {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const getProductImageUrl = (product: any, apiBase: string): string => {
  if (!product) return '/placeholder.png';

  const variantImg = product.variants?.[0]?.images?.[0];
  let raw = variantImg 
    ? (typeof variantImg === 'string' ? variantImg : variantImg.imageUrl || variantImg.url)
    : null;

  if (!raw) {
    const mainImages = Array.isArray(product.images) ? product.images : [];
    const firstImg = mainImages[0];
    raw = product.image || 
          (typeof firstImg === 'string' ? firstImg : firstImg?.imageUrl);
  }

  if (!raw || raw === 'undefined' || raw === 'null') return '/placeholder.png';

  return raw.startsWith('http') 
    ? raw 
    : `${apiBase}/uploads/${raw.replace(/^\//, '')}`;
};

/* ====================== MAIN COMPONENT ====================== */

export function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const wishlistStore = useWishlistStore();

  // Extremely defensive function extraction
  const toggleWishlist = typeof wishlistStore.toggleWishlist === 'function' 
    ? wishlistStore.toggleWishlist 
    : async () => { console.warn('toggleWishlist not ready'); };

  const isWishlisted = typeof wishlistStore.isWishlisted === 'function' 
    ? wishlistStore.isWishlisted 
    : () => false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

  const resolvedImage = useMemo(() => getProductImageUrl(product, apiBase), [product, apiBase]);
  const name = product?.title || product?.name || 'Unknown Product';
  const price = toSafeNumber(product?.price);
  const stock = toSafeNumber(product?.stock);
  const rating = toSafeNumber(product?.averageRating || product?.rating);
  const reviewCount = Array.isArray(product?.reviews) 
    ? product.reviews.length 
    : toSafeNumber(product?.reviewCount);

  const isHearted = mounted ? isWishlisted(product?.id) : false;

  const handleNavigate = () => {
    if (product?.id) router.push(`/product/${product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product?.id || !product?.vendorId) return;

    addItem({
      id: product.id,
      name,
      price,
      image: resolvedImage,
      vendorId: product.vendorId,
      stock,
      quantity: 1,
    });
  };

  const handleWishlistAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product?.id) return;

    try {
      await toggleWishlist({ 
        id: product.id, 
        name, 
        price, 
        image: resolvedImage 
      });
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative cursor-pointer rounded-2xl bg-white p-3 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl border border-transparent hover:border-gray-100"
    >
      <ProductImageSection
        image={resolvedImage}
        name={name}
        discount={toSafeNumber(product?.discount)}
        isHearted={isHearted}
        onQuickAdd={handleQuickAdd}
        onWishlist={handleWishlistAction}
      />

      <div className="space-y-3 px-1 mt-3">
        <h3 className="line-clamp-2 h-8 text-[11px] font-black uppercase tracking-tight text-gray-500 group-hover:text-black">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black italic text-[#A4143D]">
              ₦{(Number(price) || 0).toLocaleString()}
            </span>
            {product?.oldPrice && (
              <span className="text-[10px] text-gray-300 line-through">
                ₦{toSafeNumber(product.oldPrice).toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 active:scale-95 md:hidden"
          >
            <ShoppingCart size={14} className="text-gray-600" />
          </button>
        </div>

        <DeliveryBadge 
          origin={product?.origin}
          min={product?.deliveryMin} 
          max={product?.deliveryMax} 
          unit={product?.deliveryUnit} 
        />

        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <Rating rate={rating} count={reviewCount} />
          <StockStatus stock={stock} />
        </div>
      </div>
    </div>
  );
}

/* ====================== SUB-COMPONENTS ====================== */

const ProductImageSection = memo(({
  image, name, discount, isHearted, onQuickAdd, onWishlist
}: any) => (
  <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gray-50">
    {image && image !== '/placeholder.png' ? (
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />
    ) : (
      <div className="flex h-full items-center justify-center bg-gray-100 opacity-30">
        <ImageOff size={24} />
      </div>
    )}

    {discount > 0 && (
      <div className="absolute left-2 top-2 z-10 bg-[#A4143D] px-2 py-1 text-[10px] font-black text-white shadow-sm">
        -{discount}%
      </div>
    )}

    <button
      onClick={onWishlist}
      className={`absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-colors ${
        isHearted ? 'bg-[#A4143D] text-white' : 'bg-white text-gray-400 hover:text-[#A4143D]'
      }`}
    >
      <Heart size={16} fill={isHearted ? 'currentColor' : 'none'} />
    </button>
  </div>
));

const DeliveryBadge = memo(({ origin, min, max, unit }: any) => {
  if (!origin) return null;

  const isLocal = String(origin).toUpperCase() === 'LOCAL';

  return (
    <div className={`flex items-center gap-1 text-[9px] font-bold uppercase ${
      isLocal ? 'text-emerald-600' : 'text-blue-600'
    }`}>
      <Truck size={12} />
      <span>{isLocal ? 'Fast Local Delivery' : 'Ships Worldwide'}</span>
      {(min != null && max != null) && <span className="opacity-40">•</span>}
      {(min != null && max != null) && (
        <span>{min}-{max} {unit || 'days'}</span>
      )}
    </div>
  );
});

const StockStatus = memo(({ stock }: { stock: number }) => {
  if (stock <= 0) {
    return <span className="text-[8px] font-black uppercase text-red-500">Out of Stock</span>;
  }

  const isLow = stock < 10;
  return (
    <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
      isLow ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
    }`}>
      {isLow ? `Only ${stock} Left` : 'In Stock'}
    </span>
  );
});

ProductImageSection.displayName = 'ProductImageSection';
DeliveryBadge.displayName = 'DeliveryBadge';
StockStatus.displayName = 'StockStatus';