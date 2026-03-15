'use client';

import { useCartStore } from '../store/useCartStore';
import { ShoppingBag, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function HomeCartWidget() {
  const { items, subtotal, totalItems } = useCartStore();
  const [open, setOpen] = useState(false);

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-10 right-10 z-50">
      {/* Floating Glass Pill */}
      <button 
        onClick={() => setOpen(!open)}
        className="backdrop-blur-2xl bg-white/90 border border-white/20 shadow-2xl rounded-full pl-6 pr-4 py-4 flex items-center gap-6 group hover:scale-105 transition-all duration-500"
      >
        <div className="relative">
          <ShoppingBag size={22} className="text-[#A4143D]" />
          <span className="absolute -top-2 -right-2 bg-[#A4143D] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {totalItems}
          </span>
        </div>
        
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Registry</span>
          <span className="text-sm font-black text-gray-900 tracking-tighter italic">₦{subtotal.toLocaleString()}</span>
        </div>

        <div className="bg-gray-100 p-1.5 rounded-full text-gray-400 group-hover:text-[#A4143D] group-hover:bg-[#FBE9E3] transition-all">
          {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </button>

      {/* Expanded Preview Panel */}
      {open && (
        <div className="absolute bottom-24 right-0 w-[360px] bg-white/95 backdrop-blur-xl border border-white shadow-[0_25px_50px_-12px_rgba(164,20,61,0.15)] rounded-[2.5rem] p-8 animate-in fade-in zoom-in-95 duration-300">
          <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-6 flex items-center justify-between">
            Your Selection
            <span className="text-[10px] text-gray-400 not-italic font-bold uppercase">{totalItems} Artifacts</span>
          </h3>
          
          <div className="space-y-5 max-h-[340px] overflow-y-auto pr-3 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 group">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="text-[11px] font-bold text-gray-900 uppercase line-clamp-1 group-hover:text-[#A4143D] transition-colors">{item.name}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-black text-gray-900 italic">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50">
            <Link href="/cart" className="group/btn flex items-center justify-between bg-[#A4143D] text-white p-2 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#A4143D]/20 transition-all">
              <span className="pl-6 text-[10px] font-black uppercase tracking-widest">Open Full Registry</span>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}