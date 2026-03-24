'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useMemo } from 'react';
import { AccountMenu } from './AccountMenu'; 

export function MobileHeader({ openSidebar }: { openSidebar: () => void }) {
  const { items } = useCartStore();
  
  const cartCount = useMemo(() => 
    items.reduce((acc, item) => acc + item.quantity, 0), 
  [items]);

  const subCats = ["All", "Men", "Women", "Health", "Home", "Pets", "Electronics"];

  return (
    <div className="md:hidden flex flex-col w-full bg-white sticky top-0 z-[200] shadow-sm">
      
      {/* --- PRIMARY NAVIGATION ROW --- */}
      <div className="flex items-center px-3 h-[64px] gap-2 border-b border-gray-50">
        
        {/* 1. BRAND LOGO (Shrink-0 to prevent squishing) */}
          <Link href="/" className="group flex items-center">
            <span className="text-2xl md:text-[28px] font-bold tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-black">
              Avior<span className="text-[#A4143D]">è</span>
            </span>
          </Link>

        {/* 2. SEARCH BAR (Flexible center) */}
        <div className="flex-1 min-w-[80px] bg-gray-100 h-9 rounded-2xl flex items-center px-3 gap-1.5 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-200">
          <Search size={14} className="text-gray-400 shrink-0" strokeWidth={3} />
          <input 
            type="text"
            placeholder="Search..." 
            className="bg-transparent text-[11px] outline-none w-full font-bold text-zinc-800 placeholder:text-gray-400" 
          />
        </div>

        {/* 3. SYSTEM ACTIONS (Right-aligned) */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* 🚀 ACCOUNT SYSTEM (Ensure AccountMenu uses Click, not Hover) */}
          <AccountMenu />

          {/* SIDEBAR TRIGGER */}
          <button 
            onClick={openSidebar} 
            className="p-2 text-zinc-900 active:bg-gray-100 rounded-xl transition-all"
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>

          {/* CART SYSTEM */}
          <Link href="/cart" className="relative p-2 active:scale-90 transition-transform">
            <ShoppingCart size={22} className="text-zinc-900" strokeWidth={2.5} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0.5 bg-[#A4143D] text-white text-[8px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* --- DISCOVERY SCROLL BAR --- */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar px-4 py-3 bg-white border-b border-gray-50">
        {subCats.map((cat, i) => (
          <Link 
            key={cat} 
            href={`/shop?category=${cat.toLowerCase()}`}
            className={`shrink-0 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all
              ${i === 0 ? "text-[#A4143D] border-b-2 border-[#A4143D] pb-1" : "text-gray-400 hover:text-zinc-900"}
            `}
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}