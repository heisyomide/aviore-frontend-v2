'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Store, ChevronRight, Loader2 } from 'lucide-react';

interface VendorCardProps {
  vendor?: { // Made optional for safety
    id: string;
    storeName: string;
    logo?: string;
    isVerified?: boolean;
    rating?: number;
    followers?: number;
    productsCount?: number;
    responseRate?: number;
  };
  onFollow: () => Promise<void>;
  isFollowing: boolean;
}

export function VendorCard({ vendor, onFollow, isFollowing }: VendorCardProps) {
  const [isPending, setIsPending] = useState(false);

  // 1. Guard against missing vendor data
  const v = useMemo(() => ({
    id: vendor?.id || '',
    name: vendor?.storeName || 'Unknown Store',
    logo: vendor?.logo || null,
    isVerified: !!vendor?.isVerified,
    rating: vendor?.rating || 0,
    followers: vendor?.followers || 0,
    products: vendor?.productsCount || 0,
    response: vendor?.responseRate || 0,
  }), [vendor]);

  if (!v.id) return null; // Don't render if we can't link to the vendor

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link trigger if nested incorrectly
    if (isPending) return;
    setIsPending(true);
    try {
      await onFollow();
    } catch (err) {
      console.error("Follow failed:", err);
    } finally {
      setIsPending(false);
    }
  };

  const formatStat = (num: number) => {
    try {
      const safeNum = Number(num) || 0;
      if (safeNum >= 1000) return `${(safeNum / 1000).toFixed(1)}K`;
      return safeNum.toString();
    } catch {
      return "0";
    }
  };

  const vendorLink = `/vendors/${v.id}`;

  return (
    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={vendorLink} className="flex items-center gap-4 group">
          <div className="relative w-16 h-16 rounded-2xl bg-zinc-950 overflow-hidden flex items-center justify-center border border-zinc-200 transition-transform group-hover:scale-95">
            {v.logo ? (
              <Image 
                src={v.logo} 
                alt={v.name} 
                fill 
                sizes="64px"
                className="object-cover" 
              />
            ) : (
              <Store className="text-white" size={28} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm uppercase tracking-tight line-clamp-1">{v.name}</h3>
              {v.isVerified && <BadgeCheck size={16} className="text-blue-500 fill-blue-500/10 shrink-0" />}
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">
              Verified Curator • {v.rating.toFixed(1)} Rating
            </p>
          </div>
        </Link>
        <ChevronRight size={18} className="text-zinc-300" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 py-6 border-y border-zinc-50">
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-950">{formatStat(v.followers)}</p>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mt-1">Followers</p>
        </div>
        <div className="text-center border-x border-zinc-50 px-2">
          <p className="text-sm font-bold text-zinc-950">{v.products}</p>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mt-1">Products</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-zinc-950">{v.response}%</p>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest mt-1">Response</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button"
          onClick={handleFollowClick}
          disabled={isPending}
          className={`h-12 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            isFollowing 
              ? 'bg-zinc-100 text-zinc-500' 
              : 'bg-zinc-950 text-white hover:bg-black active:scale-95'
          }`}
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : isFollowing ? (
            'Following'
          ) : (
            'Follow Store'
          )}
        </button>
        
        <Link 
          href={vendorLink}
          className="h-12 border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all flex items-center justify-center active:scale-95"
        >
          View Store
        </Link>
      </div>
    </div>
  );
}