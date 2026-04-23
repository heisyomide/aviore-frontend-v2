'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  qty: number;
  setQty: (val: number) => void;
  maxStock: number;
}

export function QuantitySelector({ qty, setQty, maxStock }: QuantitySelectorProps) {
  const handleDecrement = () => qty > 1 && setQty(qty - 1);
  const handleIncrement = () => qty < maxStock && setQty(qty + 1);

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Quantity</p>
      <div className="flex items-center w-fit bg-zinc-50 border border-zinc-100 rounded-2xl p-1.5">
        <button 
          onClick={handleDecrement}
          disabled={qty <= 1}
          className="p-3 bg-white rounded-xl shadow-sm hover:bg-zinc-100 transition disabled:opacity-30 disabled:shadow-none"
        >
          <Minus size={16} />
        </button>
        
        <span className="w-16 text-center font-bold text-lg select-none">
          {qty}
        </span>
        
        <button 
          onClick={handleIncrement}
          disabled={qty >= maxStock}
          className="p-3 bg-white rounded-xl shadow-sm hover:bg-zinc-100 transition disabled:opacity-30 disabled:shadow-none"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}