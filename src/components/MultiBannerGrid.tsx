'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BannerItem {
  image: string;
  title: string;
  subtitle: string;
  discount?: string;
  link: string;
}

const SAMPLE_BANNERS: BannerItem[] = [
  {
    image: "/womenfas.jpg",
    title: "Fashion for Women",
    subtitle: "SALE 60% OFF",
    link: "/shop?category=fashion"
  },
  {
    image: "/galaxy.jpg",
    title: "Galaxy Note 8",
    subtitle: "DO BIGGER THINGS",
    discount: "Super Deal!",
    link: "/shop?category=electronics"
  },
  {
    image: "/headphone.jpg",
    title: "Apple Headphone New",
    subtitle: "SALE 30% OFF",
    link: "/shop?category=audio"
  }
];

export function MultiBannerGrid() {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 md:gap-6">
      
      {/* 🖼️ LEFT BANNER (Small/Medium - 3 Columns) */}
      <div className="md:col-span-2 lg:col-span-3">
        <BannerCard item={SAMPLE_BANNERS[0]} />
      </div>

      {/* 🚀 CENTER BANNER (Large Focus - 6 Columns) */}
      <div className="md:col-span-4 lg:col-span-6">
        <BannerCard item={SAMPLE_BANNERS[1]} isLarge />
      </div>

      {/* 🖼️ RIGHT BANNER (Small/Medium - 3 Columns) */}
      <div className="md:col-span-2 lg:col-span-3">
        <BannerCard item={SAMPLE_BANNERS[2]} />
      </div>

    </section>
  );
}

function BannerCard({ item, isLarge = false }: { item: BannerItem; isLarge?: boolean }) {
  return (
    <Link 
      href={item.link} 
      className={`group relative flex w-full overflow-hidden rounded-[2rem] bg-zinc-100 transition-all duration-500 hover:shadow-2xl ${
        isLarge ? 'aspect-[21/9] md:aspect-[16/7]' : 'aspect-square md:aspect-[4/5]'
      }`}
    >
      {/* Image Layer */}
      <Image 
        src={item.image} 
        alt={item.title} 
        fill 
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mb-2">
          {item.title}
        </p>
        <h3 className={`${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl'} font-black italic uppercase tracking-tighter leading-none mb-6`}>
          {item.subtitle}
        </h3>
        
        {item.discount && (
            <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-red-600 flex flex-col items-center justify-center rotate-12 shadow-xl border-4 border-white/20">
                <span className="text-[8px] font-black uppercase leading-none">Super</span>
                <span className="text-[12px] font-black uppercase leading-none">Deal!</span>
            </div>
        )}

        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b border-white/40 pb-1 group-hover:border-white transition-all">
          See More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}