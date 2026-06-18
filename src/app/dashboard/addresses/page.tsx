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
    if (!confirm("Terminate this address destination node?")) return;
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
    <div className="space-y-10 pb-16 animate-in fade-in duration-500 w-full">
      {/* 1. LUXURY HEADER HUD PORTAL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#991B1B]">
            <Activity size={13} className="animate-pulse" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">Logistics_Registry</span>
          </div>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white leading-none">
            Drop <span className="text-zinc-600 font-normal font-sans tracking-normal">Points</span>
          </h1>
          <p className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
            Identity Binding: <span className="text-zinc-300 font-sans tracking-normal capitalize">{profile.fullName || 'SYNC_PENDING'}</span>
          </p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="group relative overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-zinc-700 px-6 py-3.5 rounded-lg transition-all active:scale-[0.98] shadow-2xl"
        >
          <span className="relative z-10 flex items-center gap-3 text-[9px] font-mono font-bold uppercase tracking-widest text-white">
            Register New Destination <Home size={12} className="text-zinc-400 group-hover:text-white transition-colors" />
          </span>
          <div className="absolute inset-0 bg-[#991B1B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </header>

      {/* 2. PREMIUM GRID ADDRESS MODULES */}
      {loading ? (
        <div className="flex flex-col h-[40vh] items-center justify-center gap-4">
          <Loader2 className="animate-spin text-[#991B1B]" size={24} />
          <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-zinc-600 uppercase">Fetching Secure Records...</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`group relative p-6 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                addr.isDefault 
                  ? 'border-[#991B1B]/40 bg-[#111113] shadow-xl shadow-black/40' 
                  : 'border-zinc-900 bg-[#111113]/40 hover:border-zinc-800'
              }`}
            >
              <div className="flex gap-5 items-start">
                <div className={`p-3.5 rounded-lg border transition-colors duration-300 ${
                  addr.isDefault 
                    ? 'bg-zinc-950 text-white border-[#991B1B]/30' 
                    : 'bg-zinc-950 text-zinc-600 border-zinc-900 group-hover:text-zinc-300 group-hover:border-zinc-800'
                }`}>
                  <MapPin size={18} />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide truncate">{addr.fullName}</p>
                    {addr.isDefault && (
                      <span className="shrink-0 text-[7px] font-mono font-bold bg-[#991B1B]/20 border border-[#991B1B]/40 text-red-400 px-2 py-0.5 rounded uppercase tracking-widest">Primary</span>
                    )}
                  </div>
                  <p className="text-[11px] font-sans text-zinc-500 font-medium leading-relaxed uppercase">{addr.street}, {addr.city}, {addr.state}</p>
                  <p className="text-[9px] font-mono font-bold text-zinc-400 tracking-wider pt-1">{addr.phoneNumber}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-900/60">
                {!addr.isDefault ? (
                  <button 
                    onClick={() => handleSetDefault(addr.id)} 
                    className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors bg-zinc-950 px-2.5 py-1.5 border border-zinc-900 rounded"
                  >
                    Set Primary
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 text-[8px] font-mono font-bold uppercase tracking-widest text-emerald-500 bg-emerald-950/20 border border-emerald-900/40 px-2.5 py-1 rounded">
                    <CheckCircle size={10} /> Sync_Active
                  </span>
                )}
                
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleOpenModal(addr)} 
                    className="p-2 bg-zinc-950 text-zinc-600 hover:text-white border border-zinc-900 hover:border-zinc-800 rounded transition-colors"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)} 
                    className="p-2 bg-zinc-950 text-zinc-600 hover:text-red-400 border border-zinc-900 hover:border-zinc-800 rounded transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-xl text-center bg-[#111113]/20">
              <div className="p-4 bg-zinc-950 border border-zinc-900 text-zinc-700 rounded-xl mb-4">
                <MapPin size={24} />
              </div>
              <p className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-600">No Historical Drop Points Found.</p>
            </div>
          )}
        </div>
      )}

      {/* 3. MODAL TERMINAL OVERLAY */}
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