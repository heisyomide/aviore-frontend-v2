'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight, Zap, Sparkles, MoveRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MEGA_MENU_DATA, MegaMainCategory, MegaSubCategory, MegaMenuItem } from "../../data/categories";

export function CategoryMegaMenu() {
  const [activeCategory, setActiveCategory] = useState<MegaMainCategory>(MEGA_MENU_DATA[0]);

  return (
    <div className="relative group/mega">
      
      {/* 🔘 INDUSTRIAL TRIGGER */}
      <button className="font-[1000] text-[11px] uppercase tracking-[0.25em] text-slate-900 hover:text-[#A4143D] flex items-center gap-2.5 py-6 transition-all duration-500">
        <span className="relative">
          Categories
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#A4143D] group-hover/mega:w-full transition-all duration-500" />
        </span>
        <ChevronDown size={14} className="group-hover/mega:rotate-180 transition-transform duration-500 text-[#A4143D]" />
      </button>

      {/* 🚀 THE ARCHITECTURAL VIEWPORT */}
      <div className="absolute top-full left-[-180px] hidden group-hover/mega:flex w-[1100px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-t border-gray-100 rounded-b-[3rem] z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-300">

        {/* 🧭 NAVIGATION SIDEBAR (Glass-Morphic style) */}
        <div className="w-[280px] bg-slate-50/50 border-r border-gray-100 p-4 flex flex-col gap-1.5">
          <div className="px-5 mb-4 mt-2">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Departments</span>
          </div>
          {MEGA_MENU_DATA.map((cat) => (
            <button
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat)}
              className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between group/btn
              ${activeCategory.id === cat.id
                  ? "bg-white text-[#A4143D] shadow-xl shadow-black/5 scale-[1.03] ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <span className={`text-[13px] font-black uppercase tracking-tighter ${activeCategory.id === cat.id ? 'italic' : ''}`}>
                {cat.name}
              </span>
              {activeCategory.id === cat.id && (
                <motion.div layoutId="nav-indicator" className="w-1.5 h-1.5 bg-[#A4143D] rounded-full shadow-[0_0_10px_#A4143D]" />
              )}
            </button>
          ))}
        </div>

        {/* 🎯 CONTENT ENGINE */}
        <div className="flex-1 flex flex-col h-[640px] bg-white">

          <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Visual Header Branding */}
                <div className="flex items-end justify-between mb-12 border-b border-slate-50 pb-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#A4143D] mb-2">
                      <Sparkles size={14} fill="currentColor" />
                      <span className="text-[9px] font-black uppercase tracking-[0.5em]">Aviorè_Curated</span>
                    </div>
                    <h3 className="text-5xl font-[1000] italic tracking-[calc(-0.05em)] uppercase text-slate-900 leading-none">
                      {activeCategory.name}
                    </h3>
                  </div>
                  <Link href={`/shop?category=${activeCategory.id}`} className="group/all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#A4143D] transition-colors">
                    View Entire Vault <MoveRight size={18} className="group-hover/all:translate-x-2 transition-transform" />
                  </Link>
                </div>

                {/* ✨ THE DISCOVERY GRID (Better than Temu) */}
                <div className="grid grid-cols-3 gap-x-12 gap-y-14">
                  {activeCategory.children.map((sub) => (
                    <div key={sub.slug} className="flex flex-col gap-6">

                      <h4 className="flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-[#A4143D]" />
                        <span className="font-black text-[10px] text-slate-900 uppercase tracking-[0.2em] italic">
                          {sub.name}
                        </span>
                      </h4>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                        {sub.items.map((item, idx) => {
                          const isObject = typeof item !== "string";
                          const name = isObject ? item.name : item;
                          const slug = isObject ? item.slug : name.toLowerCase().replace(/ /g, "-");
                          const img = isObject ? item.img : "/placeholder.png";

                          return (
                            <Link
                              key={idx}
                              href={`/shop?category=${activeCategory.id}&sub=${sub.slug}&item=${slug}`}
                              className="group/item relative flex flex-col gap-3"
                            >
                              <div className="relative aspect-square rounded-[1.5rem] bg-slate-50 overflow-hidden border border-transparent group-hover/item:border-[#A4143D]/20 group-hover/item:shadow-2xl group-hover/item:shadow-[#A4143D]/10 transition-all duration-500">
                                <Image
                                  src={img}
                                  alt={name}
                                  fill
                                  className="object-contain p-4 mix-blend-multiply transition-transform duration-700 group-hover/item:scale-110 group-hover/item:rotate-2"
                                />
                                {isObject && item.hot && (
                                  <div className="absolute top-2 right-2 bg-black text-white text-[7px] px-2 py-1 rounded-full font-[1000] uppercase tracking-tighter">
                                    Top 1%
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col px-1">
                                <span className="text-[11px] font-bold text-slate-600 group-hover/item:text-[#A4143D] transition-colors leading-tight line-clamp-1">
                                  {name}
                                </span>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5 group-hover/item:text-slate-400 transition-colors">Shop Item</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ⚡ PREMIUM FINISHER (Cinematic Promo) */}
          <div className="p-8 bg-gray-50/50 border-t border-gray-100">
            <Link
              href={`/shop?category=${activeCategory.id}`}
              className="relative w-full h-24 rounded-[2rem] overflow-hidden flex items-center bg-zinc-900 group shadow-2xl"
            >
              <Image
                src={(activeCategory.children?.[0]?.items?.[0] as MegaMenuItem)?.img || "/placeholder.png"}
                alt="" fill className="object-cover opacity-30 blur-[2px] group-hover:blur-0 group-hover:scale-105 transition-all duration-1000"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#A4143D] via-[#A4143D]/60 to-transparent" />

              <div className="relative z-10 px-10 flex justify-between w-full items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    <span className="text-[10px] text-white/80 font-black uppercase tracking-[0.4em]">
                      Live_Update
                    </span>
                  </div>
                  <h3 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter">
                    Season Launch: {activeCategory.name}
                  </h3>
                </div>

                <div className="bg-white text-slate-900 px-8 py-3 rounded-2xl text-[11px] font-[1000] uppercase tracking-widest flex items-center gap-3 group-hover:bg-[#A4143D] group-hover:text-white transition-all shadow-xl active:scale-95">
                  Enter Collection <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}