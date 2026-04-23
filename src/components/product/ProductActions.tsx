'use client';

import { useState } from 'react'; // Add this
import { ShoppingCart, Zap, Timer, Loader2 } from 'lucide-react';

// ADD THIS INTERFACE
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
  isLoading: externalLoading 
}: ProductActionsProps) {
  const [localLoading, setLocalLoading] = useState(false);
  const isLowStock = stockCount > 0 && stockCount <= 10;
  
  // Combine external and local loading states
  const processing = externalLoading || localLoading;

  const handleAction = async (action: () => void) => {
    setLocalLoading(true);
    try {
      await action(); // This triggers the function passed from your Page
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-100">
      {/* ... Urgency Indicator stays the same ... */}

      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => handleAction(onAddToCart)}
          disabled={processing || stockCount === 0}
          className="group relative flex items-center justify-center gap-3 w-full h-16 bg-[#FF4747] hover:bg-[#E63E3E] text-white rounded-[1.25rem] font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <ShoppingCart size={18} className="transition-transform group-hover:-translate-y-0.5" />
              Add to Cart
            </>
          )}
        </button>

        <button
          onClick={() => handleAction(onBuyNow)}
          disabled={processing || stockCount === 0}
          className="group flex items-center justify-center gap-3 w-full h-16 bg-zinc-900 hover:bg-black text-white rounded-[1.25rem] font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Zap size={18} className="transition-transform group-hover:scale-110" />
          Buy Now
        </button>
      </div>

      <p className="text-center text-[10px] text-zinc-400 font-medium italic">
        Free 2-day shipping on all AVIORÈ orders over ₦25,000
      </p>
    </div>
  );
}