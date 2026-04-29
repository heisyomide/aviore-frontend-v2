'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, ArrowRight, ShieldCheck, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Container } from '../layout/Container';

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
          setVendors(data.slice(0, 7)); // Take 7 to fit the grid with the CTA
        } catch (err) {
          console.error("Registry_Sync_Error", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVendors();
    }
  }, [vendors.length]);

  const marqueeItems = useMemo(() => [...vendors, ...vendors], [vendors]);

  return (
    <div className="relative w-full bg-zinc-50/80 py-16 md:py-24 overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply [background-image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" />
      
      <Container className="relative z-10">
        <Header router={router} />

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="relative group">
            {/* MOBILE MARQUEE */}
            <div className="md:hidden">
              <motion.div 
                className="flex gap-4 pr-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 45, ease: "linear", repeat: Infinity }}
              >
                {marqueeItems.map((vendor, i) => (
                  <VendorCard key={`${vendor.id}-${i}`} vendor={vendor} />
                ))}
              </motion.div>
            </div>

            {/* DESKTOP GRID */}
            <div className="hidden md:grid md:grid-cols-4 gap-6">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
             
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

/* --- REFACTORED SUB-COMPONENTS --- */

function Header({ router }: { router: any }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-zinc-200/50 pb-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Verified_Registry_Partners</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Popular <span className="text-zinc-400 font-light">Vendors</span>
        </h2>
      </div>
      
      <button 
        onClick={() => router.push('/vendors')}
        className="group hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-all bg-white py-3 px-6 rounded-full shadow-sm border border-zinc-100"
      >
        <span>View All Partners</span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function VendorCard({ vendor }: { vendor: any }) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const logoUrl = useMemo(() => {
    if (!vendor?.imageUrl) return null;
    return vendor.imageUrl.startsWith('http') 
      ? vendor.imageUrl 
      : `${API_URL}/uploads/${vendor.imageUrl}`;
  }, [vendor.imageUrl, API_URL]);

  // Extract first letter for the luxury placeholder
  const initial = vendor.storeName?.charAt(0).toUpperCase() || 'V';

  return (
    <div 
      onClick={() => router.push(`/vendors/${vendor.slug || vendor.id}`)}
      className="min-w-[280px] md:min-w-0 group cursor-pointer bg-white p-6 rounded-[2.5rem] border border-zinc-200/50 flex items-center gap-5 hover:shadow-2xl hover:border-zinc-300 transition-all duration-500 transform md:hover:-translate-y-1"
    >
      <div className="relative w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0 flex items-center justify-center shadow-inner group-hover:border-[#A4143D]/20 transition-colors">
        {logoUrl ? (
          <Image 
            src={logoUrl} 
            alt={vendor.storeName} 
            fill 
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        ) : (
          /* PREMIUM PLACEHOLDER */
          <div className="flex flex-col items-center justify-center">
             <span className="text-2xl font-black italic text-zinc-200 group-hover:text-[#A4143D]/20 transition-colors">
               {initial}
             </span>
             <Store className="absolute text-zinc-100 group-hover:text-[#A4143D]/5 transition-colors" size={32} />
          </div>
        )}
      </div>

      <div className="space-y-1.5 flex-1">
        <h3 className="font-black text-[14px] text-zinc-900 uppercase italic tracking-tighter leading-none group-hover:text-[#A4143D] transition-colors line-clamp-1">
          {vendor.storeName}
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full">
            <Star size={8} fill="currentColor" />
            <span className="text-[9px] font-black text-amber-700">4.9</span>
          </div>
          <span className="text-zinc-200 text-[10px]">|</span>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
            {vendor._count?.products || 0} Products
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="min-w-[300px] h-36 bg-white animate-pulse rounded-[3rem] border border-zinc-200" />
      ))}
    </div>
  );
}

