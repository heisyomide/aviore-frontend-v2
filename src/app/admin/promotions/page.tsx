"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Ticket,
  Megaphone,
  Image as ImageIcon,
  Plus,
  Loader2,
  X,
  Building2,
  Percent,
  Layers,
  Upload,
} from "lucide-react";
import { api } from "@/src/lib/axios";
import { toast } from "sonner";

type AdminTab = "COUPONS" | "CAMPAIGNS" | "HERO_BANNERS";

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  usageLimit: number;
  isActive: boolean;
  vendor?: {
    storeName: string;
  };
  _count?: {
    usages: number;
  };
}

interface Campaign {
  id: string;
  title: string;
  discount: number;
  isActive: boolean;
  tag?: string;
}

interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  discount?: string;
  imageUrl: string;
  tag: string;
  isActive: boolean;
}

interface HeroForm {
  title: string;
  subtitle: string;
  discount: string;
  tag: string;
  imageUrl: string; // Safely stores raw base64 payload data string
}

interface CampaignForm {
  title: string;
  discount: number;
  tag: string;
}

const initialHeroForm: HeroForm = {
  title: "",
  subtitle: "",
  discount: "",
  tag: "",
  imageUrl: "",
};

const initialCampaignForm: CampaignForm = {
  title: "",
  discount: 5,
  tag: "",
};

export default function AdminPromotionsPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("HERO_BANNERS");
  const [loading, setLoading] = useState(true);
  
  const [creatingBanner, setCreatingBanner] = useState(false);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  
  const [heroForm, setHeroForm] = useState<HeroForm>(initialHeroForm);
  const [campaignForm, setCampaignForm] = useState<CampaignForm>(initialCampaignForm);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [couponRes, campaignRes, bannerRes] = await Promise.all([
        api.get("/admin/coupons"),
        api.get("/admin/campaigns"),
        api.get("/admin/banners"),
      ]);

      setCoupons(couponRes.data || []);
      setCampaigns(campaignRes.data || []);
      setHeroBanners(bannerRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync promotions data registry");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateHeroField = (key: keyof HeroForm, value: string) => {
    setHeroForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateHeroBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.imageUrl) {
      toast.error("Please pick a resource image file from your device first");
      return;
    }
    try {
      setSubmitting(true);
      // Hits the core banner controller route, containing the base64 data string
      await api.post("/admin/banners", heroForm);
      toast.success("Hero banner initialized successfully");
      setHeroForm(initialHeroForm);
      setCreatingBanner(false);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize banner component");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/admin/campaigns", campaignForm);
      toast.success("Live campaign matrix deployed successfully");
      setCampaignForm(initialCampaignForm);
      setCreatingCampaign(false);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to deploy live campaign matrix");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-10 min-h-screen bg-[#0A0B0D] text-white animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">
            Promotions Center
          </h1>
          <p className="text-[10px] text-zinc-500 tracking-[0.3em] uppercase mt-2">AVIORÈ Global Orchestrator</p>
        </div>

        {activeTab === "HERO_BANNERS" && (
          <button
            onClick={() => setCreatingBanner(!creatingBanner)}
            className="bg-zinc-100 hover:bg-white text-black px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 text-xs uppercase tracking-wider"
          >
            {creatingBanner ? <X size={14} /> : <Plus size={14} />}
            {creatingBanner ? "Cancel" : "Create Banner"}
          </button>
        )}

        {activeTab === "CAMPAIGNS" && (
          <button
            onClick={() => setCreatingCampaign(!creatingCampaign)}
            className="bg-zinc-100 hover:bg-white text-black px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 text-xs uppercase tracking-wider"
          >
            {creatingCampaign ? <X size={14} /> : <Plus size={14} />}
            {creatingCampaign ? "Cancel" : "Create Campaign"}
          </button>
        )}
      </div>

      {/* TABS CONTROLLER */}
      <div className="flex gap-8 border-b border-zinc-800 pb-4 overflow-x-auto scrollbar-none">
        <TabButton active={activeTab === "HERO_BANNERS"} onClick={() => { setActiveTab("HERO_BANNERS"); }} label="Hero Banners" icon={<ImageIcon size={14} />} />
        <TabButton active={activeTab === "COUPONS"} onClick={() => { setActiveTab("COUPONS"); }} label="Coupons Ledger" icon={<Ticket size={14} />} />
        <TabButton active={activeTab === "CAMPAIGNS"} onClick={() => { setActiveTab("CAMPAIGNS"); }} label="Live Campaigns" icon={<Megaphone size={14} />} />
      </div>

      {/* DYNAMIC FORMS & TABLES GRID */}
      <div className="space-y-6">
        {creatingBanner && activeTab === "HERO_BANNERS" && (
          <HeroBannerForm form={heroForm} onChange={updateHeroField} onSubmit={handleCreateHeroBanner} submitting={submitting} />
        )}

        {creatingCampaign && activeTab === "CAMPAIGNS" && (
          <CampaignFormBlock form={campaignForm} setForm={setCampaignForm} onSubmit={handleCreateCampaign} submitting={submitting} />
        )}

        {activeTab === "HERO_BANNERS" && <HeroBannerTable Banners={heroBanners} loading={loading} />}
        {activeTab === "COUPONS" && <CouponsTable coupons={coupons} loading={loading} />}
        {activeTab === "CAMPAIGNS" && <CampaignsTable campaigns={campaigns} loading={loading} />}
      </div>
    </div>
  );
}

