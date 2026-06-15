'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Percent, Target, Sparkles, ArrowRight, 
  Banknote, MousePointerClick, Activity, Clock, 
  Loader2, Inbox, Bell
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';
import CreateCouponModal from '@/src/components/vendor/CreateCouponModal';

interface MarketingStats {
  totalRevenue: number;
  totalUses: number;
  activeCoupons: number;
}

export default function VendorMarketingHub() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [stats, setStats] = useState<MarketingStats>({ totalRevenue: 0, totalUses: 0, activeCoupons: 0 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMarketingData = useCallback(async () => {
    try {
      setLoading(true);
      const [couponRes, statsRes] = await Promise.all([
        api.get('/vendor/marketing/coupons'), 
        api.get('/vendor/marketing/all') 
      ]);
      
      setCoupons(Array.isArray(couponRes.data) ? couponRes.data : []);
      
      if (statsRes.data) {
        setStats({
          totalRevenue: Number(statsRes.data.totalRevenue || 0),
          totalUses: Number(statsRes.data.totalUses || 0),
          activeCoupons: Number(statsRes.data.activeCoupons || 0)
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("MARKETING_SYNC_FAILURE");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchMarketingData(); 
  }, [fetchMarketingData]);

  if (loading && coupons.length === 0) return <LoadingState />;

  const safeStats = stats || { totalRevenue: 0, totalUses: 0, activeCoupons: 0 };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-32 animate-in fade-in duration-700 text-zinc-100">
      
      {/* 🚀 1. STICKY MOBILE HEADER LABEL */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md py-6 flex justify-between items-center border-b border-zinc-900/60">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">
            Marketing
          </h1>
          <p className="text-[#991b1b] text-xs font-semibold uppercase tracking-widest mt-1">
            Growth Intelligence Hub
          </p>
        </div>
        <button className="relative p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#991b1b] rounded-full" />
        </button>
      </div>

      <div className="space-y-10 mt-10 max-w-7xl mx-auto">

        {/* 🚀 2. MOBILE QUICK STATS GRID */}
        <div className="lg:hidden grid grid-cols-2 gap-4">
          <MobileStatCard label="Attributed Yield" value={`₦${(safeStats.totalRevenue || 0).toLocaleString()}`} />
          <MobileStatCard label="Active Triggers" value={safeStats.activeCoupons || 0} />
        </div>

        {/* 💻 DESKTOP COMPACT CONTROLS HEADER */}
        <div className="hidden lg:flex justify-between items-center border-b border-zinc-900/40 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">Marketing</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Growth Intelligence & Yield Deployment Matrix</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-12 px-6 bg-zinc-100 text-zinc-950 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={14} /> Create Coupon Trigger
          </button>
        </div>

        {/* 🚀 SHARED STATS PARADIGM (Desktop) */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          <StatCard icon={<Banknote size={16} />} label="Protocol Revenue" value={`₦${(safeStats.totalRevenue || 0).toLocaleString()}`} sub="Attributed via promo codes" />
          <StatCard icon={<MousePointerClick size={16} />} label="Engagement Count" value={safeStats.totalUses || 0} sub="Total redemptions logged" />
          <StatCard icon={<Activity size={16} />} label="Active Triggers" value={safeStats.activeCoupons || 0} sub="Live marketing campaign tokens" />
        </div>

        {/* 📱 MOBILE ACTION BUTTON */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="lg:hidden w-full py-4 bg-zinc-100 text-zinc-950 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={16} /> Create New Coupon Token
        </button>

        {/* 📦 COUPON REGISTRY AREA */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-1">
             <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Live_Coupon_Inventory_Node</span>
             <div className="h-[1px] flex-1 bg-zinc-900/60" />
          </div>

          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((c) => <CouponCard key={c.id} coupon={c} />)}
            </div>
          ) : (
            <div className="py-20 text-center bg-[#111113] rounded-2xl border border-zinc-900 shadow-xl">
               <Inbox size={32} className="mx-auto text-zinc-700 mb-4" strokeWidth={1} />
               <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Registry Neutral: No active campaign vectors found.</p>
            </div>
          )}
        </div>

        {/* 🏁 PLATFORM EVENTS ENGINE RUNWAY BANNER */}
        <div className="bg-[#111113] rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden border border-zinc-900 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#991b1b]/5 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 text-center lg:text-left relative z-10">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 shrink-0">
              <Sparkles size={20} className="text-zinc-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white tracking-wide uppercase">Platform Global Protocols</h3>
              <p className="text-[11px] text-zinc-500 max-w-xl leading-relaxed font-medium uppercase tracking-wider">
                Synchronize metrics with automated clearing ecosystems. Inject curated luxury products directly into running marketplace visibility networks.
              </p>
            </div>
          </div>

          <Link 
            href="/vendor/marketing/campaigns" 
            className="h-12 px-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-xl w-full lg:w-auto relative z-10 shrink-0 font-sans"
          >
            Explore Campaigns <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <CreateCouponModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchMarketingData} />
    </div>
  );
}

/* 🎨 OPTIMIZED DESIGN TOKEN COMPONENTS */

function MobileStatCard({ label, value }: { label: string, value: any }) {
  return (
    <div className="bg-[#111113] border border-zinc-900 p-5 rounded-2xl flex flex-col active:scale-95 transition-all">
      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className="text-lg font-light font-mono text-zinc-200 mt-2 tracking-tight">{value}</span>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: any, sub: string }) {
  return (
    <div className="bg-[#111113] border border-zinc-900 p-6 rounded-2xl flex justify-between items-start relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
      <div className="space-y-4 flex-1 min-w-0 pr-2">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase truncate">{label}</p>
          <h2 className="text-xl font-light font-mono tracking-tight text-white uppercase truncate">{value}</h2>
        </div>
        <p className="text-[9px] font-medium text-zinc-600 uppercase tracking-wide truncate">{sub}</p>
      </div>
      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white transition-colors shadow-inner shrink-0">
        {icon}
      </div>
    </div>
  );
}

function CouponCard({ coupon }: { coupon: any }) {
  const isExpired = coupon.endDate ? new Date(coupon.endDate) < new Date() : false;
  const activeRedemptions = coupon.usedCount ?? coupon._count?.usages ?? 0;

  return (
    <div className="bg-[#111113] border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden transition-all hover:border-zinc-800">
      {isExpired && (
        <div className="absolute top-6 right-6 text-[8px] font-bold bg-zinc-950 border border-zinc-800 text-[#991b1b] px-2.5 py-1 rounded-md uppercase tracking-widest font-mono">
          Expired
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md text-[9px] font-bold uppercase tracking-wider font-mono">
            NODE_REG
          </span>
          {coupon.endDate && (
            <div className="flex items-center gap-1.5 text-[9px] font-medium text-zinc-500 uppercase tracking-wide font-mono">
              <Clock size={11} className="text-zinc-600" /> {new Date(coupon.endDate).toLocaleDateString()}
            </div>
          )}
        </div>
        {!isExpired && (
          <div className="p-3 bg-zinc-900 border border-zinc-800/60 rounded-xl text-zinc-400">
            <Percent size={15} strokeWidth={2} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-medium text-white uppercase tracking-wider leading-none">
          {coupon.code || "UNKNOWN"}
        </h3>
        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed line-clamp-2 uppercase tracking-wide">
          {coupon.description || "Automated deployment targeting specific consumer classes."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900/60 font-mono">
        <div>
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Yield Distribution</span>
          <p className="text-xs font-medium text-zinc-300 mt-0.5">
            {Number(coupon.discountValue || 0)}{coupon.discountType === 'PERCENTAGE' ? '%' : ' ₦'} OFF
          </p>
        </div>
        <div>
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Redemptions</span>
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium mt-0.5">
            <Target size={12} className="text-zinc-600" />
            <span className="text-xs">{activeRedemptions} logging lines</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] gap-4">
      <Loader2 className="animate-spin text-[#991b1b]" size={28} />
      <p className="text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase">Syncing Marketing Core Registry...</p>
    </div>
  );
}