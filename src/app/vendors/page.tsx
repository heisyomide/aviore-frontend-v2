'use client';

import { Suspense, useState, useEffect } from 'react';
import { Store, UserPlus, Package, ArrowUpRight, Loader2, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/src/lib/axios';
import { Navbar } from '@/src/components/navbar/Navbar';

/**
 * 🚀 MAIN EXPORT
 * Wrapped in Suspense to satisfy Next.js build requirements for useSearchParams.
 */
export default function VendorsPage() {
  return (
    <Suspense fallback={<VendorsLoadingState />}>
      <VendorsContent />
    </Suspense>
  );
}

/**
 * 🏛️ VENDORS CONTENT ENGINE
 */
function VendorsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getVendors() {
      try {
        setLoading(true);
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        const res = await api.get(`/storefront/vendors${query}`);
        const data = res.data;
        setVendors(Array.isArray(data) ? data : (data.vendors || []));
      } catch (error) {
        console.error("Failed to sync vendor registry", error);
      } finally {
        setLoading(false);
      }
    }
    getVendors();
  }, [search]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
       <Navbar />
      {/* 🚀 PREMIUM HERO HUD */}
      <div className="bg-zinc-950 py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#A4143D]/10 blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1750px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-10 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A4143D]/20 border border-[#A4143D]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A4143D] animate-pulse" />
              <span className="text-[#A4143D] text-[9px] font-black uppercase tracking-[0.3em]">
                Verified_Partner_Registry
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.85]">
              Marketplace <br /> <span className="text-zinc-700">Vendor_Hub</span>
            </h1>
          </div>
          
          {/* SEARCH TRIGGER ENGINE */}
          <div className="w-full max-w-md">
            <VendorSearchWrapper defaultValue={search} />
          </div>
        </div>
      </div>

      {/* 🏛️ GRID ENGINE */}
      <div className="max-w-[1750px] mx-auto px-8 -mt-10 relative z-20">
        {loading ? (
          <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-[#A4143D]" size={40} /></div>
        ) : vendors.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-[3rem] bg-white shadow-2xl shadow-zinc-200/20">
             <Store size={48} className="text-zinc-100 mb-4" />
             <p className="text-zinc-400 font-black italic uppercase tracking-widest text-xs">No_Registry_Matches_Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vendors.map((vendor: any) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 💎 VENDOR CARD COMPONENT
 */
function VendorCard({ vendor }: { vendor: any }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const logoUrl = vendor.imageUrl
    ? (vendor.imageUrl.startsWith('http') ? vendor.imageUrl : `${apiBase}/uploads/${vendor.imageUrl}`)
    : null;

  return (
    <Link 
      href={`/vendors/${vendor.slug ?? vendor.id}`}
      className="group relative bg-white border border-zinc-100 rounded-[2.5rem] p-8 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 -mr-12 -mt-12 rounded-full group-hover:bg-[#A4143D]/5 transition-colors duration-500" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="relative w-16 h-16 rounded-3xl bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center shadow-inner group-hover:border-[#A4143D]/20 transition-colors">
          {logoUrl ? (
            <Image 
              src={logoUrl} 
              alt={vendor.storeName} 
              fill 
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
            />
          ) : (
            <Store size={28} className="text-zinc-200 group-hover:text-[#A4143D] transition-colors" />
          )}
        </div>
        <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center group-hover:bg-[#A4143D] transition-all shadow-xl group-hover:rotate-12">
          <ArrowUpRight size={18} />
        </div>
      </div>

      <div className="space-y-4 flex-grow relative z-10">
        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          {vendor.storeName}
        </h3>
        <p className="text-zinc-400 text-[11px] font-bold line-clamp-2 leading-relaxed uppercase tracking-tight opacity-70">
          {vendor.description || "Authorized marketplace vendor specializing in curated artifacts."}
        </p>
      </div>

      <div className="flex items-center gap-8 mt-8 pt-6 border-t border-zinc-50 relative z-10">
        <Stat icon={<UserPlus size={14} />} value={vendor._count?.followers} label="Followers" />
        <Stat icon={<Package size={14} />} value={vendor._count?.products} label="Products" />
      </div>
    </Link>
  );
}

function Stat({ icon, value, label }: { icon: any, value: number, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[#A4143D]">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs font-black text-zinc-900 leading-none">{value || 0}</span>
        <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest mt-0.5">{label}</span>
      </div>
    </div>
  );
}

/**
 * 🔍 LOCAL SEARCH WRAPPER
 */
function VendorSearchWrapper({ defaultValue }: { defaultValue: string }) {
    const [val, setVal] = useState(defaultValue);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/vendors?search=${encodeURIComponent(val)}`);
    }

    return (
        <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#A4143D] transition-colors" size={18} />
            <input 
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="SEARCH_BY_VENDOR_OR_NICHE..."
                className="w-full bg-white/5 border-2 border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black text-white uppercase tracking-widest outline-none focus:border-[#A4143D] transition-all"
            />
        </form>
    );
}

/**
 * 🛠️ FALLBACK LOADING STATE
 */
function VendorsLoadingState() {
  return (
    <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-[#A4143D]" size={48} />
        <div className="absolute inset-0 blur-2xl bg-[#A4143D]/20 animate-pulse" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">Syncing_Vendor_Registry</p>
    </div>
  );
}