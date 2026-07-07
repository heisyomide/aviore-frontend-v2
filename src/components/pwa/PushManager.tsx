'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PushManager() {
  const [showBellBtn, setShowBellBtn] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 🟢 FIXED: If browser support exists and permission isn't granted yet, show the trigger button!
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        setShowBellBtn(true);
      } else {
        // If already granted, run silent re-sync check to match active sessions
        navigator.serviceWorker.ready.then((reg) => syncPushTokenWithBackend(reg)).catch(console.error);
      }
    }
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

      // 🟢 FIXED: Ultra-resilient token extraction strategy. Pulls from both storage frameworks and cookies
      const token = 
        localStorage.getItem('token') || 
        sessionStorage.getItem('token') || 
        document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1];

      if (!token) {
        console.warn("Push synchronization halted: Missing Authorization JWT");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/notifications/subscribe`,
        subscription,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Push registry token re-sync failed:', err);
    }
  };

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) return;

    // 🌟 Programmatically force browser engine system request prompt popup window context
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setShowBellBtn(false);
      const registration = await navigator.serviceWorker.ready;
      await syncPushTokenWithBackend(registration);
    }
  };

  if (!showBellBtn) return null;

  return (
    // Stacked elegantly right above the install prompt circle button at bottom-44
    <div className="fixed bottom-44 right-5 z-[9995] pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)] animate-bounce">
      <button
        onClick={handleRequestPermission}
        className="w-12 h-12 rounded-full bg-[#A4143D] text-white flex items-center justify-center text-sm shadow-[0_8px_25px_rgba(164,20,61,0.4)] hover:bg-[#861032] active:scale-90 transition-all duration-150 cursor-pointer border border-[#b21844]"
        title="Enable Push Alerts"
      >
        🔔
      </button>
    </div>
  );
}