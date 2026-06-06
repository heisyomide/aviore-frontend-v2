'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { ChevronDown, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  MARKETPLACE_CATEGORIES,
  MarketplaceCategory,
} from '@/src/data/category.data';

export function CategoryMegaMenu() {
  const [activeCategory, setActiveCategory] =
    useState<MarketplaceCategory>(MARKETPLACE_CATEGORIES[0]);

  return (
    <div className="relative group">
      {/* TRIGGER */}
      <button className="flex items-center gap-2 py-5 text-[13px] font-black uppercase tracking-wider text-black hover:text-[#A4143D] transition-all cursor-pointer">
        Categories
        <ChevronDown
          size={14}
          className="group-hover:rotate-180 transition-transform duration-300"
        />
      </button>

      {/* MEGA MENU */}
      <div className="absolute left-0 top-full hidden group-hover:flex w-[1100px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden z-50">
        
        {/* LEFT CATEGORY LIST */}
        <div className="w-[260px] bg-gray-50/50 border-r border-gray-100 p-3">
          {MARKETPLACE_CATEGORIES.map((category) => (
            <button
              key={category.slug}
              onMouseEnter={() => setActiveCategory(category)}
              className={`
                w-full text-left px-5 py-4 rounded-2xl mb-2 transition-all flex items-center justify-between cursor-pointer
                ${activeCategory.slug === category.slug
                  ? 'bg-white text-[#A4143D] shadow-sm ring-1 ring-black/5'
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'}
              `}
            >
              <span className="font-black text-[13px] uppercase tracking-tight">
                {category.name}
              </span>

              {activeCategory.slug === category.slug && (
                <motion.div layoutId="active-category">
                  <ArrowRight size={15} />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col h-[620px]">
          
          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-8 bg-white no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 gap-x-10 gap-y-12"
              >
                {activeCategory.children.map((group) => (
                  <div key={group.slug} className="flex flex-col gap-5">
                    
                    {/* GROUP TITLE */}
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                      <span className="w-1 h-4 rounded-full bg-[#A4143D]" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        {group.name}
                      </h4>
                    </div>

                    {/* ITEMS */}
                    <div className="flex flex-col gap-3">
                      {group.children.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/category/${activeCategory.slug}/${group.slug}/${item.slug}`}
                          className="flex items-center gap-3 group/item active:scale-95 transition-all p-1 rounded-xl hover:bg-zinc-50/80"
                        >
                          {/* 🎯 SUB-CATEGORY IMAGE THUMBNAIL CONTAINER */}
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 border border-gray-100 shrink-0 group-hover/item:border-[#A4143D]/30 flex items-center justify-center">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="44px"
                                className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                              />
                            ) : (
                              /* Clean typography fallback if string asset is missing */
                              <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-tighter">
                                {item.name.slice(0, 2)}
                              </span>
                            )}
                          </div>

                          {/* TEXT */}
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-slate-700 group-hover/item:text-[#A4143D] transition-colors">
                              {item.name}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* FOOTER BANNER */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100">
            <Link
              href={`/category/${activeCategory.slug}`}
              className="relative w-full h-32 rounded-3xl overflow-hidden group flex items-center bg-black shadow-lg block"
            >
              <Image
                src={activeCategory.banner}
                alt={activeCategory.name}
                fill
                sizes="(max-width: 1200px) 100vw, 800px"
                className="object-cover opacity-50 group-hover:scale-105 transition duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#A4143D]/90 to-transparent" />

              <div className="relative z-10 flex justify-between items-center w-full px-8">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 w-fit">
                    <Zap size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">
                      Premium Collection
                    </span>
                  </div>

                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
                    {activeCategory.name}
                  </h3>

                  <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">
                    Verified Vendors • Curated Products
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl group-hover:bg-[#A4143D] group-hover:text-white transition-all">
                  Explore
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}