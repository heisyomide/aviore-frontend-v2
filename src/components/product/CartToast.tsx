'use client';

import { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';
import { safeNumber, safeString } from '@/src/utils/safe';

export function CartToast() {
  const { showToast, setShowToast, lastAddedItem } = useCartStore();

  const handleClose = useCallback(() => {
    setShowToast(false);
  }, [setShowToast]);

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(handleClose, 5000);
    return () => clearTimeout(timer);
  }, [showToast, handleClose]);

  const safeData = useMemo(() => {
    if (!lastAddedItem) return null;

    const price = safeNumber(lastAddedItem.price);
    const qty = safeNumber(lastAddedItem.quantity, 1);

    return {
      name: safeString(lastAddedItem.name, 'Product Added'),
      image: safeString(lastAddedItem.image, '/placeholder.png'),
      qty,
      size: lastAddedItem.size,
      total: price * qty,
    };
  }, [lastAddedItem]);

  if (!showToast || !safeData) return null;

  return (
    <div className="fixed bottom-8 right-4 sm:right-8 z-[100] w-[calc(100%-2rem)] sm:w-[400px] animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-white rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-zinc-100 flex gap-4">
        
        {/* Status Icon */}
        <div className="shrink-0 w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-2xl">
          <ShoppingBag size={20} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">
                Successfully Added
              </h4>
              <p className="text-[13px] font-bold text-zinc-900 truncate pr-4">
                {safeData.name}
              </p>
            </div>
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X size={16} className="text-zinc-400" />
            </button>
          </div>

          {/* Product Details */}
          <div className="flex items-center gap-3 py-3 border-y border-zinc-50">
            <div className="relative w-12 h-12 rounded-xl bg-zinc-50 overflow-hidden shrink-0 border border-zinc-100">
              <Image 
                src={safeData.image} 
                alt={safeData.name} 
                fill 
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-zinc-500 font-medium">
                Quantity: <span className="text-zinc-900">{safeData.qty}</span>
                {safeData.size && (
                  <> • Size: <span className="text-zinc-900">{safeData.size}</span></>
                )}
              </p>
              <p className="text-sm font-bold text-[#A4143D]">
                ₦{(safeData.total || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Footer Link */}
          <div className="pt-3">
            <Link 
              href="/cart" 
              onClick={handleClose}
              className="group flex items-center justify-center gap-2 w-full py-3 bg-zinc-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all"
            >
              View Cart & Checkout
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}