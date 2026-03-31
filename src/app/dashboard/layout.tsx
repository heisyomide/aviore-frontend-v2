'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Star,
  User,
  Ticket,
  Store,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  LifeBuoy,
  LogOut,
  Menu,
  X
} from 'lucide-react';

import { Navbar } from '../../components/navbar/Navbar';
import { Container } from '../../components/layout/Container';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle =
    pathname.split('/').pop()?.replace('-', ' ') || 'overview';

  const navItem = (
    href: string,
    label: string,
    Icon: any
  ) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
          active
            ? 'bg-[#A4143D] text-white'
            : 'text-zinc-600 hover:bg-zinc-100'
        }`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <Container className="pt-6 pb-10">
        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          className="lg:hidden w-full mb-4 bg-white border border-zinc-200 rounded-2xl px-4 py-4 flex items-center justify-between"
        >
          <span className="font-medium text-gray-900 text-sm">
            Dashboard Menu
          </span>

          {mobileMenuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside
            className={`
              ${
                mobileMenuOpen
                  ? 'block'
                  : 'hidden'
              }
              lg:block w-full lg:w-[260px] shrink-0
            `}
          >
            <div className="bg-white rounded-3xl border border-zinc-200 p-3 sticky top-24">
              <nav className="space-y-2">
                {navItem(
                  '/dashboard',
                  'Overview',
                  LayoutDashboard
                )}

                {navItem(
                  '/dashboard/orders',
                  'Orders',
                  ShoppingBag
                )}

                {navItem(
                  '/dashboard/history',
                  'History',
                  History
                )}

                {navItem(
                  '/dashboard/notifications',
                  'Notifications',
                  Bell
                )}

                {navItem(
                  '/dashboard/reviews',
                  'Reviews',
                  Star
                )}

                {navItem(
                  '/dashboard/profile',
                  'Profile',
                  User
                )}

                {navItem(
                  '/dashboard/coupons',
                  'Coupons',
                  Ticket
                )}

                {navItem(
                  '/dashboard/stores',
                  'Stores',
                  Store
                )}

                {navItem(
                  '/dashboard/addresses',
                  'Address',
                  MapPin
                )}

                {navItem(
                  '/dashboard/payments',
                  'Payments',
                  CreditCard
                )}

                {navItem(
                  '/dashboard/security',
                  'Security',
                  Shield
                )}

                {navItem(
                  '/dashboard/support',
                  'Support',
                  LifeBuoy
                )}

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 mt-4">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden min-h-[80vh]">
              {/* Fixed Top Header */}
              <div className="px-6 py-5 border-b border-zinc-100 bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-semibold capitalize text-zinc-900">
                    {pageTitle}
                  </h1>

                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Active
                  </div>
                </div>
              </div>

              {/* Stable Content Area */}
              <div className="p-5 md:p-8 min-h-[70vh]">
                {children}
              </div>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}