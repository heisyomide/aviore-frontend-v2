'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import {
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  Star,
  User,
  Ticket,
  Store,
  History,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  LifeBuoy,
} from 'lucide-react';

import { Navbar } from '@/src/components/Header';
import {Breadcrumb} from '@/src/components/Breadcrumb'; // adjust path if needed

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [ordersOpen, setOrdersOpen] = useState(true);

  const navItem = (
    href: string,
    label: string,
    Icon: any
  ) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
          active
            ? 'bg-orange-50 text-orange-600 font-semibold'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ✅ Universal Navbar */}
      <Navbar />

      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-5 hidden lg:block">

          <h2 className="text-lg font-bold mb-6">My Account</h2>

          <div className="space-y-1">

            {navItem('/dashboard', 'Overview', LayoutDashboard)}

            {/* Orders Expandable */}
            <div>
              <button
                onClick={() => setOrdersOpen(!ordersOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={18} />
                  <span className="font-medium">Orders</span>
                </div>

                <ChevronDown
                  size={16}
                  className={`transition ${ordersOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {ordersOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {navItem('/dashboard/orders', 'All Orders', ShoppingBag)}

                </div>
              )}
            </div>

            {navItem('/dashboard/reviews', 'Your Reviews', Star)}
            {navItem('/dashboard/profile', 'Your Profile', User)}
            {navItem('/dashboard/coupons', 'Coupons & Offers', Ticket)}
            {navItem('/dashboard/stores', 'Followed Stores', Store)}
            {navItem('/dashboard/history', 'Browsing History', History)}
            {navItem('/dashboard/addresses', 'Addresses', MapPin)}
            {navItem('/dashboard/payments', 'Payment Methods', CreditCard)}
            {navItem('/dashboard/security', 'Account Security', Shield)}
            {navItem('/dashboard/notifications', 'Notifications', Bell)}
            {navItem('/dashboard/support', 'Support', LifeBuoy)}

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">

          {/* ✅ Universal Breadcrumb */}
          <Breadcrumb />

          <div className="mt-6">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}