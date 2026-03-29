'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Zap, ArrowLeft, ChevronRight, Sparkles, Loader2,
  Package, TrendingUp, Trash2, AlertCircle, Share2, 
  Target, Globe, Calendar, Gift, Bell
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
    <div className="min-h-screen bg-white lg:bg-[#FAFAFA] pb-32 animate-in fade-in duration-700">
      
      {/* 🚀 1. STICKY MOBILE LABEL (Top-Left Identity) */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-8 flex justify-between items-center border-b border-slate-50">
        <div className="flex flex-col gap-1">
          <Link href="/vendor/marketing" className="flex items-center gap-1 text-[8px] font-black uppercase text-blue-600 tracking-widest italic mb-1">
             <ArrowLeft size={10}/> Marketing Hub
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Campaigns
          </h1>
          <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
        </div>
        <button className="relative p-2 text-slate-400">
          <Globe size={24} className="text-blue-500 animate-spin-slow" />
        </button>
      </div>

      <div className="px-6 lg:px-10 space-y-10 mt-6 max-w-7xl mx-auto">

        {/* 🚀 2. MOBILE STATS OVERLAP (Preserved Context) */}
        <div className="lg:hidden grid grid-cols-2 gap-4">
           <div className="bg-blue-600 p-6 rounded-[2.2rem] text-white shadow-xl active:scale-95 transition-all">
              <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Active Links</span>
              <p className="text-xl font-black italic tracking-tighter mt-1">{participations.length} Active</p>
           </div>
           <div className="bg-slate-900 p-6 rounded-[2.2rem] text-white shadow-xl active:scale-95 transition-all">
              <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Open Events</span>
              <p className="text-xl font-black italic tracking-tighter mt-1">{availableCampaigns.length} Open</p>
           </div>
        </div>

        {/* 💻 DESKTOP HEADER (Preserved Context) */}
        <div className="hidden lg:block space-y-4">
          <Link href="/vendor/marketing" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Marketing Protocol
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <Zap size={14} fill="currentColor" className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Growth_Acceleration_Matrix</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Campaign Discovery</h1>
          </div>
        </div>

        {/* 📦 ACTIVE PARTICIPATION REGISTRY */}
        {participations.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Active_Protocol_Participation</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {participations.map((p) => (
                <div key={p.id} className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-slate-100 animate-in fade-in duration-500 hover:border-blue-200 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">{p.title}</h3>
                       <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{p.discount}% Yield Node</span>
                    </div>
                    <PerformanceBadge rate={p.stats.usageRate} />
                  </div>
                  
                  <div className="bg-slate-50 rounded-3xl p-5 mb-8">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Injected Artifacts ({p.products.length})</p>
                    <div className="flex flex-wrap gap-2">
                       {p.products.map(item => (
                         <span key={item.id} className="group relative px-3 py-2 bg-white rounded-xl text-[9px] font-bold text-slate-600 border border-slate-100 hover:border-red-100 transition-all">
                            <Package size={10} className="inline mr-1 text-blue-500" /> {item.title}
                            <button onClick={() => handleWithdrawArtifact(p.id, item.id)} className="ml-2 text-slate-300 hover:text-red-500">
                               <Trash2 size={10} />
                            </button>
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => handleCopyLink(p.shareLink)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                      <Share2 size={14} /> Copy Node
                    </button>
                    <Link href={`/vendor/marketing/participations/${p.id}`} className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 active:scale-90 transition-all">
                       <TrendingUp size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🌍 GLOBAL DISCOVERY REGISTRY */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Campaigns_Available</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-4">
            {availableCampaigns.length > 0 ? (
              availableCampaigns.map((camp) => (
                <CampaignRow key={camp.id} campaign={camp} onSelect={() => setSelectedCampaign(camp)} />
              ))
            ) : (
              <div className="py-24 text-center bg-white rounded-4xl border border-slate-100 shadow-sm">
                 <AlertCircle size={48} className="mx-auto text-slate-100 mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">No active platform cycles found.</p>
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
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-7 flex flex-col md:grid md:grid-cols-12 items-center gap-6 hover:border-blue-200 transition-all duration-300 group shadow-sm active:scale-[0.99]">
      <div className="md:col-span-7 flex items-center gap-6 w-full">
        <div className="shrink-0 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-50">
          <Sparkles size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors leading-none">{campaign.title}</h3>
          <p className="text-[10px] font-bold text-slate-400 italic line-clamp-1 uppercase mt-2">{campaign.description || "Node optimization protocol active."}</p>
        </div>
      </div>
      <div className="md:col-span-3 flex justify-between w-full md:px-4">
         <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Proposed Yield</span>
            <span className="text-xl font-black italic text-blue-600">{campaign.discount}%</span>
         </div>
         <div className="flex flex-col text-right">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Expiry</span>
            <span className="text-[10px] font-black italic uppercase text-slate-900">{new Date(campaign.endDate).toLocaleDateString()}</span>
         </div>
      </div>
      <div className="md:col-span-2 w-full flex justify-end">
        <button onClick={onSelect} className="w-full md:w-auto h-14 px-8 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
          Inject_Node <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function PerformanceBadge({ rate }: { rate: string }) {
  const numericRate = parseFloat(rate);
  if (numericRate >= 5) return (
    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase border border-emerald-100 flex items-center gap-1 italic">
      <Target size={10} /> HIGH_YIELD
    </span>
  );
  return <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase border border-slate-100 italic">ACTIVE_PROTOCOL</span>;
}

function LoadingState() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400 animate-pulse">Synchronizing_Campaign_Registry...</p>
    </div>
  );
}