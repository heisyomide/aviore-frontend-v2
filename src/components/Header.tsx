'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  X,
  Package,
  Star,
  Ticket,
  History,
  MapPin,
  ShieldCheck,
  Bell,
  LogOut,
  MessageSquare,
  Globe,
  Menu,
  MoreHorizontal,
  ThumbsUp,
  Zap,
  PhoneCall,
  LayoutDashboard,
  Settings
} from 'lucide-react';

import { useCartStore } from '../store/useCartStore';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarMenu } from './SidebarMenu';

type Role = 'admin' | 'vendor' | 'customer' | null;

export function Navbar() {
  const { items } = useCartStore();
  const cartCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const router = useRouter();

  const [role, setRole] = useState<Role>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") as Role;
    const storedFirst = localStorage.getItem("firstName");
    const storedLast = localStorage.getItem("lastName");
    if (token) {
      if (storedRole) setRole(storedRole);
      if (storedFirst) setFirstName(storedFirst);
      if (storedLast) setLastName(storedLast);
    }
  }, []);

  const handleLogout = () => {
    ["token", "role", "firstName", "lastName"].forEach(key => localStorage.removeItem(key));
    setRole(null);
    router.push('/');
  };

  const roleMenus = {
    admin: [
      { label: 'System Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={16}/> },
      { label: 'Manage Vendors', href: '/admin/vendors', icon: <User size={16}/> },
    ],
    vendor: [
      { label: 'Seller Panel', href: '/vendor/dashboard', icon: <LayoutDashboard size={16}/> },
      { label: 'My Inventory', href: '/vendor/products', icon: <Zap size={16}/> },
    ],
    customer: [
      { label: 'Account Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16}/> },
      { label: 'Order History', href: '/dashboard/orders', icon: <History size={16}/> },
    ]
  };

  return (
    <>
      <header className="sticky top-0 z-[100] w-full bg-white font-sans border-b border-gray-100">
        
        {/* 1. TOP ANNOUNCEMENT BAR (Temu Black Style) */}
        <div className="bg-[#0a0a0a] text-white py-2 text-[11px] font-semibold">
          <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
            <div className="flex gap-6">
              <span className="flex items-center gap-1.5 text-[#32FF7E]"><Zap size={12} fill="currentColor"/> Free shipping on all orders</span>
              <span className="hidden md:block flex items-center gap-1.5"><History size={12}/> Return within 90d</span>
            </div>
            <div className="flex gap-6 items-center">
              <Link href="/support" className="hover:underline">Support center</Link>
              <Link href="/register-vendor" className="font-bold flex items-center gap-1 text-yellow-400">Sell on Aviore</Link>
            </div>
          </div>
        </div>

        {/* 2. MAIN NAV HUD (Desktop) */}
        <div className="max-w-[1400px] mx-auto px-4 h-[75px] hidden md:flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-8 shrink-0">
            <Link href="/"><Image src="/aviore marketplace.png" alt="logo" width={110} height={40} className="object-contain" /></Link>

            {/* 🔥 DESKTOP QUICK LINKS (Put back exactly as you wanted) */}
            <nav className="flex items-center gap-5 text-[13px] font-bold text-[#222]">
              <Link href="/best-sellers" className="flex items-center gap-1 hover:text-orange-600 transition-colors"><ThumbsUp size={16}/> Best-Sellers</Link>
              <Link href="/5-star" className="flex items-center gap-1 hover:text-orange-600 transition-colors"><Star size={16}/> 5-Star Rated</Link>
              <Link href="/new-in" className="hover:text-orange-600 transition-colors">New In</Link>
              
              {/* CATEGORIES HOVER (Mega Menu Trigger) */}
              <div className="group relative py-4">
                <button className="flex items-center gap-1 hover:text-orange-600 transition-colors">
                  Categories <ChevronDown size={14} className="group-hover:rotate-180 transition-transform"/>
                </button>
                <div className="absolute top-full left-0 hidden group-hover:flex w-[800px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 rounded-b-2xl z-50 overflow-hidden">
                   <div className="w-[240px] bg-gray-50 border-r border-gray-100 p-2 overflow-y-auto max-h-[500px]">
                      {['Home & Kitchen', 'Electronics', 'Women Clothing', 'Men Clothing'].map(cat => (
                        <div key={cat} className="px-4 py-3 text-[13px] font-bold text-[#444] hover:bg-white hover:text-orange-600 cursor-pointer rounded-lg flex justify-between items-center group/item">
                          {cat} <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover/item:opacity-100"/>
                        </div>
                      ))}
                   </div>
                   <div className="flex-1 p-6 grid grid-cols-2 gap-8 bg-white">
                      <div className="space-y-4">
                        <h4 className="text-[13px] font-black text-[#222]">Recommended</h4>
                        <div className="flex items-center gap-3 group/sub cursor-pointer">
                          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden relative"><Image src="/categories/fashion.jpg" fill alt="" className="object-cover"/></div>
                          <span className="text-[12px] font-medium group-hover/sub:text-orange-600">Premium Artifacts</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </nav>
          </div>

          {/* 🚀 COMPACT SEARCH BAR */}
          <div className="flex-1 max-w-[400px] h-[44px] flex items-center bg-gray-100 rounded-full border-2 border-transparent focus-within:border-black focus-within:bg-white transition-all overflow-hidden group mx-4">
            <input type="text" placeholder="gym clothes men" className="flex-1 bg-transparent px-5 text-[14px] font-medium outline-none text-[#222]" />
            <button className="mr-1 w-10 h-10 flex items-center justify-center bg-black text-white rounded-full"><Search size={20}/></button>
          </div>

          {/* RIGHT ACTIONS HUD */}
          <div className="flex items-center gap-6 shrink-0">
            {/* ACCOUNT HOVER MENU */}
            <div className="group relative py-4">
              <button className="flex items-center gap-2 text-[13px] font-bold text-[#222] hover:text-orange-600">
                <User size={20}/>
                <div className="flex flex-col items-start leading-tight">
                   <span className="text-[11px] font-medium text-gray-500">Orders &</span>
                   <span>Account</span>
                </div>
              </button>

              <div className="absolute top-full right-0 hidden group-hover:block w-[320px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.18)] border border-gray-100 rounded-xl pt-2 z-[110]">
                <div className="p-5 flex items-center gap-3 border-b border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-[#A4143D] text-white flex items-center justify-center font-bold">{firstName?.[0] || 'U'}</div>
                  <span className="font-bold text-[15px] truncate">{firstName ? `${firstName} ${lastName}` : 'Sign in / Register'}</span>
                </div>
                <div className="p-2 text-[13px] font-semibold text-[#444] space-y-1">
                  <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg"><Package size={17}/> Your orders</Link>
                  <Link href="/dashboard/reviews" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg"><Star size={17}/> Your reviews</Link>
                  <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg"><User size={17}/> Your profile</Link>
                  <Link href="/coupons" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg"><Ticket size={17}/> Coupons & offers</Link>
                  <Link href="/history" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg"><History size={17}/> Browsing history</Link>
                  <Link href="/dashboard/addresses" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg"><MapPin size={17}/> Addresses</Link>
                  {role && roleMenus[role].map(item => (
                    <Link key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg text-orange-600 font-bold">{item.icon} {item.label}</Link>
                  ))}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold border-t border-gray-50 mt-2 hover:bg-red-50 rounded-b-lg"><LogOut size={17}/> Sign out</button>
                </div>
              </div>
            </div>

            {/* SUPPORT & CART */}
            <div className="flex items-center gap-5">
              <Globe size={22} className="text-gray-600 cursor-pointer hidden lg:block" />
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart size={24} />
                <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center border-2 border-white">{cartCount}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 📱 3. MOBILE HUD (Matches Screenshot exactly) */}
        <div className="md:hidden flex flex-col w-full">
            <div className="flex items-center justify-between px-4 py-3 gap-3 border-b border-gray-50">
                <Link href="/"><Image src="/aviore marketplace.png" alt="logo" width={95} height={35} className="object-contain" /></Link>
                
                <div className="flex-1 bg-gray-100 h-10 rounded-full flex items-center px-4 gap-2">
                    <Search size={16} className="text-gray-400"/>
                    <input type="text" placeholder="Search..." className="bg-transparent text-[13px] outline-none w-full font-medium" />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="p-1"><MoreHorizontal size={22} className="text-gray-700"/></button>
                    <Link href="/dashboard"><User size={22} className="text-gray-700"/></Link>
                    <Link href="/cart" className="relative">
                        <ShoppingCart size={22} className="text-gray-700"/>
                        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
                    </Link>
                </div>
            </div>
            
            {/* Mobile Category Tab Row */}
            <div className="flex gap-6 overflow-x-auto no-scrollbar px-4 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                <span className="text-black border-b-2 border-black pb-1 shrink-0">All</span>
                <span className="shrink-0">Best-Sellers</span>
                <span className="shrink-0">5-Star Rated</span>
                <span className="shrink-0">New In</span>
                <span className="shrink-0">Industrial</span>
            </div>
        </div>
      </header>

      {/* 🚀 SIDEBAR COMPONENT (Exactly as your SidebarMenu expected) */}
      <div className={`fixed inset-y-0 left-0 z-[120] w-[80%] max-w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b bg-[#A4143D] text-white">
          <span className="font-black uppercase text-[10px] tracking-widest">Aviore Registry</span>
          <button onClick={() => setSidebarOpen(false)} className="p-1"><X/></button>
        </div>
        <div className="h-[calc(100vh-60px)] overflow-y-auto">
          <SidebarMenu />
        </div>
      </div>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-[115] backdrop-blur-sm" />}
    </>
  );
}