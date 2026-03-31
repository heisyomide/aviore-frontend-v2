'use client';

import { 
  ShoppingBag, Clock, CheckCircle2, 
  Star, ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DesktopOverviewProps {
  data: any;
}

export function DesktopOverview({ data }: DesktopOverviewProps) {
  // 🚀 ANALYTICS TILES FOR DESKTOP
  const stats = [
    { label: "Total_Manifests", value: data?.totalOrders || 0, icon: ShoppingBag, color: "text-zinc-900" },
    { label: "Pending_Acquisitions", value: data?.pendingOrders || 0, icon: Clock, color: "text-amber-600" },
    { label: "Successful_Deliveries", value: data?.deliveredOrders || 0, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Registry_Feedback", value: data?.totalReviews || 0, icon: Star, color: "text-[#A4143D]" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 🟢 COMMAND HEADER */}
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[#A4143D] text-[10px] font-black uppercase tracking-[0.4em]">Secure_Terminal</span>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
            Registry <span className="text-zinc-300 font-medium">Overview</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full">
          <TrendingUp size={14} className="text-emerald-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live_Registry_Sync</span>
        </div>
      </header>

      {/* 🚀 ANALYTICS TILES */}
      <div className="grid lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -4 }}
            className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm space-y-6 group hover:shadow-xl hover:border-zinc-200 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl bg-zinc-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight size={16} className="text-zinc-200 group-hover:text-zinc-900 transition-all" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] italic">{stat.label}</p>
              <h3 className="text-4xl font-black italic tracking-tighter text-zinc-900 mt-1">
                {stat.value.toLocaleString()}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🚀 MANIFEST TABLE (THE HEART OF DESKTOP) */}
      <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-zinc-50 flex justify-between items-center bg-white">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-900 flex items-center gap-3 italic">
            Recent_Transactions
            <span className="px-2 py-0.5 bg-zinc-100 rounded text-[9px] text-zinc-400 not-italic">LATEST_INDEX</span>
          </h2>
          <button className="text-[10px] font-black uppercase tracking-widest text-[#A4143D] hover:underline">
            View_Full_Archive
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/50 text-[11px] font-black text-zinc-300 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Reference_ID</th>
                <th className="px-10 py-6">Timeline</th>
                <th className="px-10 py-6">Logistics_Status</th>
                <th className="px-10 py-6 text-right">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {data?.recentOrders?.map((order: any) => (
                <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-white transition-colors border border-zinc-100">
                        <ShoppingBag size={18} className="text-zinc-200 group-hover:text-[#A4143D]" />
                      </div>
                      <span className="text-[14px] font-black italic text-zinc-900 uppercase tracking-tighter">
                        #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-tight">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-10 py-7 text-right">
                    <span className="text-lg font-black text-zinc-900 italic tracking-tighter">
                      ₦{Number(order.totalAmount).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              
              {(!data?.recentOrders || data.recentOrders.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-200 italic">Null_Manifest_Detected</p>
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

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    PROCESSING: "bg-blue-50 text-blue-600 border-blue-100",
    CANCELLED: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}