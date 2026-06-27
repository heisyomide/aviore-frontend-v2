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
  ArrowRight
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const fullName = useMemo(() => {
    return data?.name || `${data?.firstName || ''} ${data?.lastName || ''}`.trim();
  }, [data]);

  const userInitials = useMemo(() => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }, [fullName]);

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
    <div className="min-h-screen bg-white text-zinc-900 pb-32 antialiased selection:bg-[#A4143D] selection:text-white">
      
      {/* 👑 PREMIUM EDITORIAL HERO SECTION */}
      <header className="px-6 pt-16 pb-8 border-b border-zinc-100 bg-zinc-50/50">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 block">{greeting}</span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-950 leading-none">
              {fullName || 'Elite Member'}
            </h1>
            <p className="text-[11px] font-bold text-[#A4143D] tracking-wide uppercase pt-1">Registry Account Secured</p>
          </div>

          <div className="w-14 h-14 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-base tracking-tighter shadow-xl shadow-zinc-950/10 shrink-0 border border-zinc-800">
            {userInitials || 'AV'}
          </div>
        </div>

        {/* 🚀 HIGH-IMPACT FULFILLMENT TRACKER ROW (REPLACED DULL GRID) */}
        <div className="mt-8 bg-zinc-950 rounded-2xl p-5 text-white shadow-xl shadow-zinc-950/10 relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1 z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Current Order Status</p>
            <h3 className="text-lg font-extrabold tracking-tight">
              {data?._count?.orders ? `${data._count.orders} Active Manifests` : 'No Active Shipments'}
            </h3>
          </div>
          <Link href="/dashboard/orders" className="h-10 px-4 rounded-xl bg-white text-zinc-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-100 transition-all active:scale-95 z-10">
            <span>Track</span>
            <ArrowRight size={14} />
          </Link>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        </div>

        {/* METRIC HORIZONTAL HUB */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <MetricBar label="Vault History" value={wishlistCount} href="/history" />
          <MetricBar label="Active Passes" value={couponCount} href="/dashboard/coupons" />
          <MetricBar label="My Reviews" value={data?._count?.reviews || 0} href="/dashboard/reviews" />
        </div>
      </header>

      {/* 🔄 STRUCTURAL OVERHAUL: VAULT INTERACTION HISTORY (VERTICAL DISPLAY FOR PREMIUM PRESENCE) */}
      <section className="px-6 py-10 border-b border-zinc-100">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-black text-xl uppercase tracking-tighter text-zinc-950">
            Vault <span className="text-zinc-300 font-light italic">History</span>
          </h2>
          <Link href="/history" className="text-[10px] font-black uppercase tracking-widest text-[#A4143D] border-b-2 border-[#A4143D]/20 pb-0.5">
            See Entire Feed
          </Link>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {wishlistItems.slice(0, 4).map((item: any) => (
              <HistoryGridCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-12 border-2 border-dashed border-zinc-100 rounded-2xl text-center bg-zinc-50/50">
            <Compass className="mx-auto text-zinc-300 mb-3" size={24} />
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">No Recent Interactions In Archive</p>
          </div>
        )}
      </section>

      {/* 📦 TRANSACTION LEDGER: LOGISTICS TRACKER LOG */}
      <section className="px-6 py-10 bg-zinc-50/50">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-black text-xl uppercase tracking-tighter text-zinc-950">
            Recent <span className="text-zinc-300 font-light italic">Manifests</span>
          </h2>
          <Link href="/dashboard/orders" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors">
            View Ledger
          </Link>
        </div>

        <div className="space-y-4">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.slice(0, 3).map((order: any, idx: number) => (
              <LogisticsFeedRow key={order.id} order={order} isFirst={idx === 0} />
            ))
          ) : (
            <div className="text-center py-12 border border-zinc-100 rounded-2xl bg-white">
              <ShoppingBag className="mx-auto text-zinc-200 mb-3" size={28} strokeWidth={1.5} />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">Zero Outstanding Shipments</p>
            </div>
          )}
        </div>
      </section>

      {/* 🛠️ CORE SETTINGS ARCHITECTURE CONTAINER */}
      <section className="mt-4 px-4 py-2 divide-y divide-zinc-100 border-t border-zinc-100">
        <MenuRow label="Personal Information Profile" icon={<User size={16} />} href="/dashboard/profile" />
        <MenuRow label="Fulfillment Destinations" icon={<MapPin size={16} />} href="/dashboard/addresses" />
        <MenuRow label="Private Concierge / Support Desk" icon={<MessageSquare size={16} />} href="/dashboard/support" />
        <MenuRow label="Cryptographic Security Matrix" icon={<Shield size={16} />} href="/dashboard/security" />

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-between py-5 px-3 group active:bg-red-50 transition-colors rounded-xl text-left"
        >
          <div className="flex items-center gap-4 text-red-600">
            <LogOut size={16} className="shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-[0.15em]">Terminate Client Session</span>
          </div>
          <ChevronRight size={14} className="text-red-300 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </section>
    </div>
  );
}

