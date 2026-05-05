'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  qty: number;
  setQty: (val: number) => void;
  maxStock?: number | null; // Made optional for safety
}

export function QuantitySelector({ 
  qty = 1, 
  setQty, 
  maxStock = 99 
}: QuantitySelectorProps) {
  
  // Safety: ensure values are numbers
  const safeStock = Math.max(0, typeof maxStock === 'number' ? maxStock : 0);
  const safeQty = Math.min(qty, safeStock || 1);

  const handleDecrement = () => {
    if (safeQty > 1) setQty(safeQty - 1);
  };

  const handleIncrement = () => {
    if (safeQty < safeStock) setQty(safeQty + 1);
  };

  // If item is out of stock, we show a disabled state
  const isOutOfStock = safeStock <= 0;

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
        Quantity {isOutOfStock && <span className="text-red-500">(Out of Stock)</span>}
      </p>
      
      <div className="flex items-center w-fit bg-zinc-50 border border-zinc-100 rounded-2xl p-1.5">
        <button 
          type="button"
          onClick={handleDecrement}
          disabled={safeQty <= 1 || isOutOfStock}
          className="p-3 bg-white rounded-xl shadow-sm text-zinc-900 hover:bg-zinc-100 transition disabled:opacity-30 disabled:shadow-none"
        >
          <Minus size={16} />
        </button>
        
        <span className="w-16 text-center text-zinc-900 font-bold text-lg select-none">
          {isOutOfStock ? 0 : safeQty}
        </span>
        
        <button 
          type="button"
          onClick={handleIncrement}
          disabled={safeQty >= safeStock || isOutOfStock}
          className="p-3 bg-white rounded-xl text-zinc-400 shadow-sm hover:bg-zinc-100 transition disabled:opacity-30 disabled:shadow-none"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}