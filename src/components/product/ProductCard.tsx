'use client';

import React, { useMemo, MouseEvent, useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, ImageOff, Heart, Truck } from 'lucide-react';

import { Rating } from '../ui/Rating';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

/* ================= UTILS ================= */

/**
 * Safely resolves the product image URL, handling variants, 
 * nested objects, and broken API strings.
 */
const getProductImageUrl = (product: any, apiBase: string): string => {
  const firstVariant = product.variants?.[0];
  const variantImgObj = firstVariant?.images?.[0];
  
  let raw: string | undefined;

  // 1. Try Variant Image
  if (variantImgObj) {
    raw = typeof variantImgObj === 'string' ? variantImgObj : (variantImgObj.imageUrl || variantImgObj.url);
  }

  // 2. Fallback to Main Images Array or Single Image String
  if (!raw || raw === 'undefined') {
    const mainImages = Array.isArray(product.images) ? product.images : [];
    const firstMainImg = mainImages[0];
    
    raw = product.image || 
          (typeof firstMainImg === 'string' ? firstMainImg : firstMainImg?.imageUrl);
  }

  // 3. Final safety check against "undefined" or null
  if (!raw || raw === 'undefined' || raw === 'null') return '/placeholder.png';

  return raw.startsWith('http') 
    ? raw 
    : `${apiBase}/uploads/${raw.replace(/^\//, '')}`;
};

/* ================= MAIN COMPONENT ================= */

export function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Store Actions
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Derived Values
  const resolvedImage = useMemo(() => getProductImageUrl(product, apiBase), [product, apiBase]);
  const name = product.title || product.name || 'Unknown Product';
  const price = Number(product.price) || 0;
  const stock = Number(product.stock) || 0;
  const rating = product.averageRating || product.rating || 5;
  const reviewCount = Array.isArray(product.reviews) ? product.reviews.length : (product.reviewCount || 0);
  const isHearted = mounted ? isWishlisted(product.id) : false;

  /* --- HANDLERS --- */

  const handleNavigate = () => router.push(`/product/${product.id}`);

  const handleQuickAdd = (e: MouseEvent) => {
    e.stopPropagation();
    if (!product.id || !product.vendorId) return;
    
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

  const handleWishlistAction = async (e: MouseEvent) => {
    e.stopPropagation();
    await toggleWishlist({ id: product.id, name, price, image: resolvedImage });
  };

  /* --- RENDER --- */

  return (
    <div
      onClick={handleNavigate}
      className="group relative cursor-pointer rounded-2xl bg-white p-3 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl border border-transparent hover:border-gray-100"
    >
      {/* Top Image Section */}
      <ProductImageSection
        image={resolvedImage}
        name={name}
        discount={product.discount}
        isHearted={isHearted}
        onQuickAdd={handleQuickAdd}
        onWishlist={handleWishlistAction}
      />

      {/* Content Section */}
      <div className="space-y-3 px-1">
        <h3 className="line-clamp-2 h-8 text-[11px] font-black uppercase tracking-tight text-gray-500 group-hover:text-black">
          {name}
        </h3>

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

          {/* Mobile Cart Button */}
          <button
            onClick={handleQuickAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 active:scale-95 md:hidden"
          >
            <ShoppingCart size={14} className="text-gray-600" />
          </button>
        </div>

        <DeliveryBadge 
  origin={product.origin}
  min={product.deliveryMin} 
  max={product.deliveryMax} 
  unit={product.deliveryUnit} 
/>

        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <Rating rate={rating} count={reviewCount} />
          <StockStatus stock={stock} />
        </div>
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

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

    {discount && (
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

    {/* Desktop Hover Action */}
    <div className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0 md:block">
      <button
        onClick={onQuickAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm py-3 text-[10px] font-black uppercase shadow-xl hover:bg-[#A4143D] hover:text-white transition-colors"
      >
        <Zap size={12} />
        Quick Add
      </button>
    </div>
  </div>
));

const DeliveryBadge = memo(({ origin, min, max, unit }: {
  origin?: 'LOCAL' | 'INTERNATIONAL';
  min?: number;
  max?: number;
  unit?: string;
}) => {
  if (!origin) return null;

  const isLocal = origin === 'LOCAL';

  return (
    <div className={`flex items-center gap-1 text-[9px] font-bold uppercase ${
      isLocal ? 'text-emerald-600' : 'text-blue-600'
    }`}>
      <Truck size={12} />

      {/* Label */}
      <span>
        {isLocal ? 'Fast Local Delivery' : 'Ships Worldwide'}
      </span>

      {/* Dot separator */}
      {(min && max) && <span className="opacity-40">•</span>}

      {/* Delivery time */}
      {(min && max) && (
        <span>
          {min}-{max} {unit || 'days'}
        </span>
      )}
    </div>
  );
});

const StockStatus = memo(({ stock }: { stock: number }) => {
  const isLow = stock < 10;
  if (stock <= 0) return <span className="text-[8px] font-black uppercase text-red-500">Out of Stock</span>;
  
  return (
    <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
      isLow ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
    }`}>
      {isLow ? `Only ${stock} Left` : 'In Stock'}
    </span>
  );
});

// Set display names for debugging
ProductImageSection.displayName = 'ProductImageSection';
DeliveryBadge.displayName = 'DeliveryBadge';
StockStatus.displayName = 'StockStatus';