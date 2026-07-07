'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 🌟 Using your application's setup to make requests

export default function PwaManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  // 🌟 PWA PUSH STATE
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    // 1. Network Status Checks
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // 🌟 2. Monitor existing push subscription permission layers
    if ('Notification' in window) {
      setPushStatus(Notification.permission);
    }

    // 3. Catch Android/Chrome native install triggers
    const captureInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (window.matchMedia('(display-mode: standalone)').matches === false) {
        setShowInstallBtn(true);
      }
    };

    window.addEventListener('beforeinstallprompt', captureInstallPrompt);

    // 4. Service Worker Version Change Watcher
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

        // 🌟 Try automatic silent push re-sync if permission is already granted
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

  // 🌟 HELPER: Converts VAPID keys to a readable binary array format for the browser
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

  // 🌟 CORE ENGINE: Subscribes device to Google/Apple servers & records to NestJS
  const syncPushTokenWithBackend = async (registration: ServiceWorkerRegistration) => {
    try {
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) {
          console.warn('Skipping push configuration: VAPID public key undefined.');
          return;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
      }

      // Grab JWT token from local cookies or storage (Matches your auth engine)
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token=')) // Change 'token=' to matching cookie key if needed
        ?.split('=')[1];

      if (!token) {
        console.warn('User not logged in. Postponing push subscription upload.');
        return;
      }

      // Submit device payload target straight to NestJS Endpoint securely
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/notifications/subscribe`,
        subscription,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Device push gateway endpoints registered successfully.');
    } catch (err) {
      console.error('Failed to link device token to the server:', err);
    }
  };

  // 🌟 TRIGGER ACTION: Fired on user manual click to pass Apple guidelines
  const requestNotificationAccess = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert('Push alerts are completely unsupported on this browser profile.');
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

      {/* Persistent Smart App Banner (Chrome/Android installation) */}
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

      {/* 🌟 NEW: Live Push Prompt Notification HUD (Displays only when context status is default) */}
      {pushStatus === 'default' && (
        <div className="fixed bottom-6 left-6 z-[9997] bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col items-center gap-3 shadow-2xl font-mono max-w-xs text-center border-l-4 border-l-blue-500">
          <h4 className="text-xs font-bold text-white tracking-widest uppercase">Enable Realtime Alerts</h4>
          <p className="text-[10px] text-neutral-400 font-light">Get instantly notified of orders, chats, and account activity directly on your lock screen.</p>
          <button
            onClick={requestNotificationAccess}
            className="w-full bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-xs tracking-widest uppercase hover:bg-blue-500 transition-all"
          >
            Allow Notifications
          </button>
        </div>
      )}
    </>
  );
}