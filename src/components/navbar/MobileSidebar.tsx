'use client';

import { X, ChevronRight, LogOut, Package, User, Ticket, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORY_TREE } from '../../data/categories';
import { useMemo } from 'react';

export function MobileSidebar({ open, onClose, activeCategory, setActiveCategory, firstName, lastName, role, handleLogout }: any) {
  
  const initials = useMemo(() => {
    if (!firstName) return '';
    return `${firstName[0]}${lastName?.[0] || ''}`.toUpperCase();
  }, [firstName, lastName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] md:hidden">
      {/* 1. Backdrop - Rule 12 (Polish) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* 2. Sidebar Panel - Rule 13 (Mobile First) */}
      <div className="absolute top-0 left-0 w-[85%] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        
        {/* USER HEADER - Matches Desktop Logic */}
        <div className="bg-[#A4143D] p-6 text-white pt-12 relative overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-full bg-white text-[#A4143D] flex items-center justify-center font-black text-xl shadow-lg border-2 border-white/20">
              {firstName ? initials : <User size={24} />}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg leading-tight truncate max-w-[180px]">
                {firstName ? `Hello, ${firstName}` : 'Welcome to Aviore'}
              </span>
              <Link href="/login" onClick={onClose} className="text-xs font-bold text-white/80 underline decoration-white/40">
                {firstName ? (role || 'Customer Account') : 'Sign in or Register'}
              </Link>
            </div>
          </div>
          
          {/* Decorative background shape */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* 3. NAVIGATION TABS */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column: Root Categories */}
          <div className="w-[110px] bg-gray-50 border-r border-gray-100 overflow-y-auto pt-2">
            {CATEGORY_TREE.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className={`w-full px-2 py-4 flex flex-col items-center gap-2 transition-all ${
                  activeCategory.id === cat.id 
                    ? "bg-white text-[#A4143D] border-l-4 border-[#A4143D]" 
                    : "text-gray-500"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
                  <Image src={cat.items[0]?.img || '/placeholder.png'} alt={cat.name} width={40} height={40} className="object-cover" />
                </div>
                <span className="text-[9px] font-black uppercase text-center leading-tight tracking-tighter">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

          {/* Right Column: Sub-Category Items */}
          <div className="flex-1 bg-white overflow-y-auto p-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Shop {activeCategory.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {activeCategory.items.map((item: any, i: number) => (
                <Link key={i} href={`/search?q=${item.name}`} onClick={onClose} className="flex flex-col items-center gap-2 group">
                  <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group-active:scale-95 transition-transform">
                    <Image src={item.img} alt={item.name} width={150} height={150} className="object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-center text-gray-600 group-active:text-[#A4143D]">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 4. FOOTER ACTIONS */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Link href="/dashboard/orders" onClick={onClose} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 text-[11px] font-bold shadow-sm active:bg-gray-100">
              <Package size={16} className="text-[#A4143D]" /> Orders
            </Link>
            <Link href="/dashboard/coupons" onClick={onClose} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 text-[11px] font-bold shadow-sm active:bg-gray-100">
              <Ticket size={16} className="text-[#A4143D]" /> Coupons
            </Link>
          </div>

          {firstName && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={16} /> Sign Out of Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}