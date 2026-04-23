'use client';

import Image from 'next/image';
import { BadgeCheck, Store, ChevronRight } from 'lucide-react';

interface VendorCardProps {
  vendor: {
    storeName: string;
    logo?: string;
    isVerified: boolean;
    rating: number;
    followers: number;
    productsCount: number;
    responseRate: number;
  };
  onFollow: () => void;
  isFollowing: boolean;
}

export function VendorCard({ vendor, onFollow, isFollowing }: VendorCardProps) {
  return (
    <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 space-y-6">
      {/* Header: Logo & Name */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl bg-zinc-900 overflow-hidden flex items-center justify-center border border-zinc-200">
            {vendor.logo ? (
              <Image src={vendor.logo} alt="" fill className="object-cover" />
            ) : (
              <Store className="text-white" size={24} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm uppercase tracking-tight">{vendor.storeName}</h3>
              {vendor.isVerified && <BadgeCheck size={16} className="text-blue-500 fill-blue-500/10" />}
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">Verified Store • {vendor.rating} Rating</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-zinc-300" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 py-4 border-y border-zinc-50">
        <div className="text-center">
          <p className="text-xs font-bold text-zinc-900">{(vendor.followers / 1000).toFixed(1)}K</p>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-tighter">Followers</p>
        </div>
        <div className="text-center border-x border-zinc-50">
          <p className="text-xs font-bold text-zinc-900">{vendor.productsCount}</p>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-tighter">Products</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-zinc-900">{vendor.responseRate}%</p>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-tighter">Response</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onFollow}
          className={`h-11 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
            isFollowing ? 'bg-zinc-100 text-zinc-500' : 'border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow Store'}
        </button>
        <button className="h-11 border border-zinc-200 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all">
          View Store
        </button>
      </div>
    </div>
  );
}