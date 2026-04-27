'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { ArrowRight, ChevronRight } from 'lucide-react';

// Updated to match your exact API response structure
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
  position: number;
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
        console.error("Failed to load AVIORÈ hero assets:", err);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;
  const activeSlide = slides[current];

  return (
    <section className="bg-white pt-6 pb-12 md:py-20 overflow-hidden min-h-[500px] md:min-h-[700px] flex items-center">
      <Container>
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* DESKTOP PAGINATION (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-6 items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? 'bg-zinc-900 scale-[2.5]' : 'bg-zinc-200'
                }`}
              />
            ))}
          </div>

          {/* CONTENT AREA: Dynamic spacing for mobile to prevent "too long" verticality */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-6 md:space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.3em] ${activeSlide.accentColor} mb-4 block`}>
                  {activeSlide.tag}
                </span>
                
                <h1 className="text-5xl md:text-[5.5rem] font-black text-zinc-900 leading-[0.9] tracking-tighter uppercase mb-6 md:mb-8">
                  {activeSlide.title.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h1>
                
                <p className="text-zinc-500 text-sm md:text-lg max-w-xs md:max-w-sm leading-relaxed mb-8 md:mb-10">
                  {activeSlide.subtitle} — crafted for the premium AVIORÈ aesthetic.
                </p>

                <button className="group flex items-center gap-4 md:gap-6 px-6 md:px-8 py-3 md:py-4 rounded-full border border-zinc-200 hover:border-zinc-900 transition-all text-[10px] md:text-sm font-bold uppercase tracking-widest">
                  Explore Hub
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* IMAGE AREA: Optimized for horizontal visual flow on mobile */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative h-[300px] md:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Floating Detail Card (Hidden on very small screens to keep it horizontal) */}
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute hidden sm:block -left-6 bottom-10 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/40 z-30 min-w-[200px]"
                >
                  <h4 className="font-bold text-zinc-900 text-sm mb-2 uppercase tracking-tighter">
                    Featured Item
                  </h4>
                  <div className="flex items-center gap-3 mt-4 text-[10px] font-black uppercase tracking-widest cursor-pointer group">
                    Details <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    <div className="ml-auto w-8 h-[1px] bg-zinc-200 group-hover:bg-zinc-900 transition-colors" />
                  </div>
                </motion.div>

                {/* Main Product Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`}
                    alt={activeSlide.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>

                {/* API-Driven Discount Badge */}
                <div className={`absolute top-0 right-4 md:top-10 md:right-10 w-14 h-14 md:w-20 md:h-20 ${activeSlide.bgColor} rounded-full flex items-center justify-center text-white font-black text-[10px] md:text-sm shadow-lg rotate-12`}>
                  {activeSlide.discount}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </Container>
    </section>
  );
}