'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, ChevronRight, Loader2, X, 
  AlertTriangle, Lock, Smartphone, CheckCircle, Monitor, Fingerprint, Activity, ShieldAlert 
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

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
      toast.error("Error", { description: "Failed to retrieve security configuration status." });
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
      toast.error("Access Denied", { description: "Could not load real-time account session activity data." });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/user/change-password', passwords);
      toast.success("Password Updated", { description: "Your login credentials have been modified." });
      setActiveModal(null);
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error("Update Failed", { description: err.response?.data?.message || "An authentication error occurred." });
    }
  };

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/user/profile', { phone: tempPhone });
      setProfile(prev => ({ ...prev, phone: tempPhone }));
      toast.success("Phone Updated", { description: "Your verification telephone index has been changed." });
      setActiveModal(null);
    } catch (err: any) {
      toast.error("Update Failed", { description: "Could not store account phone details." });
    }
  };

  const toggle2FA = async () => {
    try {
      const newState = !profile.is2faEnabled;
      await api.patch('/user/toggle-2fa', { enable: newState });
      setProfile(prev => ({ ...prev, is2faEnabled: newState }));
      toast.success(newState ? "2FA Enabled" : "2FA Disabled", { 
        description: newState ? "Multi-factor authentication check is now active." : "Your account security layer has been reduced." 
      });
    } catch (err) {
      toast.error("Configuration Error", { description: "Failed to modify multi-factor token configurations." });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user/account');
      localStorage.removeItem('token'); 
      toast.success("Account Terminated", { description: "All profile identity vectors have been closed completely." });
      window.location.href = '/login'; 
    } catch (err) {
      toast.error("Error", { description: "Failed to permanently remove profile data paths." });
    }
  };

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
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Account Protection</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Security <span className="text-zinc-300 font-medium">Settings</span>
        </h1>
      </header>

      {/* 2. SECURITY STATUS HERO */}
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center">
        <div className="bg-zinc-50 p-4 rounded-full border border-zinc-200 text-emerald-600 shrink-0">
          <ShieldCheck size={28} />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900">Secure Profile Status</h3>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed">
            Your profile parameters are currently wrapped within standard data security and token hashing logic.
          </p>
        </div>
      </div>

      {/* 3. MAIN SECURITY PARAMETERS LIST */}
      <section className="bg-white rounded-2xl border border-zinc-200 overflow-hidden divide-y divide-zinc-200">
        <SecurityRow 
          label="Mobile Phone" 
          value={profile.phone || "No telephone provided"} 
          action={
            <button onClick={() => setActiveModal('phone')} className="text-[10px] font-bold uppercase tracking-wider text-[#A4143D] hover:underline">
              {profile.phone ? 'Change' : 'Add'}
            </button>
          } 
        />

        <SecurityRow 
          label="Email Address" 
          value={profile.email} 
          action={<div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase tracking-wider"><CheckCircle size={12}/> Verified</div>} 
        />

        <SecurityRow 
          label="Password String" 
          value="••••••••••••" 
          subtext="Profile Integrity Status: Strong"
          action={
            <button onClick={() => setActiveModal('password')} className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-all">
              Update
            </button>
          } 
        />

        <div className="p-6 flex justify-between items-center bg-zinc-50/30">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-tight text-zinc-900">Two-Factor Authentication (2FA)</h4>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Multi-Factor Token Verification Layer</p>
          </div>
          <ToggleButton enabled={profile.is2faEnabled} onClick={toggle2FA} />
        </div>
      </section>

      {/* 4. SOCIAL OAUTH CONNECTIONS */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 px-1">Identity Providers</h2>
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden divide-y divide-zinc-200">
          <SecurityRow label="Google Identity" value="ayomide***@gmail.com" action={<span className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider">Active Connection</span>} />
          <SecurityRow label="Facebook Identity" action={
            <button className="bg-zinc-900 hover:bg-black px-6 py-3 rounded-xl transition-all active:scale-95 text-[10px] font-bold uppercase tracking-wider text-white">
              Link Account
            </button>
          } />
        </div>
      </section>

      {/* 5. DATA MANAGEMENT ACTIONS */}
      <footer className="pt-4 border-t border-zinc-100 grid md:grid-cols-2 gap-4">
        <button 
          onClick={fetchSessions}
          className="flex items-center justify-between p-6 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-400 transition-all group"
        >
          <div className="flex items-center gap-4">
            <Activity size={16} className="text-zinc-400 group-hover:text-[#A4143D]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-900">Session Activity Logs</span>
          </div>
          <ChevronRight size={14} className="text-zinc-400 group-hover:text-zinc-900" />
        </button>

        <button onClick={() => setActiveModal('delete')} className="flex items-center justify-between p-6 bg-white border border-zinc-200 rounded-2xl hover:bg-red-50/50 hover:border-red-200 transition-all group">
           <div className="flex items-center gap-4">
            <ShieldAlert size={16} className="text-zinc-400 group-hover:text-red-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Terminate Account Index</span>
          </div>
        </button>
      </footer>

      {/* --- REFACTOR MODAL INTERLAYERS --- */}
      {activeModal && (
        <Modal title={activeModal === 'activity' ? 'Device Logs' : activeModal === 'delete' ? 'Delete Profile' : `Modify ${activeModal}`} onClose={() => setActiveModal(null)}>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {activeModal === 'activity' && (
              <div className="space-y-4 pt-1">
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-2">Authenticated Device Identifiers</p>
                {sessions.length === 0 ? (
                  <p className="text-center py-10 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">No logged entries found.</p>
                ) : (
                  sessions.map((session) => (
                    <div key={session.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200">
                      <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-zinc-400">
                        {session.device.toLowerCase().includes('windows') || session.device.toLowerCase().includes('mac') 
                          ? <Monitor size={16} /> 
                          : <Smartphone size={16} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate uppercase tracking-tight">{session.device}</p>
                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mt-0.5">
                          {session.ipAddress} • {new Date(session.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                      {session.isCurrent && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeModal === 'phone' && (
              <form onSubmit={handleUpdatePhone} className="space-y-5 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Telephone Line</label>
                  <input 
                    type="tel" value={tempPhone} required
                    className="w-full px-4 py-3.5 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 text-xs font-bold text-zinc-900 uppercase"
                    onChange={e => setTempPhone(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full bg-zinc-900 hover:bg-black py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white transition-all active:scale-95">
                  Save Verification Data
                </button>
              </form>
            )}

            {activeModal === 'password' && (
              <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
                <input 
                  type="password" placeholder="CURRENT PASSWORD" required
                  className="w-full px-4 py-3.5 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 text-xs font-bold"
                  onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                />
                <input 
                  type="password" placeholder="NEW PASSWORD" required
                  className="w-full px-4 py-3.5 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 text-xs font-bold"
                  onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <button type="submit" className="w-full bg-zinc-900 hover:bg-black py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white transition-all active:scale-95">
                  Rewrite Password Credentials
                </button>
              </form>
            )}

            {activeModal === 'delete' && (
              <div className="text-center space-y-6 pt-2">
                <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-red-200">
                  <AlertTriangle size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900">Irreversible Action</h3>
                  <p className="text-xs text-zinc-500 font-medium px-2 leading-relaxed">
                    Account termination purges all tracking references, active voucher indices, order logs, and registered locations immediately.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <button onClick={handleDeleteAccount} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition active:scale-95 shadow-sm">
                    Confirm Full Account Removal
                  </button>
                  <button onClick={() => setActiveModal(null)} className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition active:scale-95">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- CORE DESIGN MOLECULES ---

function SecurityRow({ label, value, subtext, action }: { label: string, value?: string, subtext?: string, action?: React.ReactNode }) {
  return (
    <div className="p-6 flex justify-between items-center transition hover:bg-zinc-50/30">
      <div className="space-y-0.5 min-w-0 flex-1">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
        {value && <p className="text-zinc-900 font-black uppercase text-sm tracking-tight truncate pr-4">{value}</p>}
        {subtext && <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider pt-0.5">{subtext}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function ToggleButton({ enabled, onClick }: { enabled: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-11 h-6 rounded-full relative transition-all ${enabled ? 'bg-[#A4143D]' : 'bg-zinc-200'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${enabled ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative m-auto w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] border border-zinc-200">
        <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[#A4143D]">
              <Lock size={12} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Access Scope</span>
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900 leading-none">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-black transition-colors rounded-lg hover:bg-zinc-50">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}