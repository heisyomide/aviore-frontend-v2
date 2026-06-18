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
  const wishlistCount = wishlistItems.length;

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
    <div className="bg-[#0A0A0A] min-h-screen pb-20">
      {/* Welcome Header */}
      <div className="px-6 pt-8 pb-6 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm">{greeting},</p>
            <h1 className="text-3xl font-semibold text-white mt-1">{fullName}</h1>
            <p className="text-[#A4143D] text-sm mt-1 font-medium">Gold Member ✨</p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-white font-bold text-xl border border-zinc-700">
            {fullName?.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 pt-8">
        <StatCard
          title="Total Orders"
          value={data?._count?.orders || 0}
          icon={<Package size={22} />}
        />
        <StatCard
          title="Delivered"
          value={data?._count?.delivered || 8}
          icon={<ShoppingBag size={22} />}
          color="text-emerald-500"
        />
        <StatCard
          title="Processing"
          value={data?._count?.processing || 3}
          icon={<Clock size={22} />}
          color="text-amber-500"
        />
        <StatCard
          title="Total Spent"
          value={`₦${(data?.totalSpent || 1248500).toLocaleString()}`}
          icon={<Ticket size={22} />}
          isCurrency
        />
      </div>

      {/* Recent Orders */}
      <div className="mt-10 px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-[#A4143D] text-sm flex items-center gap-1 hover:underline">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.slice(0, 4).map((order: any) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center">
              <ShoppingBag size={48} className="mx-auto text-zinc-700 mb-4" />
              <p className="text-zinc-400">No recent orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12 px-6">
        <h2 className="text-lg font-semibold text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <QuickActionCard title="Track Order" icon="📦" href="/dashboard/orders" />
          <QuickActionCard title="Browse Stores" icon="🛍️" href="/dashboard/stores" />
          <QuickActionCard title="Coupons" icon="🎟️" href="/dashboard/coupons" />
        </div>
      </div>

      {/* Saved Items / Wishlist */}
      <div className="mt-12 px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Saved Products</h2>
          <Link href="/wishlist" className="text-[#A4143D] text-sm flex items-center gap-1 hover:underline">
            See all <ChevronRight size={16} />
          </Link>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
            {wishlistItems.slice(0, 5).map((item: any) => (
              <SavedItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-dashed border-zinc-700 rounded-3xl py-12 text-center">
            <Heart className="mx-auto text-zinc-700 mb-3" size={40} />
            <p className="text-zinc-500">No saved items yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====================== SUB COMPONENTS ====================== */

function StatCard({ title, value, icon, color = "text-white", isCurrency = false }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div className={`${color}`}>{icon}</div>
        <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">{title}</span>
      </div>
      <p className="text-3xl font-semibold mt-6 tracking-tighter">
        {isCurrency ? value : value}
      </p>
    </div>
  );
}

function OrderCard({ order }: any) {
  const item = order.items?.[0]?.product || {};
  const image = item.images?.[0]?.imageUrl || item.imageUrl || item.image;

  return (
    <Link href={`/dashboard/orders/${order.id}`} className="block">
      <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 flex gap-5 transition-all">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0">
          {image ? (
            <Image src={image} alt={item.title} width={64} height={64} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="text-zinc-600" size={28} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-white truncate">#{order.orderNumber}</p>
              <p className="text-sm text-zinc-400 mt-0.5">{item.title}</p>
            </div>
            <p className="font-semibold text-right">₦{Number(order.totalAmount).toLocaleString()}</p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className={`text-xs px-3 py-1 rounded-full font-medium ${
              order.status === 'DELIVERED' 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : 'bg-amber-500/10 text-amber-500'
            }`}>
              {order.status}
            </div>
            <span className="text-xs text-zinc-500">{order.date || 'May 28, 2024'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({ title, icon, href }: { title: string; icon: string; href: string }) {
  return (
    <Link href={href} className="bg-zinc-900 border border-zinc-800 hover:border-[#A4143D] rounded-3xl p-6 text-center transition-all hover:scale-105">
      <div className="text-4xl mb-4">{icon}</div>
      <p className="text-sm font-medium text-zinc-300">{title}</p>
    </Link>
  );
}

function SavedItemCard({ item }: any) {
  const image = item.image || item.imageUrl || item.images?.[0]?.imageUrl;

  return (
    <Link href={`/product/${item.id}`} className="min-w-[140px] block">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="relative h-40">
          {image ? (
            <Image src={image} alt={item.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-950">
              <ShoppingBag size={32} className="text-zinc-700" />
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm font-medium line-clamp-2 text-white">{item.title}</p>
          <p className="text-[#A4143D] font-semibold mt-2">₦{Number(item.price).toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}