'use client';

import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  CreditCard,
} from 'lucide-react';

const items = [
  {
    icon: ShieldCheck,
    title: 'Verified Vendor',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
  },
  {
    icon: BadgeCheck,
    title: 'Buyer Protection',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
  },
];

export function StoreTrustBadges() {
  return (
    <section className="mt-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white border border-zinc-100 rounded-3xl p-6 text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[#A4143D]/10 flex items-center justify-center">
                <Icon
                  size={24}
                  className="text-[#A4143D]"
                />
              </div>

              <p className="mt-4 text-sm font-bold text-zinc-800">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}