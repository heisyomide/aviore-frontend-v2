'use client';

import { useEffect, useState } from 'react';
import { 
  ShoppingCart, Wallet, Loader2, PackageOpen, BadgeCheck,
  TrendingUp, ArrowUpRight, ShieldCheck, Bell, ChevronRight,
  Package, CheckCircle2, Truck, Clock, AlertCircle, MoreHorizontal
} from 'lucide-react';

const CURRENCY_SYMBOL = '₦';

interface DashboardData {
  profile: {
    storeName: string;
    isVerified: boolean;
    ownerName: string;
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

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchDashboardRegistry = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!token) {
          window.location.href = '/login';
          return;
        }
        
        const response = await fetch(`${baseUrl}/vendor/stats`, {
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }

        if (!response.ok) throw new Error('SYNC_NODE_FAILURE');

        const result = await response.json();

        const sanitizedData: DashboardData = {
          profile: {
            storeName: result.profile?.storeName || "Registry Node",
            ownerName: result.profile?.ownerName || "Merchant",
            isVerified: !!result.profile?.isVerified
          },
          stats: {
            totalOrders: Number(result.stats?.totalOrders || 0),
            totalRevenue: typeof result.stats?.totalRevenue === 'object'
              ? Number(result.stats.totalRevenue._sum?.vendorEarning || 0)
              : Number(result.stats?.totalRevenue || 0),
            activeProducts: Number(result.stats?.activeProducts || 0),
          },
          wallet: {
            availableBalance: Number(result.wallet?.availableBalance || 0),
            pendingBalance: Number(result.wallet?.pendingBalance || 0),
            totalEarnings: Number(result.wallet?.totalEarnings || 0),
          },
          recentOrders: Array.isArray(result.recentOrders) ? result.recentOrders : []
        };

        setData(sanitizedData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardRegistry();
    return () => controller.abort();
  }, []);

  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-white lg:bg-[#FAFAFA] pb-32 pt-10 px-6 lg:px-10 space-y-10 animate-in fade-in duration-700">
      
      {/* 🚀 1. INTEGRATED GREETING & NOTIFICATION (Replaces Header) */}
      <div className="lg:hidden flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight uppercase italic">
            Let's become <br />
            <span className="text-blue-600">more Productive</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            {data.profile.storeName} • Registry Hub
          </p>
        </div>
        <div className="relative p-1">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
            <Bell size={22} />
          </div>
          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
        </div>
      </div>

      {/* 🚀 2. MOBILE PROGRESS CARD (From Sample) */}
      <div className="lg:hidden bg-[#1E293B] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex items-center justify-between">
        <div className="space-y-5 z-10">
          <p className="text-sm font-bold text-slate-300 leading-relaxed italic">
            Great, your today's <br />
            plan almost done
          </p>
          <button className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
            View Task List
          </button>
        </div>

        <div className="relative w-24 h-24 flex items-center justify-center z-10 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
            <circle 
              cx="48" cy="48" r="38" 
              stroke="currentColor" strokeWidth="8" fill="transparent" 
              strokeDasharray={239} 
              strokeDashoffset={239 * (1 - 0.8)} 
              className="text-orange-500" 
              strokeLinecap="round" 
            />
          </svg>
          <span className="absolute text-sm font-black italic tracking-tighter">80%</span>
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl opacity-20" />
      </div>

      {/* 🚀 3. OPERATIONAL GRID (Replacing old status grid) */}
      <div className="lg:hidden space-y-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic px-1">Today's Protocol</h3>
        <div className="grid grid-cols-2 gap-5">
          <OperationalCard bg="bg-blue-50" text="text-blue-600" label="Active Orders" val={data.stats.totalOrders} icon={<Clock size={16}/>} />
          <OperationalCard bg="bg-orange-50" text="text-orange-600" label="Stock Hub" val={data.stats.activeProducts} icon={<Package size={16}/>} />
          <OperationalCard bg="bg-slate-900" text="text-white" label="Liquid Balance" val={`${CURRENCY_SYMBOL}${data.wallet.availableBalance.toLocaleString()}`} icon={<Wallet size={16}/>} isWide />
          <div className="bg-slate-50 p-6 rounded-[2.2rem] flex flex-col items-center justify-center border border-slate-100 group active:scale-95 transition-all">
             <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
               <MoreHorizontal size={20}/>
             </div>
             <p className="text-[9px] font-black uppercase text-slate-400 mt-3 tracking-widest">Analytics</p>
          </div>
        </div>
      </div>

      {/* 🚀 4. RECENT REQUISITIONS (Mobile List structure) */}
      <div className="lg:hidden space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Recent Artifacts</h3>
          <ArrowUpRight size={18} className="text-blue-600" />
        </div>
        <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-slate-100">
          {data.recentOrders.length > 0 ? data.recentOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-3xl transition-colors group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 border border-slate-100">
                <Package size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 uppercase italic truncate">{order.artifact}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">NODE_{order.id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 italic tracking-tighter">{CURRENCY_SYMBOL}{order.amount.toLocaleString()}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>
          )) : <EmptyState />}
        </div>
      </div>

      {/* 💻 DESKTOP VIEW: MAINTAINED ORIGINAL CONTEXT */}
      <div className="hidden lg:block space-y-8 p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Consolidated Ledger</h1>
            <p className="text-slate-400 text-sm font-medium italic mt-3">Hardware & asset fulfillment performance tracking.</p>
          </div>
          <VendorBadge profile={data.profile} />
        </div>

