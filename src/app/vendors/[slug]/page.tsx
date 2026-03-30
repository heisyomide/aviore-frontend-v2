'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Store, ArrowLeft, ShieldCheck, Loader2, PackageSearch, Globe, Share2, Award, Zap } from 'lucide-react';
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
        const response = await axios.get(`${API_URL}/storefront/vendors/public-profile/${slug}`);
        if (mounted) setVendor(response.data);
      } catch (err) {
        if (mounted) setError('Registry Node Offline');
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
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* 🌑 1. PREMIUM HERO NODE */}
      <header className="bg-[#050505] pt-28 pb-60 px-6 relative overflow-hidden">
        {/* Subtle Background Textures */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 blur-[140px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full" />
        </div>

        <Container className="relative z-10">
          <div className="flex justify-between items-center mb-20">
            <Link
              href="/vendors"
              className="group flex items-center gap-4 text-zinc-500 hover:text-white transition-all"
            >
              <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-white transition-colors">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">Back_to_Index</span>
            </Link>
            
            <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
               <Share2 size={18} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-16">
            {/* Identity Hex-Node */}
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative w-48 h-48 lg:w-72 lg:h-72 rounded-[4rem] bg-white p-2 shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)] overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                <div className="w-full h-full rounded-[3.5rem] overflow-hidden relative border-4 border-zinc-100">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={vendor.storeName}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                      <Store size={80} className="text-zinc-200" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-grow text-center lg:text-left space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-500">
                  <ShieldCheck size={16} />
                  <span className="text-[9px] font-black uppercase tracking-[0.5em]">Verified Vendor</span>
                </div>

                <h1 className="text-7xl lg:text-[11rem] font-black italic uppercase tracking-[-0.05em] text-white leading-[0.8] mb-4">
                  {vendor.storeName}
                </h1>

                <p className="text-zinc-500 max-w-2xl text-[13px] font-medium leading-relaxed uppercase tracking-tight italic opacity-70">
                  {vendor.description || 'ESTABLISHED PARTNER NODE OPTIMIZING THE DISTRIBUTION OF PREMIUM ARTIFACTS AND CURATED LIFESTYLE ESSENTIALS.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-12 border-t border-zinc-900 pt-10">
                <Metric label="Products" value={vendor._count?.products || 0} />
                <Metric label="Followers" value={vendor._count?.followers || 0} />
                
                <div className="w-full lg:w-auto pt-6 lg:pt-0">
                  <FollowButton
                    vendorId={vendor.id}
                    initialIsFollowing={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* ⚪ 2. CATALOG SECTION */}
      <Container className="-mt-32 pb-40 px-6">
        <div className="bg-white rounded-[5rem] shadow-[0_100px_150px_-50px_rgba(0,0,0,0.12)] border border-zinc-100 overflow-hidden relative z-20">
          
          {/* Header of the catalog */}
          <div className="px-10 lg:px-24 pt-20 pb-16 border-b border-zinc-50">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                <div className="space-y-4">
                    <span className="text-blue-600 text-[11px] font-black uppercase tracking-[0.6em] flex items-center gap-3">
                        <Zap size={14} fill="currentColor" /> Live_Inventory
                    </span>
                    <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-zinc-900">
                        Registry <span className="text-zinc-200">Vault</span>
                    </h2>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Registry_Status</p>
                        <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Active_and_Verified</p>
                    </div>
                    <div className="w-px h-10 bg-zinc-100 hidden lg:block" />
                    <div className="px-8 py-4 bg-zinc-900 rounded-[2rem] text-white flex items-center gap-4">
                        <Globe size={16} className="text-blue-500 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                            Nodes: {vendor.products?.length || 0}
                        </span>
                    </div>
                </div>
            </div>
          </div>

          <div className="p-10 lg:p-24 bg-[#FAFAFA]">
            {vendor.products?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-24">
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

          {/* Catalog Footer Decorative element */}
          <div className="h-4 bg-gradient-to-r from-blue-600 via-zinc-900 to-black" />
        </div>
      </Container>

      <footer className="py-20 text-center border-t border-zinc-100">
            <p className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.8em]">End_of_Registry_Transmission</p>
      </footer>
    </div>
  );
}

/* --- REFINED SUB-COMPONENTS --- */

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <h3 className="text-5xl font-black italic text-white tracking-tighter leading-none">
        {value.toLocaleString()}
      </h3>
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">
        {label}
      </p>
    </div>
  );
}

function VendorLoadingState() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-12">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-blue-600/20 rounded-[2rem] animate-pulse" />
        <div className="absolute inset-0 border-t-4 border-blue-600 rounded-[2rem] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-blue-600 animate-pulse" size={32} fill="currentColor" />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <p className="text-[12px] font-black text-white uppercase tracking-[0.8em] animate-pulse">Syncing_Registry</p>
        <div className="w-48 h-[1px] bg-zinc-800 mx-auto overflow-hidden">
            <div className="w-full h-full bg-blue-600 translate-x-[-100%] animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}

function VendorNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6 text-center">
      <div className="w-24 h-24 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center mb-10 border border-zinc-100">
        <PackageSearch size={40} strokeWidth={1} className="text-zinc-300" />
      </div>
      <h2 className="text-6xl font-black italic uppercase tracking-tighter text-zinc-900 mb-4">
        Null_Registry_Node
      </h2>
      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-12 max-w-sm mx-auto leading-relaxed">
        The requested connection could not be established with the global artifact directory.
      </p>
      <Link href="/vendors" className="px-16 py-6 bg-zinc-950 text-white rounded-full text-[11px] font-black uppercase tracking-[0.5em] hover:bg-blue-600 transition-all shadow-2xl">
        Restart_Directory_Search
      </Link>
    </div>
  );
}

function EmptyInventory() {
  return (
    <div className="py-40 text-center rounded-[4rem] border-2 border-dashed border-zinc-100 bg-white">
      <PackageSearch size={64} className="mx-auto text-zinc-200 mb-10" strokeWidth={1} />
      <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.6em] italic">
        Zero_Active_Data_Nodes
      </p>
    </div>
  );
}