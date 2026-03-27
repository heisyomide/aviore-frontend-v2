// src/config/nav-rules.ts
import { Home, Grid, Heart, ShoppingCart, User, LayoutDashboard, Package, Boxes, Wallet, BarChart3, Users, Settings } from 'lucide-react';

export const NAV_RULES = {
  USER: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/categories', icon: Grid },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, hasBadge: true },
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