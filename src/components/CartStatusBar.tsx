'use client';

import { useCartStore } from '../store/useCartStore';
import { ShoppingBag, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomeCartWidget() {
  // 1. DATA ACCESS
  const { items, subtotal, totalItems, _hasHydrated } = useCartStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 2. HYDRATION GUARD
  // Ensures the component only renders once the store and the client are in sync
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !_hasHydrated || totalItems === 0) return null;

  return (
    <div className="fixed bottom-10 right-10 z-50">
      {/* 🚀 FLOATING GLASS PILL */}
      <button 
        onClick={() => setOpen(!open)}
        className={`backdrop-blur-2xl bg-white/90 border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full pl-6 pr-4 py-4 flex items-center gap-6 group hover:scale-105 transition-all duration-500 ${open ? 'ring-2 ring-[#A4143D]/20' : ''}`}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-[#FBE9E3] transition-colors">
            <ShoppingBag size={20} className="text-[#A4143D]" />
          </div>
          <span className="absolute -top-1 -right-1 bg-[#A4143D] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {totalItems}
          </span>
        </div>
        
        <div className="flex flex-col items-start">
          <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none mb-1.5">Registry_Summary</span>
          <span className="text-sm font-black text-zinc-900 tracking-tighter italic leading-none">₦{subtotal.toLocaleString()}</span>
        </div>

        <div className="bg-zinc-100 p-2 rounded-full text-zinc-400 group-hover:text-[#A4143D] group-hover:bg-white transition-all shadow-inner">
          {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </button>

      {/* 🚀 EXPANDED PREVIEW PANEL */}
      {open && (
        <div className="absolute bottom-24 right-0 w-[380px] bg-white border border-zinc-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-[3rem] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-lg font-black text-zinc-900 uppercase italic tracking-tighter">Your Selection</h3>
                <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-1">Registry_ID: {items[0]?.vendorId?.slice(0, 8)}</p>
            </div>
            <span className="bg-zinc-50 px-4 py-1.5 rounded-full text-[9px] text-zinc-400 font-black uppercase tracking-widest border border-zinc-100">
                {totalItems} Artifacts
            </span>
          </div>
          
          {/* Item List with custom scrollbar */}
          <div className="space-y-6 max-h-[320px] overflow-y-auto pr-4 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-5 group">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-zinc-50 border border-zinc-100 group-hover:border-[#A4143D]/20 transition-colors shadow-sm">
                  <Image 
                    src={item.image || '/placeholder.jpg'} 
                    alt={item.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-zinc-900 uppercase italic truncate group-hover:text-[#A4143D] transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    Node_Qty: <span className="text-zinc-900">{item.quantity}</span>
                  </p>
                </div>
                <p className="text-[11px] font-black text-zinc-900 italic tracking-tighter">
                    ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-8 border-t border-zinc-50">
            <Link 
                href="/cart" 
                className="group/btn relative flex items-center justify-between bg-zinc-900 text-white p-2 rounded-2xl overflow-hidden hover:bg-[#A4143D] transition-all duration-500 shadow-xl"
            >
              <span className="pl-6 text-[10px] font-black uppercase tracking-[0.2em]">Open Full Registry</span>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}