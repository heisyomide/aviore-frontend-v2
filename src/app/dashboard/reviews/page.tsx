'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2, MessageSquare, Star, Activity, Plus } from 'lucide-react';
import ReviewCard from '../../../components/dashboard/ReviewCard';
import { toast } from 'react-hot-toast';

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
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/user/reviews/${reviewId}`);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error("Could not delete review");
    }
  };

  const handleEdit = async (reviewId: string) => {
    const newComment = prompt("Edit your review comment:", "");
    if (newComment === null) return;
    try {
      await api.patch(`/user/reviews/${reviewId}`, { comment: newComment });
      toast.success("Review updated");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#A4143D]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col gap-2 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <MessageSquare size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">User_Feedback</span>
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-zinc-900">
          My <span className="text-zinc-200">Reviews</span>
        </h1>
      </header>

      {/* 2. STATS HUD: Rule 2 (Monospace/Bold Metrics) */}
      <div className="grid sm:grid-cols-3 gap-6">
        <StatCard 
          label="Total Reviews" 
          value={data?.stats?.totalReviews?.toString().padStart(2, '0') || "00"} 
          icon={<Activity size={14} />}
        />
        <StatCard 
          label="Average Rating Given" 
          value={`${data?.stats?.averageRating || "0"}.0`} 
          icon={<Star size={14} />}
        />
        <StatCard 
          label="Helpful Votes" 
          value={data?.stats?.helpfulVotes?.toString().padStart(2, '0') || "00"} 
          icon={<Plus size={14} />}
        />
      </div>

      {/* 3. REVIEWS LIST */}
      <div className="space-y-4">
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
          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[2rem] text-center">
            <MessageSquare size={48} className="text-zinc-100 mb-4" />
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
              You haven't left any reviews yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** 📊 STAT HUD MOLECULE */
function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-3xl group hover:border-[#A4143D]/20 transition-all duration-500">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</span>
        <div className="text-zinc-300 group-hover:text-[#A4143D] transition-colors">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-black text-zinc-900 tracking-tighter font-mono">
        {value}
      </p>
    </div>
  );
}