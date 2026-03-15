// frontend: src/app/shop/[slug]/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react'; // Added 'use'
import { useSearchParams } from 'next/navigation';
import { api } from '@/src/lib/axios';
import { Zap, Loader2 } from 'lucide-react';
import {ProductCard} from '@/src/components/shop/ProductCard';

interface Props {
  params: Promise<{ slug: string }>; // Typed as a Promise
}

export default function PublicStorePage({ params }: Props) {
  // 1. UNWRAP_DYNAMIC_PARAMS
  // This is the fix for the "params is a Promise" error
  const { slug } = use(params); 
  
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const activeCampaignId = searchParams.get('campaign');

  useEffect(() => {
    const fetchShopInventory = async () => {
      try {
        setLoading(true);
        // 2. FETCH_BY_SLUG
        // We now use the unwrapped 'slug' variable
        const response = await api.get(`/products/vendor/${slug}`, {
          params: { campaignId: activeCampaignId }
        });
        setProducts(response.data);
      } catch (error) {
        console.error("FAILED_TO_LOAD_SHOP", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchShopInventory();
  }, [slug, activeCampaignId]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-[#A4143D]" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* 3. CAMPAIGN_BANNER_PROTOCOL */}
      {activeCampaignId && products.length > 0 && (
        <div className="mb-12 p-10 bg-[#A4143D] rounded-[3rem] text-white flex items-center justify-between overflow-hidden relative shadow-2xl">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
               <Zap size={16} fill="currentColor" className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Registry_Verified_Deals</span>
            </div>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Campaign Inventory</h2>
            <p className="text-sm font-medium opacity-80 italic max-w-md">
              Artifacts on this page are currently scale-boosted with exclusive event discounts.
            </p>
          </div>
          <Zap size={120} className="absolute right-0 top-0 -mr-8 -mt-8 opacity-10 rotate-12" />
        </div>
      )}

      {/* 4. PRODUCT_GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No artifacts found in this registry.</p>
        </div>
      )}
    </div>
  );
}