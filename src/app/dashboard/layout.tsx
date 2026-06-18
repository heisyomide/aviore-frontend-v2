'use client';

import { ReactNode, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Bell,
  Star,
  User,
  Ticket,
  Store,
  MapPin,
  Shield,
  LifeBuoy,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Package,
} from 'lucide-react';

import { Container } from '../../components/layout/Container';
import { useWishlistStore } from '@/src/store/useWishlistStore';
import { api } from '@/src/lib/axios';

interface DashboardLayoutProps {
  children: ReactNode;
  data?: any; // Profile and user aggregated data context
}

export default function DashboardLayout({ children, data }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('Overview');
  const [couponCount, setCouponCount] = useState(0);

  // Fallback structural mock data to accurately render layout metrics if async context is loading
  const profileName = data?.name || `${data?.firstName || ''} ${data?.lastName || ''}`.trim() || 'Adaeze Okafor';
  
  const userInitials = useMemo(() => {
    if (!profileName) return 'AV';
    const parts = profileName.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return profileName.slice(0, 2).toUpperCase();
  }, [profileName]);

  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await api.get('/vendor/marketing/active');
        if (Array.isArray(response.data)) setCouponCount(response.data.length);
      } catch (err) {
        console.error("Coupon_Sync_Error", err);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div className="min-h-screen bg-[#070708] text-[#E4E4E7] antialiased font-sans selection:bg-[#C5A880]/30">
      
      {/* ========================================== */}
      {/* 1. NATIVE MOBILE APP DASHBOARD OVERLAY      */}
      {/* ========================================== */}
      <div className="block lg:hidden min-h-screen pb-24 bg-[#070708]">
        {/* Top Sticky Luxury Bar */}
        <nav className="flex items-center justify-between px-4 py-4 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[#141416] sticky top-0 z-40">
          <Link href="/" className="text-[#C5A880] flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
            <ArrowLeft size={14} /> Home
          </Link>
          <span className="text-xs font-serif tracking-[0.4em] text-white uppercase font-bold">AVIORÈ</span>
          <button className="text-[#C5A880] relative p-1">
            <Bell size={18} strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C5A880] rounded-full" />
          </button>
        </nav>

        {/* Tab Context Content Root Router Switch */}
        <div className="p-4">
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              {/* Profile Card Fragment Component as per image_0040ff.jpg */}
              <div className="flex items-center gap-3.5 pt-2">
                <div className="relative w-12 h-12 rounded-full border border-[#C5A880]/30 overflow-hidden bg-zinc-900 shrink-0">
                  <Image src={data?.avatarUrl || "/api/placeholder/48/48"} alt="Avatar" fill className="object-cover" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-zinc-500 font-medium tracking-wide">Welcome back,</p>
                  <h2 className="text-base font-semibold text-white tracking-wide">{profileName}</h2>
                  <div className="inline-flex items-center px-1.5 py-0.5 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded">
                    <span className="text-[7.5px] font-bold text-[#C5A880] tracking-[0.1em] uppercase">♦ GOLD MEMBER</span>
                  </div>
                </div>
              </div>

              {/* Grid Metric Matrix */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Account Overview</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4"><p className="text-[9px] text-zinc-500 tracking-wide mb-1">Total Orders</p><p className="text-base font-bold text-white">{data?._count?.orders || 12}</p></div>
                  <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4"><p className="text-[9px] text-zinc-500 tracking-wide mb-1">Delivered</p><p className="text-base font-bold text-white">{data?.deliveredCount || 8}</p></div>
                  <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4"><p className="text-[9px] text-zinc-500 tracking-wide mb-1">Processing</p><p className="text-base font-bold text-white">{data?.processingCount || 3}</p></div>
                  <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4"><p className="text-[9px] text-zinc-500 tracking-wide mb-1">Total Spent</p><p className="text-base font-bold text-[#C5A880]">₦{(data?.totalSpent || 1248500).toLocaleString()}</p></div>
                </div>
              </div>

              {/* Order Manifest Row Component Item */}
              <div className="space-y-3">
                <div className="flex items-center justify-between"><p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Recent Order</p><button onClick={() => setActiveTab('Orders')} className="text-[10px] text-[#C5A880]">View all</button></div>
                <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-14 bg-zinc-900 rounded-lg overflow-hidden border border-[#1C1C21] shrink-0 relative"><Image src="/api/placeholder/48/56" alt="Manifest Item" fill className="object-cover" /></div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-semibold text-white tracking-wide truncate">AVR-2405187</p>
                      <p className="text-[9px] text-zinc-500">May 18, 2024 • 3 Items</p>
                      <span className="inline-block text-[7.5px] font-bold tracking-wider px-2 py-0.5 rounded bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20 uppercase">Processing</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-white shrink-0">₦278,500</p>
                </div>
              </div>

              {/* Utility Shortcut Actions */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Quick Actions</p>
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => setActiveTab('Orders')} className="bg-[#0E0E10] border border-[#161619] rounded-xl p-3 flex flex-col items-center gap-2"><LayoutDashboard size={16} className="text-[#C5A880]" /><span className="text-[8px] text-zinc-400 font-medium">Track Order</span></button>
                  <button onClick={() => setActiveTab('Stores')} className="bg-[#0E0E10] border border-[#161619] rounded-xl p-3 flex flex-col items-center gap-2"><Store size={16} className="text-[#C5A880]" /><span className="text-[8px] text-zinc-400 font-medium">Browse Stores</span></button>
                  <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-3 flex flex-col items-center gap-2"><Ticket size={16} className="text-[#C5A880]" /><span className="text-[8px] text-zinc-400 font-medium">Coupons ({couponCount})</span></div>
                  <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-3 flex flex-col items-center gap-2"><MapPin size={16} className="text-[#C5A880]" /><span className="text-[8px] text-zinc-400 font-medium">Addresses</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Render Fallback Node Engine mapping full native screens directly from children container if not custom caught */}
          {activeTab !== 'Overview' && (
            <div className="bg-[#0E0E10] border border-[#161619] rounded-2xl p-4 min-h-[70vh]">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-900">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">{activeTab} Panel</h3>
              </div>
              {children}
            </div>
          )}
        </div>

        {/* Global Fixed Application Mobile Bottom Navigation Bar Layout */}
        <footer className="fixed bottom-0 left-0 right-0 bg-[#0A0A0C]/95 backdrop-blur-lg border-t border-[#141416] px-4 py-2 flex items-center justify-between z-50">
          <button onClick={() => setActiveTab('Overview')} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab === 'Overview' ? 'text-[#C5A880]' : 'text-zinc-600'}`}><LayoutDashboard size={18} /><span className="text-[8px] tracking-wider font-medium">Overview</span></button>
          <button onClick={() => setActiveTab('Orders')} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab === 'Orders' ? 'text-[#C5A880]' : 'text-zinc-600'}`}><ShoppingBag size={18} /><span className="text-[8px] tracking-wider font-medium">Orders</span></button>
          <button onClick={() => setActiveTab('Stores')} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab === 'Stores' ? 'text-[#C5A880]' : 'text-zinc-600'}`}><Store size={18} /><span className="text-[8px] tracking-wider font-medium">Stores</span></button>
          <button onClick={() => setActiveTab('Profile')} className={`flex flex-col items-center gap-1 flex-1 py-1 ${activeTab === 'Profile' ? 'text-[#C5A880]' : 'text-zinc-600'}`}><User size={18} /><span className="text-[8px] tracking-wider font-medium">Profile</span></button>
        </footer>
      </div>

      {/* ========================================== */}
      {/* 2. REFACTORED DESKTOP EXECUTIVE SYSTEM PANELS */}
      {/* ========================================== */}
      <div className="hidden lg:block">
        {/* Global Desktop Header Layout Panel */}
        <header className="border-b border-[#141416] bg-[#0A0A0C]/80 backdrop-blur-md sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
          {/* Replaced the old sidebar content inside header with a premium redirect link context */}
          <Link 
            href="/" 
            className="group flex items-center gap-2.5 text-[10px] font-bold text-zinc-400 hover:text-[#C5A880] uppercase tracking-[0.2em] transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Homepage</span>
          </Link>
          
          <div className="text-center">
            <span className="text-sm font-serif tracking-[0.5em] text-white uppercase font-extrabold">AVIORÈ</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] font-semibold text-white tracking-wide">{profileName}</p>
              <p className="text-[8px] text-[#C5A880] font-bold uppercase tracking-wider">Gold Member Platform</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-[#1C1C21] flex items-center justify-center text-xs font-bold text-white shrink-0">
              {userInitials}
            </div>
          </div>
        </header>

        <Container className="pt-8 pb-16 max-w-7xl mx-auto px-8">
          <main className="w-full">
            {/* The structural page panel frame scales across the complete viewport width natively */}
            <div className="bg-[#0A0A0C] border border-[#141416] rounded-2xl overflow-hidden min-h-[80vh] shadow-2xl flex flex-col">
              
              {/* Dynamic Action Subheader Indicator Line */}
              <div className="px-8 py-5 border-b border-[#141416]/60 bg-[#0E0E11]/40 backdrop-blur-md flex items-center justify-between">
                <div className="space-y-0.5">
                  <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                    {pathname.split('/').pop()?.replace('-', ' ') || 'Overview Ledger'}
                  </h1>
                  <p className="text-[8px] text-zinc-600 uppercase tracking-widest">
                    Secure Dashboard Node // Server Environment Authenticated
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-zinc-400 bg-black/40 px-3 py-1.5 border border-[#141416] rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Session Active</span>
                </div>
              </div>

              {/* Master Children Render Port View */}
              <div className="p-8 md:p-10 flex-1 flex flex-col bg-transparent">
                {children}
              </div>
            </div>
          </main>
        </Container>
      </div>
    </div>
  );
}