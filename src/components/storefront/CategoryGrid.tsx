'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Category = {
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  targetUrl: string;
  bg: string;
  accent: string;
};

const CATEGORY_DATA: Category[] = [
  {
    title: 'Fashion Deals',
    subtitle: 'Trending styles & exclusive offers.',
    badge: 'BEST DEALS',
    imageUrl: '/banners/store1.png',
    targetUrl: '/category/fashion',
    bg: '#FFE8D2',
    accent: '#F59E0B',
  },
  {
    title: 'Skincare Deals',
    subtitle: 'Glow with premium essentials.',
    badge: 'BEST DEALS',
    imageUrl: '/banners/skincare.png',
    targetUrl: '/category/skincare',
    bg: '#EAF8FF',
    accent: '#0EA5E9',
  },
  {
    title: 'Watches & Jewelry',
    subtitle: 'Luxury pieces at better prices.',
    badge: 'BEST DEALS',
    imageUrl: '/banners/watch.png',
    targetUrl: '/category/fashion/watches-jewelry',
    bg: '#FFF1D8',
    accent: '#F59E0B',
  },
  {
    title: 'Footwear Deals',
    subtitle: 'Fresh drops. Everyday comfort.',
    badge: 'BEST DEALS',
    imageUrl: '/banners/foot.png',
    targetUrl: '/category/fashion/footwear',
    bg: '#E8FBFF',
    accent: '#06B6D4',
  },
  {
    title: 'Accessories',
    subtitle: 'Complete every look.',
    badge: 'BEST DEALS',
    imageUrl: '/banners/accessory.png',
    targetUrl: '/category/accessories',
    bg: '#F3EDFF',
    accent: '#8B5CF6',
  },
];

function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
      }}
      className="
        min-w-[260px]
        w-[260px]
        shrink-0
        snap-start

        md:min-w-0
        md:w-auto
      "
    >
      <Link href={category.targetUrl} className="group block">
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-neutral-200
            aspect-[0.82]
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
          "
          style={{
            backgroundColor: category.bg,
          }}
        >
          {/* Glow */}
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/40 blur-3xl" />

          {/* Badge */}
          <div
            className="
              absolute
              top-3
              right-3
              z-30
              rotate-12
              rounded-lg
              px-2.5
              py-1
              text-[9px]
              font-black
              tracking-wide
              text-white
              shadow-lg
            "
            style={{
              backgroundColor: category.accent,
            }}
          >
            {category.badge}
          </div>

          {/* Content */}
          <div className="relative z-20 p-5">
            <h3 className="max-w-[170px] text-[26px] font-black leading-none text-neutral-900">
              {category.title}
            </h3>

            <p className="mt-3 max-w-[150px] text-xs text-neutral-600">
              {category.subtitle}
            </p>

            <div className="mt-5 inline-flex items-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm">
              Shop Now
            </div>
          </div>

          {/* Product Image */}
          <div
            className="
              absolute
              bottom-0
              right-0
              h-[65%]
              w-[85%]
            "
          >
            <Image
              src={category.imageUrl}
              alt={category.title}
              fill
              priority={index < 3}
              sizes="(max-width:768px) 260px, 20vw"
              className="
                object-contain
                object-bottom-right
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          </div>

          {/* Decorative Dots */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-6 top-6 h-2 w-2 rounded-full bg-white/60" />
            <div className="absolute left-10 top-20 h-1.5 w-1.5 rounded-full bg-white/60" />
            <div className="absolute left-12 bottom-20 h-1 w-1 rounded-full bg-white/60" />
          </div>
        </div>
      </Link>

      <h4 className="mt-3 text-center text-sm font-medium text-neutral-800">
        {category.title}
      </h4>
    </motion.div>
  );
}

export default function CategoryGrid() {
  return (
    <section className="bg-[#f7f7f7] py-10">
      <div className="mx-auto max-w-7xl px-4">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              Featured Collections
            </span>

            <h2 className="mt-2 text-3xl font-bold text-neutral-900">
              Shop By Category
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Explore curated fashion, beauty and lifestyle deals.
            </p>
          </div>
        </div>

        {/* Mobile Slider + Desktop Grid */}

        <div
          className="
            flex
            gap-4
            overflow-x-auto
            pb-4
            snap-x
            snap-mandatory
            scroll-smooth

            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden

            md:grid
            md:grid-cols-3

            lg:grid-cols-5
          "
        >
          {CATEGORY_DATA.map((category, index) => (
            <CategoryCard
              key={category.title}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}