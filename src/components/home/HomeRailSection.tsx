'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ProductGrid } from '@/src/components/product/ProductGrid';

interface HomepageRailProps {
  title: string;
  subtitle: string;
  products: any[];
  href: string;
  loading?: boolean; // 👈 Add this here so TS stops throwing error 2322
}
export function HomepageRail({
  title,
  subtitle,
  href,
  products,
}: HomepageRailProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full py-6">
      {/* ================= HEADER ================= */}

      <div className="flex items-end justify-between px-4 mb-4">
        <div className="space-y-1">
          <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-zinc-950 italic">
            {title}
          </h2>

          {subtitle && (
            <p className="text-[11px] md:text-xs text-zinc-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* SEE MORE */}

        <Link
          href={href}
          className="
            flex
            items-center
            gap-1
            text-[10px]
            font-black
            uppercase
            tracking-[0.18em]
            text-[#A4143D]
            shrink-0
          "
        >
          See More
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* ================= PRODUCTS ================= */}

      <div className="px-2">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}