/* --- RE-ENGINEERED STRUCTURAL COMPONENTS --- */

function MetricBar({ label, value, href }: any) {
  return (
    <Link href={href} className="bg-white border border-zinc-200/80 rounded-xl p-3.5 flex flex-col justify-between h-20 shadow-sm active:scale-95 transition-all">
      <span className="text-[8px] font-black uppercase tracking-wider text-zinc-400 block line-clamp-1">{label}</span>
      <span className="text-xl font-black text-zinc-950 tracking-tight leading-none mt-1">{value}</span>
    </Link>
  );
}

function HistoryGridCard({ item }: any) {
  const displayImage = item.image || item.imageUrl || (item.images && item.images[0]?.imageUrl);
  return (
    <Link href={`/product/${item.id}`} className="group block">
      <div className="aspect-[1/1.2] rounded-xl bg-zinc-100 overflow-hidden relative border border-zinc-200/60 shadow-xs group-active:scale-98 transition-all">
        {displayImage ? (
          <Image src={displayImage} alt={item.title} fill className="object-cover group-hover:scale-102 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-50">
            <ShoppingBag size={20} className="text-zinc-300" />
          </div>
        )}
      </div>
      <div className="mt-2.5 px-0.5 space-y-0.5">
        <h4 className="text-[10px] font-black uppercase tracking-tight text-zinc-900 line-clamp-1 leading-none">{item.title}</h4>
        <p className="text-[11px] font-black text-[#A4143D] tracking-tighter">₦{Number(item.price || 0).toLocaleString()}</p>
      </div>
    </Link>
  );
}

function LogisticsFeedRow({ order, isFirst }: any) {
  const orderImage = order.items?.[0]?.product?.images?.[0]?.imageUrl || order.items?.[0]?.product?.image;
  const isDelivered = order.status === 'DELIVERED';
  
  return (
    <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs relative">
      {isFirst && (
        <span className="absolute -top-2 -left-2 bg-[#A4143D] text-white font-black uppercase tracking-widest text-[7px] px-2 py-0.5 rounded-md shadow-md">
          Latest
        </span>
      )}
      
      <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0 relative">
        {orderImage ? (
          <Image src={orderImage} alt="manifest" width={48} height={48} className="object-cover h-full w-full" />
        ) : (
          <ShoppingBag size={16} className="text-zinc-400" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between w-full">
          <p className="font-black text-xs uppercase tracking-tight text-zinc-950">
            #{order.orderNumber || order.id.slice(-6).toUpperCase()}
          </p>
          <p className="font-black text-xs text-zinc-950 tracking-tighter">
            ₦{Number(order.totalAmount || 0).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isDelivered ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{order.status}</p>
        </div>
      </div>
    </div>
  );
}

function MenuRow({ label, icon, href }: any) {
  return (
    <Link href={href} className="flex items-center justify-between py-4.5 px-3 group active:bg-zinc-50 transition-colors rounded-xl">
      <div className="flex items-center gap-4">
        <div className="text-zinc-400 group-active:text-[#A4143D] group-hover:text-zinc-950 transition-colors">
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-800 group-hover:text-zinc-950 transition-colors">{label}</span>
      </div>
      <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}