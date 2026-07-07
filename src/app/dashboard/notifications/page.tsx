'use client';

import { useState, useEffect } from 'react';
import {
  Bell, Mail, Smartphone, MessageSquare, Loader2,
  ShoppingCart, Tag, TrendingDown, Store, Check,
} from 'lucide-react';
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

/* ── Toggle ──────────────────────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
  saving,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  saving: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="switch"
      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A4143D] ${
        checked ? 'bg-[#A4143D]' : 'bg-zinc-200 hover:bg-zinc-300'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
      {saving && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white animate-pulse" />
      )}
    </button>
  );
}

/* ── Notification Row ────────────────────────────────────────────── */
function NotifRow({
  icon,
  label,
  sub,
  checked,
  saving,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  checked: boolean;
  saving: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-4 px-5 hover:bg-zinc-50/60 transition-colors group">
      <div
        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
          checked
            ? 'bg-[#A4143D]/8 border-[#A4143D]/20 text-[#A4143D]'
            : 'bg-zinc-50 border-zinc-100 text-zinc-400'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-zinc-900 leading-tight">{label}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed truncate">{sub}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} saving={saving} />
    </div>
  );
}

/* ── Channel Pill ────────────────────────────────────────────────── */
function ChannelPill({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all duration-150 active:scale-95 ${
        active
          ? 'border-[#A4143D] bg-[#A4143D]/5 text-[#A4143D]'
          : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-300 hover:text-zinc-700'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap">{label}</span>
      <span
        className={`ml-auto shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
          active ? 'bg-[#A4143D] border-[#A4143D]' : 'border-zinc-200'
        }`}
      >
        {active && <Check size={9} className="text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

/* ── Section Shell ───────────────────────────────────────────────── */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-100 overflow-hidden bg-white">
      <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">{title}</p>
      </div>
      {children}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<keyof NotificationPrefs | null>(null);

  useEffect(() => { fetchPrefs(); }, []);

  const fetchPrefs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/notifications');
      setPrefs(res.data);
    } catch (err) {
      console.error('Notifications_Fetch_Error:', err);
      toast.error('Could not load preferences', { description: 'Check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    if (!prefs) return;
    setSavingKey(key);
    const prev = { ...prefs };
    setPrefs({ ...prefs, [key]: value }); // optimistic
    try {
      await api.patch('/user/notifications', { [key]: value });
    } catch {
      setPrefs(prev);
      toast.error('Could not save', { description: 'That change didn\'t go through — try again.' });
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-zinc-400" size={20} strokeWidth={1.5} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          Loading preferences
        </span>
      </div>
    );
  }

  if (!prefs) return null;

  const alertRows: {
    key: keyof NotificationPrefs;
    icon: React.ReactNode;
    label: string;
    sub: string;
  }[] = [
    {
      key: 'orderUpdates',
      icon: <ShoppingCart size={15} strokeWidth={1.75} />,
      label: 'Order updates',
      sub: 'Status changes, tracking and receipts',
    },
    {
      key: 'promotions',
      icon: <Tag size={15} strokeWidth={1.75} />,
      label: 'Promotions',
      sub: 'Coupons, seasonal deals and launches',
    },
    {
      key: 'chatMessages',
      icon: <MessageSquare size={15} strokeWidth={1.75} />,
      label: 'Chat messages',
      sub: 'Replies from vendors and support',
    },
    {
      key: 'storeActivity',
      icon: <Store size={15} strokeWidth={1.75} />,
      label: 'Store activity',
      sub: 'Reviews, saves and follower updates',
    },
    {
      key: 'priceDrops',
      icon: <TrendingDown size={15} strokeWidth={1.75} />,
      label: 'Price drops',
      sub: 'Watchlist items that go on sale',
    },
  ];

  const channels: {
    key: keyof NotificationPrefs;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { key: 'emailEnabled', icon: <Mail size={15} strokeWidth={1.75} />, label: 'Email' },
    { key: 'smsEnabled', icon: <MessageSquare size={15} strokeWidth={1.75} />, label: 'SMS' },
    { key: 'pushEnabled', icon: <Smartphone size={15} strokeWidth={1.75} />, label: 'Push' },
  ];

  return (
    <div className="min-h-screen bg-white pb-28 font-sans antialiased space-y-8">

      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Bell size={11} className="text-[#A4143D]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#A4143D]">
            Notifications
          </span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
          Preferences
        </h1>
        <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
          Choose what you hear about and how we reach you.
        </p>
      </div>

      {/* ── Alert Rows ── */}
      <Section title="What to notify you about">
        <div className="divide-y divide-zinc-100">
          {alertRows.map(({ key, icon, label, sub }) => (
            <NotifRow
              key={key}
              icon={icon}
              label={label}
              sub={sub}
              checked={prefs[key] as boolean}
              saving={savingKey === key}
              onChange={v => updateToggle(key, v)}
            />
          ))}
        </div>
      </Section>

      {/* ── Delivery Channels ── */}
      <Section title="Where to send them">
        <div className="p-4 flex flex-col gap-3 sm:flex-row">
          {channels.map(({ key, icon, label }) => (
            <ChannelPill
              key={key}
              icon={icon}
              label={label}
              active={prefs[key] as boolean}
              onClick={() => updateToggle(key, !(prefs[key] as boolean))}
            />
          ))}
        </div>
        <p className="px-5 pb-4 text-[11px] text-zinc-400 leading-relaxed">
          At least one channel is needed to receive any alerts.
        </p>
      </Section>

    </div>
  );
}