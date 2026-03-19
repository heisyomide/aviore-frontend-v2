'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { 
  Loader2, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Star, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  totalAmount: number;
}

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalReviews: number;
  recentOrders: Order[];
}

export default function OverviewPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/user/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Registry_Fetch_Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#A4143D]" size={32} />
      </div>
    );
  }

  const stats = [
    { label: "Total_Manifests", value: data?.totalOrders || 0, icon: ShoppingBag, color: "text-zinc-900" },
    { label: "Pending_Acquisitions", value: data?.pendingOrders || 0, icon: Clock, color: "text-amber-600" },
    { label: "Successful_Deliveries", value: data?.deliveredOrders || 0, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Registry_Feedback", value: data?.totalReviews || 0, icon: Star, color: "text-[#A4143D]" },
  ];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[#A4143D] text-[10px] font-black uppercase tracking-[0.4em]">Secure_Terminal</span>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900">
            Registry <span className="text-zinc-300 font-medium">Overview</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full">
          <TrendingUp size={14} className="text-emerald-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live_Registry_Sync</span>
        </div>
      </header>

      {/* 🚀 ANALYTICS TILES - Rule 7 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* 🚀 MANIFEST TABLE - Rule 1 */}
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-zinc-50 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 flex items-center gap-3">
            Recent_Transactions
            <span className="px-2 py-0.5 bg-zinc-100 rounded text-[9px] text-zinc-400">Latest_5</span>
          </h2>
          <button className="text-[9px] font-black uppercase tracking-widest text-[#A4143D] hover:underline">
            View_Full_Archive
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Reference</th>
                <th className="px-8 py-4">Timeline</th>
                <th className="px-8 py-4">Logistics_Status</th>
                <th className="px-8 py-4 text-right">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {data?.recentOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-zinc-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-white transition-colors">
                        <ShoppingBag size={14} className="text-zinc-400 group-hover:text-[#A4143D]" />
                      </div>
                      <span className="text-[13px] font-black italic text-zinc-900 uppercase">
                        #{order.orderNumber ?? order.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-sm font-black text-zinc-900 italic tracking-tighter">
                      ₦{Number(order.totalAmount).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              
              {(!data?.recentOrders || data.recentOrders.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <ShoppingBag size={32} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Null_Manifest_Detected</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** 📊 STAT CARD MOLECULE */
function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl bg-zinc-50 ${color}`}>
          <Icon size={20} />
        </div>
        <ArrowUpRight size={14} className="text-zinc-300" />
      </div>
      <div>
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-3xl font-black italic tracking-tighter text-zinc-900 mt-1">
          {value.toLocaleString()}
        </h3>
      </div>
    </motion.div>
  );
}

/** 🏷️ STATUS BADGE ATOM */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    PROCESSING: "bg-blue-50 text-blue-600 border-blue-100",
    CANCELLED: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}