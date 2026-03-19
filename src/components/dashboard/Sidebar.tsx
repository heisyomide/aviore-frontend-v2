'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Star, User, 
  Ticket, Store, History, MapPin, 
  CreditCard, ShieldCheck, Bell, LifeBuoy 
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Order_History', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Review_Logs', href: '/dashboard/reviews', icon: Star },
  { name: 'Identity_Profile', href: '/dashboard/profile', icon: User },
  { name: 'Reward_Registry', href: '/dashboard/coupons', icon: Ticket },
  { name: 'Followed_Vendors', href: '/dashboard/followed-stores', icon: Store },
  { name: 'Activity_History', href: '/dashboard/history', icon: History },
  { name: 'Logistics_Nodes', href: '/dashboard/addresses', icon: MapPin },
  { name: 'Finance_Vault', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Security_Protocol', href: '/dashboard/security', icon: ShieldCheck },
  { name: 'System_Alerts', href: '/dashboard/notifications', icon: Bell },
  { name: 'Support_Interface', href: '/dashboard/support', icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm sticky top-24 h-fit overflow-hidden">
      {/* Background Aesthetic */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-[#A4143D]/5 blur-3xl pointer-events-none" />

      <h2 className="px-4 mb-6 text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">
        Account_Registry
      </h2>

      <nav className="space-y-1 relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden ${
                isActive 
                  ? 'bg-black text-white shadow-lg shadow-zinc-200' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              {/* Icon Logic */}
              <Icon 
                size={18} 
                className={`transition-colors duration-300 ${
                  isActive ? 'text-[#A4143D]' : 'text-zinc-300 group-hover:text-zinc-900'
                }`} 
              />

              {/* Label Logic */}
              <span className={`text-[11px] font-black uppercase tracking-widest ${
                isActive ? 'italic' : ''
              }`}>
                {item.name}
              </span>

              {/* Signature Hover Effect: Black to Red slide */}
              {!isActive && (
                <div className="absolute inset-0 bg-[#A4143D]/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-10" />
              )}
              
              {isActive && (
                <div className="absolute right-0 w-1 h-4 bg-[#A4143D] rounded-full mr-2" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Registry Footer Label */}
      <div className="mt-10 px-4 pt-6 border-t border-zinc-50">
        <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-[0.2em] italic font-mono">
          System_Sync: Active
        </p>
      </div>
    </div>
  );
}