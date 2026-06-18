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

  /**
   * FULL NAME
   * Uses backend `name` first
   */
  const fullName = useMemo(() => {
    return (
      data?.name ||
      `${data?.firstName || ''} ${data?.lastName || ''}`.trim()
    );
  }, [data]);

  /**
   * USER INITIALS
   * Example: adedayo yomide => AY
   */
  const userInitials = useMemo(() => {
    if (!fullName) return '';

    const parts = fullName.trim().split(' ');

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return fullName.slice(0, 2).toUpperCase();
  }, [fullName]);

  // 3. DATA SYNC: WISHLIST (Zustand Store)
  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems.length;

  // 4. DATA SYNC: COUPONS (Fetch from /vendor/marketing/active)
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
    <div className="min-h-screen bg-[#070708] text-[#E4E4E7] pb-24 font-sans antialiased selection:bg-[#C5A880]/20 select-none">
      
      {/* Header Section */}
      <header className="bg-[#0A0A0C] px-4 pt-14 pb-6 border-b border-[#141416]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-medium text-zinc-400 tracking-wide">
              {greeting},
            </h1>

            <p className="text-2xl font-semibold text-white tracking-wide capitalize mt-1">
              {fullName}
            </p>

            <p className="text-[10px] text-[#C5A880] font-bold mt-2 uppercase tracking-[0.15em]">
              Manage your account
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-[#27272A] flex items-center justify-center text-[#C5A880] font-serif font-bold text-lg shadow-inner shrink-0">
            {userInitials}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-8">
          <QuickCard
            icon={<Package size={16} />}
            title="Orders"
            value={data?._count?.orders || 0}
            href="/dashboard/orders"
          />

          <QuickCard
            icon={<Heart size={16} />}
            title="History"
            value={wishlistCount}
            href="/history"
          />

          <QuickCard
            icon={<Ticket size={16} />}
            title="Coupons"
            value={couponCount}
            href="/dashboard/coupons"
          />

          <QuickCard
            icon={<Star size={16} />}
            title="Reviews"
            value={data?._count?.reviews || 0}
            href="/dashboard/reviews"
          />
        </div>
      </header>

      {/* Saved Items Section */}
      <section className="mt-4 bg-[#0A0A0C] border-y border-[#141416] py-6">
        <div className="flex items-center justify-between px-4 mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            Saved <span className="text-zinc-600">Products</span>
          </h2>
          <Link href="/wishlist" className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-1 hover:underline">
            See all <ChevronRight size={12} />
          </Link>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar scroll-smooth">
            {wishlistItems.map((item: any) => (
              <SavedItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="px-4">
            <div className="py-8 border border-dashed border-[#1C1C21] rounded-2xl text-center bg-black/20">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">No Saved Items</p>
            </div>
          </div>
        )}
      </section>

      {/* Recent Manifests Section */}
      <section className="mt-4 bg-[#0A0A0C] border-y border-[#141416] px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            Recent <span className="text-zinc-600">Orders</span>
          </h2>
          <Link href="/dashboard/orders" className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880] flex items-center gap-1 hover:underline">
            View all <ChevronRight size={12} />
          </Link>
        </div>

        <div className="space-y-1 divide-y divide-[#141416]">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.slice(0, 3).map((order: any) => (
              <OrderRow key={order.id} order={order} />
            ))
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto text-zinc-700 mb-2.5 animate-pulse" size={24} strokeWidth={1.5} />
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Zero_Active_Orders</p>
            </div>
          )}
        </div>
      </section>

      {/* Nav Menu */}
      <section className="mt-4 bg-[#0A0A0C] border-y border-[#141416] px-4 py-1 mb-10 divide-y divide-[#141416]">
        <MenuItem label="Profile" icon={<User size={16} />} href="/dashboard/profile" />
        <MenuItem label="Address" icon={<MapPin size={16} />} href="/dashboard/addresses" />
        <MenuItem label="Support" icon={<MessageSquare size={16} />} href="/dashboard/support" />
        <MenuItem label="Security" icon={<Shield size={16} />} href="/dashboard/security" />

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-between py-4.5 active:bg-red-950/10 transition-colors px-2 group"
        >
          <div className="flex items-center gap-3.5 text-red-400 group-active:text-red-300">
            <LogOut size={16} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Logout</span>
          </div>
          <ChevronRight size={14} className="text-zinc-700 group-active:text-zinc-400 transition-colors" />
        </button>
      </section>
    </div>
  );
}

/* --- ATOMS --- */

function QuickCard({ icon, title, value, href }: any) {
  return (
    <Link href={href} className="border border-[#161619] rounded-xl p-4.5 bg-[#0E0E10] active:scale-[0.98] transition-all block">
      <div className="flex items-center gap-2 text-zinc-500 mb-2.5">
        <span className="text-[#C5A880]">{icon}</span>
        <span className="text-[8.5px] font-bold uppercase tracking-[0.15em]">{title}</span>
      </div>
      <p className="text-lg font-bold text-white tracking-wide">{value}</p>
    </Link>
  );
}

function SavedItemCard({ item }: any) {
  const displayImage = item.image || item.imageUrl || (item.images && item.images[0]?.imageUrl);
  return (
    <Link href={`/product/${item.id}`} className="min-w-[140px] max-w-[140px] group shrink-0 block">
      <div className="h-44 rounded-xl bg-zinc-900 overflow-hidden relative border border-[#161619] group-active:scale-[0.97] transition-all">
        {displayImage ? (
          <Image src={displayImage} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-950"><ShoppingBag size={20} className="text-zinc-800" /></div>
        )}
      </div>
      <div className="mt-2.5 px-0.5 space-y-0.5">
        <p className="text-[10px] font-medium tracking-wide text-zinc-300 truncate">{item.title}</p>
        <p className="text-[11px] font-semibold text-[#C5A880] tracking-wide">₦{Number(item.price || 0).toLocaleString()}</p>
      </div>
    </Link>
  );
}

function OrderRow({ order }: any) {
  const orderImage = order.items?.[0]?.product?.images?.[0]?.imageUrl || order.items?.[0]?.product?.image;
  return (
    <div className="flex items-center justify-between py-4 group">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-14 rounded-lg bg-zinc-900 border border-[#161619] flex items-center justify-center overflow-hidden shrink-0 relative">
          {orderImage ? (
            <Image src={orderImage} alt="manifest" fill className="object-cover" />
          ) : (
            <ShoppingBag size={16} className="text-zinc-700" />
          )}
        </div>
        <div className="space-y-1 min-w-0">
          <p className="font-semibold text-xs tracking-wide text-white truncate">
            #{order.orderNumber || order.id.slice(-6).toUpperCase()}
          </p>
          <div className="flex items-center gap-1.5">
            <div className={`w-1 h-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-[#C5A880] animate-pulse'}`} />
            <p className="text-[8.5px] font-bold uppercase text-zinc-500 tracking-wider">{order.status}</p>
          </div>
        </div>
      </div>
      <p className="font-semibold text-xs text-white tracking-wide shrink-0">
        ₦{Number(order.totalAmount || 0).toLocaleString()}
      </p>
    </div>
  );
}

function MenuItem({ label, icon, href }: any) {
  return (
    <Link href={href} className="flex items-center justify-between py-4.5 group active:bg-zinc-900/30 transition-colors px-2 block">
      <div className="flex items-center gap-3.5">
        <div className="text-zinc-500 group-active:text-[#C5A880] transition-colors">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-300 group-active:text-white transition-colors">{label}</span>
      </div>
      <ChevronRight size={14} className="text-zinc-700 group-active:text-white transition-colors" />
    </Link>
  );
}