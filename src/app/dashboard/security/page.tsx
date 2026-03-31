'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, ChevronRight, Loader2, X, 
  AlertTriangle, Lock, Smartphone, CheckCircle, Monitor, Fingerprint, Activity, ShieldAlert 
} from 'lucide-react';
import { api } from '@/src/lib/axios';

interface ProfileState {
  email: string;
  phone: string;
  is2faEnabled: boolean;
}

interface Session {
  id: string;
  device: string;
  ipAddress: string;
  lastUsed: string;
  isCurrent: boolean;
}

export default function SecurityPage() {
  const [profile, setProfile] = useState<ProfileState>({ email: '', phone: '', is2faEnabled: false });
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'password' | 'delete' | 'phone' | 'activity' | null>(null);

  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [tempPhone, setTempPhone] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchSecurityData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/profile');
      const data = res.data.user || res.data;

      const normalizedData = {
        email: data.email || '',
        phone: data.phone || '', 
        is2faEnabled: data.is2faEnabled || false
      };

      setProfile(normalizedData);
      setTempPhone(normalizedData.phone);
    } catch (err) {
      console.error("Security fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecurityData();
  }, [fetchSecurityData]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/user/sessions');
      setSessions(res.data);
      setActiveModal('activity');
    } catch (err) {
      alert("Could not load activity log");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/user/profile', passwords);
      alert("Password updated successfully!");
      setActiveModal(null);
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || "Error updating password");
    }
  };

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/user/profile', { phone: tempPhone });
      setProfile(prev => ({ ...prev, phone: tempPhone }));
      alert("Phone number updated!");
      setActiveModal(null);
    } catch (err: any) {
      alert("Failed to update phone number");
    }
  };

  const toggle2FA = async () => {
    try {
      const newState = !profile.is2faEnabled;
      await api.patch('/user/toggle-2fa', { enable: newState });
      setProfile(prev => ({ ...prev, is2faEnabled: newState }));
    } catch (err) {
      alert("Failed to update 2FA settings");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt("Type 'DELETE' to permanently remove your account.");
    if (confirmText === 'DELETE') {
      try {
        await api.delete('/user/account');
        localStorage.removeItem('token'); 
        alert("Account deleted. We're sorry to see you go!");
        window.location.href = '/login'; 
      } catch (err) {
        alert("Failed to delete account");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-[#A4143D]" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">Securing account details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col gap-2 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <Fingerprint size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Account_Protection</span>
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Security <span className="text-zinc-200">Settings</span>
        </h1>
      </header>

      {/* 2. SECURITY STATUS HUD */}
      <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center group">
        <div className="bg-white p-5 rounded-3xl shadow-sm text-emerald-500 group-hover:scale-110 transition-transform duration-500">
          <ShieldCheck size={32} />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900">Protected_Account</h3>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
            Your account is currently secured with Industry_Standard_Encryption.
          </p>
        </div>
      </div>

      {/* 3. MAIN SECURITY LIST */}
      <section className="bg-white rounded-[2.5rem] border border-zinc-50 shadow-sm overflow-hidden divide-y divide-zinc-50">
        <SecurityRow 
          label="Mobile Phone" 
          value={profile.phone || "No phone provided"} 
          action={
            <button onClick={() => setActiveModal('phone')} className="text-[10px] font-black uppercase tracking-widest text-[#A4143D] hover:underline">
              {profile.phone ? 'Change' : 'Add'}
            </button>
          } 
        />

        <SecurityRow 
          label="Email Address" 
          value={profile.email} 
          action={<div className="flex items-center gap-2 text-emerald-600 text-[9px] font-black uppercase tracking-widest font-mono"><CheckCircle size={14}/> Verified</div>} 
        />

        <SecurityRow 
          label="Password" 
          value="••••••••••••" 
          subtext="Protection_Level: High"
          action={
            <button onClick={() => setActiveModal('password')} className="bg-zinc-50 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all">
              Update
            </button>
          } 
        />

        <div className="p-8 flex justify-between items-center bg-zinc-50/30">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-tight text-zinc-900">Two-Factor Authentication (2FA)</h4>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Added Account Verification</p>
          </div>
          <ToggleButton enabled={profile.is2faEnabled} onClick={toggle2FA} />
        </div>
      </section>

      {/* 4. CONNECTED ACCOUNTS */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 px-2">Social_Connections</h2>
        <div className="bg-white rounded-[2.5rem] border border-zinc-50 shadow-sm overflow-hidden divide-y divide-zinc-50">
          <SecurityRow label="Google Account" value="ayomide***@gmail.com" action={<span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Linked</span>} />
          <SecurityRow label="Facebook Account" action={
            <button className="group relative overflow-hidden bg-black px-8 py-3 rounded-xl transition-all active:scale-95 shadow-xl shadow-zinc-200">
              <span className="relative z-10 text-[9px] font-black uppercase tracking-widest text-white">Link Account</span>
              <div className="absolute inset-0 bg-[#A4143D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          } />
        </div>
      </section>

      {/* 5. DANGER ZONE */}
      <footer className="pt-8 border-t border-zinc-100 grid md:grid-cols-2 gap-4">
        <button 
          onClick={fetchSessions}
          className="flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-2xl hover:border-[#A4143D]/20 transition-all group"
        >
          <div className="flex items-center gap-4">
            <Activity size={18} className="text-zinc-300 group-hover:text-[#A4143D]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Login Activity Logs</span>
          </div>
          <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900" />
        </button>

        <button onClick={() => setActiveModal('delete')} className="flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-2xl hover:bg-red-50 transition-all group">
           <div className="flex items-center gap-4">
            <ShieldAlert size={18} className="text-zinc-300 group-hover:text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Close Account Permanently</span>
          </div>
        </button>
      </footer>

      {/* --- MODALS --- */}
      {activeModal && (
        <Modal title={activeModal.toUpperCase()} onClose={() => setActiveModal(null)}>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {activeModal === 'activity' && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 italic">// Recent devices used to access your profile.</p>
                {sessions.length === 0 ? (
                  <p className="text-center py-10 text-zinc-400 text-[10px] font-black uppercase tracking-widest">No history found.</p>
                ) : (
                  sessions.map((session) => (
                    <div key={session.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-zinc-100 text-zinc-400">
                        {session.device.toLowerCase().includes('windows') || session.device.toLowerCase().includes('mac') 
                          ? <Monitor size={18} /> 
                          : <Smartphone size={18} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-tight text-zinc-900 truncate font-mono">{session.device}</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                          {session.ipAddress} • {new Date(session.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                      {session.isCurrent && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeModal === 'phone' && (
              <form onSubmit={handleUpdatePhone} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number</label>
                  <input 
                    type="tel" value={tempPhone} required
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:bg-white focus:border-[#A4143D]/20 text-xs font-black font-mono uppercase"
                    onChange={e => setTempPhone(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full group relative overflow-hidden bg-black py-4 rounded-xl active:scale-95 transition-all">
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-white">Save Changes</span>
                  <div className="absolute inset-0 bg-[#A4143D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </form>
            )}

            {activeModal === 'password' && (
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div className="space-y-4">
                  <input 
                    type="password" placeholder="CURRENT PASSWORD" required
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:bg-white focus:border-[#A4143D]/20 text-xs font-black font-mono"
                    onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  />
                  <input 
                    type="password" placeholder="NEW PASSWORD" required
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:bg-white focus:border-[#A4143D]/20 text-xs font-black font-mono"
                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>
                <button type="submit" className="w-full group relative overflow-hidden bg-black py-4 rounded-xl active:scale-95 transition-all">
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-white">Update Password</span>
                  <div className="absolute inset-0 bg-[#A4143D] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </form>
            )}

            {activeModal === 'delete' && (
              <div className="text-center space-y-6">
                <div className="bg-red-50 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto border-4 border-red-100">
                  <AlertTriangle size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900">Confirm Deletion</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 leading-relaxed">
                    This action is irreversible. All your orders, addresses, and history on Aviore will be wiped.
                  </p>
                </div>
                <button onClick={handleDeleteAccount} className="w-full bg-red-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition active:scale-95 shadow-xl shadow-red-100">
                  Delete Permanently
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- Internal HUD Components ---

function SecurityRow({ label, value, subtext, action }: { label: string, value?: string, subtext?: string, action?: React.ReactNode }) {
  return (
    <div className="p-8 flex justify-between items-center group transition hover:bg-zinc-50/50">
      <div className="space-y-1 min-w-0 flex-1">
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</p>
        {value && <p className="text-zinc-900 font-black italic uppercase tracking-tighter truncate pr-4 font-mono">{value}</p>}
        {subtext && <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">{subtext}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function ToggleButton({ enabled, onClick }: { enabled: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-12 h-6 rounded-full relative transition-all ${enabled ? 'bg-[#A4143D]' : 'bg-zinc-200'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-zinc-900/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative m-auto w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] border border-zinc-100">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-50 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#A4143D]">
              <Lock size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Security_Settings</span>
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-300 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}