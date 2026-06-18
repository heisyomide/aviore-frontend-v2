'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// API & Services
import { api } from '@/src/lib/axios';
import { getCompletionStatus } from '@/src/services/completion.service';
import { UserActivationCard } from '@/src/components/completion/UserActivationCard';
import { CompletionEngineResponse } from '@/src/types/completion.types';

// New Components (Dark AVIORE Style)
import DashboardOverview from '@/src/components/dashboard/MobileDashboard'; // ← Updated import

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
          getCompletionStatus('customer', token).catch(() => null)
        ]);

        setData(dashboardRes.data);
        setCompletionData(completionResult);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAndStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#A4143D]" size={32} />
        <p className="text-zinc-500 text-sm font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop + Mobile Unified View */}
      <div className="w-full">
        {/* Show activation card if needed */}
        {completionData && !completionData.isFullyActive && (
          <div className="mb-8 px-2 lg:px-0">
            <UserActivationCard 
              percentage={completionData.completionPercentage}
              tasks={completionData.tasks}
              isFullyActive={completionData.isFullyActive}
            />
          </div>
        )}

        {/* Main Dashboard Content */}
        <DashboardOverview data={data} />
      </div>
    </>
  );
}