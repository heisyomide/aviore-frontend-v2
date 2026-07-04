'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { ArrowRight, PhoneCall, ShoppingBag, Store, ChevronLeft, ChevronRight, Percent } from 'lucide-react';
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

  // Auto-play slider configuration
  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) return null;
  const activeSlide = slides[current];

  const handleNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="bg-[#F4F4F6] py-4 md:py-6 text-zinc-900 font-sans">
      <Container>
        {/* =================================================================
            MARKETPLACE THREE-COLUMN HUB GRID
            ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* COLUMN 1: LEFT CATEGORY LINKS MENU (Optional/Placeholder Hidden on mobile) */}
          <div className="hidden xl:block xl:col-span-3 bg-white rounded-xl border border-zinc-200/80 p-3 h-[420px] shadow-sm">
            <h3 className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 px-3 mb-2">Top Categories</h3>
            <div className="flex flex-col text-xs font-medium text-zinc-700 space-y-0.5">
              {['Supermarket', 'Phones & Tablets', 'Electronics', 'Computing', 'Fashion', 'Home & Office', 'Appliances'].map((cat, idx) => (
                <Link key={idx} href={`/shop?category=${cat.toLowerCase()}`} className="px-3 py-2 hover:bg-zinc-50 hover:text-[#A4143D] rounded-lg transition-all flex items-center justify-between">
                  <span>{cat}</span>
                  <ChevronRight size={12} className="text-zinc-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 2: MAIN DYNAMIC CAROUSEL SLIDER BANNER (Centerpiece) */}
          <div className="col-span-1 lg:col-span-9 xl:col-span-6 relative bg-white rounded-xl overflow-hidden h-[320px] sm:h-[420px] shadow-sm border border-zinc-200/60 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: activeSlide.bgColor || '#FDFBF9' }}
              >
                {/* Clickable Banner Wrap */}
                <Link href="/shop" className="relative block w-full h-full">
                  <Image
                    src={activeSlide.imageUrl.startsWith('http') 
                      ? activeSlide.imageUrl 
                      : `${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`
                    }
                    alt={activeSlide.title || "Promotional Banner"}
                    fill
                    className="object-cover object-center lg:object-contain"
                    priority
                  />
                  
                  {/* Absolute text fallback layer overlay for dynamic banners */}
                  {activeSlide.title && (
                    <div className="absolute left-6 bottom-6 sm:left-12 sm:bottom-12 max-w-xs sm:max-w-md bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-white/60 space-y-1 sm:space-y-2 pointer-events-none">
                      {activeSlide.discount && (
                        <span className="inline-flex items-center gap-1 bg-[#A4143D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          <Percent size={10} /> {activeSlide.discount} OFF
                        </span>
                      )}
                      <h2 className="text-base sm:text-2xl font-black tracking-tight text-zinc-900 leading-tight">
                        {activeSlide.title}
                      </h2>
                      <p className="text-xs text-zinc-500 line-clamp-2">
                        {activeSlide.subtitle}
                      </p>
                    </div>
                  )}
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Slider Pagination Controls */}
            <button 
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-20 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-20 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>

            {/* Carousel Index Indicator Dots */}
            <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${current === index ? 'w-5 bg-[#A4143D]' : 'w-1.5 bg-zinc-300'}`}
                />
              ))}
            </div>
          </div>

          {/* COLUMN 3: RIGHT-SIDE UTILITY & FLASH ACCESS CARDS (Jumia Style) */}
          <div className="col-span-1 lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:h-[420px]">
            
            {/* Utility Node A: Call-to-Order Support */}
            <div className="flex-1 bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <PhoneCall size={18} />
              </div>
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Order Hotline</h4>
                <p className="text-xs font-bold text-zinc-800 mt-0.5">02018883300</p>
                <span className="text-[10px] text-zinc-400 font-medium">8AM - 8PM Daily</span>
              </div>
            </div>

            {/* Utility Node B: Merchant Conversion Panel */}
            <Link href="/register" className="flex-1 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl p-4 flex items-center gap-3.5 shadow-xs transition-all group">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Store size={18} />
              </div>
              <div className="grow">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">Sell on Aviorè</h4>
                <p className="text-xs font-bold text-zinc-800 mt-0.5 group-hover:text-[#A4143D] transition-colors">Open Merchant Account</p>
                <span className="text-[10px] text-zinc-400 font-medium">Reach millions of buyers</span>
              </div>
              <ChevronRight size={14} className="text-zinc-400 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* Utility Node C: Bold Commercial Campaign Card */}
            <div className="flex-[2] bg-gradient-to-br from-[#A4143D] to-[#801030] rounded-xl p-5 text-white flex flex-col justify-between shadow-md relative overflow-hidden min-h-[140px] sm:min-h-0 lg:min-h-[175px]">
              {/* Background graphic motif */}
              <div className="absolute right-[-10px] bottom-[-10px] text-white/5 font-black text-7xl select-none uppercase tracking-tighter">SALE</div>
              
              <div>
                <span className="text-[9px] font-bold tracking-[0.25em] bg-white/20 px-2 py-0.5 rounded-md uppercase">Aviorè Express</span>
                <h3 className="text-base font-black tracking-tight mt-3 leading-tight">
                  Free Shipping & <br />Guaranteed Delivery
                </h3>
              </div>
              
              <Link href="/shop" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-white text-zinc-950 px-4 py-2.5 rounded-lg w-max transition-transform hover:scale-[1.02]">
                <span>Explore Deals</span>
                <ArrowRight size={12} />
              </Link>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}