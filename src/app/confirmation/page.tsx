// src/app/orders/confirmation/page.tsx

import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, ShieldCheck } from 'lucide-react';

interface ConfirmationPageProps {
  searchParams: Promise<{
    status?: string;
    tx_ref?: string;
    transaction_id?: string;
  }>;
}

export default async function OrderConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const params = await searchParams;

  const status = params.status;
  const txRef = params.tx_ref;
  const transactionId = params.transaction_id;

  const isSuccessful =
    status === 'successful' || status === 'completed';

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-10 md:p-12">
        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-8">
          <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
            <CheckCircle2
              size={54}
              className="text-green-500"
            />
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-gray-900 uppercase">
            {isSuccessful
              ? 'Payment Successful'
              : 'Payment Processing'}
          </h1>

          <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-md mx-auto">
            {isSuccessful
              ? 'Your payment has been confirmed successfully. Your order has now entered our fulfillment pipeline and our vendors have been notified.'
              : 'Your transaction is currently being processed. Please allow a few moments for confirmation.'}
          </p>
        </div>

        {/* TRANSACTION CARD */}
        <div className="mt-8 rounded-3xl bg-gray-50 border border-gray-100 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
              Payment Status
            </span>
            <span className="text-[11px] font-black uppercase text-green-600">
              {status || 'UNKNOWN'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
              Reference
            </span>
            <span className="text-[11px] font-black text-gray-900 break-all">
              {txRef || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
              Transaction ID
            </span>
            <span className="text-[11px] font-black text-gray-900">
              {transactionId || 'N/A'}
            </span>
          </div>
        </div>

        {/* SECURITY NOTICE */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.25em]">
            Secure Transaction Verified
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 grid gap-3">
          <Link
            href="/dashboard/orders"
            className="h-14 rounded-2xl bg-[#A4143D] text-white flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-[#A4143D]/20 transition-all"
          >
            Track My Orders
            <Package size={16} />
          </Link>

          <Link
            href="/"
            className="h-14 rounded-2xl border border-gray-100 bg-white text-gray-500 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest hover:text-gray-900 transition-all"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}