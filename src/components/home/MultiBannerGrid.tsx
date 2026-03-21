'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section } from '../layout/Section';

const SAMPLE_BANNERS = [
  { id: 1, image: "/womenfas.jpg", title: "Fashion for Women", subtitle: "SALE 60% OFF", link: "/shop?category=fashion" },
  { id: 2, image: "/galaxy.jpg", title: "Galaxy Note 8", subtitle: "DO BIGGER THINGS", discount: "Super Deal!", link: "/shop?category=electronics" },
  { id: 3, image: "/headphone.jpg", title: "Apple Headphone New", subtitle: "SALE 30% OFF", link: "/shop?category=audio" }
];

export function MultiBannerGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🎯 Sync Dots with Scroll Position
  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
    }
  };

  return (
    <Section className="!pt-4 !pb-12">
      <div className="relative group">
        
        {/* 🚀 THE KINETIC TRACK */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 pb-4 md:pb-0 md:grid md:grid-cols-4 lg:grid-cols-12 lg:gap-6"
        >
          {SAMPLE_BANNERS.map((item, idx) => (
            <div 
              key={item.id}
              className={`min-w-[88%] md:min-w-0 snap-center
                ${idx === 0 ? 'lg:col-span-3 md:col-span-2' : ''}
                ${idx === 1 ? 'lg:col-span-6 md:col-span-4' : ''}
                ${idx === 2 ? 'lg:col-span-3 md:col-span-2' : ''}
              `}
            >
              <BannerCard item={item} isLarge={idx === 1} />
            </div>
          ))}
        </div>

        {/* 🚀 MOBILE DOTS INDICATOR (Hidden on Desktop) */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {SAMPLE_BANNERS.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                activeIndex === idx ? 'w-8 bg-[#A4143D]' : 'w-2 bg-zinc-200'
              }`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function BannerCard({ item, isLarge = false }: { item: any; isLarge?: boolean }) {
  return (
    <Link 
      href={item.link} 
      className={`group relative flex w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gray-100 transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-[#A4143D]/10 ${
        isLarge ? 'aspect-[4/5] md:aspect-[16/7]' : 'aspect-[4/5]'
      }`}
    >
      <Image 
        src={item.image} 
        alt={item.title} 
        fill 
        className="object-cover transition-transform duration-[1500ms] group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-end p-6 md:p-10 text-center text-white">
        {item.discount && (
          <div className="absolute top-4 right-4 w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#A4143D] flex flex-col items-center justify-center -rotate-12 border-4 border-white/10 animate-pulse">
            <span className="text-[7px] font-black uppercase tracking-tighter">Super</span>
            <span className="text-[10px] font-black uppercase">Deal!</span>
          </div>
        )}

        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-2">
          {item.title}
        </p>
        
        <h3 className={`${isLarge ? 'text-2xl md:text-5xl' : 'text-xl md:text-3xl'} font-black italic uppercase tracking-tighter leading-none mb-4 md:mb-6`}>
          {item.subtitle}
        </h3>
        
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] border-b-2 border-[#A4143D] pb-1 group-hover:text-[#A4143D] transition-all">
          Explore Now <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}