// src/config/navigation.ts
import { Home, ShoppingBag, Heart, User, LayoutDashboard, Package, DollarSign, Users, BarChart3, Menu } from 'lucide-react';

export const CUSTOMER_NAV = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Categories', href: '/categories', icon: Menu },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Cart', href: '/cart', icon: ShoppingBag },
  { label: 'Account', href: '/profile', icon: User },
];

export const VENDOR_NAV = [
  { label: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/vendor/orders', icon: Package },
  { label: 'Products', href: '/vendor/products', icon: ShoppingBag },
  { label: 'Earnings', href: '/vendor/earnings', icon: DollarSign },
  { label: 'More', href: '/vendor/settings', icon: Menu },
];

export const ADMIN_NAV = [
  { label: 'Stats', href: '/admin/dashboard', icon: BarChart3 },
  { label: 'Orders', href: '/admin/orders', icon: Package },
  { label: 'Vendors', href: '/admin/vendors', icon: Users },
  { label: 'System', href: '/admin/settings', icon: Menu },
];