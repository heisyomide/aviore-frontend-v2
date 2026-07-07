'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PwaManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showCircleBtn, setShowCircleBtn] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(ua);
    setIsIosDevice(isAppleMobile);

    // 🟢 FIXED: Force the circle button to be visible on Android and iOS on launch
    if (!isInstalled) {
      setShowCircleBtn(true);
    }

    // Network Status Handlers
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // Intercept Browser Download Prompts
    const captureInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isInstalled) {
        setShowCircleBtn(true);
      }
    };
    window.addEventListener('beforeinstallprompt', captureInstallPrompt);

    // Service Worker Sync
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

  // 🌟 ONE-TAP DISPATCH ACTION: Trigger download sequence inside the modal
  const handleFinalDownloadAction = async () => {
    if (isIosDevice) {
      // Toggle instruction steps directly into view
      const iosSection = document.getElementById('aviore-safari-steps');
      if (iosSection) {
        iosSection.classList.remove('hidden');
        iosSection.classList.add('flex');
      }
      return;
    }

    // Android/Chrome Trigger
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowCircleBtn(false);
        setShowInstallModal(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback if browser prompt isn't ready yet
      alert("Installation setup initialized. Please use your browser menu options and select 'Add to Home Screen'.");
    }
  };

  return (
    <>
      {/* Network Alert Banner */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] bg-red-950/95 border border-red-900/40 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl max-w-[90%] text-white text-[10px] font-mono tracking-widest uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>Offline Mode Active</span>
        </div>
      )}

      {/* OTA Update Banner */}
      {showUpdateBanner && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[99999] bg-[#0a0a0a]/95 border border-zinc-800/80 backdrop-blur-md p-3 rounded-xl flex items-center justify-between gap-4 shadow-2xl max-w-sm w-[92%]">
          <div className="flex flex-col">
            <h5 className="text-white text-xs font-bold tracking-wide uppercase font-mono">Update Available</h5>
          </div>
          <button onClick={() => window.location.reload()} className="bg-white text-black font-bold text-[10px] px-3 py-1.5 rounded-lg font-mono tracking-wider uppercase cursor-pointer">
            Reload
          </button>
        </div>
      )}

      {/* 🟢 MINIMALIST FLOATING CIRCLE TRIGGER: Placed at bottom-28 so it never blocks checkout sliders */}
      {showCircleBtn && (
        <div className="fixed bottom-28 right-5 z-[9998] flex flex-col pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)]">
          <button
            onClick={() => setShowInstallModal(true)}
            className="w-12 h-12 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-white text-base shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:bg-zinc-900 active:scale-90 transition-all duration-150 cursor-pointer"
            aria-label="App Download Node"
          >
            ⬇
          </button>
        </div>
      )}

      {/* 🟢 THE DOWNLOAD MODAL DIALOG */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="absolute inset-0" onClick={() => setShowInstallModal(false)} />
          
          <div className="relative w-full max-w-xs bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-center animate-in scale-in duration-200">
            
            <div className="flex flex-col items-center gap-2">
              <img 
                src="/icons/icon-192.png" 
                alt="Logo" 
                className="w-12 h-12 rounded-xl object-cover border border-zinc-800 bg-zinc-900 shadow-md"
              />
              <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase mt-1">Install Aviorè</h3>
              <p className="text-zinc-400 text-[11px] font-light leading-relaxed">
                Download the application environment instantly onto your device display space.
              </p>
            </div>

            {/* iOS Helper Details: Starts Hidden, Reveals on click */}
            <div id="aviore-safari-steps" className="hidden bg-zinc-900/40 border border-zinc-900/80 rounded-xl p-3 text-left flex-col gap-2.5 font-mono text-[10px] text-zinc-300">
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white font-bold text-[9px]">1</span>
                <p>Tap Safari's <strong className="text-white">Share button</strong> (square icon with upward arrow).</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white font-bold text-[9px]">2</span>
                <p>Select <strong className="text-white">"Add to Home Screen"</strong> option list.</p>
              </div>
            </div>

            {/* UNIFIED INTERACTION CTA ACTIONS */}
            <div className="flex flex-col gap-1.5 font-mono mt-1">
              <button
                onClick={handleFinalDownloadAction}
                className="w-full bg-white hover:bg-zinc-200 text-black font-bold text-xs tracking-widest uppercase py-3 rounded-xl transition-all cursor-pointer"
              >
                {isIosDevice ? "⬇ Download App" : "⚡ Install Now"}
              </button>
              
              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full bg-transparent text-zinc-500 text-[10px] tracking-widest uppercase py-1.5 cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}