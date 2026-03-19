'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/src/lib/axios';
import OrderCard from '../../../components/dashboard/OrderCard';
import OrderDetailsModal from '../../../components/dashboard/OrderDetailsModal';
import ReviewModal from '../../../components/dashboard/ReviewModal';
import ReturnRequestModal from '../../../components/dashboard/ReturnRequestModal';
import { Loader2, Package, Search, Inbox, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';

type OrderStatus = 'all' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';

/**
 * 🚀 MAIN EXPORT
 * Rule 15: Wraps search-dependent content in Suspense for Next.js 15+ build stability.
 */
export default function OrdersPage() {
  return (
    <Suspense fallback={<LoadingRegistry />}>
      <OrdersContent />
    </Suspense>
  );
}

/**
 * 🏛️ CLIENT CONTENT ENGINE
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
      toast.error("Failed to sync your order history.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (orderItemId: string) => {
    try {
      setIsSettling(orderItemId);
      const response = await api.post(`/orders/${orderItemId}/confirm-receipt`);
      if (response.data.success) {
        toast.success("Receipt Confirmed", { description: "Funds released to vendor." });
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
        (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower))
      );
    });
  }, [activeTab, orders, searchQuery]);

  if (loading) return <LoadingRegistry />;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* 1. HEADER HUD */}
      <div className="flex flex-col gap-8">
        <div className="flex items-end justify-between border-b border-zinc-50 pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter leading-none">Order History</h1>
            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Transaction_Archive // {filteredOrders.length}_Records</p>
          </div>
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-950 rounded-xl text-[#A4143D] shadow-2xl shadow-zinc-200">
            <Package size={18} />
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Registry_Active</span>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="grid md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-9 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-[#A4143D] transition-colors" size={18} />
            <input 
              type="text"
              placeholder="SEARCH BY ORDER REFERENCE OR ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-3xl text-[12px] font-black outline-none focus:bg-white focus:ring-8 focus:ring-[#A4143D]/5 transition-all uppercase placeholder:text-zinc-300"
            />
          </div>
          <div className="md:col-span-3 flex justify-end gap-2 p-1.5 bg-zinc-100 rounded-2xl">
             <button className="p-2.5 rounded-xl bg-white text-zinc-900 shadow-sm"><List size={16} /></button>
             <button className="p-2.5 rounded-xl text-zinc-400 hover:text-zinc-600"><LayoutGrid size={16} /></button>
          </div>
        </div>
      </div>

      {/* 2. STATUS TABS */}
      <div className="flex gap-10 border-b border-zinc-100 overflow-x-auto no-scrollbar scroll-smooth">
        {['all', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as OrderStatus)}
            className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-[#A4143D]' : 'text-zinc-300 hover:text-zinc-400'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#A4143D] rounded-full shadow-[0_2px_10px_rgba(164,20,61,0.3)]" />
            )}
          </button>
        ))}
      </div>

      {/* 3. ORDER LIST */}
      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => {
            const firstItem = order.items?.[0];
            
            return (
              <OrderCard
                key={order.id}
                fullId={order.id}
                id={order.orderNumber || order.id.slice(-8).toUpperCase()}
                date={new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                amount={Number(order.totalAmount)}
                status={order.status.toLowerCase() as any}
                vendorId={order.vendorId}
                onOpenDetails={(id) => setSelectedOrderId(id)}
                onConfirmReceipt={() => firstItem && handleConfirmReceipt(firstItem.id)}
                isSettling={isSettling === firstItem?.id}
                onRateProduct={() => firstItem && setSelectedProductToRate({
                  id: firstItem.productId,
                  title: firstItem.product.title
                })}
                onReturnRequest={() => firstItem && setSelectedReturnOrder({
                  id: order.id,
                  vendorId: order.vendorId,
                  productTitle: firstItem.product.title
                })}
              />
            );
          })
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
    <div className="h-[50vh] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-[#A4143D]" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 animate-pulse">Syncing History</p>
    </div>
  );
}

function EmptyRegistry() {
  return (
    <div className="py-40 flex flex-col items-center gap-6 border border-zinc-100 rounded-[3rem] bg-zinc-50/40">
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Inbox size={32} className="text-zinc-200" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-zinc-900 text-[11px] font-black uppercase tracking-[0.3em]">No Transactions Found</p>
        <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest italic">Your personal registry is currently clear.</p>
      </div>
    </div>
  );
}