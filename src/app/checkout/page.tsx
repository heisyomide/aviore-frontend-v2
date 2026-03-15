'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { 
  ShieldCheck, CreditCard, ChevronRight, Loader2, 
  MapPin, Tag, Sparkles, Zap, Package, Building2, Clock
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Footer } from '../../components/Footer';
import { Navbar } from '@/src/components/Header';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();

  const [address, setAddress] = useState<any>(null);
  const [fetchingAddress, setFetchingAddress] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const checkoutItems = items.filter(i => i.selected && !i.isOutOfStock);
  const total = subtotal - discount;

  // AUTH_GUARD: Ensure session is active and manifest is not empty
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login?redirect=/checkout');
    } else if (checkoutItems.length === 0) {
      router.push('/cart');
    }
  }, [checkoutItems.length, router]);

  /* ---------------- AUTOMATIC_CAMPAIGN_SYNC ---------------- */
useEffect(() => {
  // 1. ABRT_CONTROLLER: Prevents memory leaks and race conditions if checkoutItems change rapidly
  const controller = new AbortController();

  const syncAutomaticDiscounts = async () => {
    // Guard: Only sync if manifest contains items
    if (!checkoutItems?.length) return;

    try {
      const res = await api.post('/orders/calculate-valuation', 
        {
          // 2. TYPE_ENFORCEMENT: Ensure values are strict numbers for Prisma compatibility
          items: checkoutItems.map(i => ({
            productId: i.id, 
            price: Number(i.price),
            quantity: Number(i.quantity)
          }))
        },
        { 
          signal: controller.signal,
          // 3. AUTH_INJECTION: Ensure headers are explicit if not global
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      // 4. DATA_HANDSHAKE: Verify the structure before updating UI state
      if (res.data?.summary) {
        const { summary } = res.data;
        setCouponData(summary);
        setDiscount(summary.totalDiscount);
      }
    } catch (err: any) {
      // Ignore errors caused by component unmounting
      if (err.name === 'CanceledError') return;
      
      console.error("VALUATION_SYNC_FAILURE:", {
        status: err.response?.status,
        payload: err.response?.data || err.message
      });
    }
  };

  syncAutomaticDiscounts();

  // CLEANUP_PHASE
  return () => controller.abort();
}, [checkoutItems]);

  /* ---------------- ADDRESS_PROTOCOL ---------------- */

  const fetchPrimaryAddress = useCallback(async () => {
    try {
      setFetchingAddress(true);
      const res = await api.get('/user/addresses');
      // Logic: Prioritize default node or fallback to initial entry
      const primary = res.data.find((a: any) => a.isDefault) || res.data[0];
      setAddress(primary);
    } catch {
      toast.error("SYNC_ERROR", { description: "Address registry unreachable." });
    } finally {
      setFetchingAddress(false);
    }
  }, []);

  useEffect(() => { fetchPrimaryAddress(); }, [fetchPrimaryAddress]);

  /* ---------------- VALUATION_ENGINE (COUPON) ---------------- */

  const applyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    try {
      // POST request to match the backend Valuation Registry
      const res = await api.post('/vendor/marketing/validate', {
        code: couponCode.toUpperCase().trim(),
        orderValue: subtotal 
      });

      const { discountType, discountValue, couponId } = res.data;
      
      // Calculate actual discount amount from rate or fixed value
      const calculatedDiscount = discountType === 'PERCENTAGE' 
        ? (subtotal * (Number(discountValue) / 100)) 
        : Number(discountValue);

      setDiscount(calculatedDiscount);
      setCouponData(res.data);
      toast.success("REWARD_AUTHORIZED", { description: "Valuation adjusted." });
    } catch (err: any) {
      setDiscount(0);
      setCouponData(null);
      toast.error("INVALID_PROTOCOL", { 
        description: err.response?.data?.message || "Coupon code rejected by registry." 
      });
    } finally {
      setApplyingCoupon(false);
    }
  };

  /* ---------------- TRANSACTION_INITIALIZATION ---------------- */

  const handlePlaceOrder = async () => {
    if (!address) return toast.error("SHIPPING_MISSING");

    setIsProcessing(true);
    try {
      const payload = {
  items: checkoutItems.map(i => ({
    productId: i.id,
    quantity: i.quantity,
    price: i.price
  })),
  addressId: address.id,
  paymentMethod: selectedPayment,
  // Pass the campaign data so backend records WHY the price is lower
  appliedCampaigns: couponData?.appliedCampaigns || [], 
  totalAmount: total
};
      const res = await api.post('/orders/create', payload);
      toast.success("TRANSACTION_AUTHORIZED");
      
      clearCart();
      router.push(`/dashboard/orders/${res.data.id}`);
    } catch (err: any) {
      toast.error("TRANSACTION_FAILED", { description: err.response?.data?.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#FDFCFB] min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-6 italic font-black uppercase tracking-tighter">
        <Breadcrumb />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-10">
        
        {/* LEFT: REGISTRY INPUTS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SHIPPING NODE */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-base text-[#A4143D] font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
              <MapPin size={18} className="text-[#A4143D]" /> Shipping Address
            </h3>

            {fetchingAddress ? (
              <div className="h-24 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-200" />
              </div>
            ) : address ? (
              <div className="p-6 bg-gray-50 rounded-2xl border border-[#A4143D]/10 group transition-all">
                <p className="font-black text-gray-900 uppercase italic text-lg leading-none mb-2">{address.fullName}</p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{address.street}, {address.city}, {address.state}</p>
                <p className="text-[10px] text-[#A4143D] font-bold mt-4 tracking-widest uppercase">{address.phoneNumber}</p>
              </div>
            ) : (
              <Link href="/dashboard/addresses" className="block p-10 border-2 border-dashed border-gray-100 rounded-[1.5rem] text-center hover:border-[#A4143D] transition-all group">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#A4143D]">Link new shipping node</p>
              </Link>
            )}
          </section>

          {/* ARTIFACT MANIFEST */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-base text-[#A4143D] font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
              <Package size={18} className="text-[#A4143D]" /> Artifact Manifest ({checkoutItems.length})
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {checkoutItems.map(item => (
                <div key={item.id} className="aspect-square bg-gray-50 rounded-[1.5rem] overflow-hidden border border-gray-50 group shadow-sm">
                  <Image src={item.image} alt={item.name} width={150} height={150} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </section>

          {/* PAYMENT PROTOCOL */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-base text-[#A4143D] font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
               <Zap size={18} className="text-[#A4143D]" /> Payment Method
            </h3>
            <div className="grid md:grid-cols-2 text-[#A4143D] gap-4">
              <PaymentOption id="card" label="Flutterwave" icon={<CreditCard size={18}/>} selected={selectedPayment==='card'} onSelect={setSelectedPayment} />
              <PaymentOption id="bank" label="Bank Transfer" icon={<Building2 size={18}/>} selected={selectedPayment==='bank'} onSelect={setSelectedPayment} />
            </div>
          </section>
        </div>

        {/* RIGHT: VALUATION ASIDE */}
        <aside className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl sticky top-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A4143D]">
                <Sparkles size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Valuation_Protocol</span>
              </div>
            </div>

            {/* REWARD ENTRY */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Growth_Reward_Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="CODE_2024"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex-1 text-xs font-black uppercase placeholder:text-gray-300 outline-none focus:border-[#A4143D]"
                />
                <button
                  onClick={applyCoupon}
                  disabled={applyingCoupon || !couponCode}
                  className="bg-gray-900 text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#A4143D] disabled:opacity-20"
                >
                  {applyingCoupon ? <Loader2 className="animate-spin" size={16}/> : "Apply"}
                </button>
              </div>
            </div>

{/* PRICE TABLE */}
<div className="space-y-4 pt-6 border-t border-gray-50">
  <PriceRow label="Artifact Subtotal" value={subtotal} />

  {/* 1. MANUAL COUPON FALLBACK: If a manual code was used and no automatic campaigns are present */}
  {discount > 0 && !couponData?.appliedCampaigns && (
    <PriceRow label="Registry Reward" value={-discount} color="text-[#A4143D]" />
  )}

  {/* 2. AUTOMATIC CAMPAIGNS: Loop through specific campaign deductions (e.g., Summer Sales) */}
  {couponData?.appliedCampaigns?.map((camp: any, idx: number) => (
    <div key={idx} className="flex justify-between items-center text-[#A4143D]">
      <span className="text-[10px] font-black uppercase flex items-center gap-2 tracking-widest">
        <Zap size={10} fill="currentColor" className="animate-pulse" /> {camp.title}
      </span>
      <span className="text-[11px] font-black italic">- ₦{camp.amount.toLocaleString()}</span>
    </div>
  ))}

  <PriceRow label="Logistics" value="COMPLIMENTARY" />
  
  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
    <span className="text-sm font-black uppercase italic tracking-tighter text-gray-400">Net Valuation</span>
    <span className="text-3xl font-black italic tracking-tighter text-gray-900 leading-none">
      ₦{total.toLocaleString()}
    </span>
  </div>
</div>
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full h-16 bg-[#A4143D] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-[#A4143D]/30 transition-all active:scale-95 disabled:opacity-30"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20}/> : <>Authorize Transaction <ChevronRight size={18}/></>}
            </button>

            <div className="flex items-center justify-center gap-2 pt-4">
              <ShieldCheck size={14} className="text-gray-300" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Encrypted_Sequence</span>
            </div>
          </div>
        </aside>
      </main>
     
    </div>
  );
}

// UI HELPERS
function PaymentOption({ id, label, icon, selected, onSelect }: any) {
  return (
    <label onClick={() => onSelect(id)} className={`flex gap-4 items-center border p-5 rounded-2xl cursor-pointer transition-all duration-300 ${selected ? 'border-[#A4143D] bg-[#FDFCFB] shadow-lg' : 'border-gray-50 hover:border-gray-200'}`}>
      <div className={`p-3 rounded-xl ${selected ? 'bg-[#A4143D] text-white' : 'bg-gray-100 text-gray-400'}`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </label>
  );
}

function PriceRow({ label, value, color = "text-gray-500" }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
      <span className={`text-[11px] font-black uppercase ${color}`}>{typeof value === 'number' ? `₦${value.toLocaleString()}` : value}</span>
    </div>
  );
}