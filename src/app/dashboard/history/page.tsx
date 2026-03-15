'use client';

import { useEffect, useState, useMemo } from 'react';
import { Trash2, ShoppingCart, Clock } from 'lucide-react';
import { api } from '@/src/lib/axios';

// 1. Define the TypeScript structure to prevent "never" errors
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface HistoryItem {
  id: string;
  viewedAt: string; // This corresponds to the timestamp from your DB
  product: Product;
}

export default function HistoryPage() {
  // 2. Initialize state with the HistoryItem type
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/history');
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear your browsing history?")) return;
    
    try {
      await api.delete('/user/history');
      setHistory([]); 
    } catch (err) {
      alert("Failed to clear history");
    }
  };

  // 3. Grouping logic using the defined types
  const groupedHistory = useMemo(() => {
    const groups: { Today: HistoryItem[]; Yesterday: HistoryItem[]; Earlier: HistoryItem[] } = { 
      Today: [], 
      Yesterday: [], 
      Earlier: [] 
    };
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    history.forEach((item) => {
      const date = new Date(item.viewedAt).toDateString();
      if (date === today) groups.Today.push(item);
      else if (date === yesterday) groups.Yesterday.push(item);
      else groups.Earlier.push(item);
    });
    return groups;
  }, [history]);

  if (loading) return <div className="p-10 text-center text-gray-500 italic">Loading history...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">Browsing History</h1>
          <p className="text-sm text-gray-500 mt-1">View items you recently looked at.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-bold transition-colors"
          >
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <Clock className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Your history is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.entries(groupedHistory) as [keyof typeof groupedHistory, HistoryItem[]][]).map(
            ([group, items]) => items.length > 0 && (
              <div key={group}>
                <h3 className="font-bold text-gray-400 text-xs uppercase mb-3 tracking-wider">{group}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow group">
                      {/* Updated shrink-0 class per Tailwind suggestion */}
                      <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden shrink-0">
                         <img 
                          src={item.product.images?.[0] || '/placeholder.png'} 
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate text-gray-800">{item.product.name}</p>
                        <p className="text-sm font-bold text-orange-600">
                          ₦{item.product.price.toLocaleString()}
                        </p>
                      </div>
                      <button className="p-2 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                        <ShoppingCart size={18} />
                      </button>
                    </div>
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