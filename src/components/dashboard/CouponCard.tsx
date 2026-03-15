// components/dashboard/CouponCard.tsx
import { Ticket, Clock } from 'lucide-react';

interface CouponProps {
  code: string;
  title: string;
  minOrder: string;
  expiry: string;
  isExpired?: boolean;
}

export default function CouponCard({ code, title, minOrder, expiry, isExpired }: CouponProps) {
  return (
    <div className={`relative bg-white border border-gray-200 rounded-2xl p-6 ${isExpired ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
          <Ticket size={24} />
        </div>
        <span className={`px-3 py-1 rounded text-xs font-bold ${isExpired ? 'bg-gray-200 text-gray-500' : 'bg-orange-600 text-white'}`}>
          {code}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">Min. Order {minOrder}</p>

      <div className="my-4 border-t border-dashed border-gray-200" />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={14} />
          <span>Valid until {expiry}</span>
        </div>
        {!isExpired && (
          <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium hover:bg-orange-600 hover:text-white transition-colors">
            Use Now
          </button>
        )}
      </div>
    </div>
  );
}