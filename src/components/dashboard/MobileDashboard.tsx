'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Ticket,
  MapPin,
  ChevronRight,
  Bell,
  ShoppingBag,
  Star,
  Menu,
  CheckCircle2,
  Clock,
  TrendingUp,
  Store,
  Navigation,
  LayoutGrid,
  User,
  Package,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/src/store/useWishlistStore';
import { api } from '@/src/lib/axios';

interface MobileDashboardProps {
  data: any;
}

export function MobileDashboard({ data }: MobileDashboardProps) {
  const [couponCount, setCouponCount] = useState(0);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const fullName = useMemo(
    () =>
      data?.name ||
      `${data?.firstName || ''} ${data?.lastName || ''}`.trim(),
    [data]
  );

  const userInitials = useMemo(() => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : fullName.slice(0, 2).toUpperCase();
  }, [fullName]);

  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    api
      .get('/vendor/marketing/active')
      .then((r) => {
        if (Array.isArray(r.data)) setCouponCount(r.data.length);
      })
      .catch(() => {});
  }, []);

  const totalSpent =
    data?.totalSpent ??
    data?.recentOrders?.reduce(
      (s: number, o: any) => s + Number(o.totalAmount || 0),
      0
    ) ??
    0;

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F7F5F2' }}>

      {/* TOP BAR */}
      <header
        className="flex items-center justify-between px-5 pt-12 pb-4 bg-white"
        style={{ borderBottom: '1px solid #EDE9E3' }}
      >
        <button
          className="w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: '#F7F5F2' }}
        >
          <Menu size={18} style={{ color: '#111827' }} />
        </button>

        <span
          className="text-[15px] font-black uppercase"
          style={{ color: '#111827', letterSpacing: '0.22em' }}
        >
          AVIORE
        </span>

        <Link
          href="/dashboard/notifications"
          className="w-9 h-9 flex items-center justify-center rounded-xl relative"
          style={{ background: '#F7F5F2' }}
        >
          <Bell size={18} style={{ color: '#111827' }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#A4143D' }}
          />
        </Link>
      </header>

      {/* WELCOME + STATS */}
      <section
        className="bg-white px-5 pt-6 pb-7"
        style={{ borderBottom: '1px solid #EDE9E3' }}
      >
        {/* Welcome row */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-base shrink-0"
            style={{ background: '#111827' }}
          >
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: '#9CA3AF' }}
            >
              {greeting}
            </p>
            <h2
              className="text-[19px] font-black leading-tight capitalize truncate"
              style={{ color: '#111827' }}
            >
              {fullName}
            </h2>
            <div className="flex items-center gap-1 mt-1">
              <Star size={10} fill="#B8922A" style={{ color: '#B8922A' }} />
              <span
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: '#B8922A' }}
              >
                Gold Member
              </span>
              <ChevronRight size={10} style={{ color: '#B8922A' }} />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-6">
          <p
            className="text-[9px] font-black uppercase tracking-[0.2em] mb-3"
            style={{ color: '#9CA3AF' }}
          >
            Account Overview
          </p>
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label="Total Orders"
              value={data?._count?.orders ?? data?.totalOrders ?? 0}
              icon={<Package size={13} />}
            />
            <StatTile
              label="Delivered"
              value={data?.deliveredOrders ?? 0}
              icon={<CheckCircle2 size={13} />}
              accent="#059669"
            />
            <StatTile
              label="Processing"
              value={data?.pendingOrders ?? 0}
              icon={<Clock size={13} />}
              accent="#D97706"
            />
            <StatTile
              label="Total Spent"
              value={`₦${Number(totalSpent).toLocaleString()}`}
              icon={<TrendingUp size={13} />}
              accent="#A4143D"
              large
            />
          </div>
        </div>

        {/* Recent order preview */}
        {data?.recentOrders?.[0] && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[9px] font-black uppercase tracking-[0.18em]"
                style={{ color: '#9CA3AF' }}
              >
                Recent Order
              </p>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-widest"
                style={{ color: '#A4143D' }}
              >
                View all <ChevronRight size={10} />
              </Link>
            </div>
            <RecentOrderCard order={data.recentOrders[0]} />
          </div>
        )}
      </section>

      {/* QUICK ACTIONS */}
      <section
        className="bg-white mt-3 px-5 py-6"
        style={{ borderBottom: '1px solid #EDE9E3' }}
      >
        <p
          className="text-[9px] font-black uppercase tracking-[0.2em] mb-4"
          style={{ color: '#9CA3AF' }}
        >
          Quick Actions
        </p>
        <div className="grid grid-cols-4 gap-2">
          <QuickAction
            href="/dashboard/orders"
            icon={<Navigation size={18} />}
            label="Track Order"
          />
          <QuickAction
            href="/dashboard/stores"
            icon={<Store size={18} />}
            label="Browse Stores"
          />
          <QuickAction
            href="/dashboard/coupons"
            icon={<Ticket size={18} />}
            label="Coupons"
            badge={couponCount > 0 ? couponCount : undefined}
          />
          <QuickAction
            href="/dashboard/addresses"
            icon={<MapPin size={18} />}
            label="Addresses"
          />
        </div>
      </section>

      {/* SAVED PRODUCTS */}
      <section
        className="bg-white mt-3 py-6"
        style={{ borderBottom: '1px solid #EDE9E3' }}
      >
        <div className="flex items-center justify-between px-5 mb-4">
          <p
            className="text-[9px] font-black uppercase tracking-[0.2em]"
            style={{ color: '#111827' }}
          >
            Saved Products
          </p>
          <Link
            href="/wishlist"
            className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-widest"
            style={{ color: '#A4143D' }}
          >
            See all <ChevronRight size={10} />
          </Link>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
            {wishlistItems.map((item: any) => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div
            className="mx-5 py-7 rounded-2xl border-2 border-dashed text-center"
            style={{ borderColor: '#EDE9E3' }}
          >
            <Heart
              size={22}
              style={{ color: '#D1C9BF', margin: '0 auto 6px' }}
            />
            <p
              className="text-[9px] font-black uppercase tracking-widest"
              style={{ color: '#C5BAB0' }}
            >
              No saved items yet
            </p>
          </div>
        )}
      </section>

      {/* RECENT ORDERS LIST */}
      <section
        className="bg-white mt-3 px-5 py-6"
        style={{ borderBottom: '1px solid #EDE9E3' }}
      >
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-[9px] font-black uppercase tracking-[0.2em]"
            style={{ color: '#111827' }}
          >
            Recent Orders
          </p>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-widest"
            style={{ color: '#A4143D' }}
          >
            View all <ChevronRight size={10} />
          </Link>
        </div>

        <div className="space-y-1 divide-y" style={{ borderColor: '#F7F5F2' }}>
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders
              .slice(0, 4)
              .map((order: any) => <OrderRow key={order.id} order={order} />)
          ) : (
            <div className="text-center py-8">
              <ShoppingBag
                size={28}
                style={{ color: '#D1C9BF', margin: '0 auto 8px' }}
                strokeWidth={1.5}
              />
              <p
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: '#C5BAB0' }}
              >
                No orders yet
              </p>
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
}

