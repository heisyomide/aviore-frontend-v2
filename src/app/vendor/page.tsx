'use client';

import { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Wallet, 
  Loader2, 
  PackageOpen, 
  BadgeCheck,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck
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
    
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!token) throw new Error('SESSION_EXPIRED');
        
        const response = await fetch(`${baseUrl}/vendor/stats`, {
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('SYNC_NODE_FAILURE');

        const result = await response.json();

        // --- CRITICAL DATA SANITIZATION ---
        // Flattening Prisma aggregate objects into primitives to prevent React Child error
        const sanitizedData: DashboardData = {
  ...result,
  stats: {
    // Force numbers and handle Prisma's nested object structure
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
  }
};

setData(sanitizedData);
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
    return () => controller.abort();
  }, []);

  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error} />;

  return (
    <div className="space-y-8 p-6 lg:p-10 bg-[#FAFAFA] min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. EXECUTIVE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Consolidated Ledger
          </h1>
          <p className="text-slate-400 text-sm font-medium italic">Real-time performance metrics for your artifacts.</p>
        </div>
        <VendorBadge profile={data.profile} />
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Net Revenue"
          value={data.stats.totalRevenue}
          isCurrency
          icon={<TrendingUp size={18} />}
          description="Earning after 10% platform fee"
        />
        <StatCard
          title="Active Orders"
          value={data.stats.totalOrders}
          icon={<ShoppingCart size={18} />}
        />
        <StatCard
          title="Catalog Nodes"
          value={data.stats.activeProducts}
          icon={<PackageOpen size={18} />}
        />
        <StatCard
          title="Available Liquidity"
          value={data.wallet.availableBalance}
          isCurrency
          icon={<Wallet size={18} />}
          highlight
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Recent Requisitions</h2>
          </div>
          <OrdersTable orders={data.recentOrders} />
        </div>

        <div className="xl:col-span-4 space-y-6">
          <EscrowPanel wallet={data.wallet} />
          <SecurityCard />
        </div>
      </div>
    </div>
  );
}

/* ------------------ */
/* COMPONENTS WITH SAFETY GUARDS */
/* ------------------ */

function StatCard({ title, value, icon, highlight, isCurrency, description }: any) {
  // Defensive logic: Ensure value is never an object before rendering
  const formattedValue = isCurrency 
    ? `${CURRENCY_SYMBOL}${Number(value || 0).toLocaleString()}` 
    : Number(value || 0).toLocaleString();

  return (
    <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-50 transition-all hover:translate-y-[-2px] group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${highlight ? 'bg-orange-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-orange-600'}`}>
          {icon}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className={`text-3xl font-black italic tracking-tighter ${highlight ? 'text-orange-600' : 'text-slate-900'}`}>
        {formattedValue}
      </h3>
      {description && <p className="text-[9px] text-slate-300 font-medium mt-2 italic">{description}</p>}
    </div>
  );
}

// ... Sub-components remain structured as before but with similar null-safety checks ...

function VendorBadge({ profile }: { profile: DashboardData['profile'] }) {
  return (
    <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-lg">
        {profile?.storeName?.substring(0, 1) || 'V'}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
            {profile?.storeName || 'Vendor'}
          </span>
          {profile?.isVerified && <BadgeCheck size={16} className="text-blue-500" />}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile?.ownerName}</p>
      </div>
    </div>
  );
}

function OrdersTable({ orders }: { orders: DashboardData['recentOrders'] }) {
  if (!orders?.length) return <EmptyState />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <th className="pb-4">Artifact</th>
            <th className="pb-4 text-right">Settlement</th>
            <th className="pb-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map((order) => (
            <tr key={order.id} className="group hover:bg-slate-50/50">
              <td className="py-5">
                <p className="text-xs font-black text-slate-900 uppercase italic line-clamp-1">{order.artifact}</p>
                <p className="text-[10px] text-slate-400 font-medium">{order.customer}</p>
              </td>
              <td className="py-5 text-right font-black text-slate-900 text-sm italic">
                {CURRENCY_SYMBOL}{Number(order.amount || 0).toLocaleString()}
              </td>
              <td className="py-5 text-right">
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
    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 italic">Escrow Summary</h2>
      <div className="space-y-6 relative z-10">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Available Liquidity</p>
          <p className="text-4xl font-black italic tracking-tighter">
            {CURRENCY_SYMBOL}{Number(wallet.availableBalance || 0).toLocaleString()}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800">
          <div>
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">In Escrow</p>
            <p className="text-sm font-black text-orange-500 italic">
              {CURRENCY_SYMBOL}{Number(wallet.pendingBalance || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Life-time</p>
            <p className="text-sm font-black text-green-500 italic">
              {CURRENCY_SYMBOL}{Number(wallet.totalEarnings || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <button className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-2">
          Request Settlement <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: 'bg-green-50 text-green-600 border-green-100',
    PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
    SHIPPED: 'bg-slate-900 text-white border-slate-900',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black border tracking-tighter ${styles[status] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>
      {status?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
}

function SecurityCard() {
  return (
    <div className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-start gap-4">
      <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><ShieldCheck size={20} /></div>
      <div>
        <p className="text-[10px] font-black text-slate-900 uppercase mb-1">Security Protocol</p>
        <p className="text-[9px] text-slate-400 italic">48-hour return window verification active.</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA] gap-6">
      <Loader2 className="animate-spin text-orange-600" size={48} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic animate-pulse">Syncing Registry Node...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string | null }) {
  return (
    <div className="h-screen flex items-center justify-center bg-[#FAFAFA] p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center max-w-sm">
        <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">Sync Interrupted</h3>
        <p className="text-xs text-slate-400 font-medium mb-8 italic">{message}</p>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Reconnect</button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-300">
      <PackageOpen size={64} strokeWidth={1} className="mb-4 opacity-20" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No Requisitions Found</p>
    </div>
  );
}