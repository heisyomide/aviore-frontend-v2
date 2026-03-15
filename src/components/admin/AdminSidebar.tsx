// components/admin/AdminSidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Store, Package, ShoppingCart, 
  CreditCard, AlertTriangle, Star, FolderTree, TicketPercent, 
  BarChart3, Headset, Bell, ShieldAlert, Settings, ChevronRight
} from 'lucide-react';

const menuGroups = [
  {
    group: "Core",
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    group: "Management",
    items: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Vendors', href: '/admin/vendors', icon: Store },
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    ]
  },
  {
    group: "Financials",
    items: [
      { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      { name: 'Promotions', href: '/admin/promotions', icon: TicketPercent },
    ]
  },
  {
    group: "Support & Moderation",
    items: [
      { name: 'Disputes', href: '/admin/disputes', icon: AlertTriangle },
      { name: 'Reviews', href: '/admin/reviews', icon: Star },
      { name: 'Support', href: '/admin/support', icon: Headset },
      { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    ]
  },
  {
    group: "System",
    items: [
      { name: 'Security', href: '/admin/security', icon: ShieldAlert },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-950 text-slate-400 h-screen sticky top-0 flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
        <h1 className="text-lg font-black text-white tracking-tighter">AVIORÈ <span className="text-orange-500">ADMIN</span></h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
              {group.group}
            </h2>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`group flex items-center justify-between px-6 py-2.5 transition-all ${
                    isActive ? 'text-white bg-slate-900 border-r-4 border-orange-500' : 'hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive ? 'text-orange-500' : 'group-hover:text-slate-200'} />
                    <span className="text-sm font-bold">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-orange-500" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">SA</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Super Admin</p>
            <p className="text-[10px] text-slate-500 truncate">admin@aviore.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}