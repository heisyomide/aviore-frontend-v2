'use client';

import { useMemo } from "react";
import { Star } from "lucide-react";
import { safeNumber, formatNumber } from "@/src/utils/safe";

interface RatingProps {
  rate?: number | string | null;
  count?: number | string | null;
}

export function Rating({ rate, count }: RatingProps) {
  
  /* ================= CALCULATE SAFE VALUES ================= */
  const { normalizedRate, displayRate, safeCount } = useMemo(() => {
    // 1. Get raw number from utility
    const rawRate = safeNumber(rate, 0);
    const rawCount = safeNumber(count, 0);

    // 2. Clamp between 0 and 5
    const clamped = Math.min(Math.max(rawRate, 0), 5);

    return {
      normalizedRate: clamped,
      // 3. Guaranteed safety for toFixed
      displayRate: (clamped || 0).toFixed(1),
      safeCount: rawCount
    };
  }, [rate, count]);

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      
      {/* Stars Grid */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={`star-${i}`}
            size={10}
            className={
              i < Math.floor(normalizedRate)
                ? "fill-orange-400 text-orange-400"
                : "fill-zinc-200 text-zinc-200"
            }
          />
        ))}
      </div>

      {/* Rating Value */}
      <span className="text-[10px] font-bold text-zinc-500 tabular-nums">
        {displayRate}
      </span>

      {/* Count */}
      {safeCount > 0 && (
        <span className="text-[10px] text-zinc-400 font-medium">
          ({formatNumber(safeCount)})
        </span>
      )}
    </div>
  );
}