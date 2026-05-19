'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

import {
  ArrowLeft,
  Loader2,
  PackageSearch,
  Share2,
} from 'lucide-react';

import { Navbar } from '@/src/components/navbar/Navbar';
import { Container } from '@/src/components/layout/Container';

import { StoreHero } from '@/src/components/storefront/StoreHero';
import { StoreHeader } from '@/src/components/storefront/StoreHeader';
import { StoreTabs } from '@/src/components/storefront/StoreTabs';
import { StoreLookbook } from '@/src/components/storefront/StoreLookbook';
import { StoreReviews } from '@/src/components/storefront/StoreReviews';
import { StoreTrustBadges } from '@/src/components/storefront/StoreTrustBadges';

import { ProductCard } from '@/src/components/product/ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  imageUrl?: string;
  images?: any[];
  variants?: any[];
  createdAt?: string;
  soldCount?: number;
  reviewCount?: number;
  [key: string]: any;
}

interface Vendor {
  id: string;
  storeName: string;
  description?: string;
  imageUrl?: string;
  bannerUrl?: string;
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
  const [activeTab, setActiveTab] = useState('Home');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (!slug) return;

    const fetchVendor = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_URL}/storefront/vendors/public-profile/${slug}`
        );

        setVendor(response.data);
      } catch (error) {
        console.error(error);
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [slug, API_URL]);

  const logoUrl = useMemo(() => {
    if (!vendor?.imageUrl) return null;

    return vendor.imageUrl.startsWith('http')
      ? vendor.imageUrl
      : `${API_URL}/uploads/${vendor.imageUrl}`;
  }, [vendor, API_URL]);

  const bannerUrl = useMemo(() => {
    if (!vendor?.bannerUrl) {
      return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1600';
    }

    return vendor.bannerUrl.startsWith('http')
      ? vendor.bannerUrl
      : `${API_URL}/uploads/${vendor.bannerUrl}`;
  }, [vendor, API_URL]);

  /* ========================= PRODUCTS ========================= */

  const allProducts = useMemo(() => {
    return vendor?.products || [];
  }, [vendor]);

  const newArrivals = useMemo(() => {
    return [...allProducts]
      .sort(
        (a, b) =>
          new Date(b.createdAt || '').getTime() -
          new Date(a.createdAt || '').getTime()
      )
      .slice(0, 12);
  }, [allProducts]);

  const bestSellers = useMemo(() => {
    return [...allProducts]
      .sort(
        (a, b) =>
          (b.soldCount || 0) - (a.soldCount || 0)
      )
      .slice(0, 12);
  }, [allProducts]);

  const topReviewed = useMemo(() => {
    return [...allProducts]
      .sort(
        (a, b) =>
          (b.reviewCount || 0) -
          (a.reviewCount || 0)
      )
      .slice(0, 8);
  }, [allProducts]);

  const lookbookImages = useMemo(() => {
    if (!allProducts.length) return [];

    return allProducts
      .flatMap((p) => {
        const img =
          p?.images?.[0]?.imageUrl ||
          p?.image ||
          p?.imageUrl;

        if (!img) return [];

        return [
          img.startsWith('http')
            ? img
            : `${API_URL}/uploads/${img}`,
        ];
      })
      .slice(0, 4);
  }, [allProducts, API_URL]);

  if (loading) return <LoadingState />;

  if (!vendor) return <VendorNotFound />;

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Navbar />

      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-white border-b border-zinc-100">
        <Container className="h-14 flex items-center justify-between px-4">
          <Link
            href="/vendors"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-700"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <button className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center bg-white">
            <Share2 size={18} />
          </button>
        </Container>
      </div>

      {/* HERO */}
      <StoreHero
        banner={bannerUrl}
        storeName={vendor.storeName}
        tagline={
          vendor.description ||
          'Premium shopping experience with trusted products.'
        }
      />

      {/* HEADER */}
      <StoreHeader
        vendor={vendor}
        logoUrl={logoUrl}
      />

      {/* TABS */}
      <StoreTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Container className="px-4 pb-24">

        {/* ========================= HOME ========================= */}

        {activeTab === 'Home' && (
          <div className="space-y-10 mt-8">

            {/* INTRO */}
            <section className="bg-white rounded-[2rem] border border-zinc-100 p-6 shadow-sm">
              <div className="max-w-3xl">
                <span className="text-[11px] font-black tracking-[0.3em] uppercase text-[#A4143D]">
                  Official Storefront
                </span>

                <h2 className="text-3xl font-black tracking-tight text-zinc-950 mt-3">
                  Welcome to {vendor.storeName}
                </h2>

                <p className="text-sm text-zinc-600 leading-7 mt-4">
                  Discover curated products, premium quality items,
                  verified shopping protection, trusted delivery,
                  and exclusive collections directly from this vendor.
                </p>
              </div>
            </section>

            {/* FEATURED */}
            <StoreSection
              title="Featured Products"
              subtitle="Most popular products from this storefront"
              products={allProducts.slice(0, 10)}
            />

            {/* LOOKBOOK */}
            {lookbookImages.length > 0 && (
              <StoreLookbook
                images={lookbookImages}
              />
            )}

            {/* TRUST */}
            <StoreTrustBadges />

            {/* REVIEWS */}
            <StoreReviews />

          </div>
        )}

        {/* ========================= PRODUCTS TAB ========================= */}

        {activeTab === 'Products' && (
          <div className="mt-10">
            <SectionHeader
              title="All Products"
              subtitle="Everything listed in this storefront"
              count={allProducts.length}
            />

            {allProducts.length ? (
              <StoreProductGrid products={allProducts} />
            ) : (
              <EmptyProducts />
            )}
          </div>
        )}

        {/* ========================= NEW ARRIVALS ========================= */}

        {activeTab === 'New Arrivals' && (
          <div className="mt-10">
            <SectionHeader
              title="New Arrivals"
              subtitle="Recently uploaded products"
              count={newArrivals.length}
            />

            {newArrivals.length ? (
              <StoreProductGrid products={newArrivals} />
            ) : (
              <EmptyProducts />
            )}
          </div>
        )}

        {/* ========================= BEST SELLERS ========================= */}

        {activeTab === 'Best Sellers' && (
          <div className="mt-10">
            <SectionHeader
              title="Best Sellers"
              subtitle="Most purchased products from this store"
              count={bestSellers.length}
            />

            {bestSellers.length ? (
              <StoreProductGrid products={bestSellers} />
            ) : (
              <EmptyProducts />
            )}
          </div>
        )}

        {/* ========================= REVIEWS ========================= */}

        {activeTab === 'Reviews' && (
          <div className="space-y-8 mt-10">

            <SectionHeader
              title="Customer Reviews"
              subtitle="Real feedback from customers"
              count={topReviewed.length}
            />

            <StoreReviews />

            {topReviewed.length > 0 && (
              <StoreSection
                title="Top Reviewed Products"
                subtitle="Products customers love the most"
                products={topReviewed}
              />
            )}
          </div>
        )}

        {/* ========================= ABOUT ========================= */}

        {activeTab === 'About' && (
          <div className="space-y-8 mt-10">

            <section className="bg-white rounded-[2rem] border border-zinc-100 p-7 shadow-sm">
              <span className="text-[11px] font-black tracking-[0.25em] uppercase text-[#A4143D]">
                About Vendor
              </span>

              <h2 className="text-3xl font-black tracking-tight text-zinc-950 mt-3">
                {vendor.storeName}
              </h2>

              <p className="text-sm text-zinc-600 leading-8 mt-5">
                {vendor.description ||
                  'Trusted vendor delivering premium quality products with secure transactions and reliable customer experience.'}
              </p>
            </section>

            <StoreTrustBadges />

            <section className="bg-white rounded-[2rem] border border-zinc-100 p-7 shadow-sm">
              <h3 className="text-xl font-black text-zinc-950">
                Store Statistics
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <StatCard
                  title="Products"
                  value={
                    vendor._count?.products || 0
                  }
                />

                <StatCard
                  title="Followers"
                  value={
                    vendor._count?.followers || 0
                  }
                />

                <StatCard
                  title="Best Sellers"
                  value={bestSellers.length}
                />

                <StatCard
                  title="Reviews"
                  value={topReviewed.length}
                />
              </div>
            </section>
          </div>
        )}
      </Container>
    </div>
  );
}

/* ========================= SECTION ========================= */

function StoreSection({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle: string;
  products: Product[];
}) {
  return (
    <section>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        count={products.length}
      />

      <StoreProductGrid products={products} />
    </section>
  );
}

/* ========================= HEADER ========================= */

function SectionHeader({
  title,
  subtitle,
  count,
}: {
  title: string;
  subtitle: string;
  count?: number;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-zinc-950">
          {title}
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          {subtitle}
        </p>
      </div>

      {typeof count === 'number' && (
        <span className="text-sm font-semibold text-zinc-500">
          {count} items
        </span>
      )}
    </div>
  );
}

/* ========================= STATS ========================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h3 className="text-3xl font-black text-zinc-950 mt-2">
        {value}
      </h3>
    </div>
  );
}

/* ========================= PRODUCT GRID ========================= */

function StoreProductGrid({
  products,
}: {
  products: Product[];
}) {
  return (
    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-3
        md:gap-5
      "
    >
      {products.map((product, idx) => (
        <div
          key={product.id || idx}
          className="
            overflow-hidden
            rounded-[2rem]
          "
        >
          <ProductCard
            product={{
              ...product,
              image:
                product.image ||
                product.imageUrl ||
                product.images?.[0]?.imageUrl ||
                '',
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ========================= LOADING ========================= */

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2
          className="animate-spin text-[#A4143D]"
          size={36}
        />

        <p className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-400">
          Loading Storefront
        </p>
      </div>
    </div>
  );
}

/* ========================= NOT FOUND ========================= */

function VendorNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white text-center">
      <PackageSearch
        size={52}
        className="text-zinc-300 mb-4"
      />

      <h2 className="text-2xl font-black text-zinc-900">
        Store Not Found
      </h2>

      <p className="text-sm text-zinc-500 mt-3 max-w-sm leading-7">
        This storefront is unavailable or has been removed.
      </p>

      <Link
        href="/vendors"
        className="
          mt-8
          px-6
          py-4
          rounded-2xl
          bg-[#A4143D]
          text-white
          text-sm
          font-bold
        "
      >
        Return To Marketplace
      </Link>
    </div>
  );
}

/* ========================= EMPTY ========================= */

function EmptyProducts() {
  return (
    <div
      className="
        bg-white
        rounded-[2rem]
        border
        border-zinc-100
        py-24
        text-center
      "
    >
      <PackageSearch
        size={52}
        className="mx-auto text-zinc-300 mb-5"
      />

      <h3 className="text-xl font-black text-zinc-900">
        No Products Yet
      </h3>

      <p className="text-sm text-zinc-500 mt-2">
        This storefront has not uploaded products yet.
      </p>
    </div>
  );
}