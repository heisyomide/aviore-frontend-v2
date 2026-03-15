'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from './shop/ProductCard';
import { ArrowRight, Sparkles, Clock, ShieldCheck, Loader2 } from 'lucide-react';


export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  discount: number;
  themeColor: string;
  endDate: string;
  products: any[];
}



export function DynamicCampaignSection({ campaign: initialCampaign }: { campaign?: any }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState(initialCampaign);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(!initialCampaign);

  // 🛰️ API CONNECTION (Internal Fallback)
  useEffect(() => {
    if (!initialCampaign) {
      const fetchCampaign = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storefront/campaigns/active`);
          const data = await res.json();
          if (data && data.length > 0) setCampaign(data[0]); // Take the first active campaign
        } catch (err) {
          console.error("Failed to fetch campaign", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCampaign();
    }
  }, [initialCampaign]);

  // ⏲️ TIMER LOGIC
  useEffect(() => {
    if (!campaign?.endDate) return;
    const target = new Date(campaign.endDate).getTime();
    const tick = () => setTimeLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [campaign?.endDate]);

  const time = useMemo(() => {
    const d = Math.floor(timeLeft / (3600 * 24));
    const h = Math.floor((timeLeft % (3600 * 24)) / 3600).toString().padStart(2, '0');
    const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
    return { d, h, m };
  }, [timeLeft]);

  if (loading) return <CampaignLoader />;
  if (!campaign) return null; // Still nothing? Don't render.

  return (
    <section className="max-w-[98rem] mx-auto px-4 py-8 group/campaign">
      <div 
        className="rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-white/5"
        style={{ backgroundColor: campaign.themeColor || '#A4143D' }}
      >
        <div className="lg:w-1/3 p-10 lg:p-14 flex flex-col justify-between relative text-white">
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 bg-black/30 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
              <Sparkles size={14} className="text-yellow-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {campaign.discount || 0}% OFF EVENT
              </span>
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.85]">
              {campaign.title}
            </h2>
            
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest max-w-[280px]">
              {campaign.description}
            </p>

            <div className="flex gap-4 items-center bg-black/20 w-fit p-4 rounded-3xl border border-white/5">
              <TimeBlock unit="DAYS" val={time.d.toString()} />
              <div className="w-px h-8 bg-white/10" />
              <TimeBlock unit="HRS" val={time.h} />
              <div className="w-px h-8 bg-white/10" />
              <TimeBlock unit="MIN" val={time.m} />
            </div>
          </div>

          <button 
            onClick={() => router.push(`/campaigns/${campaign.slug}`)}
            className="mt-12 bg-white text-zinc-950 w-full py-6 rounded-2xl font-black uppercase text-[11px] hover:bg-zinc-100 transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            Explore Collection
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="lg:w-2/3 bg-white p-8 lg:p-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {campaign.products?.slice(0, 6).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CampaignLoader() {
    return (
        <div className="w-full h-96 flex items-center justify-center bg-zinc-50 rounded-[3rem]">
            <Loader2 className="animate-spin text-zinc-300" size={40} />
        </div>
    )
}

function TimeBlock({ unit, val }: { unit: string; val: string }) {
  return (
    <div className="flex flex-col items-center min-w-[45px]">
      <span className="text-3xl font-black italic leading-none">{val}</span>
      <span className="text-[7px] font-bold tracking-[0.1em] opacity-40 mt-1 uppercase">{unit}</span>
    </div>
  );
}