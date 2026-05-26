'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ProductCard } from './ProductCard';

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
  [key: string]: any; // Allows catch-all flexibility for other properties passed down
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
}

// =====================================================
// CUSTOM HOOK (Unchanged API Architecture)
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
          axios.get<Product[]>(`${API}/storefront/products/explore?limit=20`),
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
// COMPONENT (Fixed Price, Stock Flattening & Native Grid Layout)
// =====================================================

export function RecommendedProducts({
  products = [],
  title,
  subtitle,
  currentProductId,
  limit = 8,
}: RecommendedProductsProps) {

  // ====================================
  // CLEAN, FILTER, DEDUPLICATE & OVERRIDE DUMMY DATA
  // ====================================
  const cleanedProducts = useMemo(() => {
    return products
      .filter(Boolean)
      // 1. Remove details page native product reference
      .filter((p) => p.id !== currentProductId)
      // 2. Remove duplicate payload items
      .filter((product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
      )
      // 3. Mutate product root fields so ProductCard renders accurate metadata
      .map((product) => {
        const variants = product.variants || [];

        // Check for variant specific configurations
        const hasVariants = variants.length > 0;

        // Extract and clean valid prices from array of variants
        const prices = variants
          .map((v) => (typeof v.price === 'string' ? parseFloat(v.price) : v.price))
          .filter((p) => !isNaN(p) && p > 0);

        // Calculate minimum valid variant price, fall back to product base price
        const resolvedPrice = prices.length > 0
          ? Math.min(...prices)
          : typeof product.price === 'string'
          ? parseFloat(product.price) || 0
          : product.price || 0;

        // Sum up stocks across all variants if variants exist, otherwise use base stock
        const totalStock = hasVariants
          ? variants.reduce((sum, v) => sum + (v.stock || 0), 0)
          : product.stock || 0;

        return {
          ...product,
          price: resolvedPrice, // Updates '0' string with variant price (e.g., 17450)
          stock: totalStock,    // Updates '0' integer with calculated sum (e.g., 7)
        };
      })
      .slice(0, limit);
  }, [products, currentProductId, limit]);

  // Prevent UI compilation or flashing if output list evaluates to empty array
  if (cleanedProducts.length === 0) {
    return null;
  }

  // ====================================
  // UI RENDER GRID MATCHING YOUR DESIGN
  // ====================================
  return (
    <section className="mt-20">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          {title}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {subtitle}
        </p>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {cleanedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}