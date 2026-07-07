'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PwaManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    // 1. Detect Environment Frameworks & Already Installed Statuses
    if (typeof window === 'undefined') return;

    const isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(ua);
    setIsIosDevice(isAppleMobile);

    // If already running standalone inside the installed app, hide everything
    if (isInstalled) {
      setShowFloatingBtn(false);
    } else {
      // On iOS, we show the floating button automatically since there's no native event trigger
      if (isAppleMobile) {
        setShowFloatingBtn(true);
      }
    }

    // 2. Network Status Controllers
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // 3. Catch Android / Chrome Native Install Triggers
    const captureInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isInstalled) {
        setShowFloatingBtn(true);
      }
    };
    window.addEventListener('beforeinstallprompt', captureInstallPrompt);

    // 4. Service Worker Watchers & Push Tokens Re-Sync
    if ('serviceWorker' in navigator) {
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

        if ('Notification' in window && Notification.permission === 'granted') {
          syncPushTokenWithBackend(registration).catch(console.error);
        }
      });
    }

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
    };
  }, []);

  const syncPushTokenWithBackend = async (registration: ServiceWorkerRegistration) => {
    try {
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) return;

        const padding = '='.repeat((4 - (publicVapidKey.length % 4)) % 4);
        const base64 = (publicVapidKey + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: outputArray,
        });
      }

      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) return;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/notifications/subscribe`,
        subscription,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Push registry token re-sync failed:', err);
    }
  };

  const handleInstallTrigger = async () => {
    if (isIosDevice) {
      // Open Apple Instruction Overlay Sheets
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;
    
    // Trigger Clean Chrome Installation Prompt Dialogue Box
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowFloatingBtn(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* 1. TOP DISPATCH: Network Status Bar Indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] bg-red-950/95 border border-red-900/40 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl transition-all duration-300 max-w-[90%]">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-red-200 text-[10px] tracking-widest font-mono font-medium uppercase whitespace-nowrap">Offline — Local Cache Active</span>
        </div>
      )}

      {/* 2. TOP DISPATCH: Over-The-Air Update Banner */}
      {showUpdateBanner && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[99999] bg-[#0a0a0a]/95 border border-zinc-800/80 backdrop-blur-md p-3 rounded-xl flex items-center justify-between gap-4 shadow-2xl max-w-sm w-[92%] animate-in fade-in slide-in-from-top-3">
          <div className="flex flex-col">
            <h5 className="text-white text-xs font-bold tracking-wide uppercase font-mono">Build Update</h5>
            <p className="text-zinc-400 text-[10px] font-light mt-0.5">A new workspace version has been deployed.</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-black font-bold text-[10px] px-3 py-1.5 rounded-lg tracking-wider hover:bg-zinc-200 transition-all uppercase shrink-0 cursor-pointer"
          >
            Update
          </button>
        </div>
      )}

      {/* 3. PREMIUM FLOATING UTILITY TRIGGER ACTION BUTTON */}
      {showFloatingBtn && (
        <div className="fixed bottom-6 right-6 z-[9998] flex flex-col pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)]">
          <button
            onClick={handleInstallTrigger}
            className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-[#141414] text-white border border-zinc-800 p-3 px-4 rounded-full font-mono text-[11px] font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 transition-all duration-150 group cursor-pointer"
            aria-label="Install Aviorè Ecosystem Platform App"
          >
            <span className="text-sm group-hover:translate-y-[-1px] transition-transform duration-200">
              {isIosDevice ? '📱' : '⬇'}
            </span>
            <span>Install Aviorè</span>
          </button>
        </div>
      )}

      {/* 4. PREMIUM IOS ACQUISITION SHEETS OVERLAY SHEET */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[100000] flex items-end justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          {/* Dismiss Back-layer */}
          <div className="absolute inset-0" onClick={() => setShowIosGuide(false)} />
          
          {/* Luxury Card Box layout */}
          <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-4 text-center animate-in slide-in-from-bottom-8 duration-300 mb-2">
            <div className="flex flex-col items-center gap-1.5">
              <img 
                src="/icons/icon-192.png" 
                alt="Aviorè Logo" 
                className="w-12 h-12 rounded-xl object-cover border border-zinc-800 bg-zinc-900 shadow-inner mb-1"
              />
              <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase">Install Aviorè Mobile</h3>
              <p className="text-zinc-400 text-[11px] font-light leading-relaxed max-w-[240px]">
                Enjoy native interactions and full-screen luxury display capabilities on iOS.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-900/80 rounded-xl p-3.5 text-left flex flex-col gap-3 font-mono text-[10px] tracking-wide text-zinc-300">
              <div className="flex items-start gap-3">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white text-[9px] font-bold">1</span>
                <p className="leading-normal">Tap the native Safari <strong className="text-white">Share icon</strong> (square box with an upward arrow) in the browser toolbar panel.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white text-[9px] font-bold">2</span>
                <p className="leading-normal">Scroll through the option list and tap <strong className="text-white">"Add to Home Screen"</strong>.</p>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-widest uppercase py-3 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}