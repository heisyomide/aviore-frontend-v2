'use client';
import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Loader2, Award, ArrowUpRight, BarChart3, Target, Zap, Globe } from 'lucide-react';
import { api } from '@/src/lib/axios';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/vendor/analytics');
      setData(res.data);
    } catch (e) {
      console.error("Intelligence_Sync_Failure");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIntelligence />;

  return (
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10">
      
      {/* 🚀 EXECUTIVE HEADER */}
      <div className="p-6 lg:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Market Intelligence</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Growth Nodes & Velocity Analysis</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100 shrink-0">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Target size={20} strokeWidth={3} />
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Node Status</p>
                <p className="text-[10px] font-black text-slate-900 uppercase">Synchronized</p>
             </div>
          </div>
        </div>

        {/* HIGH-LEVEL PERFORMANCE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard 
            title="Gross Liquidity" 
            value={`₦${data.summary.totalRevenue.toLocaleString()}`} 
            icon={DollarSign} 
            isPrimary 
          />
          <MetricCard 
            title="Fulfillment Units" 
            value={data.summary.totalOrders} 
            trend="+5.2%" 
            icon={ShoppingCart} 
          />
          <MetricCard 
            title="Catalogue Depth" 
            value={data.summary.productCount} 
            icon={Zap} 
          />
        </div>

        {/* ANALYTICS SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Visualizer */}
          <div className="lg:col-span-8 bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-4xl shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Revenue Velocity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">7-Day Trajectory</p>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 italic">
                <Globe size={12} className="animate-spin-slow" /> Network Live
              </div>
            </div>
            
            <div className="h-64 lg:h-80 flex flex-col items-center justify-center bg-[#F8FAFC] rounded-[2rem] border-2 border-dashed border-slate-200 group-hover:border-blue-200 transition-colors">
               <TrendingUp size={48} className="text-slate-200 mb-3 group-hover:text-blue-100 transition-colors" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Initializing Charting Node...</p>
            </div>
          </div>

          {/* Product Leaderboard */}
          <div className="lg:col-span-4 bg-[#1E293B] p-8 lg:p-10 rounded-[2.5rem] lg:rounded-4xl shadow-2xl text-white border border-slate-800">
            <div className="flex items-center gap-3 mb-10">
               <BarChart3 className="text-orange-500" size={20} strokeWidth={3} />
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">High-Performance Nodes</h3>
            </div>
            
            <div className="space-y-8">
              {data.topProducts.map((p: any, idx: number) => (
                <div key={idx} className="group relative">
                  <div className="flex justify-between items-end mb-3">
                    <div className="min-w-0 flex-1">
                       <p className="text-[11px] font-black uppercase tracking-tight text-slate-200 group-hover:text-orange-500 transition-colors line-clamp-1 italic">{p.title}</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Registry Contribution</p>
                    </div>
                    <p className="text-xs font-black text-white ml-4 italic">₦{p.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div 
                       className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.5)]" 
                       style={{ width: `${(p.revenue / data.summary.totalRevenue) * 100}%` }}
                     />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-12 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border border-slate-700">
               Export Deep Intel Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 📊 COMPONENTS */

function MetricCard({ title, value, trend, icon: Icon, isPrimary }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] lg:rounded-4xl shadow-xl relative transition-all hover:translate-y-[-4px] group border ${
      isPrimary 
        ? 'bg-blue-600 text-white border-blue-500 shadow-blue-200' 
        : 'bg-white text-slate-900 border-slate-100 shadow-slate-100 hover:border-blue-100'
    }`}>
      <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${
          isPrimary ? 'bg-blue-500 shadow-inner' : 'bg-slate-900 text-white'
        }`}>
          <Icon size={24} strokeWidth={3} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[9px] font-black bg-green-50 text-green-600 px-3 py-1.5 rounded-xl border border-green-100">
            <ArrowUpRight size={14} strokeWidth={3} /> {trend}
          </div>
        )}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-1 ${
        isPrimary ? 'text-blue-100' : 'text-slate-400'
      }`}>{title}</p>
      <h2 className="text-3xl lg:text-4xl font-black tracking-tighter italic leading-none">{value}</h2>
    </div>
  );
}

function LoadingIntelligence() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-ping" />
        </div>
      </div>
      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 italic">Crunching Global Intelligence Nodes...</p>
    </div>
  );
}