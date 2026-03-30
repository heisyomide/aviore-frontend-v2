'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';

interface PopularVendorsProps {
  initialVendors?: any[];
}

export function PopularVendorsSection({ initialVendors = [] }: PopularVendorsProps) {
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>(initialVendors);
  const [loading, setLoading] = useState(vendors.length === 0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (vendors.length === 0) {
      const fetchVendors = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.get(`${API_URL}/storefront/vendors`);
          // Ensure we only take vendors that actually have slugs
          const activeVendors = response.data.filter((v: any) => v.slug).slice(0, 7);
          setVendors(activeVendors);
          setError(false);
        } catch (err) {
          console.error("Registry_Sync_Error", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchVendors();
    }
  }, [vendors.length]);

  return (
    <Section className="!py-20 bg-white">
      <Container>
        {/* HEADER NODES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-zinc-50 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Verified_Registry_Partners</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
              Popular <span className="text-zinc-300">Vendors</span>
            </h2>
          </div>
          
          <button 
            onClick={() => router.push('/vendors')}
            className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-all"
          >
            <span>View All Nodes</span>
            <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm">
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* VENDOR GRID */}
        <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory pb-6">
          
          {loading && Array(4).fill(0).map((_, i) => (
            <div key={i} className="min-w-[300px] md:min-w-0 h-32 bg-zinc-50 animate-pulse rounded-[3rem] border border-zinc-100 flex items-center justify-center">
              <Loader2 className="animate-spin text-zinc-200" />
            </div>
          ))}

          {!loading && !error && vendors.map((vendor: any) => (
            <div 
              key={vendor.id} 
              /* 🚀 THE CRITICAL FIX: Passing slug instead of ID */
              onClick={() => router.push(`/vendors/${vendor.slug}`)}
              className="min-w-[300px] md:min-w-0 snap-center group cursor-pointer bg-white p-7 rounded-[3rem] border border-zinc-100 flex items-center gap-6 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-blue-100 transition-all duration-500 active:scale-95"
            >
              <div className="relative w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                {vendor.imageUrl ? (
                    <Image 
                        src={vendor.imageUrl.startsWith('http') 
                        ? vendor.imageUrl 
                        : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${vendor.imageUrl}`} 
                        alt={vendor.storeName} 
                        fill 
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    />
                ) : (
                    <div className="text-zinc-200 font-black text-2xl uppercase italic">{vendor.storeName.charAt(0)}</div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-[15px] text-zinc-900 uppercase italic tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                  {vendor.storeName}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-black text-zinc-900 leading-none pt-0.5">4.9</span>
                  </div>
                  <span className="text-zinc-200">|</span>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none pt-0.5">
                    {vendor._count?.products || 0} Artifacts
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* BECOME A VENDOR CTA */}
          <div 
            onClick={() => router.push('/become-a-vendor')}
            className="min-w-[300px] md:min-w-0 snap-center group cursor-pointer bg-zinc-900 p-8 rounded-[3rem] text-white flex flex-col justify-center relative overflow-hidden shadow-2xl active:scale-95 transition-all"
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-[1.1]">
                Become <br/> <span className="text-blue-500 italic">Registry_Partner</span>
              </h3>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em]">
                <span className="border-b border-white/20 pb-1 group-hover:border-blue-500 transition-colors">Apply_Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}