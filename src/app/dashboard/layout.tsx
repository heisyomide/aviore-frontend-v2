'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Bell,
  Star,
  User,
  Ticket,
  Store,
  MapPin,
  CreditCard,
  Shield,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  ChevronRight
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

  // Dynamic header title generation corresponding to the luxury viewport states
  const pageTitle = pathname.split('/').pop()?.replace('-', ' ') || 'overview';

  const navItem = (href: string, label: string, Icon: any) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 group ${
          active
            ? 'bg-[#161619] border border-zinc-800 text-white shadow-xl'
            : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-950/40'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <Icon 
            size={14} 
            className={`transition-colors duration-300 ${
              active ? 'text-[#991B1B]' : 'text-zinc-600 group-hover:text-zinc-400'
            }`} 
          />
          <span>{label}</span>
        </div>
        {active && <ChevronRight size={10} className="text-[#991B1B] animate-pulse" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 antialiased selection:bg-[#991B1B]/30">
      {/* Structural Marketplace Top Navbar */}
      <Navbar />

      <Container className="pt-6 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* MOBILE INTERACTIVE PORTAL HEADER CONTAINER */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-full mb-5 bg-[#111113] border border-zinc-900 rounded-2xl px-5 py-4 flex items-center justify-between text-zinc-400 active:scale-[0.99] transition-all"
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">Portal Navigation</span>
            <span className="font-sans font-medium text-white text-xs mt-0.5 capitalize">
              {pageTitle}
            </span>
          </div>
          <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-900 text-zinc-300">
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </div>
        </button>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* OBSIDIAN VERTICAL NAVIGATION ASIDE NODE */}
          <aside
            className={`
              ${mobileMenuOpen ? 'block' : 'hidden'}
              lg:block w-full lg:w-[250px] shrink-0 z-20
            `}
          >
            <div className="bg-[#111113] rounded-2xl border border-zinc-900/80 p-3 lg:sticky lg:top-28 space-y-6 shadow-2xl">
              <div>
                <p className="px-4 pt-2 pb-1 text-[8px] font-mono font-extrabold tracking-[0.25em] text-zinc-600 uppercase">
                  Member Portal
                </p>
                <nav className="space-y-1 mt-2">
                  {navItem('/dashboard', 'Dashboard', LayoutDashboard)}
                  {navItem('/dashboard/orders', 'Orders', ShoppingBag)}
                  {navItem('/dashboard/history', 'Wishlist', History)}
                  {navItem('/dashboard/addresses', 'Addresses', MapPin)}
                  {navItem('/dashboard/payments', 'Payment Methods', CreditCard)}
                  {navItem('/dashboard/profile', 'Profile Settings', User)}
                </nav>
              </div>

              {/* DYNAMIC EXTRA OVERLAY MENU OPTIONS STATED ON WIREFRAME MATRIX */}
              <div className="hidden lg:block border-t border-zinc-900/60 pt-4">
                <p className="px-4 pb-1 text-[8px] font-mono font-extrabold tracking-[0.25em] text-zinc-600 uppercase">
                  Ecosystem Utilities
                </p>
                <nav className="space-y-1 mt-2">
                  {navItem('/dashboard/notifications', 'Notifications', Bell)}
                  {navItem('/dashboard/reviews', 'Reviews', Star)}
                  {navItem('/dashboard/coupons', 'Coupons', Ticket)}
                  {navItem('/dashboard/stores', 'Stores', Store)}
                  {navItem('/dashboard/security', 'Security', Shield)}
                  {navItem('/dashboard/support', 'Support Manifest', LifeBuoy)}
                </nav>
              </div>

              {/* CONCIERGE ASSISTANCE CONTEXT LINK NODE (As seen on image_0b21c5.jpg) */}
              <div className="bg-zinc-950/60 rounded-xl border border-zinc-900/50 p-4 mx-1">
                <div className="flex items-start gap-3">
                  <LifeBuoy size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-300">Need Assistance?</h4>
                    <p className="text-[9px] text-zinc-600 font-sans leading-relaxed">Our Concierge Team is here to help you.</p>
                  </div>
                </div>
                <Link 
                  href="/dashboard/support"
                  className="w-full mt-3 block text-center bg-transparent border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-[9px] font-mono font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors"
                >
                  Contact Support
                </Link>
              </div>

              {/* LOGOUT MUTATION ACTION */}
              <div className="border-t border-zinc-900/60 pt-2 px-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/10 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer">
                  <LogOut size={13} className="text-zinc-600 transition-colors" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN SECURE SYSTEM MATRIX VIEWPORT */}
          <main className="flex-1 min-w-0 w-full">
            <div className="bg-[#111113] rounded-2xl border border-zinc-900 overflow-hidden min-h-[85vh] shadow-2xl flex flex-col">
              
              {/* STICKY LUXURY COMPONENT VIEWPORT HEADER */}
              <div className="px-6 py-5 border-b border-zinc-900/60 bg-[#111113]/90 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h1 className="text-sm font-mono font-bold uppercase tracking-[0.15em] text-white">
                      {pageTitle}
                    </h1>
                    <p className="hidden md:block text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-wider">
                      AVIORÈ System Node // Verified Environment
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 bg-zinc-950 px-3 py-1.5 border border-zinc-900 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Session</span>
                  </div>
                </div>
              </div>

              {/* STABLE CHILD VIEW CONTAINER PAGE RENDERS */}
              <div className="p-6 md:p-10 flex-1 flex flex-col bg-[#0D0D0D]/20">
                {children}
              </div>
            </div>
          </main>

        </div>
      </Container>
    </div>
  );
}