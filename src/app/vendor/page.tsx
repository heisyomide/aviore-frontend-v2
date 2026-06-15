'use client';

import { useEffect, useState } from 'react';
import { 
  Wallet, Loader2, PackageOpen, BadgeCheck,
  ArrowUpRight, ShieldCheck, Package, Clock, AlertCircle, Share2, LogOut, TrendingUp
} from 'lucide-react';

import axios from 'axios';

// Shared Global Api Engine & Onboarding Integrations
import { api } from '@/src/lib/axios'; 
import { VendorActivationCard } from '../../components/completion/VendorActivationCard';
import { getCompletionStatus } from '@/src/services/completion.service';
import { CompletionEngineResponse } from '@/src/types/completion.types';

const CURRENCY_SYMBOL = '₦';

interface DashboardData {
  profile: {
    storeName: string;
    isVerified: boolean;
    ownerName: string;
    slug: string; 
  };
  wallet: {
    availableBalance: number;
    pendingBalance: number;
    totalEarnings: number;
  };
  stats: {
    totalOrders: number;
    totalRevenue: number;
    activeProducts: number;
  };
  recentOrders: Array<{
    id: string;
    artifact: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

export default function VendorOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isIdentityMenuOpen, setIsIdentityMenuOpen] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<CompletionEngineResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchDashboardRegistry = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          window.location.href = '/login';
          return;
        }
        
        const [statsResponse, completionData] = await Promise.all([
          api.get('/vendor/stats', { signal: controller.signal }),
          getCompletionStatus('vendor', token).catch((err) => {
            console.error("Completion tracking stack safely decoupled:", err);
            return null;
          })
        ]);

        const result = statsResponse.data;

        const sanitizedData: DashboardData = {
          profile: {
            storeName: result.profile?.storeName || "AVIORÈ Merchant",
            ownerName: result.profile?.ownerName || "Merchant",
            isVerified: !!result.profile?.isVerified,
            slug: result.profile?.slug || "" 
          },
          stats: {
            totalOrders: Number(result.stats?.totalOrders ?? 0),
            totalRevenue: Number(result.stats?.totalRevenue ?? 0),
            activeProducts: Number(result.stats?.activeProducts ?? 0),
          },
          wallet: {
            availableBalance: Number(result.wallet?.availableBalance ?? 0),
            pendingBalance: Number(result.wallet?.pendingBalance ?? 0),
            totalEarnings: Number(result.wallet?.totalEarnings ?? 0),
          },
          recentOrders: Array.isArray(result.recentOrders) ? result.recentOrders : []
        };

        setData(sanitizedData);
        setCompletionStatus(completionData);
      } catch (err: any) {
        if (!axios.isCancel(err)) {
          console.error("Dashboard Sync Error Context:", err.response?.data || err.message);
          setError(err.response?.data?.message || 'TRANSMISSION_ERROR');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardRegistry();
    return () => controller.abort();
  }, []);

  const handleShareProfile = async () => {
    const slug = data?.profile?.slug;

    if (!slug) {
      alert("Store link unavailable. Please sync profile.");
      return;
    }

    const shareUrl = `${window.location.origin}/vendors/${slug}`;
    const shareData = {
      title: data?.profile?.storeName || "AVIORÈ Store",
      text: `Check out ${data?.profile?.storeName || 'our store'} on AVIORÈ.`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      alert("Store link copied to clipboard!");
    } catch (error) {
      console.error("Share failed:", error);
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Store link copied to clipboard!");
      } catch {
        alert("Unable to share link. Please try again.");
      }
    } finally {
      setIsIdentityMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-32 animate-in fade-in duration-700 text-zinc-100">
      
      {/* 🚀 1. STICKY IDENTITY HEADER (Sleek Dark Glass) */}
      <div className="sticky top-0 z-[100] bg-[#0d0d0d]/80 backdrop-blur-md py-6 flex justify-between items-center border-b border-zinc-900/60">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">
            Dashboard
          </h1>
          <p className="text-[#991b1b] text-xs font-semibold uppercase tracking-widest mt-1">
            Welcome Back, {data.profile.storeName}
          </p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsIdentityMenuOpen(!isIdentityMenuOpen)}
            className="w-12 h-12 bg-[#121212] rounded-xl flex items-center justify-center text-zinc-300 shadow-xl active:scale-95 transition-all border border-zinc-800 cursor-pointer hover:border-zinc-700"
          >
            <span className="font-semibold text-xs tracking-wider">
              {(data.profile.storeName || "ME").substring(0, 2).toUpperCase()}
            </span>
          </button>

          {isIdentityMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsIdentityMenuOpen(false)} />
              <div className="absolute right-0 top-14 w-56 bg-[#121212] rounded-2xl shadow-2xl border border-zinc-800/80 p-1.5 animate-in zoom-in-95 duration-200 z-20">
                 <button 
                  onClick={handleShareProfile}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 rounded-xl transition-colors text-zinc-300 cursor-pointer"
                 >
                   <Share2 size={15} className="text-zinc-400" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Share Profile</span>
                 </button>
                 <div className="h-px bg-zinc-900 my-1 mx-2" />
                 <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-950/30 rounded-xl transition-colors text-red-400 cursor-pointer"
                 >
                   <LogOut size={15} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>
                 </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CORE WORKSPACE VIEW */}
      <div className="space-y-10 mt-10">

        {/* 🛡️ ONBOARDING ENGINE CARD */}
        {completionStatus && (
          <VendorActivationCard 
            percentage={completionStatus.completionPercentage}
            tasks={completionStatus.tasks}
            isFullyActive={completionStatus.isFullyActive}
          />
        )}

        {/* 🚀 2. REVENUE HERO NODE (Onyx Canvas & Industrial Metallic Frame) */}
        <div className="bg-[#111113] border border-zinc-900 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Available Liquidity</p>
                    <h2 className="text-4xl font-light tracking-tight text-white font-mono">
                        {CURRENCY_SYMBOL}{(data.wallet.availableBalance || 0).toLocaleString()}
                    </h2>
                </div>
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400">
                    <Wallet size={18} strokeWidth={1.5} />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-10 pt-6 border-t border-zinc-900 relative z-10">
                <div>
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Lifetime Yield</p>
                    <p className="text-base font-medium font-mono text-emerald-500">{CURRENCY_SYMBOL}{(data.wallet.totalEarnings || 0).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">In Escrow</p>
                    <p className="text-base font-medium font-mono text-amber-500">{CURRENCY_SYMBOL}{(data.wallet.pendingBalance || 0).toLocaleString()}</p>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        </div>

        {/* 🚀 3. OPERATIONAL STATS GRID */}
        <div className="grid grid-cols-2 gap-6">
          <OperationalCard label="Active Orders" val={data.stats.totalOrders} icon={<Clock size={16}/>} />
          <OperationalCard label="Product SKU" val={data.stats.activeProducts} icon={<Package size={16}/>} />
        </div>

        {/* 🚀 4. RECENT REQUISITIONS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recent Requisitions</h3>
            <ArrowUpRight size={15} className="text-zinc-500" />
          </div>
          
          <div className="bg-[#111113] rounded-2xl border border-zinc-900/80 overflow-hidden divide-y divide-zinc-900/60 shadow-xl">
            {data.recentOrders && data.recentOrders.length > 0 ? data.recentOrders.map((order) => {
                const orderDate = order.date ? new Date(order.date) : null;
                const formattedDate = orderDate && !isNaN(orderDate.getTime()) 
                  ? orderDate.toLocaleDateString('en-NG', { day: '2-digit', month: 'short' }) 
                  : 'Recent';

                return (
                  <div key={order.id} className="flex items-center gap-4 p-5 hover:bg-zinc-950/40 transition-all">
                    <div className="w-11 h-11 bg-zinc-900/60 rounded-xl flex items-center justify-center text-zinc-500 border border-zinc-800/50 shrink-0">
                      <Package size={16} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-medium text-white tracking-wide truncate">{order.artifact}</p>
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                        <span className="text-zinc-400">{order.status}</span> • {formattedDate}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-zinc-300 font-mono">
                      {CURRENCY_SYMBOL}{(order.amount || 0).toLocaleString()}
                    </p>
                  </div>
                );
              }) : <EmptyState />}
          </div>
        </div>

        {/* 🚀 5. SECURITY STATUS HUB */}
        <div className="bg-[#061411] border border-[#10322b] p-5 rounded-2xl flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-950/50 rounded-xl text-emerald-400 border border-emerald-900/40">
                    <ShieldCheck size={18} />
                </div>
                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Security Node Active</h4>
                    <p className="text-[10px] font-light text-zinc-400 mt-0.5 leading-relaxed">48-Hour Escrow protection active across inbound transactions.</p>
                </div>
            </div>
            <BadgeCheck size={18} className="text-emerald-500 shrink-0" />
        </div>
      </div>
    </div>
  );
}

/* --- ISOLATED VIEW SYSTEM CARDS --- */

function OperationalCard({ label, val, icon }: any) {
  return (
    <div className="bg-[#111113] border border-zinc-900 p-6 rounded-2xl flex justify-between items-center relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
       <div className="space-y-2">
         <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{label}</p>
         <h2 className="text-3xl font-light font-mono text-white tracking-tight">{val ?? 0}</h2>
       </div>
       <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white transition-all shadow-inner">
         {icon}
       </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] gap-4">
      <Loader2 className="animate-spin text-[#991b1b]" size={28} />
      <p className="text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase">Synchronizing Ledger Node...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string | null }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] p-6 text-center">
      <AlertCircle size={32} className="text-[#991b1b] mb-4" />
      <h3 className="text-sm font-bold text-white uppercase tracking-widest">Transmission Error</h3>
      <p className="text-[11px] font-light text-zinc-500 mt-2 mb-6 max-w-xs leading-relaxed">{message || "Registry synchronization interrupted."}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all cursor-pointer"
      >
        Reconnect
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <PackageOpen size={32} className="mx-auto text-zinc-700 stroke-1 mb-3" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">No Data Nodes Found</p>
    </div>
  );
}