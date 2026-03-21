'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Store, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';

interface PopularVendorsProps {
  initialVendors?: any[]; // For SSR support
}

export function PopularVendorsSection({ initialVendors = [] }: PopularVendorsProps) {
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>(initialVendors);
  const [loading, setLoading] = useState(vendors.length === 0);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Only fetch if we don't have initial data (Rule 15: Save bandwidth)
    if (vendors.length === 0) {
      const fetchVendors = async () => {
        try {
          // 🚀 Ensure your .env.local has NEXT_PUBLIC_API_URL=http://localhost:5000
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.get(`${API_URL}/storefront/vendors`);
        
          setVendors(response.data.slice(0, 3));
          setError(false);
        } catch (err) {
          console.error("Registry_Sync_Error: Network Connection Failed", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchVendors();
    }
  }, [vendors.length]);

  return (
    <Section className="!py-16">
      <Container>
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-zinc-50 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#A4143D]">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verified_Registry_Partners</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
              Popular <span className="text-zinc-400 font-medium">Vendors</span>
            </h2>
          </div>
          
          <button 
            onClick={() => router.push('/vendors')}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all"
          >
            <span>View All Partners</span>
            <div className="w-9 h-9 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm">
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

        {/* VENDOR GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 🚀 LOADING STATE - Rule 15 */}
          {loading && Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-zinc-50 animate-pulse rounded-[2.5rem] border border-zinc-100 flex items-center justify-center">
              <Loader2 className="animate-spin text-zinc-200" />
            </div>
          ))}

          {/* 🚀 DATA RENDER */}
          {!loading && !error && vendors.map((vendor: any) => (
            <div 
              key={vendor.id} 
              onClick={() => router.push(`/vendors/${vendor.id}`)}
              className="group cursor-pointer bg-zinc-50/50 p-6 rounded-[2.5rem] border border-zinc-100 flex items-center gap-5 hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500"
            >
              <div className="relative w-16 h-16 rounded-2xl bg-white border border-zinc-100 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                <Image 
                  src={vendor.imageUrl?.startsWith('http') 
                    ? vendor.imageUrl 
                    : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${vendor.imageUrl}`
                  } 
                  alt={vendor.storeName} 
                  fill 
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-black text-[13px] text-zinc-900 uppercase italic tracking-tighter leading-none group-hover:text-[#A4143D] transition-colors">
                  {vendor.storeName}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-black text-zinc-900">4.9</span>
                  </div>
                  <span className="text-zinc-300">/</span>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {vendor._count?.products || 0} Items
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* 🚀 ERROR FALLBACK - Rule 15 */}
          {error && (
            <div className="col-span-3 h-32 bg-red-50/30 border border-dashed border-red-100 rounded-[2.5rem] flex items-center justify-center text-red-400 text-[10px] font-black uppercase tracking-widest">
              Connection_Lost: Retrying_Registry_Sync...
            </div>
          )}

          {/* BECOME A VENDOR CTA */}
          <div 
            onClick={() => router.push('/become-a-vendor')}
            className="group cursor-pointer bg-[#111] p-7 rounded-[2.5rem] text-white flex flex-col justify-center relative overflow-hidden shadow-xl"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#A4143D]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1 leading-tight">
                Become <br/> <span className="text-[#A4143D]">Vendor</span>
              </h3>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
                Join the elite registry.
              </p>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="border-b border-white/20 pb-0.5 group-hover:border-[#A4143D] transition-colors">Apply_Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}