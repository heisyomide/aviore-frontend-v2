'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Store,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  PackageSearch,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

import { ProductCard } from '@/src/components/product/ProductCard';
import { FollowButton } from '@/src/components/vendor/FollowButton';
import { Container } from '@/src/components/layout/Container';
import { Navbar } from '@/src/components/navbar/Navbar';

interface Product {
  id: string;
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

interface VendorPageProps {
  params: {
    slug: string;
  };
}

export default function VendorStorefront({
  params,
}: VendorPageProps) {
  const { slug } = params;

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

        const response = await axios.get(
          `${API_URL}/storefront/vendors/${slug}`
        );

        if (mounted) {
          setVendor(response.data);
        }
      } catch (err) {
        console.error('Vendor fetch failed:', err);

        if (mounted) {
          setError('Vendor not found');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchVendor();

    return () => {
      mounted = false;
    };
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-[#09090b] pt-16 pb-32 px-6">
        <Container>
          <Link
            href="/vendors"
            className="group inline-flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-12 transition-all"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back_to_Directory
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-4xl bg-white overflow-hidden border-[6px] border-[#111] shadow-2xl shrink-0">
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
                  <Store size={40} className="text-zinc-200" />
                </div>
              )}
            </div>

            <div className="flex-grow text-center md:text-left space-y-4 pb-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#A4143D]">
                <ShieldCheck size={16} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                  Verified_Registry_Partner
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">
                {vendor.storeName}
              </h1>

              <p className="text-zinc-500 max-w-xl text-xs font-bold leading-relaxed uppercase tracking-tight">
                {vendor.description ||
                  'Official marketplace partner specializing in premium artifacts and curated essentials.'}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-8 pt-4">
                <Metric
                  label="Collection"
                  value={vendor._count?.products || 0}
                />

                <Metric
                  label="Followers"
                  value={vendor._count?.followers || 0}
                  border
                />

                <FollowButton
                  vendorId={vendor.id}
                  initialIsFollowing={false}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="-mt-16 pb-32">
        <div className="bg-white rounded-4xl p-8 md:p-16 shadow-2xl shadow-zinc-200/50 border border-zinc-50">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-zinc-50 pb-8">
            <div className="space-y-1">
              <span className="text-[#A4143D] text-[9px] font-black uppercase tracking-[0.4em]">
                Available_Inventory
              </span>

              <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                Store <span className="text-zinc-400">Catalog</span>
              </h2>
            </div>

            <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
              Live_Items: {vendor.products?.length || 0}
            </div>
          </div>

          {vendor.products?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {vendor.products.map((product) => {
                const normalizedProduct = {
                  ...product,
                  image:
                    product.image ||
                    product.imageUrl ||
                    product.images?.[0] ||
                    '',
                };

                return (
                  <ProductCard
                    key={product.id}
                    product={normalizedProduct}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyInventory />
          )}
        </div>
      </Container>
    </div>
  );
}

function Metric({
  label,
  value,
  border,
}: {
  label: string;
  value: number;
  border?: boolean;
}) {
  return (
    <div className={`text-white ${border ? 'border-l border-zinc-800 pl-8' : ''}`}>
      <span className="block text-2xl font-black italic">
        {value}
      </span>
      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

function VendorLoadingState() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-[#A4143D]" size={40} />
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        Initializing_Secure_Storefront...
      </p>
    </div>
  );
}

function VendorNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-40 text-center space-y-6">
      <PackageSearch size={32} className="text-zinc-200" />
      <h2 className="text-3xl font-black italic uppercase tracking-tighter">
        Vendor Not Found
      </h2>
      <Link href="/vendors">
        Return to Global Directory
      </Link>
    </div>
  );
}

function EmptyInventory() {
  return (
    <div className="py-32 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
      <PackageSearch
        size={40}
        className="mx-auto text-zinc-100 mb-4"
      />
      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
        No Active Listings
      </p>
    </div>
  );
}