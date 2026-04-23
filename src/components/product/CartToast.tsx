'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';

export function CartToast() {
  const { showToast, setShowToast, lastAddedItem } = useCartStore();

  // Optimized auto-hide logic
  const handleClose = useCallback(() => {
    setShowToast(false);
  }, [setShowToast]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(handleClose, 5000); // Auto-hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showToast, handleClose]);

  if (!showToast || !lastAddedItem) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[380px] animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* 1. Main Container: Premium feel with soft shadow & backdrop blur */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-black/5 border border-zinc-100 flex items-start gap-5">
        
        {/* 2. Success Icon & Visual Depth */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
          <ShoppingBag size={22} className="text-emerald-500" />
        </div>

        {/* 3. Product Content */}
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
              Added to Registry
            </h4>
            <button onClick={handleClose} className="text-zinc-400 hover:text-black p-1 transition">
              <X size={16} />
            </button>
          </div>
          
          <div className="flex gap-3 py-2 items-center">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-100">
              <Image src={lastAddedItem.image} alt={lastAddedItem.name} width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 truncate">
                {lastAddedItem.name}
              </p>
              <p className="text-[11px] text-zinc-400 font-medium">
                Qty: {lastAddedItem.quantity} {lastAddedItem.size ? `• Size: ${lastAddedItem.size}` : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
            <span className="text-lg font-bold text-zinc-950 flex-1">
              ₦{(lastAddedItem.price * lastAddedItem.quantity).toLocaleString()}
            </span>
            <Link href="/cart" className="px-5 py-2.5 rounded-full bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-black transition active:scale-95">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}