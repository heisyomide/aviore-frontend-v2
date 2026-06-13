// app/growth/login/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Users, AlertCircle } from 'lucide-react';

export default function GrowthNodeLoginPage() {
  const router = useRouter();
  const [teamCode, setTeamCode] = useState('');
  const [passcode, setPasscode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Orchestrate manual focus transitions as digits are pinned
  const handlePinChange = (value: string, index: number) => {
    // Only accept numeric inputs
    if (value && isNaN(Number(value))) return; 
    
    const updatedPasscode = [...passcode];
    // Take only the last entered character (handles paste or re-entry)
    const targetChar = value.substring(value.length - 1);
    updatedPasscode[index] = targetChar;
    setPasscode(updatedPasscode);

    // Shift focus right if a digit was added
    if (targetChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Standard backspace focus regression handling
    if (e.key === 'Backspace') {
      if (!passcode[index] && index > 0) {
        const updatedPasscode = [...passcode];
        updatedPasscode[index - 1] = '';
        setPasscode(updatedPasscode);
        inputRefs.current[index - 1]?.focus();
      } else {
        const updatedPasscode = [...passcode];
        updatedPasscode[index] = '';
        setPasscode(updatedPasscode);
      }
    }
  };

  const executeNodeAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const consolidatedPasscode = passcode.join('');
    if (!teamCode.trim() || consolidatedPasscode.length !== 6) {
      setError('Please complete all tracking configuration parameters.');
      setIsSubmitting(false);
      return;
    }

    try {
      // CRITICAL UPDATE: Point explicitly to your NestJS backend host port
      // Update 'http://localhost:8000' if your backend runs on a different port
      const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${backendBaseUrl}/v1/growth/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          teamCode: teamCode.trim().toUpperCase(), // Normalizes structural tokens
          passcode: consolidatedPasscode,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Access Denied: Password mismatch.');
      }

      // Persist access token in local storage for upcoming dashboard sync operations
      localStorage.setItem('aviore_auth_token', payload.accessToken);
      if (payload.user) {
        localStorage.setItem('aviore_operator_profile', JSON.stringify(payload.user));
      }

      // Route cleanly to the dashboard analytics pipeline
      router.push('/growth/dashboard');
    } catch (err: any) {
      setError(err.message || 'Network degradation failure connecting to cluster identity core.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 p-8 rounded-3xl shadow-xl space-y-6">
        
        {/* IDENTITY MATRIX BRANDING */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-[#A4143D]/10 text-[#A4143D] flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-sans uppercase">
            AVIORÈ Growth Terminal
          </h2>
          <p className="text-xs text-zinc-400 font-light">
            Authenticate to sync your cluster network operations node
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-mono">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={executeNodeAuthentication} className="space-y-5">
          
          {/* TEAM TRACKER INPUT */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
              Cluster Team Code
            </label>
            <div className="relative">
              <Users className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                placeholder="e.g. TEAM_IO"
                className="w-full bg-zinc-50 font-mono text-xs pl-10 pr-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:bg-white transition-all text-zinc-900"
              />
            </div>
          </div>

          {/* 6-DIGIT PASSCODE ELEMENT */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-semibold uppercase text-zinc-400 tracking-wider block">
              6-Digit Secure Passcode
            </label>
            <div className="flex justify-between gap-2">
              {passcode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => { inputRefs.current[index] = el!; }}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center font-mono text-lg font-bold bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:bg-white transition-all text-zinc-900"
                />
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 inline-flex items-center justify-center bg-[#A4143D] hover:bg-[#801030] disabled:bg-zinc-300 text-white py-3 rounded-xl text-xs font-semibold shadow-md transition-all space-x-2"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Unlock Operator Terminal'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}