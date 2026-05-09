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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
    <header className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
  <div className="flex items-center justify-between gap-4">
    <div className="flex-1">
      <h1 className="text-2xl font-bold text-gray-900 leading-tight">
        {greeting},
      </h1>

      <p className="text-xl font-semibold text-[#A4143D] capitalize mt-1">
        {fullName}
      </p>

      <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider">
        Manage your account
      </p>
    </div>

    <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
      {userInitials}
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3 mt-8">
    <QuickCard
      icon={<Package size={18} />}
      title="Orders"
      value={data?._count?.orders || 0}
      href="/dashboard/orders"
    />

    <QuickCard
      icon={<Heart size={18} />}
      title="Wishlist"
      value={wishlistCount}
      href="/wishlist"
    />

    <QuickCard
      icon={<Ticket size={18} />}
      title="Coupons"
      value={couponCount}
      href="/dashboard/coupons"
    />

    <QuickCard
      icon={<Star size={18} />}
      title="Reviews"
      value={data?._count?.reviews || 0}
      href="/dashboard/reviews"
    />
  </div>
</header>

      {/* Saved Items Section */}
 <section className="mt-4 bg-white py-8">
  <div className="flex items-center justify-between px-5 mb-6">
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#A4143D] animate-pulse" />
      <h2 className="font-black uppercase italic tracking-tighter text-zinc-900 text-sm">
        Saved <span className="text-zinc-300">Artifacts</span>
      </h2>
    </div>
    
    <Link 
      href="/wishlist" 
      className="text-[10px] font-black uppercase text-[#A4143D] hover:text-black transition-colors flex items-center gap-1 group"
    >
      View Registry 
      <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
    </Link>
  </div>

  {wishlistItems.length > 0 ? (
    <div className="flex gap-5 overflow-x-auto px-5 pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory">
      {wishlistItems.map((item: any) => (
        <div key={item.id} className="snap-start shrink-0">
          <SavedItemCard item={item} />
        </div>
      ))}
      {/* Decorative spacer for the end of horizontal scroll */}
      <div className="shrink-0 w-1" />
    </div>
  ) : (
    <div className="px-5">
      <div className="py-10 border border-zinc-100 bg-zinc-50/50 rounded-3xl text-center group">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] italic mb-1 group-hover:text-zinc-500 transition-colors">
          Your Curated Collection is Empty
        </p>
        <div className="w-10 h-[1px] bg-zinc-200 mx-auto" />
      </div>
    </div>
  )}
</section>

      {/* Recent Manifests Section */}
      <section className="mt-4 bg-white px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black uppercase italic tracking-tighter text-zinc-900 text-sm">
            Recent <span className="text-zinc-300">Orders</span>
          </h2>
          <Link href="/dashboard/orders" className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1">
            View all <ChevronRight size={12} />
          </Link>
        </div>

        <div className="space-y-4">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.slice(0, 3).map((order: any) => (
              <OrderRow key={order.id} order={order} />
            ))
          ) : (
            <div className="text-center py-6 border-t border-gray-50">
               <ShoppingBag className="mx-auto text-gray-200 mb-2" size={32} strokeWidth={1} />
               <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Zero_Active_Orders</p>
            </div>
          )}
        </div>
      </section>

      {/* Nav Menu */}
      <section className="mt-4 bg-white px-4 py-2 mb-10 divide-y divide-gray-50">
        <MenuItem label="Profile" icon={<User size={18} />} href="/dashboard/profile" />
        <MenuItem label="Address" icon={<MapPin size={18} />} href="/dashboard/addresses" />
        <MenuItem label="Support" icon={<MessageSquare size={18} />} href="/dashboard/support" />
        <MenuItem label="Security" icon={<Shield size={18} />} href="/dashboard/security" />

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-between py-5 active:bg-red-50 transition-colors px-2"
        >
          <div className="flex items-center gap-3 text-red-500">
            <LogOut size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>
      </section>
    </div>
  );
}

/* --- ATOMS --- */

function QuickCard({ icon, title, value, href }: any) {
  return (
    <Link href={href} className="border border-gray-100 rounded-[1.5rem] p-5 bg-white shadow-sm active:scale-95 transition-all">
      <div className="flex items-center gap-2 text-zinc-400 mb-3">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{title}</span>
      </div>
      <p className="text-xl font-black italic text-zinc-900 tracking-tighter">{value}</p>
    </Link>
  );
}

function SavedItemCard({ item }: any) {
  const displayImage = item.image || item.imageUrl || (item.images && item.images[0]?.imageUrl);
  return (
    <Link href={`/product/${item.id}`} className="min-w-[150px] max-w-[150px] group shrink-0">
      <div className="h-40 rounded-[1.8rem] bg-gray-50 overflow-hidden relative border border-gray-100 shadow-sm group-active:scale-95 transition-all">
        {displayImage ? (
          <Image src={displayImage} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={24} className="text-gray-200" /></div>
        )}
      </div>
      <div className="mt-3 px-1">
        <p className="text-[10px] font-black uppercase italic text-zinc-900 line-clamp-1 leading-none">{item.title}</p>
        <p className="text-[11px] font-black text-[#A4143D] mt-1 tracking-tighter">₦{Number(item.price || 0).toLocaleString()}</p>
      </div>
    </Link>
  );
}

function OrderRow({ order }: any) {
  const orderImage = order.items?.[0]?.product?.images?.[0]?.imageUrl || order.items?.[0]?.product?.image;
  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
          {orderImage ? (
            <Image src={orderImage} alt="manifest" width={56} height={56} className="object-cover h-full w-full" />
          ) : (
            <ShoppingBag size={20} className="text-gray-300" />
          )}
        </div>
        <div className="space-y-1">
          <p className="font-black text-[11px] uppercase italic text-zinc-900">
            #{order.orderNumber || order.id.slice(-6).toUpperCase()}
          </p>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">{order.status}</p>
          </div>
        </div>
      </div>
      <p className="font-black italic text-sm text-zinc-900 tracking-tighter">
        ₦{Number(order.totalAmount || 0).toLocaleString()}
      </p>
    </div>
  );
}

function MenuItem({ label, icon, href }: any) {
  return (
    <Link href={href} className="flex items-center justify-between py-5 group active:bg-gray-50 transition-colors px-2">
      <div className="flex items-center gap-4">
        <div className="text-zinc-400 group-active:text-[#A4143D] transition-colors">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-900">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-zinc-900 transition-colors" />
    </Link>
  );
}