'use client';

import { useState, useEffect } from 'react';
import { 
  Loader2, ShoppingBag, Clock, CheckCircle2, 
  Star, ChevronRight, Bell, Heart, Store
} from 'lucide-react';
import Link from 'next/link';

// API Architecture & Core Services
import { api } from '@/src/lib/axios';
import { getCompletionStatus } from '@/src/services/completion.service';
import { UserActivationCard } from '@/src/components/completion/UserActivationCard';
import { CompletionEngineResponse } from '@/src/types/completion.types';

export default function OverviewPage() {
  const [data, setData] = useState<any>(null);
  const [completionData, setCompletionData] = useState<CompletionEngineResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardAndStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || '';

        const [dashboardRes, completionResult] = await Promise.all([
          api.get('/user/dashboard'),
          getCompletionStatus('customer', token).catch((err) => {
            console.error('Identity clearance decoupled:', err);
            return null;
          })
        ]);

        setData(dashboardRes.data);
        setCompletionData(completionResult);
      } catch (error) {
        console.error('Dashboard registry sync failure:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAndStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3 bg-white">
        <Loader2 className="animate-spin text-neutral-600" size={24} />
        <p className="text-xs text-neutral-400 font-medium tracking-wide">Loading your dashboard overview...</p>
      </div>
    );
  }

  // Fallback data mapping to mirror the layout elements found in the prototype
  const customerName = data?.user?.fullName || "Hart Mason";
  const avatarUrl = data?.user?.avatarUrl || "/api/placeholder/150/150";
  const totalOrdersCount = data?.totalOrders || 12;
  const wishlistCount = data?.wishlistItemsCount || 24;
  const activeDeliveries = data?.activeDeliveries || [];
  const recentlyViewedStores = data?.recentlyViewedStores || [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-neutral-800 bg-white min-h-screen pb-12 animate-in fade-in duration-200">
      
      {/* 1. GREETING PROFILE HEADER SECTION */}
      <header className="flex justify-between items-center bg-white border border-neutral-100 p-5 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <p className="text-xs text-neutral-400 font-medium">Good morning,</p>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">{customerName}</h1>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs md:max-w-md">
            Welcome back! Here's what's happening with your orders and account today.
          </p>
        </div>
        <div className="relative w-12 h-12 rounded-full border border-neutral-200 overflow-hidden shrink-0 shadow-inner">
          <img 
            src={avatarUrl} 
            alt="Customer Profiler" 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* ONBOARDING ACTIVATION OVERLAY BAR */}
      {completionData && !completionData.isFullyActive && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-1 shadow-sm">
          <UserActivationCard 
            percentage={completionData.completionPercentage}
            tasks={completionData.tasks}
            isFullyActive={completionData.isFullyActive}
          />
        </div>
      )}

      {/* 2. DUAL METRICS COUNTER GRID */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Orders Metric Block */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 font-medium">Total Orders</p>
            <h3 className="text-3xl font-bold text-neutral-900 tracking-tight">{totalOrdersCount}</h3>
          </div>
          <Link href="/dashboard/orders" className="text-xs font-semibold text-neutral-900 inline-flex items-center gap-1 group hover:underline">
            View all <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Wishlist Items Metric Block */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 font-medium">Wishlist Items</p>
            <h3 className="text-3xl font-bold text-neutral-900 tracking-tight">{wishlistCount}</h3>
          </div>
          <Link href="/dashboard/history" className="text-xs font-semibold text-neutral-900 inline-flex items-center gap-1 group hover:underline">
            View all <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* 3. ACTIVE DELIVERIES LOGISTICS CONTAINER */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">Active Deliveries</h2>
          <Link href="/dashboard/orders" className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors">
            View all
          </Link>
        </div>

        <div className="space-y-3">
          {activeDeliveries.length > 0 ? (
            activeDeliveries.map((delivery: any) => (
              <div 
                key={delivery.id} 
                className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex gap-4 items-center justify-between group hover:border-neutral-300 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-center text-neutral-500 shrink-0 overflow-hidden">
                    <img 
                      src={delivery.itemImage || '/api/placeholder/100/100'} 
                      alt="Product Thumb"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-neutral-900">Order #{delivery.orderNumber || delivery.id.slice(-5).toUpperCase()}</p>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase tracking-wide">
                        {delivery.status || 'In Transit'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate max-w-xs sm:max-w-md">
                      {delivery.summaryText || "2 items shipped • 1 item processing"}
                    </p>
                    <p className="text-[11px] text-neutral-500 font-medium">
                      Estimated delivery: <span className="text-neutral-800 font-semibold">{delivery.estimatedDate || 'May 26 – May 30'}</span>
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0" />
              </div>
            ))
          ) : (
            /* Prototype placeholder display row */
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex gap-4 items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
                  <ShoppingBag size={18} />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-neutral-900">Order #AV-20391</p>
                    <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 uppercase tracking-wide">
                      In Transit
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate">2 items shipped • 1 item processing</p>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    Estimated delivery: <span className="text-neutral-800 font-semibold">May 26 – May 30</span>
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-neutral-300 shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* 4. RECENTLY VIEWED STORES GRID CHANNEL */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-neutral-900 tracking-tight">Recently Viewed Stores</h2>
          <Link href="/dashboard/stores" className="text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {recentlyViewedStores.length > 0 ? (
            recentlyViewedStores.slice(0, 4).map((store: any) => (
              <Link 
                key={store.id}
                href={`/dashboard/stores/${store.id}`} 
                className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2 hover:border-neutral-300 hover:shadow transition-all group"
              >
                <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-sm uppercase group-hover:scale-105 transition-transform">
                  {store.logoInitials || store.name?.slice(0, 2)}
                </div>
                <p className="text-xs font-bold text-neutral-900 truncate w-full px-1">{store.name}</p>
              </Link>
            ))
          ) : (
            /* Exact brand mock placeholders from the reference layouts */
            <>
              <MockStore NodeLogo="LF" title="Luxe Fashion" />
              <MockStore NodeLogo="UE" title="Urban Essentials" />
              <MockStore NodeLogo="BB" title="Belle Boutique" />
              <MockStore NodeLogo="OW" title="Oceanic Watches" />
            </>
          )}
        </div>
      </div>

    </div>
  );
}

/* --- LIGHT COMPONENT ATOMS --- */
function MockStore({ NodeLogo, title }: { NodeLogo: string; title: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center space-y-2.5">
      <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
        {NodeLogo}
      </div>
      <p className="text-[11px] font-bold text-neutral-800 truncate w-full">{title}</p>
    </div>
  );
}