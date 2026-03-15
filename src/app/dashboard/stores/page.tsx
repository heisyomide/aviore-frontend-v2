'use client';
import { useState, useEffect } from 'react';
import { Store, Star, Loader2 } from 'lucide-react';
import { api } from '@/src/lib/axios'; // Adjust based on your axios instance path

export default function FollowedVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowedVendors = async () => {
    try {
      const res = await api.get('/user/following');
      setVendors(res.data);
    } catch (err) {
      console.error("Failed to fetch followed vendors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (vendorId: string) => {
    try {
      await api.delete(`/vendors/${vendorId}/unfollow`);
      // Refresh the list after unfollowing
      setVendors(prev => prev.filter(v => v.id !== vendorId));
    } catch (err) {
      alert("Could not unfollow vendor. Please try again.");
    }
  };

  useEffect(() => { fetchFollowedVendors(); }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Followed Vendors</h1>
        <p className="text-sm text-gray-500 mt-1">Keep track of your favorite brands and new arrivals.</p>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-xl">
           <p className="text-gray-500">You haven't followed any vendors yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-center hover:border-orange-300 transition">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-gray-400">
                  <Store size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{vendor.storeName}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{vendor.followersCount?.toLocaleString() || 0} followers</span>
                    <span className="flex items-center gap-1 text-orange-600">
                      <Star size={12} fill="currentColor" /> {vendor.rating || 'New'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="text-[10px] font-bold bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">View Vendor</button>
                <button 
                  onClick={() => handleUnfollow(vendor.id)}
                  className="text-[10px] text-red-500 hover:underline"
                >
                  Unfollow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}