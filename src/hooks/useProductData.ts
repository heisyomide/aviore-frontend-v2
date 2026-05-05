'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/src/lib/axios';
import { normalizeProduct } from '../utils/normalizer';

export function useProductData(productId: string) {
  const [data, setData] = useState<{
    product: any | null;
    vendor: any | null;
    recommended: any[];
  }>({
    product: null,
    vendor: null,
    recommended: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [qty, setQty] = useState(1);

  const currentIdRef = useRef(productId);

  const loadData = useCallback(async () => {
    if (!productId) return;

    currentIdRef.current = productId;
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Product (The "Find One" API Call)
      const { data: rawProduct } = await api.get(`/products/${productId}`);
      const cleanProduct = normalizeProduct(rawProduct);

      if (currentIdRef.current === productId && cleanProduct) {
        // 2. Fetch Recommended Products
        const rRes = await api.get('/products', { 
          params: { category: cleanProduct?.category?.slug, limit: 8 } 
        }).catch(() => ({ data: { data: [] } }));

        setData({
          product: cleanProduct,
          vendor: cleanProduct.vendor,
          recommended: (rRes.data?.data || rRes.data || [])
            .filter((p: any) => p.id !== productId),
        });

        // 3. Matrix Selection: Auto-pick the first variant if available
        if (cleanProduct.variants && cleanProduct.variants.length > 0) {
          const defaultVariant = cleanProduct.variants[0];
          setSelectedVariant(defaultVariant);
          setQty(1);
        }
      }
    } catch (err: any) {
      console.error("PRODUCT_HOOK_ERROR:", err);
      setError("Product not found or currently unavailable.");
    } finally {
      if (currentIdRef.current === productId) {
        setLoading(false);
      }
    }
  }, [productId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...data,
    loading,
    error,
    selectedVariant,
    setSelectedVariant,
    qty,
    setQty,
    refresh: loadData
  };
}