'use client';

import Image from 'next/image';

interface Props {
  images: string[];
}

export function StoreLookbook({ images }: Props) {
  return (
    <section className="mt-14">
      <h3 className="text-2xl font-black tracking-tight mb-5">
        Featured Lookbook
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] rounded-3xl overflow-hidden"
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}