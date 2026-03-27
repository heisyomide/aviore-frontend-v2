'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Grid, User, ShoppingCart, Heart, 
  LayoutDashboard, Package, Store, BarChart3, Menu, DollarSign 
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
// import { useAuth } from '@/hooks/useAuth'; // 🚀 Import your auth hook here
import { useMemo } from 'react';

// 1. Define Nav Configurations for each Role
const NAV_CONFIG = {
  CUSTOMER: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/categories', icon: Grid },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, isCart: true },
    { label: 'Account', href: '/dashboard', icon: User },
  ],
  VENDOR: [
    { label: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/vendor/orders', icon: Package },
    { label: 'Products', href: '/vendor/products', icon: Store },
    { label: 'Earnings', href: '/vendor/earnings', icon: DollarSign },
    { label: 'More', href: '/vendor/settings', icon: Menu },
  ],
  ADMIN: [
    { label: 'Stats', href: '/admin/dashboard', icon: BarChart3 },
    { label: 'Orders', href: '/admin/orders', icon: Package },
    { label: 'Vendors', href: '/admin/vendors', icon: Store },
    { label: 'System', href: '/admin/settings', icon: Menu },
  ],
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  
  // 🚀 ROLE LOGIC: Replace this with your actual auth state
  // const { user } = useAuth(); 
  const user = { role: 'CUSTOMER' }; // Change to 'VENDOR' or 'ADMIN' to test
  
  const role = (user?.role as keyof typeof NAV_CONFIG) || 'CUSTOMER';
  const navLinks = NAV_CONFIG[role];

  const cartCount = useMemo(() => items.reduce((a, b) => a + b.quantity, 0), [items]);

  // Style helper to change theme based on role
  const getThemeColor = () => {
    if (role === 'VENDOR') return 'text-zinc-900'; // Sleek Black for Vendor
    if (role === 'ADMIN') return 'text-[#A4143D]'; // Aviore Red for Admin
    return 'text-[#A4143D]'; // Aviore Red for Customer
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-[200] flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-safe">
      {navLinks.map((link) => {
        const Icon = link.icon;
        // Check if current path matches link href
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
        const activeColor = getThemeColor();

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
              
              {/* Special Badge for Customer Cart */}
              {'isCart' in link && cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#e01c24] text-white text-[8px] font-black min-w-[16px] h-4 rounded-full flex items-center justify-center border border-white px-1">
                  {cartCount}
                </span>
              )}
            </div>

            <span className={`text-[8px] font-black uppercase tracking-tighter text-center leading-none ${
              isActive ? "opacity-100" : "opacity-70"
            }`}>
              {link.label}
            </span>

            {/* Indicator Dot for Active State */}
            {isActive && (
              <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${
                role === 'VENDOR' ? 'bg-zinc-900' : 'bg-[#A4143D]'
              }`} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}