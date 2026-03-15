import { 
  DollarSign, Users, Store, Package, ShoppingCart, 
  AlertTriangle, RefreshCcw, ShieldCheck, UserPlus, TrendingUp 
} from 'lucide-react';

interface StatGridProps {
  stats: {
    performance?: {
      totalUsers: number;
      activeVendors: number;
      totalProducts: number;
      totalOrders: number;
    };
    revenue?: {
      revenue: number;
      orders: number;
      commission: number;
    };
    moderation?: {
      pendingWithdrawals: number;
      pendingProducts: number;
      pendingKyc: number;
    };
  };
}

export function StatGrid({ stats }: StatGridProps) {
  const cards = [
    { 
      title: 'Total Revenue', 
      value: `$${(stats?.revenue?.revenue ?? 0).toLocaleString()}`, 
      trend: '+12.5%', 
      icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' 
    },
    { 
      title: 'Platform Comm.', 
      value: `$${(stats?.revenue?.commission ?? 0).toLocaleString()}`, 
      trend: '+8.2%', 
      icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' 
    },
    { 
      title: 'Total Orders', 
      value: stats?.performance?.totalOrders ?? 0, 
      trend: '+14', 
      icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' 
    },
    { 
      title: 'Active Vendors', 
      value: stats?.performance?.activeVendors ?? 0, 
      trend: '+2', 
      icon: Store, color: 'text-purple-600', bg: 'bg-purple-50' 
    },
    { 
      title: 'Total Customers', 
      value: stats?.performance?.totalUsers ?? 0, 
      trend: '+5', 
      icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' 
    },
    { 
      title: 'Pending KYC', 
      value: stats?.moderation?.pendingKyc ?? 0, 
      status: 'Action Required',
      icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' 
    },
    { 
      title: 'Pending Products', 
      value: stats?.moderation?.pendingProducts ?? 0, 
      status: 'In Queue',
      icon: Package, color: 'text-rose-600', bg: 'bg-rose-50' 
    },
    { 
      title: 'Withdrawals', 
      value: stats?.moderation?.pendingWithdrawals ?? 0, 
      status: 'Pending Payout',
      icon: RefreshCcw, color: 'text-cyan-600', bg: 'bg-cyan-50' 
    },
    { 
      title: 'Open Disputes', 
      value: '0', 
      status: 'Healthy',
      icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' 
    },
    { 
      title: 'New Users (24h)', 
      value: '+0', 
      trend: '0%',
      icon: UserPlus, color: 'text-teal-600', bg: 'bg-teal-50' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-2xl ${card.bg} ${card.color} transition-transform group-hover:scale-110`}>
              <card.icon size={20} />
            </div>
            {card.trend ? (
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                {card.trend}
              </span>
            ) : (
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Live</span>
            )}
          </div>
          
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">{card.title}</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</p>
          
          {card.status && (
             <p className="text-[9px] font-bold text-slate-400 mt-2 italic flex items-center gap-1">
               <span className="w-1 h-1 rounded-full bg-slate-300"></span>
               {card.status}
             </p>
          )}
        </div>
      ))}
    </div>
  );
}