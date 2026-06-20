'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { 
  ArrowRight, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Headphones 
} from 'lucide-react';

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
        
        // Guardrail: Filter out corrupt legacy base64 data to prevent optimization errors
        const verifiedSlides = (data || []).filter((slide: Slide) => 
          slide.imageUrl && !slide.imageUrl.startsWith('data:image')
        );
        setSlides(verifiedSlides);
      } catch (err) {
        console.error("AVIORÈ Hero Custom Error:", err);
      }
    };
    fetchSlides();
  }, []);

  if (!slides.length) return null;
  const activeSlide = slides[current];

  return (
    <section className="relative w-full bg-[#FDFBF9] text-zinc-900 overflow-hidden pt-4 pb-8 md:py-16">
      <Container>
        
        {/* MAIN DISPLAY RESPONSIVE WRAPPER */}
        <div className="relative grid lg:grid-cols-12 gap-8 items-center min-h-[580px] lg:min-h-[640px]">
          
          {/* =========================================================
              1. RIGHT SIDE IMAGE DISPLAY (Becomes Full Background on Mobile)
             ========================================================= */}
          <div className="absolute inset-0 w-full h-full lg:relative lg:col-span-5 lg:h-[600px] flex items-center justify-center z-0 lg:z-10">
            
            {/* The soft architectural display background circle/arch from the reference image */}
            <div className="absolute bottom-0 lg:bottom-4 w-full aspect-[4/5] lg:w-[110%] lg:aspect-square rounded-t-full lg:rounded-full bg-[#F5F0EA] opacity-70 pointer-events-none z-0" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Product Image Placement */}
                <div className="relative w-[75%] h-[60%] lg:w-[90%] lg:h-[85%] bottom-10 lg:bottom-0">
                  <Image
                    src={activeSlide.imageUrl.startsWith('http') 
                      ? activeSlide.imageUrl 
                      : `${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`
                    }
                    alt={activeSlide.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain drop-shadow-[0_20px_40px_rgba(165,150,135,0.3)] select-none"
                    priority
                  />
                </div>

                {/* Micro Lookbook Round Tag Overlay */}
                <div className="absolute top-[25%] right-[5%] lg:right-[-5%] bg-white/90 backdrop-blur-md border border-zinc-200/60 rounded-full w-20 h-20 shadow-xl flex flex-col items-center justify-center p-2 text-center select-none z-20">
                  <span className="text-[7px] font-mono text-zinc-400 uppercase tracking-widest block mb-0.5">⭐ New</span>
                  <span className="text-[9px] font-bold tracking-tight text-zinc-800 leading-none uppercase">Arrivals</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* =========================================================
              2. LEFT CONTENT CONTENT AREA (Elevated Mobile Foreground Card)
             ========================================================= */}
          <div className="relative lg:col-span-7 z-10 mt-[260px] sm:mt-[340px] lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/95 sm:bg-white/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-6 sm:p-10 lg:p-0 rounded-3xl border border-zinc-200/40 lg:border-none shadow-xl shadow-zinc-900/5 lg:shadow-none space-y-6 max-w-xl mx-auto lg:mx-0"
              >
                
                {/* Header Kicker Label */}
                <div className="text-[10px] sm:text-11px font-mono tracking-[0.3em] text-[#C5A880] uppercase font-bold">
                  WELCOME TO AVIORÈ
                </div>

                {/* Elegant Editorial Headline Hierarchy */}
                <h1 className="text-3xl sm:text-5xl lg:text-[64px] font-serif font-medium text-zinc-900 leading-[1.15] tracking-tight">
                  Discover.<br />
                  Shop. <span className="text-[#E07A5F] italic font-normal">Love.</span><br />
                  All in One Place.
                </h1>
                
                {/* Subtitle Narration text */}
                <p className="text-zinc-500 text-xs sm:text-sm md:text-base max-w-md font-light leading-relaxed">
                  {activeSlide.subtitle || "A premium marketplace for everything you love. Curated. Trusted. Delivered to you."}
                </p>

                {/* Primary Actions Platform Trigger Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button className="group flex items-center gap-2 bg-[#121316] hover:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.15em] px-6 py-3.5 rounded-xl transition-all duration-300">
                    <span>Shop Now</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  
                  <button className="px-6 py-3.5 rounded-xl border border-zinc-200 hover:border-zinc-400 bg-white text-zinc-800 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 shadow-sm">
                    Explore Collections
                  </button>
                </div>

                {/* Social Proof Review Section */}
                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-zinc-100 max-w-sm">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="w-7 h-7 rounded-full border-2 border-white bg-zinc-200 overflow-hidden relative">
                        <div className="w-full h-full bg-gradient-to-tr from-zinc-400 to-zinc-300" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-zinc-800">4.9/5</span>
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className="fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium">From 2,300+ reviews</p>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* =========================================================
            3. HORIZONTAL FEATURE TRUST MATRIX PANEL
           ========================================================= */}
        <div className="w-full bg-[#F8F5F0]/80 border border-zinc-200/50 rounded-2xl p-5 sm:p-6 mt-8 backdrop-blur-sm z-20 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-zinc-300/40">
            
            <div className="flex items-center gap-3.5 pl-1">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-sm shrink-0">
                <Sparkles size={16} className="text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold tracking-wider text-zinc-800 uppercase">Curated Quality</h4>
                <p className="text-[10px] text-zinc-400 font-light mt-0.5">Handpicked premium items</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-4 md:pt-0 pl-1 md:pl-5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-sm shrink-0">
                <ShieldCheck size={16} className="text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold tracking-wider text-zinc-800 uppercase">Secure Shopping</h4>
                <p className="text-[10px] text-zinc-400 font-light mt-0.5">Safe & encrypted checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pl-1 md:pl-5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-sm shrink-0">
                <Truck size={16} className="text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold tracking-wider text-zinc-800 uppercase">Fast Delivery</h4>
                <p className="text-[10px] text-zinc-400 font-light mt-0.5">Quick shipping to your door</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-4 md:pt-0 pl-1 md:pl-5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-sm shrink-0">
                <Headphones size={15} className="text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold tracking-wider text-zinc-800 uppercase">Dedicated Support</h4>
                <p className="text-[10px] text-zinc-400 font-light mt-0.5">Live expert help 24/7</p>
              </div>
            </div>

          </div>
        </div>

      </Container>
    </section>
  );
}