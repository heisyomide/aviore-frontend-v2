'use client';

import React, { useState, useEffect } from 'react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOnline(navigator.onLine);

    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] bg-red-950/95 border border-red-900/40 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl max-w-[90%] text-white text-[10px] font-mono tracking-widest uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
      <span>Offline Mode Active — Local Cache</span>
    </div>
  );
}