/* ─── ATOMS ─────────────────────────────────────────────────────── */

function StatTile({
  label,
  value,
  icon,
  accent = '#111827',
  large = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
  large?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#FFFFFF', border: '1px solid #EDE9E3' }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span style={{ color: accent }}>{icon}</span>
        <span
          className="text-[8px] font-black uppercase tracking-widest"
          style={{ color: '#9CA3AF' }}
        >
          {label}
        </span>
      </div>
      <p
        className={`font-black italic tracking-tighter leading-none ${
          large ? 'text-[14px]' : 'text-[22px]'
        }`}
        style={{ color: '#111827' }}
      >
        {value}
      </p>
    </div>
  );
}

function RecentOrderCard({ order }: { order: any }) {
  const img = order.items?.[0]?.product?.images?.[0]?.imageUrl;
  const statusColors: Record<string, { bg: string; text: string }> = {
    DELIVERED: { bg: '#ECFDF5', text: '#059669' },
    PROCESSING: { bg: '#FFFBEB', text: '#D97706' },
    SHIPPED: { bg: '#EFF6FF', text: '#2563EB' },
    CANCELLED: { bg: '#FFF1F2', text: '#A4143D' },
  };
  const sc = statusColors[order.status] ?? { bg: '#F3F4F6', text: '#6B7280' };

  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="flex items-center gap-3 p-3 rounded-2xl active:scale-[0.98] transition-transform"
      style={{ background: '#F7F5F2', border: '1px solid #EDE9E3' }}
    >
      <div
        className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: '#EDE9E3' }}
      >
        {img ? (
          <Image
            src={img}
            alt="order"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        ) : (
          <ShoppingBag size={18} style={{ color: '#C5BAB0' }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] font-black uppercase italic truncate"
          style={{ color: '#111827' }}
        >
          #{order.orderNumber || order.id.slice(-6).toUpperCase()}
        </p>
        <p className="text-[9px] font-medium mt-0.5" style={{ color: '#9CA3AF' }}>
          {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}{' '}
          · {order.vendors?.length ?? 0} vendor
          {order.vendors?.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span
          className="text-[8px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{ background: sc.bg, color: sc.text }}
        >
          {order.status}
        </span>
        <p className="text-[12px] font-black italic" style={{ color: '#111827' }}>
          ₦{Number(order.totalAmount || 0).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1.5">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center relative active:scale-95 transition-transform"
        style={{ background: '#FFFFFF', border: '1px solid #EDE9E3' }}
      >
        <span style={{ color: '#A4143D' }}>{icon}</span>
        {badge !== undefined && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white"
            style={{ background: '#A4143D' }}
          >
            {badge}
          </span>
        )}
      </div>
      <span
        className="text-[8px] font-black uppercase tracking-wide text-center leading-tight"
        style={{ color: '#6B7280' }}
      >
        {label}
      </span>
    </Link>
  );
}

function WishlistCard({ item }: { item: any }) {
  const img = item.image || item.imageUrl || item.images?.[0]?.imageUrl;
  return (
    <Link href={`/product/${item.id}`} className="shrink-0 w-[140px]">
      <div
        className="w-full h-36 rounded-2xl overflow-hidden relative active:scale-95 transition-transform"
        style={{ background: '#F0EDE8', border: '1px solid #EDE9E3' }}
      >
        {img ? (
          <Image src={img} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={22} style={{ color: '#C5BAB0' }} />
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p
          className="text-[10px] font-black uppercase italic leading-tight line-clamp-1"
          style={{ color: '#111827' }}
        >
          {item.title}
        </p>
        <p className="text-[11px] font-black mt-0.5" style={{ color: '#A4143D' }}>
          ₦{Number(item.price || 0).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function OrderRow({ order }: { order: any }) {
  const img = order.items?.[0]?.product?.images?.[0]?.imageUrl;
  const dotColor =
    order.status === 'DELIVERED'
      ? '#059669'
      : order.status === 'SHIPPED'
      ? '#2563EB'
      : '#D97706';

  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="flex items-center gap-3 py-3 active:opacity-70 transition-opacity"
    >
      <div
        className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
        style={{ background: '#F0EDE8', border: '1px solid #EDE9E3' }}
      >
        {img ? (
          <Image
            src={img}
            alt="order"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        ) : (
          <ShoppingBag size={16} style={{ color: '#C5BAB0' }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] font-black uppercase italic"
          style={{ color: '#111827' }}
        >
          #{order.orderNumber || order.id.slice(-6).toUpperCase()}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: dotColor }}
          />
          <p
            className="text-[8px] font-black uppercase tracking-widest"
            style={{ color: '#9CA3AF' }}
          >
            {order.status}
          </p>
        </div>
      </div>
      <p className="text-[13px] font-black italic shrink-0" style={{ color: '#111827' }}>
        ₦{Number(order.totalAmount || 0).toLocaleString()}
      </p>
    </Link>
  );
}

function BottomNav() {
  const items = [
    { href: '/dashboard', icon: <LayoutGrid size={20} />, label: 'Overview' },
    { href: '/dashboard/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
    { href: '/dashboard/stores', icon: <Store size={20} />, label: 'Stores' },
    { href: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 flex items-center justify-around px-4 pt-3 pb-6 z-50"
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid #EDE9E3',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}
    >
      {items.map(({ href, icon, label }, i) => {
        const active = i === 0;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5"
          >
            <span style={{ color: active ? '#A4143D' : '#9CA3AF' }}>{icon}</span>
            <span
              className="text-[8px] font-black uppercase tracking-widest"
              style={{ color: active ? '#A4143D' : '#9CA3AF' }}
            >
              {label}
            </span>
            {active && (
              <span
                className="w-1 h-1 rounded-full mt-0.5"
                style={{ background: '#A4143D' }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}