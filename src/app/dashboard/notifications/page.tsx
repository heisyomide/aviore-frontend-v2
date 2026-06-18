'use client';

import { useState, useEffect } from 'react';
import { Bell, Loader2, Eye, CheckSquare, Shield, MessageCircle, Gift, Info } from 'lucide-react';
import { api } from '@/src/lib/axios';

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

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string; 
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [feed, setFeed] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchPrefs(), fetchFeed(), fetchUnreadCount()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const fetchPrefs = async () => {
    try {
      const res = await api.get('/notifications/settings');
      setPrefs(res.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const fetchFeed = async () => {
    try {
      const res = await api.get('/notifications/feed');
      setFeed(res.data);
    } catch (err) {
      console.error("Failed to fetch notification feed:", err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
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
      console.error("Failed to save preference:", err);
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
      console.error("Failed to mark all items as read:", err);
      fetchFeed();
      fetchUnreadCount();
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 bg-[#0D0D0D] min-h-screen">
        <Loader2 className="animate-spin text-[#991B1B]" size={26} />
        <p className="text-[8px] font-mono font-bold tracking-[0.25em] text-zinc-600 uppercase">Synchronizing Control Channels...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500">
        
        {/* LUXURY METRIC HEADER */}
        <header className="flex justify-between items-end border-b border-zinc-900/60 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#991B1B]">
              <Bell size={13} className="animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">System_Registry</span>
            </div>
            <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
              Notifications <span className="text-zinc-600 font-normal font-sans tracking-normal">Center</span>
            </h1>
          </div>
          {saving && (
            <span className="text-[8px] font-mono font-bold text-[#991B1B] uppercase tracking-widest animate-pulse mb-1">
              Updating_Prefs...
            </span>
          )}
        </header>

        {/* 1. PREFERENCES CONFIGURATION CORES */}
        {prefs && (
          <section className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="font-mono font-bold text-[9px] uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap">
                Alert_Routing
              </h3>
              <div className="h-[1px] w-full bg-zinc-900/60" />
            </div>
            
            <div className="bg-[#111113] rounded-xl border border-zinc-900 overflow-hidden divide-y divide-zinc-900/60">
              <NotificationRow label="Order Updates" sub="Status alterations, tracking nodes, and digital item receipts" checked={prefs.orderUpdates} onChange={(val) => updateToggle('orderUpdates', val)} />
              <NotificationRow label="Promotions" sub="System-wide drops, seasonal runway points, and exclusive vouchers" checked={prefs.promotions} onChange={(val) => updateToggle('promotions', val)} />
              <NotificationRow label="Chat Messages" sub="Direct secure messaging lines from verified creators or internal assistance" checked={prefs.chatMessages} onChange={(val) => updateToggle('chatMessages', val)} />
            </div>
          </section>
        )}

        {/* 2. LOG TIMELINE STREAM FEED */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900/40 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="font-mono font-bold text-[9px] uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap">
                Timeline_Stream
              </h2>
              {unreadCount > 0 && (
                <span className="bg-[#991B1B] border border-red-900/60 text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {unreadCount} unread
                </span>
              )}
            </div>
            
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-2 transition-colors focus:outline-none"
              >
                <CheckSquare size={12} className="text-[#991B1B]" />
                Purge Unread
              </button>
            )}
          </div>

          {feed.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-xl text-center bg-[#111113]/20">
              <div className="p-4 bg-zinc-950 border border-zinc-900 text-zinc-700 rounded-xl mb-4">
                <Bell size={20} strokeWidth={1.5} />
              </div>
              <p className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-600">Tray_Empty</p>
              <p className="text-[8px] uppercase tracking-widest text-zinc-500 mt-1 font-sans">No platform mechanisms have triggered alerts.</p>
            </div>
          ) : (
            <div className="bg-[#111113] rounded-xl border border-zinc-900 overflow-hidden divide-y divide-zinc-900/60">
              {feed.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-5 flex items-start justify-between gap-4 transition-colors ${!item.isRead ? 'bg-zinc-950/40 hover:bg-zinc-950/80' : 'hover:bg-zinc-950/20'}`}
                >
                  <div className="flex gap-4">
                    <div className="mt-0.5 shrink-0">
                      <CategoryIcon category={item.type} isRead={item.isRead} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <p className={`text-xs uppercase font-mono tracking-wide ${!item.isRead ? 'font-bold text-white' : 'text-zinc-400'}`}>
                          {item.title}
                        </p>
                        {!item.isRead && <span className="w-1.5 h-1.5 bg-[#991B1B] rounded-full shrink-0 animate-ping" />}
                      </div>
                      <p className="text-[11px] font-sans text-zinc-500 leading-relaxed max-w-xl">{item.message}</p>
                      <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-wider">
                        {new Date(item.createdAt).toLocaleDateString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      disabled={actionId === item.id}
                      className="shrink-0 p-2 text-zinc-600 hover:text-white rounded border border-transparent hover:border-zinc-900 hover:bg-zinc-950 transition-all focus:outline-none"
                      title="Clear flag"
                    >
                      {actionId === item.id ? (
                        <Loader2 size={12} className="animate-spin text-[#991B1B]" />
                      ) : (
                        <Eye size={12} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// --- Dynamic Category UI Context Core Components ---
function CategoryIcon({ category, isRead }: { category: string; isRead: boolean }) {
  const baseStyle = `p-2.5 rounded border transition-all shrink-0`;
  const unreadState = !isRead;

  switch (category) {
    case 'SECURITY':
      return (
        <div className={`${baseStyle} ${unreadState ? 'bg-zinc-950 border-red-900/40 text-red-400' : 'bg-zinc-950 border-zinc-900 text-zinc-600'}`}>
          <Shield size={13} />
        </div>
      );
    case 'CHAT':
      return (
        <div className={`${baseStyle} ${unreadState ? 'bg-zinc-950 border-blue-900/40 text-blue-400' : 'bg-zinc-950 border-zinc-900 text-zinc-600'}`}>
          <MessageCircle size={13} />
        </div>
      );
    case 'BROADCAST':
      return (
        <div className={`${baseStyle} ${unreadState ? 'bg-zinc-950 border-purple-900/40 text-purple-400' : 'bg-zinc-950 border-zinc-900 text-zinc-600'}`}>
          <Gift size={13} />
        </div>
      );
    default:
      return (
        <div className={`${baseStyle} ${unreadState ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-zinc-950 border-zinc-900 text-zinc-700'}`}>
          <Info size={13} />
        </div>
      );
  }
}

function NotificationRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="p-5 flex justify-between items-center hover:bg-zinc-950/40 transition-colors">
      <div className="pr-4 space-y-0.5">
        <p className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide">{label}</p>
        <p className="text-[11px] font-sans text-zinc-500 leading-normal">{sub}</p>
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-9 h-5 rounded-full transition-all relative border border-transparent ${checked ? 'bg-[#991B1B]' : 'bg-zinc-950 border-zinc-800'}`}
      >
        <div className={`absolute top-[3px] w-3 h-3 bg-white rounded-full transition-all ${checked ? 'left-5 bg-zinc-100' : 'left-1 bg-zinc-600'}`} />
      </button>
    </div>
  );
}