'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Zap, ArrowLeft, ChevronRight, Sparkles, Loader2,
  Package, TrendingUp, Trash2, AlertCircle, Share2, 
  Target, Globe, Calendar
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';
import JoinCampaignDrawer from '@/src/components/vendor/JoinCampaignDrawer';

// --- INTERFACES (PRESERVED) ---
interface Product { id: string; title: string; price: number; }
interface ParticipationNode {
  id: string; title: string; discount: number; endDate: string; shareLink: string; products: Product[];
  stats: { totalSales: number; usageRate: string; };
}
interface CampaignNode { id: string; title: string; code: string; description?: string; discount: number; endDate: string; }

export default function VendorCampaignDiscovery() {
  const [availableCampaigns, setAvailableCampaigns] = useState<CampaignNode[]>([]);
  const [participations, setParticipations] = useState<ParticipationNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignNode | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [availableRes, activeRes] = await Promise.all([
        api.get('/coupons/active-campaigns'),
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
    toast.success("GROWTH_LINK_COPIED");
  };

  const handleWithdrawArtifact = async (campaignId: string, productId: string) => {
    const promise = api.delete(`/vendor/marketing/campaigns/${campaignId}/artifacts/${productId}`);
    toast.promise(promise, {
      loading: 'De-registering artifact...',
      success: () => { fetchData(); return 'Artifact withdrawn.'; },
      error: 'Withdrawal failed.'
    });
  };

  if (loading && availableCampaigns.length === 0) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-32 animate-in fade-in duration-700 text-zinc-100">
      
      {/* 🚀 1. STICKY MOBILE LABEL (Top-Left Identity) */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-md py-6 flex justify-between items-center border-b border-zinc-900/60">
        <div className="flex flex-col gap-1">
          <Link href="/vendor/marketing" className="flex items-center gap-1 text-[8px] font-bold uppercase text-zinc-400 tracking-widest font-mono mb-1">
             <ArrowLeft size={10}/> Marketing Core
          </Link>
          <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">
            Campaigns
          </h1>
        </div>
        <button className="relative p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-zinc-400">
          <Globe size={16} className="text-zinc-300" />
        </button>
      </div>

      <div className="space-y-10 mt-10 max-w-7xl mx-auto">

        {/* 🚀 2. MOBILE QUICK STATS GRID */}
        <div className="lg:hidden grid grid-cols-2 gap-4">
           <div className="bg-[#111113] border border-zinc-900 p-5 rounded-2xl flex flex-col">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Active Links</span>
              <p className="text-lg font-light font-mono text-zinc-200 mt-2 tracking-tight">{participations.length} Nodes Operational</p>
           </div>
           <div className="bg-[#111113] border border-zinc-900 p-5 rounded-2xl flex flex-col">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Open Events</span>
              <p className="text-lg font-light font-mono text-zinc-200 mt-2 tracking-tight">{availableCampaigns.length} Open Pipelines</p>
           </div>
        </div>

        {/* 💻 DESKTOP HEADER COG */}
        <div className="hidden lg:block space-y-4 border-b border-zinc-900/40 pb-6">
          <Link href="/vendor/marketing" className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all group font-mono">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Marketing Protocol Registry
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-500">
              <Zap size={12} className="text-zinc-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest font-mono">Growth_Acceleration_Matrix</span>
            </div>
            <h1 className="text-3xl font-bold tracking-widest text-white uppercase font-sans">Campaign Discovery</h1>
          </div>
        </div>

        {/* 📦 ACTIVE PARTICIPATION REGISTRY */}
        {participations.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 px-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Active_Protocol_Participation</span>
              <div className="h-[1px] flex-1 bg-zinc-900/60" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {participations.map((p) => (
                <div key={p.id} className="bg-[#111113] rounded-2xl p-6 lg:p-8 border border-zinc-900 animate-in fade-in duration-500 hover:border-zinc-800 transition-all shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="text-xl font-medium text-white uppercase tracking-wider leading-none">{p.title}</h3>
                       <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block mt-2">{p.discount}% Yield Node Allocation</span>
                    </div>
                    <PerformanceBadge rate={p.stats.usageRate} />
                  </div>
                  
                  <div className="bg-zinc-950 border border-zinc-900/60 rounded-xl p-5 mb-6">
                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono mb-3">Injected Artifacts Lineup ({p.products.length})</p>
                    <div className="flex flex-wrap gap-2">
                       {p.products.map(item => (
                         <span key={item.id} className="group relative px-3 py-1.5 bg-zinc-900 border border-zinc-800/80 rounded-md text-[9px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-2 font-mono">
                            <Package size={10} className="text-zinc-500" /> {item.title}
                            <button onClick={() => handleWithdrawArtifact(p.id, item.id)} className="text-zinc-600 hover:text-[#991b1b] transition-colors cursor-pointer">
                               <Trash2 size={10} />
                            </button>
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => handleCopyLink(p.shareLink)} className="flex-1 h-12 bg-zinc-100 text-zinc-950 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
                      <Share2 size={12} /> Copy Node Network Access Link
                    </button>
                    <Link href={`/vendor/marketing/participations/${p.id}`} className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
                       <TrendingUp size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🌍 GLOBAL DISCOVERY REGISTRY */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Campaigns_Available_Pipelines</span>
            <div className="h-[1px] flex-1 bg-zinc-900/60" />
          </div>

          <div className="grid gap-4">
            {availableCampaigns.length > 0 ? (
              availableCampaigns.map((camp) => (
                <CampaignRow key={camp.id} campaign={camp} onSelect={() => setSelectedCampaign(camp)} />
              ))
            ) : (
              <div className="py-20 text-center bg-[#111113] rounded-2xl border border-zinc-900 shadow-xl">
                 <AlertCircle size={32} strokeWidth={1} className="mx-auto text-zinc-700 mb-4" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 font-mono">No active platform cycles found inside registration ledger.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCampaign && (
        <JoinCampaignDrawer 
          campaign={selectedCampaign} isOpen={!!selectedCampaign} 
          onClose={() => setSelectedCampaign(null)}
          onSuccess={() => { setSelectedCampaign(null); fetchData(); }}
        />
      )}
    </div>
  );
}

/* --- COMPONENTS (PRESERVED CONTEXT) --- */

function CampaignRow({ campaign, onSelect }: { campaign: CampaignNode, onSelect: () => void }) {
  return (
    <div className="bg-[#111113] border border-zinc-900 rounded-2xl p-6 flex flex-col md:grid md:grid-cols-12 items-center gap-6 hover:border-zinc-800 transition-all duration-300 group shadow-xl active:scale-[0.99]">
      <div className="md:col-span-7 flex items-center gap-5 w-full">
        <div className="shrink-0 w-12 h-12 bg-zinc-900 border border-zinc-800/80 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-all shadow-inner">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="text-xl font-medium text-white uppercase tracking-wider leading-none group-hover:text-zinc-300 transition-colors">{campaign.title}</h3>
          <p className="text-[10px] text-zinc-500 uppercase font-medium mt-2 tracking-wide leading-relaxed line-clamp-1">{campaign.description || "Node optimization network distribution protocol initialized."}</p>
        </div>
      </div>
      <div className="md:col-span-3 flex justify-between w-full md:px-4 font-mono">
         <div className="flex flex-col">
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Proposed Yield</span>
            <span className="text-sm font-medium text-zinc-300 mt-0.5">{campaign.discount}% OFF</span>
         </div>
         <div className="flex flex-col text-right">
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Pipeline Expiry</span>
            <span className="text-[10px] font-medium text-zinc-400 mt-0.5 uppercase">{new Date(campaign.endDate).toLocaleDateString()}</span>
         </div>
      </div>
      <div className="md:col-span-2 w-full flex justify-end">
        <button onClick={onSelect} className="w-full md:w-auto h-11 px-5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-sans">
          Inject_Node <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

function PerformanceBadge({ rate }: { rate: string }) {
  const numericRate = parseFloat(rate);
  if (numericRate >= 5) return (
    <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-[#991b1b] rounded-md text-[8px] font-bold uppercase font-mono flex items-center gap-1.5 tracking-wider">
      <Target size={10} /> HIGH_YIELD_NODE
    </span>
  );
  return <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-md text-[8px] font-bold uppercase font-mono tracking-wider">ACTIVE_PIPELINE</span>;
}

// Full 70vh state preserved inside component hierarchy
function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] gap-4">
      <Loader2 className="animate-spin text-[#991b1b]" size={28} />
      <p className="text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase">Synchronizing Campaign Protocol Ledgers...</p>
    </div>
  );
}