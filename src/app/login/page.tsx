'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../lib/axios';
import { LoginInput } from '../../types/auth';
import { Eye, EyeOff, Loader2, User, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/src/components/navbar/Navbar';

// 🚀 1. This wrapper is the only structural change needed to fix the error
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec]">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}

// 🚀 2. Your original component logic and UI stays here
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const registered = searchParams.get('registered');
  const initialEmail = searchParams.get('email') || '';

  const { register, handleSubmit, setValue } = useForm<LoginInput>({
    defaultValues: { email: initialEmail }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail);
    }
  }, [initialEmail, setValue]);

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;
      const role = String(user?.role || '').toLowerCase().trim();

      // 1. 🍪 SET THE COOKIE (For the Middleware "Bouncer")
      // We set 'path=/' so the cookie is visible to all pages
      // We set 'max-age' so it lasts (e.g., 7 days = 604800 seconds)
      document.cookie = `token=${access_token}; path=/; max-age=604800; SameSite=Lax; ${
        window.location.protocol === 'https:' ? 'Secure' : ''
      }`;

      // 2. 💾 SET LOCALSTORAGE (For your internal app state/Zustand)
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      localStorage.setItem('firstName', user?.firstName || '');
      localStorage.setItem('lastName', user?.lastName || '');

      // 3. 🚀 REDIRECT LOGIC (Keep your existing role-based routing)
      if (role === 'admin') {
        router.push('/admin/products');
        return;
      }

      if (role === 'vendor') {
        if (user.isVerified) {
          router.push('/vendor');
          return;
        }
        if (user.kycStatus === 'PENDING') {
          router.push('/dashboard/waiting-room');
          return;
        }
        router.push('/kyc-verification');
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
     
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] px-4">
       
      <div className="w-full max-w-sm bg-[#e0e5ec] p-8 rounded-[30px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
        
        {registered && (
          <div className="mb-6 p-3 bg-green-100/50 border border-green-200 rounded-2xl flex items-center gap-2 text-green-700 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={16}/>
            Registration Successful! Please Login.
          </div>
        )}

        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto bg-[#e0e5ec] rounded-full mb-4 shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center">
            <User size={32} className={`${registered ? 'text-green-500' : 'text-slate-600'}`} />
          </div>
          <h1 className="text-xl font-bold text-slate-700">
            {registered ? 'Verify to Continue' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
            Aviorè Marketplace
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input
            {...register('email')}
            type="email"
            placeholder="Email Address"
            className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] outline-none text-sm text-slate-700"
          />

          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full bg-[#e0e5ec] p-4 rounded-xl shadow-[inset_6px_6px_12px_#bebebe,inset_-6px_-6px_12px_#ffffff] outline-none pr-12 text-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-400"
            >
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          {error && (
            <div className="text-[10px] font-bold text-red-500 text-center uppercase">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : 'SIGN IN'}
          </button>

          <div className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
            New here?{' '}
            <span
              onClick={() => router.push('/register')}
              className="text-orange-600 cursor-pointer hover:underline"
            >
              Join Aviorè
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}