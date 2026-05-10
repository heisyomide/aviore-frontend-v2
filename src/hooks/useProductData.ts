'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/src/lib/axios';
import { normalizeProduct } from '../utils/normalizer';

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
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);

  const currentIdRef = useRef(productId);

  const loadData = useCallback(async () => {
    if (!productId) return;

    currentIdRef.current = productId;
    setLoading(true);
    setError(null);

    setQty(1);
    setSelectedSize('');
    setSelectedVariant(null);

    try {
      const { data: rawProduct } = await api.get(`/products/${productId}`);
      const cleanProduct = normalizeProduct(rawProduct);

      const rRes = await api.get('/products', { 
        params: { category: cleanProduct?.category?.slug, limit: 8 } 
      }).catch(() => ({ data: { data: [] } }));

      if (currentIdRef.current === productId && cleanProduct) {
        setData({
          product: cleanProduct,
          vendor: cleanProduct.vendor,
          recommended: (rRes.data?.data || rRes.data || [])
            .filter((p: any) => p.id !== productId),
        });

        // 🔥 FINAL SAFE VARIANT NORMALIZATION (bypassing strict typing)
// inside loadData()
      }
    } catch (err: any) {
      console.error("PRODUCT_HOOK_ERROR:", err);
      setError("Product not found or unavailable.");
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
    selectedSize,
    setSelectedSize,
    qty,
    setQty,
    refresh: loadData
  };
}