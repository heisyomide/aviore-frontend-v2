'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '../layout/Section';

// 🎯 1. Define the possible banner types
export type BannerType = 'women' | 'electronics' | 'audio';

interface BannerConfig {
  image: string;
  title: string;
  subtitle: string;
  link: string;
  discount?: string;
}

const BANNER_CONFIGS: Record<BannerType, BannerConfig> = {
  women: { 
    image: "/womenfas.jpg", 
    title: "Fashion for Women", 
    subtitle: "SALE 60% OFF", 
    link: "/shop?category=fashion" 
  },
  electronics: { 
    image: "/galaxy.jpg", 
    title: "Galaxy Note 8", 
    subtitle: "DO BIGGER THINGS", 
    discount: "Super Deal!", 
    link: "/shop?category=electronics" 
  },
  audio: { 
    image: "/headphone.jpg", 
    title: "Apple Headphone New", 
    subtitle: "SALE 30% OFF", 
    link: "/shop?category=audio" 
  }
};

export function PromoBanner({ type }: { type: BannerType }) {
  const item = BANNER_CONFIGS[type];

  return (
    <Section className="py-6!">
      <Link 
        href={item.link} 
        className="group relative flex aspect-video w-full overflow-hidden rounded-4xl bg-gray-100 transition-all duration-700 ease-out hover:shadow-2xl md:aspect-21/7"
      >
        <Image 
          src={item.image} 
          alt={item.title} 
          fill 
          sizes="100vw"
          className="duration-1500 object-cover transition-transform group-hover:scale-105"
        />
        
        {/* 🎯 2. Using modern bg-linear-to-r for a clean cinematic look */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-left text-white md:p-20">
          {item.discount && (
            <div className="mb-4 flex h-16 w-16 -rotate-12 animate-pulse flex-col items-center justify-center rounded-full border-4 border-white/10 bg-[#A4143D] md:h-20 md:w-20">
              <span className="text-[7px] font-black uppercase tracking-tighter">Super</span>
              <span className="text-[10px] font-black uppercase">Deal!</span>
            </div>
          )}

          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/70 md:text-[12px]">
            {item.title}
          </p>
          
          <h3 className="mb-8 max-w-xl text-3xl font-black italic uppercase leading-none tracking-tighter md:text-6xl">
            {item.subtitle}
          </h3>
          
          <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all group-hover:bg-[#A4143D] group-hover:text-white">
            Explore Collection <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </Section>
  );
}