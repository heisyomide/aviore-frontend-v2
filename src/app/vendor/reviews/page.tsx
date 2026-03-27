'use client';
import { useState, useEffect, useMemo } from 'react';
import { Star, MessageSquare, Flag, Search, Loader2, Quote, Trophy, Filter, ChevronRight, User } from 'lucide-react';
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
      console.error("Feedback_Sync_Error");
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
    <div className="min-h-screen bg-[#F4F7FE] lg:bg-[#FAFAFA] pb-32 lg:pb-10">
      
      {/* 🚀 EXECUTIVE HEADER */}
      <div className="p-6 lg:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">STORE REPUTATION</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">PUBLIC FEEDBACK & RATINGS</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900 px-6 py-4 rounded-2xl shadow-xl border border-slate-800 shrink-0">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">STORE AVG</span>
                <span className="text-xl font-black text-white italic">{stats.avg}<span className="text-slate-500 text-xs ml-1">/ 5</span></span>
             </div>
             <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                <Trophy size={20} strokeWidth={3} />
             </div>
          </div>
        </div>

        {/* SEARCH & FILTER PROTOCOL */}
        <div className="flex flex-col lg:flex-row gap-4">
           <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                placeholder="SEARCH FEEDBACK REVIEWS..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" 
              />
           </div>
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
              <FilterButton active={selectedRating === 'all'} onClick={() => setSelectedRating('all')} label="All" />
              {[5, 4, 3, 2, 1].map(num => (
                <FilterButton key={num} active={selectedRating === num} onClick={() => setSelectedRating(num)} label={`${num}`} icon={<Star size={10} fill="currentColor" />} />
              ))}
           </div>
        </div>

        {/* 📱 MOBILE VIEW: Feedback Card Stack */}
        <div className="lg:hidden space-y-4">
          {filteredReviews.map((r) => (
            <div key={r.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 animate-in fade-in duration-500">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black border border-blue-100 uppercase italic">
                       {r.user.firstName?.[0]}
                    </div>
                    <div>
                       <h4 className="text-xs font-black text-slate-900 uppercase italic">{r.user.firstName} {r.user.lastName}</h4>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{r.product.title}</p>
                    </div>
                 </div>
                 <div className="flex text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[10px] font-black ml-1">{r.rating}</span>
                 </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl mb-6 relative">
                 <Quote className="absolute -top-2 -left-1 text-blue-100 rotate-180" size={24} />
                 <p className="text-sm font-bold text-slate-700 italic leading-relaxed tracking-tight relative z-10">
                   {r.comment || "Null feedback registered."}
                 </p>
              </div>

              {r.reply ? (
                <div className="bg-[#0F172A] p-5 rounded-2xl border-l-4 border-blue-500">
                   <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Store Dispatch</p>
                   <p className="text-xs font-bold text-slate-300 italic">"{r.reply}"</p>
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedReview(r)}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <MessageSquare size={14} /> Transmit Response
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 💻 DESKTOP VIEW: Feedback Registry Ledger */}
        <div className="hidden lg:grid gap-6">
          {filteredReviews.map((r) => (
            <div key={r.id} className="bg-white rounded-4xl border border-slate-50 hover:border-blue-100 transition-all p-8 shadow-sm group">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors uppercase italic">
                    {r.user.firstName?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{r.product.title}</span>
                       <div className="flex text-yellow-500 px-1">
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={3} />)}
                       </div>
                    </div>
                    <h3 className="font-black text-slate-900 text-lg uppercase italic tracking-tighter leading-none">{r.user.firstName} {r.user.lastName}</h3>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="relative pl-12 mb-10 max-w-4xl">
                 <Quote className="absolute left-0 top-0 text-slate-50 rotate-180 group-hover:text-blue-50 transition-colors" size={40} />
                 <p className="text-lg font-bold text-slate-700 italic leading-relaxed">
                   {r.comment || "Automated satisfaction node - No comment provided."}
                 </p>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                 {r.reply ? (
                   <div className="bg-slate-900 p-6 rounded-3xl border-l-[8px] border-blue-600 flex-1 max-w-3xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={14} className="text-blue-500" />
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Protocol Response</p>
                      </div>
                      <p className="text-sm font-bold text-slate-300 italic">"{r.reply}"</p>
                   </div>
                 ) : (
                   <div className="flex gap-3">
                      <button onClick={() => setSelectedReview(r)} className="px-10 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-slate-100">
                        <MessageSquare size={16} /> Transmit Reply
                      </button>
                      <button className="px-10 py-4 bg-white border border-slate-100 text-slate-400 hover:text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Flag Node
                      </button>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && <EmptyFeedback />}
      </div>

      <ReviewReplyModal isOpen={!!selectedReview} onClose={() => setSelectedReview(null)} review={selectedReview} onRefresh={fetchReviews} />
    </div>
  );
}

/* 🎨 COMPONENTS */

function FilterButton({ active, onClick, label, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shrink-0 border ${
        active ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
      }`}
    >
      {label} {icon}
    </button>
  );
}

function LoadingFeedback() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Synchronizing Sentiment Registry...</p>
    </div>
  );
}

function EmptyFeedback() {
  return (
    <div className="py-32 text-center flex flex-col items-center gap-4 bg-transparent lg:bg-white lg:rounded-4xl lg:border lg:border-slate-50 lg:m-10">
      <div className="bg-slate-50 p-6 rounded-[2.5rem]"><Quote size={48} className="text-slate-200" /></div>
      <div className="space-y-1">
        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No Feedback Reviews Registered</p>
        <p className="text-slate-300 text-[10px] uppercase font-bold tracking-tighter">Maintain high fulfillment grades to attract public feedback</p>
      </div>
    </div>
  );
}