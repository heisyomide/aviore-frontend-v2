'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Clock3,
} from 'lucide-react';

interface RailProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  stockLeft?: number;
  vendor?: string;
}

interface HomeRailSectionProps {
  title: string;
  subtitle?: string;
  href: string;

  products: RailProduct[];

  flashSale?: boolean;
  limitedStock?: boolean;
  topVendors?: boolean;

  countdown?: string;
}

export function HomeRailSection({
  title,
  subtitle,
  href,
  products,
  flashSale = false,
  limitedStock = false,
  countdown,
}: HomeRailSectionProps) {

  return (

    <section className="w-full py-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div className="flex flex-col gap-1">

          <div className="flex items-center gap-3">

            <h2 className="text-[18px] md:text-[22px] font-black uppercase tracking-tight text-slate-900">
              {title}
            </h2>

            {flashSale && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600">

                <Clock3 size={13} />

                <span className="text-[10px] font-black uppercase tracking-widest">
                  {countdown || '02:12:45'}
                </span>

              </div>
            )}

          </div>

          {subtitle && (
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              {subtitle}
            </p>
          )}

        </div>

        {/* SEE ALL */}
        <Link
          href={href}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#A4143D]"
        >

          See All

          <ArrowRight size={14} />

        </Link>

      </div>

      {/* PRODUCTS */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">

        {products.map((product) => (

          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="min-w-[180px] max-w-[180px] bg-white rounded-3xl border border-slate-100 overflow-hidden shrink-0 group hover:shadow-xl transition-all duration-300 active:scale-95"
          >

            {/* IMAGE */}
            <div className="relative w-full aspect-square overflow-hidden bg-slate-50">

              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* DISCOUNT */}
              {product.discount && (
                <div className="absolute top-3 left-3 bg-[#A4143D] text-white px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
                  -{product.discount}%
                </div>
              )}

              {/* LIMITED STOCK */}
              {limitedStock && product.stockLeft && (
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                  Only {product.stockLeft} Left
                </div>
              )}

            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col gap-2">

              {/* NAME */}
              <h3 className="text-[12px] font-bold text-slate-700 leading-tight line-clamp-2 min-h-[34px]">
                {product.name}
              </h3>

              {/* PRICE */}
              <div className="flex items-center gap-2 flex-wrap">

                <span className="text-[15px] font-black text-slate-900">
                  ₦{product.price.toLocaleString()}
                </span>

                {product.oldPrice && (
                  <span className="text-[11px] line-through text-slate-400 font-bold">
                    ₦{product.oldPrice.toLocaleString()}
                  </span>
                )}

              </div>

              {/* VENDOR */}
              {product.vendor && (
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-black">
                  {product.vendor}
                </div>
              )}

            </div>

          </Link>

        ))}

      </div>

    </section>

  );
}