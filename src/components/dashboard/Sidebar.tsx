import Link from 'next/link';

const navItems = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Your Orders', href: '/dashboard/orders' },
  { name: 'Your Reviews', href: '/dashboard/reviews' },
  { name: 'Your Profile', href: '/dashboard/profile' },
  { name: 'Coupons & Offers', href: '/dashboard/coupons' },
  { name: 'Followed Stores', href: '/dashboard/followed-stores' },
  { name: 'Browsing History', href: '/dashboard/history' },
  { name: 'Addresses', href: '/dashboard/addresses' },
  { name: 'Payment Methods', href: '/dashboard/payments' },
  { name: 'Account Security', href: '/dashboard/security' },
  { name: 'Notifications', href: '/dashboard/notifications' },
  { name: 'Support', href: '/dashboard/support' },
];

export function Sidebar() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</h2>
      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#f26522] rounded-xl transition"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}