'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Grid, User, ShoppingCart, Heart, 
  LayoutDashboard, Package, Boxes, Wallet, 
  BarChart3, Users, Settings, LucideIcon,
  MoreHorizontal, Megaphone, Star, BarChart, 
  UserCircle, ShieldCheck, X, Zap
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useMemo, useState } from 'react';

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  isCart?: boolean;
}

// 🚀 1. The "Visible" static nodes (First 4)
const VENDOR_STATIC: NavLink[] = [
  { label: 'Dash', href: '/vendor', icon: LayoutDashboard },
  { label: 'Orders', href: '/vendor/orders', icon: Package },
  { label: 'Stock', href: '/vendor/inventory', icon: Boxes },
  { label: 'Payout', href: '/vendor/payouts', icon: Wallet },
];

// 🚀 2. The "More" Drawer nodes (The remaining 7)
const VENDOR_EXTENDED: NavLink[] = [
  { label: 'Marketing Hub', href: '/vendor/marketing', icon: Megaphone },
  { label: 'Analytics Hub', href: '/vendor/analytics', icon: BarChart },
  { label: 'Reputation', href: '/vendor/reviews', icon: Star },
  { label: 'Identity', href: '/vendor/settings', icon: UserCircle },
  { label: 'Campaigns', href: '/vendor/marketing/campaigns', icon: Zap },
  { label: 'Security', href: '/vendor/settings?tab=KYC', icon: ShieldCheck },
  { label: 'Management', href: '/admin/settings', icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { items } = useCartStore();

  const userRole = 'VENDOR'; 
  const cartCount = useMemo(() => items.reduce((a, b) => a + b.quantity, 0), [items]);

  return (
    <>
      {/* 🚀 MAIN NAV BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-3 z-[100] flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-safe">
        {VENDOR_STATIC.map((link) => (
          <NavButton 
            key={link.href} 
            link={link} 
            isActive={pathname === link.href} 
            onClick={() => setIsMoreOpen(false)}
          />
        ))}

        {/* 🚀 THE "MORE" TRIGGER */}
        <button 
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`relative flex flex-col items-center gap-1 transition-all duration-300 flex-1 ${
            isMoreOpen ? "text-[#2D4A8A] scale-110" : "text-gray-400"
          }`}
        >
          <MoreHorizontal size={20} strokeWidth={isMoreOpen ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-tighter">More</span>
          {isMoreOpen && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#2D4A8A]" />}
        </button>
      </nav>

      {/* 🚀 THE "MORE" DRAWER (OVERLAY) */}
      <div 
        className={`fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMoreOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMoreOpen(false)}
      />

      <div 
        className={`fixed bottom-0 left-0 right-0 z-[110] bg-[#F4F7FE] rounded-t-[2.5rem] shadow-2xl transition-transform duration-500 transform ${
          isMoreOpen ? "translate-y-0" : "translate-y-full"
        } pb-32 p-8`}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 opacity-50" />
        
        <div className="flex justify-between items-center mb-8">
           <div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Operations Hub</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Registry Extended Protocol</p>
           </div>
           <button onClick={() => setIsMoreOpen(false)} className="p-2 bg-white rounded-full shadow-sm"><X size={18}/></button>
        </div>

        {/* THE 11-TABS GRID (The remaining 7) */}
        <div className="grid grid-cols-3 gap-4">
          {VENDOR_EXTENDED.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMoreOpen(false)}
                className={`flex flex-col items-center justify-center p-5 rounded-3xl transition-all border ${
                  isActive 
                    ? "bg-[#2D4A8A] border-[#2D4A8A] text-white shadow-lg" 
                    : "bg-white border-slate-100 text-slate-400 active:scale-95"
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 3 : 2} className="mb-2" />
                <span className={`text-[8px] font-black uppercase text-center leading-tight tracking-widest`}>
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

// 🎨 COMPONENT: Static Button
function NavButton({ link, isActive, onClick }: { link: NavLink; isActive: boolean; onClick: () => void }) {
  const Icon = link.icon;
  return (
    <Link 
      href={link.href} 
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 transition-all duration-300 flex-1 ${
        isActive ? "text-[#2D4A8A] scale-110" : "text-gray-400"
      }`}
    >
      <Icon size={20} strokeWidth={isActive ? 3 : 2} />
      <span className="text-[9px] font-black uppercase tracking-tighter leading-none">{link.label}</span>
      {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#2D4A8A]" />}
    </Link>
  );
}