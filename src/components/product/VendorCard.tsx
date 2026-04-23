'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Store, ChevronRight, Loader2 } from 'lucide-react';

interface VendorCardProps {
  vendor: {
    id: string; // Critical for navigation
    storeName: string;
    logo?: string;
    isVerified: boolean;
    rating: number;
    followers: number;
    productsCount: number;
    responseRate: number;
  };
  onFollow: () => Promise<void>; // Change to Promise for async handling
  isFollowing: boolean;
}

export function VendorCard({ vendor, onFollow, isFollowing }: VendorCardProps) {
  const [isPending, setIsPending] = useState(false);

  // 1. Handle Follow Logic with Loading State
  const handleFollowClick = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await onFollow();
    } finally {
      setIsPending(false);
    }
  };

  // 2. Format large numbers (e.g., 1200 -> 1.2K)
  const formatStat = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/vendors/${vendor.id}`} className="flex items-center gap-4 group">
          <div className="relative w-16 h-16 rounded-2xl bg-zinc-950 overflow-hidden flex items-center justify-center border border-zinc-200 transition-transform group-hover:scale-95">
            {vendor.logo ? (
              <Image src={vendor.logo} alt={vendor.storeName} fill className="object-cover" />
            ) : (
              <Store className="text-white" size={28} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm uppercase tracking-tight">{vendor.storeName}</h3>
              {vendor.isVerified && <BadgeCheck size={16} className="text-blue-500 fill-blue-500/10" />}
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">Verified Curator • {vendor.rating} Rating</p>
          </div>
        </Link>
        <ChevronRight size={18} className="text-zinc-300" />
      </div>

      {/* Stats Grid - Fixed Counters */}
      <div className="grid grid-cols-3 py-6 border-y border-zinc-50">
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-950">{formatStat(vendor.followers)}</p>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mt-1">Followers</p>
        </div>
        <div className="text-center border-x border-zinc-50 px-2">
          <p className="text-sm font-bold text-zinc-950">{vendor.productsCount}</p>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mt-1">Products</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-950">{vendor.responseRate}%</p>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mt-1">Response</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={handleFollowClick}
          disabled={isPending}
          className={`h-12 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            isFollowing 
              ? 'bg-zinc-100 text-zinc-500' 
              : 'bg-zinc-950 text-white hover:bg-black active:scale-95'
          }`}
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : isFollowing ? 'Following' : 'Follow Store'}
        </button>
        
        <Link 
          href={`/vendors/${vendor.id}`}
          className="h-12 border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all flex items-center justify-center active:scale-95"
        >
          View Store
        </Link>
      </div>
    </div>
  );
}