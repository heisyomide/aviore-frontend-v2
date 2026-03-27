'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Upload, CheckCircle, Loader2, AlertCircle, FileCheck } from 'lucide-react';
import { api } from '../../lib/axios'; // Assuming you have an axios instance
import { Navbar } from '@/src/components/navbar/Navbar';

function KYCContent() {
  const router = useRouter();
  
  // State for user identity
  const [vendorEmail, setVendorEmail] = useState<string>('Loading...');
  const [token, setToken] = useState<string | null>(null);

  // Form & UI state
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    idType: 'NIN',
    idNumber: '',
    file: null as File | null,
  });

  /**
   * 1. THE SECURITY HANDSHAKE
   * Fetch the user's email using the token instead of the URL
   */
  useEffect(() => {
    const fetchVendorData = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (!savedToken) {
        router.push('/login?error=Please login to access verification');
        return;
      }

      setToken(savedToken);

      try {
        // Fetch the profile of the currently logged-in user
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        setVendorEmail(response.data.email);
      } catch (err) {
        // If token is invalid or expired
        localStorage.removeItem('token');
        router.push('/login?error=Session expired. Please login again.');
      }
    };

    fetchVendorData();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        return setError("File is too large. Maximum size is 5MB.");
      }
      setFormData({ ...formData, file: selectedFile });
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return setError("Please upload an ID image");
    
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('idType', formData.idType);
      data.append('idNumber', formData.idNumber);
      data.append('file', formData.file);

      // Identify the user via the Bearer Token in the header
      const response = await api.post('/vendor/submit-kyc', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitted(true);
      setTimeout(() => router.push('/vendor'), 4000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
         <Navbar />
        <div className="max-w-md">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Under Review</h1>
          <p className="text-slate-500 leading-relaxed mb-8">
            Identity documents received. Our compliance team is verifying your profile. 
            You'll get full access once your shop is <b>Active</b>.
          </p>
          <div className="flex items-center justify-center gap-2 text-orange-600 font-bold">
            <Loader2 className="animate-spin" size={18} />
            <span>Moving to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-[#0a0c10] p-10 text-white relative">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Verification Portal</span>
              <h1 className="text-3xl font-bold mt-1">Submit KYC</h1>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                Verified Account: <span className="text-orange-400">{vendorEmail}</span>
              </p>
            </div>
            <ShieldCheck className="text-orange-500 opacity-80" size={50} />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-3xl rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-bold uppercase tracking-tight rounded-r-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Type</label>
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all cursor-pointer font-bold text-slate-700"
                onChange={(e) => setFormData({...formData, idType: e.target.value})}
              >
                <option value="NIN">NIN (Identity Number)</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVERS_LICENSE">Driver's License</option>
                <option value="VOTERS_CARD">Voter's Card</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Number</label>
              <input 
                type="text" 
                placeholder="XXXX-XXXX-XXXX"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-mono"
                required
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              />
            </div>
          </div>

          {/* UPLOAD BOX */}
          <div className={`relative border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-300 ${formData.file ? 'border-green-500 bg-green-50/30' : 'border-slate-200 hover:border-orange-500'}`}>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <div className="relative">
              {formData.file ? (
                <div className="space-y-3 animate-in zoom-in duration-300">
                  <FileCheck className="text-green-600 mx-auto" size={40} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{formData.file.name}</p>
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1">Ready for Secure Upload</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="text-slate-300 mx-auto" size={40} />
                  <div>
                    <p className="text-sm font-bold text-slate-700">Click to upload Government ID</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Clear JPG or PNG (Max 5MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#0a0c10] text-white font-black rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 text-lg shadow-xl active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              'SUBMIT DOCUMENTS'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function KYCVerification() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" /></div>}>
      <KYCContent />
    </Suspense>
  );
}