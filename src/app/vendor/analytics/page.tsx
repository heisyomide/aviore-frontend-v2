'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Loader2, AlertCircle, ArrowUpRight, Bell, Layers } from 'lucide-react';
import { api } from '@/src/lib/axios';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await api.get('/vendor/analytics');
      
      if (res.data && res.data.summary) {
        setData(res.data);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error("Intelligence_Sync_Failure", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAnalytics(); 
  }, []);

  if (loading) return <LoadingIntelligence />;
  if (error || !data || !data.summary) return <ErrorState onRetry={fetchAnalytics} />;

  const liveSyncDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const safeSummary = data.summary || { totalRevenue: 0, totalOrders: 0 };
  const safeTopProducts = Array.isArray(data.topProducts) ? data.topProducts : [];

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-32 animate-in fade-in duration-700 text-zinc-100">
      
      {/* 🚀 1. STICKY HEADER NODE (Sleek Dark Glass) */}
      <div className="sticky top-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md py-6 flex justify-between items-center border-b border-zinc-900/60">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">
            Analytics
          </h1>
          <p className="text-[#991b1b] text-xs font-semibold uppercase tracking-widest mt-1">
            Data Matrix Protocol
          </p>
        </div>
        <button className="relative p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#991b1b] rounded-full" />
        </button>
      </div>

      <div className="space-y-10 mt-10">
        
        {/* 🚀 2. THE DYNAMIC HERO VISUALIZER (Brushed Monochromatic Chart Block) */}
        <div className="w-full bg-[#111113] rounded-2xl p-8 border border-zinc-900 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Total Yield Registry</p>
              <h2 className="text-4xl font-light tracking-tight text-white font-mono">
                ₦{Number(safeSummary.totalRevenue || 0).toLocaleString()}
              </h2>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Live Sync</p>
              <p className="text-[9px] font-medium text-zinc-600 font-mono uppercase">{liveSyncDate}</p>
            </div>
          </div>

          {/* DYNAMIC BAR CHART */}
          <div className="h-56 flex items-end justify-between gap-4 relative z-10 px-2">
            {safeTopProducts.length > 0 ? (
              safeTopProducts.map((product: any, i: number) => {
                const percentage = Number(product.revenuePercentage || 0);
                const barHeight = percentage > 0 ? Math.min(Math.max(percentage, 15), 100) : 8;
                
                return (
                  <div key={i} className="flex-1 group/bar relative flex flex-col items-center justify-end h-full">
                    <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 bg-zinc-800 border border-zinc-700 text-white px-2.5 py-1 rounded-lg text-[9px] font-medium transition-all duration-200 pointer-events-none whitespace-nowrap z-30 tracking-wider font-mono">
                      {percentage}% Yield
                    </div>
                    
                    <div 
                      style={{ height: `${barHeight}%` }}
                      className="w-full bg-zinc-900 border border-zinc-800/80 group-hover/bar:bg-zinc-800 group-hover/bar:border-zinc-700 rounded-t-lg transition-all duration-500 relative"
                    />
                    <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-wide mt-2.5 truncate w-full text-center">
                      {product.title || "Unknown"}
                    </p>
                  </div>
                );
              })
            ) : (
              [35, 20, 15, 25, 10].map((h, i) => (
                <div key={i} className="flex-1 h-full flex items-end">
                  <div style={{ height: `${h}%` }} className="w-full bg-zinc-950/40 rounded-t-lg border border-dashed border-zinc-900" />
                </div>
              ))
            )}
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-zinc-800/5 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        </div>

        {/* 🚀 3. OPERATIONAL PERFORMANCE GRID */}
        <div className="grid grid-cols-2 gap-6">
           <MetricNode 
            label="Gross Liquidity" 
            val={`₦${Number(safeSummary.totalRevenue || 0).toLocaleString()}`} 
            icon={<TrendingUp size={16}/>} 
           />
           <MetricNode 
            label="Orders Logged" 
            val={Number(safeSummary.totalOrders || 0).toLocaleString()} 
            icon={<ShoppingCart size={16}/>} 
           />
        </div>

        {/* 🚀 4. REQUISITION REGISTRY */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">High-Yield Nodes</h3>
             <div className="p-2 bg-zinc-900/40 rounded-xl text-zinc-500 border border-zinc-900">
               <Layers size={14}/>
             </div>
          </div>

          <div className="bg-[#111113] rounded-2xl border border-zinc-900/80 overflow-hidden divide-y divide-zinc-900/60 shadow-xl">
            {safeTopProducts.length > 0 ? safeTopProducts.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-5 hover:bg-zinc-950/40 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-zinc-900/60 rounded-xl flex items-center justify-center text-zinc-400 font-medium border border-zinc-800/50 shrink-0 font-sans">
                        {(p.title || "P").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 space-y-1">
                        <p className="text-xs font-medium text-white tracking-wide truncate max-w-[180px]">{p.title || "Unknown"}</p>
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Registry Hub_0{idx + 1}</p>
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <p className="text-xs font-medium text-zinc-300 font-mono">₦{Number(p.revenue || 0).toLocaleString()}</p>
                    <div className="w-16 h-1 bg-zinc-950 rounded-full mt-1 overflow-hidden border border-zinc-900">
                        <div 
                            className="bg-zinc-700 h-full transition-all duration-1000" 
                            style={{ width: `${Math.min(Number(p.revenuePercentage || 0), 100)}%` }} 
                        />
                    </div>
                </div>
              </div>
            )) : (
              <div className="py-16 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">No Registry Nodes Active</p>
              </div>
            )}
          </div>
        </div>

        {/* 📋 EXPORT ACTION TRIGGER */}
        <button className="w-full py-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer">
            Export Deep Intel Report
        </button>
      </div>
    </div>
  );
}

function MetricNode({ label, val, icon }: any) {
  return (
    <div className="bg-[#111113] border border-zinc-900 p-6 rounded-2xl flex justify-between items-center relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
       <div className="space-y-2 min-w-0 flex-1 pr-2">
         <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase truncate">{label}</p>
         <h2 className="text-xl font-light font-mono text-white tracking-tight truncate leading-none">{val}</h2>
       </div>
       <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white transition-all shadow-inner shrink-0">
         {icon}
       </div>
    </div>
  );
}

function LoadingIntelligence() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] gap-4">
      <Loader2 className="animate-spin text-[#991b1b]" size={28} />
      <p className="text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase">Synchronizing Intelligence Engine...</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] p-6 text-center">
      <AlertCircle size={32} className="text-[#991b1b] mb-4" />
      <h3 className="text-sm font-bold text-white uppercase tracking-widest">Node Desync</h3>
      <button 
        onClick={onRetry} 
        className="mt-6 px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all cursor-pointer"
      >
        Retry Protocol
      </button>
    </div>
  );
}