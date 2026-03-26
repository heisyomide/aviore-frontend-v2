'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  Star,
  BarChart3,
  Wallet,
  Megaphone,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Navbar } from '../../components/navbar/Navbar';
import {Breadcrumb} from '@/src/components/Breadcrumb';

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItem = (href: string, label: string, Icon: any) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
          active
            ? 'bg-orange-500 text-white'
            : 'text-gray-300 hover:bg-gray-800'
        }`}
      >
        <Icon size={18} />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <div className="flex flex-1">

        {/* Sidebar */}
        <aside
          className={`bg-gray-900 text-white transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-64'
          } p-4 hidden lg:flex flex-col`}
        >

          {/* Store Info */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">
              A
            </div>

            {!collapsed && (
              <div>
                <h2 className="text-sm font-semibold">Aviorè Store</h2>
                <p className="text-xs text-gray-400">Vendor Account</p>
              </div>
            )}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-6 self-end p-1 rounded hover:bg-gray-800"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">

            {navItem('/vendor', 'Overview', LayoutDashboard)}
            {navItem('/vendor/orders', 'Orders', ShoppingCart)}
            {navItem('/vendor/products', 'Products', Package)}
            {navItem('/vendor/inventory', 'Inventory', Boxes)}
            {navItem('/vendor/customers', 'Customers', Users)}
            {navItem('/vendor/reviews', 'Reviews', Star)}
            {navItem('/vendor/analytics', 'Analytics', BarChart3)}
            {navItem('/vendor/payouts', 'Payouts', Wallet)}
            {navItem('/vendor/marketing', 'Marketing', Megaphone)}
            {navItem('/vendor/settings', 'Settings', Settings)}
            {navItem('/vendor/support', 'Support', LifeBuoy)}

          </nav>

          {/* Footer */}
          {!collapsed && (
            <div className="mt-auto text-xs text-gray-500">
              Aviorè Vendor v1.0
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">
          <Breadcrumb />
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}