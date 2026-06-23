'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  discount: string;
  bgColor: string; 
  accentColor: string; 
  isActive: boolean;
};

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/banners/active`);
        const data = await res.json();
        setSlides(data);
      } catch (err) {
        console.error("AVIORÈ Hero Error:", err);
      }
    };
    fetchSlides();
  }, []);

  if (!slides.length) return null;
  const activeSlide = slides[current];

  return (
    <section className="relative bg-[#FDFBF9] overflow-hidden py-6 md:py-12">
      <Container>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[580px]">
          
          {/* ==========================================
              1. MOBILE BACKGROUND IMAGE COMPOSITION 
             ========================================== */}
          <div className="absolute inset-0 block lg:hidden z-0 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeSlide.imageUrl.startsWith('http') 
                    ? activeSlide.imageUrl 
                    : `${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`
                  }
                  alt=""
                  fill
                  className="object-cover object-center"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ==========================================
              2. TEXT CONTENT & BUTTON AREA (Glass Card on Mobile)
             ========================================== */}
          <div className="z-10 w-full max-w-xl mx-auto lg:mx-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="
                  relative
                  bg-white/70 
                  backdrop-blur-xl 
                  rounded-3xl 
                  p-6 
                  sm:p-10
                  border 
                  border-white/50 
                  shadow-xl 
                  shadow-zinc-900/5
                  lg:bg-transparent 
                  lg:backdrop-blur-none 
                  lg:border-none 
                  lg:shadow-none 
                  lg:p-0 
                  space-y-6
                "
              >
                {/* Tag Kicker */}
                <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-zinc-400 block">
                  Welcome to Aviorè
                </span>

                {/* Premium Editorial Split Typography */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-zinc-900 leading-[1.15] tracking-tight">
                  Discover.
                  <br />
                  Shop. <span className="text-[#E4A07A] italic font-normal">Love.</span>
                  <br />
                  All in One Place.
                </h1>
                
                {/* Subtitle description */}
                <p className="text-zinc-500 text-sm md:text-base font-light leading-relaxed max-w-md">
                  {activeSlide.subtitle || "A premium marketplace for everything you love. Curated. Trusted. Delivered to you."}
                </p>

                {/* Main Action Buttons */}

<div className="flex flex-wrap gap-3 pt-2">
  {/* Primary Route: Redirects straight to your newly refactored edge-to-edge product showcase */}
  <Link 
    href="/shop" 
    className="flex items-center justify-center gap-2 bg-[#121316] hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest px-7 py-4 rounded-xl transition-all shadow-md shadow-zinc-900/10 group"
  >
    <span>Shop Now</span>
    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
  </Link>
  
  {/* Secondary Route: Anchors directly down or forwards users to collections */}
  <Link 
    href="/shop?sort=newest" 
    className="flex items-center justify-center bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold uppercase tracking-widest px-7 py-4 rounded-xl border border-zinc-200 transition-all shadow-sm"
  >
    Explore Collections
  </Link>
</div>

                {/* Customer Trust & Ratings Matrix */}
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-200/60 max-w-xs">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((avatar) => (
                      <div key={avatar} className="w-7 h-7 rounded-full border-2 border-white bg-zinc-200 overflow-hidden relative">
                        <div className="w-full h-full bg-gradient-to-tr from-zinc-400 to-zinc-300" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-xs text-zinc-800">
                      <span>4.9/5</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className="fill-current text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-medium">From 2,300+ reviews</p>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* ==========================================
              3. DESKTOP HERO IMAGE AREA (Hidden on Mobile)
             ========================================== */}
          <div className="hidden lg:flex relative w-full h-[580px] items-center justify-center z-10">
            
            {/* Soft background luxury platform silhouette */}
            <div className="absolute inset-4 rounded-full bg-[#F6F1EB] blur-sm opacity-80 z-0 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-[85%] z-10"
              >
                <Image
                  src={activeSlide.imageUrl.startsWith('http') 
                    ? activeSlide.imageUrl 
                    : `${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`
                  }
                  alt={activeSlide.title}
                  fill
                  className="object-contain drop-shadow-[0_25px_45px_rgba(180,165,150,0.4)]"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </Container>
    </section>
  );
}