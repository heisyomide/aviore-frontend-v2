'use client';

import { useState, useEffect } from 'react';
import { MapPin, Trash2, Edit2, CheckCircle, X, Loader2, Home, Fingerprint, Activity } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'react-hot-toast';

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

  useEffect(() => { loadPageData(); }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      console.log("Fetching profile and addresses...");
      
      const [profileRes, addressRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/addresses')
      ]);

      // --- DATA NORMALIZATION (PRESERVED) ---
      const rawData = profileRes.data?.user || profileRes.data;
      console.log("Raw Profile Data Received:", rawData);

      setProfile({
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

      // --- API STRUCTURE (PRESERVED) ---
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
      toast.success("Node_Terminated");
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/user/addresses/${id}/default`);
      await loadPageData();
      toast.success("Primary_Node_Updated");
    } catch (err) {
      console.error("Failed to update default");
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Activity size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Logistics_Registry</span>
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
            Drop <span className="text-zinc-200">Points</span>
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            {profile.fullName ? (
              <>Identity: <span className="text-zinc-900">{profile.fullName}</span></>
            ) : (
              <span className="text-[#A4143D] animate-pulse italic">Syncing Profile Registry...</span>
            )}
          </p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="group relative overflow-hidden bg-black px-8 py-4 rounded-xl transition-all active:scale-95 shadow-xl shadow-zinc-200"
        >
          <span className="relative z-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">
            Register New Node <Home size={14} />
          </span>
          <div className="absolute inset-0 bg-[#A4143D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#A4143D]" size={32} />
        </div>
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
                <div className={`p-4 rounded-3xl transition-colors duration-500 ${
                  addr.isDefault ? 'bg-[#A4143D] text-white' : 'bg-zinc-50 text-zinc-300 group-hover:text-zinc-900'
                }`}>
                  <MapPin size={24} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-black text-zinc-900 uppercase tracking-tight italic">
                      {addr.fullName}
                    </p>
                    {addr.isDefault && (
                      <span className="text-[8px] bg-emerald-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase leading-relaxed tracking-tight">
                    {addr.street}, {addr.city}, {addr.state}
                  </p>
                  <p className="text-[10px] font-black text-zinc-400 font-mono tracking-widest pt-2">
                    {addr.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-50">
                {!addr.isDefault ? (
                  <button 
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#A4143D] transition-colors"
                  >
                    Set as Primary Node
                  </button>
                ) : (
                  <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                    <CheckCircle size={12} /> Sync_Active
                  </span>
                )}
                
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(addr)} className="p-3 bg-zinc-50 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="p-3 bg-zinc-50 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={14} />
                  </button>
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

     {/* 🛡️ MODAL SYSTEM: True Viewport Centering */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-zinc-900/60 p-34 backdrop-blur-md animate-in fade-in duration-300">
          
          {/* 🚀 THE CARD: max-h-[85vh] + m-auto for perfect centering */}
          <div className="relative m-auto w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] border border-zinc-100">
            
            {/* Background Aesthetic */}
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-[#A4143D]/5 blur-3xl pointer-events-none" />

            {/* 1. FIXED HEADER */}
            <header className="relative z-10 px-8 pt-8 pb-4 flex items-center justify-between border-b border-zinc-50 bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#A4143D]">
                  <Fingerprint size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logistics_Override</span>
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                  {editingId ? 'Modify Address' : 'New Address'}
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="rounded-full p-2 text-zinc-300 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            {/* 🚀 FIXED STRUCTURE: The <form> now wraps both the scrollable area AND the button footer */}
            <form onSubmit={handleSubmit} className="relative z-10 flex-1 flex flex-col overflow-hidden">
              
              {/* 2. SCROLLABLE CONTENT AREA */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6 space-y-6">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  // Linked to: {profile.fullName || 'IDENTITY_REQUIRED'}
                </p>
                
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">Street_Address</label>
                  <input 
                    placeholder="STREET_ADDRESS"
                    required 
                    value={formData.street}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:bg-white focus:border-[#A4143D]/20 text-xs font-bold font-mono"
                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">City</label>
                    <input 
                      placeholder="CITY"
                      required 
                      value={formData.city}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:bg-white focus:border-[#A4143D]/20 text-xs font-bold font-mono"
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">State</label>
                    <input 
                      placeholder="STATE"
                      required 
                      value={formData.state}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:bg-white focus:border-[#A4143D]/20 text-xs font-bold font-mono"
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* 3. PINNED ACTION FOOTER (Inside form to allow submission) */}
              <footer className="px-8 py-6 border-t border-zinc-50 bg-white">
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-xl border-2 border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="group relative flex-1 overflow-hidden bg-black text-white py-4 rounded-xl transition-all active:scale-95 shadow-xl shadow-zinc-200"
                  >
                    <span className="relative z-10 text-[10px] font-black uppercase tracking-widest">
                      {editingId ? 'Update Address' : 'Save Address'}
                    </span>
                    <div className="absolute inset-0 bg-[#A4143D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </div>
              </footer>
            </form>
          </div>
        </div>
      )}
       </div>

  );

}