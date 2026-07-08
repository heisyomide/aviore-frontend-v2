'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';

export function FeaturedBrandsSection() {
  return (
    <section className="py-20 bg-[#FDFCFB] border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center mb-12 text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A4143D]">
           Global_Partners
          </span>
          <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
            Partner Companies
          </h2>
          <div className="w-12 h-1 bg-[#A4143D] rounded-full mt-3" />
        </div>

        {/* SINGLE PARTNER POSITIONING */}
        <div className="flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="group flex flex-col items-center gap-5 cursor-pointer max-w-xs"
          >
            {/* BRAND LOGO NODE */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Animated outer ring effect on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[#A4143D]/20 group-hover:scale-110 transition-all duration-500" />
              
              <div className="w-full h-full rounded-full bg-white border border-gray-100 p-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#A4143D]/10 overflow-hidden relative z-10">
                <Image 
                  src="/icons/icon-193.jpeg" // Pointed to your primary system logo workspace framework asset
                  alt="Aviorè Go" 
                  width={120} 
                  height={120} 
                  className="w-full h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-105"
                />
              </div>
            </div>

            {/* BRAND LABEL DETAILS */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-gray-500 group-hover:text-[#A4143D] transition-colors">
                  Aviorè Go
                </span>
                <BadgeCheck size={13} className="text-blue-500 fill-blue-500/10" />
              </div>
              <span className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-widest block pt-0.5">
                In Partnership With
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}