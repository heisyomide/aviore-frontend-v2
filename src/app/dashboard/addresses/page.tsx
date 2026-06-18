'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Trash2, Edit2, CheckCircle, Loader2, Home, Activity } from 'lucide-react';
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

      // Normalize user data (handles nested .user or flat response)
      const userData = profileRes.data?.user || profileRes.data;
      
      setProfile({
        fullName: userData.name || userData.fullName || '',
        phoneNumber: userData.phone || userData.phoneNumber || ''
      });
      
      setAddresses(Array.isArray(addressRes.data) ? addressRes.data : []);
    } catch (err: any) {
      console.error("Registry_Sync_Error:", err);
      toast.error("Failed to synchronize logistics registry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPageData(); }, [loadPageData]);

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
        postalCode: "" // Keeping backend requirement firm
      };

      if (editingId) {
        await api.patch(`/user/addresses/${editingId}`, payload);
        toast.success("Drop_Point_Modified");
      } else {
        await api.post('/user/addresses', payload);
        toast.success("Drop_Point_Registered");
      }

      await loadPageData();
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg || "Action failed"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Terminate this address ?")) return;
    try {
      await api.delete(`/user/addresses/${id}`);
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success("Node_Terminated");
    } catch (err) {
      toast.error("Termination failed.");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/user/addresses/${id}/default`);
      await loadPageData();
      toast.success("Primary_Address_Updated");
    } catch (err) {
      toast.error("Sync failed.");
    }
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      {/* 1. HEADER HUD */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Activity size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Logistics_Registry</span>
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
            Drop <span className="text-zinc-200 font-medium">Points</span>
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
            Binding: <span className="text-zinc-900">{profile.fullName || 'SYNC_PENDING'}</span>
          </p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="group relative overflow-hidden bg-black px-8 py-4 rounded-xl transition-all active:scale-95 shadow-xl shadow-zinc-200"
        >
          <span className="relative z-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">
            Register New Address <Home size={14} />
          </span>
          <div className="absolute inset-0 bg-[#A4143D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </header>

      {/* 2. ADDRESS GRID */}
      {loading ? (
        <div className="flex justify-center py-32"><Loader2 className="animate-spin text-[#A4143D]" size={32} /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`group relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${
                addr.isDefault 
                ? 'border-[#A4143D]/20 bg-zinc-50/50 shadow-xl shadow-zinc-200/40' 
                : 'border-zinc-50 bg-white hover:border-zinc-200'
              }`}
            >
              <div className="flex gap-6">
                <div className={`p-5 rounded-3xl transition-colors duration-500 ${
                  addr.isDefault ? 'bg-[#A4143D] text-white' : 'bg-zinc-50 text-zinc-300 group-hover:text-zinc-900'
                }`}>
                  <MapPin size={24} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-black text-zinc-900 uppercase italic tracking-tight">{addr.fullName}</p>
                    {addr.isDefault && (
                      <span className="text-[8px] bg-emerald-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">Primary</span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase leading-relaxed">{addr.street}, {addr.city}, {addr.state}</p>
                  <p className="text-[10px] font-black text-zinc-400 font-mono tracking-widest pt-2">{addr.phoneNumber}</p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-50">
                {!addr.isDefault ? (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#A4143D] transition-colors">Set as Primary Address</button>
                ) : (
                  <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600"><CheckCircle size={12} /> Sync_Active</span>
                )}
                
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(addr)} className="p-3 bg-zinc-50 text-zinc-400 hover:text-zinc-900 rounded-xl transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(addr.id)} className="p-3 bg-zinc-50 text-zinc-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[4rem] text-center bg-zinc-50/20">
              <MapPin size={48} className="text-zinc-100 mb-6" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-300">No saved addresses found.</p>
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