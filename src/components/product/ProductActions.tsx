'use client';

import { useState } from 'react';
import { ShoppingCart, Zap, Timer, Loader2 } from 'lucide-react';

interface ProductActionsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  stockCount?: number | null; // Made optional/nullable for safety
  isLoading?: boolean;
}

export function ProductActions({ 
  onAddToCart, 
  onBuyNow, 
  stockCount = 0,
  isLoading: externalLoading 
}: ProductActionsProps) {
  const [localLoading, setLocalLoading] = useState(false);
  
  // Ensure stock is a valid number
  const safeStock = typeof stockCount === 'number' ? stockCount : 0;
  const isLowStock = safeStock > 0 && safeStock <= 10;
  const isOutOfStock = safeStock <= 0;
  
  const processing = externalLoading || localLoading;

  const handleAction = async (action: () => void) => {
    if (processing || isOutOfStock) return;
    
    setLocalLoading(true);
    try {
      await action();
    } catch (err) {
      console.error("Action Failed:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-100">
      {/* Urgency Indicator */}
      {isLowStock && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
          <Timer size={14} className="text-amber-600 animate-pulse" />
          <p className="text-[11px] font-bold text-amber-700 uppercase">
            Hurry! Only {safeStock} left in stock
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {/* Add to Cart */}
        <button
          type="button"
          onClick={() => handleAction(onAddToCart)}
          disabled={processing || isOutOfStock}
          className="group relative flex items-center justify-center gap-3 w-full h-16 bg-[#FF4747] hover:bg-[#E63E3E] text-white rounded-[1.25rem] font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:bg-zinc-200 disabled:text-zinc-500 disabled:cursor-not-allowed"
        >
          {processing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart size={18} className="transition-transform group-hover:-translate-y-0.5" />
              Add to Cart
            </>
          )}
        </button>

        {/* Buy Now */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={() => handleAction(onBuyNow)}
            disabled={processing}
            className="group flex items-center justify-center gap-3 w-full h-16 bg-zinc-900 hover:bg-black text-white rounded-[1.25rem] font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {processing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Zap size={18} className="transition-transform group-hover:scale-110" />
                Buy Now
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-center text-[10px] text-zinc-400 font-medium italic">
        Free 2-day shipping on all AVIORÈ orders over ₦25,000
      </p>
    </div>
  );
}