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
  ChevronRight,
  CreditCard
} from 'lucide-react';

import { Container } from '../../components/layout/Container';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageTitle = pathname.split('/').pop()?.replace('-', ' ') || 'overview';
  const isOverview = pathname === '/dashboard' || pathname === '/dashboard/overview';

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#E4E4E7] antialiased selection:bg-[#C5A880]/20 select-none">
      
      <Container className="pt-6 pb-24 lg:pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* SYSTEM STATUS HEADER */}
        <div className="flex items-center justify-between mb-6 bg-[#0A0A0C] border border-[#141416] rounded-2xl px-5 py-4 shadow-2xl">
          <div className="space-y-0.5">
            <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest block">
              Verified Session Token
            </span>
            <h1 className="text-xs font-mono font-bold uppercase tracking-[0.15em] text-white">
              {pageTitle}
            </h1>
            <p className="hidden md:block text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
              AVIORÈ System Node // Secure Environment
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-400 bg-black/40 px-3 py-1.5 border border-[#161619] rounded-lg">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>Active Node</span>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-[#0E0E10] rounded-xl border border-[#161619] text-zinc-300 active:scale-[0.99] transition-all"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* DESKTOP SIDEBAR PANEL */}
          <aside className="hidden lg:block w-[250px] shrink-0 z-20">
            <div className="bg-[#0A0A0C] rounded-2xl border border-[#141416] p-3 sticky top-6 space-y-6 shadow-2xl">
              <div>
                <p className="px-4 pt-2 pb-1 text-[8px] font-mono font-extrabold tracking-[0.25em] text-zinc-600 uppercase">
                  Member Portal
                </p>
                <nav className="space-y-1 mt-2">
                  <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" active={isOverview} />
                  <SidebarLink href="/dashboard/orders" icon={ShoppingBag} label="Orders" />
                  <SidebarLink href="/dashboard/history" icon={History} label="Wishlist" />
                  <SidebarLink href="/dashboard/addresses" icon={MapPin} label="Addresses" />
                  <SidebarLink href="/dashboard/payments" icon={CreditCard} label="Payment Methods" />
                  <SidebarLink href="/dashboard/profile" icon={User} label="Profile Settings" />
                </nav>
              </div>

              <div className="border-t border-[#141416] pt-4">
                <p className="px-4 pb-1 text-[8px] font-mono font-extrabold tracking-[0.25em] text-zinc-600 uppercase">
                  Ecosystem Utilities
                </p>
                <nav className="space-y-1 mt-2">
                  <SidebarLink href="/dashboard/notifications" icon={Bell} label="Notifications" />
                  <SidebarLink href="/dashboard/reviews" icon={Star} label="Reviews" />
                  <SidebarLink href="/dashboard/coupons" icon={Ticket} label="Coupons" />
                  <SidebarLink href="/dashboard/stores" icon={Store} label="Stores" />
                  <SidebarLink href="/dashboard/security" icon={Shield} label="Security" />
                  <SidebarLink href="/dashboard/support" icon={LifeBuoy} label="Support Manifest" />
                </nav>
              </div>

              <div className="border-t border-[#141416] pt-2 px-1">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/10 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer text-left"
                >
                  <LogOut size={13} className="text-zinc-600 transition-colors" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* MOBILE SLIDEOUT DRAWERS OVERLAY */}
          {mobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          <aside
            className={`
              lg:hidden fixed top-0 right-0 h-full w-[280px] bg-[#0A0A0C] border-l border-[#141416] p-4 z-50 shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#141416]">
              <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em]">Portal Navigation</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 bg-[#0E0E10] rounded-lg border border-[#161619] text-zinc-400"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="px-3 text-[8px] font-mono font-extrabold tracking-[0.25em] text-zinc-600 uppercase">Ecosystem Utilities</p>
                <nav className="space-y-1 mt-2">
                  <SidebarLink href="/dashboard/notifications" icon={Bell} label="Notifications" />
                  <SidebarLink href="/dashboard/addresses" icon={MapPin} label="Addresses" />
                  <SidebarLink href="/dashboard/payments" icon={CreditCard} label="Payment Methods" />
                  <SidebarLink href="/dashboard/history" icon={History} label="Wishlist" />
                  <SidebarLink href="/dashboard/reviews" icon={Star} label="Reviews" />
                  <SidebarLink href="/dashboard/coupons" icon={Ticket} label="Coupons" />
                  <SidebarLink href="/dashboard/security" icon={Shield} label="Security" />
                  <SidebarLink href="/dashboard/support" icon={LifeBuoy} label="Support Manifest" />
                </nav>
              </div>

              <div className="border-t border-[#141416] pt-4 px-1">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/10 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer text-left"
                >
                  <LogOut size={13} className="text-zinc-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN SYSTEM VIEWPORT CONTAINER */}
          <main className="flex-1 min-w-0 w-full">
            <div className="bg-[#0A0A0C] rounded-2xl border border-[#141416] overflow-hidden min-h-[85vh] shadow-2xl flex flex-col">
              <div className="p-6 md:p-10 flex-1 flex flex-col bg-black/10">
                {children}
              </div>
            </div>
          </main>

        </div>
      </Container>

      {/* FIXED MOBILE BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0C]/90 backdrop-blur-md border-t border-[#141416] lg:hidden z-30 px-4">
        <div className="flex items-center justify-around py-2 max-w-md mx-auto">
          <MobileNavLink href="/dashboard" icon={Home} label="Home" active={isOverview} />
          <MobileNavLink href="/dashboard/orders" icon={ShoppingBag} label="Orders" />
          <MobileNavLink href="/dashboard/stores" icon={Store} label="Stores" />
          <MobileNavLink href="/dashboard/profile" icon={User} label="Profile" />
        </div>
      </div>
    </div>
  );
}

/* ====================== UTILITY COMPONENTS ====================== */

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
      className={`flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-mono font-bold uppercase tracking-[0.15em] transition-all duration-300 group ${
        isActive
          ? 'bg-[#141416] border border-[#27272A] text-white shadow-xl'
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-[#0E0E10]/50'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <Icon 
          size={14} 
          className={`transition-colors duration-300 ${
            isActive ? 'text-[#C5A880]' : 'text-zinc-600 group-hover:text-zinc-400'
          }`} 
        />
        <span>{label}</span>
      </div>
      {isActive && <ChevronRight size={12} className="text-[#C5A880]" />}
    </Link>
  );
}

function MobileNavLink({
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
      className={`flex flex-col items-center py-2 px-4 rounded-xl transition-colors duration-300 ${
        isActive ? 'text-[#C5A880]' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      <Icon size={18} className="transition-colors duration-300" />
      <span className="text-[8px] font-mono font-bold uppercase tracking-wider mt-1">{label}</span>
    </Link>
  );
}