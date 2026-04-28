'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { ArrowRight, ChevronRight, Star } from 'lucide-react';

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
        setSlides(data);
      } catch (err) {
        console.error("AVIORÈ Hero Error:", err);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % VENDOR_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  if (!slides.length) return null;
  const activeSlide = slides[current];

  return (
    <section className="relative bg-[#F9F9F9] overflow-hidden">
      <Container>
        <div className="relative grid lg:grid-cols-12 gap-8 items-center py-10 md:py-20">
          
          {/* LEFT CONTENT AREA */}
          <div className="z-20 lg:col-span-7 space-y-6 md:space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-900 leading-tight uppercase tracking-tighter">
                  {activeSlide.title}
                </h1>
                
                <p className="text-zinc-500 text-sm md:text-lg max-w-md mt-4 leading-relaxed">
                  {activeSlide.subtitle}
                </p>

                <button className="mt-8 px-8 py-3 rounded-md border border-zinc-900 text-zinc-900 text-xs font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all">
                  View more
                </button>

                {/* MOBILE PRODUCT CARD (The white box from your reference) */}
                <div className="mt-12 bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-zinc-100 max-w-[280px] relative">
                   <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                     Featured Item
                   </span>
                   <h3 className="font-bold text-zinc-900 mt-1 text-sm">
                     {activeSlide.tag}
                   </h3>
                   <div className="flex gap-1 mt-2">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={10} className="fill-orange-400 text-orange-400" />
                     ))}
                     <span className="text-[9px] text-zinc-400 ml-1">1245 reviews</span>
                   </div>
                   <div className="mt-4 flex items-baseline gap-2">
                     <span className="text-lg font-black text-zinc-900">₦9000.00</span>
                     <span className="text-xs text-zinc-400 line-through">₦60000.00</span>
                   </div>
                   <div className="mt-4 flex items-center text-[10px] font-bold uppercase cursor-pointer group">
                     View more <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT IMAGE AREA (Floats on mobile, Grid on desktop) */}
          <div className="absolute top-10 -right-10 md:relative md:top-0 md:right-0 lg:col-span-5 h-[300px] md:h-[500px] w-[250px] md:w-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="relative w-full h-full"
              >
                {/* Brand Accent Circle */}
                <div className={`absolute top-0 right-10 w-16 h-16 rounded-full ${activeSlide.bgColor} flex items-center justify-center text-white font-bold text-xs shadow-lg z-10`}>
                  {activeSlide.discount}
                </div>

<Image
  src={activeSlide.imageUrl.startsWith('http') 
    ? activeSlide.imageUrl 
    : `${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`
  }
  alt={activeSlide.title}
  fill
  className="object-contain drop-shadow-2xl z-0"
  priority
  // unoptimized={true} // Only keep this if your backend lacks an image optimizer
/>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </Container>
    </section>
  );
}