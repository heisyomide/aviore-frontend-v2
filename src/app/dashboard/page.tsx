'use client';

import { useState, useEffect } from 'react';
import { 
  Loader2, ShoppingBag, Clock, CheckCircle2, 
  Star, ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { motion } from 'framer-motion';

// API Architecture & Core Onboarding Engines
import { api } from '@/src/lib/axios';
import { getCompletionStatus } from '@/src/services/completion.service';
import { UserActivationCard } from '@/src/components/completion/UserActivationCard';
import { CompletionEngineResponse } from '@/src/types/completion.types';

// Complex Layout Components
import { MobileDashboard } from '@/src/components/dashboard/MobileDashboard';

export default function OverviewPage() {
  const [data, setData] = useState<any>(null);
  const [completionData, setCompletionData] = useState<CompletionEngineResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardAndStatus = async () => {
      setLoading(true);
      try {
        // Retrieve identity token payload for decoupled tracking operations
        const token = localStorage.getItem('token') || '';

        // Execute metrics retrieval and compliance status tracking in parallel streams
        const [dashboardRes, completionResult] = await Promise.all([
          api.get('/user/dashboard'),
          getCompletionStatus('customer', token).catch((err) => {
            console.error('Customer identity clearance stream safely decoupled:', err);
            return null;
          })
        ]);

        setData(dashboardRes.data);
        setCompletionData(completionResult);
      } catch (error) {
        console.error('Registry_Terminal_Sync_Failure:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAndStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#A4143D]" size={32} />
      </div>
    );
  }

  return (
    <>
      {/* 🖥️ DESKTOP LOOK */}
      <div className="hidden lg:block space-y-10">
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[#A4143D] text-[10px] font-black uppercase tracking-[0.4em]">Secure_Terminal</span>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900">
              Registry <span className="text-zinc-300 font-medium">Overview</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live_Registry_Sync</span>
          </div>
        </header>

        {/* ACCOUNT CLEARANCE TELEMETRY PIPELINE */}
        {completionData && (
          <UserActivationCard 
            percentage={completionData.completionPercentage}
            tasks={completionData.tasks}
            isFullyActive={completionData.isFullyActive}
          />
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total_Manifests" value={data?.totalOrders || 0} icon={ShoppingBag} color="text-zinc-900" />
          <StatCard label="Pending_Acquisitions" value={data?.pendingOrders || 0} icon={Clock} color="text-amber-600" />
          <StatCard label="Successful_Deliveries" value={data?.deliveredOrders || 0} icon={CheckCircle2} color="text-emerald-600" />
          <StatCard label="Registry_Feedback" value={data?.totalReviews || 0} icon={Star} color="text-[#A4143D]" />
        </div>

        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-zinc-50 flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 flex items-center gap-3">Recent_Transactions</h2>
            <button className="text-[9px] font-black uppercase tracking-widest text-[#A4143D] hover:underline">View_Full_Archive</button>
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
                {data?.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="group hover:bg-zinc-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-black italic text-zinc-900 uppercase">
                          #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[11px] font-bold text-zinc-500 uppercase">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-8 py-5 text-right font-black italic">
                      ₦{Number(order.totalAmount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE LOOK */}
      <div className="block lg:hidden space-y-6">
        {/* Render activation checklist on mobile stream if operations remain pending */}
        {completionData && !completionData.isFullyActive && (
          <div className="px-4 pt-4">
            <UserActivationCard 
              percentage={completionData.completionPercentage}
              tasks={completionData.tasks}
              isFullyActive={completionData.isFullyActive}
            />
          </div>
        )}
        <MobileDashboard data={data} />
      </div>
    </>
  );
}

/* --- ATOMS --- */
function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl bg-zinc-50 ${color}`}><Icon size={20} /></div>
        <ArrowUpRight size={14} className="text-zinc-300" />
      </div>
      <div>
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-3xl font-black italic tracking-tighter text-zinc-900 mt-1">{value.toLocaleString()}</h3>
      </div>
    </motion.div>
  );
}

// Global Logistics Sync State Styling Keys
function StatusBadge({ status }: { status: string }) {
  const styles: any = { 
    DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-100", 
    PENDING: "bg-amber-50 text-amber-600 border-amber-100" 
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || "bg-zinc-50"}`}>
      {status}
    </span>
  );
}