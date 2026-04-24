'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  refresh: () => Promise<void>;
}

export function useProductData(productId: string): UseProductDataReturn {
  // 1. Data States
  const [data, setData] = useState<{
    product: any;
    vendor: any;
    recommended: any[];
  }>({
    product: null,
    vendor: null,
    recommended: [],
  });

  // 2. UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);

  // Use a ref to track the current productId to prevent race conditions
  const currentIdRef = useRef(productId);

  const loadData = useCallback(async () => {
    if (!productId) return;
    
    currentIdRef.current = productId;
    setLoading(true);
    setError(null);

    try {
      // Step A: Fetch Primary Product Data
      const { data: productData } = await api.get(`/products/${productId}`);

      // Step B: Parallel Fetching for secondary data
      // We wrap these in a try/catch or handle defaults so a vendor API 
      // failure doesn't crash the whole product page.
      const [vRes, rRes] = await Promise.allSettled([
        api.get(`/storefront/vendors/public-profile/${productData.vendorId}`),
        api.get('/products', { 
          params: { category: productData.category?.slug, limit: 8 } 
        })
      ]);

      // Step C: Atomic Update
      // Only update state if the user hasn't navigated away during the fetch
      if (currentIdRef.current === productId) {
        setData({
          product: productData,
          vendor: vRes.status === 'fulfilled' ? vRes.value.data : null,
          recommended: rRes.status === 'fulfilled' 
            ? rRes.value.data.data.filter((p: any) => p.id !== productId) 
            : [],
        });

        // Initialize UI states based on new product
        if (productData.variants?.length > 0) {
          setSelectedVariant(productData.variants[0]);
        } else {
          setSelectedVariant(null);
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
    
    return () => {
      // Cleanup UI states on unmount or ID change
      setQty(1);
      setSelectedSize('');
      setSelectedVariant(null);
    };
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