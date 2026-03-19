// src/components/navbar/MobileBottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, User, ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useMemo } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Categories', href: '/categories', icon: Grid },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Account', href: '/dashboard', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const cartCount = useMemo(() => items.reduce((a, b) => a + b.quantity, 0), [items]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-[200] flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {NAV_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? "text-[#A4143D] scale-110" : "text-gray-400"}`}
          >
            <Icon size={20} strokeWidth={isActive ? 3 : 2} />
            <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? "opacity-100" : "opacity-70"}`}>
              {link.label}
            </span>
          </Link>
        );
      })}

      {/* Cart Item - Separated to handle the Badge */}
      <Link 
        href="/cart" 
        className={`relative flex flex-col items-center gap-1 transition-all ${pathname === '/cart' ? "text-[#A4143D] scale-110" : "text-gray-400"}`}
      >
        <div className="relative">
          <ShoppingCart size={20} strokeWidth={pathname === '/cart' ? 3 : 2} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#e01c24] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[9px] font-black uppercase tracking-tighter">Cart</span>
      </Link>
    </nav>
  );
}