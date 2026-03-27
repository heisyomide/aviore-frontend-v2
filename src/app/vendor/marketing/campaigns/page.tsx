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
    toast.success("GROWTH_LINK_COPIED");
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
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10">
      
      {/* 📱 MOBILE VIEW: Logistics Hub Header */}
      <div className="lg:hidden animate-in fade-in duration-500">
        <div className="bg-[#1E293B] p-6 pt-12 pb-12 rounded-b-[2.5rem] text-white flex justify-between items-center shadow-2xl relative z-10">
          <div className="flex flex-col gap-1">
            <Link href="/vendor/marketing" className="flex items-center gap-1 text-[8px] font-black uppercase text-blue-400 tracking-widest italic mb-1">
               <ArrowLeft size={10}/> Marketing Hub
            </Link>
            <h1 className="text-2xl font-black tracking-tighter italic uppercase leading-none">Campaign Nodes</h1>
            <p className="opacity-50 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">Growth Discovery Registry</p>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-full border border-slate-700">
             <Globe size={20} className="text-blue-500 animate-spin-slow" />
          </div>
        </div>

        {/* Mobile Stats Summary Overlay */}
        <div className="px-6 -mt-8 grid grid-cols-2 gap-4 relative z-20">
           <div className="bg-blue-600 p-5 rounded-[2rem] text-white shadow-xl">
              <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Active Links</span>
              <p className="text-xl font-black italic tracking-tighter mt-1">{participations.length} Active</p>
           </div>
           <div className="bg-slate-700 p-5 rounded-[2rem] text-white shadow-xl">
              <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Open Events</span>
              <p className="text-xl font-black italic tracking-tighter mt-1">{availableCampaigns.length} Open</p>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 p-6 lg:p-10">
        
        {/* 💻 DESKTOP HEADER (Hidden on Mobile) */}
        <div className="hidden lg:block space-y-4">
          <Link href="/vendor/marketing" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Marketing Protocol
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <Zap size={14} fill="currentColor" className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Growth_Acceleration_Matrix</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Campaign </h1>
          </div>
        </div>

        {/* 📦 ACTIVE PARTICIPATION REGISTRY */}
        {participations.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic underline underline-offset-4 decoration-blue-500/50">Active_Protocol_Participation</span>
              <div className="h-px w-full bg-slate-200" />
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-4xl border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-8 py-5">Campaign Name</th>
                    <th className="px-8 py-5">Assigned Artifacts</th>
                    <th className="px-8 py-5">Discovery Node</th>
                    <th className="px-8 py-5 text-right">Yield Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {participations.map((p) => (
                    <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-8 align-top">
                        <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{p.title}</p>
                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1.5">{p.discount}% DISCOUNT PROTOCOL</p>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-wrap gap-2">
                          {p.products.map((item) => (
                            <div key={item.id} className="group/item relative">
                              <span className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 flex items-center gap-2 group-hover/item:border-red-100 group-hover/item:bg-white transition-all">
                                <Package size={12} className="text-blue-500" /> {item.title}
                              </span>
                              <button 
                                onClick={() => handleWithdrawArtifact(p.id, item.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <button 
                          onClick={() => handleCopyLink(p.shareLink)}
                          className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white hover:bg-blue-600 rounded-2xl transition-all text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-100"
                        >
                          <Share2 size={12} /> Share Node
                        </button>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="inline-flex flex-col items-end gap-2">
                          <PerformanceBadge rate={p.stats.usageRate} />
                          <div className="text-right">
                             <span className="text-sm font-black text-slate-900 italic leading-none">{p.stats.usageRate} Rate</span>
                             <p className="text-[8px] font-bold uppercase text-slate-400 mt-1">{p.stats.totalSales} Units Fulfilling</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Participation List */}
            <div className="lg:hidden space-y-4">
              {participations.map((p) => (
                <div key={p.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 animate-in fade-in duration-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-tight">{p.title}</h3>
                       <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{p.discount}% Yield Node</span>
                    </div>
                    <PerformanceBadge rate={p.stats.usageRate} />
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-4">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Injected Artifacts ({p.products.length})</p>
                    <div className="flex flex-wrap gap-2">
                       {p.products.slice(0, 3).map(item => (
                         <span key={item.id} className="px-3 py-1.5 bg-white rounded-lg text-[9px] font-bold text-slate-600 border border-slate-100">{item.title}</span>
                       ))}
                       {p.products.length > 3 && <span className="text-[9px] font-black text-slate-300">+{p.products.length - 3} More</span>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleCopyLink(p.shareLink)} className="flex-1 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <Share2 size={14} /> Copy Node
                    </button>
                    <Link href={`/vendor/marketing/participations/${p.id}`} className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 active:scale-90 transition-transform">
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
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic underline underline-offset-4 decoration-blue-500/50">Campaigns_Available</span>
            <div className="h-px w-full bg-slate-200" />
          </div>

          <div className="grid gap-4">
            {availableCampaigns.length > 0 ? (
              availableCampaigns.map((camp) => (
                <CampaignRow key={camp.id} campaign={camp} onSelect={() => setSelectedCampaign(camp)} />
              ))
            ) : (
              <div className="py-24 text-center bg-white rounded-4xl border border-slate-100 shadow-sm">
                 <AlertCircle size={48} className="mx-auto text-slate-100 mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">No active platform cycles found in global registry.</p>
              </div>
            )}
          </div>
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

/* --- COMPONENTS --- */

function PerformanceBadge({ rate }: { rate: string }) {
  const numericRate = parseFloat(rate);
  if (numericRate >= 5) return (
    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase border border-emerald-100 flex items-center gap-1">
      <Target size={10} /> HIGH_YIELD
    </span>
  );
  if (numericRate > 0 && numericRate < 2) return (
    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[8px] font-black uppercase border border-orange-100">
      LOW_LIQUIDITY
    </span>
  );
  return null;
}

function CampaignRow({ campaign, onSelect }: { campaign: CampaignNode, onSelect: () => void }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-7 flex flex-col md:grid md:grid-cols-12 items-center gap-6 hover:border-blue-200 transition-all duration-300 group shadow-sm">
      <div className="md:col-span-7 flex items-center gap-6 w-full">
        <div className="shrink-0 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-50 group-hover:border-blue-100">
          <Sparkles size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors leading-none">{campaign.title}</h3>
          <p className="text-[10px] lg:text-[11px] font-bold text-slate-400 italic line-clamp-1 uppercase mt-2 tracking-tight">{campaign.description || "Node optimization protocol active."}</p>
        </div>
      </div>
      <div className="md:col-span-3 flex justify-between w-full md:px-4">
         <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Proposed Yield</span>
            <span className="text-xl font-black italic text-blue-600">{campaign.discount}% REDUCTION</span>
         </div>
         <div className="flex flex-col text-right">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Registry Exp</span>
            <span className="text-[10px] font-black italic uppercase text-slate-900">{new Date(campaign.endDate).toLocaleDateString()}</span>
         </div>
      </div>
      <div className="md:col-span-2 w-full flex justify-end">
        <button onClick={onSelect} className="w-full md:w-auto h-14 px-8 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3">
          Inject_Node <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400 animate-pulse">Synchronizing_Campaign_Registry...</p>
    </div>
  );
}