// src/config/nav-rules.ts
import { 
  LayoutDashboard, Package, Boxes, Wallet, 
  BarChart3, Users, Settings, LucideIcon,
  Megaphone, BarChart, Star, UserCircle, ShieldCheck, Zap,
  MoreHorizontal
} from 'lucide-react';

// 🚀 1. Define strict types for Management Roles
// USER is excluded here because they don't use the Bottom Nav protocol
export type ManagementRole = 'VENDOR' | 'ADMIN';

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  hasBadge?: boolean;
}

// 🚀 2. Centralized Management Registry
// This now specifically maps roles that REQUIRE a bottom navigation bar
export const NAV_RULES: Record<ManagementRole, NavLink[]> = {
  VENDOR: [
    { label: 'Dash', href: '/vendor', icon: LayoutDashboard },
    { label: 'Orders', href: '/vendor/orders', icon: Package },
    { label: 'Inventory', href: '/vendor/inventory', icon: Boxes },
    { label: 'Payout', href: '/vendor/payouts', icon: Wallet },
    // 'More' is handled as a trigger in the component, 
    // but kept here if you need a fallback link
    { label: 'More', href: '#', icon: MoreHorizontal }, 
  ],

  ADMIN: [
    { label: 'Stats', href: '/admin', icon: BarChart3 },
    { label: 'Vendors', href: '/admin/vendors', icon: Users },
    { label: 'Orders', href: '/admin/orders', icon: Package },
    { label: 'System', href: '/admin/settings', icon: Settings },
  ]
};

// 🚀 3. Extended Vendor Registry (The "More" Drawer)
export const VENDOR_EXTENDED_NODES: NavLink[] = [
  { label: 'Marketing', href: '/vendor/marketing', icon: Megaphone },
  { label: 'Analytics', href: '/vendor/analytics', icon: BarChart },
  { label: 'Reviews', href: '/vendor/reviews', icon: Star },
  { label: 'Settings', href: '/vendor/settings', icon: UserCircle },
  { label: 'Orders', href: '/vendor/order', icon: Zap },
  { label: 'Security', href: '/vendor/settings?tab=KYC', icon: ShieldCheck },
];