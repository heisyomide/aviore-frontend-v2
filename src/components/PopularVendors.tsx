'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Store, ArrowRight, ShieldCheck } from 'lucide-react';

// FIX: Define the interface to clear the "Property does not exist" error
interface PopularVendorsProps {
  initialVendors?: any[]; // The '?' makes it safe even if data is missing
}

export function PopularVendorsSection({ initialVendors = [] }: PopularVendorsProps) {
  const router = useRouter();

  // If initialVendors is empty, we can still show the CTA card at minimum
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
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
            <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
              <ArrowRight size={14} />
            </div>
          </button>
        </div>

        {/* VENDOR GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {initialVendors.slice(0, 3).map((vendor: any) => (
            <div 
              key={vendor.id} 
              onClick={() => router.push(`/vendors/${vendor.id}`)}
              className="group cursor-pointer bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100 flex items-center gap-5 hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500"
            >
              {/* STORE LOGO */}
              <div className="relative w-16 h-16 rounded-2xl bg-white border border-zinc-100 overflow-hidden shrink-0 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                {vendor.imageUrl ? (
                  <Image 
                    src={vendor.imageUrl.startsWith('http') 
                      ? vendor.imageUrl 
                      : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${vendor.imageUrl}`
                    } 
                    alt={vendor.storeName} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <Store className="text-zinc-200" size={24} />
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-black text-zinc-900 uppercase italic tracking-tighter leading-none group-hover:text-[#A4143D] transition-colors">
                  {vendor.storeName}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-bold text-zinc-900">4.9</span>
                  </div>
                  <span className="text-zinc-300">•</span>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {vendor._count?.products || 0} Artifacts
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* BECOME A VENDOR CTA - Always visible as the 4th card */}
          <div 
            onClick={() => router.push('/become-a-vendor')}
            className="group cursor-pointer bg-zinc-950 p-6 rounded-[2rem] text-white flex flex-col justify-center relative overflow-hidden shadow-xl"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#A4143D]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-1 relative z-10">
              Become <span className="text-[#A4143D]">Vendor</span>
            </h3>
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4 relative z-10">
              Join the elite registry.
            </p>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] relative z-10">
              <span>Start_Selling</span>
              <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}