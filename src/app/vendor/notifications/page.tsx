'use client';
import { useState, useEffect } from 'react';
import { Bell, Shield, MessageCircle, Info, ShoppingBag, Loader2, Eye, CheckSquare } from 'lucide-react';
import { api } from '@/src/lib/axios';

interface NotificationPrefs {
  orderUpdates: boolean;
  promotions: boolean;
  chatMessages: boolean;
  storeActivity: boolean;
  priceDrops: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string; // Maps to 'CHAT', 'ORDER_UPDATES', 'SYSTEM', 'SECURITY'
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

  useEffect(() => {
    // Concurrent execution pipeline fetching vendor metrics
    Promise.all([fetchPrefs(), fetchFeed(), fetchUnreadCount()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const fetchPrefs = async () => {
    try {
      const res = await api.get('/notifications/settings');
      setPrefs(res.data);
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

  const updateToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    if (!prefs) return;
    setSaving(true);
    try {
      const newPrefs = { ...prefs, [key]: value };
      setPrefs(newPrefs);
      await api.patch('/notifications/settings', { [key]: value });
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
      <div className="py-32 flex flex-col items-center justify-center gap-4 bg-[#0a0a0a] min-h-screen text-white">
        <Loader2 className="animate-spin text-[#991b1b]" size={28} />
        <p className="text-zinc-400 text-xs tracking-widest uppercase font-light">Loading Store Ledger Configurations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12 p-6 md:p-10 min-h-screen bg-[#0a0a0a] text-zinc-100 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl font-light tracking-widest text-white uppercase">Store Notifications</h1>
          <p className="text-zinc-500 text-xs mt-1 font-light">Manage your marketplace hub channels and inbound transactional activity logs.</p>
        </div>
        {saving && (
          <span className="text-[10px] font-medium tracking-wider text-[#991b1b] uppercase animate-pulse mb-1">
            Updating ledger...
          </span>
        )}
      </div>

      {/* CHANNELS CONFIGURATION TOGGLES */}
      {prefs && (
        <div className="space-y-4">
          <div className="bg-[#121212] rounded-xl border border-zinc-900 overflow-hidden divide-y divide-zinc-900/60">
            <div className="p-4 bg-[#161616] flex items-center gap-2 border-b border-zinc-900">
              <Bell size={15} className="text-zinc-400" />
              <h3 className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">Operational Alerts</h3>
            </div>
            <VendorRow label="Order Transactions" sub="Real-time placement alerts, tracking request updates, and customer receipts" checked={prefs.orderUpdates} onChange={(val) => updateToggle('orderUpdates', val)} />
            <VendorRow label="Customer Communication" sub="Direct instant inquiry inquiries from buyers or support operators" checked={prefs.chatMessages} onChange={(val) => updateToggle('chatMessages', val)} />
            <VendorRow label="Store Activity Metrics" sub="Inventory threshholds, payout alerts, and analytical store events" checked={prefs.storeActivity} onChange={(val) => updateToggle('storeActivity', val)} />
          </div>
        </div>
      )}

      {/* VENDOR INBOX TIMELINE HISTORY */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold tracking-wider text-zinc-300 uppercase">Operational History</h2>
            {unreadCount > 0 && (
              <span className="bg-[#991b1b] text-white text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 rounded-sm">
                {unreadCount} pending
              </span>
            )}
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-xs font-light text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors focus:outline-none"
            >
              <CheckSquare size={13} />
              Clear pending logs
            </button>
          )}
        </div>

        {feed.length === 0 ? (
          <div className="bg-[#121212] rounded-xl border border-dashed border-zinc-900 p-16 text-center flex flex-col items-center justify-center gap-3">
            <Bell size={24} className="text-zinc-700 stroke-1" />
            <p className="text-zinc-400 text-xs tracking-wider uppercase font-light">Your operational tray is completely clear.</p>
            <p className="text-zinc-600 text-[11px] max-w-xs font-light leading-relaxed">System-generated transactional triggers and marketplace heartbeats will populate dynamically here.</p>
          </div>
        ) : (
          <div className="bg-[#121212] rounded-xl border border-zinc-900 overflow-hidden divide-y divide-zinc-900/40">
            {feed.map((item) => (
              <div 
                key={item.id} 
                className={`p-5 flex items-start justify-between gap-4 transition-colors ${!item.isRead ? 'bg-zinc-950/60 hover:bg-zinc-950' : 'hover:bg-[#161616]/40'}`}
              >
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <VendorCategoryIcon category={item.type} isRead={item.isRead} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm tracking-wide ${!item.isRead ? 'font-medium text-white' : 'font-light text-zinc-400'}`}>
                        {item.title}
                      </p>
                      {!item.isRead && <span className="w-1.5 h-1.5 bg-[#991b1b] rounded-full shrink-0 animate-pulse" />}
                    </div>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-2xl">{item.message}</p>
                    <p className="text-[10px] text-zinc-600 font-medium tracking-wide">
                      {new Date(item.createdAt).toLocaleDateString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    disabled={actionId === item.id}
                    className="shrink-0 p-1.5 text-zinc-600 hover:text-white rounded-lg hover:bg-zinc-900 transition-all focus:outline-none"
                    title="Acknowledge log"
                  >
                    {actionId === item.id ? (
                      <Loader2 size={14} className="animate-spin text-zinc-400" />
                    ) : (
                      <Eye size={14} />
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

// --- Minimalist Luxury Context Icon Component ---
function VendorCategoryIcon({ category, isRead }: { category: string; isRead: boolean }) {
  const baseStyle = `p-2 rounded-lg shrink-0 border transition-all`;
  const unread = !isRead;

  switch (category) {
    case 'SECURITY':
      return (
        <div className={`${baseStyle} ${unread ? 'bg-[#2a0808] border-[#4c1d1d] text-[#ef4444]' : 'bg-[#161616] border-zinc-900 text-zinc-600'}`}>
          <Shield size={14} />
        </div>
      );
    case 'CHAT':
      return (
        <div className={`${baseStyle} ${unread ? 'bg-[#0b132b] border-[#1c2541] text-[#3a86ff]' : 'bg-[#161616] border-zinc-900 text-zinc-600'}`}>
          <MessageCircle size={14} />
        </div>
      );
    case 'ORDER_UPDATES':
    case 'ORDERUPDATES':
      return (
        <div className={`${baseStyle} ${unread ? 'bg-[#1c1917] border-[#44403c] text-[#f59e0b]' : 'bg-[#161616] border-zinc-900 text-zinc-600'}`}>
          <ShoppingBag size={14} />
        </div>
      );
    default:
      return (
        <div className={`${baseStyle} ${unread ? 'bg-[#1c1c1c] border-zinc-800 text-zinc-300' : 'bg-[#161616] border-zinc-900 text-zinc-500'}`}>
          <Info size={14} />
        </div>
      );
  }
}

function VendorRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="p-5 flex justify-between items-center hover:bg-[#161616]/30 transition-colors">
      <div className="pr-4 space-y-0.5">
        <p className="text-xs font-semibold tracking-wider text-zinc-300 uppercase">{label}</p>
        <p className="text-xs text-zinc-500 font-light max-w-xl leading-relaxed">{sub}</p>
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-10 h-5 rounded-full transition-all relative border ${checked ? 'bg-[#991b1b] border-[#991b1b]' : 'bg-[#1a1a1a] border-zinc-800'}`}
      >
        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}