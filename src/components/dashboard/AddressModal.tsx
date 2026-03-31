'use client';

import { X, Fingerprint } from 'lucide-react';

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
  onSubmit: (e: React.FormEvent) => void;
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <header className="px-6 md:px-8 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#A4143D]">
              <Fingerprint size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Logistics_Override
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tight mt-1">
              {editingId ? 'Modify Address' : 'New Address'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 transition"
          >
            <X size={20} />
          </button>
        </header>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
              Linked to: {profile.fullName || 'IDENTITY_REQUIRED'}
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Street Address
              </label>
              <input
                required
                value={formData.street}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    street: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium outline-none focus:border-[#A4143D]"
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  City
                </label>
                <input
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium outline-none focus:border-[#A4143D]"
                  placeholder="City"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  State
                </label>
                <input
                  required
                  value={formData.state}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium outline-none focus:border-[#A4143D]"
                  placeholder="State"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="px-6 md:px-8 py-5 border-t border-zinc-100 bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-xl border border-zinc-200 text-sm font-bold uppercase"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 py-4 rounded-xl bg-black text-white text-sm font-bold uppercase hover:bg-[#A4143D] transition"
              >
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}