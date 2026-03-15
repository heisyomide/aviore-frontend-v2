"use client";

import { useState, useEffect } from "react";
import { 
  Settings, Percent, Wallet, Truck, 
  CreditCard, ShieldCheck, Save, Loader2, Info 
} from "lucide-react";
import { api } from "@/src/lib/axios";
import { toast } from "sonner";

export default function PlatformSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    COMMISSION_PCT: "10",
    MIN_PAYOUT: "5000",
    TAX_RATE: "7.5",
    SHIPPING_BASE: "1500"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/admin/settings");
        if (Object.keys(res.data).length > 0) setSettings(res.data);
      } finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (key: string, value: string) => {
    setSaving(true);
    try {
      await api.post("/admin/settings/update", { key, value });
      toast.success(`CONFIG_UPDATED: ${key}`);
    } catch {
      toast.error("UPDATE_FAILURE");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-400 font-sans p-6 lg:p-12">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        <header className="space-y-2 border-b border-zinc-900 pb-10">
          <div className="flex items-center gap-2 text-indigo-500">
            <Settings size={14} className="animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Platform_Governance_v1.0</span>
          </div>
          <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter">Settings</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* FINANCIAL PARAMETERS */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Percent size={18} className="text-indigo-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Revenue_&_Tax_Logic</h3>
            </div>

            <div className="space-y-6">
              <SettingInput 
                label="Marketplace Commission (%)" 
                value={settings.COMMISSION_PCT} 
                onChange={(val: any) => setSettings({...settings, COMMISSION_PCT: val})}
                onSave={() => handleUpdate("COMMISSION_PCT", settings.COMMISSION_PCT)}
                icon={Percent}
              />
              <SettingInput 
                label="Minimum Payout (₦)" 
                value={settings.MIN_PAYOUT} 
                onChange={(val: any) => setSettings({...settings, MIN_PAYOUT: val})}
                onSave={() => handleUpdate("MIN_PAYOUT", settings.MIN_PAYOUT)}
                icon={Wallet}
              />
            </div>
          </section>

          {/* LIVE SIMULATOR */}
          <aside className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-emerald-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Logic_Simulator</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-[11px] uppercase font-bold text-zinc-600">Sample Order: ₦100,000</p>
              <div className="p-6 bg-black rounded-2xl border border-zinc-900 space-y-3">
                <div className="flex justify-between text-xs">
                  <span>Vendor Earnings:</span>
                  <span className="text-white">₦{(100000 * (1 - Number(settings.COMMISSION_PCT)/100)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-indigo-500 font-bold">
                  <span>Platform Cut ({settings.COMMISSION_PCT}%):</span>
                  <span>₦{(100000 * (Number(settings.COMMISSION_PCT)/100)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-2xl flex gap-4">
              <Info className="text-indigo-500 shrink-0" size={20} />
              <p className="text-[10px] leading-relaxed uppercase font-bold italic text-zinc-500">
                Changes to commission and tax rules are applied to all NEW transactions immediately upon authorization.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

function SettingInput({ label, value, onChange, onSave, icon: Icon }: any) {
  return (
    <div className="group space-y-3">
      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-2">{label}</label>
      <div className="flex gap-4">
        <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 flex items-center gap-4 focus-within:border-indigo-500 transition-all">
          <Icon size={16} className="text-zinc-700" />
          <input 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent text-white font-black text-xl w-full outline-none"
          />
        </div>
        <button onClick={onSave} className="bg-white text-black px-6 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
          <Save size={18} />
        </button>
      </div>
    </div>
  );
}