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
    return (
      data?.name ||
      `${data?.firstName || ''} ${data?.lastName || ''}`.trim()
    );
  }, [data]);

  const userInitials = useMemo(() => {
    if (!fullName) return 'AV';
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
    <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 pb-28 font-mono antialiased">
      
      {/* 1. HARDWARE STATUS & IDENTITY HEADER */}
      <header className="bg-[#111113] px-5 pt-8 pb-6 border-b border-zinc-900/80">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[#991B1B]">
              <Compass size={11} className="animate-pulse" />
              <span className="text-[7px] tracking-[0.3em] font-bold uppercase">{greeting}_node</span>
            </div>
            <h1 className="text-lg font-bold text-white uppercase tracking-wide truncate">
              {fullName || 'SYSTEM_OPERATOR'}
            </h1>
            <p className="text-[8px] text-zinc-500 uppercase tracking-widest">
              Core Ledger Interface // Aviorè Client
            </p>
          </div>

          <div className="w-11 h-11 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-300 font-bold text-xs shrink-0 tracking-tighter">
            {userInitials}
          </div>
        </div>

        {/* METRICS GRID AREA */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <QuickCard
            icon={<Package size={14} />}
            title="Orders"
            value={data?._count?.orders || 0}
            href="/dashboard/orders"
          />
          <QuickCard
            icon={<Heart size={14} />}
            title="Wishlist"
            value={wishlistCount}
            href="/wishlist"
          />
          <QuickCard
            icon={<Ticket size={14} />}
            title="Coupons"
            value={couponCount}
            href="/dashboard/coupons"
          />
          <QuickCard
            icon={<Star size={14} />}
            title="Reviews"
            value={data?._count?.reviews || 0}
            href="/dashboard/reviews"
          />
        </div>
      </header>

      {/* 2. SCROLLABLE ASSET RUNWAY (WISHLIST) */}
      <section className="mt-4 border-y border-zinc-900 bg-[#111113]/40 py-5">
        <div className="flex items-center justify-between px-5 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-2 bg-[#991B1B]" />
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-white">
              Saved_Products
            </h2>
          </div>
          <Link href="/wishlist" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-0.5 hover:text-white transition-colors">
            See All <ChevronRight size={10} />
          </Link>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar scroll-smooth snap-x snap-mandatory">
            {wishlistItems.map((item: any) => (
              <SavedItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="px-5">
            <div className="py-8 border border-dashed border-zinc-900 bg-zinc-950/20 rounded flex flex-col items-center justify-center">
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">No allocated vault assets</p>
            </div>
          </div>
        )}
      </section>

      {/* 3. LOGISTICS PIPELINE BLOCK (ORDERS) */}
      <section className="mt-4 border-y border-zinc-900 bg-[#111113]/40 px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-2 bg-[#991B1B]" />
            <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-white">
              Recent_Manifests
            </h2>
          </div>
          <Link href="/dashboard/orders" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-0.5 hover:text-white transition-colors">
            View All <ChevronRight size={10} />
          </Link>
        </div>

        <div className="divide-y divide-zinc-900/40">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.slice(0, 3).map((order: any) => (
              <OrderRow key={order.id} order={order} />
            ))
          ) : (
            <div className="text-center py-8 bg-zinc-950/10 border border-zinc-900 rounded flex flex-col items-center justify-center">
              <ShoppingBag className="text-zinc-800 mb-2" size={16} strokeWidth={1.5} />
              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Zero active transport lines</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. HARDWARE TERMINAL NAVIGATION LIST */}
      <section className="mt-4 border-t border-zinc-900 bg-[#111113] divide-y divide-zinc-900/50">
        <MenuItem label="Profile Parameters" icon={<User size={14} />} href="/dashboard/profile" />
        <MenuItem label="Routing Addresses" icon={<MapPin size={14} />} href="/dashboard/addresses" />
        <MenuItem label="Matrix Support" icon={<MessageSquare size={14} />} href="/dashboard/support" />
        <MenuItem label="Security Protocol" icon={<Shield size={14} />} href="/dashboard/security" />

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-between py-4 px-5 bg-zinc-950/20 active:bg-[#991B1B]/10 group transition-colors text-left"
        >
          <div className="flex items-center gap-3 text-[#991B1B]">
            <LogOut size={14} />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Terminate Session</span>
          </div>
          <ChevronRight size={12} className="text-zinc-700 group-active:text-white transition-colors" />
        </button>
      </section>

      <div className="mt-8 text-center px-5">
        <p className="text-[6.5px] font-bold text-zinc-700 uppercase tracking-[0.5em]">
          AVIORÈ_MOBILE_CON_v1.0.4 // SYSTEM_READY
        </p>
      </div>
    </div>
  );
}

/* --- TELEMETRY SUBSYSTEM COMPONENTS --- */

function QuickCard({ icon, title, value, href }: any) {
  return (
    <Link 
      href={href} 
      className="border border-zinc-900 rounded bg-zinc-950/60 p-3.5 flex flex-col justify-between h-20 active:border-zinc-700 active:bg-zinc-950 transition-all"
    >
      <div className="flex items-center gap-1.5 text-zinc-500">
        <span className="text-zinc-600 group-active:text-[#991B1B]">{icon}</span>
        <span className="text-[8px] font-bold uppercase tracking-wider truncate">{title}</span>
      </div>
      <p className="text-lg font-bold text-white tracking-tight">{value.toString().padStart(2, '0')}</p>
    </Link>
  );
}

function SavedItemCard({ item }: any) {
  const displayImage = item.image || item.imageUrl || (item.images && item.images[0]?.imageUrl);
  return (
    <Link 
      href={`/product/${item.id}`} 
      className="min-w-[130px] max-w-[130px] shrink-0 snap-start bg-zinc-950/40 border border-zinc-900 rounded p-2 flex flex-col justify-between gap-2 active:border-zinc-800 transition-all"
    >
      <div className="h-28 rounded bg-zinc-900 overflow-hidden relative border border-zinc-950 shrink-0">
        {displayImage ? (
          <Image src={displayImage} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={16} className="text-zinc-800" /></div>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-[8px] font-bold uppercase text-zinc-400 truncate tracking-wide">{item.title}</p>
        <p className="text-[10px] font-bold text-white tracking-tight">₦{Number(item.price || 0).toLocaleString()}</p>
      </div>
    </Link>
  );
}

function OrderRow({ order }: any) {
  const orderImage = order.items?.[0]?.product?.images?.[0]?.imageUrl || order.items?.[0]?.product?.image;
  return (
    <div className="flex items-center justify-between py-3 bg-transparent group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded border border-zinc-900 bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0">
          {orderImage ? (
            <Image src={orderImage} alt="manifest" width={40} height={40} className="object-cover h-full w-full" />
          ) : (
            <ShoppingBag size={14} className="text-zinc-700" />
          )}
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="font-bold text-[10px] uppercase text-white tracking-wider truncate">
            #{order.orderNumber || order.id.slice(-6).toUpperCase()}
          </p>
          <div className="flex items-center gap-1.5">
            <div className={`w-1 h-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            <p className="text-[7px] font-bold uppercase text-zinc-500 tracking-widest">{order.status}</p>
          </div>
        </div>
      </div>
      <p className="font-bold text-xs text-white tracking-tight shrink-0 pl-2">
        ₦{Number(order.totalAmount || 0).toLocaleString()}
      </p>
    </div>
  );
}

function MenuItem({ label, icon, href }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-between py-4 px-5 bg-transparent active:bg-zinc-950/60 transition-colors group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="text-zinc-600 group-active:text-[#991B1B] transition-colors shrink-0">{icon}</div>
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-300 truncate">{label}</span>
      </div>
      <ChevronRight size={12} className="text-zinc-700 group-active:text-white transition-colors shrink-0" />
    </Link>
  );
}