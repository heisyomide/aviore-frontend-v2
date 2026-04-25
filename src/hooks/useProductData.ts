'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/src/lib/axios';

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
  const [data, setData] = useState({ product: null, vendor: null, recommended: [] });
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

    // Initial state reset
    setQty(1);
    setSelectedSize('');
    setSelectedVariant(null);

    try {
      const { data: productData } = await api.get(`/products/${productId}`);

      const [vRes, rRes] = await Promise.allSettled([
        api.get(`/storefront/vendors/public-profile/${productData.vendorId}`),
        api.get('/products', { params: { category: productData.category?.slug, limit: 8 } })
      ]);

// Inside src/hooks/useProductData.ts -> loadData function

if (currentIdRef.current === productId) {
  setData({
    product: productData,
    vendor: productData.vendor || null, // API already includes vendor!
    recommended: rRes.status === 'fulfilled' 
      ? (rRes.value.data?.data || []).filter((p: any) => p.id !== productId) 
      : [],
  });

  // Check if variants exist in the response
  if (productData.variants && productData.variants.length > 0) {
    // Only set if we don't have one selected to prevent the #310 loop
    setSelectedVariant((prev: any) => prev ? prev : productData.variants[0]);
  }
}
    } catch (err: any) {
      console.error("PRODUCT_HOOK_ERROR:", err);
      setError("Product not found.");
    } finally {
      if (currentIdRef.current === productId) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]); // 🔥 Only re-create if productId changes

  useEffect(() => {
    loadData();
  }, [productId]); // 🔥 Only run when productId changes, NOT loadData

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