        <div className="grid grid-cols-4 gap-6">
          <StatCard title="Total Registry Yield" value={data.stats.totalRevenue} isCurrency icon={<TrendingUp size={18} />} description="Protocol revenue after fee" />
          <StatCard title="Active Requisitions" value={data.stats.totalOrders} icon={<ShoppingCart size={18} />} />
          <StatCard title="Inventory Nodes" value={data.stats.activeProducts} icon={<Package size={18} />} />
          <StatCard title="Node Liquidity" value={data.wallet.availableBalance} isCurrency icon={<Wallet size={18} />} highlight />
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 bg-white p-10 rounded-4xl shadow-sm border border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-10 italic">Registry_History_Log</h2>
            <OrdersTable orders={data.recentOrders} />
          </div>
          <div className="col-span-4 space-y-6">
            <EscrowPanel wallet={data.wallet} />
            <SecurityCard />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- SUPPORTING COMPONENTS (PRESERVED CONTEXT) --- */

function OperationalCard({ bg, text, label, val, icon, isWide }: any) {
  return (
    <div className={`${bg} p-6 rounded-[2.2rem] shadow-sm relative overflow-hidden active:scale-95 transition-all border border-transparent hover:border-slate-100 ${isWide ? 'col-span-1' : ''}`}>
       <div className={`p-3 rounded-xl inline-block mb-6 bg-white shadow-sm ${text}`}>{icon}</div>
       <p className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-60 ${text}`}>{label}</p>
       <h2 className={`text-xl font-black mt-1 italic tracking-tighter truncate ${text}`}>{val}</h2>
    </div>
  );
}

function StatCard({ title, value, icon, highlight, isCurrency, description }: any) {
  const formattedValue = isCurrency 
    ? `${CURRENCY_SYMBOL}${Number(value || 0).toLocaleString()}` 
    : Number(value || 0).toLocaleString();

  return (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 transition-all hover:translate-y-[-2px] group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${highlight ? 'bg-blue-600 text-white shadow-blue-200 shadow-xl' : 'bg-slate-50 text-slate-400 group-hover:text-blue-600'}`}>
          {icon}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{title}</p>
      <h3 className={`text-3xl font-black italic tracking-tighter leading-none ${highlight ? 'text-blue-600' : 'text-slate-900'}`}>
        {formattedValue}
      </h3>
      {description && <p className="text-[9px] text-slate-300 font-bold mt-4 italic uppercase tracking-wider">{description}</p>}
    </div>
  );
}

function VendorBadge({ profile }: { profile: DashboardData['profile'] }) {
  return (
    <div className="flex items-center gap-4 bg-white p-2 pr-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-500 font-black text-xl italic shadow-lg">
        {profile?.storeName?.substring(0, 1) || 'V'}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{profile?.storeName}</span>
          {profile?.isVerified && <BadgeCheck size={16} className="text-blue-500" />}
        </div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">{profile?.ownerName}</p>
      </div>
    </div>
  );
}

function OrdersTable({ orders }: { orders: DashboardData['recentOrders'] }) {
  if (!orders?.length) return <EmptyState />;
  return (
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <th className="pb-6">Artifact_ID</th>
            <th className="pb-6 text-right">Settlement</th>
            <th className="pb-6 text-right">Network_State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map((order) => (
            <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="py-6">
                <p className="text-xs font-black text-slate-900 uppercase italic line-clamp-1">{order.artifact}</p>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">NODE_{order.id.slice(-6).toUpperCase()}</p>
              </td>
              <td className="py-6 text-right font-black text-slate-900 text-sm italic tracking-tighter">
                {CURRENCY_SYMBOL}{Number(order.amount || 0).toLocaleString()}
              </td>
              <td className="py-6 text-right">
                <StatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EscrowPanel({ wallet }: { wallet: DashboardData['wallet'] }) {
  return (
    <div className="bg-slate-900 p-10 rounded-4xl text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000" />
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10 italic">Escrow Protocol</h2>
      <div className="space-y-8 relative z-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Available Liquidity</p>
          <p className="text-4xl font-black italic tracking-tighter leading-none">
            {CURRENCY_SYMBOL}{wallet.availableBalance.toLocaleString()}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-800">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">In Reserve</p>
            <p className="text-md font-black text-blue-500 italic mt-1">{CURRENCY_SYMBOL}{wallet.pendingBalance.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Yield Total</p>
            <p className="text-md font-black text-emerald-500 italic mt-1">{CURRENCY_SYMBOL}{wallet.totalEarnings.toLocaleString()}</p>
          </div>
        </div>
        <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-3 group shadow-xl shadow-blue-900/20">
          Request Payout <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
    SHIPPED: 'bg-blue-50 text-blue-600 border-blue-100',
  };
  return (
    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border tracking-widest ${styles[status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
      {status?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
}

function SecurityCard() {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-4xl flex items-center gap-6 shadow-sm group">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"><ShieldCheck size={24} /></div>
      <div>
        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1.5">Security Node</p>
        <p className="text-[10px] text-slate-400 font-bold italic uppercase tracking-tighter">48-Hour Escrow Active</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-600" size={56} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full animate-ping" />
        </div>
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic animate-pulse">Synchronizing Registry...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string | null }) {
  return (
    <div className="h-screen flex items-center justify-center bg-[#F4F7FE] p-6 text-center">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-sm border border-slate-50">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-2 tracking-tighter">Sync Interrupted</h3>
        <p className="text-[10px] text-slate-400 font-bold mb-10 italic uppercase tracking-widest">{message || "Connection to Node failed."}</p>
        <button onClick={() => window.location.reload()} className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Reconnect Registry</button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-300">
      <PackageOpen size={64} strokeWidth={1} className="mb-6 opacity-20" />
      <p className="text-[11px] font-black uppercase tracking-[0.3em] italic">No Requisitions Registered</p>
    </div>
  );
}