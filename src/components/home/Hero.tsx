'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Lock, 
  Headphones,
  Compass
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
        
        // Guardrail: Filter out corrupt legacy base64 strings to prevent 414 URL crashes
        const verifiedSlides = (data || []).filter((slide: Slide) => 
          slide.imageUrl && !slide.imageUrl.startsWith('data:image')
        );
        setSlides(verifiedSlides);
      } catch (err) {
        console.error("AVIORÈ Hero Error:", err);
      }
    };
    fetchSlides();
  }, []);

  if (!slides.length) return null;
  const activeSlide = slides[current];

  const handleNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="relative w-full bg-[#0D0B0A] bg-gradient-to-br from-[#1E1814] via-[#0D0B0A] to-[#0A0908] text-white overflow-hidden pt-12 pb-6">
      
      {/* Decorative ambient studio back-light circle */}
      <div className="absolute right-[-10%] top-[10%] w-[600px] h-[600px] rounded-full bg-[#2A211B] blur-[150px] opacity-60 pointer-events-none z-0" />

      <Container className="relative z-10">
        <div className="relative grid lg:grid-cols-12 gap-8 items-center min-h-[520px] pb-12">
          
          {/* LEFT CONTENT AREA */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <span className="text-[11px] font-mono tracking-[0.35em] text-[#C5A880] uppercase block">
                  {activeSlide.tag || "DISCOVER BETTER."}
                </span>

                {/* Styled Editorial Serif Header */}
                <h1 className="text-4xl md:text-6xl lg:text-[68px] font-serif font-normal text-zinc-100 leading-[1.1] tracking-tight max-w-2xl">
                  Luxury. Quality.<br />
                  <span className="text-zinc-400 italic font-light">Endless Possibilities.</span>
                </h1>
                
                <p className="text-zinc-400 text-sm md:text-base max-w-md font-light leading-relaxed tracking-wide">
                  {activeSlide.subtitle || "A curated marketplace for premium products from trusted brands around the world."}
                </p>

                {/* Dual Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button className="group flex items-center gap-3 bg-[#BF9B6A] hover:bg-[#A38153] text-zinc-950 text-xs font-bold uppercase tracking-[0.15em] pl-7 pr-6 py-4 rounded-md transition-all duration-300 shadow-xl shadow-black/20">
                    <span>Shop Now</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-zinc-950" />
                  </button>
                  
                  <button className="px-7 py-4 rounded-md border border-zinc-700 hover:border-zinc-500 bg-white/5 text-zinc-200 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 backdrop-blur-sm">
                    Explore Collections
                  </button>
                </div>

                {/* Happy Customers Social Proof Row */}
                <div className="flex items-center gap-4 pt-6 border-t border-zinc-800/60 max-w-sm">
                  <div className="flex -space-x-2.5">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="relative w-8 h-8 rounded-full border border-[#1E1814] overflow-hidden bg-zinc-800">
                        <div className="w-full h-full bg-gradient-to-tr from-zinc-700 to-zinc-500" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-light tracking-wide">
                    Join <span className="text-zinc-200 font-medium">25,000+ happy customers</span> who trust Aviorè
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT HERO IMAGE CONTAINER */}
          <div className="lg:col-span-5 relative w-full h-[380px] md:h-[500px] flex items-center justify-center mt-8 lg:mt-0">
            
            {/* Round pedastal geometric backing structure matching the reference layout */}
            <div className="absolute bottom-4 w-[85%] aspect-square rounded-full bg-[#1A1614] border border-zinc-800/40 opacity-80 z-0 flex items-center justify-center shadow-inner">
              <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-b from-[#241F1B] to-transparent opacity-40" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full z-10 flex items-center justify-center"
              >
                <div className="relative w-[90%] h-[85%]">
                  <Image
                    src={activeSlide.imageUrl.startsWith('http') 
                      ? activeSlide.imageUrl 
                      : `${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`
                    }
                    alt={activeSlide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.7)] select-none"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* FLOATING LOOKBOOK CARD (Right side of image) */}
            <div className="absolute right-0 bottom-16 md:bottom-24 bg-[#141211]/90 backdrop-blur-md p-5 rounded-xl border border-zinc-800/80 w-[145px] z-20 shadow-2xl text-left hidden sm:block">
              <Compass size={14} className="text-[#C5A880] mb-3" />
              <span className="text-[9px] text-zinc-500 uppercase block font-mono tracking-widest mb-0.5">New In</span>
              <p className="text-[10px] text-zinc-300 font-light tracking-wide leading-normal mb-4">Discover the latest arrivals</p>
              <div 
                onClick={handleNext}
                className="flex items-center justify-between text-[9px] font-bold text-[#C5A880] uppercase tracking-wider cursor-pointer group pt-2 border-t border-zinc-800/50"
              >
                <span>Explore</span>
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* MANUAL SLIDER MICRO NAVIGATION TRIGGERS */}
            {slides.length > 1 && (
              <div className="absolute bottom-0 left-0 flex items-center gap-1.5 z-20 bg-zinc-950/40 backdrop-blur-sm p-1 rounded-lg border border-zinc-800/40">
                <button onClick={handlePrev} className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] font-mono text-zinc-500">{current + 1}/{slides.length}</span>
                <button onClick={handleNext} className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* BOTTOM METRIC TRUST BAR ARCHITECTURE */}
        <div className="w-full bg-[#110E0C]/60 border border-zinc-800/60 rounded-xl p-6 mt-4 backdrop-blur-sm z-20 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-zinc-800/60">
            
            <div className="flex items-center gap-4 pl-2">
              <ShieldCheck size={22} className="text-[#C5A880] shrink-0" />
              <div>
                <h4 className="text-xs font-bold tracking-wider text-zinc-100 uppercase">Trusted Brands</h4>
                <p className="text-[10px] text-zinc-500 font-light mt-0.5">100% authentic products</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 pl-2 md:pl-6">
              <Truck size={22} className="text-[#C5A880] shrink-0" />
              <div>
                <h4 className="text-xs font-bold tracking-wider text-zinc-100 uppercase">Fast & Reliable</h4>
                <p className="text-[10px] text-zinc-500 font-light mt-0.5">Delivering to your doorstep</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pl-2 md:pl-6">
              <Lock size={20} className="text-[#C5A880] shrink-0" />
              <div>
                <h4 className="text-xs font-bold tracking-wider text-zinc-100 uppercase">Secure Payments</h4>
                <p className="text-[10px] text-zinc-500 font-light mt-0.5">Your data is always safe</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 pl-2 md:pl-6">
              <Headphones size={20} className="text-[#C5A880] shrink-0" />
              <div>
                <h4 className="text-xs font-bold tracking-wider text-zinc-100 uppercase">Dedicated Support</h4>
                <p className="text-[10px] text-zinc-500 font-light mt-0.5">We're here to help 24/7</p>
              </div>
            </div>

          </div>
        </div>

      </Container>
    </section>
  );
}