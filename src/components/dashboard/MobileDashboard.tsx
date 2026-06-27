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
  Activity,
  ArrowUpRight,
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
    <div className="min-h-screen bg-[#070708] text-white pb-32 selection:bg-[#A4143D]">
      
      {/* 👑 PREMIUM EXECUTIVE HEADER */}
      <header className="bg-[#0D0D11]/60 backdrop-blur-md px-5 pt-14 pb-8 border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">{greeting}</span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
              {fullName || 'Elite Member'}
            </h1>
          </div>

          {/* Luxury Monogram Badge */}
          <div className="relative group">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-white font-black text-base border border-white/10 shadow-xl tracking-tighter">
              {userInitials || 'AV'}
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#A4143D] rounded-full ring-4 ring-[#070708]" />
          </div>
        </div>

        {/* HIGH-CONTRAST METRIC STREAM */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <QuickCard
            icon={<Package size={15} className="text-white" />}
            title="Active Orders"
            value={data?._count?.orders || 0}
            href="/dashboard/orders"
          />
          <QuickCard
            icon={<Activity size={15} className="text-[#A4143D]" />}
            title="Vault History"
            value={wishlistCount}
            href="/history"
          />
          <QuickCard
            icon={<Ticket size={15} className="text-white" />}
            title="Active Passes"
            value={couponCount}
            href="/dashboard/coupons"
          />
          <QuickCard
            icon={<Star size={15} className="text-amber-400" />}
            title="Reviews Given"
            value={data?._count?.reviews || 0}
            href="/dashboard/reviews"
          />
        </div>
      </header>

      {/* 🔄 RECENT INTERACTION HISTORY */}
      <section className="mt-4 bg-[#0D0D11] py-8 border-y border-white/5">
        <div className="flex items-center justify-between px-5 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#A4143D] rounded-full" />
            <h2 className="font-black uppercase tracking-widest text-white text-xs">
              Interaction <span className="text-zinc-500">History</span>
            </h2>
          </div>
          <Link href="/history" className="text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            View Vault <ChevronRight size={10} />
          </Link>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar scroll-smooth">
            {wishlistItems.map((item: any) => (
              <HistoryItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="px-5">
            <div className="py-8 bg-black/40 border border-dashed border-white/10 rounded-2xl text-center">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">No Recent View History</p>
            </div>
          </div>
        )}
      </section>

      {/* 📦 TRANSACTION LEDGER (RECENT ORDERS) */}
      <section className="mt-4 bg-[#0D0D11] px-5 py-8 border-b border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-white rounded-full" />
            <h2 className="font-black uppercase tracking-widest text-white text-xs">
              Recent <span className="text-zinc-500">Manifests</span>
            </h2>
          </div>
          <Link href="/dashboard/orders" className="text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            All Orders <ChevronRight size={10} />
          </Link>
        </div>

        <div className="divide-y divide-white/5 bg-black/40 rounded-2xl border border-white/5 px-4 overflow-hidden">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.slice(0, 3).map((order: any) => (
              <OrderRow key={order.id} order={order} />
            ))
          ) : (
            <div className="text-center py-10">
              <ShoppingBag className="mx-auto text-zinc-700 mb-3" size={28} strokeWidth={1.5} />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Zero Active Orders Issued</p>
            </div>
          )}
        </div>
      </section>

      {/* 🛠️ CORE ADMINISTRATIVE STRUCTURE */}
      <section className="mt-4 bg-[#0D0D11] px-3 py-2 border-t border-white/5 divide-y divide-white/5">
        <MenuItem label="Account Profile" icon={<User size={16} />} href="/dashboard/profile" />
        <MenuItem label="Fulfillment Addresses" icon={<MapPin size={16} />} href="/dashboard/addresses" />
        <MenuItem label="Private Concierge / Support" icon={<MessageSquare size={16} />} href="/dashboard/support" />
        <MenuItem label="Cryptographic Security" icon={<Shield size={16} />} href="/dashboard/security" />

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-between py-5 px-3 group active:bg-red-950/20 transition-colors rounded-xl"
        >
          <div className="flex items-center gap-4 text-red-400">
            <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/40">
              <LogOut size={16} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
          </div>
          <ChevronRight size={14} className="text-red-900/60" />
        </button>
      </section>
    </div>
  );
}

/* --- RE-ENGINEERED ATOMS --- */

function QuickCard({ icon, title, value, href }: any) {
  return (
    <Link href={href} className="border border-white/5 rounded-xl p-4 bg-black/40 hover:bg-black/60 transition-all flex flex-col justify-between h-24 relative overflow-hidden group active:scale-98">
      <div className="flex items-center justify-between w-full">
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 group-hover:text-white transition-colors">
          {icon}
        </div>
        <ArrowUpRight size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">{title}</p>
        <p className="text-xl font-black text-white tracking-tight">{value}</p>
      </div>
    </Link>
  );
}

function HistoryItemCard({ item }: any) {
  const displayImage = item.image || item.imageUrl || (item.images && item.images[0]?.imageUrl);
  return (
    <Link href={`/product/${item.id}`} className="min-w-[140px] max-w-[140px] group shrink-0">
      <div className="aspect-[1/1.1] rounded-xl bg-zinc-900 overflow-hidden relative border border-white/10 shadow-2xl transition-transform duration-200 group-active:scale-95">
        {displayImage ? (
          <Image src={displayImage} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <ShoppingBag size={20} className="text-zinc-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[10px] font-black uppercase tracking-tight text-white line-clamp-1">{item.title}</p>
          <p className="text-[11px] font-black text-[#A4143D] mt-0.5">₦{Number(item.price || 0).toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}

function OrderRow({ order }: any) {
  const orderImage = order.items?.[0]?.product?.images?.[0]?.imageUrl || order.items?.[0]?.product?.image;
  const isDelivered = order.status === 'DELIVERED';
  
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0 relative">
          {orderImage ? (
            <Image src={orderImage} alt="manifest" width={48} height={48} className="object-cover h-full w-full" />
          ) : (
            <ShoppingBag size={16} className="text-zinc-600" />
          )}
        </div>
        <div className="space-y-1">
          <p className="font-black text-xs uppercase tracking-tight text-white">
            #{order.orderNumber || order.id.slice(-6).toUpperCase()}
          </p>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
            <span className={`w-1.5 h-1.5 rounded-full ${isDelivered ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <span className="text-[8px] font-black uppercase text-zinc-400 tracking-wider">{order.status}</span>
          </div>
        </div>
      </div>
      <p className="font-black text-sm text-white tracking-tight">
        ₦{Number(order.totalAmount || 0).toLocaleString()}
      </p>
    </div>
  );
}

function MenuItem({ label, icon, href }: any) {
  return (
    <Link href={href} className="flex items-center justify-between py-4 px-3 group active:bg-white/5 transition-colors rounded-xl">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 group-active:text-[#A4143D] group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <ChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
    </Link>
  );
}