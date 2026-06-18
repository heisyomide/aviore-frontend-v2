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
  Compass,
  Bell,
  Menu,
  Clock,
  MapPinned,
  Headphones,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/src/store/useWishlistStore';
import { api } from '@/src/lib/axios';

interface MobileDashboardProps {
  data: any; // user/profile dashboard payload
}

export function MobileDashboard({ data }: MobileDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'stores' | 'profile'>('overview');
  const [profileView, setProfileView] = useState<'menu' | 'history' | 'notifications' | 'addresses' | 'security' | 'support'>('menu');
  const [couponCount, setCouponCount] = useState(0);

  // Sync active coupon counts
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

  const fullName = useMemo(() => {
    return data?.name || `${data?.firstName || ''} ${data?.lastName || ''}`.trim() || 'Adaeze Okafor';
  }, [data]);

  const accountOverview = useMemo(() => ({
    totalOrders: data?._count?.orders || 12,
    delivered: data?.deliveredCount || 8,
    processing: data?.processingCount || 3,
    totalSpent: data?.totalSpent || 1248500
  }), [data]);

  const { items: wishlistItems } = useWishlistStore();

  // Handle active navigation switching, resetting sub-views automatically
  const handleTabChange = (tab: 'overview' | 'orders' | 'stores' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'profile') setProfileView('menu');
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#E4E4E7] pb-24 font-sans antialiased selection:bg-[#C5A880]/20 select-none">
      
      {/* 1. BRAND GLOBAL HEADER ZONE */}
      <nav className="flex items-center justify-between px-4 py-4 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[#141416] sticky top-0 z-50">
        <button className="text-[#C5A880] hover:text-white transition-colors">
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <div className="text-center">
          <span className="text-xs font-serif tracking-[0.45em] text-white uppercase font-extrabold">AVIORÈ</span>
        </div>
        <button 
          onClick={() => { handleTabChange('profile'); setProfileView('notifications'); }}
          className="text-[#C5A880] hover:text-white transition-colors relative p-1"
        >
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#C5A880] rounded-full" />
        </button>
      </nav>

      {/* 2. TAB VIEWS PORTAL PANEL */}
      <div className="px-4 pt-5">
        
        {/* ========================================================= */}
        {/* TAB A: OVERVIEW MAIN LEDGER WINDOW                         */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Identity Banner */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full border border-[#C5A880]/30 overflow-hidden bg-zinc-900 shrink-0">
                <Image src={data?.avatarUrl || "/api/placeholder/48/48"} alt="Avatar" fill className="object-cover" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-500 font-medium tracking-wide">Welcome back,</p>
                <h2 className="text-base font-semibold text-white tracking-wide">{fullName}</h2>
                <div className="inline-flex items-center px-1.5 py-0.5 bg-[#C5A880]/10 border border-[#C5A880]/20 rounded">
                  <span className="text-[7.5px] font-bold text-[#C5A880] tracking-[0.1em] uppercase">♦ GOLD MEMBER</span>
                </div>
              </div>
            </div>

            {/* Matrix Numerical Metrics */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Account Overview</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4">
                  <p className="text-[9px] text-zinc-500 tracking-wide mb-1">Total Orders</p>
                  <p className="text-base font-bold text-white tracking-wide">{accountOverview.totalOrders}</p>
                </div>
                <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4">
                  <p className="text-[9px] text-zinc-500 tracking-wide mb-1">Delivered</p>
                  <p className="text-base font-bold text-white tracking-wide">{accountOverview.delivered}</p>
                </div>
                <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4">
                  <p className="text-[9px] text-zinc-500 tracking-wide mb-1">Processing</p>
                  <p className="text-base font-bold text-white tracking-wide">{accountOverview.processing}</p>
                </div>
                <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4">
                  <p className="text-[9px] text-zinc-500 tracking-wide mb-1">Total Spent</p>
                  <p className="text-base font-bold text-[#C5A880] tracking-wide">₦{accountOverview.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Micro Order Card Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Recent Order</p>
                <button onClick={() => handleTabChange('orders')} className="text-[10px] text-[#C5A880] font-medium hover:underline">View all</button>
              </div>
              <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-14 bg-zinc-900 rounded-lg overflow-hidden border border-[#1C1C21] shrink-0 relative">
                    <Image src="/api/placeholder/48/56" alt="Item" fill className="object-cover" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-semibold text-white tracking-wide truncate">AVR-2405187</p>
                    <p className="text-[9px] text-zinc-500">May 18, 2024 • 3 Items</p>
                    <span className="inline-block text-[7.5px] font-bold tracking-wider px-2 py-0.5 rounded bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20 uppercase">Processing</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-white shrink-0">₦278,500</p>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Quick Actions</p>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => handleTabChange('orders')} className="bg-[#0E0E10] border border-[#161619] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 active:bg-zinc-900"><Package size={16} className="text-[#C5A880]" /><span className="text-[8px] text-zinc-400 font-medium tracking-wide leading-tight">Track Order</span></button>
                <button onClick={() => handleTabChange('stores')} className="bg-[#0E0E10] border border-[#161619] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 active:bg-zinc-900"><ShoppingBag size={16} className="text-[#C5A880]" /><span className="text-[8px] text-zinc-400 font-medium tracking-wide leading-tight">Browse Stores</span></button>
                <button onClick={() => { handleTabChange('profile'); setProfileView('menu'); }} className="bg-[#0E0E10] border border-[#161619] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 active:bg-zinc-900"><Ticket size={16} className="text-[#C5A880]" /><span className="text-[8px] text-zinc-400 font-medium tracking-wide leading-tight">Coupons</span></button>
                <button onClick={() => { handleTabChange('profile'); setProfileView('addresses'); }} className="bg-[#0E0E10] border border-[#161619] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 active:bg-zinc-900"><MapPin size={16} className="text-[#C5A880]" /><span className="text-[8px] text-zinc-400 font-medium tracking-wide leading-tight">Addresses</span></button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB B: ORDERS FEED DISPLAY PANEL                          */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            <h1 className="text-xl font-medium text-white tracking-wide">Orders</h1>
            <div className="flex gap-2 border-b border-[#161619] pb-3">
              {['All Orders', 'Processing', 'Shipped', 'Delivered'].map((filter, index) => (
                <span key={filter} className={`text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full ${index === 0 ? 'bg-[#C5A880] text-black' : 'text-zinc-500 bg-zinc-900/40'}`}>
                  {filter}
                </span>
              ))}
            </div>
            {/* Iterated list elements row block */}
            <div className="space-y-2.5">
              <OrderRowBlock id="AVR-2405187" date="May 18, 2024" price="₦278,500" status="PROCESSING" isGoldStatus />
              <OrderRowBlock id="AVR-2405102" date="May 13, 2024" price="₦125,000" status="DELIVERED" />
              <OrderRowBlock id="AVR-2404309" date="Apr 30, 2024" price="₦89,000" status="DELIVERED" />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB C: LUXURY STORES DIRECTORY MAP                        */}
        {/* ========================================================= */}
        {activeTab === 'stores' && (
          <div className="space-y-5 animate-fadeIn">
            <h1 className="text-xl font-medium text-white tracking-wide">Stores</h1>
            <input type="text" placeholder="Search elite luxury designers..." className="w-full bg-[#0E0E10] border border-[#161619] rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A880]/40 transition-colors" />
            <div className="grid grid-cols-2 gap-3">
              <StoreBrandTile label="Maison B." meta="Luxury Fashion" initial="M" />
              <StoreBrandTile label="L'Atelier É." meta="Footwear Art" initial="L" />
              <StoreBrandTile label="Velouré" meta="Accessories" initial="V" />
              <StoreBrandTile label="Noir Parfum" meta="Fragrances" initial="N" />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB D: SYSTEM HUB DISPLAY (PROFILE & SUB-SIDEBAR LINKS)   */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="animate-fadeIn">
            {profileView === 'menu' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2.5 py-4">
                  <div className="relative w-20 h-20 rounded-full border-2 border-[#C5A880] p-1 overflow-hidden bg-zinc-900">
                    <Image src={data?.avatarUrl || "/api/placeholder/80/80"} alt="User Matrix Face" fill className="object-cover rounded-full scale-[0.92]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-wide">{fullName}</h2>
                    <p className="text-[9px] font-bold text-[#C5A880] tracking-[0.15em] uppercase mt-0.5">♦ Gold Member Registry</p>
                  </div>
                </div>

                {/* Sub-navigation Menu Block replacing old sidebar options */}
                <div className="bg-[#0E0E10] border border-[#161619] rounded-2xl overflow-hidden divide-y divide-[#161619]">
                  <SubHubItem label="Personal Information" icon={<UserCheck size={15} />} onClick={() => setProfileView('menu')} />
                  <SubHubItem label="Order Vault History" icon={<Clock size={15} />} onClick={() => setProfileView('history')} />
                  <SubHubItem label="Ecosystem Notifications" icon={<Bell size={15} />} onClick={() => setProfileView('notifications')} />
                  <SubHubItem label="Routing Addresses" icon={<MapPinned size={15} />} onClick={() => setProfileView('addresses')} />
                  <SubHubItem label="Security Protocols" icon={<ShieldCheck size={15} />} onClick={() => setProfileView('security')} />
                  <SubHubItem label="Concierge Support" icon={<Headphones size={15} />} onClick={() => setProfileView('support')} />
                </div>

                <button 
                  onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                  className="w-full flex items-center justify-center gap-2 py-4 border border-zinc-900/80 bg-zinc-950/20 active:bg-red-950/20 text-red-400 rounded-xl text-xs font-semibold transition-colors mt-2"
                >
                  <LogOut size={14} /> Terminate Session
                </button>
              </div>
            )}

            {/* Sub-view Rendering Framework (replaces children routing dynamically inside wrapper) */}
            {profileView !== 'menu' && (
              <div className="space-y-4">
                <button onClick={() => setProfileView('menu')} className="text-[10px] text-[#C5A880] font-bold uppercase tracking-wider inline-flex items-center gap-1 mb-2">
                  ← Back to Profile Menu
                </button>
                <div className="bg-[#0E0E10] border border-[#161619] rounded-2xl p-5 min-h-[50vh]">
                  {profileView === 'history' && <div className="space-y-4"><div><h3 className="text-sm font-bold text-white tracking-wide">History Ledger</h3><p className="text-[9px] text-zinc-500">Overview of expired or processed actions</p></div><div className="text-center py-12 text-zinc-600 text-xs">No legacy data records found.</div></div>}
                  {profileView === 'notifications' && <div className="space-y-3"><div><h3 className="text-sm font-bold text-white tracking-wide">Notifications</h3><p className="text-[9px] text-zinc-500">Latest updates from your designers</p></div><NotificationAlert row="Your order AVR-2405187 has shipped successfully." time="May 20, 2024" /><NotificationAlert row="Exclusive: Enjoy 10% off your next checkout view." time="May 12, 2024" /></div>}
                  {profileView === 'addresses' && <div className="space-y-4"><div><h3 className="text-sm font-bold text-white tracking-wide">Addresses</h3><p className="text-[9px] text-zinc-500">Shipping parameters management</p></div><div className="border border-[#161619] rounded-xl p-4 bg-black/20 text-xs space-y-1"><p className="font-semibold text-white">Default Residence Address</p><p className="text-zinc-400">12 Banana Island Road, Ikoyi</p><p className="text-zinc-500">Lagos, Nigeria</p></div></div>}
                  {profileView === 'security' && <div className="space-y-4"><div><h3 className="text-sm font-bold text-white tracking-wide">Security</h3><p className="text-[9px] text-zinc-500">Two-factor protocols and session settings</p></div><div className="flex items-center justify-between text-xs py-2 border-b border-zinc-900"><span className="text-zinc-400">Two-Factor Authentication</span><span className="text-emerald-500 font-bold text-[10px]">ENABLED</span></div></div>}
                  {profileView === 'support' && <div className="space-y-4"><div><h3 className="text-sm font-bold text-white tracking-wide">Concierge Support</h3><p className="text-[9px] text-zinc-500">Instant connection to brand support dispatch</p></div><textarea placeholder="State your request details..." rows={4} className="w-full bg-zinc-900/50 border border-[#161619] rounded-xl p-3 text-xs text-white focus:outline-none" /><button className="w-full py-3 bg-[#C5A880] text-black font-bold rounded-xl text-xs tracking-wide">Submit Ticket</button></div>}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* 3. PERSISTENT SYSTEM BOTTOM NAVIGATION DOCK */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0A0A0C]/95 backdrop-blur-lg border-t border-[#141416] px-3 py-2 flex items-center justify-between z-50">
        <BottomNavButton icon={<Compass size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} />
        <BottomNavButton icon={<Package size={18} />} label="Orders" active={activeTab === 'orders'} onClick={() => handleTabChange('orders')} />
        <BottomNavButton icon={<ShoppingBag size={18} />} label="Stores" active={activeTab === 'stores'} onClick={() => handleTabChange('stores')} />
        <BottomNavButton icon={<User size={18} />} label="Profile" active={activeTab === 'profile'} onClick={() => handleTabChange('profile')} />
      </footer>

    </div>
  );
}

/* --- DYNAMIC MODULE SUBCOMPONENTS --- */

function BottomNavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-all">
      <div className={`transition-colors duration-200 ${active ? 'text-[#C5A880]' : 'text-zinc-600'}`}>{icon}</div>
      <span className={`text-[8.5px] tracking-wider font-medium transition-colors duration-200 ${active ? 'text-white font-semibold' : 'text-zinc-600'}`}>{label}</span>
    </button>
  );
}

function SubHubItem({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-4 hover:bg-zinc-900/40 text-left text-xs text-zinc-300 transition-colors group">
      <div className="flex items-center gap-3.5">
        <div className="text-zinc-500 group-active:text-[#C5A880] transition-colors">{icon}</div>
        <span className="font-medium tracking-wide">{label}</span>
      </div>
      <ChevronRight size={14} className="text-zinc-700 group-active:text-white transition-colors" />
    </button>
  );
}

function OrderRowBlock({ id, date, price, status, isGoldStatus = false }: any) {
  return (
    <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-13 bg-zinc-950 border border-zinc-900 rounded-lg shrink-0" />
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-white tracking-wide truncate">{id}</p>
          <p className="text-[9px] text-zinc-500">{date}</p>
          <span className={`inline-block text-[7.5px] font-bold tracking-wider px-2 py-0.5 rounded border uppercase ${isGoldStatus ? 'bg-[#C5A880]/10 text-[#C5A880] border-[#C5A880]/20' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}>{status}</span>
        </div>
      </div>
      <p className="text-xs font-bold text-white shrink-0">{price}</p>
    </div>
  );
}

function StoreBrandTile({ label, meta, initial }: any) {
  return (
    <div className="bg-[#0E0E10] border border-[#161619] rounded-xl p-4 text-center space-y-2 flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center font-serif text-white text-sm font-semibold">{initial}</div>
      <div>
        <p className="text-xs font-semibold text-white tracking-wide">{label}</p>
        <p className="text-[9px] text-zinc-500 mt-0.5">{meta}</p>
      </div>
    </div>
  );
}

function NotificationAlert({ row, time }: any) {
  return (
    <div className="p-3.5 bg-black/20 border border-[#161619] rounded-xl space-y-1 text-xs">
      <p className="text-zinc-300 leading-normal">{row}</p>
      <p className="text-[8px] text-zinc-600 font-medium">{time}</p>
    </div>
  );
}