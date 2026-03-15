"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Ticket, Megaphone, Plus, Loader2, Store, Shield,
  Calendar, Percent, TrendingUp, Zap, X, Activity
} from "lucide-react";
import { api } from "@/src/lib/axios";
import { toast } from "sonner";

// --- REGISTRY INTERFACES ---

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  endDate: string;
  isActive: boolean;
  vendor?: { storeName: string };
}

interface Campaign {
  id: string;
  title: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  _count?: { participants: number };
}

export default function AdminPromotionsPage() {
  const [activeTab, setActiveTab] = useState<"COUPONS" | "CAMPAIGNS">("COUPONS");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // FORM_MANIFESTS: Pre-synchronized with Backend DTOs
  const [couponForm, setCouponForm] = useState({
    code: "", 
    discountType: "PERCENTAGE", 
    discountValue: "",
    minOrderValue: "0", 
    usageLimit: "1000", 
    perUserLimit: "1", 
    endDate: ""
  });

  const [campaignForm, setCampaignForm] = useState({
    title: "", 
    description: "", 
    discount: "20", 
    startDate: "", 
    endDate: ""
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [couponRes, campRes] = await Promise.all([
        api.get("/admin/coupons"),
        api.get("/admin/campaigns")
      ]);
      setCoupons(couponRes.data);
      setCampaigns(campRes.data);
    } catch {
      toast.error("PROTOCOL_SYNC_FAILURE", { description: "Identity registry failed to sync." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /**
   * DEPLOYMENT_PROTOCOL
   * Handles atomic deployment for both Campaigns and Coupons
   */
  const handleDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (activeTab === "CAMPAIGNS") {
        // Validation Handshake: Casting types to match Backend CreateCampaignDto
        const payload = {
          title: campaignForm.title,
          description: campaignForm.description || "Platform-wide growth event",
          discount: Number(campaignForm.discount),
          startDate: campaignForm.startDate ? new Date(campaignForm.startDate).toISOString() : "",
          endDate: campaignForm.endDate ? new Date(campaignForm.endDate).toISOString() : "",
        };

        await api.post("/admin/campaigns", payload);
        toast.success("CAMPAIGN_DEPLOYED", { description: "Event node is now open for vendors." });
      } else {
        const payload = {
          ...couponForm,
          discountValue: Number(couponForm.discountValue),
          minOrderValue: Number(couponForm.minOrderValue),
          usageLimit: Number(couponForm.usageLimit),
          perUserLimit: Number(couponForm.perUserLimit),
          endDate: couponForm.endDate ? new Date(couponForm.endDate).toISOString() : "",
        };

        await api.post("/admin/coupons/platform", payload);
        toast.success("COUPON_DEPLOYED", { description: "Global code has been registered." });
      }

      setCreating(false);
      fetchData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message;
      const description = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
      toast.error("DEPLOYMENT_REJECTED", { description: description || "Validation Check Failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-10 text-zinc-100 space-y-12 max-w-7xl mx-auto min-h-screen">
      
      {/* 1. COMMAND HEADER */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
             <Zap size={14} fill="currentColor" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Promotion_Registry_v4</span>
          </div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Control Center</h1>
        </div>

        <button
          onClick={() => setCreating(!creating)}
          className={`h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 active:scale-95 ${
            creating ? "bg-zinc-800 text-zinc-400" : "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
          }`}
        >
          {creating ? <X size={18} /> : <Plus size={18} />}
          {creating ? "Abort Protocol" : "Initialize Promotion"}
        </button>
      </div>

      {/* 2. ANALYTICS HUD */}
      <div className="grid md:grid-cols-3 gap-8">
        <StatCard label="Live Coupons" value={coupons.filter(c => c.isActive).length} icon={<Ticket size={20}/>} />
        <StatCard label="Active Campaigns" value={campaigns.filter(c => c.isActive).length} icon={<Megaphone size={20}/>} />
        <StatCard label="Global Redemptions" value={coupons.reduce((a, b) => a + b.usedCount, 0)} icon={<Activity size={20}/>} />
      </div>

      {/* 3. TABS */}
      <div className="flex gap-12 border-b border-zinc-800">
        <TabButton active={activeTab === "COUPONS"} onClick={() => setActiveTab("COUPONS")} icon={<Ticket size={16}/>} label="Coupons" />
        <TabButton active={activeTab === "CAMPAIGNS"} onClick={() => setActiveTab("CAMPAIGNS")} icon={<Megaphone size={16}/>} label="Campaigns" />
      </div>

      {/* 4. DYNAMIC DEPLOYMENT FORM */}
      {creating && (
        <form onSubmit={handleDeployment} className="bg-zinc-900 border border-zinc-800 rounded-4xl p-12 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">New {activeTab === "CAMPAIGNS" ? "Campaign Blueprint" : "Coupon Registry"}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {activeTab === "CAMPAIGNS" ? (
              <>
                <Input label="Title" value={campaignForm.title} onChange={(v: string) => setCampaignForm({...campaignForm, title: v})} placeholder="Ramadan Sale 2026" />
                <Input label="Discount %" type="number" value={campaignForm.discount} onChange={(v: string) => setCampaignForm({...campaignForm, discount: v})} placeholder="20" />
                <Input label="Launch Date" type="date" value={campaignForm.startDate} onChange={(v: string) => setCampaignForm({...campaignForm, startDate: v})} />
                <Input label="Termination" type="date" value={campaignForm.endDate} onChange={(v: string) => setCampaignForm({...campaignForm, endDate: v})} />
                <div className="md:col-span-2">
                    <Input label="Description" value={campaignForm.description} onChange={(v: string) => setCampaignForm({...campaignForm, description: v})} placeholder="Scale platform revenue via curated vendor inventory." />
                </div>
              </>
            ) : (
              <>
                <Input label="Code" value={couponForm.code} onChange={(v: string) => setCouponForm({...couponForm, code: v.toUpperCase()})} placeholder="AVI-SUMMER" />
                <Input label="Value" type="number" value={couponForm.discountValue} onChange={(v: string) => setCouponForm({...couponForm, discountValue: v})} placeholder="10" />
                <Input label="End Date" type="date" value={couponForm.endDate} onChange={(v: string) => setCouponForm({...couponForm, endDate: v})} />
              </>
            )}
          </div>
          <button disabled={submitting} className="h-14 px-10 bg-indigo-600 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
            {submitting ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} fill="currentColor"/>}
            Deploy Protocol Node
          </button>
        </form>
      )}

      {/* 5. REGISTRY TABLES */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-4xl overflow-hidden shadow-2xl">
        {activeTab === "COUPONS" ? <CouponTable coupons={coupons} loading={loading} /> : <CampaignTable campaigns={campaigns} loading={loading} />}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-4xl p-8 flex items-center justify-between hover:border-indigo-500/50 transition-all group">
      <div>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-black italic tracking-tighter mt-2">{value}</p>
      </div>
      <div className="p-4 bg-zinc-800 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        required
        className="w-full bg-zinc-800 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold border-none placeholder:text-zinc-600" 
      />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 pb-6 border-b-2 transition-all group ${active ? "border-indigo-500 text-white" : "border-transparent text-zinc-600"}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">{label}</span>
    </button>
  );
}

function CouponTable({ coupons, loading }: { coupons: Coupon[]; loading: boolean }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-zinc-950 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
        <tr><th className="p-8 text-left">Code</th><th>Discount</th><th>Usage</th><th>Identity</th><th className="pr-8 text-right">Status</th></tr>
      </thead>
      <tbody>
        {loading ? <tr><td className="p-10 text-center uppercase font-black text-[10px]" colSpan={5}>Syncing_Registry...</td></tr> : coupons.map(c => (
          <tr key={c.id} className="border-t border-zinc-800 hover:bg-zinc-800/30 transition">
            <td className="p-8 font-black italic uppercase text-lg">{c.code}</td>
            <td className="text-center font-bold text-zinc-400">{c.discountValue}{c.discountType === "PERCENTAGE" ? "%" : "₦"}</td>
            <td className="text-center text-xs font-bold text-zinc-500">{c.usedCount}/{c.usageLimit}</td>
            <td className="text-center">{c.vendor ? <span className="text-indigo-400 uppercase font-black text-[10px]">{c.vendor.storeName}</span> : <span className="text-zinc-600 uppercase font-black text-[10px]">Platform</span>}</td>
            <td className="text-right pr-8"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${c.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>{c.isActive ? "Live" : "Killed"}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CampaignTable({ campaigns, loading }: { campaigns: Campaign[]; loading: boolean }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-zinc-950 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
        <tr><th className="p-8 text-left">Campaign Name</th><th>Platform Deduction</th><th>Vendor Participation</th><th className="pr-8 text-right">Status</th></tr>
      </thead>
      <tbody>
        {loading ? <tr><td className="p-10 text-center uppercase font-black text-[10px]" colSpan={4}>Syncing_Registry...</td></tr> : campaigns.map(c => (
          <tr key={c.id} className="border-t border-zinc-800 hover:bg-zinc-800/30 transition">
            <td className="p-8 font-black italic uppercase text-lg">{c.title}</td>
            <td className="text-center font-bold text-indigo-400">{c.discount}% OFF</td>
            <td className="text-center text-xs font-bold text-zinc-500">{c._count?.participants || 0} Vendors Active</td>
            <td className="text-right pr-8"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${c.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>{c.isActive ? "Active_Protocol" : "Offline"}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}