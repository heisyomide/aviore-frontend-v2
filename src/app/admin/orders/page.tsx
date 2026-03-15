"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Terminal, 
  ShoppingBag, 
  User, 
  CreditCard, 
  Clock, 
  CheckCircle,
  Truck,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { api } from '@/src/lib/axios';

interface Order {
  id: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  user: { firstName: string | null; lastName: string | null; email: string };
  items: Array<{ product: { name: string }; vendor: { storeName: string } }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } catch (error) {
      toast.error("PROTOCOL ERROR: Failed to sync transaction nodes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success(`LOGISTICS UPDATED: Order ${status.toLowerCase()}`);
      fetchOrders();
    } catch (error) {
      toast.error("OVERRIDE FAILED: Status update rejected.");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-[#020202] min-h-screen text-zinc-100">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/50 pb-8 font-sans">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500">
            <Terminal size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ledger // Transaction Monitoring</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            Order <span className="text-zinc-600">Control</span>
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            Protocol: Logistics & Financial Oversight
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-emerald-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative flex items-center bg-black border border-zinc-800 rounded-lg px-4 py-3">
            <Search className="w-4 h-4 text-zinc-600 mr-3" />
            <input 
              type="text"
              placeholder="FILTER BY ID OR CUSTOMER..."
              className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest uppercase w-full md:w-64 placeholder:text-zinc-700 font-mono"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-zinc-800 bg-[#050505] overflow-hidden shadow-2xl font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-zinc-800">
                <th className="p-6">Order ID</th>
                <th className="p-6">Customer</th>
                <th className="p-6">Value</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={5} className="p-10 bg-zinc-900/10"></td></tr>
                ))
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-all duration-200">
                  <td className="p-6 font-mono text-[11px] text-zinc-500 uppercase italic">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-300 uppercase">
                        {order.user.firstName ?? 'UNIDENTIFIED'} {order.user.lastName ?? ''}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono">{order.user.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-1.5 font-mono">
                      <CreditCard size={12} className="text-zinc-700" />
                      <span className="text-sm font-black text-white italic">₦{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${
                      order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      order.status === "CANCELLED" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                      "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <select 
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      value={order.status}
                      className="bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 p-2 rounded-lg outline-none hover:border-zinc-600 transition-all"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}