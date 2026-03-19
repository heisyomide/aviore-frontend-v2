'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2, User, Fingerprint, Calendar, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProfileInfoCard from '../../../components/dashboard/ProfileInfoCard';
import EditProfileModal from '../../../components/dashboard/EditProfileModal';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#A4143D]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. HEADER: Rule 1 (Identity Protocol) */}
      <header className="flex flex-col gap-2 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Fingerprint size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Identity_Protocol</span>
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900">
          My <span className="text-zinc-200">Profile</span>
        </h1>
      </header>

      {/* 2. PROFILE HEADER: Rule 5 (Industrial HUD) */}
      <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-zinc-300 border-4 border-zinc-100 shadow-inner">
              <User size={48} />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-zinc-50 rounded-full animate-pulse" />
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
              {user?.name || 'Guest User'}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
              <p className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-zinc-100">
                <Activity size={12} className="text-[#A4143D]" /> {user?.email}
              </p>
              <p className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-zinc-100">
                <Calendar size={12} /> Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETAILS LIST: Rule 2 (Grid HUD) */}
      <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden divide-y divide-zinc-50">
        <ProfileInfoCard 
          label="Full Name" 
          value={user?.name || "Not provided"} 
        />
        <ProfileInfoCard 
          label="Phone Number" 
          value={user?.phone || "+234 --- --- ----"} 
        />
        <ProfileInfoCard 
          label="Total Orders" 
          value={user?._count?.orders?.toString().padStart(2, '0') || "00"} 
        />
        <ProfileInfoCard 
          label="Total Reviews" 
          value={user?._count?.reviews?.toString().padStart(2, '0') || "00"} 
        />
      </div>

      {/* 4. ACTION BUTTON: Rule 5 (Aviore Button Logic) */}
      <div className="flex justify-start">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="group relative px-12 py-5 bg-black rounded-xl overflow-hidden transition-all active:scale-95"
        >
          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center gap-3">
            Edit Profile
          </span>
          <div className="absolute inset-0 bg-[#A4143D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

      {/* MODAL SYSTEM */}
      <EditProfileModal 
        user={user} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdate={fetchProfile}
      />
    </div>
  );
}