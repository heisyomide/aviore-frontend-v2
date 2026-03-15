// src/hooks/use-storefront.ts
"use client";
import { useState, useEffect } from "react";
import { api } from "@/src/lib/axios";

export function useStorefront() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setLoading(true);
      const res = await api.get("/storefront/homepage");
      setData(res.data);
    } catch (err) {
      console.error("STOREFRONT_SYNC_FAILURE", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  return { data, loading, refresh };
}