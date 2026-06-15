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
  Bell,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Breadcrumb } from '@/src/components/Breadcrumb';
import { MobileBottomNav } from '@/src/components/navbar/MobileBottomNav';
import VendorHeader from '@/src/components/navbar/VendorHeader';

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItem = (href: string, label: string, Icon: any) => {
    const active = pathname === href || (href !== '/vendor' && pathname.startsWith(href));

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
          active
            ? 'bg-zinc-900 text-white border border-zinc-800 shadow-md shadow-black/40' // ◄ Clean monochromatic active tab to match the prototype side navigation frame
            : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
        }`}
      >
        <Icon size={18} strokeWidth={active ? 2 : 1.5} />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    // ✅ FIXED: Unified canvas background across all viewport layers to remove contrast breaks completely
    <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-zinc-100 antialiased">
      
      {/* 📱 MOBILE HEADER: Shows up strictly on mobile screens, hidden on desktop */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <VendorHeader />
      </div>

      <div className="flex flex-1">
        
        {/* 💻 DESKTOP SIDEBAR */}
        <aside
          className={`bg-[#090909] text-white transition-all duration-300 hidden lg:flex flex-col border-r border-zinc-900 sticky top-0 h-screen ${
            collapsed ? 'w-20' : 'w-64'
          } p-6 overflow-y-auto no-scrollbar shrink-0`}
        >
          {/* Sidebar Luxury Header Identity */}
          <div className="flex items-center gap-3 mb-10 px-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-white shadow-lg italic">
              A
            </div>
            {!collapsed && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-sm font-black uppercase tracking-widest leading-none italic">AVIORÈ HUB</h2>
                <p className="text-[9px] text-zinc-500 font-medium uppercase mt-1 tracking-widest">Protocol Active</p>
              </div>
            )}
          </div>

          <nav className="space-y-1.5 flex-1">
            {navItem('/vendor', 'Overview', LayoutDashboard)}
            {navItem('/vendor/orders', 'Orders', ShoppingCart)}
            {navItem('/vendor/products', 'Products', Package)}
            {navItem('/vendor/inventory', 'Inventory', Boxes)}
            {navItem('/vendor/customers', 'Customers', Users)}
            {navItem('/vendor/notifications', 'Notifications', Bell)}
            {navItem('/vendor/reviews', 'Reviews', Star)}
            {navItem('/vendor/analytics', 'Analytics', BarChart3)}
            {navItem('/vendor/payouts', 'Payouts', Wallet)}
            {navItem('/vendor/marketing', 'Marketing', Megaphone)}
            
            <div className="h-px bg-zinc-900 my-4 mx-2" />
            
            {navItem('/vendor/settings', 'Settings', Settings)}
            {navItem('/vendor/support', 'Support', LifeBuoy)}
          </nav>

          {/* Minimize / Toggle Sidebar Collapse Trigger */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-6 flex items-center justify-center p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </aside>

        {/* 🚀 MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 relative z-0 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto p-4 lg:p-10">
            {/* Breadcrumb: Desktop Only (Muted out to fit dark canvas text metrics) */}
            <div className="hidden lg:block mb-6 text-zinc-500 font-medium text-xs tracking-wide">
              <Breadcrumb />
            </div>
            
            {/* Inject point for children view dashboards */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-32 pb-32 lg:pt-0 lg:pb-0">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* 📱 MOBILE BOTTOM NAV */}
      <div className="lg:hidden">
        <MobileBottomNav /> 
      </div>
    </div>
  );
}