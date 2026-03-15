'use client';
import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { api } from '@/src/lib/axios';

// Define a proper interface for your notification settings
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
      alert("Failed to save preference. Reverting...");
      fetchPrefs(); // Revert to server state on failure
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-500" size={32} />
        <p className="text-gray-500 font-medium">Loading preferences...</p>
      </div>
    );
  }

  if (!prefs) return null;

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500 p-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-1">Control how Aviorè contacts you.</p>
        </div>
        {saving && (
          <span className="text-[10px] font-bold text-orange-500 uppercase animate-pulse mb-1">
            Saving changes...
          </span>
        )}
      </div>

      {/* Preferences Section - Activities */}
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        <div className="p-6 bg-gray-50/50 flex items-center gap-2">
          <Bell size={18} className="text-orange-500" />
          <h3 className="font-bold text-gray-900">Activity Alerts</h3>
        </div>
        
        <NotificationRow 
          label="Order Updates" 
          sub="Status changes, tracking, and receipts"
          checked={prefs.orderUpdates} 
          onChange={(val: boolean) => updateToggle('orderUpdates', val)} 
        />

        <NotificationRow 
          label="Promotions" 
          sub="Discounts, seasonal sales, and coupons"
          checked={prefs.promotions} 
          onChange={(val: boolean) => updateToggle('promotions', val)} 
        />

        <NotificationRow 
          label="Chat Messages" 
          sub="Direct messages from vendors or support"
          checked={prefs.chatMessages} 
          onChange={(val: boolean) => updateToggle('chatMessages', val)} 
        />
      </div>

      {/* Delivery Methods Section */}
      <div className="bg-white rounded-4xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Delivery Channels</h3>
          <p className="text-xs text-gray-500">Choose where you want to receive the alerts above.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DeliveryCard 
            icon={<Mail size={20}/>} 
            label="Email" 
            active={prefs.emailEnabled} 
            onClick={() => updateToggle('emailEnabled', !prefs.emailEnabled)} 
          />
          <DeliveryCard 
            icon={<MessageSquare size={20}/>} 
            label="SMS" 
            active={prefs.smsEnabled} 
            onClick={() => updateToggle('smsEnabled', !prefs.smsEnabled)} 
          />
          <DeliveryCard 
            icon={<Smartphone size={20}/>} 
            label="Push" 
            active={prefs.pushEnabled} 
            onClick={() => updateToggle('pushEnabled', !prefs.pushEnabled)} 
          />
        </div>
      </div>
    </div>
  );
}

// --- Internal Components ---

interface RowProps {
  label: string;
  sub: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function NotificationRow({ label, sub, checked, onChange }: RowProps) {
  return (
    <div className="p-6 flex justify-between items-center hover:bg-gray-50/30 transition-colors">
      <div className="pr-4">
        <p className="font-bold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{sub}</p>
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-orange-500' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${checked ? 'left-7' : 'left-1'}`} />
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
      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group ${
        active 
          ? 'border-orange-500 bg-orange-50 text-orange-600' 
          : 'border-gray-100 bg-white text-gray-400 grayscale hover:grayscale-0 hover:border-gray-200'
      }`}
    >
      <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
        {icon}
      </div>
      <span className="font-bold text-sm tracking-tight">{label}</span>
      <div className={`h-5 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>
        <CheckCircle size={16} className="fill-orange-500 text-white" />
      </div>
    </button>
  );
}