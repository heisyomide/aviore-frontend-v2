'use client';

import React, { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showCircleBtn, setShowCircleBtn] = useState(false);
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

    if (!isInstalled) {
      setShowCircleBtn(true);
    }

    const captureInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isInstalled) {
        setShowCircleBtn(true);
      }
    };

    window.addEventListener('beforeinstallprompt', captureInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', captureInstallPrompt);
  }, []);

  const handleFinalDownloadAction = async () => {
    if (isIosDevice) {
      const iosSection = document.getElementById('aviore-safari-steps');
      if (iosSection) {
        iosSection.classList.remove('hidden');
        iosSection.classList.add('flex');
      }
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowCircleBtn(false);
        setShowInstallModal(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("Installation setup initialized. Please open your browser options menu and tap 'Add to Home Screen'.");
    }
  };

  if (!showCircleBtn) return null;

  return (
    <>
      {/* Circle trigger button positioned at bottom-28 */}
      <div className="fixed bottom-28 right-5 z-[9996] pb-[env(safe-area-inset-bottom,0px)] pr-[env(safe-area-inset-right,0px)]">
        <button
          onClick={() => setShowInstallModal(true)}
          className="w-12 h-12 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-white text-base shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:bg-zinc-900 active:scale-90 transition-all duration-150 cursor-pointer"
          title="Install Aviorè App"
        >
          ⬇
        </button>
      </div>

      {showInstallModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="absolute inset-0" onClick={() => setShowInstallModal(false)} />
          
          <div className="relative w-full max-w-xs bg-[#0a0a0a] border border-zinc-900 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-center animate-in scale-in duration-200">
            <div className="flex flex-col items-center gap-2">
              <img src="/icons/icon-192.png" alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-zinc-800 bg-zinc-900" />
              <h3 className="text-white text-xs font-bold font-mono tracking-widest uppercase mt-1">Install Aviorè</h3>
              <p className="text-zinc-400 text-[11px] font-light leading-relaxed">
                Deploy the workspace application layout safely onto your device view space.
              </p>
            </div>

            <div id="aviore-safari-steps" className="hidden bg-zinc-900/40 border border-zinc-900/80 rounded-xl p-3 text-left flex-col gap-2.5 font-mono text-[10px] text-zinc-300">
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white font-bold text-[9px]">1</span>
                <p>Tap Safari's <strong className="text-white">Share button</strong> (box with upward arrow).</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white font-bold text-[9px]">2</span>
                <p>Select <strong className="text-white">"Add to Home Screen"</strong> from the list panel.</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 font-mono mt-1">
              <button onClick={handleFinalDownloadAction} className="w-full bg-white hover:bg-zinc-200 text-black font-bold text-xs tracking-widest uppercase py-3 rounded-xl transition-all cursor-pointer">
                {isIosDevice ? "⬇ Download App" : "⚡ Install Now"}
              </button>
              <button onClick={() => setShowInstallModal(false)} className="w-full bg-transparent text-zinc-500 text-[10px] tracking-widest uppercase py-1.5 cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}