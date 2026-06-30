'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2, User, Calendar, Activity, Fingerprint } from 'lucide-react';
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
      <div className="flex h-96 items-center justify-center animate-in fade-in duration-300">
        <Loader2 className="animate-spin text-[#A4143D]" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* 1. PREMIUM HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Fingerprint size={14} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Personal Profile</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          My <span className="text-zinc-300 font-medium">Profile</span>
        </h1>
      </header>

      {/* 2. USER OVERVIEW BANNER */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400 border border-zinc-200 shadow-inner">
              <User size={36} />
            </div>
            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          
          <div className="text-center sm:text-left space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 leading-none">
              {user?.name || 'Guest User'}
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <p className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50 px-3 py-1 rounded-md border border-zinc-100">
                <Activity size={12} className="text-[#A4143D]" /> {user?.email}
              </p>
              <p className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50 px-3 py-1 rounded-md border border-zinc-100">
                <Calendar size={12} /> Joined {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETAILS LIST MAPPED DATA */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden divide-y divide-zinc-100">
        <ProfileInfoCard 
          label="Full Name" 
          value={user?.name || "Not provided"} 
        />
        <ProfileInfoCard 
          label="Phone Number" 
          value={user?.phone || "Not provided"} 
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

      {/* 4. ACTIONS FOOTER */}
      <div className="flex justify-start pt-2">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all active:scale-95 shadow-sm"
        >
          Edit Profile Details
        </button>
      </div>

      {/* MODAL OVERLAY WRAPPER */}
      <EditProfileModal 
        user={user} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdate={fetchProfile}
      />
    </div>
  );
}