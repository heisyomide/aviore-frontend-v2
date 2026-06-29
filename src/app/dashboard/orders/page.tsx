'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/src/lib/axios';
import OrderCard from '../../../components/dashboard/OrderCard';
import OrderDetailsModal from '../../../components/dashboard/OrderDetailsModal';
import ReviewModal from '../../../components/dashboard/ReviewModal';
import ReturnRequestModal from '../../../components/dashboard/ReturnRequestModal';
import { Loader2, Package, Search, Inbox, ArrowLeft } from 'lucide-react';
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
  const router = useRouter();
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

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (loading) return <LoadingRegistry />;

  return (
    <div className="w-full min-h-screen bg-white px-4 md:px-8 py-10 text-zinc-950">
      <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-1 duration-500">
        
        {/* ─── GLOBAL STANDALONE NAVIGATION HEADER ─── */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackNavigation}
                className="p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-900 active:scale-95 transition-all shrink-0"
                aria-label="Navigate backward"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
              </button>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black text-zinc-900 uppercase tracking-tight leading-none">
                  Your Orders
                </h1>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  Registry Account // {filteredOrders.length} Positions Verified
                </p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-600">
              <Package size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Secure View</span>
            </div>
          </div>

          {/* ─── FLAT UTILITIES PANEL ─── */}
          <div className="relative group w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#A4143D] transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Filter transactions by index number or reference code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-zinc-400 transition-all uppercase placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* ─── SCROLLABLE FLAT STATUS SELECTOR ─── */}
        <div className="flex gap-8 border-b border-zinc-100 overflow-x-auto no-scrollbar scroll-smooth">
          {(['all', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'] as OrderStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                activeTab === tab ? 'text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-950 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ─── CLEAN ORDER REGISTRY (NO DENSE CARDS) ─── */}
        <div className="divide-y divide-zinc-100">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => {
              const firstItem = order.items?.[0];
              
              return (
                <div key={order.id} className="py-6 first:pt-0 last:pb-0">
                  <OrderCard
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
                      name: firstItem.product.title
                    } as any)}
                    onReturnRequest={() => firstItem && setSelectedReturnOrder({
                      id: order.id,
                      vendorId: order.vendorId,
                      productTitle: firstItem.product.title
                    })}
                  />
                </div>
              );
            })
          ) : (
            <EmptyRegistry />
          )}
        </div>

        {/* ─── TRANSACTION LAYER MODALS ─── */}
        {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrderId(null)} />}
        {selectedProductToRate && <ReviewModal product={selectedProductToRate as any} onClose={() => setSelectedProductToRate(null)} onSuccess={fetchOrders} />}
        {selectedReturnOrder && <ReturnRequestModal order={selectedReturnOrder} onClose={() => setSelectedReturnOrder(null)} onSuccess={fetchOrders} />}
      </div>
    </div>
  );
}

function LoadingRegistry() {
  return (
    <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4 bg-white">
      <Loader2 className="animate-spin text-zinc-950" size={32} />
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Retrieving Archives</p>
    </div>
  );
}

function EmptyRegistry() {
  return (
    <div className="py-32 flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400">
        <Inbox size={20} />
      </div>
      <div className="space-y-1">
        <p className="text-zinc-900 text-xs font-black uppercase tracking-wider">No Statements Available</p>
        <p className="text-zinc-400 text-[10px] font-medium tracking-normal">This operational search sequence returned empty results.</p>
      </div>
    </div>
  );
}