'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/src/components/navbar/Navbar';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
}

export default function RegisterVendor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    storeName: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'VENDOR',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Show success state briefly before redirecting
      setIsSuccess(true);
      
      setTimeout(() => {
        // Redirect to login with the email as a hint
        router.push(`/login?email=${encodeURIComponent(formData.email)}&registered=true`);
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
         <Navbar />
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Account Created!</h1>
          <p className="text-slate-500 mt-2">Redirecting you to login to start your verification...</p>
          <Loader2 className="animate-spin mx-auto mt-6 text-slate-300" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-sm">
            <Store className="text-orange-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Join Aviorè</h1>
          <p className="text-slate-500 text-sm mt-1">
            Create your store account to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl">
            <span className="font-bold">Registration Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputGroup 
              label="First Name" 
              name="firstName"
              icon={<User size={18}/>} 
              placeholder="Akin" 
              value={formData.firstName}
              onChange={handleChange} 
            />
            <InputGroup 
              label="Last Name" 
              name="lastName"
              icon={<User size={18}/>} 
              placeholder="Samson"
              value={formData.lastName}
              onChange={handleChange} 
            />
          </div>

          <InputGroup 
            label="Store Name" 
            name="storeName"
            icon={<Store size={18}/>} 
            placeholder="e.g. Classic Aviorè Store"
            value={formData.storeName}
            onChange={handleChange} 
          />

          <InputGroup 
            label="Email Address" 
            name="email"
            icon={<Mail size={18}/>} 
            type="email" 
            placeholder="vendor@example.com"
            value={formData.email}
            onChange={handleChange} 
          />

          <InputGroup 
            label="Password" 
            name="password"
            icon={<Lock size={18}/>} 
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange} 
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-orange-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 shadow-xl hover:shadow-orange-200"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{' '}
          <button 
            type="button"
            onClick={() => router.push('/login')} 
            className="text-orange-600 font-bold hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

function InputGroup({ label, icon, ...props }: InputGroupProps) {
  return (
    <div className="group">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-orange-500 transition-colors">
          {icon}
        </div>
        <input
          {...props}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
          required
        />
      </div>
    </div>
  );
}