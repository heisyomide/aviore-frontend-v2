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
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
          active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FE] lg:bg-gray-100">
      
      {/* 📱 MOBILE HEADER: 
          Kept outside any relative wrappers to ensure 'fixed' positioning 
          works globally without clipping. 
      */}
      <div className="lg:hidden">
        <VendorHeader />
      </div>

      <div className="flex flex-1">
        
        {/* 💻 DESKTOP SIDEBAR */}
        <aside
          className={`bg-gray-900 text-white transition-all duration-300 hidden lg:flex flex-col border-r border-gray-800 sticky top-0 h-screen ${
            collapsed ? 'w-20' : 'w-64'
          } p-6 overflow-y-auto no-scrollbar shrink-0`}
        >
          <div className="flex items-center gap-3 mb-10 px-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg italic">
              A
            </div>
            {!collapsed && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-sm font-black uppercase tracking-tight leading-none italic">Aviorè Hub</h2>
                <p className="text-[10px] text-blue-500 font-bold uppercase mt-1 tracking-wider">Protocol Active</p>
              </div>
            )}
          </div>

          <nav className="space-y-1.5 flex-1">
            {navItem('/vendor', 'Overview', LayoutDashboard)}
            {navItem('/vendor/orders', 'Orders', ShoppingCart)}
            {navItem('/vendor/products', 'Products', Package)}
            {navItem('/vendor/inventory', 'Inventory', Boxes)}
            {navItem('/vendor/customers', 'Customers', Users)}
            {navItem('/vendor/reviews', 'Reviews', Star)}
            {navItem('/vendor/analytics', 'Analytics', BarChart3)}
            {navItem('/vendor/payouts', 'Payouts', Wallet)}
            {navItem('/vendor/marketing', 'Marketing', Megaphone)}
            
            <div className="h-px bg-gray-800 my-4 mx-2 opacity-30" />
            
            {navItem('/vendor/settings', 'Settings', Settings)}
            {navItem('/vendor/support', 'Support', LifeBuoy)}
          </nav>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-6 flex items-center justify-center p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-all"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </aside>

        {/* 🚀 MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 relative z-0">
          <div className="max-w-7xl mx-auto p-4 lg:p-10">
            {/* Breadcrumb: Desktop Only */}
            <div className="hidden lg:block mb-6">
              <Breadcrumb />
            </div>
            
            {/* - pt-36: Added more padding to ensure the 144px height header 
                 doesn't overlap the content.
               - pb-32: Padding for the bottom nav.
            */}
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