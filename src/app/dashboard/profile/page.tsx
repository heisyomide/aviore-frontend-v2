'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2, User, Calendar, Mail, Phone, ShoppingBag, Star, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import ProfileInfoCard from '../../../components/dashboard/ProfileInfoCard';
import EditProfileModal from '../../../components/dashboard/EditProfileModal';

/* ── Section shell (consistent with other dashboard pages) ───────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-100 overflow-hidden bg-white">
      <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">{title}</p>
      </div>
      {children}
    </div>
  );
}

/* ── Stat pill ───────────────────────────────────────────────────── */
function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 py-4 px-3 text-center">
      <span className="text-zinc-400">{icon}</span>
      <span className="text-xl font-black text-zinc-900 leading-none">{value}</span>
      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{label}</span>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/profile');
      setUser(res.data);
    } catch (err) {
      console.error('Profile_Fetch_Error:', err);
      toast.error('Could not load profile', { description: 'Check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-zinc-400" size={20} strokeWidth={1.5} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Loading</span>
      </div>
    );
  }

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-white pb-28 font-sans antialiased space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <User size={11} className="text-[#A4143D]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#A4143D]">
              Account
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
            My Profile
          </h1>
        </div>
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-1.5 shrink-0 mt-1 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95"
        >
          <Pencil size={12} />
          Edit
        </button>
      </div>

      {/* ── Avatar + Name ── */}
      <div className="flex items-center gap-4 py-4 px-5 rounded-2xl border border-zinc-100 bg-zinc-50/40">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400">
            <User size={24} strokeWidth={1.5} />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-black uppercase tracking-tight text-zinc-900 leading-tight truncate">
            {user?.name || 'Guest User'}
          </p>
          {joined && (
            <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
              <Calendar size={10} /> Joined {joined}
            </p>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 rounded-2xl border border-zinc-100 overflow-hidden divide-x divide-zinc-100">
        <StatPill
          icon={<ShoppingBag size={14} strokeWidth={1.5} />}
          label="Orders"
          value={user?._count?.orders?.toString().padStart(2, '0') ?? '00'}
        />
        <StatPill
          icon={<Star size={14} strokeWidth={1.5} />}
          label="Reviews"
          value={user?._count?.reviews?.toString().padStart(2, '0') ?? '00'}
        />
      </div>

      {/* ── Details ── */}
      <Section title="Profile details">
        <div className="divide-y divide-zinc-100">
          <ProfileInfoCard label="Full Name"     value={user?.name  || 'Not provided'} />
          <ProfileInfoCard label="Email Address" value={user?.email || 'Not provided'} />
          <ProfileInfoCard label="Phone Number"  value={user?.phone || 'Not provided'} />
        </div>
      </Section>

      {/* ── Modal ── */}
      <EditProfileModal
        user={user}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdate={fetchProfile}
      />
    </div>
  );
}