'use client';

import { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';

/* SAFE */
const safeNumber = (val: any, fallback = 0) => {
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

const safeString = (val: any, fallback = '') => {
  return val ? String(val) : fallback;
};

export function CartToast() {
  const { showToast, setShowToast, lastAddedItem } = useCartStore();

  const close = useCallback(() => setShowToast(false), [setShowToast]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(close, 5000);
    return () => clearTimeout(t);
  }, [showToast]);

  const data = useMemo(() => {
    if (!lastAddedItem) return null;

    const price = safeNumber(lastAddedItem.price);
    const qty = safeNumber(lastAddedItem.quantity, 1);

    const total = price * qty;

    console.log('🧠 Cart DEBUG:', { lastAddedItem, price, qty, total });

    return {
      name: safeString(lastAddedItem.name, 'Product'),
      image: safeString(lastAddedItem.image, '/placeholder.png'),
      qty,
      total
    };
  }, [lastAddedItem]);

  if (!showToast || !data) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white p-4 shadow">

      <button onClick={close}>
        <X />
      </button>

      <Image src={data.image} alt={data.name} width={40} height={40} />

      <p>{data.name}</p>
      <p>Qty: {data.qty}</p>

      <strong>₦{data.total.toLocaleString()}</strong>

      <Link href="/cart">Cart</Link>
    </div>
  );
}