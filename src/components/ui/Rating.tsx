'use client';

import { Star } from "lucide-react";
import { safeNumber, formatNumber } from "@/src/utils/safe";

interface RatingProps {
  rate?: number | string | null;
  count?: number | string | null;
}

export function Rating({ rate, count }: RatingProps) {

  /* ================= SAFE VALUES ================= */
  const safeRate = safeNumber(rate, 0);
  const safeCount = safeNumber(count, 0);

  /* Clamp rating between 0–5 */
  const normalizedRate = Math.min(Math.max(safeRate, 0), 5);

  /* ================= SAFE FORMAT ================= */
  const displayRate = (() => {
    try {
      return normalizedRate.toFixed(1);
    } catch {
      return '0.0';
    }
  })();

  console.log('RATING INPUT:', rate);

  return (
    <div className="flex items-center gap-1">
      
      {/* Stars */}
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={10}
            className={
              i < Math.floor(normalizedRate)
                ? "fill-orange-400 text-orange-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>

      {/* Rating Value */}
      <span className="text-[10px] font-bold text-gray-500">
        {displayRate}
      </span>

      {/* Count */}
      {safeCount > 0 && (
        <span className="text-[10px] text-gray-300">
          ({formatNumber(safeCount)})
        </span>
      )}
    </div>
  );
}