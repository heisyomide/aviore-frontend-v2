'use client';

import { useState, useEffect } from 'react';
import { Bell, Shield, MessageCircle, Info, ShoppingBag, Loader2, Eye, CheckSquare, Radio, CheckCircle2, AlertTriangle } from 'lucide-react';
import { api } from '@/src/lib/axios';

interface NotificationPrefs {
  orderUpdates: boolean;
  promotions: boolean;
  chatMessages: boolean;
  storeActivity: boolean;
  priceDrops: boolean;
  pushEnabled: boolean; // 🌟 Sync matching backend key criteria toggle
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string; // CHAT, ORDER_UPDATES, SYSTEM, SECURITY
  isRead: boolean;
  createdAt: string;
}

export default function VendorNotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [feed, setFeed] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  // 🌟 Push Activation Management HUD States
  const [pushPermission, setPushPermission] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [syncingDevice, setSyncingDevice] = useState(false);

  useEffect(() => {
    // Check initial layout browser capabilities matrix
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setPushPermission('unsupported');
    } else {
      setPushPermission(Notification.permission);
    }

    Promise.all([fetchPrefs(), fetchFeed(), fetchUnreadCount()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const fetchPrefs = async () => {
    try {
      const res = await api.get('/notifications/settings');
      setPrefs(res.data);
      
      // Auto-reconnect device credentials silently if they are verified on the lockscreen layer
      if (Notification.permission === 'granted' && res.data.pushEnabled) {
        navigator.serviceWorker.ready.then((reg) => syncPushDeviceToken(reg));
      }
    } catch (err) {
      console.error("Failed to fetch vendor settings:", err);
    }
  };

  const fetchFeed = async () => {
    try {
      const res = await api.get('/notifications/feed');
      setFeed(res.data);
    } catch (err) {
      console.error("Failed to fetch vendor notification feed:", err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch vendor unread count:", err);
    }
  };

  // 🌟 HELPER: Binary Parser Configuration Conversion
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // 🌟 CORE PIPELINE: Intercepts browser hooks and maps straight to NestJS
  const syncPushDeviceToken = async (registration: ServiceWorkerRegistration) => {
    try {
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) {
          console.warn("VAPID baseline key payload unconfigured inside environment.");
          return;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
      }

      // Registers device endpoint matching your update controller endpoint criteria 
      await api.post('/notifications/subscribe', subscription);
    } catch (err) {
      console.error("Backend subscription pipeline registration failed:", err);
      throw err;
    }
  };

  // 🌟 MANUAL INTERACTION CLICK EVENT (Required by Apple Guidelines)
  const handleEnablePushAlerts = async () => {
    if (pushPermission === 'unsupported') {
      alert("Realtime hardware push architecture is unsupported inside this browser runtime profile.");
      return;
    }

    setSyncingDevice(true);
    try {
      const status = await Notification.requestPermission();
      setPushPermission(status);

      if (status === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        await syncPushDeviceToken(registration);
        
        // Explicitly set matching system toggle on for synchronization mapping consistency
        if (prefs && !prefs.pushEnabled) {
          await updateToggle('pushEnabled', true);
        }
      } else {
        alert("Permission denied. Reset alerts using iPhone Settings -> Safari -> Advanced -> Feature Flags if nested.");
      }
    } catch (err) {
      console.error("Hardware synchronization failed:", err);
      alert("Could not register device to live broadcast routing gateways.");
    } finally {
      setSyncingDevice(false);
    }
  };

  const updateToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    if (!prefs) return;
    setSaving(true);
    try {
      const newPrefs = { ...prefs, [key]: value };
      setPrefs(newPrefs);
      await api.patch('/notifications/settings', { [key]: value });

      // If user toggles hardware layer manually, check device validation layers match
      if (key === 'pushEnabled' && value && pushPermission !== 'granted') {
        handleEnablePushAlerts();
      }
    } catch (err) {
      console.error("Failed to save vendor preference:", err);
      fetchPrefs();
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setActionId(id);
    try {
      setFeed(prev => prev.map(item => item.id === id ? { ...item, isRead: true } : item));
      setUnreadCount(prev => Math.max(0, prev - 1));
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark message as read:", err);
      fetchFeed();
      fetchUnreadCount();
    } finally {
      setActionId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setFeed(prev => prev.map(item => ({ ...item, isRead: true })));
      setUnreadCount(0);
      await api.patch('/notifications/read-all');
    } catch (err) {
      console.error("Failed to mark all vendor items as read:", err);
      fetchFeed();
      fetchUnreadCount();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] gap-4">
        <Loader2 className="animate-spin text-[#991b1b]" size={28} />
        <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-mono">Syncing Core Store Ledgers...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 p-6 md:p-10 min-h-screen bg-[#0d0d0d] text-zinc-100 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">Store Notifications</h1>
          <p className="text-zinc-500 text-xs mt-1 font-medium uppercase tracking-wider">Manage marketplace channels and inbound log routing</p>
        </div>
        {saving && (
          <span className="text-[9px] font-bold tracking-widest text-[#991b1b] uppercase animate-pulse font-mono mb-1">
            Commit_Ledger_Delta...
          </span>
        )}
      </div>

      {/* 🌟 NEW HARDWARE SYNC HUD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-[#111113] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-xs font-bold tracking-widest text-zinc-400 uppercase font-mono flex items-center gap-2">
              <Radio size={12} className={pushPermission === 'granted' ? 'text-emerald-500 animate-pulse' : 'text-zinc-600'} />
              Hardware Lockscreen Interceptor
            </h4>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              Enable low-overhead, native system background message listeners. Allows incoming transmissions to securely wake up your phone viewport context even when the web application is fully closed.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {pushPermission !== 'granted' ? (
              <button
                type="button"
                onClick={handleEnablePushAlerts}
                disabled={syncingDevice}
                className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-widest transition-all font-mono flex items-center gap-2 cursor-pointer focus:outline-none"
              >
                {syncingDevice && <Loader2 size={12} className="animate-spin" />}
                Authorize Live Connection
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-900/60 text-emerald-400 text-[10px] font-mono font-bold tracking-widest px-3 py-1.5 rounded-lg uppercase">
                <CheckCircle2 size={12} />
Ecosystem Transmissions Active
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#111113] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-1">
            <h4 className="text-xs font-bold tracking-widest text-zinc-400 uppercase font-mono">Gateway Status</h4>
            <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">Telemetry Diagnostic Core</p>
          </div>
          
          <div className="space-y-2 pt-4 border-t border-zinc-900/80">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-zinc-500 uppercase">System Sync:</span>
              <span className={pushPermission === 'granted' ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                {pushPermission.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-zinc-500 uppercase">Database Link:</span>
              <span className={prefs?.pushEnabled ? 'text-emerald-500 font-bold' : 'text-zinc-600'}>
                {prefs?.pushEnabled ? 'CONNECTED' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CHANNELS CONFIGURATION TOGGLES */}
      {prefs && (
        <div className="space-y-4">
          <div className="bg-[#111113] border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 bg-zinc-950 border-b border-zinc-900 flex items-center gap-2.5">
              <Bell size={14} className="text-zinc-500" />
              <h3 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase font-mono">Channel Routing Directives</h3>
            </div>
            <div className="divide-y divide-zinc-900/60">
              <VendorRow label="Order Transactions" sub="Real-time distribution metrics, status routing changes, and payload confirmations." checked={prefs.orderUpdates} onChange={(val) => updateToggle('orderUpdates', val)} />
              <VendorRow label="Customer Communication" sub="Direct secure pipeline messaging alerts generated from downstream buyer sockets." checked={prefs.chatMessages} onChange={(val) => updateToggle('chatMessages', val)} />
              <VendorRow label="Store Activity Metrics" sub="Inventory margin ceilings, continuous payout logs, and analytical framework status changes." checked={prefs.storeActivity} onChange={(val) => updateToggle('storeActivity', val)} />
              {/* 🌟 INJECTED MASTER HARDWARE SWITCH FOR CONFIGURATION PARITY */}
              <VendorRow label="System Hardware Alerts" sub="Master pipeline driver required to trigger real-time device screen notifications." checked={prefs.pushEnabled} onChange={(val) => updateToggle('pushEnabled', val)} />
            </div>
          </div>
        </div>
      )}

      {/* VENDOR INBOX TIMELINE HISTORY */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3 px-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase font-mono">Telemetry Log Stream</h2>
            {unreadCount > 0 && (
              <span className="bg-[#991b1b] text-zinc-100 text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-sm">
                {unreadCount} PENDING
              </span>
            )}
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer font-mono"
            >
              <CheckSquare size={12} />
              Flush Pending Stream
            </button>
          )}
        </div>

        {feed.length === 0 ? (
          <div className="bg-[#111113] rounded-2xl border border-zinc-900 p-20 text-center flex flex-col items-center justify-center gap-3 shadow-xl">
            <Bell size={32} strokeWidth={1} className="text-zinc-800 mb-2" />
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase font-mono">Operational queue clear.</p>
            <p className="text-zinc-600 text-[11px] max-w-xs leading-relaxed uppercase tracking-wide font-medium">No real-time network triggers inside current runtime layer.</p>
          </div>
        ) : (
          <div className="bg-[#111113] rounded-2xl border border-zinc-900 overflow-hidden shadow-xl divide-y divide-zinc-900/60">
            {feed.map((item) => (
              <div 
                key={item.id} 
                className={`p-5 flex items-start justify-between gap-6 transition-all ${!item.isRead ? 'bg-zinc-950/60' : 'hover:bg-zinc-950/40'}`}
              >
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <VendorCategoryIcon category={item.type} isRead={item.isRead} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <p className={`text-sm tracking-wide uppercase ${!item.isRead ? 'font-medium text-white' : 'font-light text-zinc-400'}`}>
                        {item.title}
                      </p>
                      {!item.isRead && <span className="w-1.5 h-1.5 bg-[#991b1b] rounded-full shrink-0" />}
                    </div>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-3xl">{item.message}</p>
                    <p className="text-[10px] text-zinc-600 font-mono font-bold uppercase tracking-wider pt-0.5">
                      {new Date(item.createdAt).toLocaleDateString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    disabled={actionId === item.id}
                    className="shrink-0 p-2 bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-zinc-500 hover:text-white rounded-lg transition-all focus:outline-none cursor-pointer"
                    title="Acknowledge item log"
                  >
                    {actionId === item.id ? (
                      <Loader2 size={12} className="animate-spin text-zinc-400" />
                    ) : (
                      <Eye size={12} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* --- MONOCHROMATIC CONTEXT VECTOR DIRECTIVE --- */
function VendorCategoryIcon({ category, isRead }: { category: string; isRead: boolean }) {
  const baseStyle = `w-8 h-8 rounded-lg shrink-0 border flex items-center justify-center transition-all`;
  const unread = !isRead;

  switch (category) {
    case 'SECURITY':
      return (
        <div className={`${baseStyle} ${unread ? 'bg-zinc-950 border-[#991b1b]/30 text-[#ef4444]' : 'bg-zinc-950 border-zinc-900 text-zinc-700'}`}>
          <Shield size={13} />
        </div>
      );
    case 'CHAT':
      return (
        <div className={`${baseStyle} ${unread ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-950 border-zinc-900 text-zinc-700'}`}>
          <MessageCircle size={13} />
        </div>
      );
    case 'ORDER_UPDATES':
    case 'ORDERUPDATES':
      return (
        <div className={`${baseStyle} ${unread ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-950 border-zinc-900 text-zinc-700'}`}>
          <ShoppingBag size={13} />
        </div>
      );
    default:
      return (
        <div className={`${baseStyle} ${unread ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-950 border-zinc-900 text-zinc-700'}`}>
          <Info size={13} />
        </div>
      );
  }
}

/* --- PREMIUM INTERFACE ROW ENTRY --- */
function VendorRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="p-5 flex justify-between items-center hover:bg-zinc-950/30 transition-colors">
      <div className="pr-6 space-y-1">
        <p className="text-xs font-medium tracking-wider text-zinc-200 uppercase">{label}</p>
        <p className="text-xs text-zinc-500 font-light max-w-2xl leading-relaxed">{sub}</p>
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-9 h-5 rounded-full transition-all relative border focus:outline-none cursor-pointer ${checked ? 'bg-[#991b1b] border-[#991b1b]' : 'bg-zinc-950 border-zinc-800'}`}
      >
        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${checked ? 'left-5' : 'left-1'}`} />
      </button>
    </div>
  );
}