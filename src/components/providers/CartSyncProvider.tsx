'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { useCartStore } from '@/src/store/useCartStore'; // Updated alias to @/store

/**
 * 🛰️ SYSTEM_SYNC_PROTOCOL
 * Manages the background handshake between the client and NestJS.
 * Accepts children to wrap the application structure.
 */
interface CartSyncProviderProps {
  children: ReactNode;
}

export function CartSyncProvider({ children }: CartSyncProviderProps) {
  const sync = useCartStore((state) => state.syncWithBackend);
  const _hasHydrated = useCartStore((state) => state._hasHydrated);
  const isSyncing = useCartStore((state) => state.isSyncing);
  
  // 🛡️ REFRESH_GUARD
  const hasInitialSyncRun = useRef(false);

  useEffect(() => {
    // Only run when the store has loaded from localStorage and hasn't already run
    if (!_hasHydrated || hasInitialSyncRun.current || isSyncing) return;

    const checkAndSync = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (token) {
        try {
          hasInitialSyncRun.current = true; 
          await sync();
          console.log("REGISTRY_SYNC_COMPLETE // Node_Cloud_Matched");
        } catch (error) {
          hasInitialSyncRun.current = false; 
          console.error("REGISTRY_SYNC_REJECTED // NestJS_Protocol_Error", error);
        }
      }
    };

    checkAndSync();
  }, [_hasHydrated, sync, isSyncing]);

  // 🏛️ Return children so it can act as a layout wrapper
  return <>{children}</>;
}