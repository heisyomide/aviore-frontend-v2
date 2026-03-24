'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight, Zap, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MEGA_MENU_DATA, MegaMainCategory, MegaSubCategory, MegaMenuItem } from "../../data/categories";

export function CategoryMegaMenu() {
  const [activeCategory, setActiveCategory] = useState<MegaMainCategory>(MEGA_MENU_DATA[0]);

  return (
    <div className="relative group">
      {/* 🚀 THE TRIGGER */}
      <button className="flex items-center  uppercase tracking-wider text-black gap-2 font-bold text-[13px] uppercase tracking-wider hover:text-[#A4143D] py-5 transition-all">
        Categories
        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
      </button>

      {/* 🚀 THE MEGA DROP DOWN */}
      <div className="absolute left-0 top-full hidden group-hover:flex w-[960px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden z-50">
        
        {/* LEFT SIDEBAR: Main Nav */}
        <div className="w-[240px] bg-gray-50/50 border-r border-gray-100 p-2">
          {MEGA_MENU_DATA.map((cat: MegaMainCategory) => (
            <button
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat)}
              className={`w-full text-left px-5 py-4 text-[13px] font-black uppercase tracking-tighter transition-all rounded-xl mb-1 flex items-center justify-between group/btn
                ${activeCategory.id === cat.id 
                  ? "bg-white text-[#A4143D] shadow-sm ring-1 ring-black/5" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-gray-100"}`}
            >
              {cat.name}
              {activeCategory.id === cat.id && (
                <motion.div layoutId="active-pill">
                   <ArrowRight size={14} />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT HUB */}
        <div className="flex-1 flex flex-col h-[580px]">
          
          {/* Scrollable Sub-category Grid */}
          <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 gap-x-10 gap-y-12"
              >
                {activeCategory.children.map((sub: MegaSubCategory) => (
                  <div key={sub.slug} className="flex flex-col gap-5">
                    {/* Sub-header */}
                    <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                      <span className="w-1 h-3 bg-[#A4143D] rounded-full" />
                      <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.25em]">
                        {sub.name}
                      </h4>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {sub.items.map((item: string | MegaMenuItem, idx: number) => {
                        const isObject = typeof item !== 'string';
                        const name = isObject ? (item as MegaMenuItem).name : (item as string);
                        const slug = isObject ? (item as MegaMenuItem).slug : name.toLowerCase().replace(/ /g, '-');
                        const img = isObject ? (item as MegaMenuItem).img : null;

                        return (
                          <Link
                            key={idx}
                            href={`/shop?category=${activeCategory.id}&sub=${sub.slug}&item=${slug}`}
                            className="flex items-center gap-3 group/item active:scale-95 transition-all"
                          >
                            <div className="w-10 h-10 relative rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 group-hover/item:border-[#A4143D]/30 transition-colors">
                              <Image src={img || '/placeholder.png'} alt={name} fill className="object-contain p-1.5" />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[12px] font-bold text-slate-600 group-hover/item:text-[#A4143D] transition-colors leading-tight">
                                 {name}
                               </span>
                               {isObject && (item as MegaMenuItem).hot && (
                                 <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">Hot Item</span>
                               )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 🔥 THE CONVERSION FOOTER BANNER */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100">
            <Link 
              href={`/shop?category=${activeCategory.id}&promo=hero`}
              className="relative w-full h-28 rounded-2xl overflow-hidden group flex items-center shadow-md bg-black"
            >
              <Image 
                src={(activeCategory.children?.[0]?.items?.[0] as MegaMenuItem)?.img || '/placeholder.png'} 
                alt="Promo" 
                fill 
                className="object-cover opacity-50 blur-[1px] group-hover:scale-105 group-hover:blur-0 transition-all duration-1000"
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-[#A4143D]/80 to-transparent" />
              
              <div className="relative z-10 px-8 flex justify-between items-center w-full">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md w-fit px-3 py-0.5 rounded-full border border-white/20 mb-1">
                    <Zap size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Seasonal Special</span>
                  </div>
                  <h3 className="text-2xl font-[1000] text-white italic tracking-tighter uppercase leading-none">
                    Discover {activeCategory.name}
                  </h3>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Premium Collections • Verified Vendors</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest group-hover:bg-[#A4143D] group-hover:text-white transition-all shadow-xl active:scale-95">
                  View All <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}