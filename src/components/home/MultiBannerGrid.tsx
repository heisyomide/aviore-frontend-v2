'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section } from '../layout/Section';

export type BannerType = 'women' | 'electronics' | 'audio';

interface BannerConfig {
  image: string;
  category: string;
  heading: string;
  description: string;
  link: string;
  accent: string;
}

const BANNER_CONFIGS: Record<BannerType, BannerConfig> = {
  women: { 
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070", 
    category: "Couture", 
    heading: "Vanguard Fashion", 
    description: "The 2026 Spring/Summer edit has arrived.",
    accent: "bg-[#A4143D]",
    link: "/shop?category=fashion" 
  },
  electronics: { 
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926", 
    category: "Innovation", 
    heading: "Galaxy Protocol", 
    description: "Computing power redefined for the next generation.",
    accent: "bg-zinc-800",
    link: "/shop?category=electronics" 
  },
  audio: { 
    image: "https://res.cloudinary.com/df76p4lbb/image/upload/v1768519010/aviore/va0rgroslzhzxzaog6fp.jpg", 
    category: "Acoustics", 
    heading: "Pure Sonic Art", 
    description: "Studio-grade precision. Wireless freedom.",
    accent: "bg-[#A4143D]",
    link: "/shop?category=audio" 
  }
};

export function PromoBanner({ type }: { type: BannerType }) {
  const item = BANNER_CONFIGS[type];

  return (
    <Section className="py-2 md:py-2">
      <Link href={item.link} className="group relative block w-full outline-none">
        {/* Adjusted height to be slimmer on desktop (h-[400px]) */}
        <div className="relative flex h-[450px] w-full items-center overflow-hidden rounded-[2rem] bg-zinc-950 md:h-[380px]">
          
          {/* 1. BACKGROUND LAYER */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image 
              src={item.image} 
              alt={item.heading} 
              fill 
              sizes="100vw"
              className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            {/* Darker gradient on the left to pop the text */}
            <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>

          {/* 2. MAIN CONTENT AREA */}
          <div className="relative z-10 grid w-full grid-cols-1 items-center px-8 md:grid-cols-12 md:px-20">
            <div className="flex flex-col items-start gap-3 md:col-span-8 lg:col-span-7">
              
              <div className="flex items-center gap-2">
                <span className={`h-1 w-6 rounded-full ${item.accent}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
                  {item.category}
                </span>
              </div>
              
              <h3 className="text-4xl font-black uppercase leading-[0.85] tracking-tighter text-white md:text-7xl">
                {item.heading.split(' ').map((word, i) => (
                  <span key={i} className="mr-4 inline-block last:text-outline-white last:text-transparent md:block md:mr-0">
                    {word}
                  </span>
                ))}
              </h3>

              <p className="max-w-xs text-sm font-medium leading-relaxed text-zinc-400 md:max-w-sm md:text-base">
                {item.description}
              </p>

              <div className="mt-4 flex items-center gap-6">
                <div className="group/btn flex items-center gap-4 rounded-full bg-white px-7 py-3 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:bg-[#A4143D] hover:text-white">
                  Explore Now
                  <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                </div>
                
                <span className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-white/30 lg:flex">
                  <Sparkles size={10} className="text-[#A4143D]" /> Premium Quality
                </span>
              </div>
            </div>
          </div>

          {/* 3. FLOATING BADGE (Positioned lower to match new height) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="absolute right-12 z-20 hidden lg:block"
          >
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">New</span>
              <span className="text-lg font-black text-white italic">2026</span>
            </div>
          </motion.div>
        </div>
      </Link>

      <style jsx>{`
        .text-outline-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </Section>
  );
}