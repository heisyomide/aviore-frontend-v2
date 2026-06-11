'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Save, Store, Truck, Landmark, ShieldCheck, Loader2, 
  User, Mail, BadgeCheck, CheckCircle, AlertCircle, RefreshCcw, Globe, Zap
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

  // 🚀 UNIFIED DATA FETCH ENGINE
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
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10 animate-in fade-in duration-500">
      
      {/* 🚀 EXECUTIVE HUB HEADER */}
      <div className="p-6 lg:p-10 space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#1E293B] rounded-2xl flex items-center justify-center text-white shadow-2xl relative shrink-0">
              <Store size={28} className="text-blue-500" />
              {formData.isVerified && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 border-4 border-white">
                  <BadgeCheck size={12} fill="currentColor" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                {formData.storeName || 'Registry Node'}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2 italic">
                <Globe size={10} /> aviore.com/store/{formData.slug}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full lg:w-auto bg-[#1E293B] text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-3"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isSaving ? 'Updating Registry...' : 'Commit Changes'}
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* 📱 ADAPTIVE TABS (Horizontal Scroll on Mobile) */}
          <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            {[
              { id: 'Store', label: 'Identity', icon: User },
              { id: 'Logistics', label: 'Parameters', icon: Truck },
              { id: 'Bank', label: 'Treasury', icon: Landmark },
              { id: 'KYC', label: 'Security', icon: ShieldCheck },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 lg:flex-none flex items-center gap-3 px-6 py-4 rounded-2xl transition-all border-2 shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-white border-blue-600 text-slate-900 shadow-lg' 
                    : 'text-slate-400 border-transparent hover:bg-white/50'
                }`}
              >
                <tab.icon size={18} strokeWidth={activeTab === tab.id ? 3 : 2} className={activeTab === tab.id ? 'text-blue-600' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 📄 CONTENT MODULE */}
          <div className="lg:col-span-9 bg-white p-6 lg:p-12 rounded-[2.5rem] lg:rounded-4xl shadow-sm border border-slate-100 min-h-[550px]">
            
            {/* Identity Node */}
            {activeTab === 'Store' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <SectionHeader title="Store Architecture" subtitle="Manage your public network identity." />
                <div className="grid md:grid-cols-2 gap-6">
                  <SettingsInput label="Authorized Owner" value={formData.ownerName} disabled icon={User} />
                  <SettingsInput label="Network Endpoint" value={formData.email} disabled icon={Mail} />
                  <SettingsInput label="Alias Registry Name" value={formData.storeName} onChange={(v: string) => setFormData({...formData, storeName: v})} />
                  <SettingsInput label="URL Slug ID" value={formData.slug} prefix="aviore.com/" onChange={(v: string) => setFormData({...formData, slug: v})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Manifest (Description)</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-6 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white rounded-3xl text-[13px] font-bold text-slate-900 outline-none transition-all h-44 resize-none shadow-inner"
                    placeholder="Briefly describe your merchant mission..."
                  />
                </div>
              </div>
            )}

            {/* Logistics Node */}
            {activeTab === 'Logistics' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <SectionHeader title="Fulfillment Matrix" subtitle="Global shipping fee protocols." />
                <div className="max-w-sm p-8 bg-[#1E293B] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000" />
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Flat Logistics Rate</p>
                  <div className="relative group-focus-within:scale-105 transition-transform">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-lg">₦</span>
                    <input 
                      type="number"
                      value={formData.shippingFee}
                      onChange={(e) => setFormData({...formData, shippingFee: e.target.value})}
                      className="w-full pl-12 pr-6 py-5 bg-slate-800 border border-slate-700 rounded-2xl font-black text-xl text-white outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-6 italic">
                    {Number(formData.shippingFee) > 0 ? "PROTOCOL ACTIVE: USER PAYS" : "GLOBAL FREE DELIVERY ACTIVE"}
                  </p>
                </div>
              </div>
            )}

            {/* Treasury Node */}
            {activeTab === 'Bank' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <SectionHeader title="Settlement Hub" subtitle="Authorized inbound liquidity nodes." />
                {!isEditingBank ? (
                  <div className="p-8 border-2 border-slate-50 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-center bg-slate-50/30 hover:border-blue-100 transition-all gap-6 group">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-[#1E293B] text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Landmark size={24} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 uppercase text-sm italic tracking-tighter">{formData.bankName || 'Node Unlinked'}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">ENDS IN: {formData.accountNumber?.slice(-4) || 'XXXX'}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsEditingBank(true)} className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-black uppercase text-[10px] hover:bg-blue-600 hover:text-white transition-all">Modify Bank</button>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-blue-100 rounded-4xl bg-blue-50/10 space-y-6 animate-in zoom-in-95">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution</label>
<select
  value={formData.bankCode || ''}
  onChange={(e) => {
    const selectedBank = NIGERIAN_BANKS.find(
      (bank) => bank.code === e.target.value
    );

    setFormData({
      ...formData,
      bankCode: selectedBank?.code,
      bankName: selectedBank?.name,
    });
  }}
  className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase text-slate-900 outline-none focus:border-blue-600 transition-all"
>
  <option value="">Choose Bank</option>

  {NIGERIAN_BANKS.map((bank) => (
    <option
      key={bank.code}
      value={bank.code}
    >
      {bank.name}
    </option>
  ))}
</select>
                      </div>
                      <SettingsInput label="Account Number" value={formData.accountNumber} onChange={(v: string) => setFormData({...formData, accountNumber: v})} />
                        <SettingsInput
  label="Account Name"
  value={formData.accountName}
  onChange={(v: string) =>
    setFormData({
      ...formData,
      accountName: v,
    })
  }
/>
                    </div>
                    <button onClick={() => setIsEditingBank(false)} className="bg-[#1E293B] text-white px-12 py-4 rounded-xl font-black uppercase text-[10px] hover:bg-blue-600 transition-all shadow-xl">Confirm Registry Update</button>
                  </div>
                )}
                <div className="p-6 bg-blue-600/5 border border-blue-100 rounded-3xl flex gap-5">
                   <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={20} />
                   <p className="text-[10px] font-bold text-blue-900 uppercase leading-relaxed italic opacity-70">
                     Security Lock: Modifying treasury nodes triggers a 24-hour verification hold. Registry payouts are suspended during the audit cycle.
                   </p>
                </div>
              </div>
            )}

            {activeTab === 'KYC' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <SectionHeader title="Verification Status" subtitle="Fulfillment network security audit." />
                <div className={`p-16 rounded-[3.5rem] border-2 flex flex-col items-center text-center gap-6 ${formData.isVerified ? 'border-emerald-100 bg-emerald-50/20' : 'border-blue-100 bg-blue-50/20'}`}>
                  {formData.isVerified ? (
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-emerald-500 animate-in zoom-in-50"><CheckCircle className="text-emerald-500" size={48} strokeWidth={3} /></div>
                  ) : (
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-500"><RefreshCcw className="text-blue-500 animate-spin-slow" size={48} strokeWidth={3} /></div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{formData.isVerified ? 'Certified Vendor' : 'Audit Pending'}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-xs mx-auto leading-relaxed">
                      {formData.isVerified ? 'Your business credentials have been indexed. Access to all treasury protocols is granted.' : 'The registry is currently auditing your documentation. Platform discovery is active, but settlements are on standby.'}
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

/* 🎨 SUB-COMPONENTS */

function SectionHeader({ title, subtitle }: any) {
  return (
    <div className="border-l-4 border-blue-600 pl-6 mb-8">
      <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{title}</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5">{subtitle}</p>
    </div>
  );
}

function SettingsInput({ label, value, onChange, disabled, icon: Icon, prefix }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />}
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r pr-3 border-slate-100">{prefix}</span>}
        <input 
          type="text" value={value || ''} disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full py-4 ${Icon ? 'pl-11' : (prefix ? 'pl-24' : 'pl-5')} pr-5 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white rounded-2xl text-[13px] font-bold text-slate-900 outline-none transition-all disabled:opacity-40 shadow-inner`}
        />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400 italic">Synchronizing_Identity_Registry...</p>
    </div>
  );
}