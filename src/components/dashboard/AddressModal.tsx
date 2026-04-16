'use client';

import { X, Fingerprint, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface FormData {
  street: string;
  city: string;
  state: string;
}

interface Profile {
  fullName: string;
  phoneNumber: string;
}

interface AddressModalProps {
  isOpen: boolean;
  editingId: string | null;
  profile: Profile;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>; // Changed to Promise
}

export default function AddressModal({
  isOpen,
  editingId,
  profile,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: AddressModalProps) {
  const [isPending, setIsPending] = useState(false);

  if (!isOpen) return null;

  const handleInternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await onSubmit(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <header className="px-8 py-6 border-b border-zinc-50 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#A4143D]">
              <Fingerprint size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logistics</span>
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
              {editingId ? 'Modify Address' : 'New Address'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors"><X size={20} /></button>
        </header>

        <form onSubmit={handleInternalSubmit} className="flex flex-col flex-1">
          <div className="px-8 py-8 space-y-6">
            <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Identity_Binding</p>
                <p className="text-[11px] font-bold text-zinc-900 uppercase tracking-tight">
                    {profile.fullName || 'UNRESOLVED_IDENTITY'} // {profile.phoneNumber || 'NO_CONTACT'}
                </p>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">Street_Address</label>
              <input
                required
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-[13px] font-bold outline-none focus:bg-white focus:border-[#A4143D]/30 transition-all"
                placeholder="Enter street name and house number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">City</label>
                <input
                  required
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-[13px] font-bold outline-none focus:bg-white focus:border-[#A4143D]/30 transition-all"
                  placeholder="Lagos"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-1">State</label>
                <input
                  required
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-[13px] font-bold outline-none focus:bg-white focus:border-[#A4143D]/30 transition-all"
                  placeholder="Lagos State"
                />
              </div>
            </div>
          </div>

          <footer className="px-8 py-6 border-t border-zinc-50 flex gap-4 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-4 rounded-xl border-2 border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-4 rounded-xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#A4143D] transition-all flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : (editingId ? 'Update Address' : 'Save Address')}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}