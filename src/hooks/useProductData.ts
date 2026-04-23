'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/src/lib/axios';

interface UseProductDataReturn {
  product: any;
  vendor: any;
  recommended: any[];
  loading: boolean;
  error: string | null;
  selectedVariant: any;
  setSelectedVariant: (variant: any) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  qty: number;
  setQty: (qty: number) => void;
}

export function useProductData(productId: string): UseProductDataReturn {
  const [product, setProduct] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interactive UI State
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);

  const loadData = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Primary Product Fetch
      const { data: productData } = await api.get(`/products/${productId}`);
      setProduct(productData);

      // Initialize variant if exists
if (productData.variants?.length > 0 && productData.variants[0]) {
  setSelectedVariant(productData.variants[0]);
}

      // 2. Parallel Secondary Fetching (Vendor + Recommendations)
      const [vRes, rRes] = await Promise.all([
        api.get(`/storefront/vendors/public-profile/${productData.vendorId}`),
        api.get('/products', { 
          params: { 
            category: productData.category?.slug, 
            limit: 8 
          } 
        })
      ]);

      setVendor(vRes.data);
      setRecommended(rRes.data.data.filter((p: any) => p.id !== productId));

    } catch (err: any) {
      console.error("PRODUCT_HOOK_ERROR:", err);
      setError(err.response?.data?.message || "Failed to load product data.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadData();
    
    // Reset state when ID changes to prevent showing old data during transitions
    return () => {
      setQty(1);
      setSelectedSize('');
    };
  }, [loadData]);

  return {
    product,
    vendor,
    recommended,
    loading,
    error,
    selectedVariant,
    setSelectedVariant,
    selectedSize,
    setSelectedSize,
    qty,
    setQty
  };
}