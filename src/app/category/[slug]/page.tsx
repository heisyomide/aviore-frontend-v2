'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MARKETPLACE_CATEGORIES } from '@/src/data/category.data';

interface Props {
  params: {
    slug: string;
  };
}

export default function CategoryLandingPage({ params }: Props) {

  const category = MARKETPLACE_CATEGORIES.find(
    (item) => item.slug === params.slug
  );

  if (!category) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">

      {/* HERO SECTION */}
      <section className="relative h-[280px] md:h-[420px] overflow-hidden">

        <Image
          src={category.banner}
          alt={category.name}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex items-center px-6 md:px-16">

          <div className="max-w-2xl text-white">

            <p className="uppercase tracking-[4px] text-sm mb-3 text-orange-400 font-bold">
              Aviorè Marketplace
            </p>

            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              {category.name}
            </h1>

            <p className="mt-4 text-sm md:text-lg text-white/80 max-w-xl">
              Discover premium collections, trending products,
              exclusive deals and curated experiences inside
              {` ${category.name}`}.
            </p>

          </div>

        </div>

      </section>

      {/* CATEGORY GROUPS */}
      <section className="px-4 md:px-10 py-10 space-y-10">

        {category.children.map((group) => (

          <div
            key={group.slug}
            className="bg-white rounded-3xl p-5 md:p-8 shadow-sm"
          >

            {/* GROUP HEADER */}
            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {group.name}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Explore top selections in {group.name}
                </p>
              </div>

              <button className="text-sm font-bold text-orange-600 hover:underline">
                View All
              </button>

            </div>

            {/* ITEMS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

              {group.children.map((item) => (

                <Link
                  href={`/products?category=${item.slug}`}
                  key={item.slug}
                  className="group"
                >

                  <div className="bg-[#fafafa] rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

                    {/* PLACEHOLDER IMAGE */}
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 mb-3 flex items-center justify-center overflow-hidden">

                      <span className="text-xs font-black uppercase text-orange-600 text-center px-2">
                        {item.name}
                      </span>

                    </div>

                    <h3 className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition">
                      {item.name}
                    </h3>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        ))}

      </section>

    </main>
  );
}