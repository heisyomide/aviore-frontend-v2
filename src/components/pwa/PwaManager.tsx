'use client';

import React, { useState, useEffect } from 'react';

export default function PwaManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  useEffect(() => {
    // 1. Network Status Checks
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // 2. Catch Android/Chrome native install triggers
    const captureInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show install button if the application isn't already standalone running
      if (window.matchMedia('(display-mode: standalone)').matches === false) {
        setShowInstallBtn(true);
      }
    };

    window.addEventListener('beforeinstallprompt', captureInstallPrompt);

    // 3. Service Worker Version Change Watcher
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdateBanner(true); // New build layout exists!
              }
            });
          }
        });
      });
    }

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
    };
  }, []);

  const triggerNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const forceAppReload = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Offline Status HUD */}
      {!isOnline && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-red-950/90 border border-red-800 backdrop-blur px-5 py-3 rounded-xl flex items-center gap-3 shadow-2xl transition-all font-mono text-xs">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-200 tracking-wider">YOU ARE OFFLINE — UNCACHED SECTIONS UNAVAILABLE</span>
        </div>
      )}

      {/* Fresh Build Live Deploy Update Notice */}
      {showUpdateBanner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-neutral-900 border border-neutral-800 backdrop-blur p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 shadow-2xl font-mono text-xs max-w-sm w-[90%]">
          <p className="text-neutral-300 text-center sm:text-left">New system version deployed.</p>
          <button 
            onClick={forceAppReload}
            className="w-full sm:w-auto bg-white text-neutral-950 font-bold px-3 py-1.5 rounded-lg tracking-widest hover:bg-neutral-200 transition-all uppercase"
          >
            Update
          </button>
        </div>
      )}

      {/* Persistent Smart App Banner (Hides automatically if running inside an installed context) */}
      {showInstallBtn && (
        <div className="fixed bottom-6 right-6 z-[9998] bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col items-center gap-3 shadow-2xl font-mono max-w-xs text-center border-l-4 border-l-white">
          <h4 className="text-xs font-bold text-white tracking-widest uppercase">Aviorè Marketplace App</h4>
          <p className="text-[10px] text-neutral-400 font-light">Install straight onto your home screen for fluid workflow management.</p>
          <button
            onClick={triggerNativeInstall}
            className="w-full bg-white text-neutral-950 font-bold px-4 py-2 rounded-lg text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all"
          >
            Install Now
          </button>
        </div>
      )}
    </>
  );
}