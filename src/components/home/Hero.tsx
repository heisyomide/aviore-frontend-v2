'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../layout/Container";
import { Zap, Star, ArrowUpRight, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/registry/categories/hero.jpg",
    tag: "Marketplace Hub",
    title: "Artifacts",
    discount: "70% OFF",
    color: "bg-orange-500",
    accent: "text-orange-600"
  },
  {
    id: 2,
    image: "/registry/categories/arrivals.jpg",
    tag: "New Arrivals",
    title: "Exclusive",
    discount: "Fresh In",
    color: "bg-blue-600",
    accent: "text-blue-600"
  }
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const activeSlide = slides[current] || slides[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#f8f8f8] py-4 md:py-10 overflow-hidden select-none">
      <Container>
        {/* MOBILE: flex + overflow-x-auto for horizontal sliding
            DESKTOP: grid + lg:overflow-visible to keep your original layout
        */}
        <div className="flex lg:grid lg:grid-cols-12 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide pb-6 lg:pb-0 lg:h-[520px]">

          {/* 🔥 MAIN KINETIC STAGE */}
          <div className="min-w-[90vw] lg:min-w-0 lg:col-span-8 relative rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border border-gray-100 group snap-center h-[480px] lg:h-full">
            <AnimatePresence mode="wait">
              <motion.div 
                key={current} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex"
              >
                {/* LEFT: INFORMATION HUB */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center z-20">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mb-6"
                  >
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-white shadow-lg ${activeSlide.color} tracking-widest`}>
                      {activeSlide.tag}
                    </span>
                  </motion.div>

                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tighter leading-[0.9] mb-4"
                  >
                    {activeSlide.title}
                  </motion.h2>

                  <motion.p 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-3xl md:text-5xl font-black mb-10 italic ${activeSlide.accent}`}
                  >
                    {activeSlide.discount}
                  </motion.p>

                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-fit flex items-center gap-4 bg-slate-900 text-white pl-8 pr-3 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl group/btn"
                  >
                    Shop Collection 
                    <div className="bg-white/10 p-2 rounded-lg group-hover/btn:bg-white/20 transition-colors">
                      <ArrowRight size={18} />
                    </div>
                  </motion.button>
                </div>

                {/* RIGHT: FLOATING PRODUCT ENGINE (Only visible on MD+) */}
                <div className="hidden md:block w-1/2 relative h-full bg-gradient-to-br from-transparent to-gray-50/50">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0, rotate: 15, x: 100 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0, x: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    className="absolute inset-0 z-10 flex items-center justify-center"
                  >
                    <div className="relative w-4/5 h-4/5">
                      <Image 
                        src={activeSlide.image} 
                        alt={activeSlide.title} 
                        fill 
                        className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]" 
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 90, 180, 270, 360],
                      opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-[40px] border-gray-100 rounded-full`}
                  />
                </div>

                <div className={`absolute inset-0 opacity-5 ${activeSlide.color} transition-colors duration-1000`} />
              </motion.div>
            </AnimatePresence>

            {/* PROGRESS TRACKER */}
            <div className="absolute bottom-8 left-10 md:left-16 flex gap-4 z-30">
              {slides.map((_, i) => (
                <div key={i} className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                  {i === current && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className={`h-full ${activeSlide.color}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ⚡ THE SIDE DEALS (Horizontal on Mobile, Stacked on Desktop) */}
          <div className="flex lg:grid lg:col-span-4 lg:flex-col gap-6">
            
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              className="min-w-[80vw] lg:min-w-0 relative flex-1 rounded-[2rem] overflow-hidden group bg-orange-500 shadow-xl border border-orange-400 p-8 flex flex-col justify-between snap-center h-[480px] lg:h-auto"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-white font-black text-[11px] uppercase tracking-widest bg-black/20 w-fit px-3 py-1 rounded-md">
                  <Zap size={14} fill="white" /> Flash Sale
                </div>
                <h3 className="text-white text-4xl font-[1000] tracking-tighter italic leading-none">70% OFF</h3>
                <p className="text-white/80 text-xs font-bold mt-2">Ends in 04:59:59</p>
              </div>
              <div className="self-end w-32 h-32 lg:w-28 lg:h-28 relative rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <Image src="/registry/categories/side1.jpeg" alt="" fill className="object-cover rounded-2xl shadow-2xl" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              className="min-w-[80vw] lg:min-w-0 relative flex-1 rounded-[2rem] overflow-hidden group bg-white shadow-xl border border-gray-100 p-8 flex flex-col justify-between snap-center h-[480px] lg:h-auto"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-blue-600 font-black text-[11px] uppercase tracking-widest bg-blue-50 w-fit px-3 py-1 rounded-md">
                  <Star size={14} fill="currentColor" /> Just In
                </div>
                <h3 className="text-slate-900 text-4xl font-[1000] tracking-tighter italic leading-none">NEW DROPS</h3>
              </div>
              <div className="self-end w-32 h-32 lg:w-28 lg:h-28 relative -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <Image src="/registry/categories/arrivals.jpg" alt="" fill className="object-cover rounded-2xl shadow-2xl" />
              </div>
              <ArrowUpRight size={40} className="absolute top-6 right-6 text-gray-100" />
            </motion.div>

          </div>
        </div>
      </Container>
    </section>
  );
}