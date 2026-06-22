// /components/product/RecommendedProducts.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ProductCard } from './ProductCard';
import { Pagination } from '../shop/Pagination';
import Link from 'next/link';

// =====================================================
// STRONGLY TYPED INTERFACES
// =====================================================
export interface ProductVariant {
  id: string;
  productId: string;
  color?: string | null;
  size?: string | null;
  material?: string | null;
  price: string | number;
  stock: number;
  sku?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  productId: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string | number;
  oldPrice?: string | number | null;
  stock: number;
  sku?: string | null;
  status: string;
  isActive: boolean;
  isDeleted: boolean;
  vendorId: string;
  origin: string;
  deliveryMin: number;
  deliveryMax: number;
  storeId?: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  [key: string]: any;
}

interface RecommendationHookReturn {
  recommended: Product[];
  vendorProducts: Product[];
  explore: Product[];
  loading: boolean;
}

interface RecommendedProductsProps {
  products?: Product[];
  title: string;
  subtitle: string;
  currentProductId?: string;
  limit?: number;
  seeMoreHref?: string;       // 🌐 Optional link for navigation
  showPagination?: boolean;   // 📊 Toggle pagination on/off
}

// =====================================================
// CUSTOM HOOK
// =====================================================
export function useRecommendations(
  productId?: string,
  vendorId?: string,
): RecommendationHookReturn {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [explore, setExplore] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const API = process.env.NEXT_PUBLIC_API_URL;

        const results = await Promise.allSettled([
          axios.get<Product[]>(`${API}/storefront/products/${productId}/recommendations`),
          axios.get<Product[]>(`${API}/storefront/products/explore?limit=40`), // Expanded default pool limit for pagination
          vendorId
            ? axios.get<Product[]>(`${API}/storefront/vendors/${vendorId}/products`)
            : Promise.resolve({ data: [] as Product[] }),
        ]);

        if (results[0].status === 'fulfilled') {
          setRecommended(results[0].value.data || []);
        } else {
          setRecommended([]);
        }

        if (results[1].status === 'fulfilled') {
          setExplore(results[1].value.data || []);
        } else {
          setExplore([]);
        }

        if (results[2].status === 'fulfilled') {
          setVendorProducts(results[2].value.data || []);
        } else {
          setVendorProducts([]);
        }
      } catch (err) {
        console.error('Recommendation fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, vendorId]);

  return {
    recommended,
    vendorProducts,
    explore,
    loading,
  };
}

// =====================================================
// COMPONENT
// =====================================================
export function RecommendedProducts({
  products = [],
  title,
  subtitle,
  currentProductId,
  limit = 8,
  seeMoreHref,
  showPagination = false,
}: RecommendedProductsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit;

  // Cleanup pool
  const baseCleanedPool = useMemo(() => {
    return products
      .filter(Boolean)
      .filter((p) => p.id !== currentProductId)
      .filter((product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
      )
      .map((product) => {
        const variants = product.variants || [];
        const hasVariants = variants.length > 0;
        const prices = variants
          .map((v) => (typeof v.price === 'string' ? parseFloat(v.price) : v.price))
          .filter((p) => !isNaN(p) && p > 0);

        const resolvedPrice = prices.length > 0
          ? Math.min(...prices)
          : typeof product.price === 'string'
          ? parseFloat(product.price) || 0
          : product.price || 0;

        const totalStock = hasVariants
          ? variants.reduce((sum, v) => sum + (v.stock || 0), 0)
          : product.stock || 0;

        return {
          ...product,
          price: resolvedPrice,
          stock: totalStock,
        };
      });
  }, [products, currentProductId]);

  // Compute pages total
  const totalPages = useMemo(() => {
    return Math.ceil(baseCleanedPool.length / itemsPerPage);
  }, [baseCleanedPool, itemsPerPage]);

  // 🛠️ ACCUMULATIVE DISPLAY SLICE LOGIC
  const visibleProducts = useMemo(() => {
    if (!showPagination) {
      return baseCleanedPool.slice(0, limit);
    }
    // Grabs from index 0 all the way down to grow rows cleanly
    return baseCleanedPool.slice(0, currentPage * itemsPerPage);
  }, [baseCleanedPool, showPagination, currentPage, itemsPerPage, limit]);

  if (baseCleanedPool.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      {/* HEADER ROW WITH SEE MORE ROUTING ANCHOR */}
      <div className="mb-8 flex items-end justify-between border-b border-zinc-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            {title}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {subtitle}
          </p>
        </div>
        
        {seeMoreHref && (
          <Link 
            href={seeMoreHref}
            className="text-xs font-bold tracking-wider uppercase text-[#A4143D] hover:opacity-80 transition-all border-b-2 border-transparent hover:border-[#A4143D] pb-1"
          >
            See More &rarr;
          </Link>
        )}
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* PAGINATION ZONE - MOUNTED ONLY ON SPECIFIED EXPLORE CONTAINER */}
      {showPagination && totalPages > 1 && (
        <div className="mt-14">
          <Pagination 
            current={currentPage}
            total={totalPages}
            onPageChange={(nextPage) => setCurrentPage(nextPage)}
          />
        </div>
      )}
    </section>
  );
}