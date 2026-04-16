'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, TrendingUp, Search, 
  User, Loader2, ExternalLink, Bell, 
  ArrowUpRight, Users, Inbox, Mail 
} from 'lucide-react';
import { api } from '@/src/lib/axios';

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/vendor/customers');
      setCustomers(res.data);
    } catch (e) {
      console.error("Failed to load registry: Client Node Failure");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0A0F1C] pb-32 animate-in fade-in duration-700">
      
      {/* 🚀 1. STICKY HEADER NODE (Top-Left Label) */}
      <div className="sticky top-0 z-50 bg-[#0A0F1C]/90 backdrop-blur-xl px-6 py-8 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
            Customers
          </h1>
          <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
        </div>
        <button className="relative p-3 bg-white/5 rounded-full border border-white/10 text-white active:scale-90 transition-all">
          <Bell size={22} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-[#0A0F1C]" />
        </button>
      </div>

      <div className="px-6 space-y-10 mt-8">
        
        {/* 🚀 2. SEARCH INTERFACE (Full Width Dark Node) */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="SEARCH CLIENT IDENTITY..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all shadow-2xl" 
          />
        </div>

        {/* 🚀 3. PERFORMANCE STATS (Grid Nodes) */}
        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 rounded-[2.2rem] bg-blue-600 border border-blue-500 shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-6 text-white">
                <Users size={20} />
              </div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-100 mb-1.5">Total Registry</p>
              <h2 className="text-xl font-black text-white italic tracking-tighter">{customers.length} Customers</h2>
           </div>

           <div className="p-6 rounded-[2.2rem] bg-white/5 border border-white/10 active:scale-95 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mb-6 text-blue-500">
                <TrendingUp size={20} />
              </div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">Growth Velocity</p>
              <h2 className="text-xl font-black text-white italic tracking-tighter">+12.5%</h2>
           </div>
        </div>

        {/* 🚀 4. CLIENT REGISTRY LIST (Mobile Edge-to-Edge Nodes) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Client Registry</h3>
             <button className="p-2 bg-white/5 rounded-xl text-blue-500"><ArrowUpRight size={18}/></button>
          </div>

          <div className="space-y-4">
            {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
              <div key={c.id} className="bg-white/5 border border-white/10 p-6 rounded-[2.2rem] active:bg-white/10 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 font-black text-xl border border-blue-500/20 shadow-inner italic">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white uppercase italic truncate leading-none">{c.name}</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-2 truncate tracking-widest">{c.email}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Total Yield</p>
                     <p className="text-xs font-black text-white italic tracking-tighter">₦{c.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-[7px] font-black text-slate-500 uppercase mb-1 tracking-widest">Cycles</p>
                      <p className="text-sm font-black text-white italic">{c.ordersCount}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-[7px] font-black text-slate-500 uppercase mb-1 tracking-widest">Last order</p>
                      <p className="text-[9px] font-black text-blue-400 uppercase">{c.lastOrderDate}</p>
                   </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Mail size={14} className="text-blue-500" /> Dispatch Message
                  </button>
                  <button className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 active:scale-95 transition-all">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            )) : <EmptyState />}
          </div>
        </div>

        {/* 💻 DESKTOP VIEW COMPATIBILITY */}
        <div className="hidden lg:block bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden mt-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                <th className="p-8">Client Identity</th>
                <th className="p-8 text-center">Cycles</th>
                <th className="p-8">Contribution</th>
                <th className="p-8 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-all group">
                  <td className="p-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black italic">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase italic">{c.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">{c.email}</p>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <span className="px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-lg text-[9px] font-black italic uppercase">
                      {c.ordersCount} Requisitions
                    </span>
                  </td>
                  <td className="p-8 font-black italic text-sm">
                    ₦{c.totalSpent.toLocaleString()}
                  </td>
                  <td className="p-8 text-right">
                     <button className="p-3 bg-white/5 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                        <ExternalLink size={16} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0F1C] gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-blue-500 italic animate-pulse">Synchronizing Client Registry...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-24 text-center text-slate-600 flex flex-col items-center gap-4 border-2 border-dashed border-white/5 rounded-[2.5rem]">
      <Inbox size={64} strokeWidth={1} className="opacity-20" />
      <p className="font-black uppercase text-[10px] tracking-[0.3em]">No client found in registry</p>
    </div>
  );
}