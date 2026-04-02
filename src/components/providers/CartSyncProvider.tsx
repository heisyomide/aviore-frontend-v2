'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/src/store/useCartStore';

/**
 * 🛰️ SYSTEM_SYNC_PROTOCOL
 * Manages the background handshake between the client and NestJS.
 */
export function CartSyncProvider() {
  const sync = useCartStore((state) => state.syncWithBackend);
  const _hasHydrated = useCartStore((state) => state._hasHydrated);
  const isSyncing = useCartStore((state) => state.isSyncing);
  
  // 🛡️ REFRESH_GUARD: Prevents the "1 becomes 8" loop during hot reloads or re-renders
  const hasInitialSyncRun = useRef(false);

  useEffect(() => {
    // Only run when the store has loaded from localStorage (_hasHydrated)
    // and hasn't already run in this session
    if (!_hasHydrated || hasInitialSyncRun.current || isSyncing) return;

    const checkAndSync = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (token) {
        try {
          hasInitialSyncRun.current = true; // Lock immediately to prevent race conditions
          await sync();
          console.log("REGISTRY_SYNC_COMPLETE // Node_Cloud_Matched");
        } catch (error) {
          hasInitialSyncRun.current = false; // Release lock on failure to allow retry
          console.error("REGISTRY_SYNC_REJECTED // NestJS_Protocol_Error", error);
        }
      }
    };

    checkAndSync();
  }, [_hasHydrated, sync, isSyncing]);

  // Logic-only component (Firm structure)
  return null;
}