'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Loader2, Award, ArrowUpRight } from 'lucide-react';
import { api } from '@/src/lib/axios';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/vendor/analytics');
      setData(res.data);
    } catch (e) {
      console.error("Analytics fetch failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-600" size={40} strokeWidth={3} />
      <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Crunching Market Data...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Market Intelligence</h1>
        <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mt-1">Growth & Performance Metrics</p>
      </div>

      {/* High-Level Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          title="Gross Revenue" 
          value={`₦${data.summary.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          isPrimary 
        />
        <MetricCard 
          title="Total Orders" 
          value={data.summary.totalOrders} 
          trend="+5.2%" 
          icon={ShoppingCart} 
        />
        <MetricCard 
          title="Active Inventory" 
          value={data.summary.productCount} 
          icon={Award} 
        />
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Trend Placeholder */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border-4 border-slate-50 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Revenue Velocity</h3>
            <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">Real-time</span>
          </div>
          <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
             <TrendingUp size={48} className="text-slate-200 mb-2" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Chart Integration Pending</p>
          </div>
        </div>

        {/* Product Leaderboard */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-8">Top Performers</h3>
          <div className="space-y-8">
            {data.topProducts.map((p: any, idx: number) => (
              <div key={idx} className="group cursor-default">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-black uppercase tracking-tight text-slate-100 group-hover:text-orange-500 transition-colors line-clamp-1">{p.title}</p>
                  <p className="text-xs font-black text-white">₦{p.revenue.toLocaleString()}</p>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                     className="bg-orange-600 h-full rounded-full transition-all duration-1000" 
                     style={{ width: `${(p.revenue / data.summary.totalRevenue) * 100}%` }}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon, isPrimary }: any) {
  return (
    <div className={`${isPrimary ? 'bg-orange-600 text-white shadow-orange-200' : 'bg-white text-slate-900 border-4 border-slate-50 shadow-sm'} p-8 rounded-[2.5rem] shadow-xl relative transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 ${isPrimary ? 'bg-orange-500 shadow-inner' : 'bg-slate-900 text-white'} rounded-2xl`}>
          <Icon size={22} strokeWidth={3} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black bg-green-100 text-green-600 px-3 py-1 rounded-lg">
            <ArrowUpRight size={12} strokeWidth={3} /> {trend}
          </div>
        )}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isPrimary ? 'text-orange-200' : 'text-slate-400'}`}>{title}</p>
      <p className="text-3xl font-black mt-1 tracking-tighter">{value}</p>
    </div>
  );
}