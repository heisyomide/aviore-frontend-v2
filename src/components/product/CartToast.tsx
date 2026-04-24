'use client';

import { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';
import { safeNumber, safeString } from '@/src/utils/safe';

export function CartToast() {
  const { showToast, setShowToast, lastAddedItem } = useCartStore();

  const handleClose = useCallback(() => {
    setShowToast(false);
  }, [setShowToast]);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(handleClose, 5000);
    return () => clearTimeout(timer);
  }, [showToast, handleClose]);

  const safeData = useMemo(() => {
    if (!lastAddedItem) return null;

    const price = safeNumber(lastAddedItem.price);
    const qty = safeNumber(lastAddedItem.quantity, 1);

    return {
      name: safeString(lastAddedItem.name, 'Product'),
      image: safeString(lastAddedItem.image, '/placeholder.png'),
      qty,
      size: lastAddedItem.size,
      total: price * qty,
    };
  }, [lastAddedItem]);

  if (!showToast || !safeData) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[380px]">
      <div className="bg-white rounded-3xl p-6 shadow-xl border flex gap-5">
        
        <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center rounded-full">
          <ShoppingBag size={22} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="text-xs font-bold text-emerald-600">
              Added to Cart
            </h4>
            <button onClick={handleClose}>
              <X size={16} />
            </button>
          </div>

          <div className="flex gap-3 py-2">
            <Image src={safeData.image} alt={safeData.name} width={40} height={40} />
            <div>
              <p>{safeData.name}</p>
              <p className="text-xs text-gray-400">
                Qty: {safeData.qty}
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <span className="font-bold">
              ₦{safeData.total.toLocaleString()}
            </span>
            <Link href="/cart">View Cart</Link>
          </div>
        </div>
      </div>
    </div>
  );
}