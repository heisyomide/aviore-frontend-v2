'use client';

import { Star, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;

  user?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };

  reply?: {
    content: string;
    storeName: string;
  } | null;
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

  const safeTotal =
    totalReviews || reviews.length;

  const distribution = [5, 4, 3, 2, 1].map(
    (star) => {
      const count = reviews.filter(
        (r) => Math.round(r.rating) === star
      ).length;

      return {
        star,
        count,
        percent:
          safeTotal > 0
            ? (count / safeTotal) * 100
            : 0,
      };
    }
  );

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-zinc-100 rounded-full" />

        <div className="h-32 bg-zinc-100 rounded-3xl" />

        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-40 bg-zinc-100 rounded-3xl"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="mt-14 lg:mt-20">

      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-black text-zinc-400 mb-1">
            Customer Reviews
          </p>

          <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900">
            Ratings & Reviews
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Star
            size={16}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="text-xl font-black text-zinc-900">
            {averageRating.toFixed(1)}
          </span>

          <span className="text-sm text-zinc-400">
            ({safeTotal})
          </span>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="border border-zinc-100 rounded-[2rem] p-5 lg:p-6 bg-zinc-50 mb-8">

        <div className="space-y-3">
          {distribution.map((item) => (
            <div
              key={item.star}
              className="flex items-center gap-3"
            >

              <div className="flex items-center gap-1 w-10">
                <span className="text-xs font-bold text-zinc-700">
                  {item.star}
                </span>

                <Star
                  size={11}
                  className="fill-yellow-400 text-yellow-400"
                />
              </div>

              <div className="flex-1 h-2 rounded-full bg-zinc-200 overflow-hidden">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${item.percent}%`,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="h-full bg-zinc-900 rounded-full"
                />
              </div>

              <span className="text-xs text-zinc-500 w-6 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* EMPTY */}
      {reviews.length === 0 && (
        <div className="border border-dashed border-zinc-200 rounded-[2rem] py-16 text-center">
          <h3 className="text-lg font-black text-zinc-900 mb-2">
            No Reviews Yet
          </h3>

          <p className="text-sm text-zinc-500">
            Be the first to review this product.
          </p>
        </div>
      )}

      {/* REVIEWS */}
      <div className="space-y-4">

        {reviews.map((review) => {

          const initials =
            `${review.user?.firstName?.[0] || ''}${
              review.user?.lastName?.[0] || ''
            }` || 'U';

          return (
            <motion.div
              key={review.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              className="border border-zinc-100 rounded-[2rem] bg-white p-5 lg:p-6"
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-4 mb-4">

                <div className="flex items-center gap-3">

                  <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-black uppercase">
                    {initials}
                  </div>

                  <div>

                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900">
                        {review.user?.firstName || 'Anonymous'}
                      </h4>

                      <CheckCircle2
                        size={13}
                        className="text-emerald-500"
                      />
                    </div>

                    <p className="text-[11px] text-zinc-400">
                      Verified Purchase
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              {/* STARS */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-zinc-200'
                      }
                    />
                  )
                )}
              </div>

              {/* COMMENT */}
              <p className="text-sm leading-7 text-zinc-600">
                {review.comment?.trim()
                  ? review.comment
                  : 'No written review provided.'}
              </p>

              {/* VENDOR REPLY */}
              {review.reply && (
                <div className="mt-5 ml-4 border-l-2 border-zinc-200 pl-4">

                  <p className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
                    Reply from {review.reply.storeName}
                  </p>

                  <p className="text-sm leading-6 text-zinc-600">
                    {review.reply.content}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}