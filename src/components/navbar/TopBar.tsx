'use client';

import { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Zap, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADS = [
  { text: "FREE SHIPPING OVER ₦25,000", icon: Truck, color: "text-yellow-400", bg: "from-[#A4143D] to-[#600b24]" },
  { text: "FLASH SALE: 70% OFF ARTIFACTS", icon: Zap, color: "text-white", bg: "from-orange-600 to-red-600" },
  { text: "SECURE PAYMENTS & EASY RETURNS", icon: ShieldCheck, color: "text-emerald-300", bg: "from-emerald-900 to-black" },
  { text: "EASTER FESTIVAL WEEK: LIVE NOW!", icon: Star, color: "text-yellow-300", bg: "from-blue-600 to-indigo-900" },
];

export function TopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ADS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative h-11 md:h-12 overflow-hidden flex items-center transition-all duration-700 bg-gradient-to-r ${ADS[index].bg}`}>
      
      {/* 🚀 THE BACKGROUND SHIMMER (Billboard Shine) */}
      <motion.div 
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-10"
      />

      <div className="container mx-auto px-4 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 40, opacity: 0, scale: 0.5, rotateX: -90 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ y: -40, opacity: 0, scale: 1.5, rotateX: 90, filter: "blur(10px)" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15,
              duration: 0.5 
            }}
            className="flex justify-center items-center gap-4 cursor-pointer"
          >
            {/* 💥 THE ICON: Pulsing & Bouncing */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            >
              {(() => {
                const Icon = ADS[index].icon;
                return <Icon size={20} className={ADS[index].color} />;
              })()}
            </motion.div>

            {/* 💥 THE TEXT: Heavy, Italic, Lagos-Style Ad */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] md:text-[14px] font-black italic uppercase tracking-tighter text-white drop-shadow-lg flex items-center gap-2">
                {ADS[index].text}
                <motion.span
                   animate={{ x: [0, 5, 0] }}
                   transition={{ repeat: Infinity, duration: 1 }}
                >
                  <ArrowRight size={14} className="text-white" />
                </motion.span>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 🚀 THE DIGITAL OVERLAY (Scanlines) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}