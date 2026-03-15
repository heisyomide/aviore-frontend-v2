'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Megaphone, Plus, Percent, Target, 
  Sparkles, Zap, ArrowRight, Banknote, MousePointerClick,
  Activity, Clock, Loader2, Inbox
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
      toast.error("IDENTITY_SYNC_FAILURE");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMarketingData(); }, [fetchMarketingData]);

  if (loading && coupons.length === 0) return <LoadingState />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-500 pb-24">
      
      {/* 1. PERFORMANCE ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard 
          icon={<Banknote size={18} />} 
          label="Attributed Revenue" 
          value={`₦${stats.totalRevenue.toLocaleString()}`} 
          sub="Sales via promotions"
        />
        <StatCard 
          icon={<MousePointerClick size={18} />} 
          label="Protocol Usage" 
          value={`${stats.totalUses} Redemptions`} 
          sub="Customer interactions"
        />
        <StatCard 
          icon={<Activity size={18} />} 
          label="Active Nodes" 
          value={stats.activeCoupons} 
          sub="Live marketing triggers"
        />
      </div>

      {/* 2. COMMAND HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Sparkles size={12} className="animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Growth_Intelligence_v3</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Marketing Hub</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Inventory Injection & Rewards Deployment</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto h-14 px-8 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-[#A4143D] transition-all active:scale-95 group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> 
          Initialize New Coupon
        </button>
      </div>

      {/* 3. COUPON REGISTRY */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap italic underline decoration-orange-500/50 underline-offset-4">Store_Exclusive_Nodes</span>
           <div className="h-[1px] w-full bg-slate-100" />
        </div>

        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((c) => <CouponCard key={c.id} coupon={c} />)}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
             <Megaphone size={32} className="mx-auto text-slate-200 mb-4 opacity-50" />
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Registry empty. No active triggers.</p>
          </div>
        )}
      </div>

      {/* 4. PLATFORM SCALE BANNER */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A4143D]/20 blur-[100px] -mr-32 -mt-32 group-hover:bg-[#A4143D]/30 transition-all duration-1000" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="p-5 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 text-[#A4143D]">
            <Zap size={24} fill="currentColor" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight">Platform Events</h3>
            <p className="text-[11px] text-slate-400 max-w-md leading-relaxed font-medium italic uppercase tracking-wider">
              Participate in platform-led events like <strong>Ramadan Mega Sale</strong>. Inject products into global registries.
            </p>
          </div>
        </div>

        <Link 
          href="/vendor/marketing/campaigns" 
          className="relative z-10 h-14 px-10 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#A4143D] hover:text-white transition-all flex items-center justify-center gap-4 group/btn shadow-xl w-full lg:w-auto"
        >
          Discover Events <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>

      <CreateCouponModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchMarketingData} 
      />
    </div>
  );
}

/* SUB-COMPONENTS */

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div className="bg-white border border-slate-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl text-[#A4143D] group-hover:bg-orange-50 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">{value}</p>
        <p className="text-[8px] font-bold text-slate-300 uppercase italic mt-1.5">{sub}</p>
      </div>
    </div>
  );
}

function CouponCard({ coupon }: { coupon: any }) {
  const isExpired = new Date(coupon.endDate) < new Date();

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-6 hover:border-[#A4143D]/30 transition-all duration-300 shadow-sm relative overflow-hidden group">
       {isExpired && (
         <div className="absolute top-4 right-4 text-[7px] font-black bg-red-50 text-red-500 px-2.5 py-1 rounded-md uppercase tracking-widest border border-red-100">Expired</div>
       )}
       
       <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Store_Exclusive</span>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-300 uppercase italic">
              <Clock size={10} /> {new Date(coupon.endDate).toLocaleDateString()}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:text-[#A4143D] group-hover:bg-orange-50 transition-all">
            <Percent size={16} />
          </div>
       </div>

       <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-orange-600 transition-colors">{coupon.code}</h3>
          <p className="text-[9px] text-slate-400 mt-2 italic font-medium leading-relaxed line-clamp-2 uppercase">
            {coupon.description || "Vendor discount node."}
          </p>
       </div>

       <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
          <div>
            <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Benefit</span>
            <p className="text-xs font-black italic text-slate-800">
              {Number(coupon.discountValue)}% {coupon.discountType === 'PERCENTAGE' ? 'Off' : 'Fixed'}
            </p>
          </div>
          <div>
            <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Registry_Uses</span>
            <div className="flex items-center gap-1.5 text-slate-800">
              <Target size={12} className="text-slate-300" />
              <span className="text-xs font-black italic">{coupon.usedCount}</span>
            </div>
          </div>
       </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin text-[#A4143D]" size={32} />
      <p className="text-[9px] font-black uppercase tracking-[0.4em] italic animate-pulse">Syncing_Marketing_Registry</p>
    </div>
  );
}