/* 🎨 RENDER TABLES */

function CouponsTable({ coupons, loading }: { coupons: Coupon[]; loading: boolean }) {
  if (loading) return <LoadingSpinner label="Compiling system coupons registry..." />;
  if (!coupons.length) return <EmptyState label="No system coupons registered" />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <div key={coupon.id} className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="bg-zinc-800 text-zinc-300 font-mono text-xs px-3 py-1.5 rounded-md font-bold tracking-widest border border-zinc-700/50">
                {coupon.code}
              </span>
              <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-black tracking-wider mt-3">
                <Building2 size={12} />
                <span>{coupon.vendor?.storeName || "Global Platform"}</span>
              </div>
            </div>
            <StatusBadge active={coupon.isActive} />
          </div>

          <div className="space-y-3 pt-2 border-t border-zinc-800/50">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold">Reduction Value</span>
              <span className="font-black italic text-zinc-200">
                {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₦${coupon.discountValue.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold">Registry Limit</span>
              <span className="text-zinc-400 font-medium">
                {coupon._count?.usages || 0} / {coupon.usageLimit || "∞"} used
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CampaignsTable({ campaigns, loading }: { campaigns: Campaign[]; loading: boolean }) {
  if (loading) return <LoadingSpinner label="Streaming campaign cluster matrices..." />;
  if (!campaigns.length) return <EmptyState label="No promo campaigns deployed" />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-zinc-800/60 rounded-xl border border-zinc-700/30 text-zinc-400">
                <Percent size={16} />
              </div>
              <StatusBadge active={campaign.isActive} />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white uppercase italic">{campaign.title}</h3>
            {campaign.tag && <p className="text-[9px] text-zinc-500 font-mono tracking-widest mt-1 uppercase">Vector: {campaign.tag}</p>}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Dynamic Drop</span>
            <span className="text-xl font-black italic text-emerald-400">-{campaign.discount}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroBannerTable({ Banners, loading }: { Banners: HeroBanner[]; loading: boolean }) {
  if (loading) return <LoadingSpinner label="Rendering promotional display arrays..." />;
  if (!Banners.length) return <EmptyState label="No interactive banners configured" />;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Banners.map((banner) => (
        <div key={banner.id} className="group border border-zinc-800/80 bg-zinc-900/30 rounded-3xl overflow-hidden flex flex-col justify-between">
          <div className="relative aspect-[21/9] bg-zinc-950 overflow-hidden border-b border-zinc-800">
            {banner.imageUrl ? (
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700"><Layers size={24} /></div>
            )}
            <div className="absolute top-4 right-4"><StatusBadge active={banner.isActive} /></div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-md text-[8px] font-mono tracking-widest text-zinc-300 uppercase">
              Tag: {banner.tag}
            </div>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-xl font-black uppercase italic tracking-tight">{banner.title}</h3>
              {banner.discount && <span className="text-sm font-black text-zinc-200 bg-zinc-800 px-2.5 py-1 rounded-md italic shrink-0">{banner.discount}</span>}
            </div>
            {banner.subtitle && <p className="text-xs text-zinc-400 font-medium leading-relaxed">{banner.subtitle}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* 🎨 HARDENED INTERACTIVE FORMS */

function HeroBannerForm({ form, onChange, onSubmit, submitting }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(form.imageUrl || "");

  // Rewired directly to convert local file system assets to Base64 
  // and inject them instantly into the parent form configuration tree
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onChange("imageUrl", base64String); 
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-3xl backdrop-blur-sm animate-in slide-in-from-top-4 duration-300">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Title" value={form.title} onChange={(v: string) => onChange("title", v)} placeholder="e.g., THE AUTUMN DROP" />
        <Input label="Tag Index Key" value={form.tag} onChange={(v: string) => onChange("tag", v)} placeholder="e.g., homepage-main" />
        <Input label="Subtitle Block" value={form.subtitle} onChange={(v: string) => onChange("subtitle", v)} placeholder="e.g., Curated luxury statements" />
        <Input label="Visual Badge Deal" value={form.discount} onChange={(v: string) => onChange("discount", v)} placeholder="e.g., 20% OFF" />
      </div>
      
      {/* LOCAL DEVICE ASSET LOADER LAYER */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Resource Image File</label>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[140px] overflow-hidden relative"
        >
          {preview ? (
            <>
              <img src={preview} alt="Resource Preview" className="absolute inset-0 w-full h-full object-cover opacity-30" />
              <div className="relative z-10 text-center space-y-1">
                <p className="text-xs font-bold text-zinc-200">Asset Loaded Successfully</p>
                <p className="text-[9px] text-zinc-500 font-mono">Click anywhere to change item source</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl">
                <Upload size={16} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-300">Select Image File</p>
                <p className="text-[9px] text-zinc-600 font-mono tracking-wider mt-1 uppercase">Supports JPEG, PNG, WEBP from your device</p>
              </div>
            </>
          )}
        </div>
      </div>

      <button disabled={submitting} className="bg-white hover:bg-zinc-200 text-black px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50">
        {submitting ? <Loader2 className="animate-spin" size={14} /> : "Publish Component"}
      </button>
    </form>
  );
}

function CampaignFormBlock({ form, setForm, onSubmit, submitting }: { form: CampaignForm, setForm: any, onSubmit: any, submitting: boolean }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-3xl backdrop-blur-sm animate-in slide-in-from-top-4 duration-300">
      <div className="grid gap-6 sm:grid-cols-3">
        <Input 
          label="Campaign Title" 
          value={form.title} 
          onChange={(v: string) => setForm((p: any) => ({ ...p, title: v }))} 
          placeholder="e.g., BLACK FRIDAY PREMIUM" 
        />
        <Input 
          label="Vector Tag Trigger" 
          value={form.tag} 
          onChange={(v: string) => setForm((p: any) => ({ ...p, tag: v }))} 
          placeholder="e.g., black-friday" 
        />
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Discount Percentage</label>
          <input
            type="number"
            min="1"
            max="100"
            value={form.discount}
            onChange={(e) => setForm((p: any) => ({ ...p, discount: parseInt(e.target.value) || 0 }))}
            className="w-full bg-zinc-900 border border-zinc-800/80 text-zinc-100 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:border-zinc-600 transition-all focus:bg-zinc-950"
          />
        </div>
      </div>

      <button disabled={submitting} className="bg-white hover:bg-zinc-200 text-black px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50">
        {submitting ? <Loader2 className="animate-spin" size={14} /> : "Deploy Campaign"}
      </button>
    </form>
  );
}

/* 🎨 CORE SUBSIDIARY FIELDS */

function Input({ label, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-zinc-800/80 text-zinc-100 placeholder-zinc-600 px-4 py-3.5 rounded-xl text-sm font-medium outline-none focus:border-zinc-600 transition-all focus:bg-zinc-950"
      />
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-3 border-b-2 font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
        active ? "border-white text-white font-black" : "border-transparent text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${
      active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"
    }`}>
      <span className={`w-1 h-1 rounded-full ${active ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
      {active ? "Active" : "Halted"}
    </span>
  );
}

function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="py-24 text-center flex flex-col items-center justify-center gap-3 bg-zinc-900/20 rounded-3xl border border-zinc-900/60">
      <Loader2 className="animate-spin text-zinc-500" size={24} />
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{label}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-24 text-center border border-dashed border-zinc-800 bg-zinc-900/10 rounded-3xl">
      <p className="text-xs uppercase tracking-widest font-black italic text-zinc-600">{label}</p>
    </div>
  );
}