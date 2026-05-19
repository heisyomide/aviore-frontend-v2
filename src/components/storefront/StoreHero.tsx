'use client';

import Image from 'next/image';

interface StoreHeroProps {
  banner: string;
  storeName: string;
  tagline?: string;
}

export function StoreHero({
  banner,
  storeName,
  tagline,
}: StoreHeroProps) {
  return (
    <section className="relative h-[320px] md:h-[420px] overflow-hidden">
      {/* Banner */}
      <Image
        src={banner}
        alt={storeName}
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-4 md:px-10 pb-8 md:pb-12">
          <div className="max-w-3xl">
            <span
              className="
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                bg-white/10
                backdrop-blur-md
                border
                border-white/20
                text-white
                text-[10px]
                md:text-xs
                font-bold
                tracking-[0.2em]
                uppercase
                mb-4
              "
            >
              Aviorè Verified Store
            </span>

            <h1
              className="
                text-4xl
                md:text-6xl
                font-black
                uppercase
                tracking-tight
                text-white
                leading-none
              "
            >
              {storeName}
            </h1>

            <p
              className="
                mt-4
                text-sm
                md:text-lg
                text-white/80
                leading-7
                max-w-2xl
              "
            >
              {tagline ||
                'Premium shopping experience with trusted products and curated collections.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}