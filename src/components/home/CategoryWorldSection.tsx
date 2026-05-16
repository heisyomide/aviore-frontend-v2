'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CategoryWorldSectionProps {
  title: string;
  slug: string;
  products: any[];
}

export function CategoryWorldSection({
  title,
  slug,
  products,
}: CategoryWorldSectionProps) {

  if (!products?.length) return null;

  return (

    <section className="py-10 md:py-14 border-b border-zinc-100">

      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">

        <div className="space-y-1">

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#A4143D] font-black">
            Category World
          </p>

          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-black">
            {title}
          </h2>

        </div>

        <Link
          href={`/category/${slug}`}
          className="flex items-center gap-2 text-[10px] md:text-xs uppercase font-black tracking-[0.25em] text-black hover:text-[#A4143D] transition-colors"
        >
          See All
          <ArrowRight size={14} />
        </Link>

      </div>

      {/* HORIZONTAL PRODUCT RAIL */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">

        {products.map((product: any) => (

          <Link
            key={product._id}
            href={`/product/${product.slug}`}
            className="min-w-[180px] md:min-w-[240px] group"
          >

            {/* IMAGE */}
            <div className="relative aspect-[0.8] overflow-hidden rounded-3xl bg-zinc-50">

              <Image
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

            </div>

            {/* INFO */}
            <div className="mt-3 space-y-1">

              <h3 className="text-[12px] md:text-sm font-bold line-clamp-2 text-black">
                {product.name}
              </h3>

              <p className="text-[13px] md:text-sm font-black text-[#A4143D]">
                ₦{product.price?.toLocaleString()}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </section>

  );
}