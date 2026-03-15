'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2 } from 'lucide-react';
import ReviewCard from '../../../components/dashboard/ReviewCard';
import { toast } from 'react-hot-toast'; // Optional: for feedback notifications

export default function ReviewsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data function
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

  // 2. Delete Logic
  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await api.delete(`/user/reviews/${reviewId}`);
      toast.success("Review deleted successfully");
      fetchReviews(); // Refresh the list and stats
    } catch (error) {
      toast.error("Could not delete review");
    }
  };

  // 3. Edit Logic (Usually triggers a modal or a prompt)
  const handleEdit = async (reviewId: string) => {
    const newComment = prompt("Edit your review comment:", "");
    if (newComment === null) return; // User cancelled

    try {
      await api.patch(`/user/reviews/${reviewId}`, { comment: newComment });
      toast.success("Review updated");
      fetchReviews(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">My Reviews</h1>

      {/* Stats Section */}
      <div className="grid sm:grid-cols-3 gap-6">
        <StatCard label="Total Reviews" value={data?.stats?.totalReviews?.toString() || "0"} />
        <StatCard label="Average Rating Given" value={data?.stats?.averageRating?.toString() || "0"} />
        <StatCard label="Helpful Votes" value={data?.stats?.helpfulVotes?.toString() || "0"} />
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {data?.reviews?.length > 0 ? (
          data.reviews.map((review: any) => (
            <ReviewCard
              key={review.id}
              product={review.productName}
              rating={review.rating}
              date={new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric', 
                year: 'numeric'
              })}
              review={review.comment}
              // Pass the functions to the ReviewCard
              onDelete={() => handleDelete(review.id)}
              onEdit={() => handleEdit(review.id)}
            />
          ))
        ) : (
          <div className="bg-white p-10 rounded-xl border border-gray-200 text-center text-gray-500">
            You haven't left any reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}