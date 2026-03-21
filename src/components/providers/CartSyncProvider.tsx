'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/src/store/useCartStore';

/**
 * 🛰️ SYSTEM_SYNC_PROTOCOL
 * This component executes the background handshake between the browser 
 * and the NestJS/Prisma registry.
 */
export function CartSyncProvider() {
  const sync = useCartStore((state) => state.syncWithBackend);

  useEffect(() => {
    // 🛡️ AUTH_CHECK: Verify if a token exists before initiating handshake
    const checkAndSync = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (token) {
        try {
          await sync();
          console.log("REGISTRY_SYNC_SUCCESS: Local store matched to Cloud database.");
        } catch (error) {
          console.error("REGISTRY_SYNC_FAILURE: Handshake rejected by NestJS.", error);
        }
      }
    };

    checkAndSync();
  }, [sync]);

  // This component provides logic only, no visual UI.
  return null;
}