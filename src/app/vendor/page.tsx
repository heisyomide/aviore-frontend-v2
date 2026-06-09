'use client';

import { useEffect, useState } from 'react';
import { 
  Wallet, Loader2, PackageOpen, BadgeCheck,
  ArrowUpRight, ShieldCheck, Package, Clock, AlertCircle, Share2, LogOut
} from 'lucide-react';

// Shared Global Api Engine & Onboarding Integrations
import { api } from '@/src/lib/axios'; // Adjust this import path to match your exact directory structure
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
        
        // 🚀 Hit the exact uniform endpoint through your Axios interceptor pipeline
        const [statsResponse, completionData] = await Promise.all([
          api.get('/vendor/stats', { signal: controller.signal }),
          getCompletionStatus('vendor', token).catch((err) => {
            console.error("Completion tracking stack safely decoupled:", err);
            return null;
          })
        ]);

        const result = statsResponse.data;

        // Safe pipeline translation mapping
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
    <div className="min-h-screen bg-white pb-32 animate-in fade-in duration-700">
      
      {/* 🚀 1. STICKY IDENTITY HEADER */}
      <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md px-6 py-8 flex justify-between items-center border-b border-slate-50">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Dashboard
          </h1>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2 italic leading-none">
            Welcome Back, {data.profile.storeName}
          </p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsIdentityMenuOpen(!isIdentityMenuOpen)}
            className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl active:scale-90 transition-all border border-slate-800 cursor-pointer"
          >
            <span className="font-black italic text-lg">
              {(data.profile.storeName || "ME").substring(0, 2).toUpperCase()}
            </span>
          </button>

          {isIdentityMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsIdentityMenuOpen(false)} />
              <div className="absolute right-0 top-16 w-56 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-3 animate-in zoom-in-95 duration-200 z-20">
                 <button 
                  onClick={handleShareProfile}
                  className="w-full flex items-center gap-3 p-4 hover:bg-blue-50 rounded-2xl transition-colors text-slate-700 cursor-pointer"
                 >
                   <Share2 size={18} className="text-blue-600" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Share Profile</span>
                 </button>
                 <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-2xl transition-colors text-red-600 cursor-pointer"
                 >
                   <LogOut size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Logout </span>
                 </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CORE WORKSPACE VIEW */}
      <div className="px-6 space-y-10 mt-10">

        {/* 🛡️ ONBOARDING ENGINE CARD */}
        {completionStatus && (
          <VendorActivationCard 
            percentage={completionStatus.completionPercentage}
            tasks={completionStatus.tasks}
            isFullyActive={completionStatus.isFullyActive}
          />
        )}

        {/* 🚀 2. REVENUE HERO NODE */}
        <div className="bg-[#0F172A] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Liquidity</p>
                    <h2 className="text-5xl font-black italic tracking-tighter">
                        {CURRENCY_SYMBOL}{(data.wallet.availableBalance || 0).toLocaleString()}
                    </h2>
                </div>
                <div className="p-4 bg-blue-600 rounded-2xl shadow-lg">
                    <Wallet size={24} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-white/5 relative z-10">
                <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Lifetime Yield</p>
                    <p className="text-lg font-black text-emerald-500 italic">{CURRENCY_SYMBOL}{(data.wallet.totalEarnings || 0).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">In Escrow</p>
                    <p className="text-lg font-black text-orange-500 italic">{CURRENCY_SYMBOL}{(data.wallet.pendingBalance || 0).toLocaleString()}</p>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        </div>

        {/* 🚀 3. OPERATIONAL STATS GRID */}
        <div className="grid grid-cols-2 gap-4">
          <OperationalCard label="Active Orders" val={data.stats.totalOrders} icon={<Clock size={18}/>} color="bg-blue-50" textColor="text-blue-600" />
          <OperationalCard label="Product SKU" val={data.stats.activeProducts} icon={<Package size={18}/>} color="bg-slate-50" textColor="text-slate-900" />
        </div>

        {/* 🚀 4. RECENT REQUISITIONS */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Recent Requisitions</h3>
            <ArrowUpRight size={18} className="text-blue-600" />
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-sm">
            {data.recentOrders && data.recentOrders.length > 0 ? data.recentOrders.map((order) => {
                const orderDate = order.date ? new Date(order.date) : null;
                const formattedDate = orderDate && !isNaN(orderDate.getTime()) 
                  ? orderDate.toLocaleDateString() 
                  : 'Recent';

                return (
                  <div key={order.id} className="flex items-center gap-4 p-5 border-b border-slate-50 last:border-0 group active:bg-slate-50 transition-all rounded-3xl">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                      <Package size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-900 uppercase italic truncate leading-none mb-1.5">{order.artifact}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">
                        {order.status} • {formattedDate}
                      </p>
                    </div>
                    <p className="text-sm font-black text-slate-900 italic tracking-tighter">
                      {CURRENCY_SYMBOL}{(order.amount || 0).toLocaleString()}
                    </p>
                  </div>
                );
              }) : <EmptyState />}
          </div>
        </div>

        {/* 🚀 5. SECURITY STATUS HUB */}
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600 border border-slate-100">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-900">Security Node</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">48-Hour Escrow Enabled</p>
                </div>
            </div>
            <BadgeCheck size={20} className="text-blue-500" />
        </div>
      </div>
    </div>
  );
}

// Keep your system card functions intact below (OperationalCard, LoadingState, etc.)

/* --- ISOLATED VIEW SYSTEM CARDS --- */

function OperationalCard({ label, val, icon, color, textColor }: any) {
  return (
    <div className={`${color} p-6 rounded-[2.2rem] border border-transparent transition-all active:scale-95`}>
       <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm ${textColor}`}>
         {icon}
       </div>
       <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
       <h2 className={`text-xl font-black italic tracking-tighter ${textColor}`}>{val ?? 0}</h2>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Synchronizing Node...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string | null }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <AlertCircle size={40} className="text-red-500 mb-4" />
      <h3 className="text-xl font-black text-slate-900 uppercase italic">Transmission Error</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 mb-8 max-w-xs">{message || "Registry sync interrupted."}</p>
      <button onClick={() => window.location.reload()} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl cursor-pointer">Reconnect</button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center opacity-30">
      <PackageOpen size={48} className="mx-auto text-slate-300 mb-3" />
      <p className="text-[10px] font-black uppercase tracking-widest italic">No Data Nodes</p>
    </div>
  );
}