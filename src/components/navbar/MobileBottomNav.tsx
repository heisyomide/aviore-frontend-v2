'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, Boxes, Wallet, 
  Settings, LucideIcon, MoreHorizontal, 
  Megaphone, Star, BarChart, UserCircle, 
  ShieldCheck, X, Zap, BarChart3, Users, 
  ShoppingCart,
  LifeBuoy
} from 'lucide-react';
import { useState } from 'react';

// --- TYPES ---
type UserRole = 'USER' | 'VENDOR' | 'ADMIN';

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

// --- CONFIGURATION ---
const VENDOR_STATIC: NavLink[] = [
  { label: 'Dash', href: '/vendor', icon: LayoutDashboard },
  { label: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
  { label: 'Products', href: '/vendor/products', icon: Package },
  { label: 'Payout', href: '/vendor/payouts', icon: Wallet },
];

const VENDOR_EXTENDED: NavLink[] = [
  { label: 'Marketing', href: '/vendor/marketing', icon: Megaphone },
  { label: 'Analytics', href: '/vendor/analytics', icon: BarChart },
  { label: 'Reviews', href: '/vendor/reviews', icon: Star },
  { label: 'Customers', href: '/vendor/customers', icon: Users },
  { label: 'Support', href: '/vendor/marketing/campaigns', icon: LifeBuoy },
  { label: 'Inventorty', href: '/vendor/inventory', icon: Boxes },
  
  { label: 'Settings', href: '/vendor/settings', icon: Settings },
];

const ADMIN_LINKS: NavLink[] = [
  { label: 'Stats', href: '/admin', icon: BarChart3 },
  { label: 'Vendors', href: '/admin/vendors', icon: Users },
  { label: 'Orders', href: '/admin/orders', icon: Package },
  { label: 'System', href: '/admin/settings', icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // 🚀 ROLE ENGINE
  // Cast to UserRole to allow valid comparisons even if hardcoded for now
  const userRole = 'VENDOR' as UserRole; 

  // 🛑 RULE 1: If user is a standard customer, do NOT render the bottom nav
  if (userRole === 'USER') return null;

  // Render for ADMIN
  if (userRole === 'ADMIN') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-gray-100 bg-white px-4 py-3 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:hidden">
        {ADMIN_LINKS.map((link) => (
          <NavButton 
            key={link.href} 
            link={link} 
            isActive={pathname === link.href} 
            activeColor="text-zinc-900"
            dotColor="bg-zinc-900"
          />
        ))}
      </nav>
    );
  }

  // Render for VENDOR (with "More" Drawer)
  return (
    <>
      {/* 🚀 MAIN VENDOR NAV BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-gray-100 bg-white px-2 py-3 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:hidden">
        {VENDOR_STATIC.map((link) => (
          <NavButton 
            key={link.href} 
            link={link} 
            isActive={pathname === link.href} 
            onClick={() => setIsMoreOpen(false)}
            activeColor="text-[#2D4A8A]"
            dotColor="bg-[#2D4A8A]"
          />
        ))}

        <button 
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`relative flex flex-1 flex-col items-center gap-1 transition-all duration-300 ${
            isMoreOpen ? "scale-110 text-[#2D4A8A]" : "text-gray-400"
          }`}
        >
          <MoreHorizontal size={20} strokeWidth={isMoreOpen ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-tighter">More</span>
          {isMoreOpen && <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#2D4A8A]" />}
        </button>
      </nav>

      {/* 🚀 "MORE" DRAWER SYSTEM */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMoreOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setIsMoreOpen(false)}
      />

      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 transform rounded-t-[2.5rem] bg-[#F4F7FE] p-8 pb-32 shadow-2xl transition-transform duration-500 ${
          isMoreOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-8 h-1.5 w-12 rounded-full bg-slate-200 opacity-50" />
        
        <div className="mb-8 flex items-center justify-between">
           <div>
              <h3 className="text-xl font-black italic leading-none tracking-tighter text-slate-900 uppercase">Operations</h3>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Extended Protocol Registry</p>
           </div>
           <button onClick={() => setIsMoreOpen(false)} className="rounded-full bg-white p-2 shadow-sm transition-transform active:scale-90">
             <X size={18} className="text-slate-400" />
           </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {VENDOR_EXTENDED.map((link, index) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={`${link.label}-${link.href}-${index}`}
                href={link.href}
                onClick={() => setIsMoreOpen(false)}
                className={`flex flex-col items-center justify-center rounded-3xl border p-5 transition-all ${
                  isActive 
                    ? "border-[#2D4A8A] bg-[#2D4A8A] text-white shadow-lg" 
                    : "active:scale-95 border-slate-100 bg-white text-slate-400"
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 3 : 2} className="mb-2" />
                <span className="text-center text-[8px] font-black uppercase leading-tight tracking-widest">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

// --- INTERNAL COMPONENTS ---
function NavButton({ 
  link, 
  isActive, 
  onClick, 
  activeColor = "text-[#2D4A8A]", 
  dotColor = "bg-[#2D4A8A]" 
}: { 
  link: NavLink; 
  isActive: boolean; 
  onClick?: () => void;
  activeColor?: string;
  dotColor?: string;
}) {
  const Icon = link.icon;
  return (
    <Link 
      href={link.href} 
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center gap-1 transition-all duration-300 ${
        isActive ? `${activeColor} scale-110` : "text-gray-400"
      }`}
    >
      <Icon size={20} strokeWidth={isActive ? 3 : 2} />
      <span className="text-center text-[9px] font-black uppercase leading-none tracking-tighter">{link.label}</span>
      {isActive && <div className={`absolute -bottom-1 h-1 w-1 rounded-full ${dotColor}`} />}
    </Link>
  );
}