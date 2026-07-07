'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PwaManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    // 1. Network Sync Handlers
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // 2. Read Native Notification Permissions
    if ('Notification' in window) {
      setPushStatus(Notification.permission);
    }

    // 3. Prevent standard prompt and catch install target reference hook
    const captureInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallBtn(true);
      }
    };

    window.addEventListener('beforeinstallprompt', captureInstallPrompt);

    // 4. Lifecycle Controller Matrix Engine
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
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

        if (Notification.permission === 'granted') {
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

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const syncPushTokenWithBackend = async (registration: ServiceWorkerRegistration) => {
    try {
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) return;

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
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
      
      console.log('✅ Device push gateway endpoints registered safely.');
    } catch (err) {
      console.error('Failed to link device token to the server:', err);
    }
  };

  const requestNotificationAccess = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert('Push notifications are unsupported on this browser profile.');
      return;
    }

    const permission = await Notification.requestPermission();
    setPushStatus(permission);

    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await syncPushTokenWithBackend(registration);
    }
  };

  const triggerNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* 1. TOP DISPATCH: Offline Status HUD Bar */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] bg-red-950/95 border border-red-800/60 backdrop-blur-md px-4 py-2.5 rounded-full flex items-center gap-2.5 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-2 max-w-[90%] w-auto">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-red-200 tracking-widest text-[10px] font-medium font-mono uppercase whitespace-nowrap">
            Offline Mode — Cache Active
          </span>
        </div>
      )}

      {/* 2. TOP DISPATCH: Over-The-Air Update Banner */}
      {showUpdateBanner && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[99999] bg-[#0a0a0a]/95 border border-zinc-800/80 backdrop-blur-md p-3.5 rounded-xl flex items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm w-[92%] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-0.5">
            <h5 className="text-white text-xs font-semibold tracking-wider uppercase font-mono">System Update</h5>
            <p className="text-zinc-400 text-[11px] font-light">A new marketplace build is available.</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-black font-bold text-[11px] px-3.5 py-1.5 rounded-lg tracking-wider hover:bg-zinc-200 transition-all uppercase shrink-0 cursor-pointer"
          >
            Update
          </button>
        </div>
      )}

      {/* 3. BOTTOM HUD STACK: Unifies Custom Install Prompts & Notifications */}
      {(showInstallBtn || pushStatus === 'default') && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-32px)] max-w-[420px] flex flex-col gap-3 pb-[env(safe-area-inset-bottom,0px)]">
          
          {/* CRITICAL UPGRADE: Render Native App Installer Panel first */}
          {showInstallBtn && (
            <div className="bg-[#0a0a0a]/95 border border-zinc-800/50 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col gap-3.5 animate-in slide-in-from-bottom-6 duration-300 border-l-4 border-l-white">
              <div className="flex items-start gap-3.5">
                <img
                  src="/icons/icon-192.png"
                  alt="Aviorè"
                  className="w-11 h-11 rounded-xl object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-xs font-bold tracking-widest uppercase font-mono">
                    Aviorè App Installation
                  </h4>
                  <p className="text-zinc-400 text-[11px] font-light leading-relaxed mt-0.5">
                    Add Aviorè to your home screen for an immersive, badgeless full-screen workspace workflow experience.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs font-medium">
                <button
                  onClick={() => setShowInstallBtn(false)}
                  className="text-zinc-500 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={triggerNativeInstall}
                  className="bg-white hover:bg-zinc-200 text-black font-bold px-4 py-1.5 rounded-lg transition-all tracking-wider uppercase text-[11px] cursor-pointer shadow-sm"
                >
                  Install Now
                </button>
              </div>
            </div>
          )}

          {/* Realtime Alert Permissions Prompt Panel */}
          {pushStatus === 'default' && (
            <div className="bg-[#0a0a0a]/95 border border-zinc-800/50 backdrop-blur-md p-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col gap-3.5 animate-in slide-in-from-bottom-6 duration-300 border-l-4 border-l-blue-600">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-950/50 border border-blue-900/50 flex items-center justify-center text-blue-400 text-lg shrink-0">
                  🔔
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-xs font-bold tracking-widest uppercase font-mono">
                    Realtime System Alerts
                  </h4>
                  <p className="text-zinc-400 text-[11px] font-light leading-relaxed mt-0.5">
                    Authorize lockscreen alerts for incoming chat messages, vendor orders, and secure account updates.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs font-medium">
                <button
                  onClick={() => setPushStatus('denied')}
                  className="text-zinc-500 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Not Now
                </button>
                <button
                  onClick={requestNotificationAccess}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded-lg transition-all tracking-wider uppercase text-[11px] cursor-pointer shadow-sm"
                >
                  Enable Alerts
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
}