'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { api } from '@/src/lib/axios';
import { Loader2, BadgeCheck } from 'lucide-react';

interface Brand {
  id: string;
  storeName: string;
  logoUrl?: string;
  isVerified: boolean;
}

export function FeaturedBrandsSection() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Fetching real vendor data from your backend registry
        const { data } = await api.get('/vendor', { 
          params: { isVerified: true, limit: 6 } 
        });
        setBrands(data.data || []);
      } catch (error) {
        console.error("FAILED_TO_LOAD_BRANDS:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <section className="py-24 bg-[#FDFCFB] border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center mb-16 text-center space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A4143D]">
            Global_Partners
          </span>
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
            Featured Brands
          </h2>
          <div className="w-12 h-1 bg-[#A4143D] rounded-full mt-4" />
        </div>

        {/* BRANDS GRID */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-200" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 lg:gap-8">
            {brands.map((brand, idx) => (
              <motion.div 
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center gap-6 cursor-pointer"
              >
                {/* BRAND NODE */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[#A4143D]/20 group-hover:scale-110 transition-all duration-500" />
                  
                  <div className="w-full h-full rounded-full bg-white border border-gray-100 p-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#A4143D]/10 overflow-hidden relative z-10">
                    <Image 
                      src={brand.logoUrl || "/placeholder-logo.png"} 
                      alt={brand.storeName} 
                      width={100} 
                      height={100} 
                      className="w-full h-full object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100"
                    />
                  </div>
                </div>

                {/* BRAND LABEL */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#A4143D] transition-colors">
                      {brand.storeName}
                    </span>
                    {brand.isVerified && (
                      <BadgeCheck size={12} className="text-blue-500" />
                    )}
                  </div>
                  <span className="text-[8px] font-bold text-gray-300 uppercase italic opacity-0 group-hover:opacity-100 transition-opacity">
                    Verified_Partner
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}