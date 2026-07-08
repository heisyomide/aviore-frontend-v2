'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../lib/axios';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { SupportBot } from '@/src/components/support/SupportBot';

interface RegisterInput {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // Left intact here for native HTML form picker state binding
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] px-4 py-12 relative">
      <div className="w-full max-w-md bg-[#e0e5ec] p-8 rounded-[30px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
        
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto bg-[#e0e5ec] rounded-full mb-4 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center">
            <UserPlus size={30} className="text-slate-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-700">Create Account</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Aviore Marketplace</p>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-6 space-y-3">
            <Loader2 className="animate-spin text-slate-500" size={32} />
            <p className="text-xs text-slate-400 tracking-wide font-medium">Loading register payload context...</p>
          </div>
        }>
          <RegisterFormFields />
        </Suspense>

      </div>

      <SupportBot />
    </div>
  );
}

function RegisterFormFields() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, handleSubmit } = useForm<RegisterInput>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('ref');
    if (code) {
      setReferralCode(code.trim().toUpperCase());
      console.log('🎯 Captured AVIORÈ Referral Engine Token:', code);
    }
  }, [searchParams]);

  const onSubmit = async (data: RegisterInput) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let clientIp = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        clientIp = ipData.ip;
      } catch (ipErr) {
        console.warn('⚠️ Telemetry bypass: IP fetch timed out.');
      }

      let fingerprint: string | null = null;
      try {
        const { getDeviceFingerprint } = await import('../../utils/fingerprint');
        fingerprint = await getDeviceFingerprint();
      } catch (telemetryErr) {
        console.warn('⚠️ Telemetry bypass: Registration fingerprint skipped.', telemetryErr);
      }

      // Convert date string directly to full ISO format string
      const isoBirthDate = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined;

      // 🟢 FIXED: Mapped 'dateOfBirth' form state to 'dob' field matching the NestJS DTO expectations
      const payload = {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dob: isoBirthDate, // ✨ KEY FIX HERE
        password: data.password,
        confirmPassword: data.confirmPassword,
        signupIp: clientIp,
        ipAddress: clientIp, 
        deviceFingerprint: fingerprint,
        referralCode: referralCode || undefined,
      };

      await api.post('/auth/register', payload);
      router.push(`/login?registered=true&email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      console.error(err.response?.data);
      const errorMessage = Array.isArray(err.response?.data?.message) 
        ? err.response.data.message[0] 
        : err.response?.data?.message || 'Registration failed.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {referralCode && (
        <div className="mb-2 text-center">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <p className="text-[9px] font-black uppercase text-emerald-600 tracking-wider">
              Code Applied: {referralCode}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <input
          {...register('firstName')}
          placeholder="First"
          required
          className="w-full bg-[#e0e5ec] p-3 rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] border-none outline-none text-xs placeholder:text-slate-400 text-slate-700"
        />
        <input
          {...register('middleName')}
          placeholder="Middle"
          required
          className="w-full bg-[#e0e5ec] p-3 rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] border-none outline-none text-xs placeholder:text-slate-400 text-slate-700"
        />
        <input
          {...register('lastName')}
          placeholder="Last"
          required
          className="w-full bg-[#e0e5ec] p-3 rounded-xl shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] border-none outline-none text-xs placeholder:text-slate-400 text-slate-700"
        />
      </div>

      <input
        {...register('email')}
        type="email"
        placeholder="Email Address"
        required
        className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400 text-slate-700"
      />

      <input
        {...register('phone')}
        type="tel"
        placeholder="Phone Number (e.g., +2348012345678)"
        required
        className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400 text-slate-700"
      />

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Date of Birth</label>
        <input
          {...register('dateOfBirth')}
          type="date"
          required
          className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm text-slate-700 uppercase font-mono"
        />
      </div>

      <div className="relative">
        <input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          required
          className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400 pr-12 text-slate-700"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-4 text-slate-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="relative">
        <input
          {...register('confirmPassword')}
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirm Password"
          required
          className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400 pr-12 text-slate-700"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-4 top-4 text-slate-400"
        >
          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <div className="text-xs text-red-500 text-center font-bold uppercase tracking-wider bg-red-500/5 p-2 rounded-xl border border-red-500/10 max-w-full overflow-hidden text-ellipsis">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full text-white p-4 rounded-xl bg-[#092c5c] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] font-bold transition-all duration-300 flex items-center justify-center cursor-pointer uppercase tracking-wider text-sm"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Register'}
      </button>

      <div className="text-center text-xs text-slate-400 mt-4 uppercase font-bold tracking-widest">
        Already have an account?{' '}
        <span onClick={() => router.push('/login')} className="font-semibold text-slate-600 cursor-pointer hover:underline">Login</span>
      </div>
    </form>
  );
}