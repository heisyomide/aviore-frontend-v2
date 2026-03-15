'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, ChevronRight, Loader2, X, 
  AlertTriangle, Lock, Smartphone, CheckCircle, Monitor
} from 'lucide-react';
import { api } from '@/src/lib/axios';

// --- Types ---
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

  // Form & Data States
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [tempPhone, setTempPhone] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);

  // --- Data Fetching ---
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

  // --- Handlers ---
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
      await api.patch('/user/change-password', passwords);
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
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="text-gray-500 font-medium">Securing your session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 p-4">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Security Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account protection and sign-in methods.</p>
      </header>

      {/* Security Status Card */}
      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex gap-4 items-start shadow-sm">
        <div className="bg-emerald-500 p-2 rounded-lg text-white">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h3 className="font-bold text-emerald-900">Your account is well-protected</h3>
          <p className="text-emerald-700 text-sm leading-relaxed mt-0.5">
            Aviorè uses industry-standard encryption to keep your data safe.
          </p>
        </div>
      </div>

      {/* Main Security List */}
      <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        <SecurityRow 
          label="Mobile Phone" 
          value={profile.phone || "No phone linked"} 
          action={
            <button onClick={() => setActiveModal('phone')} className="text-orange-600 font-bold text-sm hover:underline">
              {profile.phone ? 'Change' : 'Add'}
            </button>
          } 
        />

        <SecurityRow 
          label="Email Address" 
          value={profile.email} 
          action={<div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-wider"><CheckCircle size={14}/> Verified</div>} 
        />

        <SecurityRow 
          label="Password" 
          value="••••••••••••" 
          subtext="Strong Quality"
          action={
            <button onClick={() => setActiveModal('password')} className="bg-gray-100 px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition">
              Edit
            </button>
          } 
        />

        <div className="p-6 flex justify-between items-center bg-gray-50/30">
          <div>
            <h4 className="font-bold text-gray-900">Two-Factor Authentication (2FA)</h4>
            <p className="text-sm text-gray-500">Secure your account with an extra verification step.</p>
          </div>
          <ToggleButton enabled={profile.is2faEnabled} onClick={toggle2FA} />
        </div>
      </section>

      {/* Connected Accounts */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 px-2">Connected Accounts</h2>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm divide-y divide-gray-50">
          <SecurityRow label="Google" value="ayomide***@gmail.com" action={<span className="text-emerald-500 font-bold text-xs">Linked</span>} />
          <SecurityRow label="Facebook" action={<button className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-orange-600 transition">Link</button>} />
        </div>
      </section>

      {/* Danger Zone */}
      <footer className="pt-6 border-t border-gray-100 space-y-4">
        <button 
          onClick={fetchSessions}
          className="flex items-center justify-between w-full p-5 hover:bg-gray-50 rounded-2xl transition group border border-transparent hover:border-gray-200"
        >
          <span className="font-bold text-gray-700">Account login activity</span>
          <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-900" />
        </button>
        <button onClick={() => setActiveModal('delete')} className="w-full text-left px-5 py-2 text-red-500 text-xs font-bold uppercase tracking-widest hover:underline">
          Permanently Delete Account
        </button>
      </footer>

      {/* --- MODALS --- */}

      {/* Activity Modal */}
      {activeModal === 'activity' && (
        <Modal title="Sign-in Activity" onClose={() => setActiveModal(null)}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-xs text-gray-500 mb-2">Recent devices that accessed your account.</p>
            {sessions.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm italic">No recent activity found.</p>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
                    {session.device.toLowerCase().includes('windows') || session.device.toLowerCase().includes('mac') 
                      ? <Monitor size={20} className="text-gray-400" /> 
                      : <Smartphone size={20} className="text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{session.device}</p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {session.ipAddress} • {new Date(session.lastUsed).toLocaleDateString()}
                    </p>
                  </div>
                  {session.isCurrent && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-tighter">
                      Active
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </Modal>
      )}

      {/* Phone Modal */}
      {activeModal === 'phone' && (
        <Modal title="Phone Number" onClose={() => setActiveModal(null)}>
          <form onSubmit={handleUpdatePhone} className="space-y-4">
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="tel" value={tempPhone} required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none font-medium"
                onChange={e => setTempPhone(e.target.value)}
              />
            </div>
            <button className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-100">
              Update Number
            </button>
          </form>
        </Modal>
      )}

      {/* Password Modal */}
      {activeModal === 'password' && (
        <Modal title="Update Password" onClose={() => setActiveModal(null)}>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <input 
              type="password" placeholder="Current Password" required
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
              onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
            />
            <input 
              type="password" placeholder="New Password" required
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
              onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
            <button className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100">
              Save New Password
            </button>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {activeModal === 'delete' && (
        <Modal title="Delete Account" onClose={() => setActiveModal(null)}>
          <div className="text-center space-y-5">
            <div className="bg-red-50 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto border-4 border-red-100">
              <AlertTriangle size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-lg">Are you absolutely sure?</h3>
              <p className="text-gray-500 text-sm px-2">
                This action is irreversible. All your orders, addresses, and digital history on <strong>Aviorè</strong> will be wiped.
              </p>
            </div>
            <button onClick={handleDeleteAccount} className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition shadow-xl shadow-red-100">
              Delete Everything
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- Sub-components ---

function SecurityRow({ label, value, subtext, action }: { label: string, value?: string, subtext?: string, action?: React.ReactNode }) {
  return (
    <div className="p-6 flex justify-between items-center group transition">
      <div className="space-y-0.5 min-w-0 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        {value && <p className="text-gray-900 font-bold truncate pr-4">{value}</p>}
        {subtext && <p className="text-[10px] text-emerald-600 font-bold uppercase">{subtext}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function ToggleButton({ enabled, onClick }: { enabled: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-14 h-7 rounded-full transition-all relative ${enabled ? 'bg-orange-500' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${enabled ? 'left-8' : 'left-1'}`} />
    </button>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}