'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Download, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

// Strict typing for general analytics structures
type TimeRangePreset = '7d' | '30d' | '90d' | '1y';

interface CategoryShare {
  name: string;
  value: number;
}

interface RevenueTrend {
  date: string;
  revenue: number;
  orders: number;
}

interface TopMerchant {
  storeName: string;
  salesCount: number;
  growth: number;
  revenue: number;
  rating: number;
}

interface MarketIntelligenceData {
  categories: CategoryShare[];
  revenueTrends: RevenueTrend[];
  topVendors: TopMerchant[];
}

const CHART_COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];

export default function AdminAnalytics() {
  const [data, setData] = useState<MarketIntelligenceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<TimeRangePreset>('7d');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Synchronizes parameter requests down to the generic /admin/analytics tree
    api.get<MarketIntelligenceData>(`/admin/analytics`, {
      params: { timeRange }
    })
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch((err) => {
        console.error("Failed to load generic market intelligence parameters:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-orange-500" size={28} />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">
          Fetching Market Metrics...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Filters */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
            Market <span className="text-orange-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium italic">Deep dive into Aviorè's ecosystem performance.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-1 flex">
            {(['7d', '30d', '90d', '1y'] as TimeRangePreset[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  timeRange === range 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition text-slate-600">
            <Download size={18} />
          </button>
        </div>
      </header>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Category Distribution (Pie Chart) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 italic">Sales by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categories ?? []}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.categories ?? []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold', paddingTop: '20px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Revenue vs Orders (Dual Bar Chart) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 italic text-orange-600">Revenue vs Order Volume</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenueTrends ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="orders" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Vendor Performance Table */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Top Performing Merchants</h3>
            <button className="text-[10px] font-black text-orange-600 uppercase hover:underline">View All Vendors</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-50">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Merchant</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sales</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(data?.topVendors ?? []).map((vendor, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-sm text-slate-900">{vendor.storeName}</td>
                    <td className="py-4 font-bold text-sm text-slate-600">{vendor.salesCount}</td>
                    <td className="py-4">
                      <span className={`flex items-center gap-1 text-[10px] font-black ${vendor.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {vendor.growth >= 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                        {Math.abs(vendor.growth)}%
                      </span>
                    </td>
                    <td className="py-4 font-black text-sm text-slate-900">${vendor.revenue.toLocaleString()}</td>
                    <td className="py-4 text-right">
                       <div className="flex items-center justify-end gap-1">
                          <span className="text-xs font-black text-slate-900">{vendor.rating}</span>
                          <span className="text-orange-400 font-bold">★</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}