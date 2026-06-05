"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Store, 
  ExternalLink,
  Package,
  Terminal,
  AlertTriangle,
  CheckCircle,
  X,
  User,
  Building,
  Eye,
  FileImageIcon,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { api } from '@/src/lib/axios';

// 🎯 FIXED: Aligned properties completely with your explicit Prisma Schema
interface Vendor {
  id: string;
  storeName: string;
  storeDescription: string | null;
  kycStatus: "PENDING" | "APPROVED" | "REJECTED" | "NOT_SUBMITTED";
  idType: string | null;   // 👈 Matches schema field directly
  idNumber: string | null; // 👈 Matches schema field directly
  idImage: string | null;  // 👈 Matches schema field directly
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  _count: { products: number };
}

interface KYCModalProps {
  vendor: Vendor;
  onClose: () => void;
  onUpdate: () => void;
}

function KYCDetailModal({ vendor, onClose, onUpdate }: KYCModalProps) {
  const [processing, setProcessing] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
    let reason = "";

    if (status === 'REJECTED') {
      reason = window.prompt("ENTER REJECTION PROTOCOL REASON:\n(This will be communicated to the merchant regarding their fake or mismatched document)") || "";
      if (!reason) return toast.error("REJECTION ABORTED: Reason is required.");
    }

    setProcessing(true);
    try {
      await api.patch(`/admin/vendors/${vendor.id}/kyc-decision`, { 
        status, 
        reason 
      });

      toast.success(`PROTOCOL UPDATED: Identity ${status.toLowerCase()} successfully.`);
      onUpdate();
      onClose();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Verification signal lost.";
      toast.error(`OVERRIDE FAILED: ${msg}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#050505] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/30 font-sans">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">Identity Verification</h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Node ID: {vendor.id}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* 1. Account Holder Name vs Entity Data Block */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-zinc-900/20 border border-zinc-800/50">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2 font-mono">
                <User size={12} className="text-zinc-700" /> Declared_Merchant_Name
              </span>
              <p className="text-sm font-bold text-zinc-200 uppercase tracking-tight">
                {vendor.user.firstName} {vendor.user.lastName}
              </p>
              <p className="text-[10px] font-mono text-zinc-500">{vendor.user.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2 font-mono">
                <Building size={12} className="text-zinc-700" /> Entity_Descriptor
              </span>
              <p className="text-sm font-bold text-zinc-200 uppercase tracking-tight">{vendor.storeName}</p>
            </div>
          </div>

          {/* 2. Document Claims Input Fields Data (New Layout Verification Window) */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-zinc-900/10 border border-zinc-900">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2 font-mono">
                <FileText size={12} className="text-zinc-700" /> Document Type Claimed
              </span>
              <p className="text-xs font-mono font-bold text-amber-500/90 uppercase tracking-wider">
                {vendor.idType || "NOT PROVIDED"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2 font-mono">
                <Terminal size={12} className="text-zinc-700" /> Stated Document String / ID No
              </span>
              <p className="text-xs font-mono font-bold text-zinc-300 select-all tracking-normal">
                {vendor.idNumber || "NOT PROVIDED"}
              </p>
            </div>
          </div>

          {/* 3. Real Visual Identification Proof Document Box */}
          <div className="space-y-3">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono block">
              Government_Issue_Identity_Asset_Source
            </span>
            
            {vendor.idImage ? (
              <div className="group relative aspect-video bg-zinc-950 rounded-xl border border-zinc-800/80 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-amber-500/40 shadow-inner">
                
                {/* Embedded Real Rendered Image Layer */}
                <img 
                  src={vendor.idImage} 
                  alt="Government Verification ID Document" 
                  className="w-full h-full object-contain transition duration-500 group-hover:scale-[1.01]"
                />

                {/* Hover Mask Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 backdrop-blur-sm">
                  <button 
                    onClick={() => setShowFullImage(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-zinc-700 text-[10px] font-black tracking-widest uppercase text-zinc-200 rounded-lg hover:border-amber-500 hover:text-amber-500 transition-all transform translate-y-2 group-hover:translate-y-0"
                  >
                     <Eye size={14} /> ENLARGE IDENTITY IMAGE
                  </button>
                </div>
              </div>
            ) : (
              /* Fallback framework if document link field is string-null */
              <div className="aspect-video bg-zinc-950 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center p-6">
                <FileImageIcon size={32} className="text-zinc-700 mb-2" />
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">No Image Document Asset Found in Database Node</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Protocols */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 flex gap-4">
          <button 
            disabled={processing}
            onClick={() => handleAction('REJECTED')}
            className="flex-1 py-4 flex items-center justify-center gap-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all disabled:opacity-20"
          >
            <AlertTriangle size={14} /> Reject Access
          </button>
          <button 
            disabled={processing}
            onClick={() => handleAction('APPROVED')}
            className="flex-1 py-4 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all disabled:opacity-20"
          >
            <CheckCircle size={14} /> Authorize Node
          </button>
        </div>
      </div>

      {/* 🎯 FULLSCREEN DEEP RECON LIGHTBOX */}
      {showFullImage && vendor.idImage && (
        <div className="fixed inset-0 z-[200] bg-black/98 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <button 
            onClick={() => setShowFullImage(false)}
            className="absolute top-6 right-6 p-3 bg-zinc-900/80 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <img 
            src={vendor.idImage} 
            alt="Expanded Verification Asset" 
            className="max-w-full max-h-[85vh] object-contain rounded-lg border border-zinc-900 shadow-2xl"
          />
          <p className="mt-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Press X or click overlay button to exit review view
          </p>
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE ---
export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const fetchVendors = async () => {
    try {
      const { data } = await api.get("/admin/vendors");
      setVendors(data);
    } catch (error) {
      toast.error("PROTOCOL ERROR: Failed to sync commercial nodes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  const filteredVendors = vendors.filter(v => 
    v.storeName.toLowerCase().includes(search.toLowerCase()) || 
    v.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-[#020202] min-h-screen text-zinc-100 selection:bg-amber-500/30">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/50 pb-8 font-sans">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-500">
            <Terminal size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Registry // Commercial Entities</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic italic-shaping">
            Vendor <span className="text-zinc-600">Registry</span>
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            Protocol: Merchant Authorization & KYC Oversight
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-amber-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative flex items-center bg-black border border-zinc-800 rounded-lg px-4 py-3">
            <Search className="w-4 h-4 text-zinc-600 mr-3" />
            <input 
              type="text"
              placeholder="FILTER BY STORE OR EMAIL..."
              className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest uppercase w-full md:w-64 placeholder:text-zinc-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* VENDOR DATA TABLE */}
      <div className="rounded-2xl border border-zinc-800 bg-[#050505] overflow-hidden shadow-2xl font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-zinc-800">
                <th className="p-6">Store Identity</th>
                <th className="p-6">Principal Merchant</th>
                <th className="p-6">Inventory</th>
                <th className="p-6">KYC Status</th>
                <th className="p-6 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={5} className="p-10 bg-zinc-900/10"></td></tr>
                ))
              ) : filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="group hover:bg-zinc-800/20 transition-all duration-200">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-500 group-hover:border-amber-500/50 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                        <Store size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-200 uppercase tracking-tight">{vendor.storeName}</p>
                        <p className="text-[9px] text-zinc-600 font-mono italic tracking-wider">ID: {vendor.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-300">
                        {vendor.user.firstName ?? 'N/A'} {vendor.user.lastName ?? ''}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono tracking-tighter">{vendor.user.email}</span>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-zinc-700" />
                      <span className="text-sm font-black text-zinc-300 tabular-nums tracking-widest">{vendor._count?.products ?? 0}</span>
                    </div>
                  </td>

                  <td className="p-6">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${
                      vendor.kycStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      vendor.kycStatus === "PENDING" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]" :
                      "bg-zinc-900 text-zinc-500 border-zinc-800"
                    }`}>
                      {vendor.kycStatus}
                    </span>
                  </td>

                  <td className="p-6 text-right">
                    <button 
                      onClick={() => setSelectedVendor(vendor)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all rounded-lg"
                    >
                      <ExternalLink size={14} /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC MODAL */}
      {selectedVendor && (
        <KYCDetailModal 
          vendor={selectedVendor} 
          onClose={() => setSelectedVendor(null)} 
          onUpdate={fetchVendors}
        />
      )}
    </div>
  );
}