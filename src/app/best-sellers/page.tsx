"use client";

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ProductCard } from '../../components/product/ProductCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { TrendingUp, Trophy, Award, Flame } from 'lucide-react';
import { Navbar } from '@/src/components/navbar/Navbar';
import { normalizeProduct } from '@/src/utils/normalizer';

const BestSellersPage = () => {
  const [rawProducts, setRawProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/storefront/best-sellers`);
        setRawProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("🔥 Bestsellers Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  /**
   * ✅ GRANDMASTER FIX: 
   * Use .flatMap or a boolean filter to ensure TypeScript knows the array 
   * only contains valid Product objects and zero nulls.
   */
  const products = useMemo(() => {
    return rawProducts
      .map(p => normalizeProduct(p))
      .filter((p): p is NonNullable<ReturnType<typeof normalizeProduct>> => p !== null);
  }, [rawProducts]);

  if (loading) return <BestsellersLoadingState />;

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      <Navbar />
      
      <section className="bg-white border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center lg:text-left lg:flex items-center justify-between">
          <div className="lg:max-w-2xl">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-orange-600 font-bold tracking-widest text-sm mb-4">
              <TrendingUp size={18} />
              <span className="uppercase">Real-Time Rankings</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
              Aviorè <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600">Bestsellers</span>
            </h1>
            <p className="text-gray-500 text-lg lg:text-xl font-medium leading-relaxed">
              Based on the last 24 hours of sales across Nigeria. These are the pieces moving the culture right now.
            </p>
          </div>
          
          <div className="hidden lg:flex gap-8 items-center bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">Top 100</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Live Ranking</p>
            </div>
            <div className="w-px h-12 bg-gray-200" /> {/* Updated w-[1px] to w-px */}
            <div className="text-center">
              <p className="text-2xl font-black text-gray-900">Hourly</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Data Updates</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product, index) => (
              <div key={product.id} className="relative group">
                
                <div className="absolute -top-4 -left-4 z-20 pointer-events-none">
                  {index === 0 ? (
                    <div className="bg-linear-to-br from-yellow-400 to-orange-500 p-3 rounded-2xl shadow-xl ring-4 ring-white">
                      <Trophy className="text-white" size={24} />
                    </div>
                  ) : index === 1 ? (
                    <div className="bg-linear-to-br from-gray-300 to-gray-500 p-2.5 rounded-xl shadow-lg ring-4 ring-white">
                      <Award className="text-white" size={20} />
                    </div>
                  ) : index === 2 ? (
                    <div className="bg-linear-to-br from-orange-400 to-red-600 p-2.5 rounded-xl shadow-lg ring-4 ring-white">
                      <Flame className="text-white" size={20} />
                    </div>
                  ) : (
                    <div className="bg-white border-2 border-gray-100 px-3 py-1 rounded-full shadow-sm">
                      <span className="text-sm font-black text-gray-400">#{index + 1}</span>
                    </div>
                  )}
                </div>

                <div className="transition-transform duration-300 group-hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-[40px]">
            <p className="text-2xl font-bold text-gray-300 italic">Calculating sales data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BestsellersLoadingState = () => (
  <div className="max-w-7xl mx-auto px-6 py-20">
    <div className="space-y-4 mb-16">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-16 w-3/4" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-100 w-full rounded-[30px]" /> {/* Updated h-[400px] to h-100 */}
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);

export default BestSellersPage;