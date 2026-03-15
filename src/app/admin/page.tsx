'use client';
import { useEffect, useState } from 'react';
import { api } from '@/src/lib/axios';
import { StatGrid } from '../../components/admin/StatGrid';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { Loader2, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    api.get('/admin/overview')
      .then(res => setData(res.data))
      .catch(err => console.error("Dashboard Load Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !isMounted) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">
            COMMAND <span className="text-orange-600">CENTER</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Aviorè Marketplace Global Oversight</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition">Export Report</button>
           <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition">Broadcast Alert</button>
        </div>
      </header>

      <StatGrid stats={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Graph */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs italic flex items-center gap-2">
              <Zap size={16} className="text-orange-500" /> Revenue Growth (Last 7 Days)
            </h3>
          </div>
          {/* Tailwind Fix: changed h-[300px] to h-75 (approx 300px) */}
          <div className="h-75 w-full"> 
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chart}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs italic mb-6">Live Activity</h3>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {data?.recentActivity?.map((log: any, i: number) => (
              <div key={i} className="flex gap-4 relative">
                {/* Tailwind Fix: changed bottom-[-24px] to -bottom-6 */}
                {i !== data.recentActivity.length - 1 && <div className="absolute left-4 top-8 -bottom-6 w-px bg-slate-100"></div>}
                <div className="w-8 h-8 rounded-full bg-slate-50 shrink-0 flex items-center justify-center border border-slate-100">
                  {log.action.includes('APPROVE') ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-orange-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-900 leading-tight mb-1">{log.details}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{log.admin.firstName}</span>
                    <span className="text-[9px] font-bold text-slate-300">•</span>
                    <span className="text-[9px] font-bold text-slate-300 italic">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition">
            View All System Logs
          </button>
        </div>
      </div>
    </div>
  );
}