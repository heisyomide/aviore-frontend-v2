'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Package,
  Clock3, // ⚡ Replaced Heart with Clock3 for History context
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
import { api } from '@/src/lib/axios';

interface MobileDashboardProps {
  data: any; // user/profile data
}

export function MobileDashboard({ data }: MobileDashboardProps) {
  const [couponCount, setCouponCount] = useState(0);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 1. DYNAMIC TIMED GREETING CALCULATION
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // 2. PARSE COMBINED ACCOUNT STRINGS
  const fullName = useMemo(() => {
    return (
      data?.name ||
      `${data?.firstName || ''} ${data?.lastName || ''}`.trim()
    );
  }, [data]);

  // 3. GENERATE TEXT REPRESENTATION AVATAR EMBLEMS
  const userInitials = useMemo(() => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }, [fullName]);

  // 4. DATA SYNC: ACTIVE PROMOTIONS & MARKETING MATRIX
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await api.get('/vendor/marketing/active');
        if (Array.isArray(response.data)) {
          setCouponCount(response.data.length);
        }
      } catch (err) {
        console.error('[AVIORÈ ERROR]: Coupon synchronization sequence failure:', err);
      }
    };
    fetchCoupons();
  }, []);

  // 5. DATA SYNC: USER BROWSING HISTORY REGISTRATION (Fetches from /dashboard/history dataset)
  useEffect(() => {
    const fetchBrowsingHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await api.get('/users/profile/history'); // ⚡ Dynamically populated tracking endpoint
        if (Array.isArray(response.data)) {
          setHistoryItems(response.data);
        } else if (response.data?.items) {
          setHistoryItems(response.data.items);
        }
      } catch (err) {
        console.error('[AVIORÈ ERROR]: History asset matrix construction failed:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchBrowsingHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 text-zinc-900 selection:bg-[#A4143D]/10">
      
      {/* HEADER HERO AREA */}
      <header className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {greeting},
            </h1>
            <p className="text-xl font-semibold text-[#A4143D] capitalize mt-1 truncate">
              {fullName || 'Guest User'}
            </p>
            <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider font-medium">
              Manage your account
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0 select-none">
            {userInitials || <User size={20} />}
          </div>
        </div>

        {/* METRIC MATRIX GRID */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <QuickCard
            icon={<Package size={18} />}
            title="Orders"
            value={data?._count?.orders || 0}
            href="/dashboard/orders"
          />

          <QuickCard
            icon={<Clock3 size={18} />} // ⚡ Updated design configuration to History Clock
            title="History"
            value={historyItems.length} // ⚡ Now dynamically counting History Items instead of wishlist
            href="/dashboard/history" // ⚡ Route redirection path normalized
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

      {/* CONTINUOUS BROWSING HISTORY SLIDER PANEL */}
      <section className="mt-4 bg-white py-6 border-y border-gray-100">
        <div className="flex items-center justify-between px-4 mb-5">
          <h2 className="font-black uppercase italic tracking-tighter text-zinc-900 text-sm">
            Browsing <span className="text-zinc-300">History</span> {/* ⚡ Swapped from Saved Products */}
          </h2>
          <Link 
            href="/dashboard/history" 
            className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1 active:opacity-70 transition-opacity"
          >
            See all <ChevronRight size={12} />
          </Link>
        </div>

        {historyItems.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar scroll-smooth snap-x snap-mandatory">
            {historyItems.map((item: any) => (
              <HistoryItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="px-4">
            <div className="py-8 border-2 border-dashed border-gray-100 rounded-2xl text-center flex flex-col items-center justify-center bg-gray-50/50">
              {loadingHistory ? (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic animate-pulse">Syncing history metrics...</p>
              ) : (
                <>
                  <Clock3 size={24} className="text-gray-300 mb-1.5" strokeWidth={1.5} />
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">No Browsing History</p>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* RECENT VERIFIED TRANSACTIONS SYSTEM MODULE */}
      <section className="mt-4 bg-white px-4 py-6 border-y border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black uppercase italic tracking-tighter text-zinc-900 text-sm">
            Recent <span className="text-zinc-300">Orders</span>
          </h2>
          <Link 
            href="/dashboard/orders" 
            className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1 active:opacity-70 transition-opacity"
          >
            View all <ChevronRight size={12} />
          </Link>
        </div>

        <div className="space-y-4 divide-y divide-gray-50">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.slice(0, 3).map((order: any, idx: number) => (
              <div key={order.id} className={idx > 0 ? 'pt-3' : ''}>
                <OrderRow order={order} />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto text-gray-200 mb-2" size={32} strokeWidth={1} />
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Zero Active Orders</p>
            </div>
          )}
        </div>
      </section>

      {/* PRIMARY ACCOUNT CONTROL NAV LINKS */}
      <section className="mt-4 bg-white px-4 py-1 mb-10 divide-y divide-gray-100 border-y border-gray-100">
        <MenuItem label="Profile" icon={<User size={18} />} href="/dashboard/profile" />
        <MenuItem label="Address" icon={<MapPin size={18} />} href="/dashboard/addresses" />
        <MenuItem label="Support" icon={<MessageSquare size={18} />} href="/dashboard/support" />
        <MenuItem label="Security" icon={<Shield size={18} />} href="/dashboard/security" />

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-between py-5 active:bg-red-50/50 transition-colors px-2 rounded-xl mt-1"
        >
          <div className="flex items-center gap-3 text-red-600">
            <LogOut size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>
      </section>
    </div>
  );
}

/* ======================================================
   ATOM SUB-RENDER COMPONENT INTERFACES
   ====================================================== */

function QuickCard({ icon, title, value, href }: any) {
  return (
    <Link 
      href={href} 
      className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm active:scale-[0.97] transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 text-zinc-400 mb-3">
        <div className="shrink-0">{icon}</div>
        <span className="text-[9px] font-black uppercase tracking-widest block truncate">{title}</span>
      </div>
      <p className="text-2xl font-black italic text-zinc-900 tracking-tighter leading-none">{value}</p>
    </Link>
  );
}

function HistoryItemCard({ item }: any) {
  // Graceful fallback mapping for image resolution pipelines
  const displayImage = item.image || item.imageUrl || (item.images && item.images[0]?.imageUrl);
  
  return (
    <Link 
      href={`/product/${item.id}`} 
      className="min-w-[140px] max-w-[140px] group shrink-0 snap-start select-none"
    >
      <div className="h-40 rounded-2xl bg-zinc-50 overflow-hidden relative border border-gray-100 shadow-sm group-active:scale-[0.97] transition-all duration-200">
        {displayImage ? (
          <Image 
            src={displayImage} 
            alt={item.title || 'Product History Detail'} 
            fill 
            sizes="140px"
            className="object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={24} className="text-gray-200" />
          </div>
        )}
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="text-[10px] font-black uppercase italic text-zinc-800 line-clamp-1 leading-tight group-hover:text-zinc-950 transition-colors">
          {item.title}
        </p>
        <p className="text-[11px] font-black text-[#A4143D] mt-0.5 tracking-tighter">
          ₦{Number(item.price || 0).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function OrderRow({ order }: any) {
  const orderImage = order.items?.[0]?.product?.images?.[0]?.imageUrl || order.items?.[0]?.product?.image;
  
  return (
    <div className="flex items-center justify-between py-1 group">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 relative">
          {orderImage ? (
            <Image 
              src={orderImage} 
              alt="Order thumbnail representation" 
              width={56} 
              height={56} 
              className="object-cover h-full w-full" 
            />
          ) : (
            <ShoppingBag size={20} className="text-gray-300" />
          )}
        </div>
        <div className="space-y-1 min-w-0">
          <p className="font-black text-[11px] uppercase italic text-zinc-900 truncate">
            #{order.orderNumber || order.id.slice(-6).toUpperCase()}
          </p>
          <div className="flex items-center gap-1.5">
            <div 
              className={`w-1.5 h-1.5 rounded-full ${
                order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'
              }`} 
            />
            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">{order.status}</p>
          </div>
        </div>
      </div>
      <p className="font-black italic text-sm text-zinc-900 tracking-tighter shrink-0 pl-2">
        ₦{Number(order.totalAmount || 0).toLocaleString()}
      </p>
    </div>
  );
}

function MenuItem({ label, icon, href }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center justify-between py-5 group active:bg-gray-50/70 transition-colors px-2 rounded-xl"
    >
      <div className="flex items-center gap-4">
        <div className="text-zinc-400 group-active:text-[#A4143D] transition-colors shrink-0">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-800 group-hover:text-zinc-950 transition-colors">
          {label}
        </span>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all duration-200" />
    </Link>
  );
}