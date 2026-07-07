'use client';

import React, { useState, useEffect } from 'react';

export default function UpdateBanner() {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowUpdateBanner(true);
            }
          });
        }
      });
    });
  }, []);

  if (!showUpdateBanner) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[99999] bg-[#0a0a0a]/95 border border-zinc-800/80 backdrop-blur-md p-3 rounded-xl flex items-center justify-between gap-4 shadow-2xl max-w-sm w-[92%]">
      <div className="flex flex-col">
        <h5 className="text-white text-xs font-bold tracking-wide uppercase font-mono">Update Available</h5>
        <p className="text-zinc-400 text-[9px] font-light mt-0.5">A new workspace version has been deployed.</p>
      </div>
      <button onClick={() => window.location.reload()} className="bg-white text-black font-bold text-[10px] px-3 py-1.5 rounded-lg font-mono tracking-wider uppercase cursor-pointer">
        Reload
      </button>
    </div>
  );
}