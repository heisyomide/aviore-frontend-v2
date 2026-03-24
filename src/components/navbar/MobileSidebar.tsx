'use client';

import { X, Package, Ticket, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MEGA_MENU_DATA, MegaMainCategory, MegaSubCategory, MegaMenuItem } from '../../data/categories';

export function MobileSidebar({ open, onClose, activeCategory, setActiveCategory }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] md:hidden">
      {/* 1. Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* 2. Sidebar Panel */}
      <div className="absolute top-0 left-0 w-[85%] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
        
        {/* 🚀 LOGO & CLOSE HEADER */}
        <div className="bg-slate-900 p-6 text-white pt-12 flex justify-between items-center border-b border-white/10 relative overflow-hidden">
          <span className="text-xl font-black tracking-tighter uppercase italic relative z-10">
            Avior<span className="text-[#A4143D]">è</span>
          </span>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white/70 relative z-10">
            <X size={20} />
          </button>
          {/* Industrial Accent */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#A4143D]/20 rounded-full blur-3xl" />
        </div>

        {/* 3. NAVIGATION ENGINE */}
        <div className="flex flex-1 overflow-hidden">
          {/* Root Category Sidebar */}
          <div className="w-24 bg-gray-50 border-r border-gray-100 overflow-y-auto pt-2 no-scrollbar">
            {MEGA_MENU_DATA.map((cat: MegaMainCategory) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className={`w-full px-2 py-5 flex flex-col items-center gap-2 transition-all relative ${
                  activeCategory.id === cat.id ? "bg-white text-[#A4143D]" : "text-gray-400"
                }`}
              >
                {activeCategory.id === cat.id && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#A4143D] rounded-r-full" />
                )}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden border transition-all
                  ${activeCategory.id === cat.id ? "border-[#A4143D]/30 shadow-md scale-105" : "border-transparent opacity-60 grayscale"}`}>
                  <Image 
                    src={(cat.children[0]?.items[0] as MegaMenuItem)?.img || '/placeholder.png'} 
                    alt={cat.name} width={44} height={44} className="object-cover" 
                  />
                </div>
                <span className="text-[8px] font-[1000] uppercase text-center leading-tight tracking-tighter">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

          {/* Sub-Category Detail View */}
          <div className="flex-1 bg-white overflow-y-auto p-5 no-scrollbar">
            <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-2">
               <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                 Explore {activeCategory.name}
               </h3>
               <Link href={`/shop?category=${activeCategory.id}`} onClick={onClose} className="text-[9px] font-black text-[#A4143D] uppercase underline decoration-2 underline-offset-4">
                 View All
               </Link>
            </div>
            
            <div className="space-y-12">
              {activeCategory.children.map((sub: MegaSubCategory) => (
                <div key={sub.slug} className="flex flex-col gap-5">
                  <h4 className="text-[12px] font-[1000] text-slate-900 uppercase italic flex items-center gap-2">
                    <span className="w-4 h-[2px] bg-[#A4143D]" />
                    {sub.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {sub.items.map((item: any, i: number) => {
                      const name = typeof item !== 'string' ? item.name : item;
                      const img = typeof item !== 'string' ? item.img : '/placeholder.png';
                      
                      return (
                        <Link 
                          key={i} 
                          href={`/shop?category=${activeCategory.id}&sub=${sub.slug}`} 
                          onClick={onClose} 
                          className="flex flex-col gap-2 group active:scale-95 transition-transform"
                        >
                          <div className="w-full aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center">
                            <Image src={img} alt={name} width={100} height={100} className="object-contain p-3" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-600 leading-tight line-clamp-2 px-1">
                            {name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. FOOTER: SYSTEM ACTIONS (Orders & Coupons) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-3">
            
            <Link 
              href="/dashboard/orders" 
              onClick={onClose} 
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
            >
              <Package size={18} className="text-[#A4143D]" />
              <span>Orders</span>
            </Link>

            <Link 
              href="/dashboard/coupons" 
              onClick={onClose} 
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
            >
              <Ticket size={18} className="text-[#A4143D]" />
              <span>Coupons</span>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}