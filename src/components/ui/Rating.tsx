// src/components/ui/Rating.tsx
import { Star } from "lucide-react";

interface RatingProps {
  rate?: number | null;
  count?: number | null;
}

export function Rating({ rate = 0, count = 0 }: RatingProps) {
  const safeRate = Number(rate) || 0;
  const safeCount = Number(count) || 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            size={10} 
            className={`${
              i < Math.floor(safeRate) 
                ? "fill-orange-400 text-orange-400" 
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-gray-500">
        {safeRate.toFixed(1)}
      </span>
      {safeCount > 0 && (
        <span className="text-[10px] text-gray-300">({safeCount})</span>
      )}
    </div>
  );
}