'use client';

import { useMemo } from 'react';
import { Star } from 'lucide-react';

export function ProductInfo({
  title = "Product Title",
  subTitle = "",
  price = 0,
  originalPrice = 0,
  discount = 0,
  rating = 0,
  reviewCount = 0,
}: any) {

  /* ================= SAFE ================= */
  const safeNumber = (val: any, fallback = 0) => {
    if (val === null || val === undefined) return fallback;
    const num = Number(String(val).replace(/[^\d.-]/g, ''));
    return isNaN(num) ? fallback : num;
  };

  const safeFormat = (val: any) => {
    try {
      return safeNumber(val).toLocaleString();
    } catch (e) {
      console.error('💥 FORMAT ERROR:', val, e);
      return '0';
    }
  };

  /* ================= MEMO ================= */
  const data = useMemo(() => {
    const current = safeNumber(price);
    const original = safeNumber(originalPrice);
    const safeRating = safeNumber(rating);
    const safeReviews = safeNumber(reviewCount);

    const savings = original > current ? original - current : 0;
    const percent =
      discount > 0
        ? discount
        : original > 0
        ? Math.round((savings / original) * 100)
        : 0;

    console.log('🧠 ProductInfo DEBUG:', {
      price,
      originalPrice,
      rating,
      reviewCount,
      computed: { current, original, safeRating, safeReviews }
    });

    return {
      current,
      original,
      safeRating,
      safeReviews,
      savings,
      percent
    };
  }, [price, originalPrice, discount, rating, reviewCount]);

  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <span>In Stock</span>

        <div className="flex items-center gap-1">
          <Star size={12} />

          <span>
            {safeNumber(data.safeRating).toFixed(1)}
          </span>

          <span>
            ({safeFormat(data.safeReviews)})
          </span>
        </div>
      </div>

      <h1>{title}</h1>
      {subTitle && <p>{subTitle}</p>}

      <div>
        ₦{safeFormat(data.current)}

        {data.original > data.current && (
          <>
            <span>₦{safeFormat(data.original)}</span>
            <span>
              Save ₦{safeFormat(data.savings)} ({data.percent}%)
            </span>
          </>
        )}
      </div>
    </div>
  );
}