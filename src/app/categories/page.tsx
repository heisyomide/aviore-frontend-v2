'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Zap, ListFilter, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MEGA_MENU_DATA, MegaMainCategory, MegaSubCategory, MegaMenuItem } from '../../data/categories';
import { Navbar } from '@/src/components/navbar/Navbar';

export default function MobileCategoriesPage() {
  const [activeTab, setActiveTab] = useState<MegaMainCategory>(MEGA_MENU_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 🚀 LIVE SEARCH FILTER LOGIC
  const filteredChildren = useMemo(() => {
    if (!searchQuery.trim()) return activeTab.children;
    const query = searchQuery.toLowerCase();
    return activeTab.children
      .map((sub) => ({
        ...sub,
        items: sub.items.filter((item) => {
          const name = typeof item === 'string' ? item : item.name;
          return name.toLowerCase().includes(query);
        }),
      }))
      .filter((sub) => sub.items.length > 0);
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-24 select-none overflow-hidden">
       <Navbar />
      {/* 🧭 1. SEARCH HEADER */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-3 border-b border-gray-100 flex items-center gap-3">
        <div className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-300 ${
          searchQuery ? 'border-[#A4143D] bg-white' : 'border-gray-100 bg-gray-50'
        }`}>
          <Search size={16} className={searchQuery ? 'text-[#A4143D]' : 'text-gray-400'} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab.name}...`} 
            className="bg-transparent outline-none text-xs w-full font-medium text-[#111]"
          />
          {searchQuery && <X size={14} className="text-gray-400" onClick={() => setSearchQuery('')} />}
        </div>
        
        {/* FILTER TRIGGER */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="p-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 active:scale-95 transition-transform relative"
        >
          <ListFilter size={20} />
          <div className="absolute top-0 right-0 w-2 h-2 bg-[#A4143D] rounded-full border border-white" />
        </button>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        
        {/* 🏛️ 2. LEFT SIDEBAR */}
        <div className="w-20 bg-gray-50 border-r border-gray-100 overflow-y-auto no-scrollbar shrink-0">
          {MEGA_MENU_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveTab(cat); setSearchQuery(''); }}
              className={`w-full py-5 px-1.5 flex flex-col items-center gap-2 transition-all relative ${
                activeTab.id === cat.id ? "bg-white text-[#A4143D]" : "text-gray-400"
              }`}
            >
              {activeTab.id === cat.id && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#A4143D] rounded-r-full" />
              )}
              <div className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all ${
                activeTab.id === cat.id ? "border-[#A4143D] shadow-md scale-110" : "border-transparent bg-white shadow-sm"
              }`}>
                <Image 
                  src={(cat.children?.[0]?.items?.[0] as MegaMenuItem)?.img || '/placeholder.png'} 
                  alt={cat.name} width={44} height={44} className="object-cover"
                />
              </div>
              <span className="text-[8px] font-black uppercase text-center leading-tight tracking-tighter">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* 🎯 3. RIGHT CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-0 no-scrollbar bg-white">
          {/* CATEGORY HERO */}
          <div className="p-4">
            <div className="relative h-32 w-full rounded-2xl overflow-hidden group shadow-lg">
              <Image 
                src={(activeTab.children?.[0]?.items?.[0] as MegaMenuItem)?.img || '/placeholder.png'} 
                alt="hero" fill className="object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 p-4 flex flex-col justify-end">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                  {activeTab.name}
                </h2>
              </div>
            </div>
          </div>
{/* GRID */}
<div className="p-4">
  <div className="flex flex-col gap-10">
    {filteredChildren.map((sub: MegaSubCategory) => (
      <div key={sub.slug} className="flex flex-col gap-4">
        {/* Sub-category Header */}
        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-b-2 border-[#A4143D] w-fit pb-1">
          {sub.name}
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {sub.items.map((item: any, i: number) => {
            const isObj = typeof item !== 'string';
            const name = isObj ? item.name : item;
            const img = isObj ? item.img : '/placeholder.png';
            
            // 🚀 REDIRECTION LOGIC:
            // This points to the /shop page and filters by the specific category and sub-category
            // Example: /shop?category=electronics&sub=smartphones
            const itemSlug = isObj ? item.slug : name.toLowerCase().replace(/ /g, '-');
            const shopUrl = `/shop?category=${activeTab.id}&sub=${sub.slug}&item=${itemSlug}`;

            return (
              <Link 
                key={i} 
                href={shopUrl}
                className="flex flex-col gap-2 active:scale-95 transition-transform group"
              >
                <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative shadow-sm group-hover:border-[#A4143D]/30 transition-colors">
                  <Image 
                    src={img} 
                    alt={name} 
                    fill 
                    className="object-contain p-2" 
                  />
                  
                  {/* ⚡ HOT BADGE (for objects with 'hot' property) */}
                  {isObj && item.hot && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter z-10">
                      Hot
                    </div>
                  )}
                </div>
                
                <span className="text-[9px] font-bold text-slate-800 line-clamp-1 group-hover:text-[#A4143D] transition-colors">
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
</div>

      {/* 🚀 THE FILTER BOTTOM SHEET */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            {/* Sheet */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[101] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
              
              <div className="p-6 overflow-y-auto no-scrollbar pb-32">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Refine Selection</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                {/* Filter Sections */}
                <div className="flex flex-col gap-8">
                  {/* 1. Sort By */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sort By</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Popular', 'Newest', 'Price: Low-High', 'Price: High-Low'].map((opt) => (
                        <button key={opt} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${opt === 'Popular' ? 'bg-[#A4143D] border-[#A4143D] text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Ratings */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Rating</h4>
                    <div className="flex flex-col gap-3">
                      {[4, 3, 2].map((star) => (
                        <div key={star} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < star ? "#f59e0b" : "none"} className={i < star ? "text-[#f59e0b]" : "text-gray-300"} />)}
                            <span className="ml-2 text-xs font-bold text-gray-600">& up</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${star === 4 ? "bg-[#A4143D] border-[#A4143D]" : "border-gray-200"}`}>
                            {star === 4 && <Check size={12} className="text-white" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Price Range */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Price Range</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <p className="text-[8px] font-black text-gray-400 uppercase">Min</p>
                        <p className="text-sm font-black text-slate-900">₦0</p>
                      </div>
                      <div className="w-4 h-[2px] bg-gray-200" />
                      <div className="flex-1 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <p className="text-[8px] font-black text-gray-400 uppercase">Max</p>
                        <p className="text-sm font-black text-slate-900">₦500,000+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex gap-4">
                <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Clear All</button>
                <button onClick={() => setIsFilterOpen(false)} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform">Apply Filters</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}