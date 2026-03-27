'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Mail, MessageCircle, ShoppingBag, TrendingUp, Search, 
  User, Loader2, ExternalLink, ChevronRight, Phone, 
  Filter, Star, DollarSign 
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
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10">
      
      {/* 🚀 EXECUTIVE HEADER */}
      <div className="p-6 lg:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Client Registry</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">High-Value Asset Retention Node</p>
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="SEARCH CLIENT IDENTITY..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all" 
            />
          </div>
        </div>

        {/* 📱 MOBILE VIEW: Client Profile Cards */}
        <div className="lg:hidden space-y-4">
          {filteredCustomers.map((c) => (
            <div key={c.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 animate-in fade-in duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 uppercase italic truncate leading-none">{c.name}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1.5 truncate tracking-tighter">{c.email}</p>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-green-600 font-black text-xs italic">
                     <TrendingUp size={12} /> LTV
                   </div>
                   <p className="text-[10px] font-bold text-slate-900">₦{c.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Requisitions</p>
                    <p className="text-sm font-black text-slate-900 italic">{c.ordersCount}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Last Node</p>
                    <p className="text-[10px] font-black text-slate-900 uppercase">{c.lastOrderDate}</p>
                 </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <MessageCircle size={14} /> Message
                </button>
                <button className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
          {filteredCustomers.length === 0 && <EmptyState />}
        </div>

        {/* 💻 DESKTOP VIEW: High-Density Directory */}
        <div className="hidden lg:block bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="p-6">Client Identity</th>
                <th className="p-6 text-center">Fulfillment Cycles</th>
                <th className="p-6">Capital Contribution</th>
                <th className="p-6">Last Engagement</th>
                <th className="p-6 text-right">Engagement Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm group-hover:bg-blue-600 transition-colors">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm uppercase italic leading-none">{c.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-900 italic">
                      {c.ordersCount} ORDERS
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-slate-900 text-sm italic">₦{c.totalSpent.toLocaleString()}</p>
                    <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                       <div className="bg-blue-500 h-full w-[65%]" />
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase">{c.lastOrderDate}</p>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm">
                        <MessageCircle size={16} />
                      </button>
                      <button className="px-5 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                        Profile Registry
                      </button>
                    </div>
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
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Synchronizing Client Node...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-32 text-center text-slate-200 flex flex-col items-center gap-4">
      <User size={80} strokeWidth={0.5} className="opacity-10" />
      <p className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-300">No client nodes registered in registry</p>
    </div>
  );
}