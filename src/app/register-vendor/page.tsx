'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect, Suspense, memo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Store, Mail, Lock, User, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Share2, Calendar, Phone, ShieldCheck, Upload, FileCheck } from 'lucide-react';
import { api } from '../../lib/axios';

// --- TYPES & INTERFACES ---
interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
}

// --- MEMOIZED INPUT COMPONENT ---
const InputGroup = memo(({ label, icon, ...props }: InputGroupProps) => {
  return (
    <div className="group">
      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-400 group-focus-within:text-zinc-950 transition-colors">
          {icon}
        </div>
        <input
          {...props}
          className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-zinc-400 outline-none transition-all placeholder:text-zinc-300 text-xs font-medium text-zinc-900 shadow-sm"
          required={props.required !== false}
        />
      </div>
    </div>
  );
});
InputGroup.displayName = 'InputGroup';

function OnboardingWizardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '', 
    lastName: '',
    storeName: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    idType: 'NIN',
    idNumber: '',
    file: null as File | null,
  });

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData((prev) => ({ ...prev, referralCode: ref.trim().toUpperCase() }));
    }
  }, [searchParams]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'referralCode' ? value.toUpperCase().trim() : value 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        return setError("File footprint too large. Maximum cap size is 5MB.");
      }
      setFormData({ ...formData, file: selectedFile });
      setError(null);
    }
  };

  const validateStep = () => {
    setError(null);
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.storeName || !formData.dob) {
        setError("Please populate all required foundational criteria paths.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError("Please populate all mandatory communication credentials.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Security handshake error: Passwords do not match.");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Security structural requirement: Password must span 6+ characters.");
        return false;
      }
      // Basic client-side check to alert users about country codes
      if (!formData.phone.startsWith('+')) {
        setError("Format Requirement: Phone number must include your international plus prefix code (e.g. +234...)");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmitFinal = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.idNumber) {
      return setError("Fulfillment rejected: Compliance identity components are missing.");
    }

    setLoading(true);
    setError(null);

    try {
      // 🌟 FIX: Convert your generic HTML date string ("YYYY-MM-DD") to a full ISO string representation for your DTO.
      const formattedDob = formData.dob ? new Date(formData.dob).toISOString() : new Date().toISOString();

      // 🌟 FIX: Re-assembled the payload block containing ALL 9 properties required by your validation engine DTO schema parameters.
      const registrationPayload = {
        firstName: formData.firstName,
        middleName: formData.middleName || "None", // Guarantees a string fallback value
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone.trim(), 
        dob: formattedDob,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'VENDOR',
        storeName: formData.storeName,
        referralCode: formData.referralCode || undefined,
      };

      const regResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationPayload),
      });

      const regResult = await regResponse.json();
      if (!regResponse.ok) {
        // Formats structured backend errors safely
        const backendMessage = Array.isArray(regResult.message) ? regResult.message.join(', ') : regResult.message;
        throw new Error(backendMessage || 'Identity initialization failed.');
      }

      // 2. RETRIEVE BEARER ACCESS AND TRANSMIT KYC DISPATCH
      const kycData = new FormData();
      kycData.append('idType', formData.idType);
      kycData.append('idNumber', formData.idNumber);
      kycData.append('file', formData.file);

      await api.post('/vendor/submit-kyc', kycData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(formData.email)}&registered=true`);
      }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An unexpected operational breakdown occurred.');
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center border border-zinc-100 animate-in fade-in zoom-in duration-300">
        <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Onboarding Request Logged</h1>
        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
          Your profile setup and compliance documentation have been cleanly updated. Redirecting you to checkout verification login...
        </p>
        <Loader2 className="animate-spin mx-auto mt-6 text-zinc-300" size={20} />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden animate-in fade-in duration-300">
      
      <div className="bg-zinc-950 p-6 text-white relative">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest block">
              Vendor Activation Portal
            </span>
            <h1 className="text-lg font-bold tracking-tight mt-0.5">
              {step === 1 && "Personal Foundation"}
              {step === 2 && "Contact & Security"}
              {step === 3 && "Compliance Review"}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
            <span className="text-xs font-mono font-bold text-white">0{step}</span>
            <span className="text-[10px] font-bold text-zinc-500">/ 03</span>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border-l-2 border-red-500 text-red-700 text-[11px] font-bold uppercase tracking-tight rounded-r-xl animate-in shake duration-200">
            {error}
          </div>
        )}

        {/* ================= STEP 1: IDENTITY FOUNDATION ================= */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup 
                label="First Name" 
                name="firstName"
                icon={<User size={15}/>} 
                placeholder="Akin" 
                value={formData.firstName}
                onChange={handleChange} 
              />
              <InputGroup 
                label="Middle Name (Optional)" 
                name="middleName"
                icon={<User size={15}/>} 
                placeholder="Samson" 
                value={formData.middleName}
                onChange={handleChange}
                required={false}
              />
            </div>

            <InputGroup 
              label="Last Name" 
              name="lastName"
              icon={<User size={15}/>} 
              placeholder="Samson"
              value={formData.lastName}
              onChange={handleChange} 
            />

            <InputGroup 
              label="Store Name" 
              name="storeName"
              icon={<Store size={15}/>} 
              placeholder="e.g. Premium Artifacts Store"
              value={formData.storeName}
              onChange={handleChange} 
            />

            <InputGroup 
              label="Date of Birth" 
              name="dob"
              type="date"
              icon={<Calendar size={15}/>} 
              value={formData.dob}
              onChange={handleChange} 
            />

            <button
              type="submit"
              className="w-full h-11 bg-zinc-900 text-white rounded-xl text-xs font-bold transition-all hover:bg-zinc-800 flex items-center justify-center gap-2 mt-6 shadow-sm active:scale-[0.98]"
            >
              <span>Continue Installation</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* ================= STEP 2: NETWORKING AND PLATFORM CREDENTIALS ================= */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <InputGroup 
              label="Email Address" 
              name="email"
              type="email"
              icon={<Mail size={15}/>} 
              placeholder="vendor@example.com"
              value={formData.email}
              onChange={handleChange} 
            />

            <InputGroup 
              label="Phone Number" 
              name="phone"
              type="tel"
              icon={<Phone size={15}/>} 
              placeholder="e.g. +2348012345678"
              value={formData.phone}
              onChange={handleChange} 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup 
                label="Password" 
                name="password"
                type="password"
                icon={<Lock size={15}/>} 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange} 
              />
              <InputGroup 
                label="Confirm Password" 
                name="confirmPassword"
                type="password"
                icon={<Lock size={15}/>} 
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange} 
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">
                Referral / Affiliate Code (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-400 group-focus-within:text-zinc-950 transition-colors">
                  <Share2 size={15} />
                </div>
                <input
                  type="text"
                  name="referralCode"
                  placeholder="e.g. AVR123"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-zinc-400 outline-none transition-all placeholder:text-zinc-300 font-mono text-xs text-zinc-900 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrevStep}
                className="h-11 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold transition-all hover:bg-zinc-50 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="h-11 bg-zinc-900 text-white rounded-xl text-xs font-bold transition-all hover:bg-zinc-800 flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
              >
                <span>Proceed</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: COMPLIANCE DOCUMENTATION SYSTEM ================= */}
        {step === 3 && (
          <form onSubmit={handleSubmitFinal} className="space-y-4">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="text-zinc-400 mt-0.5 shrink-0" size={16} />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-zinc-900">Regulatory Verification Node</p>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  In compliance with regulatory framework guidelines, please upload a valid government-issued security reference identity document.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">ID Type</label>
                <select 
                  name="idType"
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none text-xs font-bold text-zinc-700 shadow-sm transition-all focus:border-zinc-400 cursor-pointer"
                  value={formData.idType}
                  onChange={handleChange}
                >
                  <option value="NIN">NIN (Identity Number)</option>
                  <option value="PASSPORT">Passport Portfolio</option>
                  <option value="DRIVERS_LICENSE">Driver's License Identification</option>
                  <option value="VOTERS_CARD">Voter's Registration Card</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Document String Number</label>
                <input 
                  type="text" 
                  name="idNumber"
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-mono text-xs text-zinc-900 shadow-sm transition-all focus:border-zinc-400"
                  required
                  value={formData.idNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={`relative border border-dashed rounded-xl p-6 text-center transition-all duration-300 ${formData.file ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400'}`}>
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                accept="image/*"
                onChange={handleFileChange}
              />
              
              <div className="relative">
                {formData.file ? (
                  <div className="space-y-2 animate-in zoom-in duration-200">
                    <FileCheck className="text-zinc-900 mx-auto" size={28} />
                    <div>
                      <p className="text-xs font-bold text-zinc-800 truncate max-w-[280px] mx-auto">{formData.file.name}</p>
                      <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mt-0.5">Asset Staged Securely</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="text-zinc-300 mx-auto" size={28} />
                    <div>
                      <p className="text-xs font-bold text-zinc-700">Upload Identity Image Asset</p>
                      <p className="text-[9px] text-zinc-400 mt-0.5 uppercase tracking-widest">Clear JPG, PNG, or PDF format (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4">
              <button
                type="button"
                disabled={loading}
                onClick={handlePrevStep}
                className="col-span-1 h-11 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold transition-all hover:bg-zinc-50 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="col-span-2 h-11 bg-zinc-900 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:bg-zinc-800 flex items-center justify-center gap-2 shadow-sm disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span>Submit & Finish</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {step < 3 && (
        <p className="text-center text-xs text-zinc-400 px-6 pb-6 pt-2">
          Already verified?{' '}
          <button 
            type="button"
            onClick={() => router.push('/login')} 
            className="text-zinc-950 font-bold hover:underline"
          >
            Sign In here
          </button>
          .
        </p>
      )}
    </div>
  );
}

export default function RegisterVendor() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border border-zinc-200 flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-zinc-950 mb-4" size={24} />
          <p className="text-zinc-400 text-xs font-medium">Initializing onboarding profile sequence...</p>
        </div>
      }>
        <OnboardingWizardForm />
      </Suspense>
    </div>
  );
}