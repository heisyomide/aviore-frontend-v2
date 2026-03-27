'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Grid, User, ShoppingCart, Heart, 
  LayoutDashboard, Package, Boxes, Wallet, 
  BarChart3, Users, Settings, LucideIcon 
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useMemo } from 'react';

// 🚀 1. Define the Type for our Navigation Links
interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  isCart?: boolean; // Optional property
}

const NAV_RULES: Record<'USER' | 'VENDOR' | 'ADMIN', NavLink[]> = {
  USER: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/categories', icon: Grid },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, isCart: true },
    { label: 'Account', href: '/dashboard', icon: User },
  ],
  VENDOR: [
    { label: 'Dash', href: '/vendor', icon: LayoutDashboard },
    { label: 'Orders', href: '/vendor/orders', icon: Package },
    { label: 'Stock', href: '/vendor/inventory', icon: Boxes },
    { label: 'Payout', href: '/vendor/payouts', icon: Wallet },
    { label: 'More', href: '/vendor/settings', icon: Settings },
  ],
  ADMIN: [
    { label: 'Stats', href: '/admin', icon: BarChart3 },
    { label: 'Vendors', href: '/admin/vendors', icon: Users },
    { label: 'Orders', href: '/admin/orders', icon: Package },
    { label: 'System', href: '/admin/settings', icon: Settings },
  ]
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const { items } = useCartStore();

  // 🚀 ROLE ENGINE: Get this from your actual auth state
  const userRole = 'VENDOR'; 
  
  const role = (userRole as keyof typeof NAV_RULES) || 'USER';
  const navLinks = NAV_RULES[role];

  const cartCount = useMemo(() => items.reduce((a, b) => a + b.quantity, 0), [items]);

  const getActiveColor = () => {
    if (role === 'VENDOR') return 'text-[#2D4A8A]';
    if (role === 'ADMIN') return 'text-zinc-900';
    return 'text-[#A4143D]';
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50 flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-safe">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
        const activeColor = getActiveColor();

        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`relative flex flex-col items-center gap-1 transition-all duration-300 flex-1 ${
              isActive ? `${activeColor} scale-110` : "text-gray-400"
            }`}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              
              {/* ✅ Fixed: 'isCart' now safely exists on the NavLink type */}
              {link.isCart && cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#e01c24] text-white text-[8px] font-black min-w-4 h-4 rounded-full flex items-center justify-center border border-white px-1">
                  {cartCount}
                </span>
              )}
            </div>

            <span className={`text-[9px] font-black uppercase tracking-tighter text-center ${
              isActive ? "opacity-100" : "opacity-70"
            }`}>
              {link.label}
            </span>

            {isActive && (
              <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${
                role === 'VENDOR' ? 'bg-[#2D4A8A]' : 'bg-[#A4143D]'
              }`} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}