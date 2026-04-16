"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Ticket,
  Megaphone,
  Image as ImageIcon,
  Plus,
  Loader2,
  X,
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
  usedCount: number;
  isActive: boolean;
}

interface Campaign {
  id: string;
  title: string;
  discount: number;
  isActive: boolean;
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
  imageUrl: string;
}

const initialHeroForm: HeroForm = {
  title: "",
  subtitle: "",
  discount: "",
  tag: "",
  imageUrl: "",
};

export default function AdminPromotionsPage() {
  const [activeTab, setActiveTab] =
    useState<AdminTab>("HERO_BANNERS");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] =
    useState(false);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [heroForm, setHeroForm] =
    useState<HeroForm>(initialHeroForm);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [couponRes, campaignRes, bannerRes] =
        await Promise.all([
          api.get("/admin/coupons"),
          api.get("/admin/campaigns"),
          api.get("/admin/banners"),
        ]);

      setCoupons(couponRes.data || []);
      setCampaigns(campaignRes.data || []);
      setHeroBanners(bannerRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync promotions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateHeroField = (
    key: keyof HeroForm,
    value: string
  ) => {
    setHeroForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateHeroBanner = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/admin/banners", heroForm);

      toast.success("Hero banner created successfully");

      setHeroForm(initialHeroForm);
      setCreating(false);

      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create banner");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      <Header
        creating={creating}
        setCreating={setCreating}
      />

      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {creating &&
        activeTab === "HERO_BANNERS" && (
          <HeroBannerForm
            form={heroForm}
            onChange={updateHeroField}
            onSubmit={handleCreateHeroBanner}
            submitting={submitting}
          />
        )}

      {activeTab === "HERO_BANNERS" && (
        <HeroBannerTable
          banners={heroBanners}
          loading={loading}
        />
      )}
    </div>
  );
}

function Header({
  creating,
  setCreating,
}: {
  creating: boolean;
  setCreating: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) {
  return (
    <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
      <h1 className="text-4xl lg:text-5xl font-black">
        Promotions Center
      </h1>

      <button
        onClick={() => setCreating(!creating)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
      >
        {creating ? <X size={18} /> : <Plus size={18} />}
        {creating ? "Cancel" : "Create Banner"}
      </button>
    </div>
  );
}

function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}) {
  return (
    <div className="flex gap-8 border-b pb-4">
      <TabButton
        active={activeTab === "COUPONS"}
        onClick={() => setActiveTab("COUPONS")}
        label="Coupons"
        icon={<Ticket size={16} />}
      />

      <TabButton
        active={activeTab === "CAMPAIGNS"}
        onClick={() => setActiveTab("CAMPAIGNS")}
        label="Campaigns"
        icon={<Megaphone size={16} />}
      />

      <TabButton
        active={activeTab === "HERO_BANNERS"}
        onClick={() =>
          setActiveTab("HERO_BANNERS")
        }
        label="Hero Banners"
        icon={<ImageIcon size={16} />}
      />
    </div>
  );
}

function HeroBannerForm({
  form,
  onChange,
  onSubmit,
  submitting,
}: any) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 bg-zinc-900 p-8 rounded-3xl"
    >
      <Input
        label="Title"
        value={form.title}
        onChange={(v: string) =>
          onChange("title", v)
        }
      />

      <Input
        label="Subtitle"
        value={form.subtitle}
        onChange={(v: string) =>
          onChange("subtitle", v)
        }
      />

      <Input
        label="Discount"
        value={form.discount}
        onChange={(v: string) =>
          onChange("discount", v)
        }
      />

      <Input
        label="Tag"
        value={form.tag}
        onChange={(v: string) =>
          onChange("tag", v)
        }
      />

      <Input
        label="Image URL"
        value={form.imageUrl}
        onChange={(v: string) =>
          onChange("imageUrl", v)
        }
      />

      <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">
        {submitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Create Banner"
        )}
      </button>
    </form>
  );
}

function HeroBannerTable({
  banners,
  loading,
}: {
  banners: HeroBanner[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <p className="text-zinc-400">
        Loading banners...
      </p>
    );
  }

  if (!banners.length) {
    return (
      <p className="text-zinc-500">
        No banners created yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900"
        >
          <h3 className="text-xl font-black">
            {banner.title}
          </h3>
          <p>{banner.subtitle}</p>
          <p>{banner.discount}</p>
          <p>{banner.tag}</p>
        </div>
      ))}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: any) {
  return (
    <div className="space-y-2">
      <label className="font-medium">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full bg-zinc-800 px-4 py-3 rounded-xl outline-none"
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 font-semibold ${
        active
          ? "text-indigo-500"
          : "text-zinc-500"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}