// src/components/ui/Rating.tsx
import { Star } from "lucide-react";

export function Rating({ rate, count }: { rate: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            size={10} 
            className={`${i < Math.floor(rate) ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-gray-500">{rate}</span>
      <span className="text-[10px] text-gray-300">({count})</span>
    </div>
  );
}