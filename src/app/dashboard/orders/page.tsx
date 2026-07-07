'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/src/lib/axios';
import OrderCard from '../../../components/dashboard/OrderCard';
import OrderDetailsModal from '../../../components/dashboard/OrderDetailsModal';
import ReviewModal from '../../../components/dashboard/ReviewModal';
import ReturnRequestModal from '../../../components/dashboard/ReturnRequestModal';
import { Loader2, Package, Search, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type OrderStatus = 'all' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';

const TABS: { value: OrderStatus; label: string }[] = [
  { value: 'all',       label: 'All'       },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped',   label: 'Shipped'   },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const intent      = searchParams.get('intent') as 'chat' | 'return' | null;

  const [orders,    setOrders]    = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [query,     setQuery]     = useState('');

  const [selectedOrderId,       setSelectedOrderId]       = useState<string | null>(null);
  const [selectedProductToRate, setSelectedProductToRate] = useState<{ id: string; title: string } | null>(null);
  const [selectedReturnOrder,   setSelectedReturnOrder]   = useState<any | null>(null);
  const [isSettling,            setIsSettling]            = useState<string | null>(null);

  const selectedOrder = useMemo(
    () => orders.find(o => o.id === selectedOrderId),
    [orders, selectedOrderId],
  );

  useEffect(() => {
    if (intent === 'return') setActiveTab('delivered');
    fetchOrders();
  }, [intent]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-history');
      setOrders(res.data);
    } catch {
      toast.error('Could not load orders', { description: 'Check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (orderItemId: string) => {
    try {
      setIsSettling(orderItemId);
      const res = await api.post(`/orders/${orderItemId}/confirm-receipt`);
      if (res.data.success) {
        toast.success('Receipt confirmed', { description: 'Payment released to vendor.' });
        await fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Confirmation failed.');
    } finally {
      setIsSettling(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return orders.filter(order => {
      const status = order.status.toLowerCase();
      const matchTab =
        activeTab === 'all' ||
        (activeTab === 'processing' && (status === 'processing' || status === 'paid')) ||
        status === activeTab;
      const matchSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(q));
      return matchTab && matchSearch;
    });
  }, [activeTab, orders, query]);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-white pb-28 font-sans antialiased">

      {/* ── Header ── */}
      <div className="mb-8">
        <button
          onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400 hover:text-zinc-700 mb-5 transition-colors"
        >
          <ArrowLeft size={13} /> Back
        </button>

        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Package size={11} className="text-[#A4143D]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#A4143D]">
                Order History
              </span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
              Your Orders
            </h1>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 pb-1">
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-6">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by order number or ID…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:bg-white focus:border-zinc-400 transition-all placeholder:text-zinc-400"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-0 border-b border-zinc-100 mb-6 overflow-x-auto no-scrollbar">
        {TABS.map(({ value, label }) => {
          const count = value === 'all'
            ? orders.length
            : orders.filter(o => {
                const s = o.status.toLowerCase();
                return value === 'processing'
                  ? s === 'processing' || s === 'paid'
                  : s === value;
              }).length;

          return (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`relative pb-3 mr-5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                activeTab === value ? 'text-zinc-900' : 'text-zinc-300 hover:text-zinc-500'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`ml-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                  activeTab === value ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {count}
                </span>
              )}
              {activeTab === value && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Order List ── */}
      {filtered.length > 0 ? (
        <div className="divide-y divide-zinc-100">
          {filtered.map(order => {
            const firstItem = order.items?.[0];
            return (
              <div key={order.id} className="py-5 first:pt-0">
                <OrderCard
                  fullId={order.id}
                  id={order.orderNumber || order.id.slice(-8).toUpperCase()}
                  date={new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                  amount={Number(order.totalAmount)}
                  status={order.status.toLowerCase() as any}
                  vendorId={order.vendorId}
                  onOpenDetails={id => setSelectedOrderId(id)}
                  onConfirmReceipt={() => firstItem && handleConfirmReceipt(firstItem.id)}
                  isSettling={isSettling === firstItem?.id}
                  onRateProduct={() =>
                    firstItem &&
                    setSelectedProductToRate({ id: firstItem.productId, name: firstItem.product.title } as any)
                  }
                  onReturnRequest={() =>
                    firstItem &&
                    setSelectedReturnOrder({
                      id: order.id,
                      vendorId: order.vendorId,
                      productTitle: firstItem.product.title,
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyOrders hasQuery={!!query} />
      )}

      {/* ── Modals ── */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrderId(null)} />
      )}
      {selectedProductToRate && (
        <ReviewModal
          product={selectedProductToRate as any}
          onClose={() => setSelectedProductToRate(null)}
          onSuccess={fetchOrders}
        />
      )}
      {selectedReturnOrder && (
        <ReturnRequestModal
          order={selectedReturnOrder}
          onClose={() => setSelectedReturnOrder(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-zinc-400" size={20} strokeWidth={1.5} />
      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Loading orders</span>
    </div>
  );
}

function EmptyOrders({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/30">
      <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center">
        <ShoppingBag size={22} className="text-zinc-300" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-tight text-zinc-800">
          {hasQuery ? 'No matches' : 'No orders yet'}
        </p>
        <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">
          {hasQuery
            ? 'Try a different order number or ID.'
            : 'Your orders will appear here once you shop.'}
        </p>
      </div>
    </div>
  );
}