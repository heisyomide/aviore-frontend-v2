'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/src/lib/axios';
import OrderCard from '../../../components/dashboard/OrderCard';
import OrderDetailsModal from '../../../components/dashboard/OrderDetailsModal';
import ReviewModal from '../../../components/dashboard/ReviewModal';
import ReturnRequestModal from '../../../components/dashboard/ReturnRequestModal';
import { Loader2, Package, Search, Inbox } from 'lucide-react';
import { toast } from 'sonner';

type OrderStatus = 'all' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';

/**
 * 🚀 1. MAIN EXPORT (The Build Fix)
 * Next.js requires components using useSearchParams to be wrapped in Suspense.
 */
export default function OrdersPage() {
  return (
    <Suspense fallback={<LoadingRegistry />}>
      <OrdersContent />
    </Suspense>
  );
}

/**
 * 🏛️ 2. CLIENT CONTENT ENGINE
 */
function OrdersContent() {
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent') as 'chat' | 'return' | null;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedProductToRate, setSelectedProductToRate] = useState<{id: string, title: string} | null>(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<any | null>(null);
  const [isSettling, setIsSettling] = useState<string | null>(null);

  const selectedOrder = useMemo(() => 
    orders.find(o => o.id === selectedOrderId), 
  [orders, selectedOrderId]);

  useEffect(() => {
    if (intent === 'return') setActiveTab('delivered');
    fetchOrders();
  }, [intent]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-history');
      setOrders(response.data);
    } catch (error) {
      toast.error("Registry sync failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (orderItemId: string) => {
    try {
      setIsSettling(orderItemId);
      const response = await api.post(`/orders/${orderItemId}/confirm-receipt`);
      if (response.data.success) {
        toast.success("Artifact Received", { description: "Funds released to vendor." });
        await fetchOrders();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Confirmation failed.");
    } finally {
      setIsSettling(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const status = order.status.toLowerCase();
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'processing' && (status === 'processing' || status === 'paid')) ||
        status === activeTab;

      const searchLower = searchQuery.toLowerCase();
      return matchesTab && (
        order.id.toLowerCase().includes(searchLower) ||
        order.orderNumber?.toLowerCase().includes(searchLower)
      );
    });
  }, [activeTab, orders, searchQuery]);

  if (loading) return <LoadingRegistry />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6 animate-in fade-in duration-500">
      
      {/* 1. HEADER HUD */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-zinc-900 uppercase italic tracking-tighter">Orders_Registry</h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Vault_Transaction_Log</p>
          </div>
          <div className="p-4 bg-zinc-950 rounded-2xl text-[#A4143D] shadow-xl">
            <Package size={24} />
          </div>
        </div>

        {/* SEARCH ENGINE */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#A4143D] transition-colors" size={16} />
          <input 
            type="text"
            placeholder="FILTER BY ORDER ID OR ITEM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl text-[11px] font-black outline-none focus:ring-4 focus:ring-[#A4143D]/5 transition-all uppercase placeholder:text-zinc-300"
          />
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex gap-8 border-b border-zinc-100 overflow-x-auto no-scrollbar scroll-smooth">
        {['all', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as OrderStatus)}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-[#A4143D]' : 'text-zinc-300 hover:text-zinc-500'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#A4143D] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 3. LIST ENGINE */}
      <div className="grid gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => (
            <OrderCard
              key={order.id}
              fullId={order.id}
              id={order.orderNumber || order.id.slice(-8).toUpperCase()}
              date={new Date(order.createdAt).toLocaleDateString()}
              amount={Number(order.totalAmount)}
              status={order.status.toLowerCase() as any}
              vendorId={order.vendorId}
              onOpenDetails={(id) => setSelectedOrderId(id)}
              onConfirmReceipt={() => handleConfirmReceipt(order.items[0].id)}
              isSettling={isSettling === order.items[0].id}
              onRateProduct={() => setSelectedProductToRate({
                id: order.items[0].productId,
                title: order.items[0].product.title
              })}
              onReturnRequest={() => setSelectedReturnOrder({
                id: order.id,
                vendorId: order.vendorId,
                productTitle: order.items[0].product.title
              })}
            />
          ))
        ) : (
          <EmptyRegistry />
        )}
      </div>

      {/* MODALS */}
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrderId(null)} />}
      {selectedProductToRate && <ReviewModal product={selectedProductToRate} onClose={() => setSelectedProductToRate(null)} onSuccess={fetchOrders} />}
      {selectedReturnOrder && <ReturnRequestModal order={selectedReturnOrder} onClose={() => setSelectedReturnOrder(null)} onSuccess={fetchOrders} />}
    </div>
  );
}

function LoadingRegistry() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-[#A4143D]" size={40} />
        <div className="absolute inset-0 blur-xl bg-[#A4143D]/20 animate-pulse" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Syncing_Vault_Data</p>
    </div>
  );
}

function EmptyRegistry() {
  return (
    <div className="py-32 flex flex-col items-center gap-6 border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/50">
      <Inbox size={48} className="text-zinc-200" />
      <div className="text-center space-y-1">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">No_Artifacts_Found</p>
        <p className="text-zinc-300 text-[9px] font-bold uppercase tracking-widest italic">Registry_is_Empty</p>
      </div>
    </div>
  );
}