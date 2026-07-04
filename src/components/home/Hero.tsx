'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { ArrowRight, PhoneCall, Store, ChevronLeft, ChevronRight, Percent, Users, Truck } from 'lucide-react';
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

// Complete structured database mapping matching the user's category trees
const categoriesData = [
  {
    name: 'Fashion',
    slug: 'fashion',
    children: [
      { name: 'Women Fashion', slug: 'women-fashion' },
      { name: 'Men Fashion', slug: 'men-fashion' },
      { name: 'Footwear', slug: 'footwear' },
      { name: 'Bags', slug: 'bags' },
      { name: 'Watches & Jewelry', slug: 'watches-jewelry' },
      { name: 'Wigs & Hair', slug: 'wigs-hair' },
    ],
  },
  {
    name: 'Beauty & Skincare',
    slug: 'beauty-skincare',
    children: [
      { name: 'Skincare', slug: 'skincare' },
      { name: 'Makeup', slug: 'makeup' },
      { name: 'Fragrances', slug: 'fragrances' },
      { name: 'Haircare', slug: 'haircare' },
    ],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    children: [],
  },
];

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
    <section className="bg-[#F4F4F6] py-3 md:py-6 text-zinc-900 overflow-hidden">
      <Container>
        
        {/* =================================================================
            1. MOBILE LAYOUT: HORIZONTAL SNAP SLIDER (As shown in 20260704-0354-42.0316205.mp4)
            ================================================================= */}
        <div className="flex lg:hidden w-full gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Slide Node A: Main Promotional Banner Card */}
          <div className="min-w-[88vw] sm:min-w-[75vw] snap-start bg-white rounded-xl overflow-hidden h-[240px] relative border border-zinc-200 shadow-xs shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: activeSlide.bgColor || '#FDFBF9' }}
              >
                <Link href="/shop" className="relative block w-full h-full">
                  <Image
                    src={activeSlide.imageUrl.startsWith('http') ? activeSlide.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                  />
                  {activeSlide.title && (
                    <div className="absolute left-4 bottom-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-white/60 space-y-0.5">
                      <h2 className="text-xs font-black tracking-tight text-zinc-900 line-clamp-1">{activeSlide.title}</h2>
                      <p className="text-[10px] text-zinc-500 line-clamp-1">{activeSlide.subtitle}</p>
                    </div>
                  )}
                </Link>
              </motion.div>
            </AnimatePresence>
            {/* Dots */}
            <div className="absolute top-3 right-3 flex gap-1 bg-black/30 px-2 py-1 rounded-full z-20">
              {slides.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${current === i ? 'w-3 bg-white' : 'w-1 bg-white/50'}`} />
              ))}
            </div>
          </div>

          {/* Slide Node B: Call To Action Grid Group */}
          <div className="min-w-[75vw] snap-start flex flex-col gap-2 shrink-0 h-[240px]">
            <div className="flex-1 bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <PhoneCall size={14} />
              </div>
              <div>
                <h4 className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">Order Hotline</h4>
                <p className="text-xs font-black text-zinc-800">02018883300</p>
              </div>
            </div>

            <Link href="/become-a-vendor" className="flex-1 bg-white border border-zinc-200 rounded-xl p-3 flex items-center gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Store size={14} />
              </div>
              <div>
                <h4 className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">Sell on Aviorè</h4>
                <p className="text-xs font-bold text-zinc-800">Open Merchant Account</p>
              </div>
            </Link>
          </div>

          {/* Slide Node C: Join Avio IO Marketing Team Campaign Card */}
          <div className="min-w-[75vw] snap-start bg-gradient-to-br from-[#092c5c] to-[#04152d] rounded-xl p-4 text-white flex flex-col justify-between shadow-xs shrink-0 h-[240px]">
            <div>
              <span className="text-[8px] font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded uppercase">Growth Hub</span>
              <h3 className="text-sm font-black tracking-tight mt-2.5 leading-snug">
                Do you want to join <br />Aviorè IO Marketing Team?
              </h3>
              <p className="text-[10px] text-slate-300 mt-1">Earn rewards promoting verified products.</p>
            </div>
            <Link href="/Team_io" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-950 px-3 py-2 rounded-md w-max">
              <span>Join Aviorè IO Team</span>
              <Users size={12} />
            </Link>
          </div>

          {/* Slide Node D: Logistics System Redirect Card */}
          <a 
            href="https://logistics.aviore.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="min-w-[75vw] snap-start bg-gradient-to-br from-[#A4143D] to-[#7a0f2e] rounded-xl p-4 text-white flex flex-col justify-between shadow-xs shrink-0 h-[240px]"
          >
            <div>
              <span className="text-[8px] font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded uppercase">Aviorè Delivery</span>
              <h3 className="text-sm font-black tracking-tight mt-2.5 leading-snug">
                Free Shipping & <br />Guaranteed Logistics
              </h3>
              <p className="text-[10px] text-rose-200 mt-1">Track packages globally across our fleet network.</p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-950 px-3 py-2 rounded-md w-max">
              <span>Go to Logistics Website</span>
              <Truck size={12} />
            </div>
          </a>

        </div>

        {/* =================================================================
            2. DESKTOP INTERFACE: 3-COLUMN INTEGRATED ECOSYSTEM GRID
            ================================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-start">
          
          {/* COLUMN 1: SIDEBAR INTERACTIVE VERTICAL CATEGORY SYSTEM */}
          <div className="col-span-3 bg-white rounded-xl border border-zinc-200 p-3 h-[440px] shadow-xs overflow-y-auto">
            <h3 className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 px-2 mb-2">Market Categories</h3>
            <div className="flex flex-col text-xs font-semibold text-zinc-700 space-y-0.5">
              {categoriesData.map((parent, pIdx) => (
                <div key={pIdx} className="group/item relative">
                  <Link 
                    href={`/shop?category=${parent.slug}`} 
                    className="px-2.5 py-2 hover:bg-zinc-50 hover:text-[#A4143D] rounded-lg transition-all flex items-center justify-between"
                  >
                    <span>{parent.name}</span>
                    <ChevronRight size={12} className="text-zinc-400 group-hover/item:translate-x-0.5 transition-transform" />
                  </Link>

                  {/* Flyout Sub-menu container for child segments */}
                  {parent.children.length > 0 && (
                    <div className="absolute left-full top-0 ml-1 bg-white border border-zinc-200 p-2 rounded-xl shadow-md w-52 invisible group-hover/item:visible z-30 space-y-0.5">
                      {parent.children.map((child, cIdx) => (
                        <Link 
                          key={cIdx} 
                          href={`/shop?category=${parent.slug}&sub=${child.slug}`}
                          className="block px-3 py-1.5 hover:bg-zinc-50 text-zinc-600 hover:text-[#A4143D] text-[11px] rounded-md"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: CENTER PROMOTIONAL INTERACTIVE BANNER SLIDER */}
          <div className="col-span-6 relative bg-white rounded-xl overflow-hidden h-[440px] shadow-xs border border-zinc-200 group">
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
                <Link href="/shop" className="relative block w-full h-full">
                  <Image
                    src={activeSlide.imageUrl.startsWith('http') ? activeSlide.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${activeSlide.imageUrl}`}
                    alt={activeSlide.title || "Banner"}
                    fill
                    className="object-contain"
                    priority
                  />
                  
                  {activeSlide.title && (
                    <div className="absolute left-8 bottom-8 max-w-sm bg-white/90 backdrop-blur-md p-5 rounded-xl border border-white/60 space-y-1.5 shadow-lg">
                      {activeSlide.discount && (
                        <span className="inline-flex items-center gap-1 bg-[#A4143D] text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          <Percent size={10} /> {activeSlide.discount} OFF
                        </span>
                      )}
                      <h2 className="text-xl font-black tracking-tight text-zinc-900 leading-tight">{activeSlide.title}</h2>
                      <p className="text-xs text-zinc-500 line-clamp-2">{activeSlide.subtitle}</p>
                    </div>
                  )}
                </Link>
              </motion.div>
            </AnimatePresence>

            <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 z-20 cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 z-20 cursor-pointer">
              <ChevronRight size={18} />
            </button>

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

          {/* COLUMN 3: RIGHT UTILITY CAMPAIGN PLATFORM RAMP MODULES */}
          <div className="col-span-3 flex flex-col gap-3 h-[440px]">
            
            <div className="bg-white border border-zinc-200 rounded-xl p-3.5 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <PhoneCall size={16} />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Order Hotline</h4>
                <p className="text-xs font-black text-zinc-800">02018883300</p>
              </div>
            </div>

            <Link href="/become-a-vendor" className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl p-3.5 flex items-center gap-3 shadow-xs transition-all group">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Store size={16} />
              </div>
              <div className="grow">
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">Sell on Aviorè</h4>
                <p className="text-xs font-bold text-zinc-800 group-hover:text-[#A4143D] transition-colors">Merchant Portal</p>
              </div>
              <ChevronRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Campaign Layer 1: Marketing Recruitment Hub */}
            <div className="bg-gradient-to-br from-[#092c5c] to-[#051a37] text-white p-4 rounded-xl flex flex-col justify-between shadow-xs relative overflow-hidden flex-1">
              <div>
                <span className="text-[8px] font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded uppercase">Growth Engine</span>
                <h3 className="text-xs font-black tracking-tight mt-2 leading-tight">
                  Do you want to join <br />Aviorè IO marketing team?
                </h3>
              </div>
              <Link href="/Team_io" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-white text-zinc-950 px-3 py-1.5 rounded-md w-max transition-transform hover:scale-[1.02]">
                <span>Join Aviorè IO Team</span>
                <ArrowRight size={10} />
              </Link>
            </div>

            {/* Campaign Layer 2: External Logistics Service Router */}
            <a 
              href="https://logistics.aviore.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-[#A4143D] to-[#7c0f2e] text-white p-4 rounded-xl flex flex-col justify-between shadow-xs relative overflow-hidden flex-1 group"
            >
              <div>
                <span className="text-[8px] font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded uppercase">Fulfillment</span>
                <h3 className="text-xs font-black tracking-tight mt-2 leading-tight">
                  Free Shipping & <br />Guaranteed Delivery
                </h3>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-white text-zinc-950 px-3 py-1.5 rounded-md w-max">
                <span>Go to Logistics Website</span>
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>

          </div>

        </div>
      </Container>
    </section>
  );
}