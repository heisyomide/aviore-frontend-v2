// app/growth/tools/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  QrCode, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Share2, 
  Sparkles, 
  Layers,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface PitchTemplate {
  id: number;
  label: string;
  text: string;
}

interface MediaAsset {
  title: string;
  description: string;
  type: 'IMAGE' | 'DOCUMENT' | 'TEMPLATE';
  sizeOrFormat: string;
  downloadUrl?: string;
}

interface AssetCardProps {
  asset: MediaAsset;
}

export default function GrowthMarketingToolsPage() {
  // Live Active Operational Parameters Sync States
  const [trackingCode, setTrackingCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [pitchTemplates, setPitchTemplates] = useState<PitchTemplate[]>([]);
  const [mediaKitAssets, setMediaKitAssets] = useState<MediaAsset[]>([]);

  // UX Infrastructure Pipeline Trackers
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy Feedback Interaction Micro-states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedText, setCopiedText] = useState<number | null>(null);

  // Fallback/Staging Configuration Ports
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch live tracking metrics and localized pitch matrices from the cluster
  useEffect(() => {
    const synchronizeMarketingResources = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const sessionToken = localStorage.getItem('aviore_auth_token');
        if (!sessionToken) {
          throw new Error('Active security authorization credentials not found.');
        }

        const response = await fetch(`${backendBaseUrl}/v1/growth/tools`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || `Resource node responded with status: ${response.status}`);
        }

        // Hydrate UI state grids with live payload signatures
        setTrackingCode(payload.trackingCode);
        setReferralLink(payload.referralLink);
        setPitchTemplates(payload.pitchTemplates || []);
        
        // Blend backend generated documents with local static layout presets safely
        const incomingAssets = payload.mediaKitAssets || [];
        const figmaTemplateExists = incomingAssets.some((a: MediaAsset) => a.type === 'TEMPLATE');
        
        if (!figmaTemplateExists) {
          incomingAssets.push({
            title: 'Social Showcase Layout Mockups',
            description: 'Formatted templates for Instagram grids and WhatsApp stories highlighting vendor entry benefits.',
            type: 'TEMPLATE',
            sizeOrFormat: 'Figma File / ZIP • 12.4 MB',
            downloadUrl: '#',
          });
        }
        setMediaKitAssets(incomingAssets);

      } catch (err: any) {
        console.error('[Resource Center Failure]:', err.message);
        setErrorMessage(err.message || 'Ecosystem degradation intercepted marketing kit assets.');
      } finally {
        setIsLoading(false);
      }
    };

    synchronizeMarketingResources();
  }, [backendBaseUrl]);

  const handleCopy = (text: string, type: 'LINK' | 'CODE' | number) => {
    navigator.clipboard.writeText(text);
    if (type === 'LINK') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'CODE') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-400 font-mono text-xs space-y-3">
        <Loader2 className="h-6 w-6 animate-spin text-[#A4143D]" />
        <span>Compiling trackable distribution assets, pitch matrices and visual configurations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* HEADER ACTIONS BAR */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Marketing Resource Center
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Access brand assets, copy frameworks, and trackable links to accelerate vendor activation pipelines.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-center">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Assets Updated Live</span>
        </div>
      </div>

      {/* ERROR FEEDBACK BAR */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-mono text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* CORE LINK GENERATION GENERATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-zinc-800 flex items-center space-x-2">
              <Layers className="h-4 w-4 text-[#A4143D]" />
              <span>Your Unique Acquisition Node Links</span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-light mt-1">
              Distribute your personal routing coordinates. Vendors registering under these nodes automatically lock into your team commission pool.
            </p>
          </div>

          <div className="my-6 space-y-4">
            {/* LINK TRACK STACK */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Personalized Sign-Up URL</label>
              <div className="flex items-center space-x-2">
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2 text-xs font-mono text-zinc-600 overflow-x-auto whitespace-nowrap scrollbar-none flex-1">
                  {referralLink}
                </div>
                <button 
                  onClick={() => handleCopy(referralLink, 'LINK')}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white p-2.5 rounded-xl transition-all shadow-sm shrink-0"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* BLOCK CODE STACK */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">Ecosystem Tracking Code</label>
              <div className="flex items-center space-x-2">
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-wider text-zinc-900 flex-1">
                  {trackingCode}
                </div>
                <button 
                  onClick={() => handleCopy(trackingCode, 'CODE')}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 p-2.5 rounded-xl transition-all border border-zinc-200/60 shrink-0"
                >
                  {copiedCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-xl flex items-center space-x-2 text-[10px] text-zinc-400 font-light">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Core Validation Rule: Referred vendors must upload 5+ live items to pass configuration algorithms and unlock payouts.</span>
          </div>
        </div>

        {/* QR CODES VISUAL WRAPPER */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between text-center">
          <div className="w-full text-left">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400">Physical Materials QR Code</h4>
          </div>
          
          <div className="my-4 p-4 border border-zinc-100 rounded-2xl bg-zinc-50/50 shadow-inner">
            <QrCode className="h-32 w-32 text-zinc-800 stroke-[1.25]" />
          </div>

          <div className="space-y-2 w-full">
            <a 
              href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-linear-to-b from-zinc-50 to-zinc-100 hover:from-zinc-100 hover:to-zinc-200 text-zinc-700 font-semibold py-2 rounded-xl text-xs border border-zinc-200 shadow-xs flex items-center justify-center space-x-1.5 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download High-Res Print QR</span>
            </a>
            <p className="text-[10px] text-zinc-400 font-light">
              Ideal for pitch presentations, physical flyers, and luxury merchant conference collateral.
            </p>
          </div>
        </div>

      </div>

      {/* RECRUITMENT COPY FRAMEWORKS */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-800">
            Acquisition Pitch Framework Copy Templates
          </h3>
          <p className="text-[11px] text-zinc-400 font-light mt-0.5">
            Pre-vetted copy blocks optimized for direct message onboarding workflows across LinkedIn, WhatsApp, and Email.
          </p>
        </div>

        <div className="p-6 divide-y divide-zinc-100 space-y-6">
          {pitchTemplates.map((tmpl, idx) => (
            <div key={tmpl.id} className={`${idx > 0 ? 'pt-6' : ''} space-y-2.5`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-800 flex items-center space-x-2">
                  <span className="h-5 w-5 rounded-md bg-linear-to-br from-zinc-50 to-zinc-100 border border-zinc-200 flex items-center justify-center font-mono text-[10px] text-zinc-500 font-bold">
                    {tmpl.id}
                  </span>
                  <span>{tmpl.label}</span>
                </span>
                <button
                  onClick={() => handleCopy(tmpl.text, tmpl.id)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all border
                    ${copiedText === tmpl.id 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200/80 shadow-xs'
                    }`}
                >
                  {copiedText === tmpl.id ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied Pitch Template</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Template Text</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl text-xs font-light text-zinc-500 leading-relaxed font-sans select-all">
                {tmpl.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DESIGN HIGH-RES BRANDING ASSETS ASSET GRID */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-800">
            Official Brand Media Kits & Visual Assortments
          </h3>
          <p className="text-[11px] text-zinc-400 font-light mt-0.5">
            Download current layout systems, vector logomarks, and premium merchant info-packs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaKitAssets.map((asset, index) => (
            <AssetCard key={index} asset={asset} />
          ))}
        </div>
      </div>

    </div>
  );
}

/* HELPER ASSET DISPLAY SUITE CARD COMPONENT */
function AssetCard({ asset }: AssetCardProps) {
  const { title, description, type, sizeOrFormat, downloadUrl } = asset;

  const triggerDownloadAction = () => {
    if (!downloadUrl || downloadUrl === '#') {
      alert('Visual prototype asset template mapped exclusively within private Figma design systems.');
      return;
    }
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/20 hover:bg-white hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase border
            ${type === 'IMAGE' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
              type === 'DOCUMENT' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
              'bg-purple-50 text-purple-700 border-purple-100'}`}
          >
            {type === 'IMAGE' ? <ImageIcon className="h-2.5 w-2.5 mr-1" /> : type === 'DOCUMENT' ? <FileText className="h-2.5 w-2.5 mr-1" /> : <Share2 className="h-2.5 w-2.5 mr-1" />}
            {type}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">{sizeOrFormat}</span>
        </div>
        <h4 className="text-xs font-semibold text-zinc-900 mt-3 group-hover:text-[#A4143D] transition-colors">{title}</h4>
        <p className="text-[11px] text-zinc-400 font-light mt-1 leading-normal">{description}</p>
      </div>

      <button 
        onClick={triggerDownloadAction}
        className="mt-4 w-full bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 font-medium py-1.5 rounded-lg text-xs flex items-center justify-center space-x-1 shadow-2xs group-hover:border-zinc-300 transition-all"
      >
        <Download className="h-3 w-3" />
        <span>Download Asset</span>
      </button>
    </div>
  );
}