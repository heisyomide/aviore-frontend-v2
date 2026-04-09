'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/src/store/useCartStore';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  
  const status = searchParams.get('status');
  const txRef = searchParams.get('tx_ref');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    // 🛡️ If the payment was successful, clear the local cart registry
    if (status === 'successful' || status === 'completed') {
      clearCart();
    }
  }, [status, clearCart]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-50 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
        </div>

        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">
          Payment Confirmed
        </h1>
        
        <p className="text-gray-500 text-sm font-medium leading-relaxed">
          Your transaction was successful. Our vendors have been notified and your artifacts are being prepared for fulfillment.
        </p>

        <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Reference</span>
            <span className="text-gray-900">{txRef?.split('-')[1]}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Network ID</span>
            <span className="text-gray-900">{transactionId}</span>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Link 
            href="/dashboard/orders" 
            className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#A4143D] transition-all"
          >
            Track My Orders <Package size={16} />
          </Link>
          
          <Link 
            href="/" 
            className="w-full h-14 bg-white border border-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:text-gray-900 transition-all"
          >
            Back to Home <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}