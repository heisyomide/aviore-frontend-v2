'use client';

import { useState, useEffect, useMemo } from 'react';
import { Star, MessageSquare, Search, Loader2, Quote, Trophy } from 'lucide-react';
import { api } from '@/src/lib/axios';
import ReviewReplyModal from '@/src/components/dashboard/ReviewReplyModal';

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/reviews');
      setReviews(res.data);
    } catch (e) {
      console.error("SENTIMENT_SYNC_ERROR");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return { avg: (sum / reviews.length).toFixed(1), count: reviews.length };
  }, [reviews]);

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          `${r.user.firstName} ${r.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = selectedRating === 'all' || r.rating === selectedRating;
    return matchesSearch && matchesRating;
  });

  if (loading) return <LoadingFeedback />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 pb-32 animate-in fade-in duration-700">
      
      <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
        
        {/* 1. EXECUTIVE RATING HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-zinc-900">
          <div>
            <h1 className="text-2xl font-light text-white uppercase tracking-widest font-sans">
              Store Reputation
            </h1>
            <p className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-[0.2em] mt-1.5">
              Public Sentiment Analysis & Feedback Metrics
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#111113] px-5 py-3.5 rounded-xl border border-zinc-900 shrink-0 w-full sm:w-auto">
             <div className="flex flex-col">
                <span className="text-[8px] font-mono font-bold text-[#ef4444] uppercase tracking-widest">STORE_AVG</span>
                <span className="text-xl font-mono font-bold text-white tracking-tight">{stats.avg}<span className="text-zinc-600 text-xs ml-1">/ 5</span></span>
             </div>
             <div className="w-9 h-9 bg-[#991B1B]/10 border border-[#991B1B]/30 rounded-lg flex items-center justify-center text-[#ef4444]">
                <Trophy size={16} />
             </div>
          </div>
        </div>

        {/* 2. REGISTRY QUERY & RATING FILTERS */}
        <div className="flex flex-col lg:flex-row gap-4">
           <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                placeholder="Search sentiment registry by product title or user identity..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-[#111113] border border-zinc-900 rounded-xl text-xs font-mono tracking-wide text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-700 transition-colors" 
              />
           </div>
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              <FilterButton active={selectedRating === 'all'} onClick={() => setSelectedRating('all')} label="ALL_FEEDBACK" />
              {[5, 4, 3, 2, 1].map(num => (
                <FilterButton 
                  key={num} 
                  active={selectedRating === num} 
                  onClick={() => setSelectedRating(num)} 
                  label={`${num}`} 
                  icon={<Star size={10} fill="currentColor" className="ml-0.5" />} 
                />
              ))}
           </div>
        </div>

        {/* 3. MOBILE VIEW: FEEDBACK STACK */}
        <div className="lg:hidden space-y-4">
          {filteredReviews.map((r) => (
            <div key={r.id} className="bg-[#111113] rounded-xl p-5 border border-zinc-900 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 font-mono font-bold text-sm uppercase">
                       {r.user.firstName?.[0]}
                    </div>
                    <div>
                       <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wide">{r.user.firstName} {r.user.lastName}</h4>
                       <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">{r.product.title}</p>
                    </div>
                 </div>
                 <div className="flex items-center text-amber-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
                    <Star size={9} fill="currentColor" />
                    <span className="text-[9px] font-mono font-bold ml-1">{r.rating}</span>
                 </div>
              </div>

              <div className="bg-zinc-950/40 p-4 rounded-lg border border-zinc-900/60 mb-4 relative">
                 <p className="text-xs font-medium text-zinc-400 italic leading-relaxed tracking-wide">
                   "{r.comment || "Satisfaction verified. No written review submitted."}"
                 </p>
              </div>

              {r.reply ? (
                <div className="bg-zinc-950 p-4 rounded-lg border-l-2 border-[#991B1B]">
                   <p className="text-[8px] font-mono font-bold text-[#ef4444] uppercase tracking-widest mb-1">Corporate Dispatch</p>
                   <p className="text-xs font-medium text-zinc-400 italic">"{r.reply}"</p>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedReview(r)}
                  className="w-full py-3 bg-zinc-950 hover:bg-zinc-900 text-zinc-200 border border-zinc-900 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare size={12} /> Transmit Response Matrix
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 4. DESKTOP VIEW: FEEDBACK REGISTRY MATRIX */}
        <div className="hidden lg:grid gap-6">
          {filteredReviews.map((r) => (
            <div key={r.id} className="bg-[#111113] rounded-xl border border-zinc-900 p-6 shadow-2xl relative group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-950 rounded-lg flex items-center justify-center text-zinc-500 border border-zinc-900 font-mono font-bold text-base transition-colors uppercase">
                    {r.user.firstName?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                       <span className="text-[10px] font-mono font-bold text-[#ef4444] uppercase tracking-wider">{r.product.title}</span>
                       <div className="flex text-amber-500 gap-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-amber-500" : "text-zinc-800"} />)}
                       </div>
                    </div>
                    <h3 className="font-mono font-bold text-zinc-200 text-sm uppercase tracking-wide leading-none">{r.user.firstName} {r.user.lastName}</h3>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
                     {new Date(r.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                   </p>
                </div>
              </div>

              <div className="relative pl-8 mb-6 max-w-4xl">
                 <Quote className="absolute left-0 top-0 text-zinc-900 rotate-180" size={24} />
                 <p className="text-sm font-medium text-zinc-400 italic leading-relaxed tracking-wide">
                   "{r.comment || "Satisfaction verified. No written review submitted."}"
                 </p>
              </div>

              <div className="pt-5 border-t border-zinc-900/40">
                 {r.reply ? (
                   <div className="bg-zinc-950/60 p-4 rounded-xl border-l-2 border-[#991B1B] max-w-3xl">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MessageSquare size={12} className="text-[#ef4444]" />
                        <p className="text-[9px] font-mono font-bold text-[#ef4444] uppercase tracking-widest">TRANSMITTED_DISPATCH</p>
                      </div>
                      <p className="text-xs font-medium text-zinc-400 italic">"{r.reply}"</p>
                   </div>
                 ) : (
                   <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedReview(r)} 
                        className="px-6 py-3 bg-zinc-950 hover:bg-zinc-900 text-zinc-200 border border-zinc-900 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <MessageSquare size={12} /> Transmit Reply Matrix
                      </button>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>

        {/* 5. EXCEPTION CONTROLS */}
        {filteredReviews.length === 0 && <EmptyFeedback />}
      </div>

      <ReviewReplyModal isOpen={!!selectedReview} onClose={() => setSelectedReview(null)} review={selectedReview} onRefresh={fetchReviews} />
    </div>
  );
}

/* --- UTILITY COMPONENTS --- */

function FilterButton({ active, onClick, label, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest flex items-center transition-colors shrink-0 border cursor-pointer ${
        active 
          ? 'bg-[#991B1B] text-white border-[#991B1B]' 
          : 'bg-[#111113] text-zinc-500 border-zinc-900 hover:text-zinc-300'
      }`}
    >
      {label}{icon}
    </button>
  );
}

function LoadingFeedback() {
  return (
    <div className="h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-5">
      <Loader2 className="animate-spin text-[#991B1B]" size={36} />
      <p className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
        Synchronizing Reputation Stream Node...
      </p>
    </div>
  );
}

function EmptyFeedback() {
  return (
    <div className="py-24 text-center border border-zinc-900 border-dashed rounded-xl flex flex-col items-center gap-4 bg-[#111113]/40">
      <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl text-zinc-700">
        <Quote size={24} />
      </div>
      <div className="space-y-1.5">
        <p className="text-zinc-400 font-mono font-bold uppercase text-[10px] tracking-widest">No Feedback Registered</p>
        <p className="text-zinc-600 text-[9px] uppercase font-mono tracking-tight">
          Maintain active fulfillment vectors to collect marketplace performance verification metrics.
        </p>
      </div>
    </div>
  );
}