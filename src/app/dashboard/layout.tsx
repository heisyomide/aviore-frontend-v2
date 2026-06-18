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
  Shield,
  Bell,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Home,
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

  const isOverview = pathname === '/dashboard' || pathname === '/dashboard/overview';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />

      <Container className="pt-6 pb-20 lg:pb-10">
        {/* Desktop & Mobile Header Info */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back, Adaeze</h1>
            <p className="text-zinc-400 text-sm">Gold Member</p>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 bg-zinc-900 rounded-2xl border border-zinc-800"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ==================== SIDEBAR (Desktop) ==================== */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sticky top-6">
              <nav className="space-y-1">
                <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Overview" active={isOverview} />
                <SidebarLink href="/dashboard/orders" icon={ShoppingBag} label="Orders" />
                <SidebarLink href="/dashboard/history" icon={History} label="History" />
                <SidebarLink href="/dashboard/notifications" icon={Bell} label="Notifications" />
                <SidebarLink href="/dashboard/reviews" icon={Star} label="Reviews" />
                <SidebarLink href="/dashboard/profile" icon={User} label="Profile" />
                <SidebarLink href="/dashboard/coupons" icon={Ticket} label="Coupons" />
                <SidebarLink href="/dashboard/stores" icon={Store} label="Stores" />
                <SidebarLink href="/dashboard/addresses" icon={MapPin} label="Addresses" />
                <SidebarLink href="/dashboard/security" icon={Shield} label="Security" />
                <SidebarLink href="/dashboard/support" icon={LifeBuoy} label="Support" />

                <div className="pt-6 mt-6 border-t border-zinc-800">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-950/50 transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* ==================== MAIN CONTENT ==================== */}
          <main className="flex-1 min-w-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </Container>

      {/* ==================== MOBILE BOTTOM NAV ==================== */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 lg:hidden z-50">
        <div className="flex items-center justify-around py-2 max-w-md mx-auto">
          <MobileNavLink href="/dashboard" icon={Home} label="Home" />
          <MobileNavLink href="/dashboard/orders" icon={ShoppingBag} label="Orders" />
          <MobileNavLink href="/dashboard/stores" icon={Store} label="Stores" />
          <MobileNavLink href="/dashboard/profile" icon={User} label="Profile" />
        </div>
      </div>
    </div>
  );
}

/* ====================== HELPER COMPONENTS ====================== */

function SidebarLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: any;
  label: string;
  active?: boolean;
}) {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-[#A4143D] text-white'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href === '/dashboard' && pathname === '/dashboard');

  return (
    <Link
      href={href}
      className={`flex flex-col items-center py-2 px-4 rounded-xl transition-colors ${
        isActive ? 'text-[#A4143D]' : 'text-zinc-400'
      }`}
    >
      <Icon size={24} />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </Link>
  );
}