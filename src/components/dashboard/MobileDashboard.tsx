'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Heart,
  Ticket,
  MapPin,
  ChevronRight,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  LayoutDashboard
} from 'lucide-react';

import { useWishlistStore } from '@/src/store/useWishlistStore';
import { api } from '@/src/lib/axios';

interface DashboardProps {
  data: any;
}

export default function DashboardOverview({ data }: DashboardProps) {
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

  const { items: wishlistItems } = useWishlistStore();

  // Fetch active coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get('/vendor/marketing/active');
        setCouponCount(Array.isArray(res.data) ? res.data.length : 0);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div className="bg-transparent space-y-10 w-full selection:bg-[#C5A880]/20">
      
      {/* LUXURY SYSTEMsnapshot / HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900/40">
        <div className="space-y-1.5">
          <span className="text-[#C5A880] text-[9px] font-mono font-bold uppercase tracking-[0.3em] block">
            {greeting}
          </span>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
            {fullName || 'MEMBER'} <span className="text-zinc-600 font-normal font-sans tracking-normal text-lg">// Premium Tier</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#C5A880] bg-[#141416] border border-[#27272A] px-3.5 py-2 rounded-xl shadow-xl">
            Gold Member ✨
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0E0E10] flex items-center justify-center text-zinc-400 font-mono font-bold text-xs border border-[#161619]">
            {fullName?.slice(0, 2).toUpperCase() || 'MM'}
          </div>
        </div>
      </div>

      {/* METRICS QUAD-MATRIX GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total_Manifests"
          value={data?._count?.orders || 0}
          icon={<Package size={14} />}
          color="text-zinc-400"
        />
        <StatCard
          title="Successful_Deliveries"
          value={data?._count?.delivered || 0}
          icon={<ShoppingBag size={14} />}
          color="text-emerald-500"
        />
        <StatCard
          title="Pending_Acquisitions"
          value={data?._count?.processing || 0}
          icon={<Clock size={14} />}
          color="text-amber-500"
        />
        <StatCard
          title="Registry_Valuation"
          value={`₦${(data?.totalSpent || 0).toLocaleString()}`}
          icon={<Ticket size={14} />}
          color="text-[#C5A880]"
        />
      </div>

      {/* RECENT RECORDS ARCHIVE */}
      <div className="bg-[#111113] rounded-xl border border-zinc-900 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-900/60 flex justify-between items-center bg-zinc-950/40">
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">
            Recent_Transactions
          </h2>
          <Link 
            href="/dashboard/orders" 
            className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#C5A880] hover:text-[#d9c2a3] transition-colors bg-zinc-950 px-3 py-1.5 border border-zinc-900 rounded-lg flex items-center gap-1"
          >
            Full Archive <ChevronRight size={12} />
          </Link>
        </div>

        <div className="divide-y divide-zinc-900/40 bg-[#0D0D0D]/10">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.slice(0, 4).map((order: any) => (
              <OrderCardRow key={order.id} order={order} />
            ))
          ) : (
            <div className="py-12 text-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              No recent historical operational streams found.
            </div>
          )}
        </div>
      </div>

      {/* CORE FRAMEWORK QUICK UTILITIES */}
      <div>
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 px-1">
          Ecosystem_Quick_Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickActionCard title="Track Manifests" description="Monitor real-time acquisitions" icon={<Package size={18} />} href="/dashboard/orders" />
          <QuickActionCard title="Browse Collections" description="Explore verified boutiques" icon={<ShoppingBag size={18} />} href="/dashboard/stores" />
          <QuickActionCard title="System Coupons" description={`View ${couponCount || 'active'} tokens`} icon={<Ticket size={18} />} href="/dashboard/coupons" />
        </div>
      </div>

      {/* WISHLIST SAVED ARCHIVE NODE */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">
            Saved_Vault_Products
          </h2>
          <Link href="/wishlist" className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#C5A880] hover:underline flex items-center gap-1">
            See Vault <ChevronRight size={12} />
          </Link>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlistItems.slice(0, 5).map((item: any) => (
              <SavedItemGridCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-[#111113] border border-dashed border-zinc-800 rounded-xl py-12 text-center">
            <Heart className="mx-auto text-zinc-700 mb-3" size={24} />
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">No saved telemetry streams yet</p>
          </div>
        )}
      </div>

    </div>
  );
}

