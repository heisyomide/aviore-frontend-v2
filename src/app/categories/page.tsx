'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ListFilter, Star, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MARKETPLACE_CATEGORIES, 
  MarketplaceCategory, 
  CategoryGroup, 
  CategoryItem 
} from '@/src/data/category.data';
import { Navbar } from '@/src/components/navbar/Navbar';

export default function MobileCategoriesPage() {
  const [activeTab, setActiveTab] = useState<MarketplaceCategory>(MARKETPLACE_CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 🚀 LIVE SEARCH FILTER LOGIC (Adapted for MarketplaceCategory structure)
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return activeTab.children;
    const query = searchQuery.toLowerCase();

    return activeTab.children
      .map((group) => ({
        ...group,
        children: group.children.filter((item) =>
          item.name.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.children.length > 0);
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-24 select-none overflow-hidden font-sans">
      <Navbar />

      {/* 🧭 1. SEARCH HEADER */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md p-3 border-b border-gray-100 flex items-center gap-3">
        <div className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-300 ${
          searchQuery ? 'border-[#A4143D] bg-white shadow-sm' : 'border-gray-100 bg-gray-50'
        }`}>
          <Search size={16} className={searchQuery ? 'text-[#A4143D]' : 'text-gray-400'} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${activeTab.name}...`} 
            className="bg-transparent outline-none text-[11px] w-full font-bold text-slate-900 placeholder:text-gray-400"
          />
          {searchQuery && (
            <X size={14} className="text-gray-400" onClick={() => setSearchQuery('')} />
          )}
        </div>
        
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="p-2.5 bg-slate-900 rounded-xl text-white active:scale-95 transition-transform relative"
        >
          <ListFilter size={18} />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#A4143D] rounded-full border-2 border-white" />
        </button>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        
        {/* 🏛️ 2. LEFT SIDEBAR (Category Switcher) */}
        <div className="w-20 bg-gray-50 border-r border-gray-100 overflow-y-auto no-scrollbar shrink-0">
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => { setActiveTab(cat); setSearchQuery(''); }}
              className={`w-full py-6 px-1 flex flex-col items-center gap-2 transition-all relative ${
                activeTab.slug === cat.slug ? "bg-white text-[#A4143D]" : "text-gray-400"
              }`}
            >
              {activeTab.slug === cat.slug && (
                <motion.div 
                  layoutId="activeBar"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-[#A4143D] rounded-r-full" 
                />
              )}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden border-2 transition-all duration-500 ${
                activeTab.slug === cat.slug ? "border-[#A4143D] shadow-lg rotate-3" : "border-transparent bg-white shadow-sm"
              }`}>
                <Image 
                  src={cat.banner} 
                  alt={cat.name} width={48} height={48} className="object-cover"
                />
              </div>
              <span className="text-[7px] font-black uppercase text-center leading-tight tracking-widest">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* 🎯 3. RIGHT CONTENT AREA */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
          {/* CATEGORY HERO */}
          <div className="p-4">
            <div className="relative h-28 w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <Image 
                src={activeTab.banner} 
                alt="hero" fill className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-center">
                <p className="text-[8px] font-black text-[#A4143D] uppercase tracking-[0.2em] mb-1">AVIORÈ COLLECTION</p>
                <h2 className="text-lg font-black text-white uppercase italic tracking-tighter">
                  {activeTab.name}
                </h2>
              </div>
            </div>
          </div>

          {/* GRID CONTENT */}
          <div className="px-4 pb-10">
            <div className="flex flex-col gap-10">
              {filteredGroups.map((group: CategoryGroup) => (
                <div key={group.slug} className="flex flex-col gap-5">
                  {/* Group Header */}
                  <div className="flex justify-between items-end border-b border-gray-50 pb-2">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A4143D]" />
                      {group.name}
                    </h3>
                    <Link href={`/shop?category=${activeTab.slug}&group=${group.slug}`} className="text-[8px] font-bold text-gray-400 uppercase flex items-center">
                      Explore <ChevronRight size={10} />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-x-3 gap-y-6">
                    {group.children.map((item: CategoryItem) => {
                      const shopUrl = `/shop?category=${activeTab.slug}&group=${group.slug}&item=${item.slug}`;

                      return (
                        <Link 
                          key={item.slug} 
                          href={shopUrl}
                          className="flex flex-col gap-2 active:scale-95 transition-transform group"
                        >
                          <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative shadow-sm group-hover:border-[#A4143D]/30 transition-all">
                            <Image 
                              src="/placeholder.png" // Update this when you have specific item icons
                              alt={item.name} 
                              fill 
                              className="object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity" 
                            />
                          </div>
                          
                          <span className="text-[9px] font-black text-slate-700 text-center uppercase tracking-tighter leading-tight group-hover:text-[#A4143D]">
                            {item.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* EMPTY STATE */}
              {filteredGroups.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                  <Search size={40} className="mb-4 text-gray-300" />
                  <p className="text-xs font-black uppercase italic tracking-widest text-slate-900">No matches found</p>
                  <p className="text-[10px] font-medium text-gray-400 mt-1">Try searching for something else</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 THE FILTER BOTTOM SHEET */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[101] max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-4 mb-2" />
              
              <div className="p-8 overflow-y-auto no-scrollbar pb-32">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Refine</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Luxury Marketplace Filters</p>
                  </div>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2.5 bg-gray-100 rounded-full text-slate-900">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-col gap-10">
                  {/* 1. Sort By */}
                  <div>
                    <h4 className="text-[10px] font-black text-[#A4143D] uppercase tracking-[0.2em] mb-5">Sort By</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {['Popular', 'Newest', 'Price: Low', 'Price: High'].map((opt) => (
                        <button key={opt} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${opt === 'Popular' ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Price Range */}
                  <div>
                    <h4 className="text-[10px] font-black text-[#A4143D] uppercase tracking-[0.2em] mb-5">Price Range (₦)</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Minimum</p>
                        <input type="number" placeholder="0" className="bg-transparent w-full text-sm font-black text-slate-900 outline-none" />
                      </div>
                      <div className="w-4 h-0.5 bg-gray-200" />
                      <div className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Maximum</p>
                        <input type="number" placeholder="500,000+" className="bg-transparent w-full text-sm font-black text-slate-900 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex gap-4">
                <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Clear</button>
                <button onClick={() => setIsFilterOpen(false)} className="flex-[2] py-5 bg-[#A4143D] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-transform">Apply Settings</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}