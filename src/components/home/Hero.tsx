'use client';

import Image from 'next/image';
import { useState, useEffect, ReactNode, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { Zap, Star, ArrowRight, ArrowUpRight } from 'lucide-react';

type Slide = {
  id: string;
  imageUrl: string;
  tag: string;
  title: string;
  subtitle?: string;
  discount?: string;
  bgColor?: string;
  accentColor?: string;
};

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let mounted = true;

    const fetchSlides = async () => {
      try {
        const res = await fetch(`${apiUrl}/admin/banners/active`);

        if (!res.ok) {
          throw new Error('Failed to fetch banners');
        }

        const data: Slide[] = await res.json();

        if (mounted) {
          setSlides(data);
        }
      } catch (error) {
        console.error('Banner fetch failed:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSlides();

    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  const activeSlide = useMemo(
    () => slides[current],
    [slides, current]
  );

  if (loading) {
    return (
      <section className="py-8 md:py-10">
        <Container>
          <div className="h-[480px] rounded-[2.5rem] bg-gray-100 animate-pulse" />
        </Container>
      </section>
    );
  }

  if (!activeSlide) return null;

  return (
    <section className="bg-[#f8f8f8] py-4 md:py-10 overflow-hidden">
      <Container>
        <div className="flex lg:grid lg:grid-cols-12 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide pb-4 lg:h-[520px]">
          <MainHeroSlide
            slide={activeSlide}
            current={current}
            total={slides.length}
          />

          <div className="flex lg:grid gap-6 lg:col-span-4">
            <PromoCard
              title="70% OFF"
              subtitle="Ends in 04:59:59"
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

function MainHeroSlide({
  slide,
  current,
  total,
}: {
  slide: Slide;
  current: number;
  total: number;
}) {
  return (
    <div className="min-w-[92vw] lg:min-w-0 lg:col-span-8 relative rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border border-gray-100 h-[480px] lg:h-full snap-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex"
        >
          <HeroContent slide={slide} />
          <HeroImage slide={slide} />

          <div
            className={`absolute inset-0 opacity-5 ${
              slide.bgColor || 'bg-gray-100'
            }`}
          />
        </motion.div>
      </AnimatePresence>

      <ProgressIndicator
        current={current}
        total={total}
      />
    </div>
  );
}

function HeroContent({
  slide,
}: {
  slide: Slide;
}) {
  return (
    <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center z-20">
      <span
        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-white shadow-lg ${
          slide.bgColor || 'bg-orange-500'
        } tracking-widest w-fit mb-6`}
      >
        {slide.tag}
      </span>

      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4"
      >
        {slide.title}
      </motion.h2>

      <motion.p
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`text-3xl md:text-5xl font-black italic mb-10 ${
          slide.accentColor || 'text-orange-600'
        }`}
      >
        {slide.discount || slide.subtitle}
      </motion.p>

     <button className="w-fit flex items-center gap-4 bg-slate-900 hover:bg-slate-800 transition-colors text-white pl-8 pr-3 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl">
        Shop Collection
        <div className="bg-white/10 p-2 rounded-lg">
          <ArrowRight size={18} />
        </div>
      </button>
    </div>
  );
}

function HeroImage({
  slide,
}: {
  slide: Slide;
}) {
  return (
    <div className="w-1/2 relative h-full hidden sm:block">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative w-4/5 h-4/5">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${slide.imageUrl}`}
            alt={slide.title}
            fill
            className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
          />
        </div>
      </div>
    </div>
  );
}

function ProgressIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="absolute bottom-8 left-10 md:left-16 flex gap-4 z-30">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden"
        >
          {index === current && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{
                duration: 5,
                ease: 'linear',
              }}
              className="h-full bg-orange-500"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PromoCard({
  title,
  subtitle,
  tag,
  image,
  icon,
  className,
  rotate,
  secondary = false,
}: {
  title: string;
  subtitle?: string;
  tag: string;
  image: string;
  icon: ReactNode;
  className: string;
  rotate: string;
  secondary?: boolean;
}) {
  return (
<motion.div
  whileHover={{ y: -8, scale: 1.02 }}
  className={`min-w-[82vw] lg:min-w-0 relative rounded-[2rem] overflow-hidden shadow-xl border p-8 flex flex-col justify-between h-[480px] lg:min-h-[240px] snap-center ${className}`}
>
      <div>
        <div className="flex items-center gap-2 mb-3 font-black text-[11px] uppercase tracking-widest">
          {icon} {tag}
        </div>

        <h3 className="text-4xl font-black italic tracking-tight">
          {title}
        </h3>

        {subtitle && (
          <p className="text-xs font-bold mt-2 opacity-80">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={`self-end w-28 h-28 relative ${rotate}`}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-2xl shadow-2xl"
        />
      </div>

      {secondary && (
        <ArrowUpRight
          size={40}
          className="absolute top-6 right-6 text-gray-100"
        />
      )}
    </motion.div>
  );
}