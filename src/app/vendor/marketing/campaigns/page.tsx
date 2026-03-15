'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Zap, ArrowLeft, ChevronRight, Sparkles, Loader2,
  Package, TrendingUp, Trash2, AlertCircle, Share2
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';
import JoinCampaignDrawer from '@/src/components/vendor/JoinCampaignDrawer';

// --- INTERFACES ---
interface Product {
  id: string;
  title: string;
  price: number;
}

interface ParticipationNode {
  id: string;
  title: string;
  discount: number;
  endDate: string;
  shareLink: string;
  products: Product[];
  stats: {
    totalSales: number;
    usageRate: string;
  };
}

interface CampaignNode {
  id: string;
  title: string;
  code: string;
  description?: string;
  discount: number;
  endDate: string;
}

export default function VendorCampaignDiscovery() {
  const [availableCampaigns, setAvailableCampaigns] = useState<CampaignNode[]>([]);
  const [participations, setParticipations] = useState<ParticipationNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignNode | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [availableRes, activeRes] = await Promise.all([
        api.get('/vendor/marketing/campaigns/available'),
        api.get('/vendor/marketing/participations/summary')
      ]);
      setAvailableCampaigns(availableRes.data);
      setParticipations(activeRes.data);
    } catch (error) {
      toast.error("PROTOCOL_SYNC_FAILURE");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("GROWTH_LINK_COPIED", {
      description: "Share this URL to drive traffic."
    });
  };

  const handleWithdrawArtifact = async (campaignId: string, productId: string) => {
    const promise = api.delete(`/vendor/marketing/campaigns/${campaignId}/artifacts/${productId}`);
    toast.promise(promise, {
      loading: 'De-registering artifact...',
      success: () => {
        fetchData();
        return 'Artifact withdrawn.';
      },
      error: 'Withdrawal failed.'
    });
  };

  if (loading && availableCampaigns.length === 0) return <LoadingState />;

  return (
    <div className="max-w-6xl mx-auto space-y-12 p-4 md:p-8 animate-in fade-in duration-500 pb-24">
      
      {/* 1. HEADER */}
      <div className="space-y-4">
        <Link href="/vendor/marketing" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-all group">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Protocol_Hub
        </Link>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#A4143D]">
            <Zap size={12} fill="currentColor" className="animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Global_Growth_Registry</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Campaigns</h1>
        </div>
      </div>

      {/* 2. ACTIVE INVENTORY TABLE */}
      {participations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap italic underline underline-offset-4 decoration-orange-500/50">Active_Participation_Registry</span>
            <div className="h-px w-full bg-slate-100" />
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Campaign</th>
                    <th className="px-6 py-4">Injected_Artifacts</th>
                    <th className="px-6 py-4">Growth_Node</th>
                    <th className="px-6 py-4 text-right">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {participations.map((p) => (
                    <tr key={p.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-6 align-top">
                        <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{p.title}</p>
                        <p className="text-[8px] font-bold text-orange-600 uppercase tracking-widest mt-1">{p.discount}% OFF</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-2">
                          {p.products.map((item) => (
                            <div key={item.id} className="group/item relative">
                              <span className="pl-2.5 pr-7 py-1.5 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 flex items-center gap-2">
                                <Package size={10} className="text-[#A4143D]" /> {item.title}
                              </span>
                              <button 
                                onClick={() => handleWithdrawArtifact(p.id, item.id)}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <button 
                          onClick={() => handleCopyLink(p.shareLink)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg border border-slate-100 transition-all text-[9px] font-black uppercase tracking-widest"
                        >
                          <Share2 size={10} /> Copy Link
                        </button>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="inline-flex flex-col items-end gap-1.5">
                          <PerformanceBadge rate={p.stats.usageRate} />
                          <div className="text-right leading-none">
                             <span className="text-xs font-black text-slate-900 italic">{p.stats.usageRate} Rate</span>
                             <p className="text-[8px] font-black uppercase text-slate-300 mt-1">{p.stats.totalSales} Units</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. DISCOVERY REGISTRY */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap italic underline underline-offset-4 decoration-orange-500/50">Available_Discovery_Nodes</span>
          <div className="h-px w-full bg-slate-100" />
        </div>

        <div className="grid gap-4">
          {availableCampaigns.length > 0 ? (
            availableCampaigns.map((camp) => (
              <CampaignRow key={camp.id} campaign={camp} onSelect={() => setSelectedCampaign(camp)} />
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/30">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Node Sync: No active platform events found.</p>
            </div>
          )}
        </div>
      </div>

      {selectedCampaign && (
        <JoinCampaignDrawer 
          campaign={selectedCampaign} 
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onSuccess={() => {
            setSelectedCampaign(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PerformanceBadge({ rate }: { rate: string }) {
  const numericRate = parseFloat(rate);
  if (numericRate >= 5) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[7px] font-black uppercase border border-emerald-100">
      High_Conversion
    </span>
  );
  if (numericRate > 0 && numericRate < 2) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md text-[7px] font-black uppercase border border-orange-100">
      Low_Traction
    </span>
  );
  return null;
}

function CampaignRow({ campaign, onSelect }: { campaign: CampaignNode, onSelect: () => void }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-7 flex flex-col md:grid md:grid-cols-12 items-center gap-6 hover:border-orange-500/30 transition-all duration-300 group">
      <div className="md:col-span-7 flex items-center gap-5 w-full">
        <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all">
          <Sparkles size={20} />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-orange-600 transition-colors">{campaign.title}</h3>
          <p className="text-[11px] font-medium text-slate-400 italic line-clamp-1 uppercase tracking-tight">{campaign.description}</p>
        </div>
      </div>
      <div className="md:col-span-3 flex justify-between w-full md:px-4">
         <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-300 uppercase">Yield</span>
            <span className="text-lg font-black italic text-[#A4143D]">{campaign.discount}% OFF</span>
         </div>
         <div className="flex flex-col text-right">
            <span className="text-[7px] font-black text-slate-300 uppercase">Exp</span>
            <span className="text-[9px] font-black italic uppercase text-slate-900">{new Date(campaign.endDate).toLocaleDateString()}</span>
         </div>
      </div>
      <div className="md:col-span-2 w-full flex justify-end">
        <button onClick={onSelect} className="w-full md:w-auto h-12 px-6 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-orange-600 transition-all shadow-md active:scale-95">
          Inject_Node
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin text-orange-600" size={32} />
      <p className="text-[9px] font-black uppercase tracking-[0.4em] italic animate-pulse">Syncing_Campaign_Registry</p>
    </div>
  );
}