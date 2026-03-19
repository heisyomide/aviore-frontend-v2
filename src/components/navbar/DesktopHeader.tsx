'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronDown, Search, User, ShoppingCart, ThumbsUp, Star, 
  MessageSquare, Package, History, LogOut, 
  Ticket, MapPin, ShieldCheck, Settings, LayoutDashboard, Zap, Clock, TrendingUp
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { CATEGORY_TREE } from '../../data/categories';
import { Container } from '../layout/Container';
import { SearchSuggestions } from './SearchSuggestions'; // 🚀 Molecule we built

export function DesktopHeader({ activeCategory, setActiveCategory, role, firstName, lastName, handleLogout }: any) {
  const { items } = useCartStore();
  const [searchFocused, setSearchFocused] = useState(false);
  
  const cartCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  const initials = useMemo(() => {
    if (!firstName) return '';
    return `${firstName[0]}${lastName?.[0] || ''}`.toUpperCase();
  }, [firstName, lastName]);

  const menuConfigs = {
    customer: [
      { label: "Your orders", href: "/dashboard/orders", icon: Package },
      { label: "Your reviews", href: "/dashboard/reviews", icon: Star },
      { label: "Your profile", href: "/dashboard/profile", icon: User },
      { label: "Coupons & offers", href: "/dashboard/coupons", icon: Ticket },
      { label: "Followed stores", href: "/dashboard/followed", icon: ThumbsUp },
      { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
      { label: "Account security", href: "/dashboard/security", icon: ShieldCheck },
    ],
    vendor: [
      { label: "Seller Panel", href: "/vendor/dashboard", icon: LayoutDashboard },
      { label: "My Inventory", href: "/vendor/products", icon: Package },
      { label: "Shop Orders", href: "/vendor/orders", icon: History },
    ],
    admin: [
      { label: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Manage Vendors", href: "/admin/vendors", icon: User },
      { label: "Platform Settings", href: "/admin/settings", icon: Settings },
    ]
  };

  const currentMenu = menuConfigs[role as keyof typeof menuConfigs] || menuConfigs.customer;

  return (
    <div className="bg-white hidden md:block border-b border-gray-50">
      {/* 🚀 DIM OVERLAY - Triggers when search is focused (Rule 12) */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-[140] pointer-events-none ${searchFocused ? 'opacity-100' : 'opacity-0'}`} />

      <Container className="h-[75px] flex items-center justify-between gap-6 relative z-[150]">
        
        {/* LEFT: BRAND & NAV */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src="/aviore marketplace.png" alt="logo" width={110} height={40} className="object-contain" priority />
          </Link>

          <nav className="flex items-center gap-6 text-[13px] font-bold text-[#222]">
            <Link href="/best-sellers" className="flex items-center gap-1.5 hover:text-[#A4143D] transition-colors"><ThumbsUp size={16}/> Best-Sellers</Link>
            
            <div className="group relative py-6">
              <button className="flex items-center gap-1 group-hover:text-[#A4143D] transition-colors font-black">
                Categories <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300"/>
              </button>
              
              <div className="absolute top-full left-[-150px] hidden group-hover:flex w-[800px] bg-white shadow-2xl border border-gray-100 rounded-b-3xl z-[200] h-[480px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                 <div className="w-[240px] bg-gray-50/50 border-r border-gray-100 p-2 overflow-y-auto">
                    {CATEGORY_TREE.map(cat => (
                      <div key={cat.id} onMouseEnter={() => setActiveCategory(cat)}
                        className={`px-5 py-4 text-[13px] font-black cursor-pointer transition-all rounded-xl mb-1 ${activeCategory.id === cat.id ? "bg-white text-[#A4143D] shadow-sm border-l-4 border-[#A4143D]" : "text-[#555] hover:bg-white hover:text-[#A4143D]"}`}
                      >
                        {cat.name}
                      </div>
                    ))}
                 </div>
                 <div className="flex-1 bg-white p-8 overflow-y-auto no-scrollbar">
                    <h4 className="text-[14px] font-black text-[#111] mb-8 uppercase tracking-widest border-b border-gray-100 pb-3">Discover {activeCategory.name}</h4>
                    <div className="grid grid-cols-3 gap-y-10 gap-x-6">
                      {activeCategory.items.map((item: any, i: number) => (
                        <div key={i} className="flex flex-col items-center gap-3 group/item cursor-pointer">
                          <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 overflow-hidden relative group-hover/item:border-[#A4143D] group-hover/item:scale-110 transition-all duration-500 shadow-sm">
                             <Image src={item.img} alt={item.name} fill className="object-cover" />
                          </div>
                          <span className="text-[11px] font-black text-center text-gray-700 leading-tight group-hover/item:text-[#A4143D]">{item.name}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </nav>
        </div>

        {/* 🚀 CENTER: SMART SEARCH BAR HUB */}
        <div className="flex-1 max-w-[550px] relative">
          <div className={`h-[46px] flex items-center bg-gray-100 rounded-full border-2 transition-all duration-300 overflow-hidden ${searchFocused ? 'border-[#A4143D] bg-white shadow-[0_0_0_4px_rgba(164,20,61,0.1)]' : 'border-transparent'}`}>
            <input 
              type="text" 
              placeholder="Search for unique artifacts..." 
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="flex-1 bg-transparent px-6 text-[14px] font-semibold outline-none text-[#111] placeholder:text-gray-400" 
            />
            <button className="mr-1.5 w-10 h-10 flex items-center justify-center bg-[#111] text-white rounded-full hover:bg-[#A4143D] transition-all active:scale-90 shadow-md">
              <Search size={20}/>
            </button>
          </div>

          {/* Integration of the Molecule built in previous step */}
          <SearchSuggestions isOpen={searchFocused} onClose={() => setSearchFocused(false)} />
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-6 shrink-0">
          
          {/* ACCOUNT DROPDOWN */}
          <div className="group relative py-6">
            <button className="flex items-center gap-3 text-[13px] font-black text-[#222] hover:text-[#A4143D] transition-all">
              <div className="w-9 h-9 rounded-full bg-[#A4143D] text-white flex items-center justify-center font-black text-[11px] shrink-0 border-2 border-white shadow-md ring-1 ring-gray-100">
                {firstName ? initials : <User size={18} />}
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Orders &</span>
                <span className="truncate max-w-[90px]">{firstName || 'Account'}</span>
              </div>
            </button>

            <div className="absolute top-full right-0 hidden group-hover:block w-[320px] bg-white shadow-[0_30px_70px_rgba(0,0,0,0.2)] border border-gray-100 rounded-[24px] z-[200] overflow-hidden p-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 flex items-center gap-4 bg-gray-50 rounded-2xl mb-2">
                <div className="w-12 h-12 rounded-full bg-[#A4143D] text-white flex items-center justify-center font-black text-xl border-2 border-white shadow-lg">
                  {firstName ? initials : <User size={22}/>}
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-black text-[15px] truncate text-[#111]">
                    {firstName ? `${firstName} ${lastName}` : 'Welcome, Guest'}
                  </span>
                  <span className="text-[10px] text-[#A4143D] font-black uppercase tracking-widest">
                    {firstName ? (role || 'Customer') : 'Join Aviore'}
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                {!firstName ? (
                  <Link href="/login" className="flex items-center gap-3 px-4 py-3.5 bg-[#A4143D] text-white rounded-xl justify-center font-black mb-2 hover:bg-black transition-colors shadow-lg shadow-[#A4143D]/20">Sign in / Register</Link>
                ) : (
                  <>
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar py-1">
                      {currentMenu.map((item, idx) => (
                        <Link key={idx} href={item.href} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 rounded-xl transition-all font-bold text-[13px] text-gray-600 hover:text-[#A4143D] group/link">
                          <item.icon size={18} className="text-gray-400 group-hover/link:text-[#A4143D] transition-colors" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-black text-[13px] hover:bg-red-50 rounded-xl transition-all">
                        <LogOut size={18} /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* HELP HUB */}
          <div className="group relative py-6">
             <button className="flex flex-col items-center gap-1 text-[#222] hover:text-[#A4143D] transition-colors">
               <MessageSquare size={24} strokeWidth={2.5}/>
               <span className="text-[10px] font-black uppercase tracking-tighter">Support</span>
             </button>
             <div className="absolute top-full right-[-40px] hidden group-hover:block w-56 bg-white shadow-2xl border border-gray-100 rounded-2xl p-4 animate-in fade-in duration-200">
                <Link href="/help" className="block text-sm font-black hover:text-[#A4143D] mb-3 pb-2 border-b border-gray-50">Customer Service</Link>
                <Link href="/chat" className="block text-sm font-black hover:text-[#A4143D]">Live Chat Support</Link>
             </div>
          </div>

          {/* CART CTA - Rule 2 (8-Point spacing) */}
          <Link href="/cart" className="relative p-3 hover:bg-gray-50 rounded-full transition-all group active:scale-90">
            <ShoppingCart size={26} className="text-[#111] group-hover:text-[#A4143D] transition-colors" />
            <span className="absolute top-1 right-1 bg-[#e01c24] text-white text-[9px] font-black rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center border-2 border-white shadow-md">
              {cartCount}
            </span>
          </Link>
        </div>
      </Container>
    </div>
  );
}