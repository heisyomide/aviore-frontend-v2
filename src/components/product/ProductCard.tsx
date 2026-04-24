'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ImageOff, Heart, Truck } from 'lucide-react';

import { Rating } from '../ui/Rating';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

/* ================= SAFE ================= */
const safeNumber = (val: any, fallback = 0) => {
  if (val === null || val === undefined) return fallback;
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

const safeString = (val: any, fallback = '') => {
  if (!val) return fallback;
  return String(val);
};

/* ================= COMPONENT ================= */
export function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useWishlistStore();

  useEffect(() => setMounted(true), []);

  /* 🔍 DEBUG ROOT */
  console.log('🧠 ProductCard RAW:', product);

  const data = useMemo(() => {
    const price = safeNumber(product?.price);
    const stock = safeNumber(product?.stock);
    const rating = safeNumber(product?.rating || product?.averageRating);
    const reviews = Array.isArray(product?.reviews)
      ? product.reviews.length
      : safeNumber(product?.reviewCount);

    return {
      id: product?.id,
      name: safeString(product?.title || product?.name, 'Product'),
      image: product?.image || '/placeholder.png',
      price,
      stock,
      rating,
      reviews
    };
  }, [product]);

  const handleNavigate = () => {
    if (!data.id) {
      console.error('❌ Missing product ID', product);
      return;
    }
    router.push(`/product/${data.id}`);
  };

  const handleQuickAdd = (e: any) => {
    e.stopPropagation();

    if (!data.id) {
      console.error('❌ Cannot add product without ID');
      return;
    }

    addItem({
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image,
      vendorId: product?.vendorId,
      stock: data.stock,
      quantity: 1,
    });
  };

  return (
    <div onClick={handleNavigate} className="cursor-pointer">

      {/* IMAGE */}
      <div className="relative h-40 bg-gray-100">
        {data.image ? (
          <Image src={data.image} alt={data.name} fill />
        ) : (
          <ImageOff />
        )}
      </div>

      {/* INFO */}
      <h3>{data.name}</h3>

      <p>₦{safeNumber(data.price).toLocaleString()}</p>

      <Rating rate={data.rating} count={data.reviews} />

      <button onClick={handleQuickAdd}>
        <ShoppingCart />
      </button>
    </div>
  );
}