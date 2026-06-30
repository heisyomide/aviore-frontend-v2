'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2, MessageSquare, Star, Activity, ThumbsUp, Inbox } from 'lucide-react';
import ReviewCard from '../../../components/dashboard/ReviewCard';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/reviews');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
      toast.error("Error", { description: "Failed to load product reviews." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this review?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/user/reviews/${reviewId}`);
      toast.success("Success", { description: "Review has been removed." });
      fetchReviews();
    } catch (error) {
      toast.error("Error", { description: "Could not delete your review." });
    }
  };

  const handleEdit = async (reviewId: string) => {
    const currentReview = data?.reviews?.find((r: any) => r.id === reviewId);
    const newComment = window.prompt("Edit your review comment:", currentReview?.comment || "");
    if (newComment === null || newComment.trim() === "") return;

    try {
      await api.patch(`/user/reviews/${reviewId}`, { comment: newComment });
      toast.success("Success", { description: "Review updated successfully." });
      fetchReviews();
    } catch (error) {
      toast.error("Error", { description: "Failed to update review text." });
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center animate-in fade-in duration-300">
        <Loader2 className="animate-spin text-[#A4143D]" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* 1. PREMIUM HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <MessageSquare size={14} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Customer Feedback</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          My <span className="text-zinc-300 font-medium">Reviews</span>
        </h1>
      </header>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          label="Total Feedback" 
          value={data?.stats?.totalReviews?.toString().padStart(2, '0') || "00"} 
          icon={<Activity size={14} />}
        />
        <StatCard 
          label="Average Rating" 
          value={data?.stats?.averageRating ? `${Number(data.stats.averageRating).toFixed(1)}` : "0.0"} 
          icon={<Star size={14} />}
        />
        <StatCard 
          label="Helpful Actions" 
          value={data?.stats?.helpfulVotes?.toString().padStart(2, '0') || "00"} 
          icon={<ThumbsUp size={14} />}
        />
      </div>

      {/* 3. REVIEWS LOG GRID */}
      <div className="space-y-4 pt-4">
        {data?.reviews?.length > 0 ? (
          data.reviews.map((review: any) => (
            <ReviewCard
              key={review.id}
              product={review.productName}
              rating={review.rating}
              date={new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              }).toUpperCase()}
              review={review.comment}
              onDelete={() => handleDelete(review.id)}
              onEdit={() => handleEdit(review.id)}
            />
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50/30">
            <Inbox size={36} className="text-zinc-300 mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">No Reviews Found</p>
            <p className="text-[10px] text-zinc-400 mt-1 italic">You haven't left any feedback entries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** 📊 STAT WIDGET CELL */
function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-2xl group hover:border-zinc-400 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
        <div className="text-zinc-400 group-hover:text-[#A4143D] transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black text-zinc-900 tracking-tight">
        {value}
      </p>
    </div>
  );
}