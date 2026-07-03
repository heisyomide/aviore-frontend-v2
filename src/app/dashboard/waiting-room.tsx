import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { middleware } from '../../middleware'; // Your Axios instance
import { api } from '@/src/lib/axios';


export default function KycWaitingRoom() {
  const router = useRouter();
  const [status, setStatus] = useState<'PENDING' | 'REJECTED' | 'APPROVED'>('PENDING');
  const [checking, setChecking] = useState(false);

  // Function to pull the live status update if they click "Refresh Status"
  const checkLiveStatus = async () => {
    setChecking(true);
    try {
      const response = await api.get('/auth/me'); // Get updated profile info
      const currentStatus = response.data.kycStatus;
      setStatus(currentStatus);

      if (currentStatus === 'APPROVED') {
        // If an admin approved them, release them immediately to the main app dashboard
        router.push('/vendor/dashboard');
      }
    } catch (err) {
      console.error('Error syncing profile status payload:', err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        
        {/* Animated Hourglass or Verification Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Compliance Identity Vault Locked
        </h1>

        {status === 'PENDING' && (
          <>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Thank you for uploading your identity documents. Our verification nodes and administrative teams are currently auditing your data for compliance. This routine evaluation usually wraps up within 1 to 24 hours.
            </p>
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-3 rounded-xl mb-6 font-medium">
              Status: ⏳ Under Active Manual Verification Review
            </div>
          </>
        )}

        {status === 'REJECTED' && (
          <>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Your identity validation checks could not be verified automatically. This may be due to low light, resolution mismatch, or blurred image artifacts.
            </p>
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-xl mb-6 font-medium">
              Status: ❌ Document Verification Mismatch
            </div>
            <button 
              onClick={() => router.push('/vendor/submit-kyc-retry')}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm py-3 px-4 rounded-xl transition duration-200 mb-3"
            >
              Re-upload Identity Document
            </button>
          </>
        )}

        <button
          onClick={checkLiveStatus}
          disabled={checking}
          className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium text-sm py-3 px-4 rounded-xl transition duration-200"
        >
          {checking ? 'Syncing Vault...' : 'Refresh Verification Status'}
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            router.push('/login');
          }}
          className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline transition font-medium"
        >
          Sign Out of Account
        </button>

      </div>
    </div>
  );
}