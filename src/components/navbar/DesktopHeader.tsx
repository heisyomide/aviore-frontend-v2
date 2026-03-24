'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, ShoppingCart, ThumbsUp, MessageSquare 
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Container } from '../layout/Container';
import { SearchSuggestions } from './SearchSuggestions';
import { AccountMenu } from './AccountMenu'; 
// 🚀 IMPORT THE DEDICATED MEGA MENU COMPONENT
import { CategoryMegaMenu } from './CategoryMegaMenu'; 

export function DesktopHeader() {
  const { items } = useCartStore();
  const [searchFocused, setSearchFocused] = useState(false);
  
  const cartCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  return (
    <div className="bg-white hidden md:block border-b border-gray-100 sticky top-0 z-[150]">
      {/* Search Overlay */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-[140] pointer-events-none ${searchFocused ? 'opacity-100' : 'opacity-0'}`} />

      <Container className="h-[80px] flex items-center justify-between gap-8 relative z-[150]">
        
        {/* 1. BRAND LOGO */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="group flex items-center">
            <span className="text-2xl md:text-[28px] font-bold tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-black">
              Avior<span className="text-[#A4143D]">è</span>
            </span>
          </Link>
          {/* 2. MAIN NAV */}
          <nav className="flex items-center gap-6">
            {/* 🚀 REPLACED MANUAL MAPPING WITH THE COMPONENT */}
            <CategoryMegaMenu />
            
            <Link href="/best-sellers" className="font-black text-[13px] uppercase tracking-wider text-slate-700 hover:text-[#A4143D] transition-all flex items-center gap-2">
              <ThumbsUp size={16} className="text-[#A4143D]" /> Best-Sellers
            </Link>
          </nav>
        </div>

        {/* 3. SEARCH BAR ENGINE */}
        <div className="flex-1 max-w-[500px] relative">
          <div className={`h-[48px] flex items-center bg-gray-50 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${searchFocused ? 'border-[#A4143D] bg-white shadow-xl shadow-[#A4143D]/5' : 'border-transparent'}`}>
            <input 
              type="text" 
              placeholder="Search unique artifacts..." 
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="flex-1 bg-transparent px-6 text-[14px] font-bold outline-none text-slate-900 placeholder:text-slate-400" 
            />
            <button className="mr-1.5 w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-[#A4143D] transition-all shadow-md">
              <Search size={18}/>
            </button>
          </div>
          <SearchSuggestions isOpen={searchFocused} onClose={() => setSearchFocused(false)} />
        </div>

        {/* 4. ACTIONS: ACCOUNT, SUPPORT, CART */}
        <div className="flex items-center gap-3 shrink-0">
          
          <AccountMenu />

          <div className="h-8 w-[1px] bg-gray-100 mx-2" />

          {/* SUPPORT */}
          <div className="group relative py-6">
            <button className="flex flex-col items-center gap-1 text-slate-700 hover:text-[#A4143D] transition-all">
              <MessageSquare size={22} strokeWidth={2.5}/>
              <span className="text-[9px] font-black uppercase tracking-tighter">Support</span>
            </button>
            <div className="absolute top-full right-[-20px] hidden group-hover:block w-52 bg-white shadow-2xl border border-gray-100 rounded-2xl p-3 animate-in fade-in duration-200">
              <Link href="/help" className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all">Customer Service</Link>
              <Link href="/chat" className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#A4143D] hover:bg-[#A4143D]/5 rounded-xl transition-all">Live Chat</Link>
            </div>
          </div>

          {/* CART */}
          <Link href="/cart" className="relative ml-2 p-3 hover:bg-[#A4143D]/5 rounded-2xl transition-all group active:scale-90">
            <ShoppingCart size={24} className="text-slate-900 group-hover:text-[#A4143D] transition-colors" strokeWidth={2.5} />
            <span className="absolute top-1 right-1 bg-[#A4143D] text-white text-[9px] font-black rounded-full min-w-[22px] h-5 px-1 flex items-center justify-center border-2 border-white shadow-lg">
              {cartCount}
            </span>
          </Link>
        </div>

      </Container>
    </div>
  );
}