'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Star,
  ArrowRight,
  ShieldCheck,
  Store,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface PopularVendorsProps {
  initialVendors?: any[];
}

export function PopularVendorsSection({
  initialVendors = [],
}: PopularVendorsProps) {
  const router = useRouter();

  const [vendors, setVendors] = useState<any[]>(initialVendors);
  const [loading, setLoading] = useState(vendors.length === 0);

  useEffect(() => {
    if (vendors.length === 0) {
      const fetchVendors = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;

          const response = await axios.get(
            `${API_URL}/storefront/vendors`
          );

          const data = Array.isArray(response.data)
            ? response.data
            : [];

          setVendors(data.slice(0, 8));
        } catch (err) {
          console.error('Registry_Sync_Error', err);
        } finally {
          setLoading(false);
        }
      };

      fetchVendors();
    }
  }, [vendors.length]);

  const doubleVendors = useMemo(
    () => [...vendors, ...vendors],
    [vendors]
  );

  if (loading) return <LoadingBannerSkeleton />;

  return (
    <section className="relative overflow-hidden py-14 md:py-16 bg-gradient-to-b from-[#fff7fa] via-white to-[#fff8f4] border-y border-[#f3e5ea]">

      {/* BACKGROUND LIGHTS */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Pink blur */}
        <div className="absolute -top-24 left-[-10%] w-[400px] h-[400px] bg-[#A4143D]/10 rounded-full blur-[120px]" />

        {/* Peach blur */}
        <div className="absolute top-[20%] right-[-5%] w-[350px] h-[350px] bg-orange-200/30 rounded-full blur-[120px]" />

        {/* White glow */}
        <div className="absolute bottom-[-20%] left-[30%] w-[500px] h-[500px] bg-white rounded-full blur-[120px]" />

        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
      </div>

      {/* EDGE FADES */}
      <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-[#fff7fa] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-[#fff8f4] to-transparent z-20 pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-30 flex items-center justify-between px-4 md:px-8 max-w-[1700px] mx-auto mb-8">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#A4143D]/10 flex items-center justify-center border border-[#A4143D]/10">
            <Sparkles size={16} className="text-[#A4143D]" />
          </div>

          <div>
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#A4143D] block">
              VERIFIED STOREFRONTS
            </span>

            <h2 className="text-xl md:text-2xl font-black tracking-tight text-zinc-950">
              Popular Vendors On Aviorè
            </h2>
          </div>
        </div>

        <button
          onClick={() => router.push('/vendors')}
          className="hidden md:flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase text-zinc-500 hover:text-[#A4143D] transition-colors group"
        >
          Explore Vendors
          <ArrowRight
            size={13}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* RUNWAY */}
      <div className="relative z-10 overflow-hidden">

        <motion.div
          className="flex items-center gap-5 md:gap-7 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 42,
            ease: 'linear',
            repeat: Infinity,
          }}
          whileHover={{
            transition: {
              duration: 90,
            },
          }}
        >

          {doubleVendors.map((vendor, index) => (
            <div
              key={`${vendor.id}-${index}`}
              className="flex items-center gap-5 shrink-0"
            >

              {/* VENDOR CARD */}
              <div
                onClick={() =>
                  router.push(
                    `/vendors/${vendor.slug || vendor.id}`
                  )
                }
                className="
                  group/card
                  relative
                  flex
                  items-center
                  gap-4
                  min-w-[300px]
                  md:min-w-[340px]
                  bg-white/80
                  backdrop-blur-xl
                  border
                  border-white
                  rounded-[2rem]
                  px-5
                  py-5
                  shadow-[0_10px_40px_rgba(0,0,0,0.04)]
                  hover:shadow-[0_20px_60px_rgba(164,20,61,0.12)]
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  cursor-pointer
                  overflow-hidden
                "
              >

                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#A4143D]/[0.03] via-transparent to-orange-100/30" />

                {/* IMAGE */}
                <div className="relative w-16 h-16 rounded-[1.4rem] overflow-hidden border border-zinc-100 bg-gradient-to-br from-[#fff7fa] to-white shrink-0">

                  {vendor.imageUrl ? (
                    <Image
                      src={
                        vendor.imageUrl.startsWith('http')
                          ? vendor.imageUrl
                          : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${vendor.imageUrl}`
                      }
                      alt={vendor.storeName}
                      fill
                      className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg font-black text-[#A4143D]">
                        {vendor.storeName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-center gap-2 mb-1.5">

                    <h3 className="truncate text-sm md:text-[15px] font-black uppercase tracking-tight text-zinc-950">
                      {vendor.storeName}
                    </h3>

                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <ShieldCheck
                        size={10}
                        className="text-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">

                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-100">
                      <Star
                        size={10}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-[10px] font-black text-amber-500">
                        {vendor.rating || '4.9'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-zinc-500">
                      <ShoppingBag size={11} />
                      <span className="text-[10px] font-bold uppercase tracking-wide">
                        {vendor._count?.products || 0} Products
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="w-9 h-9 rounded-full bg-[#A4143D]/5 border border-[#A4143D]/10 flex items-center justify-center shrink-0 group-hover/card:bg-[#A4143D] transition-colors">
                  <ArrowRight
                    size={14}
                    className="text-[#A4143D] group-hover/card:text-white group-hover/card:translate-x-0.5 transition-all"
                  />
                </div>
              </div>

              {/* CTA CARD */}
              {index % 4 === 3 && (
                <div
                  onClick={() =>
                    router.push('/become-a-vendor')
                  }
                  className="
                    group/cta
                    relative
                    overflow-hidden
                    flex
                    items-center
                    gap-4
                    min-w-[320px]
                    md:min-w-[360px]
                    rounded-[2rem]
                    px-6
                    py-5
                    bg-gradient-to-r
                    from-[#A4143D]
                    via-[#bc2552]
                    to-[#d13d68]
                    text-white
                    shadow-[0_15px_60px_rgba(164,20,61,0.25)]
                    hover:scale-[1.02]
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >

                  {/* Inner light */}
                  <div className="absolute top-0 left-[-20%] w-[200px] h-full bg-white/10 blur-[50px] rotate-12" />

                  <div className="relative z-10 w-16 h-16 rounded-[1.4rem] bg-white/15 border border-white/20 backdrop-blur-xl flex items-center justify-center shrink-0">
                    <Store size={24} />
                  </div>

                  <div className="relative z-10 flex-1">
                    <span className="text-[9px] font-black tracking-[0.25em] uppercase text-pink-100 block mb-1">
                      START SELLING
                    </span>

                    <h4 className="text-lg font-black leading-tight tracking-tight">
                      Launch Your Storefront
                    </h4>

                    <p className="text-[11px] text-pink-100 mt-1 font-semibold">
                      Build your digital shop on Aviorè
                    </p>
                  </div>

                  <div className="relative z-10 w-10 h-10 rounded-full bg-white text-[#A4143D] flex items-center justify-center group-hover/cta:translate-x-1 transition-transform">
                    <ArrowRight size={15} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LoadingBannerSkeleton() {
  return (
    <div className="w-full py-14 bg-gradient-to-b from-[#fff7fa] to-white overflow-hidden">
      <div className="flex gap-5 px-4 animate-pulse">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="
                min-w-[320px]
                h-[110px]
                rounded-[2rem]
                bg-white
                border
                border-zinc-100
                shadow-sm
              "
            />
          ))}
      </div>
    </div>
  );
}