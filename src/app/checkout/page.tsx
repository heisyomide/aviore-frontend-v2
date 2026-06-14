'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { 
  ShieldCheck, CreditCard, ChevronRight, Loader2, 
  MapPin, Tag, Sparkles, Zap, Package, Building2, Clock, Lock, Truck
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Navbar } from '../../components/navbar/Navbar';


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

  // 🛡️ SECURITY: Verify session and order content
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login?redirect=/checkout');
    } else if (checkoutItems.length === 0) {
      router.push('/cart');
    }
  }, [checkoutItems.length, router]);

  /* ---------------- AUTOMATIC DISCOUNT SYNC ---------------- */
  useEffect(() => {
    const controller = new AbortController();

    const syncAutomaticDiscounts = async () => {
      if (!checkoutItems?.length) return;

      try {
        const res = await api.post('/orders/calculate-valuation', 
          {
            items: checkoutItems.map(i => ({
              productId: i.productId, 
              price: Number(i.price),
              quantity: Number(i.quantity)
            }))
          },
          { 
            signal: controller.signal,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );

        if (res.data?.summary) {
          const { summary } = res.data;
          setCouponData(summary);
          setDiscount(summary.totalDiscount);
        }
      } catch (err: any) {
        if (err.name === 'CanceledError') return;
        console.error("DISCOUNT_SYNC_FAILURE:", err);
      }
    };

    syncAutomaticDiscounts();
    return () => controller.abort();
  }, [checkoutItems]);

  /* ---------------- ADDRESS HANDLING ---------------- */
  const fetchPrimaryAddress = useCallback(async () => {
    try {
      setFetchingAddress(true);
      const res = await api.get('/user/addresses');
      const primary = res.data.find((a: any) => a.isDefault) || res.data[0];
      setAddress(primary);
    } catch {
      toast.error("Error", { description: "Shipping address record unreachable." });
    } finally {
      setFetchingAddress(false);
    }
  }, []);

  useEffect(() => { fetchPrimaryAddress(); }, [fetchPrimaryAddress]);

  /* ---------------- PROMO CODE ENGINE ---------------- */
  const applyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    try {
      const res = await api.post('/vendor/marketing/validate', {
        code: couponCode.toUpperCase().trim(),
        orderValue: subtotal 
      });

      const { discountType, discountValue } = res.data;
      
      const calculatedDiscount = discountType === 'PERCENTAGE' 
        ? (subtotal * (Number(discountValue) / 100)) 
        : Number(discountValue);

      setDiscount(calculatedDiscount);
      setCouponData(res.data);
      toast.success("Promo applied successfully");
    } catch (err: any) {
      setDiscount(0);
      setCouponData(null);
      toast.error("Invalid Code", { 
        description: err.response?.data?.message || "Promo code not recognized." 
      });
    } finally {
      setApplyingCoupon(false);
    }
  };

  /* ---------------- ORDER PLACEMENT ---------------- */
  const handlePlaceOrder = async () => {
    if (!address) {
      return toast.error("Please add a shipping address");
    }

    setIsProcessing(true);

    try {
      // 1. Build Payload structural format for your backend order service
      const payload = {
        items: checkoutItems.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          price: Number(i.price)
        })),
        addressId: address.id,
        paymentMethod: selectedPayment,
        appliedCampaigns: couponData?.appliedCampaigns || []
      };

      // 2. Fire order registration intent
      const res = await api.post('/orders/create', payload);
      
      // Make sure your order handler method responds back with data nested matching this structural hook
      // e.g., res.data = { success: true, data: { paymentLink: '...', orderId: '...' } }
      const paymentLink = res.data?.data?.paymentLink;

      if (!paymentLink) {
        throw new Error("Payment link not generated by checkout service engine.");
      }

      // 3. Purge state cache stores cleanly to protect against double initialization handles
      clearCart();

      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart-storage');
      }

      // 4. Smoothly route them away to the hosted verification page
      toast.success("Order registered!", { description: "Redirecting to payment gateway..." });
      
      setTimeout(() => {
        window.location.href = paymentLink;
      }, 300);

    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Payment initialization failed. Please try again."
      );
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
        
        {/* LEFT: ORDER DETAILS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SHIPPING SECTION */}
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
              <Link href="/dashboard/addresses" className="block p-10 border-2 border-dashed border-gray-100 rounded-3xl text-center hover:border-[#A4143D] transition-all group">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#A4143D]">Add a new shipping address</p>
              </Link>
            )}
          </section>

          {/* ITEM LIST */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-base text-[#A4143D] font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
              <Package size={18} className="text-[#A4143D]" /> Order Summary ({checkoutItems.length})
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {checkoutItems.map(item => (
                <div key={item.id} className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-50 group shadow-sm">
                  <Image 
                    src={item.image} 
                    alt={item.name || 'Product item'} 
                    width={150} 
                    height={150} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
              ))}
            </div>
          </section>

          {/* PAYMENT OPTIONS */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-base text-[#A4143D] font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
               <Zap size={18} className="text-[#A4143D]" /> Payment Method
            </h3>
            <div className="grid md:grid-cols-2 text-[#A4143D] gap-4">
              <PaymentOption id="card" label="Card / Flutterwave" icon={<CreditCard size={18}/>} selected={selectedPayment==='card'} onSelect={setSelectedPayment} />
              <PaymentOption id="bank" label="Bank Transfer" icon={<Building2 size={18}/>} selected={selectedPayment==='bank'} onSelect={setSelectedPayment} />
            </div>
          </section>
        </div>

        {/* RIGHT: PRICE SUMMARY */}
        <aside className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl sticky top-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A4143D]">
                <Sparkles size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Checkout Summary</span>
              </div>
            </div>

            {/* PROMO INPUT */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Apply Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex-1 text-xs font-black uppercase placeholder:text-gray-300 outline-none focus:border-[#A4143D]"
                />
                <button
                  onClick={applyCoupon}
                  disabled={applyingCoupon || !couponCode}
                  className="bg-gray-900 text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#A4143D] disabled:opacity-20 cursor-pointer"
                >
                  {applyingCoupon ? <Loader2 className="animate-spin" size={16}/> : "Apply"}
                </button>
              </div>
            </div>

            {/* PRICING TABLE */}
            <div className="space-y-4 pt-6 border-t border-gray-50">
              <PriceRow label="Items Subtotal" value={subtotal} />

              {discount > 0 && !couponData?.appliedCampaigns && (
                <PriceRow label="Promo Savings" value={-discount} color="text-[#A4143D]" />
              )}

              {couponData?.appliedCampaigns?.map((camp: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-[#A4143D]">
                  <span className="text-[10px] font-black uppercase flex items-center gap-2 tracking-widest">
                    <Zap size={10} fill="currentColor" className="animate-pulse" /> {camp.title}
                  </span>
                  <span className="text-[11px] font-black italic">- ₦{camp.amount.toLocaleString()}</span>
                </div>
              ))}

              <PriceRow label="Shipping" value="COMPLIMENTARY" />
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <span className="text-sm font-black uppercase italic tracking-tighter text-gray-400">Grand Total</span>
                <span className="text-3xl font-black italic tracking-tighter text-gray-900 leading-none">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* MULTI-VENDOR TRANSPARENCY NOTICE */}
            <CheckoutNotice />

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full h-16 bg-[#A4143D] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-[#A4143D]/30 transition-all active:scale-95 disabled:opacity-30 cursor-pointer"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20}/> : <>Complete Order <ChevronRight size={18}/></>}
            </button>

            <div className="flex flex-col items-center gap-2 pt-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Lock size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Checkout</span>
              </div>
              <p className="text-[8px] text-gray-400 text-center px-4 leading-relaxed">Your data is fully encrypted and protected by standard security protocols.</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

// UI HELPERS
function CheckoutNotice() {
  return (
    <div className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in duration-500">
      <div className="p-2 bg-gray-900 rounded-xl text-white shrink-0 shadow-sm">
        <Truck size={14} />
      </div>
      <div className="space-y-0.5">
        <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-900">
          Important Delivery Notice
        </h4>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
          Products purchased from different vendors are processed independently and shipped separately. 
          Your items may arrive in multiple packages at different times.
        </p>
      </div>
    </div>
  );
}

function PaymentOption({ id, label, icon, selected, onSelect }: any) {
  return (
    <div onClick={() => onSelect(id)} className={`flex gap-4 items-center border p-5 rounded-2xl cursor-pointer transition-all duration-300 ${selected ? 'border-[#A4143D] bg-[#FDFCFB] shadow-lg' : 'border-gray-50 hover:border-gray-200'}`}>
      <div className={`p-3 rounded-xl ${selected ? 'bg-[#A4143D] text-white' : 'bg-gray-100 text-gray-400'}`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
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