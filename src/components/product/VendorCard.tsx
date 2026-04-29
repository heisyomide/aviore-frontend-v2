'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Store, ChevronRight, Loader2, Plus, Check } from 'lucide-react';

interface VendorCardProps {
  vendor?: {
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

  if (!v.id) return null;

  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event bubbling
    
    if (isPending) return;
    
    setIsPending(true);
    try {
      await onFollow();
      // Logic tip: Ensure your parent component updates the 'isFollowing' prop 
      // via a state refresh or a revalidatePath call.
    } catch (err) {
      console.error("Follow protocol failed:", err);
    } finally {
      setIsPending(false);
    }
  };

  const formatStat = (num: number) => {
    const safeNum = Number(num) || 0;
    if (safeNum >= 1000) return `${(safeNum / 1000).toFixed(1)}K`;
    return safeNum.toString();
  };

  const vendorLink = `/vendors/${v.id}`;

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl group/card transition-all hover:border-[#A4143D]/30">
      
      {/* Header: High Contrast */}
      <div className="flex items-center justify-between">
        <Link href={vendorLink} className="flex items-center gap-4 group/info">
          <div className="relative w-16 h-16 rounded-2xl bg-zinc-900 overflow-hidden flex items-center justify-center border border-white/10 transition-all group-hover/info:border-[#A4143D]">
            {v.logo ? (
              <Image 
                src={v.logo} 
                alt={v.name} 
                fill 
                sizes="64px"
                className="object-cover opacity-90 group-hover/info:opacity-100 transition-opacity" 
              />
            ) : (
              <Store className="text-zinc-500" size={28} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm uppercase text-white tracking-tighter leading-none">{v.name}</h3>
              {v.isVerified && <BadgeCheck size={16} className="text-[#A4143D]" />}
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Verified Curator • {v.rating.toFixed(1)} Rating
            </p>
          </div>
        </Link>
        <ChevronRight size={18} className="text-zinc-700 group-hover/card:text-white transition-colors" />
      </div>

      {/* Stats Grid: Bold Labels */}
      <div className="grid grid-cols-3 py-6 border-y border-white/[0.05]">
        <div className="text-center">
          <p className="text-lg font-black text-white tracking-tighter">{formatStat(v.followers)}</p>
          <p className="text-[9px] text-[#A4143D] uppercase font-black tracking-[0.2em] mt-1">Followers</p>
        </div>
        <div className="text-center border-x border-white/[0.05] px-2">
          <p className="text-lg font-black text-white tracking-tighter">{v.products}</p>
          <p className="text-[9px] text-[#A4143D] uppercase font-black tracking-[0.2em] mt-1">Assets</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-white tracking-tighter">{v.response}%</p>
          <p className="text-[9px] text-[#A4143D] uppercase font-black tracking-[0.2em] mt-1">Reliability</p>
        </div>
      </div>

      {/* Action Buttons: High Contrast & Visual Feedback */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button"
          onClick={handleFollowClick}
          disabled={isPending}
          className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border-2 ${
            isFollowing 
              ? 'bg-[#A4143D] border-[#A4143D] text-white shadow-lg shadow-[#A4143D]/20' 
              : 'bg-white border-white text-black hover:bg-zinc-200 active:scale-95'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : isFollowing ? (
            <><Check size={14} strokeWidth={3} /> Following</>
          ) : (
            <><Plus size={14} strokeWidth={3} /> Follow</>
          )}
        </button>
        
        <Link 
          href={vendorLink}
          className="h-14 bg-transparent border-2 border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center active:scale-95"
        >
          View Store
        </Link>
      </div>
    </div>
  );
}