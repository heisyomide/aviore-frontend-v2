'use client';

import { ShoppingCart, Zap, Timer } from 'lucide-react';

interface ProductActionsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  stockCount: number;
  isLoading?: boolean;
}

export function ProductActions({ 
  onAddToCart, 
  onBuyNow, 
  stockCount,
  isLoading 
}: ProductActionsProps) {
  const isLowStock = stockCount > 0 && stockCount <= 10;

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-100">
      {/* 1. Urgency Indicator */}
      {isLowStock && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px] font-bold text-orange-600 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Timer size={14} /> Only {stockCount} items left!
            </span>
            <span>Hurry!</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
              style={{ width: `${(stockCount / 50) * 100}%` }} 
            />
          </div>
        </div>
      )}

      {/* 2. Action Buttons */}
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={onAddToCart}
          disabled={isLoading || stockCount === 0}
          className="group relative flex items-center justify-center gap-3 w-full h-16 bg-[#FF4747] hover:bg-[#E63E3E] text-white rounded-[1.25rem] font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <ShoppingCart size={18} className="transition-transform group-hover:-translate-y-0.5" />
          Add to Cart
        </button>

        <button
          onClick={onBuyNow}
          disabled={isLoading || stockCount === 0}
          className="group flex items-center justify-center gap-3 w-full h-16 bg-zinc-900 hover:bg-black text-white rounded-[1.25rem] font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Zap size={18} className="transition-transform group-hover:scale-110" />
          Buy Now
        </button>
      </div>

      <p className="text-center text-[10px] text-zinc-400 font-medium italic">
        Free 2-day shipping on all AVIORÈ orders over ₦250,000
      </p>
    </div>
  );
}