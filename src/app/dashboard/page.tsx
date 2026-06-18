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
import DashboardOverview from '@/src/components/dashboard/MobileDashboard'; 

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
        nodeSyncTimeout();
      }
    };

    const nodeSyncTimeout = () => {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    };

    fetchDashboardAndStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 bg-[#0D0D0D]/10">
        <Loader2 className="animate-spin text-[#C5A880]" size={28} />
        <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-zinc-600 uppercase">Synchronizing Node...</span>
      </div>
    );
  }

  return (
    <>
      {/* 🖥️ DESKTOP LOOK */}
      <div className="hidden lg:block space-y-8 w-full">
        <header className="flex justify-between items-end pb-2 border-b border-zinc-900/40">
          <div className="space-y-1.5">
            <span className="text-[#C5A880] text-[9px] font-mono font-bold uppercase tracking-[0.3em]">System_Overview</span>
            <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
              Registry <span className="text-zinc-600 font-normal font-sans tracking-normal">Snapshot</span>
            </h1>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg">
            <TrendingUp size={12} className="text-emerald-500 animate-pulse" />
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500">Live_Registry_Sync</span>
          </div>
        </header>

        {/* ACCOUNT CLEARANCE TELEMETRY PIPELINE */}
        {completionData && (
          <div className="bg-[#161619]/40 border border-zinc-900 rounded-xl overflow-hidden p-1">
            <UserActivationCard 
              percentage={completionData.completionPercentage}
              tasks={completionData.tasks}
              isFullyActive={completionData.isFullyActive}
            />
          </div>
        )}

        {/* METRICS QUAD-MATRIX GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total_Manifests" value={data?.totalOrders || 0} icon={ShoppingBag} color="text-zinc-100" />
          <StatCard label="Pending_Acquisitions" value={data?.pendingOrders || 0} icon={Clock} color="text-amber-500" />
          <StatCard label="Successful_Deliveries" value={data?.deliveredOrders || 0} icon={CheckCircle2} color="text-emerald-500" />
          <StatCard label="Registry_Feedback" value={data?.totalReviews || 0} icon={Star} color="text-[#C5A880]" />
        </div>

        {/* TRANSACTION ARCHIVE DATA MATRIX */}
        <div className="bg-[#111113] rounded-xl border border-zinc-900 shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-900/60 flex justify-between items-center bg-zinc-950/40">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">
              Recent_Transactions
            </h2>
            <button className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#C5A880] hover:text-[#d9c2a3] transition-colors bg-zinc-950 px-3 py-1.5 border border-zinc-900 rounded-lg">
              View_Full_Archive
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-950/80 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900/40">
                <tr>
                  <th className="px-6 py-3.5 tracking-[0.15em]">Reference Node</th>
                  <th className="px-6 py-3.5 tracking-[0.15em]">Timeline</th>
                  <th className="px-6 py-3.5 tracking-[0.15em]">Logistics_Status</th>
                  <th className="px-6 py-3.5 text-right tracking-[0.15em]">Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/40 bg-[#0D0D0D]/10">
                {data?.recentOrders && data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order: any) => (
                    <tr key={order.id} className="group hover:bg-[#161619]/40 transition-colors duration-200">
                      <td className="px-6 py-4.5">
                        <span className="text-xs font-mono font-bold text-zinc-200 tracking-wide transition-colors group-hover:text-white">
                          #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-[11px] font-sans text-zinc-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4.5 text-right font-mono font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">
                        QN{Number(order.totalAmount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                      No matching records historical streams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE LOOK */}
      <div className="block lg:hidden space-y-6 w-full">
        {/* Render activation checklist on mobile stream if operations remain pending */}
        {completionData && !completionData.isFullyActive && (
          <div className="bg-[#111113] border border-zinc-900 rounded-xl p-1 shadow-xl">
            <UserActivationCard 
              percentage={completionData.completionPercentage}
              tasks={completionData.tasks}
              isFullyActive={completionData.isFullyActive}
            />
          </div>
        )}
        <DashboardOverview data={data} />
      </div>
    </>
  );
}

/* --- ATOMS & STRUCTURAL MICRO-COMPONENTS --- */
function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -3, borderColor: 'rgba(197, 168, 128, 0.4)' }} 
      transition={{ duration: 0.2 }}
      className="bg-[#111113] p-5 rounded-xl border border-zinc-900/80 shadow-xl space-y-4 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-lg bg-zinc-950 border border-zinc-900/60 ${color}`}>
          <Icon size={15} />
        </div>
        <ArrowUpRight size={12} className="text-zinc-700 transition-colors group-hover:text-zinc-500" />
      </div>
      <div className="space-y-0.5">
        <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-[0.2em]">
          {label}
        </p>
        <h3 className="text-xl font-mono font-bold text-white tracking-wide">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = { 
    DELIVERED: "bg-emerald-950/30 text-emerald-500 border-emerald-900/50", 
    PENDING: "bg-amber-950/20 text-amber-500 border-amber-900/40",
    PROCESSING: "bg-blue-950/20 text-blue-400 border-blue-900/40",
    CANCELLED: "bg-zinc-950 text-zinc-600 border-zinc-900"
  };
  
  return (
    <span className={`inline-block px-2.5 py-1 rounded border text-[8px] font-mono font-bold uppercase tracking-widest transition-colors duration-200 ${styles[status] || "bg-zinc-950 text-zinc-400 border-zinc-900"}`}>
      {status}
    </span>
  );
}