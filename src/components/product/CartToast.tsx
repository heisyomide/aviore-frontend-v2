'use client';

import { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';
import { safeNumber, safeString } from '@/src/utils/safe';

export function CartToast() {
  const { showToast, setShowToast, lastAddedItem } = useCartStore();

  const handleClose = useCallback(() => {
    setShowToast(false);
  }, [setShowToast]);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(handleClose, 5000);
    return () => clearTimeout(timer);
  }, [showToast, handleClose]);

  const safeData = useMemo(() => {
    if (!lastAddedItem) return null;
    return {
      name: safeString(lastAddedItem.name, 'Item Added'),
      image: safeString(lastAddedItem.image, '/placeholder.png'),
      qty: safeNumber(lastAddedItem.quantity, 1),
      size: lastAddedItem.size,
      total: safeNumber(lastAddedItem.price) * safeNumber(lastAddedItem.quantity, 1),
    };
  }, [lastAddedItem]);

  if (!showToast || !safeData) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-8 z-[100] w-[calc(100%-2rem)] sm:w-[380px] animate-in fade-in slide-in-from-bottom-10 duration-500">
      {/* 🍷 PREMIUM GLASS CONTAINER */}
      <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-zinc-200/50">
        
        <div className="flex gap-5">
          {/* PRODUCT HERO IMAGE */}
          <div className="relative w-20 h-24 rounded-2xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-100 shadow-sm">
            <Image 
              src={safeData.image} 
              alt={safeData.name} 
              fill 
              sizes="80px"
              className="object-cover"
            />
            {/* Minimal Check Badge */}
            <div className="absolute top-1 right-1 w-5 h-5 bg-[#A4143D] text-white flex items-center justify-center rounded-full shadow-lg">
              <Check size={10} strokeWidth={4} />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A4143D]">
                  Added to Cart
                </span>
                <button onClick={handleClose} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <h4 className="text-[13px] font-bold text-zinc-900 leading-tight pr-4 line-clamp-1">
                {safeData.name}
              </h4>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-tighter">
                Qty: {safeData.qty} {safeData.size && `• Size: ${safeData.size}`}
              </p>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-sm font-black text-zinc-900">
                ₦{safeData.total.toLocaleString()}
              </p>
              <Link 
                href="/cart" 
                onClick={handleClose}
                className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#A4143D] hover:translate-x-1 transition-transform"
              >
                Checkout <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* ⏳ PROGRESS TIMER BAR */}
        <div className="absolute bottom-0 left-0 h-1 bg-[#A4143D]/10 w-full">
          <div 
            className="h-full bg-[#A4143D] animate-progress-shrink" 
            style={{ animationDuration: '5000ms', animationTimingFunction: 'linear' }} 
          />
        </div>
      </div>
    </div>
  );
}