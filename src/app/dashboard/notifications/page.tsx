'use client';
import { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, MessageSquare, Loader2, CheckCircle, Eye, CheckSquare, Shield, MessageCircle, Gift, Info } from 'lucide-react';
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

// ✅ FIXED: Interface matches backend database schema mapping property fields
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string; // ◄ Swapped from 'category' to 'type'
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
    // Initializing full pipeline concurrency
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
      // Optimistic state updates
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
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-500" size={32} />
        <p className="text-gray-500 font-medium">Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-12 animate-in fade-in duration-500 p-4">
      {/* HEADER META */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications Center</h1>
          <p className="text-gray-500 mt-1">Configure preference limits and manage your inbox feed alerts log stream.</p>
        </div>
        {saving && (
          <span className="text-[10px] font-bold text-orange-500 uppercase animate-pulse mb-1">
            Saving changes...
          </span>
        )}
      </div>

      {/* RENDER CHANNELS CONFIGURATION TOGGLES */}
      {prefs && (
        <div className="space-y-6">
          <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            <div className="p-6 bg-gray-50/50 flex items-center gap-2">
              <Bell size={18} className="text-orange-500" />
              <h3 className="font-bold text-gray-900">Activity Alerts</h3>
            </div>
            <NotificationRow label="Order Updates" sub="Status changes, tracking, and receipts" checked={prefs.orderUpdates} onChange={(val) => updateToggle('orderUpdates', val)} />
            <NotificationRow label="Promotions" sub="Discounts, seasonal sales, and coupons" checked={prefs.promotions} onChange={(val) => updateToggle('promotions', val)} />
            <NotificationRow label="Chat Messages" sub="Direct messages from vendors or support" checked={prefs.chatMessages} onChange={(val) => updateToggle('chatMessages', val)} />
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 📬 LIVE INBOX LOG TIMELINE HISTORY FEED   */}
      {/* ========================================= */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Notification History</h2>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                {unreadCount} new
              </span>
            )}
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 transition-colors focus:outline-none"
            >
              <CheckSquare size={14} />
              Mark all as read
            </button>
          )}
        </div>

        {feed.length === 0 ? (
          <div className="bg-gray-50 rounded-4xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-2">
            <Bell size={32} className="text-gray-300 stroke-1" />
            <p className="text-gray-500 text-sm font-semibold">Your notification tray is completely empty.</p>
            <p className="text-gray-400 text-xs">Alert parameters triggered by platform mechanisms pop up instantly here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {feed.map((item) => (
              <div 
                key={item.id} 
                className={`p-5 flex items-start justify-between gap-4 transition-colors ${!item.isRead ? 'bg-orange-50/20 hover:bg-orange-50/40' : 'hover:bg-gray-50/40'}`}
              >
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    {/* ✅ CONNECTED: Pointing directly to item.type field parameter */}
                    <CategoryIcon category={item.type} isRead={item.isRead} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!item.isRead ? 'font-black text-gray-900' : 'font-semibold text-gray-700'}`}>
                        {item.title}
                      </p>
                      {!item.isRead && <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xl">{item.message}</p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {new Date(item.createdAt).toLocaleDateString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    disabled={actionId === item.id}
                    className="shrink-0 p-2 text-gray-400 hover:text-orange-500 rounded-xl hover:bg-gray-50 transition-all focus:outline-none"
                    title="Mark as read"
                  >
                    {actionId === item.id ? (
                      <Loader2 size={16} className="animate-spin text-orange-500" />
                    ) : (
                      <Eye size={16} />
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

// --- Dynamic Category/Type UI Context Helper Component ---
function CategoryIcon({ category, isRead }: { category: string; isRead: boolean }) {
  const baseStyle = `p-2 rounded-2xl shrink-0 border transition-all`;
  const unreadState = !isRead;

  // ✅ FIXED: Cases aligned exactly with your database Schema strings ('BROADCAST', etc.)
  switch (category) {
    case 'SECURITY':
      return (
        <div className={`${baseStyle} ${unreadState ? 'bg-red-50 border-red-100 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
          <Shield size={16} />
        </div>
      );
    case 'CHAT':
      return (
        <div className={`${baseStyle} ${unreadState ? 'bg-blue-50 border-blue-100 text-blue-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
          <MessageCircle size={16} />
        </div>
      );
    case 'BROADCAST':
      return (
        <div className={`${baseStyle} ${unreadState ? 'bg-purple-50 border-purple-100 text-purple-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
          <Gift size={16} />
        </div>
      );
    default:
      return (
        <div className={`${baseStyle} ${unreadState ? 'bg-orange-50 border-orange-100 text-orange-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
          <Info size={16} />
        </div>
      );
  }
}

function NotificationRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (val: boolean) => void }) {
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