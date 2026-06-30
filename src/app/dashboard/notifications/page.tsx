'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, MessageSquare, Loader2, CheckCircle, Activity } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

interface NotificationPrefs {
  orderUpdates: boolean;
  promotions: boolean;
  chatMessages: boolean;
  storeActivity: boolean;
  priceDrops: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/notifications');
      setPrefs(res.data);
    } catch (err) {
      console.error("Failed to fetch notification settings:", err);
      toast.error("Error", { description: "Failed to load notification preferences." });
    } finally {
      setLoading(false);
    }
  };

  const updateToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    if (!prefs) return;
    
    setSaving(true);
    try {
      // Optimistic Update
      const newPrefs = { ...prefs, [key]: value };
      setPrefs(newPrefs);
      
      await api.patch('/user/notifications', { [key]: value });
    } catch (err) {
      toast.error("Sync Error", { description: "Failed to update preference. Reverting..." });
      fetchPrefs(); // Revert to server state on failure
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center animate-in fade-in duration-300">
        <Loader2 className="animate-spin text-[#A4143D]" size={28} />
      </div>
    );
  }

  if (!prefs) return null;

  return (
    <div className="min-h-screen bg-white space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* 1. PREMIUM HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Activity size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Communication Registry</span>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
            Notification <span className="text-zinc-300 font-medium">Preferences</span>
          </h1>
        </div>
        {saving && (
          <span className="text-[10px] font-bold text-[#A4143D] uppercase tracking-wider bg-red-50 px-3 py-1 rounded-md animate-pulse">
            Saving changes...
          </span>
        )}
      </header>

      {/* 2. ACTIVITY ALERTS LOG */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden divide-y divide-zinc-100">
        <div className="p-5 bg-zinc-50/50 flex items-center gap-2 border-b border-zinc-100">
          <Bell size={16} className="text-[#A4143D]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Activity Alerts</h3>
        </div>
        
        <NotificationRow 
          label="Order Updates" 
          sub="Status changes, tracking logs, and checkout receipts."
          checked={prefs.orderUpdates} 
          onChange={(val: boolean) => updateToggle('orderUpdates', val)} 
        />

        <NotificationRow 
          label="Promotions" 
          sub="Exclusive discounts, seasonal product launches, and coupons."
          checked={prefs.promotions} 
          onChange={(val: boolean) => updateToggle('promotions', val)} 
        />

        <NotificationRow 
          label="Chat Messages" 
          sub="Direct messages from independent vendors or support nodes."
          checked={prefs.chatMessages} 
          onChange={(val: boolean) => updateToggle('chatMessages', val)} 
        />
      </div>

      {/* 3. DELIVERY CHANNELS GRID */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Delivery Channels</h3>
          <p className="text-xs text-zinc-400">Select the dynamic endpoints where you want alerts delivered.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DeliveryCard 
            icon={<Mail size={18}/>} 
            label="Email" 
            active={prefs.emailEnabled} 
            onClick={() => updateToggle('emailEnabled', !prefs.emailEnabled)} 
          />
          <DeliveryCard 
            icon={<MessageSquare size={18}/>} 
            label="SMS Protocol" 
            active={prefs.smsEnabled} 
            onClick={() => updateToggle('smsEnabled', !prefs.smsEnabled)} 
          />
          <DeliveryCard 
            icon={<Smartphone size={18}/>} 
            label="Push Terminal" 
            active={prefs.pushEnabled} 
            onClick={() => updateToggle('pushEnabled', !prefs.pushEnabled)} 
          />
        </div>
      </div>
    </div>
  );
}

// --- Internal View Components ---

interface RowProps {
  label: string;
  sub: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function NotificationRow({ label, sub, checked, onChange }: RowProps) {
  return (
    <div className="p-6 flex justify-between items-center bg-white hover:bg-zinc-50/30 transition-colors">
      <div className="pr-4 space-y-0.5">
        <p className="text-xs font-bold text-zinc-900 uppercase tracking-tight">{label}</p>
        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{sub}</p>
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-11 h-6 rounded-full transition-all relative outline-none focus:ring-1 focus:ring-zinc-300 ${
          checked ? 'bg-[#A4143D]' : 'bg-zinc-200'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${
          checked ? 'left-6' : 'left-1'
        }`} />
      </button>
    </div>
  );
}

interface DeliveryCardProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function DeliveryCard({ icon, label, active, onClick }: DeliveryCardProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group ${
        active 
          ? 'border-[#A4143D] bg-white text-[#A4143D]' 
          : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-400 hover:text-zinc-900'
      }`}
    >
      <div className="transition-transform group-active:scale-95">
        {icon}
      </div>
      <span className="font-bold text-xs uppercase tracking-wider">{label}</span>
      <div className={`h-4 transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`}>
        <CheckCircle size={14} className="text-[#A4143D]" />
      </div>
    </button>
  );
}