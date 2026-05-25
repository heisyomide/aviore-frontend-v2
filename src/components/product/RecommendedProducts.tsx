'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ProductCard } from './ProductCard';

// 💡 Define explicit types for your product items rather than using 'any' blindly
interface Product {
  id: string;
  title: string;
  displayPrice?: number;
  basePrice?: number;
  images?: Array<string | { imageUrl: string; url?: string }>;
  [key: string]: any; 
}

interface RecommendedProductsProps {
  products?: Product[] | null;
  currentProductId?: string;
  title: string;
  subtitle: string;
}

/**
 * Hook 1: Hook-driven Recommendation Layer Engine
 * Fetches data asynchronously from 3 separate pipeline layers.
 */
export function useRecommendations(productId?: string, vendorId?: string) {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [explore, setExplore] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // We need both parameters to fulfill the structural API request requirements safely
    if (!productId || !vendorId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;

        // 🧠 Promise.allSettled shields our UI from a single broken endpoint crash
        const [recRes, vendorRes, exploreRes] = await Promise.allSettled([
          axios.get<Product[]>(`${API}/products/${productId}/recommendations`),
          axios.get<Product[]>(`${API}/vendor/${vendorId}/products`), // Syncs with backend @Get(':id/products') inside your vendor controller
          axios.get<Product[]>(`${API}/products/explore?limit=20`),
        ]);

        setRecommended(recRes.status === 'fulfilled' ? recRes.value.data || [] : []);
        setVendorProducts(vendorRes.status === 'fulfilled' ? vendorRes.value.data || [] : []);
        setExplore(exploreRes.status === 'fulfilled' ? exploreRes.value.data || [] : []);
        
        // Log errors internally to console without disrupting layout painting
        if (recRes.status === 'rejected') console.warn('Algorithmic Recommendations failed', recRes.reason);
        if (vendorRes.status === 'rejected') console.warn('Vendor Catalog Backfill failed', vendorRes.reason);
        if (exploreRes.status === 'rejected') console.warn('Global Explore Feed failed', exploreRes.reason);

      } catch (err) {
        console.error('Fatal failure executing recommendation pipelines:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, vendorId]); // Adding both to the lifecycle tracker array

  return {
    recommended,
    vendorProducts,
    explore,
    isLoading,
  };
}

/**
 * Component 2: Presentation Carousel Component UI
 * Dynamically lists clean grid columns depending on parent criteria.
 */
export function RecommendedProducts({
  products,
  currentProductId,
  title,
  subtitle,
}: RecommendedProductsProps) {
  
  // 🏎️ useMemo ensures data filtration logic only runs when product properties change
  const displayProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list
      .filter((p) => p && p.id !== currentProductId)
      .slice(0, 4); // Bounds visual limits safely to 1 clean grid row line
  }, [products, currentProductId]);

  if (displayProducts.length === 0) return null;

  return (
    <div className="mt-12 animate-in fade-in duration-500">
      <div className="flex items-end justify-between mb-8 px-4 sm:px-0">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {title}
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {displayProducts.map((product, idx) => (
          <div
            key={product.id || `rec-card-${idx}`}
            className="animate-in fade-in zoom-in-95 duration-700 fill-mode-both"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}