/* ====================== SUB COMPONENTS ====================== */

function StatCard({ title, value, icon, color }: { title: string; value: any; icon: any; color: string }) {
  return (
    <div className="bg-[#111113] p-5 rounded-xl border border-zinc-900/80 shadow-xl space-y-4 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-lg bg-zinc-950 border border-zinc-900/60 ${color}`}>
          {icon}
        </div>
        <ArrowUpRight size={12} className="text-zinc-700" />
      </div>
      <div className="space-y-0.5">
        <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-[0.2em]">
          {title}
        </p>
        <h3 className="text-xl font-mono font-bold text-white tracking-wide">
          {value}
        </h3>
      </div>
    </div>
  );
}

function OrderCardRow({ order }: any) {
  const item = order.items?.[0]?.product || {};
  const image = item.images?.[0]?.imageUrl || item.imageUrl || item.image;

  return (
    <Link href={`/dashboard/orders/${order.id}`} className="block group">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#161619]/40 transition-colors duration-200">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 flex-shrink-0 relative">
            {image ? (
              <Image src={image} alt={item.title || "Product"} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="text-zinc-700" size={16} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-mono font-bold text-zinc-200 tracking-wide group-hover:text-white transition-colors block">
              #{order.orderNumber || order.id?.slice(-6).toUpperCase()}
            </span>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5 max-w-[250px] sm:max-w-[400px]">
              {item.title || "System Manifest Logistics Bundle"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
          <div className="space-y-1">
            <div className={`inline-block px-2 py-0.5 rounded border text-[8px] font-mono font-bold uppercase tracking-widest ${
              order.status === 'DELIVERED' 
                ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900/50' 
                : 'bg-amber-950/20 text-amber-500 border-amber-900/40'
            }`}>
              {order.status}
            </div>
            <p className="text-[9px] font-mono text-zinc-600 block sm:hidden">
              {order.date || 'System Entry Log'}
            </p>
          </div>

          <div className="text-right">
            <p className="font-mono font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">
              ₦{Number(order.totalAmount).toLocaleString()}
            </p>
            <p className="hidden sm:block text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-0.5">
              {order.date || 'System Log'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({ title, description, icon, href }: { title: string; description: string; icon: any; href: string }) {
  return (
    <Link href={href} className="bg-[#111113] border border-zinc-900 rounded-xl p-5 hover:border-zinc-700 transition-all duration-300 group flex items-start justify-between gap-4 shadow-xl">
      <div className="space-y-1.5">
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors">
          {title}
        </h4>
        <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
          {description}
        </p>
      </div>
      <div className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-500 group-hover:text-[#C5A880] transition-colors shrink-0">
        {icon}
      </div>
    </Link>
  );
}

function SavedItemGridCard({ item }: any) {
  const image = item.image || item.imageUrl || item.images?.[0]?.imageUrl;

  return (
    <Link href={`/product/${item.id}`} className="block group">
      <div className="bg-[#111113] border border-zinc-900 rounded-xl overflow-hidden shadow-xl hover:border-zinc-700 transition-all duration-300">
        <div className="relative aspect-square w-full bg-zinc-950 border-b border-zinc-900/40">
          {image ? (
            <Image src={image} alt={item.title || "Product"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={24} className="text-zinc-800" />
            </div>
          )}
        </div>
        <div className="p-4 space-y-1.5">
          <p className="text-[11px] font-medium line-clamp-1 text-zinc-300 group-hover:text-white transition-colors">{item.title}</p>
          <p className="text-[#C5A880] font-mono font-bold text-xs uppercase tracking-wider">₦{Number(item.price).toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}