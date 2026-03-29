'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Loader2, BarChart3, Target, Globe, AlertCircle, Inbox } from 'lucide-react';
import { api } from '@/src/lib/axios';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.get('/vendor/analytics');
      setData(res.data);
    } catch (e) {
      console.error("Intelligence_Sync_Failure");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIntelligence />;
  
  // 🚀 Safety Guard: If sync failed or data is missing, show error node
  if (error || !data || !data.summary) return <ErrorState onRetry={fetchAnalytics} />;

  return (
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10 animate-in fade-in duration-500">
      
      {/* 🚀 EXECUTIVE HEADER */}


        {/* HIGH-LEVEL PERFORMANCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard 
            title="Gross Liquidity" 
            value={`₦${(data.summary?.totalRevenue || 0).toLocaleString()}`} 
            icon={DollarSign} 
            isPrimary 
          />
          <MetricCard 
            title="Fulfillment Units" 
            value={data.summary?.totalOrders || 0} 
            trend="+5.2%" 
            icon={ShoppingCart} 
          />
          <MetricCard 
            title="Catalogue Depth" 
            value={data.summary?.productCount || 0} 
            icon={Target} 
          />
        </div>

        {/* ANALYTICS SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Visualizer */}
          <div className="lg:col-span-8 bg-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-4xl shadow-sm border border-slate-100 relative overflow-hidden group min-h-[400px]">
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Revenue Velocity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">7-Day Trajectory Registry</p>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 italic">
                <Globe size={12} className="animate-spin-slow" /> Network Live
              </div>
            </div>
            
            <div className="h-64 lg:h-72 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 group-hover:border-blue-100 transition-all duration-500">
               <TrendingUp size={48} className="text-slate-200 mb-4 group-hover:text-blue-500/20 group-hover:scale-110 transition-all" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Initializing Charting Node...</p>
            </div>
          </div>

          {/* Product Leaderboard */}
          <div className="lg:col-span-4 bg-[#1E293B] p-8 lg:p-10 rounded-[2.5rem] lg:rounded-4xl shadow-2xl text-white border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -mr-16 -mt-16" />
            <div className="flex items-center gap-3 mb-10 relative z-10">
               <BarChart3 className="text-blue-400" size={20} strokeWidth={3} />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">High-Yield Nodes</h3>
            </div>
            
            <div className="space-y-8 relative z-10">
              {data.topProducts?.length > 0 ? data.topProducts.map((p: any, idx: number) => (
                <div key={idx} className="group cursor-default">
                  <div className="flex justify-between items-end mb-3">
                    <div className="min-w-0 flex-1">
                       <p className="text-[11px] font-black uppercase tracking-tight text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1 italic">{p.title}</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase mt-1.5 tracking-widest">Registry Contribution</p>
                    </div>
                    <p className="text-xs font-black text-white ml-4 italic tracking-tighter">₦{p.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                     <div 
                       className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
                       style={{ width: `${(p.revenue / (data.summary.totalRevenue || 1)) * 100}%` }}
                     />
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center opacity-30">
                  <Inbox className="mx-auto mb-2" size={32} />
                  <p className="text-[10px] font-black uppercase">No Node Data</p>
                </div>
              )}
            </div>

            <button className="w-full mt-12 py-4 bg-slate-800/50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border border-slate-700 active:scale-95">
                Export Intelligence Report
            </button>
          </div>
        </div>
      </div>
   
  );
}

/* 🎨 SUB-COMPONENTS */

function MetricCard({ title, value, trend, icon: Icon, isPrimary }: any) {
  return (
    <div className={`p-8 lg:p-10 rounded-[2.5rem] lg:rounded-4xl shadow-xl relative transition-all hover:translate-y-[-4px] group border ${
      isPrimary 
        ? 'bg-blue-600 text-white border-blue-500 shadow-blue-900/10' 
        : 'bg-white text-slate-900 border-slate-100 shadow-slate-200/50 hover:border-blue-100'
    }`}>
      <div className="flex justify-between items-start mb-10">
        <div className={`p-4 rounded-2xl transition-transform group-hover:rotate-6 ${
          isPrimary ? 'bg-white/10 border border-white/20' : 'bg-slate-900 text-white shadow-lg'
        }`}>
          <Icon size={24} strokeWidth={3} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100 uppercase italic">
            <TrendingUp size={14} strokeWidth={3} /> {trend}
          </div>
        )}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${
        isPrimary ? 'text-blue-100' : 'text-slate-400'
      }`}>{title}</p>
      <h2 className="text-3xl lg:text-4xl font-black tracking-tighter italic leading-none">{value}</h2>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F4F7FE] p-6 text-center">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-100">
        <AlertCircle size={40} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Sync Interrupted</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-xs mb-8">
        The Intelligence Node was unable to fetch the global registry.
      </p>
      <button onClick={onRetry} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
        Retry Protocol
      </button>
    </div>
  );
}

function LoadingIntelligence() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F4F7FE] gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-600" size={56} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full animate-ping" />
        </div>
      </div>
      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 italic animate-pulse">Crunching Global Intelligence Nodes...</p>
    </div>
  );
}