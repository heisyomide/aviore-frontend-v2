'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, Search, Loader2, ExternalLink, 
  Bell, ArrowUpRight, Users, Inbox, Mail 
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
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to load registry: Client Node Failure");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-32 animate-in fade-in duration-700 text-zinc-100">
      
      {/* 🚀 1. STICKY HEADER NODE (Sleek Dark Glass) */}
      <div className="sticky top-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md py-6 flex justify-between items-center border-b border-zinc-900/60">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">
            Customers
          </h1>
          <p className="text-[#991b1b] text-xs font-semibold uppercase tracking-widest mt-1">
            Client Registry Matrix
          </p>
        </div>
        <button className="relative p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white transition-all">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#991b1b] rounded-full" />
        </button>
      </div>

      <div className="space-y-10 mt-10">
        
        {/* 🚀 2. SEARCH INTERFACE */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="SEARCH CLIENT IDENTITY..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-[#111113] border border-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white outline-none focus:border-zinc-700 transition-all shadow-xl placeholder-zinc-600" 
          />
        </div>

        {/* 🚀 3. PERFORMANCE STATS (Grid Nodes) */}
        <div className="grid grid-cols-2 gap-6">
           <div className="bg-[#111113] border border-zinc-900 p-6 rounded-2xl flex justify-between items-center relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Total Registry</p>
                <h2 className="text-xl font-light font-mono text-white tracking-tight">{customers.length} Accounts</h2>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 shadow-inner shrink-0">
                <Users size={16} />
              </div>
           </div>

           <div className="bg-[#111113] border border-zinc-900 p-6 rounded-2xl flex justify-between items-center relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Growth Velocity</p>
                <h2 className="text-xl font-light font-mono text-emerald-500 tracking-tight">+12.5%</h2>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 shadow-inner shrink-0">
                <TrendingUp size={16} />
              </div>
           </div>
        </div>

        {/* 🚀 4. CLIENT REGISTRY LIST (Mobile Layout Architecture) */}
        <div className="space-y-4 lg:hidden">
          <div className="flex justify-between items-center px-1">
             <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Client Registry</h3>
             <div className="p-2 bg-zinc-900/40 rounded-xl text-zinc-500 border border-zinc-900">
               <ArrowUpRight size={14}/>
             </div>
          </div>

          <div className="space-y-4">
            {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
              <div key={c.id} className="bg-[#111113] border border-zinc-900 p-6 rounded-2xl space-y-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-900/60 rounded-xl flex items-center justify-center text-zinc-400 font-medium border border-zinc-800/50 shrink-0 font-sans">
                    {(c.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-xs font-medium text-white tracking-wide truncate">{c.name}</h3>
                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider truncate">{c.email}</p>
                  </div>
                  <div className="text-right space-y-1">
                     <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Total Yield</p>
                     <p className="text-xs font-medium text-zinc-300 font-mono">₦{Number(c.totalSpent || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-zinc-900/60 py-4 font-mono">
                   <div>
                      <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1 tracking-widest">Cycles</p>
                      <p className="text-xs font-medium text-white">{c.ordersCount} Orders</p>
                   </div>
                   <div>
                      <p className="text-[8px] font-bold text-zinc-500 uppercase mb-1 tracking-widest">Last order</p>
                      <p className="text-xs font-medium text-zinc-400 uppercase">{c.lastOrderDate || 'None'}</p>
                   </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <Mail size={13} className="text-zinc-500" /> Dispatch Message
                  </button>
                  <button className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer">
                    <ExternalLink size={15} />
                  </button>
                </div>
              </div>
            )) : <EmptyState />}
          </div>
        </div>

        {/* 💻 5. DESKTOP REGISTRY HUB VIEW */}
        <div className="hidden lg:block bg-[#111113] rounded-2xl border border-zinc-900 overflow-hidden shadow-2xl mt-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-[9px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900">
                <th className="p-6">Client Identity</th>
                <th className="p-6 text-center">Cycles</th>
                <th className="p-6">Contribution</th>
                <th className="p-6 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-950/40 transition-all">
                  <td className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-900/60 rounded-xl flex items-center justify-center text-zinc-400 font-medium border border-zinc-800/50">
                      {(c.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-white tracking-wide">{c.name}</p>
                      <p className="text-[10px] text-zinc-500 tracking-wider font-medium">{c.email}</p>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="px-3 py-1 bg-zinc-900 text-zinc-400 rounded-md text-[9px] font-medium tracking-wide uppercase border border-zinc-800">
                      {c.ordersCount} Requisitions
                    </span>
                  </td>
                  <td className="font-mono text-xs font-medium text-zinc-300 p-6">
                    ₦{Number(c.totalSpent || 0).toLocaleString()}
                  </td>
                  <td className="p-6 text-right">
                     <button className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl hover:border-zinc-700 transition-all cursor-pointer">
                        <ExternalLink size={14} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && <EmptyState />}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] gap-4">
      <Loader2 className="animate-spin text-[#991b1b]" size={28} />
      <p className="text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase">Synchronizing Client Registry Node...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-[#111113] border-t border-zinc-900">
      <Inbox size={32} strokeWidth={1} className="text-zinc-700" />
      <p className="font-bold uppercase text-[10px] tracking-widest text-zinc-600">No client files found in active registry</p>
    </div>
  );
}