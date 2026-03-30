'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Store, ArrowLeft, ShieldCheck, Loader2, PackageSearch, Globe, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

import { ProductCard } from '@/src/components/product/ProductCard';
import { FollowButton } from '@/src/components/vendor/FollowButton';
import { Container } from '@/src/components/layout/Container';
import { Navbar } from '@/src/components/navbar/Navbar';

// --- Registry Interfaces ---
interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
  [key: string]: any;
}

interface Vendor {
  id: string;
  storeName: string;
  description?: string;
  imageUrl?: string;
  products?: Product[];
  _count?: {
    products?: number;
    followers?: number;
  };
}

export default function VendorStorefront() {
  const params = useParams();
  const slug = params?.slug as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (!slug || !API_URL) return;

    let mounted = true;
    const fetchVendor = async () => {
      try {
        setLoading(true);
        // Ensure path matches NestJS: vendors/public-profile/:slug
        const response = await axios.get(`${API_URL}/storefront/vendors/public-profile/${slug}`);
        if (mounted) setVendor(response.data);
      } catch (err) {
        if (mounted) setError('Vendor Node Offline');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVendor();
    return () => { mounted = false; };
  }, [slug, API_URL]);

  const logoUrl = useMemo(() => {
    if (!vendor?.imageUrl) return null;
    return vendor.imageUrl.startsWith('http') 
      ? vendor.imageUrl 
      : `${API_URL}/uploads/${vendor.imageUrl}`;
  }, [vendor, API_URL]);

  if (loading) return <VendorLoadingState />;
  if (error || !vendor) return <VendorNotFound />;

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* 🌑 1. COMMAND HEADER NODE */}
      <header className="bg-[#0A0A0A] pt-24 pb-48 px-6 relative overflow-hidden">
        <Container>
          <div className="flex justify-between items-center mb-16 relative z-10">
            <Link
              href="/vendors"
              className="group inline-flex items-center gap-3 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Registry_Index
            </Link>
            
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90">
               <Share2 size={18} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-12 relative z-10">
            {/* Massive Identity Box */}
            <div className="relative w-44 h-44 md:w-64 md:h-64 rounded-[3.5rem] bg-white overflow-hidden border-[10px] border-zinc-900 shadow-2xl shrink-0 group">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={vendor.storeName}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                  <Store size={64} className="text-zinc-200" />
                </div>
              )}
            </div>

            <div className="flex-grow text-center md:text-left space-y-8 pb-4">
              <div className="flex items-center justify-center md:justify-start gap-3 text-blue-500">
                <ShieldCheck size={20} />
                <span className="text-[11px] font-black uppercase tracking-[0.5em]">
                  Verified_Registry_Partner
                </span>
              </div>

              <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white leading-[0.7] py-2">
                {vendor.storeName}
              </h1>

              <p className="text-zinc-500 max-w-xl text-[12px] font-bold leading-relaxed uppercase tracking-tight italic opacity-80">
                {vendor.description || 'Specialized marketplace node facilitating premium artifact distribution and curated essentials.'}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-12 pt-6">
                <Metric label="Artifacts" value={vendor._count?.products || 0} />
                <Metric label="Network" value={vendor._count?.followers || 0} border />
                
                <div className="pt-4 md:pt-0">
                  <FollowButton
                    vendorId={vendor.id}
                    initialIsFollowing={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
        {/* Background Visual Element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
      </header>

      {/* ⚪ 2. CATALOG REGISTRY NODE */}
      <Container className="-mt-24 pb-48 px-6">
        <div className="bg-white rounded-[4rem] p-8 md:p-24 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.18)] border border-zinc-50 relative z-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10 border-b border-zinc-50 pb-16">
            <div className="space-y-4">
              <span className="text-blue-600 text-[11px] font-black uppercase tracking-[0.6em]">
                Inventory_Matrix
              </span>

              <h2 className="text-5xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
                Collection <span className="text-zinc-200">Catalog</span>
              </h2>
            </div>

            <div className="inline-flex items-center gap-4 px-8 py-4 bg-zinc-50 rounded-3xl border border-zinc-100 shadow-inner">
                <Globe size={16} className="text-blue-500 animate-pulse" />
                <span className="text-[12px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                  Registry_Nodes: {vendor.products?.length || 0}
                </span>
            </div>
          </div>

          {vendor.products?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-20">
              {vendor.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    image: product.image || product.imageUrl || product.images?.[0] || '',
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyInventory />
          )}
        </div>
      </Container>
    </div>
  );
}

/* --- REFINED SUB-COMPONENTS --- */

function Metric({ label, value, border }: { label: string; value: number; border?: boolean; }) {
  return (
    <div className={`${border ? 'md:border-l border-zinc-800 md:pl-12' : ''}`}>
      <span className="block text-4xl font-black italic text-white leading-none mb-2">
        {value.toLocaleString()}
      </span>
      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">
        {label}
      </span>
    </div>
  );
}

function VendorLoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-600" size={64} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-ping" />
        </div>
      </div>
      <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.6em] animate-pulse">
        Synchronizing_Registry_Protocol...
      </p>
    </div>
  );
}

function VendorNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
      <PackageSearch size={64} strokeWidth={1} className="text-zinc-200 mb-8" />
      <h2 className="text-5xl font-black italic uppercase tracking-tighter text-zinc-900 mb-6 leading-none">
        Registry_Node_Empty
      </h2>
      <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-12 max-w-sm">
        The requested vendor node index could not be located within the global directory.
      </p>
      <Link href="/vendors" className="px-16 py-6 bg-zinc-950 text-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-900/20 active:scale-95">
        Return to Directory
      </Link>
    </div>
  );
}

function EmptyInventory() {
  return (
    <div className="py-48 text-center border-2 border-dashed border-zinc-100 rounded-[3.5rem] bg-zinc-50/40">
      <PackageSearch size={56} className="mx-auto text-zinc-200 mb-8" strokeWidth={1} />
      <p className="text-zinc-400 text-[12px] font-black uppercase tracking-[0.5em] italic leading-none">
        Zero_Active_Listings_Registry
      </p>
    </div>
  );
}