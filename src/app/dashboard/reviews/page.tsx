'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2, MessageSquare, Star, Activity, ThumbsUp, Trash2, Edit3, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState<string>('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/reviews');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
      toast.error("Failed to load reviews manifest");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId: string) => {
    try {
      await api.delete(`/user/reviews/${reviewId}`);
      toast.success("Review entry purged");
      fetchReviews();
    } catch (error) {
      toast.error("Could not delete review entry");
    }
  };

  const handleStartEdit = (reviewId: string, currentComment: string) => {
    setEditingId(reviewId);
    setEditComment(currentComment);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditComment('');
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!editComment.trim()) return;
    try {
      await api.patch(`/user/reviews/${reviewId}`, { comment: editComment });
      toast.success("Review matrix updated");
      setEditingId(null);
      fetchReviews();
    } catch (error) {
      toast.error("Failed to update review payload");
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 bg-[#0D0D0D] min-h-[50vh]">
        <Activity className="animate-spin text-[#991B1B]" size={24} />
        <p className="text-[8px] font-mono font-bold tracking-[0.3em] text-zinc-600 uppercase">Polling_Feedback_Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 text-zinc-100">
      
      {/* 1. LAYER PROTOCOL HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-900/60 pb-6">
        <div className="flex items-center gap-2 text-[#991B1B]">
          <MessageSquare size={13} className="animate-pulse" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em]">User_Feedback_Registry</span>
        </div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
          My <span className="text-zinc-600 font-normal font-sans tracking-normal">Reviews</span>
        </h1>
      </header>

      {/* 2. INDUSTRIAL PERFORMANCE METRICS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          label="Total Reviews" 
          value={data?.stats?.totalReviews?.toString().padStart(2, '0') || "00"} 
          icon={<Activity size={12} />}
        />
        <StatCard 
          label="Average Rating Given" 
          value={`${Number(data?.stats?.averageRating || 0).toFixed(1)}`} 
          icon={<Star size={12} />}
        />
        <StatCard 
          label="Helpful Votes Recieved" 
          value={data?.stats?.helpfulVotes?.toString().padStart(2, '0') || "00"} 
          icon={<ThumbsUp size={12} />}
        />
      </section>

      {/* 3. MANIFEST LOG PIPELINE */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap">Evaluated_Artifacts</span>
          <div className="h-[1px] flex-1 bg-zinc-900/60" />
        </div>

        {data?.reviews?.length > 0 ? (
          <div className="space-y-3">
            {data.reviews.map((review: any) => {
              const isEditing = editingId === review.id;
              
              return (
                <div 
                  key={review.id} 
                  className="bg-[#111113] border border-zinc-900 rounded-lg p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors duration-300 hover:border-zinc-800"
                >
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wide truncate max-w-xs">
                        {review.productName || 'System Artifact'}
                      </span>
                      <div className="flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
                        <Star size={10} className="text-[#991B1B] fill-[#991B1B]" />
                        <span className="text-[10px] font-mono font-bold text-zinc-300">{review.rating}</span>
                      </div>
                      <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric'
                        }).toUpperCase()}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 mt-2 max-w-2xl">
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700 min-h-[70px] resize-y"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveEdit(review.id)}
                            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-white transition-colors"
                          >
                            <Check size={10} className="text-emerald-600" /> Commit
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 px-3 py-1.5 rounded flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500 transition-colors"
                          >
                            <X size={10} /> Discard
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] font-sans text-zinc-400 leading-relaxed max-w-2xl">
                        {review.comment}
                      </p>
                    )}
                  </div>

                  {/* INDUSTRIAL LOG CONTROL NODES */}
                  {!isEditing && (
                    <div className="flex items-center md:flex-col gap-1.5 shrink-0 self-end md:self-start">
                      <button
                        onClick={() => handleStartEdit(review.id, review.comment)}
                        className="h-7 px-3 rounded bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider active:scale-95"
                      >
                        <Edit3 size={10} />
                        <span>Modify</span>
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="h-7 px-3 rounded bg-zinc-950 border border-zinc-900 hover:border-[#991B1B]/40 hover:text-[#991B1B] text-zinc-500 transition-all duration-200 flex items-center justify-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider active:scale-95"
                      >
                        <Trash2 size={10} />
                        <span>Purge</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center border border-zinc-900 bg-[#111113]/40 rounded-lg text-center">
            <MessageSquare size={32} className="text-zinc-800 mb-3" />
            <p className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-600">
              Empty_Feedback_Pipeline
            </p>
          </div>
        )}
      </div>

      <p className="text-center text-[7px] font-mono font-bold text-zinc-700 uppercase tracking-[0.4em]">
        AVIORÈ_REVIEW_SYS_v3.02
      </p>
    </div>
  );
}

/** 📊 INDUSTRIAL METRIC PIPELINE FRAME */
function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#111113] border border-zinc-900 p-5 rounded-lg group hover:border-zinc-800 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
        <div className="text-zinc-600 group-hover:text-[#991B1B] transition-colors duration-300">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-mono font-bold text-white tracking-wide">
        {value}
      </p>
    </div>
  );
}