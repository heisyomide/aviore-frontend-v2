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
  Bell,
} from 'lucide-react';
import { Breadcrumb } from '@/src/components/Breadcrumb';
import { Navbar } from '@/src/components/navbar/Navbar';

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Helper for Desktop Sidebar Links
  const navItem = (href: string, label: string, Icon: any) => {
    const active = pathname === href || (href !== '/vendor' && pathname.startsWith(href));

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
          active
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FE] lg:bg-gray-100">
      
      {/* 📱 MOBILE HEADER: (Logistics Hub Style - Hidden on Desktop) */}
      <header className="lg:hidden bg-[#1E293B] text-white px-6 pt-12 pb-10 rounded-b-[2.5rem] flex justify-between items-center shadow-xl z-50">
        <div>
          <h1 className="text-xl font-black italic tracking-tighter">Logistics Hub</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vendor Account</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative p-2 bg-slate-800 rounded-full border border-slate-700">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1E293B]" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-blue-400 overflow-hidden">
             {/* Replace with real vendor avatar */}
             <div className="w-full h-full bg-slate-700 flex items-center justify-center font-bold text-xs">AK</div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        
        {/* 💻 DESKTOP SIDEBAR: (Hidden on Mobile) */}
        <aside
          className={`bg-gray-900 text-white transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-64'
          } p-6 hidden lg:flex flex-col border-r border-gray-800`}
        >
          {/* Store Info */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-white shadow-lg">
              A
            </div>
            {!collapsed && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-sm font-black uppercase tracking-tight leading-none">Aviorè Store</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-wider">Merchant Mode</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
            {navItem('/vendor', 'Overview', LayoutDashboard)}
            {navItem('/vendor/orders', 'Orders', ShoppingCart)}
            {navItem('/vendor/products', 'Products', Package)}
            {navItem('/vendor/inventory', 'Inventory', Boxes)}
            {navItem('/vendor/customers', 'Customers', Users)}
            {navItem('/vendor/reviews', 'Reviews', Star)}
            {navItem('/vendor/analytics', 'Analytics', BarChart3)}
            {navItem('/vendor/payouts', 'Payouts', Wallet)}
            {navItem('/vendor/marketing', 'Marketing', Megaphone)}
            <div className="h-[1px] bg-gray-800 my-4 mx-2" />
            {navItem('/vendor/settings', 'Settings', Settings)}
            {navItem('/vendor/support', 'Support', LifeBuoy)}
          </nav>

          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-6 flex items-center justify-center p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-all"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </aside>

        {/* 🚀 MAIN CONTENT AREA */}
        <main className="flex-1 p-4 lg:p-10 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb: Desktop Only */}
            <div className="hidden lg:block mb-6">
              <Breadcrumb />
            </div>
            
            {/* Page Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 lg:pb-0">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Note: The MobileBottomNav (from your registry rules) will appear 
          automatically because of the RootLayout logic we set up! */}
    </div>
  );
}