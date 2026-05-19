'use client';

import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Jasish',
    review:
      'Amazing quality. Packaging felt premium.',
  },
  {
    name: 'Evana',
    review:
      'One of the best stores on Aviorè.',
  },
];

export function StoreReviews() {
  return (
    <section className="mt-14">
      <h3 className="text-2xl font-black tracking-tight mb-5">
        Customer Reviews
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-100 rounded-3xl p-5"
          >
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={14}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <p className="text-sm text-zinc-600 leading-7">
              {r.review}
            </p>

            <p className="mt-4 text-sm font-bold">
              {r.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}