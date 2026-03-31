'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { toast } from 'react-hot-toast';
import { X, Fingerprint, Loader2, ShieldCheck } from 'lucide-react';

interface EditProfileModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}

export default function EditProfileModal({ user, isOpen, onClose, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/user/profile', formData);
      toast.success("Identity_Sync_Complete");
      await onUpdate(); 
      onClose();
    } catch (error) {
      console.error("OVERRIDE_FAILURE", error);
      toast.error("Protocol Error: Modification rejected");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🛡️ MODAL WRAPPER: Matches Dashboard HUD depth
   <div className="fixed inset-0 z-[99999] flex justify-center items-start pt-40 bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      
      {/* 🚀 MODAL CARD: Strictly follows the 2.5rem rounding and industrial aesthetic */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl flex flex-col h-fit max-h-[90vh] border border-zinc-100 animate-in zoom-in-95 duration-300">
        
        {/* Background Visual Decals */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-[#A4143D]/10 blur-3xl pointer-events-none" />
        <ShieldCheck className="absolute -bottom-10 -right-10 h-48 w-48 text-zinc-50 pointer-events-none opacity-40" />

        {/* 1. HEADER: Pinned Registry Navigation */}
        <header className="relative z-10 px-8 pt-8 pb-4 flex items-center justify-between border-b border-zinc-50 bg-white">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[#A4143D]">
              <Fingerprint size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Identity_Override</span>
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">Modify Profile</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-zinc-300 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </header>
        
        {/* 2. BODY: Input Registry */}
<form
  onSubmit={handleSubmit}
  className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-8 py-6 space-y-6"
>
  <div className="grid grid-cols-2 gap-4">
    <InputField
      label="First_Name"
      value={formData.firstName}
      onChange={(val: string) =>
        setFormData({ ...formData, firstName: val })
      }
    />
    <InputField
      label="Last_Name"
      value={formData.lastName}
      onChange={(val: string) =>
        setFormData({ ...formData, lastName: val })
      }
    />
  </div>

  <InputField
    label="Phone_String"
    placeholder="+234 ..."
    value={formData.phone}
    onChange={(val: string) =>
      setFormData({ ...formData, phone: val })
    }
  />

  {/* MOVE FOOTER INSIDE FORM */}
  <footer className="relative z-10 pt-6 border-t border-zinc-50 bg-white">
    <div className="flex gap-4">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 rounded-xl border-2 border-zinc-100 py-4"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="flex-1 rounded-xl bg-black px-6 py-4"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={14} />
        ) : (
          "Execute Changes"
        )}
      </button>
    </div>
  </footer>
</form>
      </div>
    </div>
  );
}

/** ⌨️ HUD INPUT: Monospaced and Industrial */
function InputField({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </label>
      <input 
        className="w-full rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-xs font-black text-zinc-900 outline-none transition-all focus:border-[#A4143D]/30 focus:bg-white placeholder:text-zinc-200 font-mono"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}