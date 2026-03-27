'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  LogOut,
  Menu,
  X,
  Fingerprint
} from 'lucide-react';

import { Navbar } from '../../components/navbar/Navbar';
import { Breadcrumb } from '@/src/components/Breadcrumb';
import { Container } from '../../components/layout/Container';

/**
 * 🚀 DASHBOARD LAYOUT (Organism)
 * Refined for Maximum Structural "Fit" and Brand Authority.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItem = (href: string, label: string, Icon: any, isSubItem = false) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 group ${
          active
            ? 'bg-[#A4143D] text-white shadow-xl shadow-[#A4143D]/20'
            : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900'
        } ${isSubItem ? 'ml-6 py-2' : ''}`}
      >
        <Icon size={active ? 15 : 14} className={active ? 'text-white' : 'text-zinc-300 group-hover:text-zinc-900'} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
       <Navbar />

      <Container className="flex-1 flex flex-col lg:flex-row gap-10 pt-8 lg:pt-14 pb-24">
        
        {/* 📱 MOBILE SIDEBAR TRIGGER - Enhanced for HUD feel */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-between bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm mb-4"
        >
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-[#A4143D] flex items-center justify-center text-white shadow-lg shadow-[#A4143D]/20">
                <Fingerprint size={16} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Access_Terminal</span>
          </div>
          {mobileMenuOpen ? <X size={20} className="text-[#A4143D]" /> : <Menu size={20} className="text-zinc-400" />}
        </button>

        {/* 🚀 SIDEBAR: THE COMMAND CENTER */}
        <aside className={`
          ${mobileMenuOpen ? 'fixed inset-0 z-[100] bg-white p-8 overflow-y-auto' : 'hidden'} 
          lg:block w-full lg:w-72 lg:sticky lg:top-24 h-fit space-y-8 animate-in fade-in slide-in-from-left-4 duration-500
        `}>
          {mobileMenuOpen && (
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-8 right-8 text-zinc-300">
              <X size={24} />
            </button>
          )}

          <div className="space-y-10">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-6 px-4">
                Registry_Navigator
              </h2>

              <nav className="space-y-1.5">
                {navItem('/dashboard', 'Overview', LayoutDashboard)}

                <div className="space-y-1">
                  <button
                    onClick={() => setOrdersOpen(!ordersOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-100 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag size={14} className="text-zinc-300 group-hover:text-zinc-900" />
                      <span>Orders</span>
                    </div>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${ordersOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {ordersOpen && (
                    <div className="space-y-1 border-l-2 border-zinc-100 ml-5 mt-1 animate-in slide-in-from-top-2 duration-300">
                      {navItem('/dashboard/orders', 'History', History, true)}
                    </div>
                  )}
                </div>

                <div className="h-px bg-zinc-100 my-6 mx-4" />

                {navItem('/dashboard/reviews', 'Reviews', Star)}
                {navItem('/dashboard/profile', 'Settings', User)}
                {navItem('/dashboard/coupons', 'Incentives', Ticket)}
                {navItem('/dashboard/stores', 'Followed', Store)}
                {navItem('/dashboard/addresses', 'Logistics', MapPin)}
                {navItem('/dashboard/payments', 'Finance', CreditCard)}
                {navItem('/dashboard/security', 'Encryption', Shield)}
                
                <div className="h-px bg-zinc-100 my-6 mx-4" />
                
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all mt-4 group">
                  <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Terminate_Session
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* 🚀 MAIN INTERFACE: THE VAULT */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-[3rem] border border-zinc-200/60 shadow-strong min-h-[80vh] p-8 md:p-14 relative overflow-hidden">
            {/* Visual Bloom - Optimized for Depth */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A4143D]/[0.03] rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <header className="relative z-10 mb-14 border-b border-zinc-50 pb-8 flex justify-between items-end">
              <div className="space-y-1">
                <Breadcrumb />
                <div className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.4em] mt-2">
                  Session_Active // Node_Registry_01
                </div>
              </div>
              <div className="hidden md:block">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Registry_Sync_Live</span>
                 </div>
              </div>
            </header>

            <div className="relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-1000">
              {children}
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
}