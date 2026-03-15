'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

// You can define common names for routes here so they don't look like "vendor"
const ROUTE_NAMES: Record<string, string> = {
  dashboard: 'Dashboard',
  vendor: 'Merchant',
  support: 'Support',
  chat: 'Chat',
  orders: 'Orders',
};

interface BreadcrumbProps {
  // This lets you pass in { "cmmij...": "Ayomide Kofoworola" }
  customLabels?: Record<string, string>;
}

export function Breadcrumb({ customLabels = {} }: BreadcrumbProps) {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-gray-400 py-4 font-medium tracking-tight">
      <Link href="/" className="hover:text-[#A4143D] transition flex items-center gap-1">
        <Home size={14} />
        <span>Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Logic: Use custom label first, then check common names, then fallback to the raw URL string
        let displayName = customLabels[value] || ROUTE_NAMES[value] || value;

        // If it's a long ID and we didn't provide a name, let's shorten it so it doesn't break the UI
        if (value.length > 15 && !customLabels[value]) {
          displayName = `${value.substring(0, 8)}...`;
        }

        return (
          <div key={to} className="flex items-center">
            <ChevronRight size={14} className="mx-2 text-gray-300" />
            {last ? (
              <span className="font-bold text-gray-900 truncate max-w-[200px]">
                {displayName}
              </span>
            ) : (
              <Link href={to} className="hover:text-[#A4143D] transition capitalize">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}