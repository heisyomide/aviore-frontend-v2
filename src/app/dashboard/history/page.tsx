'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trash2, ShoppingCart, Clock } from 'lucide-react';
import { api } from '@/src/lib/axios';
import Image from 'next/image';
import Link from 'next/link';

interface ProductImage {
  imageUrl: string;
}

interface Product {
  id: string;
  title: string;
  price: string | number;
  images: ProductImage[];
}

interface HistoryItem {
  id: string;
  viewedAt: string;
  product: Product;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/history');
      setHistory(res.data);
    } catch (error) {
      console.error('History fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const clearHistory = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear your browsing history?'
    );

    if (!confirmClear) return;

    try {
      await api.delete('/user/history');
      setHistory([]);
    } catch (error) {
      console.error(error);
    }
  };

  const groupedHistory = useMemo(() => {
    const groups = {
      Today: [] as HistoryItem[],
      Yesterday: [] as HistoryItem[],
      Earlier: [] as HistoryItem[],
    };

    const today = new Date().toDateString();
    const yesterday = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toDateString();

    history.forEach((item) => {
      const viewedDate = new Date(item.viewedAt).toDateString();

      if (viewedDate === today) {
        groups.Today.push(item);
      } else if (viewedDate === yesterday) {
        groups.Yesterday.push(item);
      } else {
        groups.Earlier.push(item);
      }
    });

    return groups;
  }, [history]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading history...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">
            Browsing History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View products you recently checked
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 text-red-500 font-bold"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <Clock
            className="mx-auto text-gray-300 mb-4"
            size={48}
          />
          <p className="text-gray-500">
            Your history is empty
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedHistory).map(
            ([group, items]) =>
              items.length > 0 && (
                <div key={group}>
                  <h3 className="font-bold text-xs uppercase text-gray-400 mb-3">
                    {group}
                  </h3>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.product.id}`}
                        className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4"
                      >
                        <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={
                              item.product.images?.[0]
                                ?.imageUrl ||
                              '/placeholder.png'
                            }
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">
                            {item.product.title}
                          </p>

                          <p className="text-sm font-bold text-[#A4143D] mt-1">
                            ₦
                            {Number(
                              item.product.price
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="p-2 rounded-full bg-orange-50 text-orange-500">
                          <ShoppingCart size={18} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}