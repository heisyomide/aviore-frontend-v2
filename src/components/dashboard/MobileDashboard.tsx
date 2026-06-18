'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Package,
  Heart,
  Ticket,
  MapPin,
  ChevronRight,
  User,
  MessageSquare,
  LogOut,
  ShoppingBag,
  Shield,
  Star,
  Bell,
  Menu,
  Compass,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/src/store/useWishlistStore';
import { api } from '@/src/lib/axios';

interface MobileDashboardProps {
  data: any; // user/profile data
}

export function MobileDashboard({ data }: MobileDashboardProps) {
  const [couponCount, setCouponCount] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Welcome back,';
    if (hour < 17) return 'Welcome back,';
    return 'Welcome back,';
  }, []);

  const fullName = useMemo(() => {
    return data?.name || `${data?.firstName || ''} ${data?.lastName || ''}`.trim() || 'Adaeze Okafor';
  }, [data]);

  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await api.get('/vendor/marketing/active');
        if (Array.isArray(response.data)) {
          setCouponCount(response.data.length);
        }
      } catch (err) {
        console.error("Coupon_Sync_Error", err);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-[#E4E4E7] pb-28 font-sans antialiased selection:bg-[#C5A880]/30">
      
      {/* GLOBAL BRAND TOP NAVIGATION */}
      <nav className="flex items-center justify-between px-4 py-4 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#1A1A1A] sticky top-0 z-40">
        <button className="text-[#C5A880] hover:text-white transition-colors">
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <div className="text-center">
          <span className="text-xs font-serif tracking-[0.4em] text-white uppercase font-bold">AVIORÈ</span>
        </div>
        <button className="text-[#C5A880] hover:text-white transition-colors relative">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#C5A880] rounded-full" />
        </button>
      </nav>

      {/* IDENTITY PROFILE STATEMENT */}
      <header className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full border border-[#C5A880]/40 overflow-hidden bg-zinc-900 shrink-0">
            <Image 
              src={data?.avatarUrl || "/api/placeholder/48/48"} 
              alt="Profile" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] text-zinc-500 font-medium tracking-wide">{greeting}</p>
            <h2 className="text-base font-semibold text-white tracking-wide">{fullName}</h2>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded">
              <span className="text-[8px] font-bold text-[#C5A880] tracking-[0.1em] uppercase">♦ GOLD MEMBER</span>
            </div>
          </div>
        </div>
      </header>

      {/* ACCOUNT ACCOUNT OVERVIEW DISPLAY MATRIX */}
      <main className="px-4 mt-6 space-y-6">
        <section className="space-y-3">
          <p className="text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">Account Overview</p>
          <div className="grid grid-cols-2 gap-3">
            <OverviewMetricCard title="Total Orders" value={data?._count?.orders || 12} />
            <OverviewMetricCard title="Delivered" value={data?.deliveredCount || 8} />
            <OverviewMetricCard title="Processing" value={data?.processingCount || 3} />
            <OverviewMetricCard title="Total Spent" value={`₦${(data?.totalSpent || 1248500).toLocaleString()}`} isGold />
          </div>
        </section>

        {/* RECENT OPERATIONAL PIPELINE (ORDERS) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">Recent Order</p>
            <Link href="/dashboard/orders" className="text-[10px] text-[#C5A880] font-medium hover:underline">
              View all
            </Link>
          </div>

          <div className="bg-[#0E0E10] border border-[#1A1A1D] rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-14 bg-zinc-900 rounded-lg overflow-hidden border border-[#1F1F23] shrink-0 relative">
                <Image src="/api/placeholder/48/56" alt="Product" fill className="object-cover" />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-semibold text-white tracking-wide truncate">AVR-2405187</p>
                <p className="text-[10px] text-zinc-500">May 18, 2024 • 3 Items</p>
                <span className="inline-block text-[8px] font-bold tracking-wider px-2 py-0.5 rounded bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20 uppercase">
                  Processing
                </span>
              </div>
            </div>
            <p className="text-xs font-bold text-white tracking-wide shrink-0">₦278,500</p>
          </div>
        </section>

        {/* QUICK HARDWARE LINK TILES */}
        <section className="space-y-3">
          <p className="text-[10px] font-semibold text-zinc-500 tracking-wider uppercase">Quick Actions</p>
          <div className="grid grid-cols-4 gap-2">
            <ActionShortcutTile icon={<Package size={16} />} label="Track Order" href="/dashboard/orders" />
            <ActionShortcutTile icon={<ShoppingBag size={16} />} label="Browse Stores" href="/dashboard/stores" />
            <ActionShortcutTile icon={<Ticket size={16} />} label="Coupons" href="/dashboard/coupons" />
            <ActionShortcutTile icon={<MapPin size={16} />} label="Addresses" href="/dashboard/addresses" />
          </div>
        </section>
      </main>

      {/* SYSTEM PERSISTENT BOTTOM NAVIGATION MAT */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0C0C0E]/95 backdrop-blur-lg border-t border-[#1A1A1E] px-3 py-2 flex items-center justify-between z-50">
        <BottomTabItem icon={<ShoppingBag size={18} />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
        <BottomTabItem icon={<Package size={18} />} label="Orders" active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} />
        <BottomTabItem icon={<Compass size={18} />} label="Stores" active={activeTab === 'Stores'} onClick={() => setActiveTab('Stores')} />
        <BottomTabItem icon={<User size={18} />} label="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
      </footer>
    </div>
  );
}

/* --- AVIORÈ VISUAL LANGUAGE COMPONENT SUB-SYSTEMS --- */

function OverviewMetricCard({ title, value, isGold = false }: { title: string; value: string | number; isGold?: boolean }) {
  return (
    <div className="bg-[#0E0E10] border border-[#1A1A1D] rounded-xl p-4 space-y-1.5">
      <p className="text-[10px] text-zinc-500 font-medium tracking-wide">{title}</p>
      <p className={`text-base font-bold tracking-wide ${isGold ? 'text-[#C5A880]' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

function ActionShortcutTile({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link 
      href={href} 
      className="bg-[#0E0E10] border border-[#1A1A1D] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 active:bg-[#1A1A1D] transition-colors"
    >
      <div className="text-[#C5A880]">{icon}</div>
      <p className="text-[9px] font-medium text-zinc-400 tracking-wide leading-tight">{label}</p>
    </Link>
  );
}

function BottomTabItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors"
    >
      <div className={`transition-colors duration-200 ${active ? 'text-[#C5A880]' : 'text-zinc-600'}`}>
        {icon}
      </div>
      <span className={`text-[8px] tracking-wider font-medium transition-colors duration-200 ${active ? 'text-white font-semibold' : 'text-zinc-600'}`}>
        {label}
      </span>
    </button>
  );
}