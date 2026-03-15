'use client';
import { useState, useEffect, useMemo } from 'react';
import { Star, MessageSquare, Flag, Search, Loader2, Quote, Trophy, Filter } from 'lucide-react';
import { api } from '@/src/lib/axios';
import ReviewReplyModal from '@/src/components/dashboard/ReviewReplyModal';

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all'); // Filter state
  const [selectedReview, setSelectedReview] = useState<any>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/reviews');
      setReviews(res.data);
    } catch (e) {
      console.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return { avg: (sum / reviews.length).toFixed(1), count: reviews.length };
  }, [reviews]);

  // Combined Search and Rating Filter
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          `${r.user.firstName} ${r.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = selectedRating === 'all' || r.rating === selectedRating;
    return matchesSearch && matchesRating;
  });

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-600" size={40} strokeWidth={3} />
      <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Syncing Feedback...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white p-8 rounded-[3rem] border-4 border-slate-50 shadow-sm gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Trophy className="text-orange-600" size={28} strokeWidth={3} />
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Store Reputation</h1>
          </div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Public Feedback & Ratings</p>
        </div>

        <div className="bg-slate-900 px-8 py-4 rounded-[2rem] text-center shadow-xl shadow-slate-200">
          <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Store Avg</p>
          <p className="text-2xl font-black text-white">{stats.avg}<span className="text-slate-500 text-xs ml-1">/ 5</span></p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[2.5rem] border-4 border-slate-50">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button 
            onClick={() => setSelectedRating('all')}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedRating === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map((num) => (
            <button 
              key={num}
              onClick={() => setSelectedRating(num)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${selectedRating === num ? 'bg-orange-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              {num} <Star size={12} fill="currentColor" />
            </button>
          ))}
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} strokeWidth={3} />
          <input 
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border-2 border-transparent focus:border-orange-500 rounded-2xl text-[11px] font-black uppercase outline-none"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {filteredReviews.length > 0 ? filteredReviews.map((r) => (
          <div key={r.id} className="bg-white rounded-[2.5rem] border-4 border-slate-50 hover:border-orange-100 transition-all p-8">
            {/* ... Review Content (same as previous refactor) ... */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-orange-100 rounded-[1.5rem] flex items-center justify-center text-orange-600 font-black text-xl border-2 border-orange-200 shrink-0">
                  {r.user.firstName?.[0]}
                </div>
                <div>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.15em] mb-1">{r.product.title}</p>
                  <div className="flex items-center gap-3">
                    <p className="font-black text-slate-900 text-base uppercase tracking-tight">{r.user.firstName} {r.user.lastName}</p>
                    <div className="flex text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={3} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="relative pl-10 mb-8 max-w-3xl">
               <Quote className="absolute left-0 top-0 text-slate-100 rotate-180" size={32} strokeWidth={3} />
               <p className="text-base font-bold text-slate-700 italic leading-relaxed tracking-tight">
                 {r.comment || "Customer did not leave a written review."}
               </p>
            </div>

            <div className="flex flex-col gap-4">
              {r.reply ? (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border-l-[12px] border-orange-600 ml-4 shadow-inner">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={14} className="text-orange-500" strokeWidth={3} />
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Official Store Response</p>
                  </div>
                  <p className="text-sm font-bold text-slate-300 italic leading-relaxed">"{r.reply}"</p>
                </div>
              ) : (
                <div className="flex gap-3 items-center ml-4">
                  <button 
                    onClick={() => setSelectedReview(r)}
                    className="px-8 py-4 bg-slate-900 hover:bg-orange-600 text-white transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-200"
                  >
                    <MessageSquare size={16} strokeWidth={3} /> Post Public Reply
                  </button>
                  <button className="px-8 py-4 bg-white border-2 border-slate-100 hover:border-red-200 hover:text-red-600 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Flag size={16} strokeWidth={3} /> Report to Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
            <p className="font-black text-slate-300 uppercase tracking-[0.3em] text-xs text-center">No matching {selectedRating !== 'all' ? `${selectedRating}-star` : ''} reviews found</p>
          </div>
        )}
      </div>

      <ReviewReplyModal 
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        review={selectedReview}
        onRefresh={fetchReviews}
      />
    </div>
  );
}