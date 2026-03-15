'use client';
import { useState, useEffect } from 'react';
import { MapPin, Trash2, Edit2, CheckCircle, X, Loader2, Home } from 'lucide-react';
import { api } from '@/src/lib/axios';

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [profile, setProfile] = useState({ fullName: '', phoneNumber: '' });
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ street: '', city: '', state: '' });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      console.log("Fetching profile and addresses...");
      
      const [profileRes, addressRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/addresses')
      ]);

      // --- DATA NORMALIZATION ---
      // This handles cases where data is nested inside profileRes.data.user
      const rawData = profileRes.data?.user || profileRes.data;
      console.log("Raw Profile Data Received:", rawData);

      setProfile({
        // This checks for fullName OR name, and phoneNumber OR phone
        fullName: rawData.fullName || rawData.name || '',
        phoneNumber: rawData.phoneNumber || rawData.phone || ''
      });
      
      setAddresses(Array.isArray(addressRes.data) ? addressRes.data : []);
    } catch (err: any) {
      console.error("Fetch error details:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingId(address.id);
      setFormData({ 
        street: address.street, 
        city: address.city, 
        state: address.state 
      });
    } else {
      setEditingId(null);
      setFormData({ street: '', city: '', state: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log current state to debug the "Loading" alert
    console.log("Attempting to submit with profile:", profile);

    if (!profile.fullName || !profile.phoneNumber) {
      alert(`Profile details missing. Name: ${profile.fullName}, Phone: ${profile.phoneNumber}. Please check your profile settings.`);
      return;
    }

    try {
      const payload = { 
        street: formData.street,
        city: formData.city,
        state: formData.state,
        fullName: profile.fullName, 
        phoneNumber: profile.phoneNumber,
      };

      if (editingId) {
        await api.patch(`/user/addresses/${editingId}`, payload);
      } else {
        await api.post('/user/addresses', payload);
      }

      await loadPageData();
      setIsModalOpen(false);
    } catch (err: any) {
      const errorDetails = err.response?.data?.message;
      console.error("Backend Error:", errorDetails);
      alert(Array.isArray(errorDetails) ? errorDetails.join("\n") : errorDetails || "Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this address?")) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/user/addresses/${id}/default`);
      await loadPageData();
    } catch (err) {
      console.error("Failed to update default");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Addresses</h1>
          <p className="text-sm text-gray-500">
            {profile.fullName ? (
              <>Manage locations for <strong>{profile.fullName}</strong></>
            ) : (
              <span className="text-orange-500 italic">Loading profile identity...</span>
            )}
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-700 transition shadow-lg active:scale-95 flex items-center gap-2"
        >
          <Home size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-600" size={32} /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                addr.isDefault ? 'border-orange-500 bg-orange-50/50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex gap-4">
                <div className={`p-3 rounded-lg ${addr.isDefault ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-900">{addr.fullName}</p>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{addr.street}, {addr.city}, {addr.state}</p>
                  <p className="text-sm text-gray-500 mt-2 font-medium">{addr.phoneNumber}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
                {!addr.isDefault ? (
                  <button 
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600"><CheckCircle size={14} /> Selected for Delivery</span>
                )}
                
                <div className="flex gap-3">
                  <button onClick={() => handleOpenModal(addr)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="col-span-full py-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No saved addresses found.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
            <h2 className="text-xl font-bold mb-2">{editingId ? 'Edit Address' : 'New Address'}</h2>
            <p className="text-xs text-gray-500 mb-6">Linked to: <strong>{profile.fullName || '...'}</strong></p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                placeholder="Street Address"
                required value={formData.street}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setFormData({...formData, street: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="City"
                  required value={formData.city}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                <input 
                  placeholder="State"
                  required value={formData.state}
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition">
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
            </form>
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-gray-400 hover:text-black"><X size={24} /></button>
          </div>
        </div>
      )}
    </div>
  );
}