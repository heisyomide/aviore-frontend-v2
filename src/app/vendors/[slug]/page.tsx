'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Store,
  ArrowLeft,
  Loader2,
  PackageSearch,
  Share2,
  Users,
  ShoppingBag,
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

  if (loading) return <LoadingState />;
  if (!vendor) return <VendorNotFound />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <Container className="px-4 py-3 flex items-center justify-between">
          <Link
            href="/vendors"
            className="flex items-center gap-2 text-sm font-medium text-gray-600"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <button className="p-2 rounded-full border border-gray-200">
            <Share2 size={18} />
          </button>
        </Container>
      </div>

      {/* Vendor Info */}
      <Container className="px-4 py-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 relative">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={vendor.storeName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Store className="text-gray-300" size={28} />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {vendor.storeName}
              </h1>

              <p className="text-sm text-gray-500 mt-1 leading-6">
                {vendor.description || 'Trusted seller with quality products.'}
              </p>

              <div className="flex gap-6 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} />
                  {vendor._count?.products || 0} Products
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {vendor._count?.followers || 0} Followers
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <FollowButton
              vendorId={vendor.id}
              initialIsFollowing={false}
            />
          </div>
        </div>

        {/* Product Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Products
            </h2>

            <span className="text-sm text-gray-500">
              {vendor.products?.length || 0} items
            </span>
          </div>

          {vendor.products?.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {vendor.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    image:
                      product.image ||
                      product.imageUrl ||
                      product.images?.[0] ||
                      '',
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyProducts />
          )}
        </div>
      </Container>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );
}

function VendorNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white text-center">
      <PackageSearch size={48} className="text-gray-300 mb-4" />

      <h2 className="text-xl font-semibold text-gray-900">
        Store not found
      </h2>

      <p className="text-sm text-gray-500 mt-2">
        This vendor page is not available right now.
      </p>

      <Link
        href="/vendors"
        className="mt-6 px-5 py-3 rounded-xl bg-black text-white text-sm font-medium"
      >
        Go back
      </Link>
    </div>
  );
}

function EmptyProducts() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
      <PackageSearch size={40} className="mx-auto text-gray-300 mb-3" />

      <p className="text-sm text-gray-500">
        No products available
      </p>
    </div>
  );
}