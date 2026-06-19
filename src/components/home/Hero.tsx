'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

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

const VENDOR_MESSAGES = [
  "Join as a Vendor",
  "Global Logistics Support",
  "Secure Payouts 24/7",
  "Luxury Brand Protection"
];

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/banners/active`);
        const data = await res.json();
        
        // 1. HARDEN SYSTEM LOGIC: Instantly filters out corrupted or invalid legacy Base64 string payloads
        // ensuring your layout engine never maps unoptimized blocks to Next.js Image
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

  useEffect(() => {
    if (!slides.length) return;
    const autoPlay = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds auto-rotate allows comfortable reading of luxury assets
    return () => clearInterval(autoPlay);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % VENDOR_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  if (!slides.length) return null;
  const activeSlide = slides[current];

  return (
    <section className="relative bg-[#F9F9F9] overflow-hidden border-b border-zinc-200/50">
      
      {/* 2. DYNAMIC BROADCAST BANNER FOR VENDORS */}
      <div className="bg-zinc-950 text-white py-2 text-[9px] font-black uppercase tracking-[0.3em] text-center border-b border-white/5 relative z-30">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="inline-block"
          >
            {VENDOR_MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <Container>
        <div className="relative grid lg:grid-cols-12 gap-8 items-center py-12 md:py-24">
          
          {/* LEFT CONTENT AREA */}
          <div className="z-20 lg:col-span-7 space-y-6 md:space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 text-white rounded-md text-[9px] font-mono tracking-widest uppercase mb-4">
                  <span>{activeSlide.tag || "AVIORÈ EXCLUSIVE"}</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-900 leading-tight uppercase tracking-tighter italic font-serif">
                  {activeSlide.title}
                </h1>
                
                <p className="text-zinc-500 text-sm md:text-lg max-w-md mt-4 leading-relaxed font-light">
                  {activeSlide.subtitle}
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <button className="px-8 py-4 rounded-xl bg-zinc-900 text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-950/10">
                    Discover Collection
                  </button>
                  <button className="px-6 py-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all">
                    View Gallery
                  </button>
                </div>

                {/* PRODUCT CONTEXT CARD (Elevated with proper aspect rules) */}
                <div className="mt-12 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-zinc-200/40 border border-zinc-100 max-w-[300px] relative">
                   <span className="text-[9px] text-zinc-400 uppercase font-black tracking-widest font-mono">
                     Featured Collection Asset
                   </span>
                   <h3 className="font-bold text-zinc-900 mt-1 text-sm tracking-tight uppercase">
                     {activeSlide.tag} Architectural Drop
                   </h3>
                   <div className="flex gap-1 mt-2">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={10} className="fill-zinc-900 text-zinc-900" />
                     ))}
                     <span className="text-[9px] text-zinc-400 ml-1 font-medium">Verified Editorial Standard</span>
                   </div>
                   <div className="mt-4 flex items-baseline gap-2">
                     <span className="text-lg font-black text-zinc-900 tracking-tight">Premium Range</span>
                   </div>
                   <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px] font-bold text-zinc-900 uppercase cursor-pointer group">
                     <span>Acquire Registry Token</span> 
                     <ArrowRight size={12} className="group-hover:translate-x-1 text-zinc-900 transition-transform" />
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT IMAGE AREA */}
          <div className="relative lg:col-span-5 h-[350px] md:h-[550px] w-full flex items-center justify-center mt-8 lg:mt-0">
            
            {/* Background Aesthetic Ambient Glow Plate */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-zinc-200/40 blur-3xl -z-10" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* 3. HARDENED ACCENT WRAPPER: Avoids passing raw tailwind class names from database 
                    strings that could fail to match compiled purge maps. Safer style execution using inline values */}
                {activeSlide.discount && (
                  <div 
                    style={{ backgroundColor: activeSlide.bgColor || '#000000', color: activeSlide.accentColor || '#ffffff' }}
                    className="absolute top-4 right-4 md:top-12 md:right-0 px-4 py-2.5 rounded-xl font-mono font-black text-xs shadow-xl z-20 uppercase tracking-wider border border-white/10"
                  >
                    {activeSlide.discount}
                  </div>
                )}

                {/* Next.js Image Optimization Matrix with Safeguard URL Normalization */}
                <div className="relative w-full h-full max-h-[320px] md:max-h-[500px]">
                  <Image
                    src={activeSlide.imageUrl.startsWith('http') 
                      ? activeSlide.imageUrl 
                      : `${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`
                    }
                    alt={activeSlide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] z-10 select-none"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* 4. MANUAL CONTROLLER CAROUSEL INTERACTIVE TRIGGERS */}
            {slides.length > 1 && (
              <div className="absolute bottom-4 left-4 lg:left-auto lg:right-4 flex items-center gap-2 z-30">
                <button 
                  onClick={handlePrev}
                  className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 transition-all shadow-md active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="px-3 py-1.5 rounded-lg bg-zinc-950 text-white font-mono text-[10px] font-bold tracking-widest">
                  {current + 1} / {slides.length}
                </div>

                <button 
                  onClick={handleNext}
                  className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 transition-all shadow-md active:scale-95"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>

        </div>
      </Container>
    </section>
  );
}