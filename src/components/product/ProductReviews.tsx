'use client';

import { Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

type Review = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;

  user?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
};

interface ProductReviewsProps {
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  loading?: boolean;
}

export function ProductReviews({
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  loading = false,
}: ProductReviewsProps) {
  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter(
      (r) => Math.round(r.rating) === star
    ).length;

    return {
      star,
      count,
      percent:
        totalReviews > 0
          ? (count / totalReviews) * 100
          : 0,
    };
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-zinc-100 rounded-xl" />
        <div className="h-32 bg-zinc-100 rounded-3xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-zinc-100 rounded-3xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mt-16 lg:mt-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 mb-2">
            Customer Experience
          </p>

          <h2 className="text-3xl lg:text-5xl font-black tracking-tighter italic text-zinc-900">
            Reviews
          </h2>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="text-2xl font-black text-zinc-900">
            {averageRating.toFixed(1)}
          </span>

          <span className="text-sm text-zinc-400">
            ({totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* Summary Box */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-8 p-6 lg:p-10 rounded-[2rem] border border-zinc-100 bg-zinc-50 mb-10">
        {/* Left */}
        <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-200 pb-6 lg:pb-0 lg:pr-8">
          <div className="text-6xl font-black tracking-tighter text-zinc-900">
            {averageRating.toFixed(1)}
          </div>

          <div className="flex items-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-zinc-200'
                }
              />
            ))}
          </div>

          <p className="text-sm text-zinc-500 mt-3">
            Based on {totalReviews} reviews
          </p>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {distribution.map((item) => (
            <div
              key={item.star}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-bold text-zinc-700">
                  {item.star}
                </span>

                <Star
                  size={12}
                  className="fill-yellow-400 text-yellow-400"
                />
              </div>

              <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${item.percent}%`,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="h-full bg-zinc-900 rounded-full"
                />
              </div>

              <span className="text-sm text-zinc-500 w-10 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="border border-dashed border-zinc-200 rounded-[2rem] py-20 text-center">
          <h3 className="text-xl font-black text-zinc-900 mb-2">
            No Reviews Yet
          </h3>

          <p className="text-sm text-zinc-500">
            Be the first customer to review this product.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => {
          const initials = `${review.user?.firstName?.[0] || ''}${
            review.user?.lastName?.[0] || ''
          }`;

          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              className="border border-zinc-100 rounded-[2rem] p-6 lg:p-8 bg-white"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="h-12 w-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-black uppercase">
                    {initials || 'U'}
                  </div>

                  {/* User */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-zinc-900">
                        {review.user?.firstName || 'Anonymous'}{' '}
                        {review.user?.lastName || ''}
                      </h4>

                      <CheckCircle2
                        size={14}
                        className="text-emerald-500"
                      />
                    </div>

                    <p className="text-xs text-zinc-400">
                      Verified Purchase
                    </p>
                  </div>
                </div>

                <p className="text-xs text-zinc-400">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-zinc-200'
                    }
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-[14px] leading-7 text-zinc-600">
                {review.comment || 'No comment provided.'}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}