'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  User,
  ShoppingCart,
  Heart,
  ChevronDown,
  Zap,
  PhoneCall,
  LogOut,
  LayoutGrid,
  X,
  Settings,
  History,
  LayoutDashboard,
  Menu // 🚀 Added only for the mobile trigger
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
  const [adIndex, setAdIndex] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);

  const dropdownCategories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'];
  const adverts = ["🔥 Vendor Registration Now Open", "🚀 Free Listing For New Sellers", "💎 Luxury Deals Available Today", "⚡ Flash Discounts Live Now"];
  const tickerAds = ["⚡ Free delivery on selected products", "🔥 Vendors earn more with Aviore", "💎 Discover premium artifacts today", "🚀 New sellers joining daily"];

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

    const adInterval = setInterval(() => setAdIndex(prev => (prev + 1) % adverts.length), 4000);
    const tickerInterval = setInterval(() => setTickerIndex(prev => (prev + 1) % tickerAds.length), 3500);

    return () => {
      clearInterval(adInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  const handleLogout = () => {
    ["token", "role", "firstName", "lastName"].forEach(key => localStorage.removeItem(key));
    setRole(null);
    setFirstName('');
    setLastName('');
    router.push('/');
  };

  const userInitials = useMemo(() => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  }, [firstName, lastName]);

  const roleMenus = {
    admin: [
      { label: 'System Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={14}/> },
      { label: 'Manage Vendors', href: '/admin/vendors', icon: <User size={14}/> },
      { label: 'Platform Settings', href: '/admin/settings', icon: <Settings size={14}/> },
    ],
    vendor: [
      { label: 'Seller Panel', href: '/vendor/dashboard', icon: <LayoutDashboard size={14}/> },
      { label: 'My Inventory', href: '/vendor/products', icon: <Zap size={14}/> },
      { label: 'Order History', href: '/vendor/orders', icon: <History size={14}/> },
    ],
    customer: [
      { label: 'Account Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14}/> },
      { label: 'Order History', href: '/dashboard/orders', icon: <History size={14}/> },
      { label: 'Profile Settings', href: '/dashboard/profile', icon: <Settings size={14}/> },
    ]
  };

  return (
    <>
      {/* 🚀 SIDEBAR (EXPLORER) */}
      <div className={`fixed inset-y-0 left-0 z-[110] w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 flex justify-between items-center border-b bg-[#A4143D] text-white">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Aviore_Registry</span>
          <button onClick={() => setSidebarOpen(false)}><X size={24}/></button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-70px)] bg-white">
          <SidebarMenu />
        </div>
      </div>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-[105] backdrop-blur-sm" />}

      <header className="sticky top-0 z-[100] w-full bg-white shadow-sm">
        
        {/* 📱 1. MOBILE HUD (Only visible on Mobile) */}
        <div className="md:hidden bg-[#A4143D] px-4 py-3 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-white">
              <Menu size={26} />
            </button>
            <Link href="/" className="flex-1">
              <Image src="/aviore marketplace.png" alt="logo" width={85} height={35} className="brightness-0 invert object-contain" />
            </Link>
            <div className="flex items-center gap-4 text-white">
              {!role ? (
                <Link href="/login"><User size={22} /></Link>
              ) : (
                <button className="w-8 h-8 rounded-full bg-white text-[#A4143D] font-black text-[10px] shadow-lg border-2 border-white/20">{userInitials}</button>
              )}
              <Link href="/cart" className="relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-white text-[#A4143D] text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-[#A4143D]">{cartCount}</span>
              </Link>
            </div>
          </div>
          
          {/* SEARCH TRIGGER - Full Width Mobile */}
          <div className="flex bg-white rounded-xl px-4 py-2.5 items-center gap-2 shadow-inner">
            <Search size={18} className="text-zinc-400" />
            <input type="text" placeholder="Search for artifacts..." className="flex-1 text-sm font-bold outline-none text-zinc-800 placeholder:text-zinc-300" />
          </div>
        </div>

        {/* 💻 2. DESKTOP HUD (Hidden on Mobile) */}
        <div className="hidden md:block">
          {/* TOP INFO BAR */}
          <div className="border-b py-2 bg-zinc-50">
            <div className="max-w-[1750px] mx-auto px-6 flex justify-between text-[10px] font-bold uppercase text-gray-400 tracking-widest">
              <div className="flex gap-8 italic">
                <span className="text-[#A4143D] not-italic font-black italic tracking-tighter">AVIORE_GLOBAL_REGISTRY</span>
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <Link href="/track" className="hover:text-black transition-colors">Track_Order</Link>
                <Link href="/best-sellers" className="hover:text-black transition-colors">Best_Selling</Link>
              </div>
              <div className="flex gap-6 uppercase">
                <span>English</span>
                <span className="text-black font-black">NGN ₦</span>
              </div>
            </div>
          </div>

          {/* MAIN NAVIGATION BAR */}
          <div className="bg-[#A4143D] text-white py-4">
            <div className="max-w-[1750px] mx-auto px-9 flex items-center gap-10">
              <Link href="/"><Image src="/aviore marketplace.png" alt="logo" width={120} height={75} className="brightness-0 invert"/></Link>

              {/* SEARCH ENGINE */}
              <div className="flex-1 flex bg-white rounded-xl overflow-hidden shadow-2xl border-2 border-transparent focus-within:border-zinc-900 transition-all">
                <div className="group relative">
                  <div onClick={() => setSidebarOpen(true)} className="px-6 bg-zinc-100 flex items-center cursor-pointer border-r border-zinc-200 h-full hover:bg-zinc-200 transition-colors">
                    <LayoutGrid size={14} className="mr-2 text-[#A4143D]"/>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">All_Categories</span>
                    <ChevronDown size={14} className="ml-2 text-zinc-400 group-hover:rotate-180 transition-transform" />
                  </div>
                  <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-white shadow-2xl border border-zinc-100 py-2 z-50">
                    {dropdownCategories.map(cat => (
                      <Link key={cat} href={`/shop?category=${cat.toLowerCase()}`} className="block px-6 py-2 text-[10px] font-black text-zinc-500 hover:text-[#A4143D] hover:bg-zinc-50 uppercase border-b border-zinc-50 last:border-0 transition-all">
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
                <input type="text" placeholder="Search for items, brands, and artifacts..." className="flex-1 px-6 text-sm text-black outline-none font-bold placeholder:text-zinc-300" />
                <button className="bg-zinc-900 px-8 hover:bg-black transition-all"><Search size={20}/></button>
              </div>

              <div className="flex gap-8 items-center shrink-0">
                <Link href="/wishlist" className="flex flex-col items-center group">
                  <Heart size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black uppercase mt-1">Wishlist</span>
                </Link>
                <Link href="/cart" className="relative group p-3 bg-white/10 rounded-2xl border border-white/5 hover:bg-white/20 transition-all">
                  <ShoppingCart size={22}/>
                  <span className="absolute -top-2 -right-2 text-[10px] font-black bg-white text-[#A4143D] rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-[#A4143D]">{cartCount}</span>
                </Link>
                
                {/* 🚀 YOUR ORIGINAL LOGIN/ACCOUNT DROPDOWN LOGIC */}
                {!role ? (
                  <Link href="/login" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white hover:opacity-80 transition-all">
                    <User size={18}/> Login
                  </Link>
                ) : (
                  <div className="relative group">
                    <button className="w-10 h-10 rounded-full bg-white text-[#A4143D] font-black text-[11px] shadow-lg border-2 border-white/20">
                      {userInitials}
                    </button>
                    <div className="absolute right-0 hidden group-hover:block pt-3 w-64 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-white shadow-2xl rounded-2xl border border-zinc-100 overflow-hidden p-2 z-[110]">
                        <div className="p-4 bg-zinc-50 border-b rounded-t-xl mb-2 text-zinc-900">
                          <p className="text-xs font-black uppercase italic truncate">{firstName} {lastName}</p>
                          <p className="text-[9px] font-bold text-[#A4143D] uppercase tracking-widest mt-1">{role}_access</p>
                        </div>
                        <div className="space-y-1">
                          {roleMenus[role].map(item => (
                            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-black rounded-xl transition-all">
                               <span className="text-[#A4143D]">{item.icon}</span> {item.label}
                            </Link>
                          ))}
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 mt-2 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-xl border-t border-zinc-50 transition-all">
                          <LogOut size={16}/> Logout_Securely
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUB-NAV DESKTOP */}
          <div className="bg-white border-b py-1">
            <div className="max-w-[1750px] mx-auto px-6 flex justify-between items-center h-14">
              <div className="flex items-center gap-8 h-full">
                <div className="bg-zinc-950 text-white px-6 h-full flex items-center gap-3 rounded-br-2xl shadow-md min-w-[300px]">
                  <Zap size={14} className="text-yellow-400 animate-pulse"/>
                  <span className="text-[10px] font-black uppercase tracking-widest">{adverts[adIndex]}</span>
                </div>
                <nav className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-500 h-full items-center">
                  <Link href="/" className="text-[#A4143D] border-b-2 border-[#A4143D] h-full flex items-center px-1">Home</Link>
                  <Link href="/best-sellers" className="hover:text-black">Best_Selling</Link>
                  <Link href="/5-star" className="hover:text-black">5-Star_Picks</Link>
                </nav>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-[10px] font-black text-[#A4143D] animate-pulse uppercase tracking-widest">
                  {tickerAds[tickerIndex]}
                </div>
                <div className="flex items-center text-[#A4143D] gap-3 border-l border-zinc-100 pl-8 h-8">
                  <PhoneCall size={16}/>
                  <div className="flex flex-col leading-none uppercase">
                    <span className="text-[8px] text-zinc-400 font-black">Support</span>
                    <span className="text-[11px] font-black italic">+234 800 AVIORE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}