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

  // Dynamic header title generation corresponding to system state
  const pageTitle = pathname.split('/').pop()?.replace('-', ' ') || 'overview';
  const isOverview = pathname === '/dashboard' || pathname === '/dashboard/overview';

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#070708] text-[#E4E4E7] antialiased selection:bg-[#C5A880]/20 select-none">
      
      <Container className="pt-6 pb-24 lg:pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* LUXURY PORTAL CONTEXT HEADER */}
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
            
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-[#0E0E10] rounded-xl border border-[#161619] text-zinc-300 active:scale-[0.99] transition-all"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* OBSIDIAN VERTICAL NAVIGATION ASIDE NODE */}
          <aside
            className={`
              ${mobileMenuOpen ? 'block' : 'hidden'}
              lg:block w-full lg:w-[250px] shrink-0 z-20
            `}
          >
            <div className="bg-[#0A0A0C] rounded-2xl border border-[#141416] p-3 lg:sticky lg:top-6 space-y-6 shadow-2xl">
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

              {/* DYNAMIC EXTRA OVERLAY MENU OPTIONS STATED ON WIREFRAME MATRIX */}
              <div className="hidden lg:block border-t border-[#141416] pt-4">
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

              {/* CONCIERGE ASSISTANCE CONTEXT LINK NODE */}
              <div className="bg-black/40 rounded-xl border border-[#141416] p-4 mx-1">
                <div className="flex items-start gap-3">
                  <LifeBuoy size={14} className="text-zinc-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-300">Need Assistance?</h4>
                    <p className="text-[9px] text-zinc-500 font-sans leading-relaxed">Our Concierge Team is here to help you.</p>
                  </div>
                </div>
                <Link 
                  href="/dashboard/support"
                  className="w-full mt-3 block text-center bg-transparent border border-[#161619] hover:border-zinc-700 text-zinc-300 text-[9px] font-mono font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors"
                >
                  Contact Support
                </Link>
              </div>

              {/* LOGOUT MUTATION ACTION */}
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

          {/* MAIN SECURE SYSTEM MATRIX VIEWPORT */}
          <main className="flex-1 min-w-0 w-full">
            <div className="bg-[#0A0A0C] rounded-2xl border border-[#141416] overflow-hidden min-h-[85vh] shadow-2xl flex flex-col">
              <div className="p-6 md:p-10 flex-1 flex flex-col bg-black/10">
                {children}
              </div>
            </div>
          </main>

        </div>
      </Container>

      {/* ==================== MOBILE BOTTOM NAV ==================== */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0C]/90 backdrop-blur-md border-t border-[#141416] lg:hidden z-50 px-4">
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