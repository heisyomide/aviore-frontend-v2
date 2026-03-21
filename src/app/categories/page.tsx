'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Search, X } from 'lucide-react';
import { MEGA_MENU_DATA, MegaMainCategory, MegaSubCategory, MegaMenuItem } from '../../data/categories';

export default function MobileCategoriesPage() {
  const [activeTab, setActiveTab] = useState<MegaMainCategory>(MEGA_MENU_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // 🚀 LIVE SEARCH FILTER LOGIC
  // This filters the sub-categories and items based on what you type
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
      .filter((sub) => sub.items.length > 0); // Only show sub-groups that have matches
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. FUNCTIONAL SEARCH HEADER */}
      <div className="sticky top-0 z-50 bg-white p-3 border-b border-gray-100 shadow-sm">
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all duration-300 ${
          searchQuery ? 'border-[#A4143D] bg-white' : 'border-gray-100 bg-gray-50'
        }`}>
          <Search size={16} className={searchQuery ? 'text-[#A4143D]' : 'text-gray-400'} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${activeTab.name}...`} 
            className="bg-transparent outline-none text-xs w-full font-medium text-[#111] placeholder:text-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 p-0.5">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100vh-130px)]">
        
        {/* 2. SLIMMER LEFT SIDEBAR */}
        <div className="w-20 bg-gray-50 border-r border-gray-100 overflow-y-auto no-scrollbar shrink-0">
          {MEGA_MENU_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat);
                setSearchQuery(''); // Optional: Clear search when switching tabs
              }}
              className={`w-full py-4 px-1.5 flex flex-col items-center gap-1.5 transition-all relative ${
                activeTab.id === cat.id ? "bg-white text-[#A4143D]" : "text-gray-400"
              }`}
            >
              {activeTab.id === cat.id && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#A4143D] rounded-r-full" />
              )}
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border transition-all ${
                activeTab.id === cat.id ? "border-[#A4143D] shadow-md" : "border-transparent bg-white shadow-sm"
              }`}>
                <Image 
                  src={(cat.children?.[0]?.items?.[0] as MegaMenuItem)?.img || '/placeholder.png'} 
                  alt={cat.name}
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
              <span className="text-[8px] font-black uppercase text-center leading-tight tracking-tighter">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* 3. TIGHTER RIGHT CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar bg-white">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {searchQuery ? 'Search Results' : activeTab.name}
              </h2>
              {searchQuery && (
                <p className="text-[10px] text-gray-400 font-bold">Found in {activeTab.name}</p>
              )}
            </div>
            {!searchQuery && (
              <Link href={`/category/${activeTab.id}`} className="text-[9px] font-bold text-[#A4143D] uppercase tracking-widest flex items-center gap-1">
                View All <ChevronRight size={10} />
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-8">
            {filteredChildren.length > 0 ? (
              filteredChildren.map((sub: MegaSubCategory) => (
                <div key={sub.slug} className="flex flex-col gap-3">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-l-2 border-[#A4143D] pl-1.5">
                    {sub.name}
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {sub.items.map((item: any, i: number) => {
                      const isObj = typeof item !== 'string';
                      const name = isObj ? item.name : item;
                      const img = isObj ? item.img : '/placeholder.png';
                      const itemSlug = isObj ? item.slug : name.toLowerCase().replace(/ /g, '-');

                      return (
                        <Link 
                          key={i} 
                          href={`/category/${activeTab.id}/${sub.slug}/${itemSlug}`}
                          className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform"
                        >
                          <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-inner relative flex items-center justify-center p-1.5 group-hover:bg-white transition-colors">
                            <Image 
                              src={img} 
                              alt={name} 
                              fill 
                              className="object-contain p-1.5" 
                            />
                          </div>
                          <span className="text-[9px] font-semibold text-center text-slate-700 leading-tight line-clamp-2">
                            {name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center pt-20 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <Search size={30} className="text-gray-200" />
                </div>
                <p className="text-xs font-bold text-gray-400">No items found matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] font-black text-[#A4143D] uppercase underline"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}