'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { toast } from 'react-hot-toast';

export default function EditProfileModal({ user, isOpen, onClose, onUpdate }: any) {
  // 1. Initialize state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  // 2. Sync state when the 'user' prop changes or modal opens
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
      // Calls your @Patch('profile') backend endpoint
      await api.patch('/user/profile', formData);
      toast.success("Profile updated successfully!");
      
      // 3. Trigger the refresh in ProfilePage
      await onUpdate(); 
      
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
            <input 
              className="w-full p-3 rounded-lg border border-gray-200 mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
            <input 
              className="w-full p-3 rounded-lg border border-gray-200 mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
            <input 
              className="w-full p-3 rounded-lg border border-gray-200 mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="+234..."
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-[#f26522] text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition-all shadow-md shadow-orange-200"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}