'use client';

import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  CheckCircle2,
} from 'lucide-react';

import { api } from '@/src/lib/axios';
import type { LoginInput } from '@/src/types/auth';

// ======================================================
// PAGE WRAPPER
// ======================================================
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
          <Loader2
            className="animate-spin text-slate-500"
            size={32}
          />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

// ======================================================
// LOGIN FORM
// ======================================================
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const registered = searchParams.get('registered');
  const initialEmail = searchParams.get('email') || '';

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

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

const [error, setError] = useState<string | null>(null);
  

  // ======================================================
  // PREFILL EMAIL
  // ======================================================
  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail);
    }
  }, [initialEmail, setValue]);

  // ======================================================
  // LOGIN HANDLER
  // ======================================================
const onSubmit = async (data: LoginInput) => {
  try {
    setLoading(true);
    setError(null);

    const response = await api.post('/auth/login', data);
    
    // Extract data from your specific JSON structure
    const { access_token, user } = response.data;
    
    // Convert to lowercase to be safe: "VENDOR" becomes "vendor"
    const role = String(user?.role || '').toLowerCase().trim();

    // Save to localStorage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('role', role);
    localStorage.setItem('firstName', user?.firstName || '');
    localStorage.setItem('lastName', user?.lastName || '');

    console.log("Authenticated as:", role); // Debugging line

    // 🚀 THE REDIRECT LOGIC
    if (role === 'admin') {
      router.push('/admin/products');
      return;
    }

    if (role === 'vendor') {
      // Use the exact values from your JSON: "APPROVED" and true
      if (user.isVerified || user.kycStatus === 'APPROVED') {
        router.push('/vendor');
      } else if (user.kycStatus === 'PENDING') {
        router.push('/dashboard/waiting-room');
      } else {
        router.push('/kyc-verification');
      }
      return;
    }

    // Default for CUSTOMER
    router.push('/dashboard');
    
  } catch (err: any) {
    setError(err?.response?.data?.message || 'Invalid email or password');
  } finally {
    setLoading(false);
  }
};
  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] px-4">

      <div className="w-full max-w-sm bg-[#e0e5ec] p-8 rounded-[30px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">

        {/* SUCCESS ALERT */}
        {registered && (
          <div className="mb-6 p-3 bg-green-100/60 border border-green-200 rounded-2xl flex items-center gap-2 text-green-700 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={16} />
            Registration Successful! Please Login.
          </div>
        )}

        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto bg-[#e0e5ec] rounded-full mb-4 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center">
            <User
              size={32}
              className={
                registered
                  ? 'text-green-500'
                  : 'text-slate-600'
              }
            />
          </div>

          <h1 className="text-xl font-bold text-slate-700">
            {registered
              ? 'Verify to Continue'
              : 'Welcome Back'}
          </h1>

          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
            Aviorè Marketplace
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* EMAIL */}
          <div>
            <input
              {...register('email', {
                required: 'Email is required',
              })}
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              disabled={loading}
              className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] outline-none text-sm text-slate-700 disabled:opacity-70"
            />

            {errors.email && (
              <p className="mt-2 text-[10px] font-bold uppercase text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="relative">
              <input
                {...register('password', {
                  required: 'Password is required',
                })}
                type={
                  showPassword ? 'text' : 'password'
                }
                placeholder="Password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] outline-none pr-12 text-sm text-slate-700 disabled:opacity-70"
              />

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-4 top-4 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-[10px] font-bold uppercase text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* API ERROR */}
          {error && (
            <div className="text-[10px] font-bold text-red-500 text-center uppercase tracking-wider">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <Loader2
                className="animate-spin"
                size={20}
              />
            ) : (
              'SIGN IN'
            )}
          </button>

          {/* FOOTER */}
          <div className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
            New here?{' '}

            <button
              type="button"
              onClick={() =>
                router.push('/register')
              }
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