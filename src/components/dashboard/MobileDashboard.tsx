'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Clock, 
  ShoppingBag, 
  ChevronRight 
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

  // Fetch coupons
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
    <div className="bg-[#0A0A0A] min-h-screen pb-24">
      {/* Welcome Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm">{greeting},</p>
            <h1 className="text-3xl font-semibold text-white mt-1">{fullName}</h1>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-white font-bold text-xl border border-zinc-700">
            {fullName?.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats - Matching Screenshot Style */}
      <div className="px-6 grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <Clock size={22} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">PROCESSING</p>
              <p className="text-4xl font-semibold text-white mt-1">
                {data?._count?.processing || 3}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
              <ShoppingBag size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">TOTAL SPENT</p>
              <p className="text-4xl font-semibold text-white mt-1">
                ₦{(data?.totalSpent || 1248500).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-[#A4143D] text-sm flex items-center gap-1">
            View all <ChevronRight size={18} />
          </Link>
        </div>

        <div className="space-y-4">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.slice(0, 4).map((order: any) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl py-16 text-center">
              <ShoppingBag size={48} className="mx-auto text-zinc-700 mb-4" />
              <p className="text-zinc-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-12 px-6">
        <h2 className="text-lg font-semibold text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <QuickActionCard title="Track Order" href="/dashboard/orders" />
          <QuickActionCard title="Browse Stores" href="/dashboard/stores" />
          <QuickActionCard title="Coupons" href="/dashboard/coupons" />
        </div>
      </div>
    </div>
  );
}

/* ====================== SUB COMPONENTS ====================== */

function OrderCard({ order }: any) {
  const item = order.items?.[0]?.product || {};
  const image = item.images?.[0]?.imageUrl || item.imageUrl || item.image;

  const statusColor = order.status === 'DELIVERED' || order.status === 'COMPLETED' 
    ? 'bg-emerald-500/10 text-emerald-500' 
    : 'bg-orange-500/10 text-orange-500';

  return (
    <Link href={`/dashboard/orders/${order.id}`} className="block">
      <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 flex gap-5 transition-all">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0">
          {image ? (
            <Image src={image} alt="" width={56} height={56} className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="text-zinc-600" size={28} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex justify-between">
            <p className="font-mono text-sm text-white">#{order.orderNumber}</p>
            <p className="text-sm font-semibold text-white">
              ₦{Number(order.totalAmount || 0).toLocaleString()}
            </p>
          </div>

          <p className="text-zinc-400 text-sm mt-1 line-clamp-1">{item.title}</p>

          <div className="flex items-center gap-3 mt-3">
            <span className={`text-xs px-4 py-1 rounded-full font-medium ${statusColor}`}>
              {order.status}
            </span>
            <span className="text-xs text-zinc-500">
              {new Date(order.createdAt || order.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({ title, href }: { title: string; href: string }) {
  return (
    <Link 
      href={href} 
      className="bg-zinc-900 border border-zinc-800 hover:border-[#A4143D] rounded-3xl p-6 text-center transition-all active:scale-95"
    >
      <p className="text-sm font-medium text-zinc-300">{title}</p>
    </Link>
  );
}