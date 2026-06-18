'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2, User, Fingerprint, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';
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
      <div className="py-24 flex flex-col items-center justify-center gap-4 bg-[#0D0D0D] min-h-[50vh]">
        <Loader2 className="animate-spin text-[#991B1B]" size={26} />
        <p className="text-[8px] font-mono font-bold tracking-[0.25em] text-zinc-600 uppercase">Synchronizing Credentials...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 text-zinc-100">
      
      {/* 1. IDENTITY PROTOCOL HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-900/60 pb-6">
        <div className="flex items-center gap-2 text-[#991B1B]">
          <Fingerprint size={13} className="animate-pulse" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em]">Identity_Protocol</span>
        </div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
          My <span className="text-zinc-600 font-normal font-sans tracking-normal">Profile</span>
        </h1>
      </header>

      {/* 2. INDUSTRIAL ACCREDITATION HUD */}
      <div className="bg-[#111113] p-6 rounded-lg border border-zinc-900 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-center text-zinc-500 shadow-inner">
              <User size={36} strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-600 border-2 border-[#111113] rounded-full" />
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-lg font-mono font-bold uppercase tracking-wide text-white">
              {user?.name || 'Guest User'}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <p className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider bg-zinc-950 px-3 py-1.5 rounded border border-zinc-900/60">
                <Activity size={11} className="text-[#991B1B]" /> {user?.email}
              </p>
              <p className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider bg-zinc-950 px-3 py-1.5 rounded border border-zinc-900/60">
                <Calendar size={11} className="text-zinc-500" /> Pipeline_Init: {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECURE DATA REGISTRY METRICS */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap">Credentials_Registry</span>
          <div className="h-[1px] flex-1 bg-zinc-900/60" />
        </div>
        
        <div className="bg-[#111113] rounded-lg border border-zinc-900 overflow-hidden divide-y divide-zinc-900/40">
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
      </div>

      {/* 4. TECHNICAL REFACTOR CONTROL ACTION */}
      <div className="flex justify-start pt-2">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="group relative px-8 py-3.5 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded transition-all active:scale-98 overflow-hidden"
        >
          <span className="relative z-10 text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-300 group-hover:text-white flex items-center gap-3 transition-colors">
            Modify_Identity
          </span>
          <div className="absolute inset-0 bg-[#991B1B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* MODAL CONFIGURATION ROUTER */}
      <EditProfileModal 
        user={user} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdate={fetchProfile}
      />
    </div>
  );
}