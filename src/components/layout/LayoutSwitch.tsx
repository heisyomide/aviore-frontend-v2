'use client';

import { usePathname } from 'next/navigation';

export default function LayoutSwitch({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 🚀 Logic: Hide Store UI if path starts with /vendor or /admin
  const isDashboard = pathname.startsWith('/vendor') || pathname.startsWith('/admin');

  // If in Dashboard, we ONLY render the children (the dashboard page itself)
  // This removes the Navbar, Footer, and Shop-style BottomNav
  if (isDashboard) {
    return <main className="flex-1">{children}</main>;
  }

  // Otherwise, return everything (Navbar, Footer, etc.)
  return <>{children}</>;
}