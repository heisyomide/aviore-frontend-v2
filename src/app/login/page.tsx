'use client';

import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, User, CheckCircle2, AlertCircle } from 'lucide-react';

import { api } from '@/src/lib/axios';
import type { LoginInput } from '@/src/types/auth';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoginFormContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
      <Loader2 className="animate-spin text-slate-500" size={32} />
    </div>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State
  const isRegistered = searchParams.get('registered') === 'true';
  const initialEmail = searchParams.get('email') || '';
  const sessionExpired = searchParams.get('session') === 'expired';

  // Form State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      email: initialEmail,
      password: '',
    },
  });

  useEffect(() => {
    if (initialEmail) setValue('email', initialEmail);
  }, [initialEmail, setValue]);

const onSubmit = async (data: LoginInput) => {
  try {
    setIsLoading(true);
    setApiError(null);

    const response = await api.post('/auth/login', data);
    const { access_token, user } = response.data;
    
    // Normalize Role to Uppercase for consistent logic
    const role = String(user?.role || '').toUpperCase().trim();

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('role', role);
    localStorage.setItem('firstName', user?.firstName || '');
    localStorage.setItem('lastName', user?.lastName || '');

    let destination = '/dashboard';
    
    if (role === 'ADMIN') {
      destination = '/admin/products';
    } else if (role === 'VENDOR') {
      // Direct comparison with specific backend strings
      const isApproved = user.isVerified === true || user.kycStatus === 'APPROVED';
      const isPending = user.kycStatus === 'PENDING';
      
      if (isApproved) {
        destination = '/vendor';
      } else if (isPending) {
        destination = '/dashboard/waiting-room';
      } else {
        destination = '/kyc-verification';
      }
    }

    // Trigger the auth sync event for useAuth hook
    window.dispatchEvent(new Event("aviore_auth_sync"));

    // Final push - window.location is safer for the Middleware session check
    window.location.href = destination;

  } catch (err: any) {
    const message = err?.response?.data?.message || 'Invalid email or password.';
    setApiError(message);
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] px-4">
      <div className="w-full max-w-sm bg-[#e0e5ec] p-8 rounded-[30px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
        
        {/* Status Alerts */}
        {isRegistered && (
          <div className="mb-6 p-3 bg-green-100/60 border border-green-200 rounded-2xl flex items-center gap-2 text-green-700 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={16} />
            Account created! Please sign in.
          </div>
        )}

        {sessionExpired && (
          <div className="mb-6 p-3 bg-amber-100/60 border border-amber-200 rounded-2xl flex items-center gap-2 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
            <AlertCircle size={16} />
            Session expired. Please log in again.
          </div>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto bg-[#e0e5ec] rounded-full mb-4 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center">
            <User size={32} className={isRegistered ? 'text-green-500' : 'text-slate-600'} />
          </div>
          <h1 className="text-xl font-bold text-slate-700">
            {isRegistered ? 'Verify Identity' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Aviorè Marketplace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder="Email Address"
              disabled={isLoading}
              className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] outline-none text-sm text-slate-700 disabled:opacity-50 transition-opacity"
            />
            {errors.email && (
              <p className="px-2 text-[10px] font-bold uppercase text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                disabled={isLoading}
                className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] outline-none pr-12 text-sm text-slate-700 disabled:opacity-50 transition-opacity"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="px-2 text-[10px] font-bold uppercase text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Error Message */}
          {apiError && (
            <div className="p-3 rounded-lg bg-red-50 text-[10px] font-bold text-red-500 text-center uppercase tracking-wider animate-pulse">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center transition-all active:scale-95 disabled:bg-slate-400"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'SIGN IN'}
          </button>

          <div className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
            New here?{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-orange-600 hover:underline"
            >
              Join Aviorè
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}