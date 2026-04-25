'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/src/lib/axios';

// 1. Interface must be defined before the function uses it
export interface UseProductDataReturn {
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
  refresh: () => Promise<void>;
}

export function useProductData(productId: string): UseProductDataReturn {
  // Data States
  const [data, setData] = useState<{
    product: any;
    vendor: any;
    recommended: any[];
  }>({
    product: null,
    vendor: null,
    recommended: [],
  });

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);

  const currentIdRef = useRef(productId);

  const loadData = useCallback(async () => {
    if (!productId) return;
    
    currentIdRef.current = productId;
    setLoading(true);
    setError(null);

    // ✅ Reset UI state at the START of a new load, not in a cleanup function
    // This prevents the infinite re-render loop (#310)
    setQty(1);
    setSelectedSize('');
    setSelectedVariant(null);

    try {
      const { data: productData } = await api.get(`/products/${productId}`);

      const [vRes, rRes] = await Promise.allSettled([
        api.get(`/storefront/vendors/public-profile/${productData.vendorId}`),
        api.get('/products', { 
          params: { category: productData.category?.slug, limit: 8 } 
        })
      ]);

      if (currentIdRef.current === productId) {
        setData({
          product: productData,
          vendor: vRes.status === 'fulfilled' ? vRes.value.data : null,
          recommended: rRes.status === 'fulfilled' 
            ? (rRes.value.data?.data || rRes.value.data || []).filter((p: any) => p.id !== productId) 
            : [],
        });

        if (productData.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      }
    } catch (err: any) {
      console.error("PRODUCT_HOOK_ERROR:", err);
      if (currentIdRef.current === productId) {
        setError(err.response?.data?.message || "Product not found or unavailable.");
      }
    } finally {
      if (currentIdRef.current === productId) {
        setLoading(false);
      }
    }
  }, [productId]);

  useEffect(() => {
    loadData();
    
    // ❌ REMOVED: Return cleanup with setters. 
    // Triggering setters in the cleanup of an ID-based effect 
    // is what creates the infinite render loop.
  }, [loadData]);

  return {
    ...data,
    loading,
    error,
    selectedVariant,
    setSelectedVariant,
    selectedSize,
    setSelectedSize,
    qty,
    setQty,
    refresh: loadData
  };
}