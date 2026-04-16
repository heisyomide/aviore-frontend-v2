'use client';

import Image from 'next/image';
import { useState, useEffect, ReactNode, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { Zap, Star, ArrowRight, ArrowUpRight } from 'lucide-react';

interface Slide {
  id: string;
  imageUrl: string;
  tag: string;
  title: string;
  subtitle?: string;
  discount?: string;
  bgColor?: string;
  accentColor?: string;
  accent?: string;
}

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${apiBase}/admin/banners/active`);
        const data = await res.json();
        setSlides(data);
      } catch (error) {
        console.error('Failed to fetch banners', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, [apiBase]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (loading) return <HeroSkeleton />;
  if (!slides.length) return null;

  const activeSlide = slides[current];

  return (
    <section className="bg-[#f8f8f8] py-4 md:py-10 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-6 lg:h-[520px]">
          {/* Main Content Area */}
          <div className="lg:col-span-8 relative rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border border-gray-100 h-[480px] lg:h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex"
              >
                <HeroContent slide={activeSlide} />
                <HeroImage slide={activeSlide} apiBase={apiBase} />

                {/* Subtle Backdrop Accent */}
                <div className={`absolute inset-0 opacity-5 ${activeSlide.bgColor} ${activeSlide.accentColor}`} />
              </motion.div>
            </AnimatePresence>

            <ProgressIndicator count={slides.length} current={current} />
          </div>

          {/* Side Promo Cards */}
          <div className="grid gap-6 lg:col-span-4">
            <PromoCard
              title="70% OFF"
              subtitle="Limited time offer"
              tag="Flash Sale"
              image="/registry/categories/side1.jpeg"
              icon={<Zap size={14} fill="white" />}
              className="bg-orange-500 border-orange-400 text-white"
              rotate="rotate-6"
            />
            <PromoCard
              title="NEW DROPS"
              tag="Just In"
              image="/registry/categories/arrivals.jpg"
              icon={<Star size={14} fill="currentColor" />}
              className="bg-white border-gray-100 text-slate-900"
              rotate="-rotate-6"
              secondary
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Sub-Components
 */

function HeroContent({ slide }: { slide: Slide }) {
  return (
    <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center z-20">
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-white shadow-lg ${slide.bgColor || 'bg-black'} tracking-widest w-fit mb-6`}>
        {slide.tag}
      </span>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4"
      >
        {slide.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-3xl md:text-5xl font-black italic mb-10 ${slide.accent || 'text-orange-500'}`}
      >
        {slide.discount || slide.subtitle}
      </motion.p>

      <button className="w-fit flex items-center gap-4 bg-slate-900 text-white pl-8 pr-3 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl group transition-transform hover:scale-105 active:scale-95">
        Shop Collection
        <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20">
          <ArrowRight size={18} />
        </div>
      </button>
    </div>
  );
}

function HeroImage({ slide, apiBase }: { slide: Slide; apiBase?: string }) {
  return (
    <div className="hidden md:block w-1/2 relative h-full">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, x: 50 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="absolute inset-0 z-10 flex items-center justify-center p-12"
      >
        <div className="relative w-full h-full">
          <Image
            src={`${apiBase}${slide.imageUrl}`}
            alt={slide.title}
            fill
            priority
            className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)]"
          />
        </div>
      </motion.div>
    </div>
  );
}

function ProgressIndicator({ count, current }: { count: number; current: number }) {
  return (
    <div className="absolute bottom-8 left-10 md:left-16 flex gap-3 z-30">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-1 w-10 bg-gray-100 rounded-full overflow-hidden">
          {index === current && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-full bg-orange-500"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PromoCard({ title, subtitle, tag, image, icon, className, rotate, secondary }: {
  title: string; subtitle?: string; tag: string; image: string; icon: ReactNode; className: string; rotate: string; secondary?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative rounded-[2rem] overflow-hidden shadow-xl border p-8 flex flex-col justify-between min-h-[240px] transition-all ${className}`}
    >
      <div className="z-10">
        <div className="flex items-center gap-2 mb-3 font-black text-[10px] uppercase tracking-widest">
          {icon} {tag}
        </div>
        <h3 className="text-4xl font-black italic tracking-tight leading-none">{title}</h3>
        {subtitle && <p className="text-[10px] font-bold mt-2 opacity-80 uppercase tracking-wider">{subtitle}</p>}
      </div>

      <div className={`self-end w-24 h-24 relative z-0 ${rotate}`}>
        <Image src={image} alt={title} fill className="object-cover rounded-2xl shadow-xl" />
      </div>

      {secondary && <ArrowUpRight size={40} className="absolute top-6 right-6 opacity-10" />}
    </motion.div>
  );
}

function HeroSkeleton() {
  return (
    <section className="py-20">
      <Container>
        <div className="h-[520px] rounded-[2.5rem] bg-gray-100 animate-pulse" />
      </Container>
    </section>
  );
}