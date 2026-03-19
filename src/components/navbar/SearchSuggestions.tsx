// src/components/navbar/SearchSuggestions.tsx
'use client';

import { TrendingUp, Clock, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';

const TRENDING = [
  "Vintage Wall Clocks", "Industrial Lamps", "Handmade Pottery", "Leather Artifacts", "Minimalist Desks"
];

const RECENT = ["Artifacts", "Home Decor"];

export function SearchSuggestions({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-[110%] left-0 w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 rounded-2xl z-[250] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* 1. RECENT SEARCHES */}
      <div className="p-4 border-b border-gray-50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Searches</span>
          <button className="text-[10px] font-bold text-[#A4143D] hover:underline">Clear All</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {RECENT.map((item) => (
            <Link 
              key={item} 
              href={`/search?q=${item}`}
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-bold text-gray-600 transition-colors"
            >
              <Clock size={12} /> {item}
            </Link>
          ))}
        </div>
      </div>

      {/* 2. TRENDING NOW - Rule 5 (Dopamine Trigger) */}
      <div className="p-4 bg-white">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Trending Now</span>
        <div className="space-y-1">
          {TRENDING.map((item, idx) => (
            <Link 
              key={item}
              href={`/search?q=${item}`}
              onClick={onClose}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black ${idx < 3 ? 'text-[#A4143D]' : 'text-gray-300'}`}>
                  0{idx + 1}
                </span>
                <span className="text-sm font-bold text-gray-700 group-hover:text-black">{item}</span>
              </div>
              <TrendingUp size={14} className="text-gray-300 group-hover:text-[#A4143D]" />
            </Link>
          ))}
        </div>
      </div>

      {/* 3. CATEGORY QUICK-LINK */}
      <div className="p-4 bg-gray-50/50 flex justify-between items-center group cursor-pointer" onClick={onClose}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
             <Search size={14} className="text-[#A4143D]" />
          </div>
          <span className="text-xs font-black text-gray-800">Explore All Categories</span>
        </div>
        <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
      </div>

    </div>
  );
}