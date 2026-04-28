'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Section } from '../layout/Section';

interface BreakoutItem {
  image: string;
  tag: string;
  heading: string;
  subtext: string;
  link: string;
  discount?: string;
}

/**
 * Validates if the string is a usable Next.js Image source.
 * Prevents "Failed to parse src" runtime errors.
 */
const isValidImage = (src: string): boolean => {
  if (!src || src === "...") return false;
  return src.startsWith('http') || src.startsWith('/');
};

export function BreakoutBannerGrid({ items }: { items: BreakoutItem[] }) {
  return (
    <Section className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <Link 
            href={item.link} 
            key={idx} 
            className="group relative h-[220px] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 transition-all hover:border-white/20 focus-visible:ring-2 focus-visible:ring-[#A4143D] outline-none"
          >
            {/* 1. BACKGROUND LAYER (SAFE IMAGE) */}
            <div className="absolute inset-0 z-0 opacity-40 transition-transform duration-700 group-hover:scale-105">
              {isValidImage(item.image) ? (
                <Image 
                  src={item.image} 
                  alt={item.heading} 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={idx < 3} // Priority load for top items
                />
              ) : (
                <div className="h-full w-full bg-zinc-800 animate-pulse" />
              )}
              {/* Overlay Gradient for Text Legibility */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            
            {/* 2. CONTENT LAYER */}
            <div className="relative z-10 flex h-full flex-col justify-between p-8">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                  {item.tag}
                </span>
                <h3 className="max-w-[150px] text-xl font-bold italic leading-tight text-white">
                   {item.heading} 
                   {item.discount && (
                     <span className="ml-2 not-italic text-[#A4143D]">
                       {item.discount}
                     </span>
                   )}
                </h3>
                <p className="text-[11px] font-medium text-zinc-500">
                  {item.subtext}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors group-hover:text-[#A4143D]">
                Shop Now <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}