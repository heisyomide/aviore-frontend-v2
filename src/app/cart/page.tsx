'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  ShieldCheck,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Zap,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { useCartStore } from '../../store/useCartStore';
import { Container } from '../../components/layout/Container';
import { Breadcrumb } from '@/src/components/Breadcrumb';
import { FeaturedBrandsSection } from '@/src/components/FeaturedBrand';
import { Navbar } from '@/src/components/navbar/Navbar';

// Fixes: "Cannot find name 'itemVariants'"
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const hydrated = useCartStore((s) => s._hasHydrated);
  const syncWithBackend = useCartStore((s) => s.syncWithBackend);

  const {
    items,
    subtotal,
    toggleSelect,
    toggleSelectAll,
    removeItem,
    updateQuantity,
  } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login?redirect=/cart');
    } else {
      syncWithBackend();
    }
  }, [router, syncWithBackend]);

  const availableItems = useMemo(() => items.filter((i) => !i.isOutOfStock), [items]);
  const selectedItems = useMemo(() => items.filter((i) => i.selected && !i.isOutOfStock), [items]);
  const allSelected = useMemo(() => 
    availableItems.length > 0 && availableItems.every((i) => i.selected), 
  [availableItems]);

  const isProceedDisabled = selectedItems.length === 0;

  if (!isMounted || !hydrated) {
    return <div className="min-h-screen bg-white" />;
  }

  if (items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Container className="pt-8 md:pt-12">
        <Breadcrumb />
        <header className="mt-6 mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-gray-900">
            Shopping <span className="text-[#A4143D]">Cart</span>
          </h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          <section className="lg:col-span-8 space-y-5">
            <DeliveryProgress subtotal={subtotal} />
            <CartItemsSection
              items={items}
              availableItems={availableItems}
              allSelected={allSelected}
              toggleSelect={toggleSelect}
              toggleSelectAll={toggleSelectAll}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
            />
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-5">
              <OrderSummary
                subtotal={subtotal}
                itemCount={selectedItems.length}
                isDisabled={isProceedDisabled}
                onCheckout={() => router.push('/checkout')}
              />
              <PaymentTrustSection />
            </div>
          </aside>
        </main>
      </Container>
      <FeaturedBrandsSection />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function CartItemsSection({ items, availableItems, allSelected, toggleSelect, toggleSelectAll, removeItem, updateQuantity }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200 bg-zinc-50/30">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => toggleSelectAll(e.target.checked)}
            className="w-4 h-4 accent-[#A4143D]"
          />
          <span className="text-sm font-bold text-gray-900">
            Select All ({availableItems.length})
          </span>
        </label>
      </div>
      <div className="divide-y divide-gray-100">
        <AnimatePresence mode="popLayout">
          {items.map((item: any) => (
            <CartItemRow
              key={item.id}
              item={item}
              onToggle={() => toggleSelect(item.id)}
              onRemove={() => removeItem(item.id)}
              onUpdate={(qty: number) => updateQuantity(item.id, qty)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CartItemRow({ item, onToggle, onRemove, onUpdate }: any) {
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 1;

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 20 }}
      className="p-5 hover:bg-gray-50 transition"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex items-start gap-4 flex-1">
          <input
            type="checkbox"
            checked={item.selected}
            onChange={onToggle}
            className="mt-2 w-4 h-4 accent-[#A4143D]"
          />
          <div className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-white shrink-0">
            <Image
              src={item.image || '/placeholder.jpg'}
              alt={item.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 mb-2 truncate">{item.name}</h3>
            <p className="text-xs text-gray-400 mb-4 uppercase font-mono">
              ID: {item.id.slice(-8)}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                <button onClick={() => onUpdate(quantity - 1)} className="p-2 hover:bg-zinc-100"><Minus size={14} /></button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => onUpdate(quantity + 1)} className="p-2 hover:bg-zinc-100"><Plus size={14} /></button>
              </div>
              <button onClick={onRemove} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        </div>
        <div className="text-right sm:min-w-30">
          <p className="text-lg font-black text-[#A4143D]">₦{(price * quantity).toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">₦{price.toLocaleString()} / unit</p>
        </div>
      </div>
    </motion.div>
  );
}

// --- HELPER COMPONENTS ---

function EmptyCartState() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-28 h-28 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={42} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3 uppercase italic">Empty Cart</h2>
        <p className="text-sm text-gray-500 mb-8">Start shopping and add AVIORÈ luxury pieces to your cart.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#A4143D] text-white font-bold hover:bg-black transition">
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}

function DeliveryProgress({ subtotal }: { subtotal: number }) {
  const target = 25000;
  const progress = Math.min((subtotal / target) * 100, 100);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Truck size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Delivery Status</span>
        </div>
        <span className="text-xs text-gray-500 font-semibold italic">
          {subtotal < target ? `Add ₦${(target - subtotal).toLocaleString()} for free shipping` : 'Free delivery unlocked'}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#A4143D] transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, itemCount, isDisabled, onCheckout }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-black text-gray-900 mb-6 uppercase italic">Order Summary</h2>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between font-medium text-gray-500"><span>Items</span><span>{itemCount}</span></div>
        <div className="flex justify-between font-medium text-gray-500"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex gap-2 items-center text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
          <Zap size={14} className="text-[#A4143D]" /> Discounts apply at checkout
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <span className="font-bold uppercase">Total</span>
          <span className="text-2xl font-black text-[#A4143D]">₦{subtotal.toLocaleString()}</span>
        </div>
      </div>
      <button onClick={onCheckout} disabled={isDisabled} className="w-full mt-6 h-14 rounded-xl bg-[#A4143D] text-white font-black uppercase tracking-widest hover:bg-black transition disabled:opacity-30">
        Checkout
      </button>
    </div>
  );
}

function PaymentTrustSection() {
  return (
    <div className="text-center space-y-3">
      <div className="flex justify-center items-center gap-2 text-green-600">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
      </div>
      <div className="flex justify-center gap-2 flex-wrap opacity-50">
        {['Visa', 'Mastercard', 'Verve', 'Paystack'].map((card) => (
          <span key={card} className="px-2 py-1 border border-gray-200 rounded text-[10px] font-bold uppercase">{card}</span>
        ))}
      </div>
    </div>
  );
}