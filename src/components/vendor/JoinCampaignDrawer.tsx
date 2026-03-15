'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  X, Check, Loader2, Box, Search, 
  AlertCircle, Zap, CheckSquare, Square, ShieldCheck
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

// --- TYPE REGISTRY ---
interface Product {
  id: string;
  name?: string;
  title?: string;
  price: number;
  campaigns?: { campaignId: string }[]; // Backend relation check
}

interface Props {
  campaign: { id: string; code: string; discount: number };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JoinCampaignDrawer({ campaign, isOpen, onClose, onSuccess }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. INVENTORY_SYNC_PROTOCOL (Includes enrollment check)
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/vendor/products'); 
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        toast.error("INVENTORY_SYNC_FAILED");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  // 2. SEARCH_INTELLIGENCE: Normalized for aliased naming
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return products.filter(p => {
      const name = (p.name || p.title || '').toLowerCase();
      return name.includes(term);
    });
  }, [products, searchTerm]);

  // 3. ENROLLMENT_LOGIC: Filter out items already in this campaign
  const availableToJoin = useMemo(() => 
    filteredProducts.filter(p => !p.campaigns?.some(c => c.campaignId === campaign.id)),
  [filteredProducts, campaign.id]);

  // 4. BATCH_SELECTION_LOGIC
  const toggleAll = useCallback(() => {
    if (selectedIds.length === availableToJoin.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(availableToJoin.map(p => p.id));
    }
  }, [availableToJoin, selectedIds]);

  const toggleProduct = useCallback((id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  // 5. INJECTION_HANDSHAKE
  const handleJoin = async () => {
    if (selectedIds.length === 0) return toast.error("NO_ARTIFACTS_SELECTED");

    try {
      setSubmitting(true);
      await api.post(`/vendor/marketing/campaigns/${campaign.id}/join`, {
        productIds: selectedIds
      });
      toast.success("INJECTION_SUCCESSFUL", {
        description: `${selectedIds.length} artifacts successfully synchronized.`
      });
      onSuccess();
    } catch (error) {
      toast.error("PROTOCOL_REJECTED");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right border-l border-gray-100">
        
        {/* HEADER & IMPACT PREVIEW */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/30">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                Artifact Injection
              </h2>
              <p className="text-[10px] font-bold text-[#A4143D] uppercase tracking-widest flex items-center gap-2">
                <Zap size={10} fill="currentColor" />
                Registry: {campaign.code} • {campaign.discount}% OFF
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {selectedIds.length > 0 && (
            <div className="bg-indigo-600 rounded-2xl p-4 text-white animate-in zoom-in-95">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Injection_Impact</span>
                <TrendingUp size={14} />
              </div>
              <p className="text-sm font-medium italic mt-1">
                Injecting {selectedIds.length} artifacts into the Global Registry.
              </p>
            </div>
          )}
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-6 space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#A4143D]" size={16} />
            <input 
              type="text" 
              placeholder="Search registry..."
              className="w-full h-14 pl-12 pr-6 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#A4143D]/5 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between px-2">
            <button 
              onClick={toggleAll}
              disabled={availableToJoin.length === 0}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30"
            >
              {selectedIds.length > 0 && selectedIds.length === availableToJoin.length ? <CheckSquare size={14} /> : <Square size={14} />}
              Select_Available ({availableToJoin.length})
            </button>
            <span className="text-[8px] font-black text-gray-300 uppercase italic">Aviore_Protocol_v4</span>
          </div>
        </div>

        {/* LIST REGISTRY */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-300 gap-4">
              <Loader2 className="animate-spin text-[#A4143D]" size={32} />
              <span className="text-[10px] font-black uppercase tracking-widest">Accessing_Inventory...</span>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isEnrolled = product.campaigns?.some(c => c.campaignId === campaign.id);
              return (
                <ArtifactItem 
                  key={product.id}
                  product={product}
                  isSelected={selectedIds.includes(product.id)}
                  onToggle={toggleProduct}
                  isEnrolled={isEnrolled}
                  discountPercent={campaign.discount}
                />
              );
            })
          ) : (
            <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-4xl border-2 border-dashed border-gray-100">
              <AlertCircle size={32} className="mx-auto text-gray-200" />
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Registry_Empty</p>
            </div>
          )}
        </div>

        {/* ACTION COMMAND */}
        <div className="p-8 border-t border-gray-100 bg-white">
          <button
            onClick={handleJoin}
            disabled={submitting || selectedIds.length === 0}
            className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-[#A4143D] disabled:opacity-30 disabled:grayscale transition-all active:scale-95 group shadow-xl"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Zap size={16} fill="currentColor" />}
            Confirm Injection ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT ---
function ArtifactItem({ 
  product, 
  isSelected, 
  onToggle, 
  isEnrolled,
  discountPercent 
}: { 
  product: Product, 
  isSelected: boolean, 
  onToggle: (id: string) => void,
  isEnrolled?: boolean,
  discountPercent: number
}) {
  const name = product.name || product.title || 'Unnamed Artifact';
  const salePrice = product.price * (1 - (discountPercent / 100));

  return (
    <div 
      onClick={() => !isEnrolled && onToggle(product.id)}
      className={`p-5 rounded-3xl border-2 transition-all flex items-center justify-between group ${
        isEnrolled 
          ? 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60' 
          : isSelected 
            ? 'border-[#A4143D] bg-[#FBE9E3]/30 cursor-pointer' 
            : 'border-gray-50 hover:border-gray-200 bg-white cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
          isEnrolled ? 'bg-gray-200 text-gray-400' : isSelected ? 'bg-[#A4143D] text-white' : 'bg-gray-100 text-gray-400'
        }`}>
          <Box size={20} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black text-gray-900 uppercase italic leading-none">{name}</h4>
            {isEnrolled && <span className="bg-green-100 text-green-700 text-[7px] font-black uppercase px-2 py-0.5 rounded-full">Enrolled</span>}
          </div>
          <div className="flex items-center gap-2">
             <p className={`text-[10px] font-bold tracking-widest ${isEnrolled || isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                ₦{isEnrolled || isSelected ? salePrice.toLocaleString() : product.price.toLocaleString()}
             </p>
             {(isEnrolled || isSelected) && (
               <p className="text-[8px] text-gray-400 line-through">₦{product.price.toLocaleString()}</p>
             )}
          </div>
        </div>
      </div>
      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
        isEnrolled ? 'bg-gray-100 border-gray-200' : isSelected ? 'bg-[#A4143D] border-[#A4143D]' : 'border-gray-200 group-hover:border-gray-300'
      }`}>
        {isEnrolled ? <ShieldCheck size={12} className="text-gray-400" /> : isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
      </div>
    </div>
  );
}

import { TrendingUp } from 'lucide-react';