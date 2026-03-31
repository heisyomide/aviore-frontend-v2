'use client';

import {
  Package,
  Heart,
  Wallet,
  MapPin,
  ChevronRight,
  User,
  MessageSquare,
  LogOut,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileDashboardProps {
  data: any;
}

export function MobileDashboard({ data }: MobileDashboardProps) {
  const userName = data?.profile?.ownerName || 'Hart';
  const savedItems = data?.savedItems || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good evening, {userName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold">
            {userName.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <QuickCard
            icon={<Package size={18} />}
            title="Orders"
            value={data?.stats?.totalOrders || 0}
            href="/dashboard/orders"
          />

          <QuickCard
            icon={<Heart size={18} />}
            title="Wishlist"
            value={data?.wishlistCount || 0}
            href="/wishlist"
          />

          <QuickCard
            icon={<Wallet size={18} />}
            title="Wallet"
            value={`₦${(
              data?.wallet?.availableBalance || 0
            ).toLocaleString()}`}
            href="/dashboard/finance"
          />

          <QuickCard
            icon={<MapPin size={18} />}
            title="Addresses"
            value={data?.addresses?.length || 0}
            href="/dashboard/addresses"
          />
        </div>
      </header>

      {/* Saved Items */}
      <section className="mt-4 bg-white py-5">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="font-semibold text-gray-900">
            Saved Items
          </h2>

          <Link
            href="/wishlist"
            className="text-sm text-blue-600 flex items-center"
          >
            See all <ChevronRight size={14} />
          </Link>
        </div>

        {savedItems.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto px-4 pb-2">
            {savedItems.map((item: any) => (
              <SavedItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="px-4 text-sm text-gray-400">
            No saved items
          </p>
        )}
      </section>

      {/* Recent Orders */}
      <section className="mt-4 bg-white px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Recent Orders
          </h2>

          <Link
            href="/dashboard/orders"
            className="text-sm text-blue-600 flex items-center"
          >
            View all <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {data?.recentOrders?.length > 0 ? (
            data.recentOrders.map((order: any) => (
              <OrderRow key={order.id} order={order} />
            ))
          ) : (
            <p className="text-sm text-gray-400">
              No recent orders
            </p>
          )}
        </div>
      </section>

      {/* Account Menu */}
      <section className="mt-4 bg-white px-4 py-5">
        <MenuItem
          label="Profile"
          icon={<User size={18} />}
          href="/dashboard/settings"
        />

        <MenuItem
          label="Support"
          icon={<MessageSquare size={18} />}
          href="/dashboard/support"
        />

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-between py-4"
        >
          <div className="flex items-center gap-3 text-red-500">
            <LogOut size={18} />
            <span className="text-sm font-medium">
              Log Out
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>
      </section>
    </div>
  );
}

/* Components */

function QuickCard({
  icon,
  title,
  value,
  href,
}: any) {
  return (
    <Link
      href={href}
      className="border border-gray-200 rounded-xl p-4 bg-white"
    >
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <p className="text-lg font-semibold text-gray-900">
        {value}
      </p>
    </Link>
  );
}

function SavedItemCard({ item }: any) {
  return (
    <Link
      href={`/product/${item.id}`}
      className="min-w-[140px] max-w-[140px]"
    >
      <div className="h-32 rounded-xl bg-gray-100 overflow-hidden relative">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={20} />
          </div>
        )}
      </div>

      <div className="mt-2">
        <p className="text-sm text-gray-900 line-clamp-1">
          {item.title}
        </p>

        <p className="text-sm font-semibold text-gray-900">
          ₦{item.price?.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

function OrderRow({ order }: any) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <ShoppingBag size={18} />
        </div>

        <div>
          <p className="font-medium text-sm text-gray-900">
            {order.artifact || `Order #${order.id.slice(-6)}`}
          </p>
          <p className="text-xs text-green-600">
            {order.status}
          </p>
        </div>
      </div>

      <p className="font-semibold text-sm text-gray-900">
        ₦{(order.amount || order.totalAmount).toLocaleString()}
      </p>
    </div>
  );
}

function MenuItem({
  label,
  icon,
  href,
}: any) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-4 border-b border-gray-100"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-gray-900">
          {label}
        </span>
      </div>

      <ChevronRight size={16} className="text-gray-300" />
    </Link>
  );
}