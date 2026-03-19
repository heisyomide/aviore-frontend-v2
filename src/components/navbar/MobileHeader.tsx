'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, MoreHorizontal, User } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useMemo } from 'react';

export function MobileHeader({ openSidebar }: { openSidebar: () => void }) {
  const { items } = useCartStore();
  const cartCount = useMemo(() => items.reduce((a, b) => a + b.quantity, 0), [items]);

  const subCats = ["All", "Men", "Women", "Health", "Home", "Pets", "Electronics"];

  return (
    <div className="md:hidden flex flex-col w-full bg-white">
      {/* Primary Row */}
      <div className="flex items-center justify-between px-4 py-3 gap-3 border-b border-gray-50">
        <Link href="/">
          <Image src="/aviore marketplace.png" alt="logo" width={90} height={32} className="object-contain" />
        </Link>
        
        <div className="flex-1 bg-gray-100 h-9 rounded-full flex items-center px-4 gap-2">
          <Search size={14} className="text-gray-400"/>
          <input 
            placeholder="Search..." 
            className="bg-transparent text-[13px] outline-none w-full font-medium" 
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={openSidebar} className="p-1.5 hover:bg-gray-50 rounded-full">
            <MoreHorizontal size={22} className="text-gray-700"/>
          </button>
          <Link href="/cart" className="relative p-1.5">
            <ShoppingCart size={22} className="text-gray-700"/>
            <span className="absolute top-0 right-0 bg-orange-600 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
      
      {/* 🚀 Horizontal Scrollable Bar */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight border-b border-gray-50">
        {subCats.map((cat, i) => (
          <span key={cat} className={`shrink-0 whitespace-nowrap ${i === 0 ? "text-black border-b-2 border-black pb-1" : ""}`}>
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}