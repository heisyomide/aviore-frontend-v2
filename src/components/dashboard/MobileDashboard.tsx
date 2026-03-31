'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  Heart,
  Ticket, // Changed from Wallet to Ticket
  MapPin,
  ChevronRight,
  User,
  MessageSquare,
  LogOut,
  ShoppingBag,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/src/store/useWishlistStore'; // Importing your Wishlist Store

interface MobileDashboardProps {
  data: any;
}

export function MobileDashboard({ data }: MobileDashboardProps) {
  // 1. DATA FETCHING: Name and Initials
  // We get the firstName from the profile or fall back to 'Hart'
  const userName = data?.profile?.firstName || data?.profile?.ownerName || 'Hart';
  const userInitials = userName.slice(0, 2).toUpperCase();

  // 2. WISHLIST SYNC: Using your existing store
  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems.length;

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
            {userInitials}
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
            value={wishlistCount}
            href="/wishlist"
          />

          {/* 🎫 CHANGED: Wallet to Coupons */}
          <QuickCard
            icon={<Ticket size={18} />}
            title="Coupons"
            value={data?.stats?.activeCoupons || 0}
            href="/dashboard/coupons"
          />

          <QuickCard
            icon={<MapPin size={18} />}
            title="Addresses"
            value={data?.addresses?.length || 0}
            href="/dashboard/address"
          />
        </div>
      </header>

      {/* Saved Items (Fetching from Wishlist Store) */}
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

        {wishlistItems.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
            {wishlistItems.map((item: any) => (
              <SavedItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="px-4 text-sm text-gray-400">
            No saved items
          </p>
        )}
      </section>

      {/* Recent Orders (Fetching Real Order Images) */}
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
      <section className="mt-4 bg-white px-4 py-5 space-y-1">
        <MenuItem
          label="Profile"
          icon={<User size={18} />}
          href="/dashboard/profile" // Redirects to Dashboard Profile
        />

        <MenuItem
          label="Support"
          icon={<MessageSquare size={18} />}
          href="/dashboard/support"
        />

        {/* Added Security before Logout */}
        <MenuItem
          label="Security"
          icon={<Shield size={18} />}
          href="/dashboard/security"
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

/* Helper Components */

function QuickCard({ icon, title, value, href }: any) {
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
  // Use the image from the wishlist store item
  const displayImage = item.image || item.imageUrl || (item.images && item.images[0]?.imageUrl);

  return (
    <Link href={`/product/${item.id}`} className="min-w-[140px] max-w-[140px]">
      <div className="h-32 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-100">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={20} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-900 line-clamp-1">{item.title}</p>
        <p className="text-sm font-semibold text-gray-900">₦{item.price?.toLocaleString()}</p>
      </div>
    </Link>
  );
}

function OrderRow({ order }: any) {
  // Fetch image from the first product in the order if available
  const orderImage = order.items?.[0]?.product?.images?.[0]?.imageUrl;

  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
          {orderImage ? (
            <Image src={orderImage} alt="order" width={48} height={48} className="object-cover h-full w-full" />
          ) : (
            <ShoppingBag size={18} className="text-gray-400" />
          )}
        </div>

        <div>
          <p className="font-medium text-sm text-gray-900">
            {order.orderNumber || `Order #${order.id.slice(-6).toUpperCase()}`}
          </p>
          <p className={`text-xs ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-amber-500'}`}>
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

function MenuItem({ label, icon, href }: any) {
  return (
    <Link href={href} className="flex items-center justify-between py-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="text-gray-600">{icon}</div>
        <span className="text-sm text-gray-900 font-medium">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </Link>
  );
}