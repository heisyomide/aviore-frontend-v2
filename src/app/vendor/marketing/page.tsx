'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Megaphone, Plus, Percent, Target, 
  Sparkles, Zap, ArrowRight, Banknote, MousePointerClick,
  Activity, Clock, Loader2, Inbox, Bell, ChevronRight
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
        api.get('/vendor/marketing/stats') 
      ]);
      setCoupons(couponRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error("MARKETING_SYNC_FAILURE");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMarketingData(); }, [fetchMarketingData]);

  if (loading && coupons.length === 0) return <LoadingState />;

  return (
    <div className="min-h-screen bg-white lg:bg-[#FAFAFA] pb-32 animate-in fade-in duration-700">
      
      {/* 🚀 1. STICKY MOBILE LABEL (Top-Left Identity) */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-8 flex justify-between items-center border-b border-slate-50">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Marketing
          </h1>
          <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
        </div>
        <button className="relative p-2 text-slate-400">
          <Bell size={24} strokeWidth={2.5} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
        </button>
      </div>

      <div className="px-6 lg:px-10 space-y-10 mt-6 max-w-7xl mx-auto">

        {/* 🚀 2. MOBILE STATS (Full-Width Overlap Grid) */}
        <div className="lg:hidden grid grid-cols-2 gap-4">
          <MobileStatCard label="Attributed" value={`₦${stats.totalRevenue.toLocaleString()}`} color="bg-blue-600" />
          <MobileStatCard label="Live Coupons" value={stats.activeCoupons} color="bg-slate-900" />
        </div>

        {/* 💻 DESKTOP HEADER (Preserved Context) */}
        <div className="hidden lg:flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Marketing</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 italic">Growth Intelligence & Yield Deployment</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} /> Create Coupon 
          </button>
        </div>

        {/* 🚀 SHARED STATS (Desktop Context) */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          <StatCard icon={<Banknote size={18} />} label="Protocol Revenue" value={`₦${stats.totalRevenue.toLocaleString()}`} sub="Attributed via promo codes" />
          <StatCard icon={<MousePointerClick size={18} />} label="Engagement Count" value={stats.totalUses} sub="Total redemptions logged" />
          <StatCard icon={<Activity size={18} />} label="Active Triggers" value={stats.activeCoupons} sub="Live marketing nodes" />
        </div>

        {/* 📱 MOBILE ACTION BUTTON */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="lg:hidden w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> Create New Coupon
        </button>

        {/* 📦 COUPON REGISTRY */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-1">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Live_Coupon_Inventory</span>
             <div className="h-[1px] flex-1 bg-slate-100" />
          </div>

          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((c) => <CouponCard key={c.id} coupon={c} />)}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-4xl border border-slate-100 shadow-sm">
               <Inbox size={48} className="mx-auto text-slate-100 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registry Neutral: No active triggers.</p>
            </div>
          )}
        </div>

        {/* 🏁 PLATFORM EVENTS BANNER (Preserved Context) */}
        <div className="bg-[#0F172A] rounded-[2.5rem] lg:rounded-4xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-6 text-center lg:text-left">
            <div className="p-5 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 text-blue-500">
              <Sparkles size={28} fill="currentColor" className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl lg:text-3xl font-black text-white uppercase italic tracking-tight">Platform Protocols</h3>
              <p className="text-[10px] lg:text-[11px] text-slate-400 max-w-md leading-relaxed font-medium uppercase tracking-wider italic">
                Synchronize your store with global events like <strong>Registry Clearances</strong>. Inject artifacts into trending nodes.
              </p>
            </div>
          </div>

          <Link 
            href="/vendor/marketing/campaigns" 
            className="relative z-10 h-14 px-10 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-4 group/btn shadow-xl w-full lg:w-auto"
          >
            Explore Campaigns <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <CreateCouponModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchMarketingData} />
    </div>
  );
}

/* 🎨 SUB-COMPONENTS (PRESERVED) */

function MobileStatCard({ label, value, color }: any) {
  return (
    <div className={`${color} p-6 rounded-[2.2rem] text-white shadow-xl flex flex-col justify-center active:scale-95 transition-all`}>
      <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">{label}</span>
      <span className="text-lg font-black italic tracking-tighter mt-1">{value}</span>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="bg-white border border-slate-100 p-8 rounded-4xl shadow-sm group hover:border-blue-100 transition-all">
      <div className="p-3 bg-slate-50 rounded-xl text-blue-600 w-fit mb-6 group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">{value}</p>
        <p className="text-[9px] font-bold text-slate-300 uppercase italic mt-1.5">{sub}</p>
      </div>
    </div>
  );
}

function CouponCard({ coupon }: { coupon: any }) {
  const isExpired = new Date(coupon.endDate) < new Date();

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6 hover:border-blue-200 transition-all shadow-sm relative group overflow-hidden active:scale-98">
      {isExpired && (
        <div className="absolute top-6 right-6 text-[8px] font-black bg-red-50 text-red-500 px-3 py-1 rounded-lg uppercase tracking-widest border border-red-100">Expired</div>
      )}
      
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-tighter italic">REG_NODE</span>
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase italic">
            <Clock size={10} /> {new Date(coupon.endDate).toLocaleDateString()}
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
          <Percent size={20} strokeWidth={3} />
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors leading-none">{coupon.code}</h3>
        <p className="text-[10px] text-slate-400 mt-3 italic font-medium leading-relaxed line-clamp-2 uppercase tracking-tight">
          {coupon.description || "Automated marketing ."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
        <div>
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Yield</span>
          <p className="text-sm font-black italic text-slate-800">
            {Number(coupon.discountValue)}% {coupon.discountType === 'PERCENTAGE' ? 'Discount' : 'Fixed'}
          </p>
        </div>
        <div>
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Redemptions</span>
          <div className="flex items-center gap-1.5 text-slate-800 font-black italic">
            <Target size={14} className="text-slate-200" />
            <span className="text-sm">{coupon.usedCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400">Syncing_Marketing_Registry...</p>
    </div>
  );
}