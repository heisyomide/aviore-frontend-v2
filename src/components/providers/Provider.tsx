'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { initAntiFraudTelemetry } from '../../lib/axios'; // Verified structural import path

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // 🛡️ ANTI-FRAUD TELEMETRY BOOTSTRAP
  useEffect(() => {
    // Computes and caches device fingerprint safely once on initial mount
    initAntiFraudTelemetry();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* 🛠️ GLOBAL_ALERTS: Styled for the Aviore Industrial Aesthetic */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'font-mono text-[10px] font-black uppercase tracking-widest border border-zinc-100 shadow-xl rounded-xl',
          duration: 3000,
          style: {
            padding: '16px',
            color: '#18181b',
          },
        }}
      />
      
      {children}

      {/* 🛰️ DEBUG_HUB: Visible only during Localhost development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}