'use client';

import { useState, useEffect } from 'react';
import { 
  Save, Store, Truck, Landmark, ShieldCheck, Loader2, 
  User, Mail, BadgeCheck, CheckCircle, AlertCircle 
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Store');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isEditingBank, setIsEditingBank] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/vendor/settings/full-profile');
      setFormData(res.data);
    } catch (e) {
      toast.error("Failed to load settings registry.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch('/vendor/settings/update', formData);
      toast.success("Settings updated successfully!");
    } catch (e) {
      toast.error("Update failed. Verify node inputs.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !formData) return <LoadingState />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-8 animate-in fade-in duration-500 pb-20">
      
      {/* 1. COMPACT HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg relative">
            <Store size={20} />
            {formData.isVerified && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                <BadgeCheck size={10} fill="currentColor" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">
                {formData.storeName || 'My Store'}
              </h1>
              {formData.isVerified && <BadgeCheck className="text-blue-500" size={18} />}
            </div>
            <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mt-1.5 italic">
              aviore.com/store/{formData.slug}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-md disabled:bg-slate-200 flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} strokeWidth={3} />}
          {isSaving ? 'Updating...' : 'Save All Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* 2. ADAPTIVE NAVIGATION (Horizontal on Mobile) */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          {[
            { id: 'Store', label: 'Identity', icon: User },
            { id: 'Logistics', label: 'Shipping', icon: Truck },
            { id: 'Bank', label: 'Settlements', icon: Landmark },
            { id: 'KYC', label: 'Compliance', icon: ShieldCheck },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 lg:flex-none flex items-center gap-3 px-5 py-4 rounded-xl transition-all whitespace-nowrap border-2 ${
                activeTab === tab.id ? 'bg-white border-orange-500 text-slate-900 shadow-md' : 'text-slate-400 border-transparent hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} strokeWidth={activeTab === tab.id ? 3 : 2} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 3. CONTENT AREA */}
        <div className="lg:col-span-3 bg-white p-6 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm min-h-[450px]">
          
          {/* Identity Tab */}
          {activeTab === 'Store' && (
            <div className="space-y-6 animate-in slide-in-from-right-2">
              <SectionHeader title="Owner & Store Profile" subtitle="Your public-facing business identity." />
              <div className="grid md:grid-cols-2 gap-5">
                <SettingsInput label="Owner Full Name" value={formData.ownerName} disabled icon={User} />
                <SettingsInput label="Business Email" value={formData.email} disabled icon={Mail} />
                <SettingsInput 
                    label="Store Display Name" 
                    value={formData.storeName} 
                    onChange={(v: any) => setFormData({...formData, storeName: v})}
                />
                <SettingsInput 
                    label="Store URL Slug" 
                    value={formData.slug} 
                    prefix="aviore.com/"
                    onChange={(v: any) => setFormData({...formData, slug: v})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Narrative (About Us)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-5 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-2xl text-xs font-bold text-slate-800 outline-none transition-all h-32 resize-none"
                  placeholder="Describe your brand to your customers..."
                />
              </div>
            </div>
          )}

          {/* Logistics Tab */}
          {activeTab === 'Logistics' && (
            <div className="space-y-6 animate-in slide-in-from-right-2">
              <SectionHeader title="Checkout Logistics" subtitle="Shipping fees will automatically apply at checkout." />
              <div className="max-w-xs p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <p className="text-[9px] font-black text-slate-400 uppercase">Flat Shipping Fee</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₦</span>
                  <input 
                    type="number"
                    value={formData.shippingFee}
                    onChange={(e) => setFormData({...formData, shippingFee: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-black text-sm text-slate-900 outline-none focus:border-orange-600 transition-all"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-[9px] font-bold text-orange-600 uppercase italic">
                  {Number(formData.shippingFee) > 0 ? "Fee applied to all orders" : "Standard shipping is FREE"}
                </p>
              </div>
            </div>
          )}

          {/* Settlements Tab */}
          {activeTab === 'Bank' && (
            <div className="space-y-6 animate-in slide-in-from-right-2">
              <SectionHeader title="Settlement Details" subtitle="Where your Aviore earnings will be sent." />
              
              {!isEditingBank ? (
                <div className="p-6 border-2 border-slate-50 rounded-2xl flex flex-col sm:flex-row justify-between items-center bg-white group hover:border-orange-100 transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 uppercase text-[11px] tracking-tight">{formData.bankName || 'No Bank Linked'}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        {formData.accountNumber ? `**** ${formData.accountNumber.slice(-4)}` : 'Setup settlement account'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsEditingBank(true)} className="w-full sm:w-auto px-6 py-2.5 bg-slate-50 text-slate-900 rounded-lg font-black uppercase text-[9px] tracking-widest hover:bg-orange-600 hover:text-white transition-all">Edit Details</button>
                </div>
              ) : (
                <div className="p-6 border-2 border-orange-100 rounded-3xl bg-orange-50/10 space-y-5 animate-in zoom-in-95">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Bank</label>
                      <select 
                        value={formData.bankName || ""}
                        onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-800 outline-none focus:border-orange-500 transition-all"
                      >
                        <option value="">Select Financial Institution</option>
                        <option value="GTBank">Guaranty Trust Bank</option>
                        <option value="Zenith">Zenith Bank</option>
                        <option value="Kuda">Kuda Microfinance</option>
                      </select>
                    </div>
                    <SettingsInput label="Account Number" placeholder="10-digit NUBAN" value={formData.accountNumber} onChange={(v: string) => setFormData({...formData, accountNumber: v})} />
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsEditingBank(false)} className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">Cancel</button>
                    <button onClick={() => setIsEditingBank(false)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-orange-600 transition-all shadow-lg">Confirm & Lock</button>
                  </div>
                </div>
              )}

              <div className="p-5 bg-slate-900 rounded-2xl flex gap-4">
                <ShieldCheck className="text-orange-500 shrink-0 mt-0.5" size={16} />
                <p className="text-[8px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest italic">
                  To protect your funds, bank detail changes are logged. Payouts may be temporarily restricted for 24 hours after an account update for security purposes.
                </p>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'KYC' && (
            <div className="space-y-6 animate-in slide-in-from-right-2">
              <SectionHeader title="KYC Verification" subtitle="Real-time status of your legal documentation." />
              <div className={`p-8 rounded-[2rem] border-2 flex flex-col items-center text-center gap-4 ${formData.isVerified ? 'border-emerald-50 bg-emerald-50/20' : 'border-orange-50 bg-orange-50/20'}`}>
                {formData.isVerified ? (
                  <>
                    <CheckCircle className="text-emerald-500" size={40} strokeWidth={3} />
                    <h3 className="text-lg font-black text-emerald-700 uppercase tracking-tight">Verified Account</h3>
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest max-w-xs leading-relaxed">
                      Your CAC and ID documents have been approved. You have full access to payouts.
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-orange-500 animate-pulse" size={40} strokeWidth={3} />
                    <h3 className="text-lg font-black text-orange-700 uppercase tracking-tight">Verification Pending</h3>
                    <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest max-w-xs leading-relaxed">
                      Our admin team is currently reviewing your documents. Payouts are temporarily held.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* SUB-COMPONENTS */

function SectionHeader({ title, subtitle }: any) {
  return (
    <div className="border-l-2 border-orange-500 pl-4 mb-6">
      <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">{title}</h3>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{subtitle}</p>
    </div>
  );
}

function SettingsInput({ label, value, onChange, disabled, icon: Icon, prefix, placeholder }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={14} />}
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase tracking-widest border-r pr-3 border-slate-100">{prefix}</span>}
        <input 
          type="text" 
          value={value || ''}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full py-3.5 ${Icon ? 'pl-10' : (prefix ? 'pl-24' : 'pl-4')} pr-4 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-xl text-xs font-bold text-slate-800 outline-none transition-all disabled:opacity-50`}
        />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-600" size={32} />
      <p className="font-black uppercase tracking-[0.3em] text-[9px] text-slate-400 italic">Synchronizing_Registry...</p>
    </div>
  );
}