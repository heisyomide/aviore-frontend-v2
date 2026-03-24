'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useMemo } from 'react';
import { AccountMenu } from './AccountMenu'; 

export function MobileHeader({ openSidebar }: { openSidebar: () => void }) {
  const { items } = useCartStore();
  const cartCount = useMemo(() => items.reduce((a, b) => a + b.quantity, 0), [items]);

  const subCats = ["All", "Men", "Women", "Health", "Home", "Pets", "Electronics"];

  return (
    <div className="md:hidden flex flex-col w-full bg-white sticky top-0 z-[200]">
      {/* Primary Row: Optimized for Maximum Space */}
      <div className="flex items-center px-3 py-3 gap-2 border-b border-gray-50">
        


        {/* 2. LOGO: Compact Version */}
        <Link href="/" className="shrink-0">
          <span className="text-xl font-black tracking-tighter text-zinc-900 uppercase italic">
            Avior<span className="text-[#A4143D]">è</span>
          </span>
        </Link>

        {/* 3. SEARCH BAR: Responsive Width */}
        <div className="flex-1 min-w-[100px] bg-gray-100 h-9 rounded-2xl flex items-center px-3 gap-1.5 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-200">
          <Search size={14} className="text-gray-400 shrink-0"/>
          <input 
            placeholder="Search..." 
            className="bg-transparent text-[11px] outline-none w-full font-bold text-zinc-800 placeholder:text-gray-400" 
          />
        </div>

        {/* 4. SYSTEM ACTIONS: Profile & Cart */}
        <div className="flex items-center gap-1 shrink-0">
          <AccountMenu />


        {/* 1. MENU TRIGGER */}
        <button onClick={openSidebar} className="shrink-0 p-1 text-zinc-900 active:scale-90 transition-transform">
          <Menu size={22} strokeWidth={2.5} />
        </button>

        
          <Link href="/cart" className="relative p-1.5 active:scale-95 transition-transform">
            <ShoppingCart size={20} className="text-zinc-800" strokeWidth={2.5}/>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#A4143D] text-white text-[7px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* 5. Horizontal Scrollable Bar */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
        {subCats.map((cat, i) => (
          <span key={cat} className={`shrink-0 whitespace-nowrap transition-colors ${i === 0 ? "text-[#A4143D] border-b-2 border-[#A4143D] pb-1" : "hover:text-zinc-900"}`}>
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}