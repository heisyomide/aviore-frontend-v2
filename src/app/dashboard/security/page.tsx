'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, ChevronRight, Loader2, X, 
  AlertTriangle, Lock, Smartphone, CheckCircle, Monitor, Fingerprint, Activity, ShieldAlert, Check 
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
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

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
      toast.error("Failed to parse core security context");
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
      toast.error("Telemetry failure: Could not load activity logs");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/user/change-password', passwords);
      toast.success("Security keys re-encrypted successfully");
      setActiveModal(null);
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error validating credential payload");
    }
  };

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/user/profile', { phone: tempPhone });
      setProfile(prev => ({ ...prev, phone: tempPhone }));
      toast.success("SMS pipeline routing updated");
      setActiveModal(null);
    } catch (err: any) {
      toast.error("Failed to assign phone protocol");
    }
  };

  const toggle2FA = async () => {
    try {
      const newState = !profile.is2faEnabled;
      await api.patch('/user/toggle-2fa', { enable: newState });
      setProfile(prev => ({ ...prev, is2faEnabled: newState }));
      toast.success(newState ? "Two-Factor enforcement engaged" : "Multi-factor architecture bypassed");
    } catch (err) {
      toast.error("Failed to cycle 2FA infrastructure");
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmationText !== 'DELETE') {
      toast.error("Validation phrase mismatch");
      return;
    }
    try {
      await api.delete('/user/account');
      localStorage.removeItem('token'); 
      toast.success("Profile footprint permanently expunged");
      window.location.href = '/login'; 
    } catch (err) {
      toast.error("Purge instruction rejected by host network");
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 bg-[#0D0D0D] min-h-[50vh]">
        <Loader2 className="animate-spin text-[#991B1B]" size={24} />
        <p className="text-[8px] font-mono font-bold tracking-[0.3em] text-zinc-600 uppercase">Compiling_Security_Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 text-zinc-100">
      
      {/* 1. SECURE LAYER HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-900/60 pb-6">
        <div className="flex items-center gap-2 text-[#991B1B]">
          <Fingerprint size={13} className="animate-pulse" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em]">Account_Protection_Matrix</span>
        </div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
          Security <span className="text-zinc-600 font-normal font-sans tracking-normal">Settings</span>
        </h1>
      </header>

      {/* 2. SECURITY STATUS BLOCK */}
      <div className="bg-[#111113] border border-zinc-900 p-6 rounded-lg flex flex-col sm:flex-row gap-5 items-center group">
        <div className="bg-zinc-950 p-4 rounded border border-zinc-900 text-emerald-600 transition-colors duration-300 group-hover:border-emerald-900/40">
          <ShieldCheck size={24} />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">System_Status_Secured</h3>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide leading-relaxed">
            Infrastructure verification parameters passed. Active session utilizes low-entropy cryptoprocessors.
          </p>
        </div>
      </div>

      {/* 3. CORE PROTOCOLS LIST */}
      <section className="bg-[#111113] rounded-lg border border-zinc-900 divide-y divide-zinc-900/60 overflow-hidden">
        <SecurityRow 
          label="Mobile Authentication Routing" 
          value={profile.phone || "No terminal phone assigned"} 
          action={
            <button 
              onClick={() => { setActiveModal('phone'); setTempPhone(profile.phone); }} 
              className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#991B1B] hover:text-white transition-colors"
            >
              [{profile.phone ? 'Modify' : 'Initialize'}]
            </button>
          } 
        />

        <SecurityRow 
          label="Identity Email Vector" 
          value={profile.email} 
          action={
            <div className="flex items-center gap-1.5 text-emerald-600 text-[9px] font-mono font-bold uppercase tracking-wider">
              <CheckCircle size={11}/> Core_Verified
            </div>
          } 
        />

        <SecurityRow 
          label="Access Credentials Key" 
          value="••••••••••••" 
          subtext="Protocol_Strength: High"
          action={
            <button 
              onClick={() => setActiveModal('password')} 
              className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 px-4 py-1.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider text-white transition-all active:scale-95"
            >
              Update
            </button>
          } 
        />

        <div className="p-6 flex justify-between items-center bg-zinc-950/20">
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-white">Two-Factor Enforcement (2FA)</h4>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Intercept malicious handshakes via mandatory secondary tokens</p>
          </div>
          <ToggleButton enabled={profile.is2faEnabled} onClick={toggle2FA} />
        </div>
      </section>

      {/* 4. THIRD PARTY FEDERATED GATEWAYS */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap">Federated_Identity_Nodes</span>
          <div className="h-[1px] flex-1 bg-zinc-900/60" />
        </div>
        <div className="bg-[#111113] rounded-lg border border-zinc-900 divide-y divide-zinc-900/60 overflow-hidden">
          <SecurityRow label="Google Infrastructure Link" value="ayomide***@gmail.com" action={<span className="text-emerald-500 font-mono text-[9px] font-bold uppercase tracking-wider">Node_Active</span>} />
          <SecurityRow label="Facebook Integration Interface" action={
            <button className="h-7 px-4 rounded bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white transition-all duration-200 flex items-center justify-center text-[9px] font-mono font-bold uppercase tracking-wider active:scale-95">
              Bind_Interface
            </button>
          } />
        </div>
      </section>

      {/* 5. RISK MANIFEST STRATA */}
      <footer className="pt-4 border-t border-zinc-900/60 grid sm:grid-cols-2 gap-4">
        <button 
          onClick={fetchSessions}
          className="flex items-center justify-between p-5 bg-[#111113] border border-zinc-900 rounded-lg hover:border-zinc-800 transition-all duration-300 group text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Activity size={14} className="text-zinc-600 group-hover:text-[#991B1B] transition-colors shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white">Telemetry Logs</span>
              <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-tight truncate">Inspect historic node sessions</span>
            </div>
          </div>
          <ChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors shrink-0" />
        </button>

        <button 
          onClick={() => { setActiveModal('delete'); setDeleteConfirmationText(''); }} 
          className="flex items-center justify-between p-5 bg-[#111113] border border-zinc-900 rounded-lg hover:border-[#991B1B]/40 hover:bg-[#991B1B]/5 transition-all duration-300 group text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <ShieldAlert size={14} className="text-zinc-600 group-hover:text-[#991B1B] transition-colors shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#991B1B]">Purge Registry Footprint</span>
              <span className="block text-[8px] font-mono text-zinc-600 uppercase tracking-tight truncate">Irreversible account destruction protocol</span>
            </div>
          </div>
        </button>
      </footer>

      {/* --- REFACTOR CONTEXT MODAL OVERLAY --- */}
      {activeModal && (
        <Modal title={activeModal === 'delete' ? 'CRITICAL_DESTRUCTION_PROTOCOL' : `${activeModal.toUpperCase()}_PROTOCOL`} onClose={() => setActiveModal(null)}>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            
            {activeModal === 'activity' && (
              <div className="space-y-3">
                <p className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-3">// Active access parameters recorded by tracking layers</p>
                {sessions.length === 0 ? (
                  <p className="text-center py-10 text-zinc-600 text-[9px] font-mono font-bold uppercase tracking-wider">No diagnostic logs found</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-900 rounded">
                        <div className="text-zinc-500 shrink-0">
                          {session.device.toLowerCase().includes('windows') || session.device.toLowerCase().includes('mac') 
                            ? <Monitor size={14} /> 
                            : <Smartphone size={14} />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-mono font-bold text-white truncate">{session.device}</p>
                          <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-wide mt-0.5">
                            {session.ipAddress} • {new Date(session.lastUsed).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}
                          </p>
                        </div>
                        {session.isCurrent && (
                          <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-900/60 px-1.5 py-0.5 rounded shrink-0">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[7px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Host</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeModal === 'phone' && (
              <form onSubmit={handleUpdatePhone} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500 ml-0.5">Terminal Vector Mapping</label>
                  <input 
                    type="tel" value={tempPhone} required
                    placeholder="+234 XXX XXX XXXX"
                    className="w-full p-3 bg-zinc-950 border border-zinc-900 rounded outline-none focus:border-zinc-700 text-xs font-mono font-bold text-white uppercase tracking-wider"
                    onChange={e => setTempPhone(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-3 rounded text-[9px] font-mono font-bold uppercase tracking-widest text-white transition-colors active:scale-[0.99]">
                  Commit Structural Routing
                </button>
              </form>
            )}

            {activeModal === 'password' && (
              <form onSubmit={handleUpdatePassword} className="space-y-3">
                <div className="space-y-2.5">
                  <input 
                    type="password" placeholder="CURRENT SECRET SIGNATURE" required
                    className="w-full p-3 bg-zinc-950 border border-zinc-900 rounded outline-none focus:border-zinc-700 text-xs font-mono font-bold text-white tracking-widest"
                    onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  />
                  <input 
                    type="password" placeholder="NEW COMPLIANT MATRIX KEY" required
                    className="w-full p-3 bg-zinc-950 border border-zinc-900 rounded outline-none focus:border-zinc-700 text-xs font-mono font-bold text-white tracking-widest"
                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>
                <button type="submit" className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-3 rounded text-[9px] font-mono font-bold uppercase tracking-widest text-white transition-colors active:scale-[0.99]">
                  Re-Encrypt Keyphrase
                </button>
              </form>
            )}

            {activeModal === 'delete' && (
              <form onSubmit={handleDeleteAccount} className="space-y-5">
                <div className="bg-[#991B1B]/5 border border-[#991B1B]/20 p-4 rounded text-center flex flex-col items-center gap-2">
                  <AlertTriangle size={20} className="text-[#991B1B]" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Irreversible System Purge</h3>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide leading-relaxed">
                      Executing this trace will instantly expunge all ledgers, order indices, vault details, and persistent historical tracking inside Aviore.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                    Type <span className="text-[#991B1B] font-bold">DELETE</span> to authorize payload termination:
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={deleteConfirmationText}
                    placeholder="CONFIRMATION PHRASE"
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    className="w-full p-3 bg-zinc-950 border border-zinc-900 rounded outline-none focus:border-[#991B1B]/40 text-xs font-mono font-bold text-white uppercase tracking-widest text-center"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={deleteConfirmationText !== 'DELETE'}
                  className="w-full bg-[#991B1B] hover:bg-red-700 disabled:bg-zinc-950 disabled:text-zinc-700 disabled:border-zinc-900 border border-transparent py-3 rounded text-[9px] font-mono font-bold uppercase tracking-widest text-white transition-all active:scale-[0.99]"
                >
                  Execute Destruction Sequence
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- INTERNAL ARCHITECTURAL NODES ---

function SecurityRow({ label, value, subtext, action }: { label: string, value?: string, subtext?: string, action?: React.ReactNode }) {
  return (
    <div className="p-6 flex justify-between items-center gap-4 group transition-colors duration-200 hover:bg-zinc-950/10">
      <div className="space-y-1 min-w-0 flex-1">
        <p className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">{label}</p>
        {value && <p className="text-white font-mono text-xs font-bold tracking-wide truncate pr-2">{value}</p>}
        {subtext && <p className="text-[8px] text-emerald-600 font-mono font-bold uppercase tracking-widest">{subtext}</p>}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function ToggleButton({ enabled, onClick }: { enabled: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-9 h-5 rounded border transition-all relative ${enabled ? 'bg-[#991B1B] border-[#991B1B]' : 'bg-zinc-950 border-zinc-900'}`}
    >
      <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-sm transition-all ${enabled ? 'left-[17px] bg-white' : 'left-0.5 bg-zinc-700'}`} />
    </button>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative m-auto w-full max-w-md overflow-hidden rounded-lg bg-[#111113] p-6 shadow-2xl border border-zinc-900 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-start mb-6 border-b border-zinc-900 pb-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[#991B1B]">
              <Lock size={11} />
              <span className="text-[8px] font-mono font-bold uppercase tracking-[0.25em]">Security_Registry_Lock</span>
            </div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white truncate pr-2">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-800 transition-all shrink-0">
            <X size={14} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}