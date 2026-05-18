'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, ArrowRight, ShieldCheck, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface PopularVendorsProps {
  initialVendors?: any[];
}

export function PopularVendorsSection({ initialVendors = [] }: PopularVendorsProps) {
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>(initialVendors);
  const [loading, setLoading] = useState(vendors.length === 0);

  useEffect(() => {
    if (vendors.length === 0) {
      const fetchVendors = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.get(`${API_URL}/storefront/vendors`);
          const data = Array.isArray(response.data) ? response.data : [];
          setVendors(data.slice(0, 8)); // Top curated retail houses
        } catch (err) {
          console.error("Registry_Sync_Error", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVendors();
    }
  }, [vendors.length]);

  // Duplicate payload to guarantee a seamless, seamless gapless wrap loop
  const doubleVendors = useMemo(() => [...vendors, ...vendors], [vendors]);

  if (loading) return <LoadingBannerSkeleton />;

  return (
    <div className="w-full bg-slate-950 border-y border-white/5 py-12 overflow-hidden relative flex flex-col justify-center select-none group">
      
      {/* 🔥 THE HIGH-CONTRASS LUSTROUS BACKGROUND FLARE */}
      <div className="absolute inset-0 opacity-100 pointer-events-none z-0">
        {/* Subtle upper light leaking edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#A4143D]/50 to-transparent" />
        {/* Deep atmospheric radial background glow */}
        <div className="absolute left-[35%] top-[50%] -translate-y-1/2 w-[600px] h-[250px] bg-gradient-to-r from-[#A4143D]/10 via-[#A4143D]/20 to-transparent rounded-full blur-[120px]" />
        {/* Secondary micro light balance flare */}
        <div className="absolute right-[-10%] bottom-0 w-80 h-80 bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Cinematic Depth Vignettes to hide border hard clipping edges */}
      <div className="absolute top-0 bottom-0 left-0 w-40 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-40 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />

      {/* HEADER MATRIX TRACK */}
      <div className="w-full max-w-[95%] mx-auto flex items-center justify-between mb-8 px-8 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#A4143D] animate-ping" />
          <span className="text-[10px] font-black tracking-[0.35em] text-slate-200 uppercase flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#A4143D]" /> AVIORÈ Verified Vendors
          </span>
        </div>
        
        <button 
          onClick={() => router.push('/vendors')}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-2 group/btn"
        >
          <span>SEE ALL VENDORS</span> 
          <ArrowRight size={12} className="text-[#A4143D] group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 🚀 RUNWAY MOTION FRAME ENGINES */}
      <div className="w-full relative z-10 flex items-center">
        <motion.div 
          className="flex items-center gap-8 whitespace-nowrap shrink-0 will-change-transform py-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          whileHover={{ transitionDuration: "80s" }} // Slows down perfectly when browsing/hovering
        >
          {doubleVendors.map((vendor, index) => (
            <div key={`${vendor.id}-${index}`} className="flex items-center gap-8 shrink-0">
              
              {/* 🏎️ HORIZONTAL VENDOR STRIP PILL */}
              <div 
                onClick={() => router.push(`/vendors/${vendor.slug || vendor.id}`)}
                className="flex items-center gap-5 bg-white/[0.01] backdrop-blur-sm border border-white/5 hover:border-white/20 px-8 py-5 rounded-[2rem] cursor-pointer shrink-0 transition-all duration-300 hover:bg-white/[0.03] hover:shadow-[0_0_30px_rgba(164,20,61,0.05)] group/card"
              >
                {/* Amplified Brand Icon Grid */}
                <div className="relative w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 group-hover/card:border-[#A4143D]/60 transition-colors shadow-xl">
                  {vendor.imageUrl ? (
                    <Image 
                      src={vendor.imageUrl.startsWith('http') ? vendor.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${vendor.imageUrl}`} 
                      alt={vendor.storeName} 
                      fill 
                      className="object-cover grayscale group-hover/card:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center relative w-full h-full">
                      <span className="text-sm font-black italic text-slate-500 group-hover/card:text-white transition-colors">
                        {vendor.storeName?.charAt(0).toUpperCase() || 'V'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Typography Content Field */}
                <div className="flex flex-col justify-center space-y-1.5">
                  <h3 className="font-black text-sm md:text-base text-slate-200 uppercase italic tracking-widest group-hover/card:text-white transition-colors">
                    {vendor.storeName}
                  </h3>
                  
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                      <Star size={8} fill="currentColor" className="text-amber-500" />
                      <span className="text-[9px] font-black text-amber-500">{vendor.rating || '4.9'}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      {vendor._count?.products || 0} Products
                    </span>
                  </div>
                </div>

                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center ml-2 opacity-0 group-hover/card:opacity-100 group-hover/card:bg-[#A4143D] text-slate-400 group-hover/card:text-white transition-all transform translate-x-[-4px] group-hover/card:translate-x-0">
                  <ArrowRight size={10} />
                </div>
              </div>

              {/* INTERMITTENT CONVERSION ANCHOR PILL (Injected seamlessly every 4 nodes) */}
              {index % 4 === 3 && (
                <div 
                  onClick={() => router.push('/become-a-vendor')}
                  className="flex items-center gap-5 bg-gradient-to-r from-[#A4143D]/20 to-[#A4143D]/5 hover:from-[#A4143D]/30 border border-dashed border-[#A4143D]/30 hover:border-[#A4143D]/60 px-8 py-5 rounded-[2rem] cursor-pointer transition-all duration-300 group/cta shrink-0 shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#A4143D] flex items-center justify-center shrink-0 shadow-md">
                    <Store size={20} className="text-white animate-pulse" />
                  </div>
                  
                  <div className="flex flex-col justify-center space-y-0.5">
                    <span className="text-[8px] font-black tracking-[0.25em] text-[#A4143D] uppercase bg-white/10 px-2 py-0.5 rounded w-max mb-0.5">
                      PARTNER GATEWAY
                    </span>
                    <h4 className="font-black text-sm md:text-base text-white uppercase italic tracking-widest leading-none">
                      Start selling on today
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                      Click to create your digital Storefront.
                    </p>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center ml-2 text-white group-hover/cta:bg-white group-hover/cta:text-black transition-all">
                    <ArrowRight size={10} className="group-hover/cta:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              )}

            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}

function LoadingBannerSkeleton() {
  return (
    <div className="w-full bg-slate-950 border-y border-white/5 py-14 flex items-center justify-center overflow-hidden">
      <div className="flex gap-10 animate-pulse w-full max-w-[90%] px-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex items-center gap-5 w-full bg-white/[0.01] px-8 py-6 rounded-[2rem] border border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 shrink-0" />
            <div className="space-y-2 w-full">
              <div className="h-4 bg-white/5 rounded-md w-36" />
              <div className="h-2 bg-white/5 rounded-md w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}