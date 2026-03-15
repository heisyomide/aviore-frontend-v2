'use client';

import { Search, ChevronRight, Home, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShopHeaderProps {
  onSearch: (query: string) => void;
  totalItems?: number;
}

export function ShopHeader({ onSearch, totalItems = 0 }: ShopHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Increased threshold to make transition smoother
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full bg-[#FDFCFB]">
      {/* 1. BREADCRUMBS LAYER */}
      <nav className="max-w-[1400px] mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <Link href="/" className="hover:text-[#A4143D] transition-colors flex items-center gap-1">
          <Home size={10} /> Home
        </Link>
        <ChevronRight size={10} />
        <span className="text-gray-900">Shop</span>
      </nav>

      {/* 2. MAIN HEADER (Sticky with fixed height to prevent shaking) */}
      <header className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-gray-100 shadow-sm' 
          : 'bg-[#FDFCFB] border-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between gap-8">
          
          {/* TITLE SECTION */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
              Shop
            </h1>
            {!isScrolled && (
              <p className="text-[10px] font-medium text-gray-400 mt-1 italic">
                Browse our collection of {totalItems} items
              </p>
            )}
          </div>

          {/* SEARCH TERMINAL (Simplified for E-commerce) */}
          <div className="flex-1 max-w-xl relative group">
            <div className="relative flex items-center bg-gray-50 border border-gray-100 group-focus-within:border-[#A4143D]/30 group-focus-within:bg-white rounded-xl overflow-hidden transition-all duration-300">
              <div className="pl-5 pr-3 text-gray-400 group-focus-within:text-[#A4143D]">
                <Search size={18} />
              </div>
              <input 
                type="text"
                placeholder="Search products..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-transparent py-4 pr-6 text-sm font-medium text-gray-900 placeholder:text-gray-300 outline-none"
              />
              
              {/* ITEM COUNT CHIP */}
              <div className="absolute right-3 hidden sm:flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                <ShoppingBag size={10} className="text-[#A4143D]" />
                <span className="text-[10px] font-bold text-gray-900">{totalItems}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}