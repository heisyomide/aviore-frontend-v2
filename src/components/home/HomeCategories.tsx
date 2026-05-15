'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MARKETPLACE_CATEGORIES } from '@/src/data/category.data';

export function HomeCategories() {

  return (
    <section className="w-full py-6 md:py-10 bg-white">

      <div className="px-4 md:px-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Shop By Category
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Discover curated collections across Aviorè
            </p>
          </div>

        </div>

        {/* MOBILE SCROLL */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">

          <div className="flex gap-4 min-w-max pr-4">

            {MARKETPLACE_CATEGORIES.map((category) => (

              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="w-[110px] flex-shrink-0"
              >

                <div className="group">

                  {/* IMAGE */}
                  <div className="relative w-[110px] h-[110px] rounded-3xl overflow-hidden bg-[#f5f5f5] shadow-sm">

                    <Image
                      src={category.banner}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />

                    <div className="absolute inset-0 bg-black/20" />

                  </div>

                  {/* TEXT */}
                  <div className="mt-3 text-center">

                    <p className="text-sm font-bold text-slate-700 leading-tight">
                      {category.name}
                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

        {/* DESKTOP GRID */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-5">

          {MARKETPLACE_CATEGORIES.map((category) => (

            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group"
            >

              <div className="relative aspect-square rounded-[32px] overflow-hidden bg-[#f5f5f5]">

                <Image
                  src={category.banner}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex items-end p-4">

                  <div>

                    <h3 className="text-white font-black text-lg leading-tight">
                      {category.name}
                    </h3>

                    <p className="text-white/80 text-xs mt-1">
                      Explore Collection
                    </p>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}