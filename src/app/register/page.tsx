'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/axios';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<RegisterInput>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterInput) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. TELEMETRY: Resolve client-side fingerprints out-of-band
      let clientIp = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        clientIp = ipData.ip;
      } catch (ipErr) {
        console.warn('⚠️ Telemetry bypass: IP fetch timed out.');
      }

      // Generate a canvas/user-agent fingerprint string hash
      const fingerprint = typeof window !== 'undefined' 
        ? btoa(navigator.userAgent).slice(0, 32) 
        : null;

      // 2. PAYLOAD: Match your security-enhanced NestJS DTO architecture
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        signupIp: clientIp,
        deviceFingerprint: fingerprint,
      };

      await api.post('/auth/register', payload);
      router.push('/login');
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
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] px-4">
      <div className="w-full max-w-sm bg-[#e0e5ec] p-8 rounded-[30px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
        
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto bg-[#e0e5ec] rounded-full mb-4 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center">
            <UserPlus size={30} className="text-slate-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-700">Create Account</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Aviore Marketplace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div className="flex gap-3">
            <input
              {...register('firstName')}
              placeholder="first name"
              required
              className="w-1/2 bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400"
            />
            <input
              {...register('lastName')}
              placeholder="last name"
              required
              className="w-1/2 bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400"
            />
          </div>

          <input
            {...register('email')}
            type="email"
            placeholder="email"
            required
            className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400"
          />

          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              required
              className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400 pr-12"
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
              placeholder="confirm password"
              required
              className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] border-none outline-none text-sm placeholder:text-slate-400 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-4 text-slate-400"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="text-xs text-red-500 text-center font-semibold italic">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white p-4 rounded-xl bg-[#092c5c] shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff] hover:shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] font-bold transition-all duration-300 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'REGISTER'}
          </button>

          <div className="text-center text-xs text-slate-400 mt-4">
            Already have an account?{' '}
            <span onClick={() => router.push('/login')} className="font-semibold text-slate-600 cursor-pointer">Login</span>
          </div>
        </form>
      </div>
    </div>
  );
}