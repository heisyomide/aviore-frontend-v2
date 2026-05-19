'use client';

import Image from 'next/image';
import {
  MapPin,
  ShieldCheck,
  Users,
  Star,
  Share2,
} from 'lucide-react';

import { FollowButton } from '@/src/components/vendor/FollowButton';

interface StoreHeaderProps {
  vendor: any;
  logoUrl?: string | null;
}

export function StoreHeader({
  vendor,
  logoUrl,
}: StoreHeaderProps) {
  return (
    <div className="relative z-20 -mt-16 px-4">
      <div className="bg-white rounded-[2rem] shadow-xl border border-zinc-100 p-5 md:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          {/* LOGO */}
          <div className="relative w-28 h-28 rounded-3xl overflow-hidden border border-zinc-100 bg-zinc-50 shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={vendor.storeName}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          {/* INFO */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-black text-zinc-950 tracking-tight">
                {vendor.storeName}
              </h2>

              <span className="flex items-center gap-1 bg-[#A4143D] text-white text-[11px] px-3 py-1 rounded-full font-bold uppercase">
                <ShieldCheck size={12} />
                Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-3 text-sm text-zinc-600">
              <div className="flex items-center gap-1">
                <Star
                  size={14}
                  className="fill-yellow-400 text-yellow-400"
                />
                <span className="font-bold">4.9</span>
                <span>(489 Reviews)</span>
              </div>

              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>
                  {vendor?._count?.followers || 0} Followers
                </span>
              </div>

              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>Lagos, Nigeria</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-zinc-500 leading-7 max-w-2xl">
              {vendor.description}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <FollowButton
              vendorId={vendor.id}
              initialIsFollowing={false}
            />

            <button className="h-12 px-5 rounded-2xl text-zinc-900 border border-zinc-200 bg-white flex items-center gap-2 text-sm font-semibold">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}