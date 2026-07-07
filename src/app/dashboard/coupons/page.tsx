'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import {
  Ticket, Copy, Check, Loader2, ShoppingBag,
  ArrowUpRight, Gift, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: 'GLOBAL' | 'VENDOR' | 'JOINT';
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  discountValue: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  vendor?: { storeName: string };
}

/* ── helpers ─────────────────────────────────────────────────────── */
function discountLabel(c: Coupon): string {
  if (c.discountType === 'FREE_SHIPPING') return 'FREE\nSHIP';
  if (c.discountType === 'PERCENTAGE') return `${Number(c.discountValue)}%\nOFF`;
  return `₦${Number(c.discountValue || 0).toLocaleString()}`;
}

function discountTitle(c: Coupon): string {
  if (c.discountType === 'FREE_SHIPPING') return 'Free Shipping';
  if (c.discountType === 'PERCENTAGE') return `${Number(c.discountValue)}% Off`;
  return `₦${Number(c.discountValue || 0).toLocaleString()} Off`;
}

function typeLabel(c: Coupon): string {
  if (c.type === 'GLOBAL') return 'Storewide';
  if (c.type === 'JOINT') return 'Joint Offer';
  return c.vendor?.storeName ?? 'Vendor';
}

function typeDot(type: Coupon['type']): string {
  if (type === 'JOINT') return 'bg-[#A4143D]';
  if (type === 'GLOBAL') return 'bg-zinc-900';
  return 'bg-amber-500';
}

