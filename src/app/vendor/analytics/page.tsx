'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Loader2, AlertCircle, ArrowUpRight, Bell } from 'lucide-react';
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
      
      // Enforce rigorous validation logic on incoming data structures
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
    month: 'long',
    year: 'numeric'
  });

  const safeSummary = data.summary || { totalRevenue: 0, totalOrders: 0 };
  const safeTopProducts = Array.isArray(data.topProducts) ? data.topProducts : [];

  return (
    <div className="min-h-screen bg-[#0A0F1C] pb-32 animate-in fade-in duration-700">
      
      {/* 🚀 1. STICKY HEADER NODE */}
      <div className="sticky top-0 z-50 bg-[#0A0F1C]/90 backdrop-blur-xl px-6 py-8 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
            Analytics
          </h1>
          <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mt-2 italic">Intelligence Protocol</p>
        </div>
        <button className="relative p-3 bg-white/5 rounded-full border border-white/10 text-white active:scale-90 transition-all">
          <Bell size={22} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-[#0A0F1C]" />
        </button>
      </div>

      <div className="px-6 space-y-10 mt-8">
        
        {/* 🚀 2. THE DYNAMIC HERO VISUALIZER */}
        <div className="w-full bg-white/5 rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Yield Registry</p>
              <h2 className="text-4xl font-black text-white italic tracking-tighter leading-none">
                ₦{Number(safeSummary.totalRevenue || 0).toLocaleString()}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live Sync</p>
              <p className="text-[8px] font-bold text-slate-600 uppercase mt-1">{liveSyncDate}</p>
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
                    <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase shadow-2xl transition-all duration-300 pointer-events-none whitespace-nowrap z-30 tracking-wider">
                      {percentage}% Yield
                    </div>
                    
                    <div 
                      style={{ height: `${barHeight}%` }}
                      className="w-full bg-blue-600/20 group-hover/bar:bg-blue-500 rounded-t-xl transition-all duration-500 relative shadow-[0_0_15px_rgba(37,99,235,0)] group-hover/bar:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    />
                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-tighter mt-2 truncate w-full text-center">
                      {product.title || "Unknown"}
                    </p>
                  </div>
                );
              })
            ) : (
              [35, 20, 15, 25, 10].map((h, i) => (
                <div key={i} className="flex-1 h-full flex items-end">
                  <div style={{ height: `${h}%` }} className="w-full bg-white/5 rounded-t-xl border border-dashed border-white/5" />
                </div>
              ))
            )}
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        </div>

        {/* 🚀 3. OPERATIONAL PERFORMANCE */}
        <div className="grid grid-cols-2 gap-4">
           <MetricNode 
            label="Gross Liquidity" 
            val={`₦${Number(safeSummary.totalRevenue || 0).toLocaleString()}`} 
            icon={<DollarSign size={18}/>} 
            isPrimary
           />
           <MetricNode 
            label="Orders Logged" 
            val={Number(safeSummary.totalOrders || 0).toLocaleString()} 
            icon={<ShoppingCart size={18}/>} 
           />
        </div>

        {/* 🚀 4. REQUISITION REGISTRY */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">High-Yield Nodes</h3>
             <button className="p-2 bg-white/5 rounded-xl text-blue-500 hover:bg-white/10 transition-colors">
               <ArrowUpRight size={18}/>
             </button>
          </div>

          <div className="space-y-4">
            {safeTopProducts.length > 0 ? safeTopProducts.map((p: any, idx: number) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[2.2rem] flex items-center justify-between group active:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-black italic border border-blue-500/20 shadow-inner">
                        {(p.title || "P").charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-black text-white uppercase italic truncate max-w-[150px] leading-none">{p.title || "Unknown"}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-2 tracking-widest">Registry Hub_{idx + 1}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-black text-white italic tracking-tighter">₦{Number(p.revenue || 0).toLocaleString()}</p>
                    <div className="w-16 h-1 bg-white/5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                            className="bg-blue-600 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
                            style={{ width: `${Math.min(Number(p.revenuePercentage || 0), 100)}%` }} 
                        />
                    </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center opacity-30 text-white uppercase text-[10px] font-black italic tracking-widest border-2 border-dashed border-white/5 rounded-[2.5rem]">
                No Registry Nodes Active
              </div>
            )}
          </div>
        </div>

        <button className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all">
            Export Deep Intel Report
        </button>
      </div>
    </div>
  );
}

function MetricNode({ label, val, icon, isPrimary }: any) {
  return (
    <div className={`p-6 rounded-[2.2rem] border transition-all active:scale-95 ${
      isPrimary 
        ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-900/20' 
        : 'bg-white/5 border-white/10'
    }`}>
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${
         isPrimary ? 'bg-white/20' : 'bg-blue-600/10 text-blue-500'
       }`}>
         {icon}
       </div>
       <p className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1.5 ${isPrimary ? 'text-blue-100' : 'text-slate-500'}`}>
         {label}
       </p>
       <h2 className="text-lg font-black text-white italic tracking-tighter truncate leading-none">{val}</h2>
    </div>
  );
}

function LoadingIntelligence() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0F1C] gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
        </div>
      </div>
      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-blue-500 italic animate-pulse">Synchronizing Intelligence...</p>
    </div>
  );
}

// Fixed missing parameter types causing explicit typescript assignment errors
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0F1C] p-6 text-center">
      <AlertCircle size={40} className="text-red-500 mb-4" />
      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8">Node Desync</h3>
      <button onClick={onRetry} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
        Retry Protocol
      </button>
    </div>
  );
}