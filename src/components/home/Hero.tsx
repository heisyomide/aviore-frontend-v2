'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { ArrowRight, ChevronRight } from 'lucide-react';

type Slide = {
  id: string;
  imageUrl: string;
  tag: string;
  title: string;
  description?: string;
  price?: string;
  originalPrice?: string;
};

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Fetch logic remains same, but mapping to new cleaner Slide type
    const fetchSlides = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/banners/active`);
      const data = await res.json();
      setSlides(data);
    };
    fetchSlides();
  }, []);

  if (!slides.length) return null;

  const activeSlide = slides[current];

  return (
    <section className="bg-white py-12 md:py-20 overflow-hidden min-h-[600px] flex items-center">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: PAGINATION DOTS (The vertical line from your image) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-6 items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? 'bg-orange-500 scale-[2.5]' : 'bg-zinc-200'
                }`}
              />
            ))}
          </div>

          {/* CENTER: CONTENT */}
          <div className="lg:col-span-6 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-6xl md:text-[5.5rem] font-black text-zinc-900 leading-[0.85] tracking-tighter uppercase mb-8">
                  {activeSlide.title.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h1>
                
                <p className="text-zinc-500 text-base md:text-lg max-w-sm leading-relaxed mb-10">
                  {activeSlide.description || "Shop the latest high-performance tech tailored for your lifestyle at AVIORÈ."}
                </p>

                <button className="group flex items-center gap-6 px-8 py-4 rounded-full border border-zinc-200 hover:border-zinc-900 transition-all text-sm font-bold uppercase tracking-widest">
                  View more
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: IMAGE & FLOATING CARD */}
          <div className="lg:col-span-5 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.8 }}
                className="relative aspect-square flex items-center justify-center"
              >
                {/* Floating Detail Card */}
                <motion.div 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute left-0 bottom-12 md:-left-12 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-white/40 z-30 min-w-[240px]"
                >
                  <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-[0.2em] mb-2 block">
                    Product Highlight
                  </span>
                  <h4 className="font-bold text-zinc-900 text-lg mb-4">
                    {activeSlide.title}
                  </h4>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-zinc-900">{activeSlide.price || '$125.00'}</span>
                    <span className="text-zinc-400 line-through text-sm">{activeSlide.originalPrice || '$250.00'}</span>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-tighter cursor-pointer group">
                    View more <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    <div className="ml-auto w-12 h-[1px] bg-zinc-200 group-hover:bg-zinc-900 transition-colors" />
                  </div>
                </motion.div>

                {/* Main Product Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`}
                    alt={activeSlide.title}
                    fill
                    className="object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.12)]"
                    priority
                  />
                </div>

                {/* Decorative 50% Badge from Image */}
                <div className="absolute top-10 right-10 w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center text-white font-black text-xs">
                  50%
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </Container>
    </section>
  );
}