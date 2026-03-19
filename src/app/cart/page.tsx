'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { 
  ShieldCheck, Trash2, ChevronRight, Plus, 
  Minus, ShoppingBag, ArrowRight, Zap, Truck 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Atomic Components
import { Container } from '../../components/layout/Container';
import { Breadcrumb } from '@/src/components/Breadcrumb';
import { FeaturedBrandsSection } from '@/src/components/FeaturedBrand';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  },
};

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    toggleSelect,
    toggleSelectAll,
    removeItem,
    updateQuantity
  } = useCartStore();

  const availableItems = useMemo(() => items.filter((i) => !i.isOutOfStock), [items]);
  const selectedItems = useMemo(() => items.filter((i) => i.selected && !i.isOutOfStock), [items]);
  const allSelected = availableItems.length > 0 && availableItems.every((i) => i.selected);
  const isProceedDisabled = selectedItems.length === 0;

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.replace('/login?redirect=/cart');
  }, [router]);

  if (items.length === 0) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-white">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8 mx-auto border border-gray-100">
            <ShoppingBag size={48} className="text-gray-200" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
            Your Cart is <span className="text-gray-300">Empty</span>
          </h2>
          <p className="text-[11px] font-bold text-gray-400 mb-10 max-w-xs uppercase tracking-widest leading-relaxed">
            Discover our latest collections and start adding items to your cart.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-12 py-4 bg-[#A4143D] text-white font-black rounded-full uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#A4143D]/20 hover:bg-black transition-all active:scale-95"
          >
            Start Shopping <ArrowRight size={14} />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Container className="pt-12">
        <Breadcrumb />
        
        <header className="mt-8 mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 uppercase italic tracking-tighter leading-[0.8]">
            Shopping <span className="text-[#A4143D]">Cart</span>
          </h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-32">
          <section className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[#A4143D]">
                    <Truck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Delivery Status</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-400">
                    {subtotal < 25000 ? `Add ₦${(25000 - subtotal).toLocaleString()} for Free Shipping` : 'Free Delivery Unlocked'}
                  </span>
               </div>
               <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#A4143D] transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.min((subtotal / 25000) * 100, 100)}%` }} 
                  />
               </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-4xl shadow-sm overflow-hidden">
              <div className="px-8 py-5 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-5 h-5 accent-[#A4143D] rounded-md cursor-pointer"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-[#A4143D] transition-colors">
                    Select All Items ({availableItems.length})
                  </span>
                </label>
              </div>

              <div className="divide-y divide-gray-50">
                <AnimatePresence mode='popLayout'>
                  {items.map((item) => (
                    <CartItemRow 
                      key={item.id} 
                      item={item} 
                      onToggle={() => toggleSelect(item.id)}
                      onRemove={() => removeItem(item.id)}
                      onUpdate={(q: number) => updateQuantity(item.id, q)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <OrderSummary 
                subtotal={subtotal} 
                itemCount={selectedItems.length} 
                isDisabled={isProceedDisabled} 
                onCheckout={() => router.push('/checkout')}
              />
              
              <div className="px-6 flex flex-col items-center text-center space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <ShieldCheck size={16} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-900">Secure Checkout Guaranteed</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 opacity-40 grayscale hover:grayscale-0 transition-all">
                   {['Visa', 'Mastercard', 'Verve', 'Paystack'].map(card => (
                     <span key={card} className="text-[8px] font-black border border-gray-300 px-2 py-1 rounded-md uppercase">{card}</span>
                   ))}
                </div>
              </div>
            </div>
          </aside>
        </main>
      </Container>

      <FeaturedBrandsSection />
    </div>
  );
}

function CartItemRow({ item, onToggle, onRemove, onUpdate }: any) {
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col sm:flex-row items-center gap-6 px-8 py-8 hover:bg-gray-50/30 transition-colors group"
    >
      <div className="flex items-center gap-6 flex-1 w-full">
        <input
          type="checkbox"
          checked={!!item.selected}
          onChange={onToggle}
          className="w-5 h-5 accent-[#A4143D] rounded-md cursor-pointer"
        />
        <div className="relative w-24 h-24 shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <Image 
            src={item.image || '/placeholder.jpg'} 
            alt={item.name || 'Product Image'} 
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <h3 className="text-[13px] font-black text-gray-900 uppercase italic leading-tight truncate">
            {item.name}
          </h3>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            ID: {item.id.slice(-8).toUpperCase()}
          </p>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50 px-1">
              <button 
                onClick={() => onUpdate(Math.max(1, item.quantity - 1))} 
                className="p-2 hover:text-[#A4143D] transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-[11px] font-black w-8 text-center">{item.quantity}</span>
              <button 
                onClick={() => onUpdate(item.quantity + 1)} 
                className="p-2 hover:text-[#A4143D] transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
            <button 
              onClick={onRemove} 
              className="text-gray-300 hover:text-[#A4143D] p-2 transition-colors active:scale-90"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xl font-black text-gray-900 italic tracking-tighter">
          ₦{(item.price * item.quantity).toLocaleString()}
        </p>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          ₦{item.price.toLocaleString()} / Unit
        </p>
      </div>
    </motion.div>
  );
}

function OrderSummary({ subtotal, itemCount, isDisabled, onCheckout }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-4xl shadow-xl shadow-black/5 p-8">
      <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-8 pb-4 border-b border-gray-50">
        Order Summary
      </h2>

      <div className="space-y-4 pb-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
        <div className="flex justify-between items-center">
          <span>Items selected</span>
          <span className="text-gray-900">{itemCount} Product(s)</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="text-gray-900 font-bold">₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-[#A4143D]/5 rounded-2xl border border-[#A4143D]/10">
          <p className="text-[8px] leading-relaxed text-[#A4143D] lowercase italic flex gap-2">
            <Zap size={10} fill="currentColor" className="shrink-0" />
            Special offers and discounts will be applied during the checkout process.
          </p>
        </div>
        <div className="flex justify-between pt-6 border-t border-gray-50 items-end">
          <span className="text-gray-400">Total Amount</span>
          <span className="text-3xl font-black text-[#A4143D] italic tracking-tighter leading-none">
            ₦{subtotal.toLocaleString()}
          </span>
        </div>
      </div>

      <button 
        onClick={onCheckout}
        disabled={isDisabled}
        className="w-full h-16 bg-[#A4143D] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#A4143D]/20 hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-20 disabled:grayscale"
      >
        Proceed to Checkout <ArrowRight size={16} />
      </button>
    </div>
  );
}