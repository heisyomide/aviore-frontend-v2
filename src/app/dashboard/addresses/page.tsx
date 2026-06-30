'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Trash2, Edit2, CheckCircle, Loader2, Plus, Activity } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'react-hot-toast';
import AddressModal from '@/src/components/dashboard/AddressModal';

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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ street: '', city: '', state: '' });

  // --- DATA SYNC ENGINE ---
  const loadPageData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, addressRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/addresses')
      ]);

      const userData = profileRes.data?.user || profileRes.data;
      
      setProfile({
        fullName: userData?.name || userData?.fullName || '',
        phoneNumber: userData?.phone || userData?.phoneNumber || ''
      });
      
      setAddresses(Array.isArray(addressRes.data) ? addressRes.data : []);
    } catch (err: any) {
      console.error("Registry_Sync_Error:", err);
      toast.error("Failed to synchronize logistics registry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadPageData(); 
  }, [loadPageData]);

  // --- MODAL CONTROL ---
  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingId(address.id);
      setFormData({ street: address.street, city: address.city, state: address.state });
    } else {
      setEditingId(null);
      setFormData({ street: '', city: '', state: '' });
    }
    setIsModalOpen(true);
  };

  // --- CORE ACTIONS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.fullName || !profile.phoneNumber) {
      toast.error("Identity Binding Required. Please update profile first.");
      return;
    }

    try {
      const payload = { 
        ...formData,
        fullName: profile.fullName, 
        phoneNumber: profile.phoneNumber,
        postalCode: "" 
      };

      if (editingId) {
        await api.patch(`/user/addresses/${editingId}`, payload);
        toast.success("Drop point modified successfully");
      } else {
        await api.post('/user/addresses', payload);
        toast.success("Drop point registered successfully");
      }

      await loadPageData();
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || "Action failed"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success("Address removed successfully");
    } catch (err) {
      toast.error("Failed to remove address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/user/addresses/${id}/default`);
      await loadPageData();
      toast.success("Primary address updated");
    } catch (err) {
      toast.error("Failed to update default address.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 md:px-8 py-10 space-y-12 pb-20 animate-in fade-in duration-500">
      {/* 1. PREMIUM HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Activity size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Logistics Registry</span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
            Drop <span className="text-zinc-300 font-medium">Points</span>
          </h1>
          {profile.fullName && (
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
              Binding: <span className="text-zinc-900 font-bold">{profile.fullName}</span>
            </p>
          )}
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all active:scale-95 shadow-sm"
        >
          Add New Address <Plus size={14} />
        </button>
      </header>

      {/* 2. ADDRESS GRID */}
      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin text-[#A4143D]" size={28} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`relative p-6 rounded-2xl border transition-all duration-300 bg-white ${
                addr.isDefault 
                ? 'border-[#A4143D] shadow-sm' 
                : 'border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-xl transition-colors shrink-0 ${
                  addr.isDefault ? 'bg-[#A4143D] text-white' : 'bg-zinc-50 text-zinc-400'
                }`}>
                  <MapPin size={20} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs font-black text-zinc-900 uppercase tracking-tight truncate">{addr.fullName}</p>
                    {addr.isDefault && (
                      <span className="text-[8px] bg-emerald-500 text-white px-2.5 py-0.5 rounded font-bold uppercase tracking-widest shrink-0">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-zinc-600 leading-relaxed break-words">
                    {addr.street}, {addr.city}, {addr.state}
                  </p>
                  <p className="text-[11px] font-bold text-zinc-400 font-mono tracking-wider pt-1">
                    {addr.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-100">
                {!addr.isDefault ? (
                  <button 
                    onClick={() => handleSetDefault(addr.id)} 
                    className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-[#A4143D] transition-colors"
                  >
                    Set as Primary
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    <CheckCircle size={12} /> Sync Active
                  </span>
                )}
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleOpenModal(addr)} 
                    className="p-2 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)} 
                    className="p-2 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-zinc-50 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/50">
              <MapPin size={36} className="text-zinc-300 mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                No saved addresses found.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. MODAL OVERLAY */}
      <AddressModal
        isOpen={isModalOpen}
        editingId={editingId}
        profile={profile}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}