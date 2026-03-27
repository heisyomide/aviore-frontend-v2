'use client';

import { useEffect, useState } from 'react';
import { 
  ShoppingCart, Wallet, Loader2, PackageOpen, BadgeCheck,
  TrendingUp, ArrowUpRight, ShieldCheck, Bell, ChevronRight,
  Package, CheckCircle2, Truck, Clock, AlertCircle
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
          window.location.href = '/auth/login';
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
          window.location.href = '/auth/login';
          return;
        }

        if (!response.ok) throw new Error('SYNC_NODE_FAILURE');

        const result = await response.json();

        // --- FIXED NaN BUG: Added strict fallbacks to 0 ---
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
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10">
      
      {/* 📱 MOBILE VIEW */}
      <div className="lg:hidden animate-in fade-in duration-500">
        <div className="bg-[#1E293B] p-6 pt-12 pb-14 rounded-b-[2.5rem] text-white flex justify-between items-center shadow-2xl relative z-10">
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic uppercase leading-none">Logistics Hub</h1>
            <p className="opacity-50 text-[9px] font-bold uppercase tracking-[0.2em] mt-2">
               Verified Node: {data.profile.storeName}
            </p>
          </div>
          <div className="relative bg-slate-800 p-3 rounded-full border border-slate-700 shadow-inner">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#1E293B]" />
          </div>
        </div>

        {/* Status Grid */}
        <div className="px-6 -mt-8 grid grid-cols-2 gap-4 relative z-20">
          <MobileStatCard color="bg-blue-600" label="Active Orders" count={data.stats.totalOrders} icon={<Clock size={16}/>} />
          <MobileStatCard color="bg-[#0F172A]" label="Inventory" count={data.stats.activeProducts} icon={<Package size={16}/>} />
          <MobileStatCard color="bg-orange-500" label="In Transit" count={2} icon={<Truck size={16}/>} />
          <MobileStatCard color="bg-emerald-600" label="Fulfilled" count={data.stats.totalOrders} icon={<CheckCircle2 size={16}/>} />
        </div>

        {/* Mobile Wallet Section */}
        <div className="px-6 mt-8">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex justify-between items-center border border-slate-800">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">Liquid Liquidity</p>
                <p className="text-3xl font-black italic tracking-tighter">{CURRENCY_SYMBOL}{data.wallet.availableBalance.toLocaleString()}</p>
              </div>
              <button className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-900/40 active:scale-90 transition-transform">
                <ArrowUpRight size={22} />
              </button>
           </div>
        </div>

        {/* 🚀 FIXED: PRO REQUISITIONS BOX (Larger & Professional) */}
        <div className="px-6 mt-10 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recent Requisitions</h3>
            <span className="text-[9px] font-bold text-blue-600 uppercase italic">View All Nodes</span>
          </div>
          <div className="bg-white rounded-[2.5rem] p-3 shadow-sm border border-slate-100 min-h-[300px]">
            {data.recentOrders.length > 0 ? (
              data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-5 p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-2xl transition-colors">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                     <Package size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-black text-slate-900 uppercase italic truncate">{order.artifact}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{order.status} • {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-black text-slate-900 italic tracking-tighter">{CURRENCY_SYMBOL}{order.amount.toLocaleString()}</p>
                </div>
              ))
            ) : (
               <div className="h-[250px] flex flex-col items-center justify-center text-slate-300">
                  <PackageOpen size={48} className="opacity-20 mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic">Registry Neutral</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* 💻 DESKTOP VIEW */}
      <div className="hidden lg:block space-y-8 p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Consolidated Ledger</h1>
            <p className="text-slate-400 text-sm font-medium italic">Hardware & asset fulfillment performance tracking.</p>
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

/* --- COMPONENTS --- */

function MobileStatCard({ color, label, count, icon }: any) {
  return (
    <div className={`${color} p-6 rounded-[2.2rem] text-white shadow-xl relative overflow-hidden active:scale-95 transition-all`}>
      <div className="flex justify-between items-start mb-6">
        <div className="bg-white/10 p-2.5 rounded-xl border border-white/5">{icon}</div>
      </div>
      <p className="text-[9px] font-black opacity-60 uppercase tracking-widest leading-none">{label}</p>
      {/* --- FIX: Strict Number formatting --- */}
      <h2 className="text-3xl font-black mt-2 italic tracking-tighter leading-none">{Number(count || 0)}</h2>
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
    <div className="h-screen flex flex-col items-center justify-center bg-[#F4F7FE] gap-6">
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