'use client';

import { ShieldCheck, Truck, RotateCcw, Headphones, Globe } from 'lucide-react';

interface DeliveryInfoProps {
  origin?: string;
  min?: number;
  max?: number;
}

export function DeliveryInfo({ origin, min, max }: DeliveryInfoProps) {
  const normalizedOrigin = origin?.toLowerCase();

  const isInternational =
    normalizedOrigin === 'international' || normalizedOrigin === 'intl';

  const isLocal =
    normalizedOrigin === 'local';

  const items = [
    // 🌍 / 📍 DELIVERY TYPE (NEW)
    {
      icon: isInternational ? (
        <Globe size={20} className="text-blue-500" />
      ) : (
        <Truck size={20} className="text-green-500" />
      ),
      title: isInternational
        ? "International Shipping"
        : "Local Delivery",
      desc: isInternational
        ? "Ships worldwide from verified vendors"
        : "Delivered within your region",
      show: !!origin
    },

    // 🚚 DELIVERY TIME (NEW)
    {
      icon: <Truck size={20} className="text-zinc-400" />,
      title: "Estimated Delivery",
      desc:
        min && max
          ? `${min}-${max} days delivery`
          : "Delivery time not specified",
      show: !!(min && max)
    },

    // 🛡 ORIGINAL ITEMS (UNCHANGED)
    {
      icon: <ShieldCheck size={20} className="text-zinc-400" />,
      title: "100% Authentic Products",
      desc: "Sourced directly from brands",
      show: true
    },
    {
      icon: <RotateCcw size={20} className="text-zinc-400" />,
      title: "7 Days Return",
      desc: "Not satisfied? Return within 7 days",
      show: true
    },
    {
      icon: <Headphones size={20} className="text-zinc-400" />,
      title: "24/7 Customer Support",
      desc: "We are here to help you",
      show: true
    }
  ];

  return (
    <div className="space-y-4 pt-4">
      {items
        .filter(item => item.show)
        .map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100/50 group hover:bg-white hover:border-zinc-200 transition-all duration-300"
          >
            <div className="mt-0.5 transition-colors group-hover:text-black">
              {item.icon}
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-tight text-zinc-900">
                {item.title}
              </h4>
              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}