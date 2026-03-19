'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '../layout/Section';

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

/**
 * 🚀 MULTI-BANNER GRID (Organism)
 * Rule 1: Global Grid System
 * Rule 12: Premium Interaction
 */
export function MultiBannerGrid() {
  return (
    <Section className="!pt-4 !pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* LEFT BANNER (3 Columns) */}
        <div className="md:col-span-2 lg:col-span-3">
          <BannerCard item={SAMPLE_BANNERS[0]} />
        </div>

        {/* CENTER BANNER (Large Focus - 6 Columns) */}
        <div className="md:col-span-4 lg:col-span-6">
          <BannerCard item={SAMPLE_BANNERS[1]} isLarge />
        </div>

        {/* RIGHT BANNER (3 Columns) */}
        <div className="md:col-span-2 lg:col-span-3">
          <BannerCard item={SAMPLE_BANNERS[2]} />
        </div>

      </div>
    </Section>
  );
}

/**
 * 🖼️ BANNER CARD (Molecule)
 * Rule 9: Image Aspect Ratios
 * Rule 6: Brand Colors (#A4143D)
 */
function BannerCard({ item, isLarge = false }: { item: BannerItem; isLarge?: boolean }) {
  return (
    <Link 
      href={item.link} 
      className={`group relative flex w-full overflow-hidden rounded-[2.5rem] bg-gray-100 transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-[#A4143D]/10 ${
        isLarge ? 'aspect-[16/9] md:aspect-[16/7]' : 'aspect-square md:aspect-[4/5]'
      }`}
    >
      {/* 🚀 IMAGE LAYER - Rule 9 (Next.js Optimized) */}
      <Image 
        src={item.image} 
        alt={item.title} 
        fill 
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-[1500ms] group-hover:scale-110"
      />
      
      {/* 🚀 OVERLAY - Rule 12 (Dynamic Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-70" />

      {/* 🚀 CONTENT LAYER - Rule 3 (Typography) */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-8 md:p-10 text-center text-white">
        
        {/* Deal Badge - Rule 6 (Burgundy Identity) */}
        {item.discount && (
          <div className="absolute top-6 right-6 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#A4143D] flex flex-col items-center justify-center -rotate-12 shadow-2xl border-4 border-white/10 animate-pulse">
            <span className="text-[8px] font-black uppercase leading-none tracking-tighter">Super</span>
            <span className="text-[12px] font-black uppercase leading-none">Deal!</span>
          </div>
        )}

        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 mb-3">
          {item.title}
        </p>
        
        <h3 className={`
          ${isLarge ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'} 
          font-black italic uppercase tracking-tighter leading-none mb-6 group-hover:scale-105 transition-transform duration-500
        `}>
          {item.subtitle}
        </h3>
        
        {/* Interactive CTA - Rule 8 */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-[#A4143D] pb-1 group-hover:text-[#A4143D] transition-all">
          Explore Now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}