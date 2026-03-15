'use client';
import { useState, useEffect } from 'react';
import { Mail, MessageCircle, ShoppingBag, TrendingUp, Search, User, Loader2, ExternalLink } from 'lucide-react';
import { api } from '@/src/lib/axios';

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/vendor/customers');
      setCustomers(res.data);
    } catch (e) {
      console.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-600" size={40} strokeWidth={3} />
        <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Loading Client Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end bg-white p-8 rounded-[2.5rem] border-4 border-slate-50 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Customer Directory</h1>
          <p className="text-[11px] font-black text-orange-600 uppercase tracking-[0.2em] mt-1">Manage your repeat buyers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Search by name or email..." 
            className="pl-12 pr-6 py-4 bg-slate-100 border-2 border-transparent focus:border-orange-500 rounded-2xl text-xs font-bold outline-none w-80 transition-all"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-[3rem] border-4 border-slate-50 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Client Identity</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Orders</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Investment</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Interaction</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black border-2 border-orange-200">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{c.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl font-black text-slate-700 text-xs">
                       <ShoppingBag size={14} strokeWidth={3} /> {c.ordersCount}
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-slate-900 text-sm">₦{c.totalSpent.toLocaleString()}</p>
                    <div className="w-16 h-1 bg-green-100 rounded-full mt-1 overflow-hidden">
                       <div className="bg-green-500 h-full w-[70%]" />
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-[11px] font-black text-slate-500 uppercase">{c.lastOrderDate}</p>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="p-4 bg-white border-2 border-slate-100 text-slate-400 hover:text-orange-600 hover:border-orange-200 rounded-2xl transition-all shadow-sm">
                        <MessageCircle size={18} strokeWidth={3} />
                      </button>
                      <button className="p-4 bg-slate-900 text-white hover:bg-orange-600 rounded-2xl transition-all shadow-lg shadow-slate-200">
                        <TrendingUp size={18} strokeWidth={3} />
                      </button>
                    </div>
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