'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Loader2, 
  PackageCheck, 
  ChevronDown, 
  ChevronUp, 
  Truck,
  ExternalLink,
  ClipboardList,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

// Re-ordered options to reflect explicit sequential supply chain flow
const STATUS_OPTIONS = ['ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Tracking Flow State
  const [showTrackingModal, setShowTrackingModal] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState({ trackingNumber: '', carrier: '' });

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('REGISTRY_SYNC_ERROR:', error);
      toast.error("Registry Sync Failed", { description: "Could not reach downstream logistics nodes." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = activeTab === 'ALL' || order.status === activeTab;
      const ref = (order.orderNumber || order.id).toLowerCase();
      const matchesSearch = ref.includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [activeTab, orders, searchQuery]);

  const handleUpdateStatus = async (orderId: string, newStatus: string, tracking?: typeof trackingData) => {
    if (newStatus === 'COMPLETED') {
      toast.error("Action Prohibited", { 
        description: "Escrow settlement distribution requires buyer cryptographic handshake confirmation." 
      });
      return;
    }

    setUpdatingId(orderId);
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/vendor/orders/${orderId}/status`;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, ...tracking })
      });

      if (response.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, ...tracking } : o));
        setShowTrackingModal(null);
        setTrackingData({ trackingNumber: '', carrier: '' });
        toast.success(`Protocol Committed: ${newStatus}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "State change rejected");
      }
    } catch (error: any) {
      toast.error("State Mutation Failure", { description: error.message });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-10 p-6 lg:p-10 bg-[#0D0D0D] min-h-screen text-zinc-100 animate-in fade-in duration-500">
      
      {/* 1. EXECUTIVE LUXURY HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl font-light tracking-widest text-white uppercase font-sans">
            Order Registry
          </h1>
          <p className="text-zinc-500 text-xs mt-1 font-medium uppercase tracking-wider">
            Logistics manifest nodes & transactional escrow lifecycles
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#991B1B] transition-colors" size={13} />
          <input 
            type="text" 
            placeholder="FILTER BY REGISTRY REFERENCE..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-3 bg-[#111113] border border-zinc-900 rounded-xl text-[10px] font-mono font-bold tracking-widest text-white w-full outline-none transition-all placeholder-zinc-600 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800" 
          />
        </div>
      </div>

      {/* 2. SLICK HORIZONTAL NAVIGATION NODES */}
      <div className="flex gap-8 border-b border-zinc-900/60 overflow-x-auto no-scrollbar scroll-smooth">
        {STATUS_OPTIONS.map((s) => (
          <button 
            key={s} 
            onClick={() => setActiveTab(s)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap relative cursor-pointer ${
              activeTab === s ? 'text-[#991B1B] font-extrabold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {s}
            {activeTab === s && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#991B1B] animate-in slide-in-from-left duration-300" />}
          </button>
        ))}
      </div>

      {/* 3. OBSIDIAN MATRIX REGISTRY CONTAINER */}
      <div className="bg-[#111113] rounded-2xl border border-zinc-900 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-900 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                <th className="p-5">Registry Node</th>
                <th className="p-5">Counterparty</th>
                <th className="p-5 text-right">Settlement Vault</th>
                <th className="p-5">Fulfillment Phase</th>
                <th className="p-5 text-right">Data Manifest</th>
                <th className="p-5 text-right">State Operations</th>
              </tr>
            </thead>
            {filteredOrders.map((order) => (
              <tbody key={order.id} className="border-b border-zinc-900/50 last:border-none">
                <tr className="hover:bg-zinc-950/40 transition-colors group">
                  <td className="p-5">
                    <div className="font-mono text-xs font-bold text-white tracking-wide">
                       {order.orderNumber || `#${order.id.slice(-8).toUpperCase()}`}
                    </div>
                    <div className="text-[9px] text-zinc-600 font-medium mt-1 uppercase font-mono tracking-wider">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-xs font-medium text-zinc-200 uppercase tracking-wide">
                      {order.user?.firstName} {order.user?.lastName}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-light lowercase font-mono tracking-tight mt-0.5">{order.user?.email}</div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="text-xs font-bold text-zinc-100 font-mono">₦{Number(order.totalAmount).toLocaleString()}</div>
                    <p className="text-[8px] text-zinc-600 font-mono font-bold uppercase tracking-wider mt-0.5">AUTH_ESCROW</p>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5 items-start">
                        <StatusBadge status={order.status} />
                        {order.trackingNumber && (
                            <span className="text-[9px] font-mono font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider bg-zinc-950 px-2 py-0.5 border border-zinc-900 rounded-sm">
                                <Truck size={10} className="text-zinc-500" /> {order.carrier} <span className="text-zinc-600">//</span> {order.trackingNumber}
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="inline-flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      {expandedOrderId === order.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      View_Nodes
                    </button>
                  </td>
                  <td className="p-5 text-right relative">
                    <div className="flex items-center justify-end gap-2.5">
                       {updatingId === order.id && <Loader2 size={12} className="animate-spin text-[#991B1B]" />}
                       <select 
                        disabled={updatingId === order.id || order.status === 'COMPLETED' || order.status === 'CANCELLED'}
                        value={order.status}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'SHIPPED') setShowTrackingModal(order.id);
                          else handleUpdateStatus(order.id, val);
                        }}
                        className="appearance-none bg-zinc-950 border border-zinc-900 text-zinc-300 text-[9px] font-mono font-bold uppercase tracking-widest rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-zinc-700 transition-all disabled:opacity-20"
                       >
                        {STATUS_OPTIONS.filter(opt => opt !== 'ALL').map(opt => {
                          const isForbiddenCompletedOption = opt === 'COMPLETED';
                          return (
                            <option 
                              key={opt} 
                              value={opt} 
                              disabled={isForbiddenCompletedOption}
                              className="bg-zinc-950 text-zinc-300 disabled:text-zinc-700"
                            >
                              {opt} {isForbiddenCompletedOption ? '🔒' : ''}
                            </option>
                          );
                        })}
                       </select>
                    </div>

                    {/* PREMIUM OBSIDIAN TRACKING OVERLAY */}
                    {showTrackingModal === order.id && (
                        <div className="absolute right-6 top-16 z-30 bg-zinc-950 border border-zinc-900 shadow-2xl p-5 rounded-2xl w-72 text-left animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Truck size={14} className="text-[#991B1B]" />
                                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">Logistics Deployment</p>
                            </div>
                            <div className="space-y-3">
                                <input 
                                    className="w-full px-3 py-2.5 bg-[#111113] border border-zinc-900 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest text-white outline-none focus:border-zinc-700 transition-all placeholder-zinc-600"
                                    placeholder="Carrier (e.g. DHL, GIGM)"
                                    value={trackingData.carrier}
                                    onChange={(e) => setTrackingData({...trackingData, carrier: e.target.value})}
                                />
                                <input 
                                    className="w-full px-3 py-2.5 bg-[#111113] border border-zinc-900 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest text-white outline-none focus:border-zinc-700 transition-all placeholder-zinc-600"
                                    placeholder="Tracking Identifier"
                                    value={trackingData.trackingNumber}
                                    onChange={(e) => setTrackingData({...trackingData, trackingNumber: e.target.value})}
                                />
                                <div className="flex gap-2 pt-1">
                                    <button 
                                        onClick={() => handleUpdateStatus(order.id, 'SHIPPED', trackingData)}
                                        className="flex-1 bg-[#991B1B] border border-[#991B1B] text-white text-[9px] font-mono font-bold uppercase tracking-widest py-2.5 rounded-lg hover:bg-[#7f1616] hover:border-[#7f1616] transition-colors cursor-pointer"
                                    >
                                        Deploy
                                    </button>
                                    <button 
                                        onClick={() => setShowTrackingModal(null)}
                                        className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-mono font-bold uppercase tracking-widest py-2.5 rounded-lg hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                  </td>
                </tr>
                
                {/* EXPANDABLE LOGISTICS INFRASTRUCTURE MANIFEST */}
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={6} className="bg-zinc-950/40 p-6 animate-in slide-in-from-top-4 duration-400 border-b border-zinc-900">
                       <OrderItemsList items={order.items || []} orderStatus={order.status} />
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </table>
          
          {filteredOrders.length === 0 && <EmptyState />}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- */
/* LOGISTICS MANIFEST SUB-COMPONENTS */
/* --------------------------------- */

function OrderItemsList({ items, orderStatus }: { items: any[], orderStatus: string }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <ClipboardList size={13} /> Loaded Manifest Items ({items.length})
        </h4>
        <button className="text-[9px] font-mono font-bold text-zinc-400 hover:text-white uppercase flex items-center gap-1.5 transition-colors cursor-pointer">
           <ExternalLink size={11} /> Print packing slip
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-5 bg-[#111113] p-4 rounded-xl border border-zinc-900/60 shadow-sm">
            <div className="w-14 h-14 bg-zinc-950 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-900 relative">
              <img 
                src={item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'} 
                alt="Product Item" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              />
              <div className="absolute top-1 right-1 bg-zinc-900 border border-zinc-800 text-white text-[8px] font-mono font-bold px-1 py-0.5 rounded-sm">
                x{item.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 uppercase tracking-wide truncate">{item.product?.title || 'Unknown Artifact'}</p>
              <p className="text-[9px] text-zinc-600 font-mono font-bold mt-1 uppercase tracking-wider">SKU: {item.productId.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-100 font-mono">₦{Number(item.priceAtPurchase).toLocaleString()}</p>
              
              {/* Informative block clarifying automated escrow distribution rules */}
              <div className="mt-1 flex items-center justify-end gap-1 font-mono font-bold text-[8px] uppercase tracking-wider">
                {orderStatus === 'COMPLETED' ? (
                  <span className="text-emerald-500 flex items-center gap-0.5"><CheckCircle2 size={9} /> RELEASED</span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-0.5"><Lock size={8} /> ESCROW_HELD</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: 'bg-zinc-950 border-zinc-800 text-zinc-500',
    PAID: 'bg-zinc-950 border-zinc-800 text-emerald-500',
    PROCESSING: 'bg-zinc-950 border-zinc-800 text-amber-500',
    SHIPPED: 'bg-zinc-950 border-zinc-800 text-blue-400',
    DELIVERED: 'bg-zinc-950 border-zinc-700 text-zinc-100',
    COMPLETED: 'bg-[#991B1B]/10 border-[#991B1B]/40 text-[#ef4444]',
    CANCELLED: 'bg-zinc-950 border-zinc-900 text-zinc-700 lines-through',
  };
  return (
    <span className={`px-2.5 py-1 border rounded-lg text-[8px] font-mono font-bold uppercase tracking-widest inline-block ${styles[status] || 'bg-zinc-950 border-zinc-900 text-zinc-500'}`}>
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <Loader2 className="animate-spin text-[#991B1B]" size={36} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </div>
      </div>
      <p className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 animate-pulse">Syncing Logistics Registry...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-24 text-center text-zinc-700 flex flex-col items-center gap-4 bg-zinc-950/20">
      <PackageCheck size={56} strokeWidth={1} className="text-zinc-800" />
      <p className="font-mono font-bold uppercase text-[9px] tracking-widest text-zinc-600">No active operational records found inside system matrix</p>
    </div>
  );
}