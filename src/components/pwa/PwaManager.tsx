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

    // 1. Detect if the application is already running standalone
    const isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(ua);
    setIsIosDevice(isAppleMobile);

    if (isInstalled) {
      setShowCircleBtn(false);
    } else {
      // iOS doesn't have an event listener, so display the circle widget proactively
      if (isAppleMobile) {
        setShowCircleBtn(true);
      }
    }

    // 2. Network Diagnostics Tracker
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // 3. Intercept Android / Chromium Desktop App Downloader Prompts
    const captureInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isInstalled) {
        setShowCircleBtn(true);
      }
    };
    window.addEventListener('beforeinstallprompt', captureInstallPrompt);

    // 4. Background Service Worker & Notification Token Syncer
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

  // 🌟 DYNAMIC INSTALLATION ENGINE EXECUTED FROM INSIDE THE MODAL
  const executeInstallation = async () => {
    if (isIosDevice) {
      // Toggle the modal view into standard user guide setup display configuration
      const iosGuideSection = document.getElementById('aviore-ios-guide');
      if (iosGuideSection) {
        iosGuideSection.classList.remove('hidden');
        iosGuideSection.classList.add('flex');
      }
      return;
    }

    if (!deferredPrompt) return;

    // Trigger native browser engine installer instantly
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    
    if (choice.outcome === 'accepted') {
      setShowCircleBtn(false);
      setShowInstallModal(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* 1. TOP DISPATCH: Offline Status Bar Indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] bg-red-950/95 border border-red-900/40 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl max-w-[90%]">
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

      {/* 3. PREMIUM MINIMALIST CIRCLE TRIGGER WIDGET BUTTON 
          Elevated to bottom-28 to ensure zero overlap with Add To Cart/Checkout sticky drawers */}
      {showCircleBtn && (
        <div className="fixed bottom-28 right-5 z-[9998] flex flex-col pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)]">
          <button
            onClick={() => setShowInstallModal(true)}
            className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center text-white text-sm shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:bg-[#141414] active:scale-90 transition-all duration-150 font-mono cursor-pointer"
            aria-label="Open Aviorè App Installer Drawer Menu"
          >
            ⬇
          </button>
        </div>
      )}

      {/* 4. THE LUXURY INTERACTIVE APP DESCENT DIALOG MODAL SUITE */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          {/* Dismiss Back-shading layer click catch */}
          <div className="absolute inset-0" onClick={() => setShowInstallModal(false)} />
          
          {/* Main Workspace Frame container */}
          <div className="relative w-full max-w-xs bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col gap-4 text-center animate-in scale-in duration-200">
            
            <div className="flex flex-col items-center gap-1.5">
              <img 
                src="/icons/icon-192.png" 
                alt="Aviorè Core Logo App Icon Layout" 
                className="w-12 h-12 rounded-xl object-cover border border-zinc-800 bg-zinc-900 shadow-lg mb-1"
              />
              <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase">Aviorè App Module</h3>
              <p className="text-zinc-400 text-[11px] font-light leading-relaxed">
                {isIosDevice 
                  ? "Launch Aviorè directly inside full-screen immersive native mobile framing layouts via Safari parameters."
                  : "Download and deploy the application environment instantly onto your mobile screen workspace."
                }
              </p>
            </div>

            {/* NESTED LAYER BLOCK: Dynamic iOS Safari step text mapping (Hidden by default until click) */}
            <div id="aviore-ios-guide" className="hidden bg-zinc-900/40 border border-zinc-900/80 rounded-xl p-3 text-left flex-col gap-2.5 font-mono text-[10px] tracking-wide text-zinc-300 animate-in fade-in duration-300">
              <div className="flex items-start gap-2.5">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white font-bold text-[9px]">1</span>
                <p className="leading-normal">Tap Safari’s native <strong className="text-white">Share button</strong> (square icon with an upward arrow).</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white font-bold text-[9px]">2</span>
                <p className="leading-normal">Select <strong className="text-white">"Add to Home Screen"</strong> from options list.</p>
              </div>
            </div>

            {/* ACTIVE ACTION CONTROL HUDS */}
            <div className="flex flex-col gap-1.5 mt-1 font-mono">
              <button
                onClick={executeInstallation}
                className="w-full bg-white hover:bg-zinc-200 text-black font-bold text-xs tracking-widest uppercase py-3 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                {isIosDevice ? "See Safari Guide" : "⚡ Install Now"}
              </button>
              
              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full bg-transparent text-zinc-500 hover:text-zinc-400 text-[10px] tracking-widest uppercase py-2 transition-all cursor-pointer"
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