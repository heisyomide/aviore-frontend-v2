'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { ShieldCheck, Trash2, ChevronRight, Plus, Minus, ShoppingBag, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FeaturedBrandsSection } from '@/src/components/FeaturedBrand';
import { Footer } from '@/src/components/Footer';
import { Breadcrumb } from '@/src/components/Breadcrumb';
import { Navbar } from '@/src/components/Header';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    subtotal,
    totalItems,
    toggleSelect,
    toggleSelectAll,
    removeItem,
    updateQuantity
  } = useCartStore();

  // 1. DATA_ISOLATION_PROTOCOL
  const availableItems = useMemo(() => items.filter((i) => !i.isOutOfStock), [items]);
  const selectedItems = useMemo(() => items.filter((i) => i.selected && !i.isOutOfStock), [items]);
  const allSelected = availableItems.length > 0 && availableItems.every((i) => i.selected);
  
  // 2. LOGIC: Disable checkout if nothing is checked
  const isProceedDisabled = selectedItems.length === 0;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/cart');
    }
  }, [router]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="p-8 bg-gray-50 rounded-full mb-6">
            <ShoppingBag size={64} className="text-gray-200" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
            Registry is Empty
          </h2>
          <p className="text-sm font-medium text-gray-400 mb-10 max-w-xs italic">
            Your collection is currently empty. Begin curating your artifacts today.
          </p>
          <Link
            href="/shop"
            className="px-10 py-4 bg-[#A4143D] text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-[#A4143D]/20 transition-all flex items-center gap-3"
          >
            Explore Collection <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-4">
        <Breadcrumb />
        <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter mt-6 mb-12">
          Your Cart
        </h1>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ITEM SELECTION */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="px-8 py-5 bg-gray-50 flex items-center justify-between border-b border-gray-100">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-5 h-5 accent-[#A4143D] rounded-lg border-gray-200 cursor-pointer"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                  Select All ({availableItems.length})
                </span>
              </label>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Unit Valuation
              </span>
            </div>

            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-50"
            >
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row sm:items-center gap-6 px-8 py-8 hover:bg-gray-50/30 transition-colors group"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <input
                      type="checkbox"
                      checked={!!item.selected}
                      onChange={() => toggleSelect(item.id)}
                      className="w-5 h-5 accent-[#A4143D] rounded-lg border-gray-200 cursor-pointer"
                    />
                    <div className="relative w-24 h-24 shrink-0 bg-gray-50 rounded-[1.5rem] overflow-hidden border border-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-sm font-black text-gray-900 uppercase italic leading-tight line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50 px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-[#A4143D] transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-black w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-[#A4143D] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#A4143D] hover:bg-red-50 p-2 rounded-xl transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="text-lg font-black text-gray-900 italic tracking-tighter">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      ₦{item.price.toLocaleString()} / Unit
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ORDER SUMMARY */}
        <aside className="lg:col-span-4">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8 sticky top-28">
            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-8 pb-4 border-b border-gray-50">
              Order Summary
            </h2>

            <div className="space-y-4 pb-8 text-[11px] font-bold uppercase tracking-widest text-gray-500">
              <div className="flex justify-between">
                <span>Items Manifest</span>
                <span className="text-gray-900 font-black">{selectedItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Gross Valuation</span>
                <span className="text-gray-900">₦{subtotal.toLocaleString()}</span>
              </div>
              
              {/* SYNC NOTICE: Informs the user that Campaign logic triggers at Checkout */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-2">
                <p className="text-[8px] leading-relaxed text-gray-400 lowercase italic">
                   <Zap size={8} className="inline mr-1 text-[#A4143D]" />
                   campaign rewards and registry incentives will be automatically synchronized at the next stage.
                </p>
              </div>

              <div className="flex justify-between">
                <span>Logistics</span>
                <span className="text-gray-900 italic font-black lowercase">Complimentary</span>
              </div>
              
              <div className="flex justify-between pt-6 text-gray-900 border-t border-gray-50 items-end">
                <span className="text-xs text-gray-400">Estimated Total</span>
                <span className="text-3xl font-black text-[#A4143D] italic tracking-tighter leading-none">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/checkout')}
              disabled={isProceedDisabled}
              className="w-full h-16 bg-[#A4143D] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-[#A4143D]/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-20 disabled:grayscale"
            >
              Proceed to Checkout <ChevronRight size={18} />
            </button>

            {/* TRUST INDICATORS */}
            <div className="mt-10 pt-10 border-t border-gray-50 space-y-6">
              <div className="flex items-center gap-3 text-green-600">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                  Protected Registry Sequence
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Verve', 'Visa', 'Mastercard', 'Flutterwave'].map((m) => (
                  <div key={m} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    {m}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
              <p>Aviore Protection: our network ensures authenticity for every artifact.</p>
              <Link href="/protection" className="text-[#A4143D] font-black hover:underline inline-block mt-2">
                View Protection Protocol
              </Link>
            </div>
          </div>
        </aside>
      </main>

      <FeaturedBrandsSection />
      <Footer />
    </div>
  );
}