'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Loader2, 
  PackageCheck, 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Truck,
  ExternalLink,
  ClipboardList
} from 'lucide-react';

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
      // Logic: Backend now returns order items belonging only to this vendor
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('REGISTRY_SYNC_ERROR:', error);
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
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, ...tracking })
      });

      if (response.ok) {
        // Optimized State Update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, ...tracking } : o));
        setShowTrackingModal(null);
        setTrackingData({ trackingNumber: '', carrier: '' });
      }
    } catch (error) {
      alert('NODE_COMMUNICATION_FAILURE: Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 p-6 lg:p-10 bg-[#FAFAFA] min-h-screen animate-in fade-in duration-500">
      
      {/* 1. EXECUTIVE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Logistics Hub</h1>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Fulfillment Protocol & Registry Tracking</p>
        </div>
        
        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="FILTER BY REGISTRY ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest w-full outline-none shadow-sm focus:ring-4 focus:ring-orange-500/5 transition-all" 
          />
        </div>
      </div>

      {/* 2. NAVIGATION NODES */}
      <div className="flex gap-8 border-b border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
        {STATUS_OPTIONS.map((s) => (
          <button 
            key={s} 
            onClick={() => setActiveTab(s)}
            className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative ${
              activeTab === s ? 'text-orange-600' : 'text-slate-300 hover:text-slate-600'
            }`}
          >
            {s}
            {activeTab === s && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 animate-in slide-in-from-left duration-300" />}
          </button>
        ))}
      </div>

      {/* 3. ORDER REGISTRY TABLE */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-6">Registry Node</th>
                <th className="p-6">Customer Node</th>
                <th className="p-6 text-right">Settlement</th>
                <th className="p-6">Fulfillment</th>
                <th className="p-6 text-right">Manifest</th>
                <th className="p-6 text-right">Operations</th>
              </tr>
            </thead>
            {filteredOrders.map((order) => (
              <tbody key={order.id} className="border-b border-slate-50 last:border-none">
                <tr className="hover:bg-slate-50/30 transition-all group">
                  <td className="p-6">
                    <div className="font-mono text-xs font-black text-slate-900 italic uppercase">
                       {order.orderNumber || `#${order.id.slice(-8).toUpperCase()}`}
                    </div>
                    <div className="text-[9px] text-slate-300 font-bold mt-1 uppercase">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-xs font-black text-slate-800 uppercase tracking-tight">
                      {order.user?.firstName} {order.user?.lastName}
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium italic">{order.user?.email}</div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="text-xs font-black text-slate-900 italic">₦{Number(order.totalAmount).toLocaleString()}</div>
                    <p className="text-[8px] text-slate-300 font-bold uppercase">Authorized</p>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1.5">
                        <StatusBadge status={order.status} />
                        {order.trackingNumber && (
                            <span className="text-[9px] font-black text-blue-600 flex items-center gap-1 italic uppercase tracking-tighter">
                                <Truck size={10} strokeWidth={3} /> {order.carrier} / {order.trackingNumber}
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="inline-flex items-center gap-2 text-[9px] font-black uppercase text-slate-400 hover:text-orange-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg"
                    >
                      {expandedOrderId === order.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      Manifest
                    </button>
                  </td>
                  <td className="p-6 text-right relative">
                    <select 
                      disabled={updatingId === order.id || order.status === 'COMPLETED'}
                      value={order.status}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'SHIPPED') setShowTrackingModal(order.id);
                        else handleUpdateStatus(order.id, val);
                      }}
                      className="appearance-none bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:bg-orange-600 transition-all disabled:opacity-30"
                    >
                      {STATUS_OPTIONS.filter(opt => opt !== 'ALL').map(opt => (
                        <option key={opt} value={opt} className="bg-white text-slate-900">{opt}</option>
                      ))}
                    </select>

                    {/* TRACKING POPOVER */}
                    {showTrackingModal === order.id && (
                        <div className="absolute right-6 top-16 z-30 bg-white border border-slate-100 shadow-2xl p-6 rounded-[2rem] w-72 text-left animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Truck size={16} className="text-orange-600" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Shipment Protocol</p>
                            </div>
                            <div className="space-y-3">
                                <input 
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                                    placeholder="Carrier (e.g. DHL, GIGM)"
                                    value={trackingData.carrier}
                                    onChange={(e) => setTrackingData({...trackingData, carrier: e.target.value})}
                                />
                                <input 
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                                    placeholder="Tracking Ref Number"
                                    value={trackingData.trackingNumber}
                                    onChange={(e) => setTrackingData({...trackingData, trackingNumber: e.target.value})}
                                />
                                <div className="flex gap-2 pt-2">
                                    <button 
                                        onClick={() => handleUpdateStatus(order.id, 'SHIPPED', trackingData)}
                                        className="flex-1 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20"
                                    >
                                        Authorize
                                    </button>
                                    <button 
                                        onClick={() => setShowTrackingModal(null)}
                                        className="flex-1 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                  </td>
                </tr>
                
                {/* EXPANDABLE MANIFEST */}
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={6} className="bg-[#FCFCFC] p-8 animate-in slide-in-from-top-4 duration-500 border-b border-slate-100">
                       <OrderItemsList items={order.items || []} />
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

/* ------------------ */
/* LOGISTICS SUB-COMPONENTS */
/* ------------------ */

function OrderItemsList({ items }: { items: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
          <ClipboardList size={14} /> Manifest Nodes ({items.length})
        </h4>
        <button className="text-[9px] font-black text-orange-600 uppercase flex items-center gap-1 hover:underline">
           <ExternalLink size={12} /> Print Packing Slip
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-6 bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50 relative">
              <img 
                src={item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/100'} 
                alt="Artifact" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              />
              <div className="absolute top-1 right-1 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                x{item.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 uppercase italic truncate">{item.product?.title || 'Unknown Artifact'}</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">SKU: {item.productId.slice(0, 8)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-900 italic">₦{Number(item.priceAtPurchase).toLocaleString()}</p>
              <p className={`text-[8px] font-black uppercase mt-1 ${item.payoutStatus === 'AVAILABLE' ? 'text-green-500' : 'text-orange-500'}`}>
                {item.payoutStatus || 'LOCKED'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: 'bg-slate-100 text-slate-400 border-slate-100',
    PAID: 'bg-green-50 text-green-600 border-green-100',
    PROCESSING: 'bg-orange-50 text-orange-600 border-orange-100 shadow-lg shadow-orange-500/10',
    SHIPPED: 'bg-blue-50 text-blue-600 border-blue-100',
    DELIVERED: 'bg-slate-900 text-white border-slate-900',
    COMPLETED: 'bg-emerald-600 text-white border-emerald-600',
    CANCELLED: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black border uppercase tracking-widest inline-block ${styles[status] || 'bg-gray-50 text-gray-500'}`}>
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-orange-600" size={48} />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-ping" />
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse italic">Syncing Logistics Registry...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-32 text-center text-slate-200 flex flex-col items-center gap-4">
      <PackageCheck size={80} strokeWidth={0.5} className="opacity-10" />
      <p className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-300">No active requisitions found in node</p>
    </div>
  );
}