'use client';

import React from 'react';
import OfflineBanner from './OfflineBanner';
import UpdateBanner from './UpdateBanner';
import InstallPrompt from './InstallPrompt';
import PushManager from './PushManager';

export default function PwaManager() {
  return (
    <>
      <OfflineBanner />
      <UpdateBanner />
      <InstallPrompt />
      <PushManager />
    </>
  );
}