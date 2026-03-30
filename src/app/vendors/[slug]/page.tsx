'use client';

import { useEffect, useMemo, useState } from 'react';
import { Store, ArrowLeft, ShieldCheck, Loader2, PackageSearch, Globe, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

import { ProductCard } from '@/src/components/product/ProductCard';
import { FollowButton } from '@/src/components/vendor/FollowButton';
import { Container } from '@/src/components/layout/Container';
import { Navbar } from '@/src/components/navbar/Navbar';

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

export default function VendorStorefront({ params }: { params: { slug: string } }) {
  // 🚀 FIXED: Convert slug to lowercase immediately to match backend standard
  const slug = params.slug.toLowerCase(); 
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    let mounted = true;
    
    const fetchVendor = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🚀 THE FIX: Path updated to match your NestJS route '@Get("public-profile/:slug")'
        // Also ensured we hit the correct '/vendors' prefix
        const response = await axios.get(`${API_URL}/vendors/public-profile/${slug}`);
        
        if (mounted) {
          setVendor(response.data);
        }
      } catch (err: any) {
        console.error('REGISTRY_NODE_SYNC_ERROR:', err.response?.status);
        if (mounted) {
          setError('Vendor Node Offline');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVendor();
    return () => { mounted = false; };
  }, [slug, API_URL]);

  const logoUrl = useMemo(() => {
    if (!vendor?.imageUrl) return null;
    return vendor.imageUrl.startsWith('http') ? vendor.imageUrl : `${API_URL}/uploads/${vendor.imageUrl}`;
  }, [vendor, API_URL]);

  if (loading) return <VendorLoadingState />;
  if (error || !vendor) return <VendorNotFound />;

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* 🌑 1. COMMAND HEADER NODE (Full Bleed) */}
      <header className="bg-[#0A0A0A] pt-20 pb-40 px-6">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <Link
              href="/vendors"
              className="group inline-flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              Registry_Index
            </Link>
            
            <button className="p-3 bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white transition-all active:scale-90">
               <Share2 size={16} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-12">
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-[3rem] bg-white overflow-hidden border-[8px] border-zinc-900 shadow-2xl shrink-0 group">
              {logoUrl ? (
                <Image src={logoUrl} alt={vendor.storeName} fill className="object-cover group-hover:scale-110 transition-transform duration-700" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                  <Store size={64} className="text-zinc-200" />
                </div>
              )}
            </div>

            <div className="flex-grow text-center md:text-left space-y-6 pb-2">
              <div className="flex items-center justify-center md:justify-start gap-3 text-blue-500">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Verified_Registry_Node</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.75]">
                {vendor.storeName}
              </h1>
              <p className="text-zinc-500 max-w-xl text-[11px] font-bold leading-relaxed uppercase tracking-tight italic">
                {vendor.description || 'Specialized marketplace partner optimizing premium artifact distribution.'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-10 pt-4">
                <Metric label="Artifacts" value={vendor._count?.products || 0} />
                <Metric label="Network" value={vendor._count?.followers || 0} border />
                <div className="pt-2 md:pt-0">
                  <FollowButton vendorId={vendor.id} initialIsFollowing={false} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* ⚪ 2. CATALOG REGISTRY NODE */}
      <Container className="-mt-20 pb-40 px-6">
        <div className="bg-white rounded-[3rem] p-8 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-zinc-50 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-zinc-50 pb-12">
            <div className="space-y-3">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em]">Inventory_Catalog</span>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900">
                Live <span className="text-zinc-300">Artifacts</span>
              </h2>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <Globe size={14} className="text-blue-500 animate-pulse" />
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                  Registry_Nodes: {vendor.products?.length || 0}
                </span>
            </div>
          </div>

          {vendor.products?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {vendor.products.map((product) => (
                <ProductCard key={product.id} product={{ ...product, image: product.image || product.imageUrl || product.images?.[0] || '' }} />
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

/* --- COMPONENTS --- */

function Metric({ label, value, border }: { label: string; value: number; border?: boolean; }) {
  return (
    <div className={`${border ? 'md:border-l border-zinc-800 md:pl-10' : ''}`}>
      <span className="block text-3xl font-black italic text-white leading-none mb-1">{value.toLocaleString()}</span>
      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">{label}</span>
    </div>
  );
}

function VendorLoadingState() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] animate-pulse">Initializing_Storefront...</p>
    </div>
  );
}

function VendorNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <PackageSearch size={48} strokeWidth={1} className="text-zinc-200 mb-6" />
      <h2 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 mb-4">Registry_Node_Null</h2>
      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-10">The requested vendor index does not exist.</p>
      <Link href="/vendors" className="px-12 py-5 bg-zinc-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl">
        Return to Index
      </Link>
    </div>
  );
}

function EmptyInventory() {
  return (
    <div className="py-40 text-center border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/50">
      <PackageSearch size={48} className="mx-auto text-zinc-200 mb-6" strokeWidth={1} />
      <p className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.4em] italic leading-none">Zero_Active_Listings</p>
    </div>
  );
}