/* ── Ticket Card ─────────────────────────────────────────────────── */
function CouponTicket({
  coupon,
  expired,
  copiedCode,
  onCopy,
}: {
  coupon: Coupon;
  expired: boolean;
  copiedCode: string | null;
  onCopy: (code: string) => void;
}) {
  const lines = discountLabel(coupon).split('\n');
  const validUntil = coupon.endDate
    ? new Date(coupon.endDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : 'No expiry';

  return (
    <div
      className={`flex rounded-2xl overflow-visible border transition-all duration-200 ${
        expired
          ? 'opacity-50 grayscale border-zinc-100 bg-zinc-50'
          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md'
      }`}
    >
      {/* ── Stub ── */}
      <div
        className={`relative flex flex-col items-center justify-center gap-0.5 shrink-0 select-none rounded-l-2xl ${
          expired ? 'bg-zinc-400' : 'bg-[#A4143D]'
        }`}
        style={{ width: 68 }}
      >
        {lines.map((line, i) => (
          <span
            key={i}
            className="text-white font-black leading-none text-center"
            style={{ fontSize: i === 0 && line.length <= 3 ? 28 : 18 }}
          >
            {line}
          </span>
        ))}

        {/* Notch — colour must match the page background behind the card */}
        <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border border-zinc-200 z-10" />
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col gap-2.5 py-3.5 pl-4 pr-3.5 border-l border-dashed border-zinc-200">

        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-black text-zinc-900 uppercase tracking-tight leading-tight">
            {discountTitle(coupon)}
          </h3>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${typeDot(coupon.type)}`} />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
              {typeLabel(coupon)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-1">
          {coupon.description || 'Applies at checkout on qualifying orders.'}
        </p>

        {/* Meta pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-md">
            Min ₦{Number(coupon.minOrderValue || 0).toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-400">
            {expired ? 'Expired' : 'Valid till'} {validUntil}
          </span>
        </div>

        {/* Code + actions */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-100">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-300 mb-0.5">Code</p>
            <p className="text-sm font-black font-mono tracking-widest text-zinc-900 select-all uppercase">
              {coupon.code}
            </p>
          </div>

          {!expired && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onCopy(coupon.code)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-all active:scale-95"
                aria-label="Copy code"
              >
                {copiedCode === coupon.code
                  ? <Check size={14} className="text-emerald-600" />
                  : <Copy size={14} className="text-zinc-500" />}
              </button>
              <Link
                href="/shop"
                className="h-9 flex items-center px-4 rounded-xl bg-zinc-900 hover:bg-[#A4143D] text-white text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95"
              >
                Redeem
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Hub Pill ────────────────────────────────────────────────────── */
function HubPill({
  href, icon, eyebrow, title,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 px-4 py-3.5 hover:border-zinc-300 hover:bg-white hover:shadow-md transition-all duration-200"
    >
      <div className="w-9 h-9 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-[#A4143D] group-hover:border-zinc-200 transition-colors shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{eyebrow}</p>
        <p className="text-sm font-black text-zinc-900 uppercase tracking-tight truncate">{title}</p>
      </div>
      <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-600 transition-colors shrink-0" />
    </Link>
  );
}

/* ── Empty State ─────────────────────────────────────────────────── */
function EmptyState({ expired }: { expired: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/30">
      <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center">
        <ShoppingBag size={22} className="text-zinc-300" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-tight text-zinc-800">
          {expired ? 'No expired offers' : 'No active offers'}
        </p>
        <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">
          {expired
            ? 'All your past coupons will appear here.'
            : 'New discounts drop here — check back soon.'}
        </p>
      </div>
      {!expired && (
        <Link
          href="/shop"
          className="text-xs font-bold text-[#A4143D] flex items-center gap-1 hover:underline"
        >
          Browse the store <ArrowUpRight size={12} />
        </Link>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'expired'>('available');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/coupons/active');
        setCoupons(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Coupon_Fetch_Error:', err);
        toast.error('Could not load rewards', { description: 'Check your connection and try again.' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success(`${code} copied`, {
      description: 'Paste it at checkout.',
      icon: <Ticket size={14} className="text-[#A4143D]" />,
    });
  };

  const split = (tab: 'available' | 'expired') =>
    coupons.filter(c => {
      if (!c.endDate) return tab === 'available';
      return tab === 'available'
        ? new Date(c.endDate).getTime() >= Date.now()
        : new Date(c.endDate).getTime() < Date.now();
    });

  const available = split('available');
  const expired = split('expired');
  const visible = activeTab === 'available' ? available : expired;

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-zinc-400" size={20} strokeWidth={1.5} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          Loading rewards
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 font-sans antialiased">

      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A4143D]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#A4143D]">
            Exclusive Privileges
          </span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
          Rewards
        </h1>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-xs">
          Storewide discounts, vendor offers, and referral rewards — all in one place.
        </p>
      </div>

      {/* ── Hub Pills ── */}
      <div className="flex flex-col gap-3 mb-8">
        <HubPill
          href="/dashboard/referrals"
          icon={<Gift size={16} strokeWidth={1.5} />}
          eyebrow="Referral Campaign"
          title="Earn ₦2,500 Voucher"
        />
        <HubPill
          href="/dashboard/vouchers"
          icon={<Ticket size={16} strokeWidth={1.5} />}
          eyebrow="Personal Vault"
          title="Voucher Ledger"
        />
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-0 border-b border-zinc-100 mb-6">
        {(['available', 'expired'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-3 mr-6 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              activeTab === tab ? 'text-zinc-900' : 'text-zinc-300 hover:text-zinc-500'
            }`}
          >
            {tab === 'available' ? 'Active' : 'Expired'}
            <span className={`ml-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
              activeTab === tab ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'
            }`}>
              {tab === 'available' ? available.length : expired.length}
            </span>
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Coupon List ── */}
      {visible.length > 0 ? (
        <div className="flex flex-col gap-4">
          {visible.map(coupon => (
            <CouponTicket
              key={coupon.id}
              coupon={coupon}
              expired={activeTab === 'expired'}
              copiedCode={copiedCode}
              onCopy={copyCode}
            />
          ))}
        </div>
      ) : (
        <EmptyState expired={activeTab === 'expired'} />
      )}
    </div>
  );
}