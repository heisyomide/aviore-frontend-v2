'use client';

import { useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';

/**
 * 🚀 FLOATING CART TOAST (Molecule)
 * Rule 12: Premium Micro-interactions
 * Rule 15: Perceived Performance
 */
export function FloatingCartToast() {
  const { lastAddedItem, showToast, setShowToast } = useCartStore();

  // 🚀 Auto-dismiss Logic - Rule 12
  const handleClose = useCallback(() => {
    setShowToast(false);
  }, [setShowToast]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(handleClose, 4000); // Dismiss after 4s
      return () => clearTimeout(timer);
    }
  }, [showToast, handleClose]);

  // Guard clause for early exit
  if (!showToast || !lastAddedItem) return null;

  return (
    <div className="fixed top-24 right-6 z-[300] w-full max-w-[320px] pointer-events-auto">
      <div className="bg-white rounded-[1.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
        
        {/* 1. Header State - Success Confirmation */}
        <div className="bg-green-50/50 px-4 py-2.5 flex items-center justify-between border-b border-green-100/50">
          <div className="flex items-center gap-2 text-green-700">
            <div className="bg-green-600 rounded-full p-0.5 shadow-sm">
              <Check size={10} className="text-white" strokeWidth={4} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Added_To_Registry</span>
          </div>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-black transition-colors p-1"
          >
            <X size={14} />
          </button>
        </div>

        {/* 2. Product Snapshot - Rule 9 (Image System) */}
        <div className="p-4 flex gap-4">
          <div className="relative w-16 h-16 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 shrink-0 shadow-inner">
            <Image 
              src={lastAddedItem.image} 
              alt={lastAddedItem.name} // 🚀 FIXED: using .name from CartItem interface
              fill 
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h4 className="text-[11px] font-black text-gray-800 truncate mb-1 uppercase tracking-tight">
              {lastAddedItem.name} {/* 🚀 FIXED: using .name from CartItem interface */}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#A4143D]">
                ₦{lastAddedItem.price.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                Qty: {lastAddedItem.quantity}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Action HUD - Rule 8 (Interaction) */}
        <div className="p-3 bg-gray-50/50 flex gap-2 border-t border-gray-100/50">
          <Link 
            href="/cart"
            onClick={handleClose}
            className="flex-1 bg-[#111] text-white text-[10px] font-black uppercase py-3.5 rounded-xl text-center hover:bg-[#A4143D] transition-all active:scale-95 shadow-md shadow-black/10"
          >
            View Cart
          </Link>
          <button 
            onClick={handleClose}
            className="flex-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-black uppercase py-3.5 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
          >
            Continue
          </button>
        </div>

        {/* 🚀 Visual Timer Bar - Rule 12 */}
        <div className="h-1 bg-gray-100 w-full overflow-hidden">
          <div 
            className="h-full bg-[#A4143D] origin-left" 
            style={{ 
              animation: 'shrink-width 4s linear forwards' 
            }} 
          />
        </div>
      </div>
    </div>
  );
}