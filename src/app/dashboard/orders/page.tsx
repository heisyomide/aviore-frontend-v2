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

export default function OrdersPage() {
  return (
    <Suspense fallback={<LoadingRegistry />}>
      <OrdersContent />
    </Suspense>
  );
}

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
      toast.error("Failed to sync personal transaction registry lines.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (orderItemId: string) => {
    try {
      setIsSettling(orderItemId);
      const response = await api.post(`/orders/fulfillment/${orderItemId}/confirm-receipt`);
      if (response.data.success) {
        toast.success("Receipt Confirmed", { description: "Funds successfully signed over to vendor wallet protocol." });
        await fetchOrders();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Protocol signature failed.");
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
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 text-zinc-100 selection:bg-[#C5A880]/20">
      
      {/* ARCHITECTURAL HEADER HUD */}
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between border-b border-zinc-900 pb-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">Order Registry</h1>
            <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-[0.25em]">Transaction_Archive // {filteredOrders.length}_Records</p>
          </div>
          <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-[#C5A880]">
            <Package size={13} className="animate-pulse" />
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white">Ledger_Online</span>
          </div>
        </div>

        {/* SEARCH & DISPLAY TUNING GRID */}
        <div className="grid md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-9 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#C5A880] transition-colors" size={13} />
            <input 
              type="text"
              placeholder="Query Manifest ID Reference Key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 bg-[#111113]/60 border border-zinc-900 rounded-lg text-[10px] font-mono font-bold outline-none focus:bg-zinc-950 focus:border-zinc-800 transition-all uppercase placeholder:text-zinc-700 tracking-wider text-white"
            />
          </div>
          <div className="md:col-span-3 flex justify-end gap-1.5 p-1 bg-zinc-950 border border-zinc-900/60 rounded-lg max-w-[120px] ml-auto w-full">
             <button className="p-2 rounded bg-[#111113] border border-zinc-900 text-white w-1/2 flex justify-center"><List size={12} /></button>
             <button className="p-2 rounded text-zinc-600 hover:text-zinc-400 w-1/2 flex justify-center transition-colors"><LayoutGrid size={12} /></button>
          </div>
        </div>
      </div>

      {/* SEGMENTED TAB MATRIX TIMELINE */}
      <div className="flex gap-8 border-b border-zinc-900/40 overflow-x-auto no-scrollbar scroll-smooth">
        {(['all', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'] as OrderStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3.5 text-[9px] font-mono font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-[#C5A880]' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880]" />
            )}
          </button>
        ))}
      </div>

      {/* LOGISTICS DATA FEED */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => {
            const firstItem = order.items?.[0];
            
            return (
              <OrderCard
                key={order.id}
                fullId={order.id}
                id={order.orderNumber || order.id.slice(-8).toUpperCase()}
                date={new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
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

      {/* PORTAL MODALS CONTROLLER */}
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrderId(null)} />}
      {selectedProductToRate && <ReviewModal product={selectedProductToRate} onClose={() => setSelectedProductToRate(null)} onSuccess={fetchOrders} />}
      {selectedReturnOrder && <ReturnRequestModal order={selectedReturnOrder} onClose={() => setSelectedReturnOrder(null)} onSuccess={fetchOrders} />}
    </div>
  );
}

function LoadingRegistry() {
  return (
    <div className="h-[50vh] flex flex-col items-center justify-center gap-4 bg-[#0D0D0D]">
      <Loader2 className="animate-spin text-[#C5A880]" size={22} />
      <p className="text-[8px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-600">Synchronizing Ledger Streams...</p>
    </div>
  );
}

function EmptyRegistry() {
  return (
    <div className="py-24 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-lg text-center bg-[#111113]/20">
      <div className="p-4 bg-zinc-950 border border-zinc-900 text-zinc-700 rounded-xl mb-4">
        <Inbox size={18} strokeWidth={1.5} />
      </div>
      <div className="text-center space-y-1">
        <p className="text-zinc-400 text-[10px] font-mono font-bold uppercase tracking-wider">No Transactions Registered</p>
        <p className="text-zinc-600 text-xs font-sans">Your personal ledger pipeline is empty.</p>
      </div>
    </div>
  );
}