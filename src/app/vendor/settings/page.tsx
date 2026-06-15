'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Save, Store, Truck, Landmark, ShieldCheck, Loader2, 
  User, Mail, BadgeCheck, CheckCircle, RefreshCcw, Globe
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Store');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isEditingBank, setIsEditingBank] = useState(false);

  const NIGERIAN_BANKS = [
    { name: 'Access Bank', code: '044' },
    { name: 'Citibank', code: '023' },
    { name: 'Ecobank', code: '050' },
    { name: 'Fidelity Bank', code: '070' },
    { name: 'First Bank', code: '011' },
    { name: 'FCMB', code: '214' },
    { name: 'GTBank', code: '058' },
    { name: 'Heritage Bank', code: '030' },
    { name: 'Keystone Bank', code: '082' },
    { name: 'Kuda Bank', code: '090267' },
    { name: 'Moniepoint', code: '50515' },
    { name: 'Opay', code: '100004' },
    { name: 'Palmpay', code: '999991' },
    { name: 'Polaris Bank', code: '076' },
    { name: 'Providus Bank', code: '101' },
    { name: 'Stanbic IBTC', code: '221' },
    { name: 'Sterling Bank', code: '232' },
    { name: 'UBA', code: '033' },
    { name: 'Union Bank', code: '032' },
    { name: 'Unity Bank', code: '215' },
    { name: 'Wema Bank', code: '035' },
    { name: 'Zenith Bank', code: '057' },
  ];

  const fetchRegistryData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${baseUrl}/vendor/settings/full-profile`, {
        signal,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) throw new Error('SYNC_FAILURE');

      const result = await response.json();
      setFormData(result);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast.error("IDENTITY_SYNC_FAILURE", { description: "Registry node unreachable." });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchRegistryData(controller.signal);
    return () => controller.abort();
  }, [fetchRegistryData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch('/vendor/settings/update', formData);
      toast.success("PROTOCOL_UPDATED", { description: "Global registry nodes synchronized." });
    } catch (e) {
      toast.error("COMMIT_ERROR");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !formData) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 pb-32 animate-in fade-in duration-700">
      
      {/* 🚀 EXECUTIVE CONTROLS HEADER */}
      <div className="p-6 lg:p-10 space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[#111113] p-6 lg:p-8 rounded-xl border border-zinc-900 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-900 relative shrink-0">
              <Store size={22} className="text-[#ef4444]" />
              {formData.isVerified && (
                <div className="absolute -top-1.5 -right-1.5 bg-emerald-950 text-emerald-400 rounded-full p-0.5 border border-emerald-500">
                  <BadgeCheck size={10} fill="currentColor" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-light text-white uppercase tracking-widest font-sans">
                {formData.storeName || 'REGISTRY_NODE'}
              </h1>
              <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-[0.15em] mt-1.5 flex items-center gap-2">
                <Globe size={10} /> aviore.com/store/{formData.slug}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-900 text-zinc-200 border border-zinc-900 px-8 py-3.5 rounded-lg font-mono font-bold uppercase text-[9px] tracking-widest transition-colors flex items-center justify-center gap-2.5 disabled:opacity-40 cursor-pointer"
          >
            {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            {isSaving ? 'Synchronizing Node...' : 'Commit Protocol Changes'}
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* 📱 ADAPTIVE INTERFACE TABS */}
          <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            {[
              { id: 'Store', label: 'Identity', icon: User },
              { id: 'Logistics', label: 'Parameters', icon: Truck },
              { id: 'Bank', label: 'Treasury', icon: Landmark },
              { id: 'KYC', label: 'Security', icon: ShieldCheck },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 lg:flex-none flex items-center gap-3 px-5 py-3.5 rounded-lg transition-colors border shrink-0 cursor-pointer ${
                    isActive 
                      ? 'bg-[#991B1B] border-[#991B1B] text-white shadow-xl' 
                      : 'bg-[#111113] border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <TabIcon size={14} className={isActive ? 'text-white' : 'text-zinc-600'} />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 📄 CONTENT MODULE DESCRIPTOR */}
          <div className="lg:col-span-9 bg-[#111113] p-6 lg:p-10 rounded-xl shadow-2xl border border-zinc-900 min-h-[520px]">
            
            {/* Identity Configuration */}
            {activeTab === 'Store' && (
              <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                <SectionHeader title="Store Architecture" subtitle="System global identity configuration nodes." />
                <div className="grid md:grid-cols-2 gap-5">
                  <SettingsInput label="Authorized System Owner" value={formData.ownerName} disabled icon={User} />
                  <SettingsInput label="Network Access Endpoint" value={formData.email} disabled icon={Mail} />
                  <SettingsInput label="Alias Registry Name" value={formData.storeName} onChange={(v: string) => setFormData({...formData, storeName: v})} />
                  <SettingsInput label="URL Route Identity Slug" value={formData.slug} prefix="aviore.com/" onChange={(v: string) => setFormData({...formData, slug: v})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest ml-0.5">Store Manifest Payload</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-4 bg-zinc-950 border border-zinc-900 rounded-lg text-xs font-mono text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-700 transition-colors h-40 resize-none"
                    placeholder="Document your brand architecture mission statement..."
                  />
                </div>
              </div>
            )}

            {/* Logistics Configuration */}
            {activeTab === 'Logistics' && (
              <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                <SectionHeader title="Fulfillment Parameters" subtitle="Global transport & shipping ledger overhead." />
                <div className="max-w-sm p-6 bg-zinc-950 rounded-xl border border-zinc-900 shadow-2xl relative overflow-hidden">
                  <p className="text-[9px] font-mono font-bold text-[#ef4444] uppercase tracking-widest mb-3.5">Flat Logistics Rate</p>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-zinc-600 text-sm font-bold">₦</span>
                    <input 
                      type="number"
                      value={formData.shippingFee}
                      onChange={(e) => setFormData({...formData, shippingFee: e.target.value})}
                      className="w-full pl-9 pr-4 py-3.5 bg-[#111113] border border-zinc-900 rounded-lg font-mono font-bold text-base text-white outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>
                  <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase mt-4">
                    {Number(formData.shippingFee) > 0 ? "MATRIX ACTIVE: TRANSACTION OVERHEAD LOADED" : "SYSTEM FREE FULFILLMENT MODE ACTIVE"}
                  </p>
                </div>
              </div>
            )}

            {/* Treasury Settlement Configuration */}
            {activeTab === 'Bank' && (
              <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                <SectionHeader title="Settlement Channel" subtitle="Authorized incoming liquidity routes." />
                {!isEditingBank ? (
                  <div className="p-5 border border-zinc-900 rounded-xl flex flex-col sm:flex-row justify-between items-center bg-zinc-950 shadow-2xl gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 bg-[#111113] border border-zinc-900 text-zinc-400 rounded-lg flex items-center justify-center shrink-0">
                        <Landmark size={16} className="text-[#ef4444]" />
                      </div>
                      <div>
                        <p className="font-mono font-bold text-zinc-200 uppercase text-xs tracking-wide">{formData.bankName || 'Treasury Node Disconnected'}</p>
                        <p className="text-[8px] font-mono font-bold text-zinc-600 mt-1 uppercase tracking-widest">END RETRIEVAL ID: {formData.accountNumber?.slice(-4) || 'XXXX'}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsEditingBank(true)} className="w-full sm:w-auto px-6 py-3 bg-[#111113] hover:bg-[#18181b] text-zinc-300 border border-zinc-900 rounded-lg font-mono font-bold uppercase text-[9px] tracking-widest transition-colors cursor-pointer">Modify Node</button>
                  </div>
                ) : (
                  <div className="p-6 border border-zinc-900 bg-zinc-950 rounded-xl space-y-5 shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest ml-0.5">Banking Institution</label>
                        <select
                          value={formData.bankCode || ''}
                          onChange={(e) => {
                            const selectedBank = NIGERIAN_BANKS.find((bank) => bank.code === e.target.value);
                            setFormData({
                              ...formData,
                              bankCode: selectedBank?.code,
                              bankName: selectedBank?.name,
                            });
                          }}
                          className="w-full p-3.5 bg-[#111113] border border-zinc-900 rounded-lg text-xs font-mono uppercase text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-700 transition-colors"
                        >
                          <option value="">Select Target Node</option>
                          {NIGERIAN_BANKS.map((bank) => (
                            <option key={bank.code} value={bank.code}>{bank.name}</option>
                          ))}
                        </select>
                      </div>
                      <SettingsInput label="Account Security Number" value={formData.accountNumber} onChange={(v: string) => setFormData({...formData, accountNumber: v})} />
                      <SettingsInput label="Account Signature Identity Name" value={formData.accountName} onChange={(v: string) => setFormData({...formData, accountName: v})} />
                    </div>
                    <button onClick={() => setIsEditingBank(false)} className="bg-[#991B1B] text-white px-8 py-3 rounded-lg font-mono font-bold uppercase text-[9px] tracking-widest hover:bg-[#7f1d1d] transition-colors cursor-pointer">Lock Routing Node</button>
                  </div>
                )}
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg flex gap-4">
                  <ShieldCheck className="text-[#ef4444] shrink-0 mt-0.5" size={16} />
                  <p className="text-[8px] font-mono font-bold text-zinc-500 uppercase leading-relaxed tracking-wider">
                    SECURITY LOCK LOCKOUT: Modifying incoming ledger routes places a mandatory 24-hour verification hold matrix on this account profile. Settlement processes are halted pending system audit confirmations.
                  </p>
                </div>
              </div>
            )}

            {/* KYC and Verification Security Node */}
            {activeTab === 'KYC' && (
              <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                <SectionHeader title="System Audit Status" subtitle="Platform network validation status metrics." />
                <div className={`p-12 rounded-xl border flex flex-col items-center text-center gap-5 ${formData.isVerified ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-900 bg-zinc-950'}`}>
                  {formData.isVerified ? (
                    <div className="w-16 h-16 bg-[#111113] border border-emerald-950 text-emerald-500 rounded-full flex items-center justify-center shadow-xl"><CheckCircle size={28} /></div>
                  ) : (
                    <div className="w-16 h-16 bg-[#111113] border border-[#991B1B]/40 text-[#ef4444] rounded-full flex items-center justify-center shadow-xl"><RefreshCcw className="animate-spin text-[#ef4444]" size={24} /></div>
                  )}
                  <div>
                    <h3 className="text-base font-mono font-bold text-zinc-200 uppercase tracking-wider">{formData.isVerified ? 'CERTIFIED_MERCHANT_NODE' : 'REGISTRY_AUDIT_PENDING'}</h3>
                    <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mt-2 max-w-sm mx-auto leading-relaxed">
                      {formData.isVerified ? 'Your infrastructure validation records match structural policy. System treasury channels are completely operational.' : 'The registry is inspecting your enterprise verification blueprints. Sales pipelines remain open, but distribution routes wait for compliance tokens.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- UTILITY SUB-COMPONENTS --- */

function SectionHeader({ title, subtitle }: any) {
  return (
    <div className="border-l-2 border-[#991B1B] pl-4 mb-6">
      <h3 className="text-sm font-mono font-bold text-zinc-200 tracking-wider uppercase leading-none">{title}</h3>
      <p className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest mt-1.5">{subtitle}</p>
    </div>
  );
}

function SettingsInput({ label, value, onChange, disabled, icon: Icon, prefix }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest ml-0.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />}
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest border-r pr-2 border-zinc-900">{prefix}</span>}
        <input 
          type="text" value={value || ''} disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full py-3.5 ${Icon ? 'pl-10' : (prefix ? 'pl-24' : 'pl-4')} pr-4 bg-[#111113] border border-zinc-900 rounded-lg text-xs font-mono text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-700 transition-colors disabled:opacity-30`}
        />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-5">
      <Loader2 className="animate-spin text-[#991B1B]" size={36} />
      <p className="font-mono font-bold uppercase tracking-[0.3em] text-[9px] text-zinc-500 animate-pulse">Synchronizing_Profile_System_Matrix...</p>
    </div>
  );
}