'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users2, 
  ArrowUpRight, 
  UserPlus,
  ShieldAlert,
  Sliders,
  X,
  Plus,
  KeyRound,
  Check,
  Copy
} from 'lucide-react';

interface TeamMemberData {
  id: string;
  name: string;
  role: 'HEAD' | 'SUB_MARKETER';
  code: string;
  vendorsReferred: number;
  activeVendors: number;
  totalSalesCount: number;
  totalVolumeGenerated: number;
  teamCommissionShare: number;
  joinedDate: string;
}

interface GeneratedCredentials {
  name: string;
  code: string;
  passcode: string;
}

export default function GrowthTeamPerformancePage() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal & Operational states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newSubName, setNewSubName] = useState<string>('');
  const [modalSubmitting, setModalSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  
  const [operatorRole, setOperatorRole] = useState<string>('SUB_MARKETER');
  
  const [createdNodeCreds, setCreatedNodeCreds] = useState<GeneratedCredentials | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchClusterMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const sessionToken = localStorage.getItem('aviore_auth_token');
      
      const profileStr = localStorage.getItem('aviore_operator_profile');
      if (profileStr) {
        try {
          const profile = JSON.parse(profileStr);
          const resolvedRole = profile.role || profile.Role || 'SUB_MARKETER';
          setOperatorRole(resolvedRole.toUpperCase());
        } catch (e) {
          console.error("Failed parsing operator profile string:", e);
        }
      }

      const response = await fetch(`${backendBaseUrl}/v1/growth/analytics/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Gateway synchronized rejection state: ${response.status}`);
      }

      const payload = await response.json();
      
      if (payload.data?.currentOperator?.role) {
        setOperatorRole(payload.data.currentOperator.role.toUpperCase());
      } else if (payload.data?.role) {
        setOperatorRole(payload.data.role.toUpperCase());
      }

      if (payload.success && payload.data?.teamMembersBreakdown) {
        setTeamMembers(payload.data.teamMembersBreakdown);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sync with internal metrics infrastructure');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClusterMetrics();
  }, []);

  const handleProvisionSubNode = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSubmitting(true);
    setCreatedNodeCreds(null);

    if (!newSubName.trim()) {
      setModalError('Please specify a valid operational node identifier name.');
      setModalSubmitting(false);
      return;
    }

    try {
      const sessionToken = localStorage.getItem('aviore_auth_token');

      const response = await fetch(`${backendBaseUrl}/v1/growth/auth/team/sub-marketer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ name: newSubName.trim() }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Team deployment failed signature metrics checking. Only Head Of Team Can Add Sub-marketer.');
      }

      if (payload.data) {
        const receivedPasscode = payload.data.passcode || payload.data.password || payload.data.pin;
        
        if (receivedPasscode) {
          setCreatedNodeCreds({
            name: newSubName.trim(),
            code: payload.data.code || 'GENERATING...',
            passcode: receivedPasscode
          });
        } else {
          handleCloseModal();
        }
      } else {
        handleCloseModal();
      }

      await fetchClusterMetrics();
    } catch (err: any) {
      setModalError(err.message || 'Network degradation context aborted provisioning sequence.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (!createdNodeCreds) return;
    const secureString = `AVIORÈ OPERATOR AUTHENTICATION DATA\nOperator Name: ${createdNodeCreds.name}\nTracking Code: ${createdNodeCreds.code}\nLogin Passcode: ${createdNodeCreds.passcode}`;
    navigator.clipboard.writeText(secureString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewSubName('');
    setModalError(null);
    setCreatedNodeCreds(null);
  };

  const totalTeamVolume = useMemo(() => teamMembers.reduce((sum, m) => sum + m.totalVolumeGenerated, 0), [teamMembers]);
  const totalTeamEarnings = useMemo(() => teamMembers.reduce((sum, m) => sum + m.teamCommissionShare, 0), [teamMembers]);
  const totalVendors = useMemo(() => teamMembers.reduce((sum, m) => sum + m.vendorsReferred, 0), [teamMembers]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-xs text-zinc-400">
        Syncing cluster data metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono">
        Error Code Verification Failed: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* PAGE INTRO BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Team Performance & Analytics
          </h2>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Evaluate cohort conversion velocity, individual sub-marketer contributions, and network volume split distributions.
          </p>
        </div>
        
        {/* BUTTON PLACED DIRECTLY IN THE BANNER FRAME - UNLOCKED FOR TRIGGERING MODAL */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-[#A4143D] hover:bg-[#801030] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-center"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Add Sub Marketer</span>
        </button>
      </div>

      {/* STRATEGIC MACRO PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider font-mono">Gross Volume Routed</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-mono font-bold text-zinc-900">
              ₦{totalTeamVolume.toLocaleString()}.00
            </h3>
            <p className="text-[11px] text-emerald-600 flex items-center space-x-1 font-medium mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+18.4% vs last calendar window</span>
            </p>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[74%]" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider font-mono">Combined Shared Cut</span>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-mono font-bold text-zinc-900">
              ₦{totalTeamEarnings.toLocaleString()}.00
            </h3>
            <p className="text-[11px] text-zinc-400 font-light mt-1">
              Derived from 20% of your 10% marketplace commission
            </p>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full w-[58%]" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider font-mono">Core Cohort Reach</span>
            <Users2 className="h-4 w-4 text-pink-500" />
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-bold text-zinc-900">
              {totalVendors} Active Vendors
            </h3>
            <p className="text-[11px] text-zinc-400 font-light mt-1">
              Distributed across {teamMembers.length} functional structural operators
            </p>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-pink-600 h-full w-[82%]" />
          </div>
        </div>
      </div>

      {/* CORE TEAM ROSTER MATRIX GRID */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-zinc-800">
            Team Member Breakdown Matrix
          </h3>
          <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-light">
            <Sliders className="h-3.5 w-3.5" />
            <span>Sorted by performance output</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-mono uppercase text-[10px] tracking-wider">
                <th className="p-4 pl-6">Operator Node Details</th>
                <th className="p-4">Authorization Role</th>
                <th className="p-4 text-center">Tracking Tag</th>
                <th className="p-4 text-center">Vendors Connected</th>
                <th className="p-4 text-center">Active Ratio</th>
                <th className="p-4">Volume Driven (NGN)</th>
                <th className="p-4 pr-6 text-right">Commission Split</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-600 font-light">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/40 transition-colors group">
                  <td className="p-4 pl-6 font-medium text-zinc-900">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono font-bold text-xs text-zinc-600 uppercase group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {member.name ? member.name.split(' ').map(n => n[0]).join('') : '??'}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-900">{member.name}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Joined {member.joinedDate}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-semibold tracking-wider uppercase border
                      ${member.role === 'HEAD' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {member.role === 'HEAD' ? 'TEAM HEAD' : 'SUB MARKETER'}
                    </span>
                  </td>

                  <td className="p-4 text-center font-mono text-xs text-zinc-900 font-semibold bg-zinc-50/30">
                    {member.code}
                  </td>

                  <td className="p-4 text-center font-mono font-medium text-zinc-800">
                    {member.vendorsReferred}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="font-mono font-semibold text-zinc-800">
                        {member.activeVendors} / {member.vendorsReferred}
                      </span>
                      <div className="w-16 bg-zinc-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full" 
                          style={{ width: `${(member.activeVendors / (member.vendorsReferred || 1)) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono text-zinc-800 font-medium">
                    ₦{member.totalVolumeGenerated.toLocaleString()}
                  </td>

                  <td className="p-4 pr-6 text-right font-mono text-xs font-bold text-emerald-600">
                    +₦{member.teamCommissionShare.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden bg-zinc-50/50 p-4 border-t border-zinc-100 flex items-center space-x-2.5 text-[11px] text-zinc-400 font-light">
          <ShieldAlert className="h-4 w-4 text-[#A4143D] shrink-0" />
          <span>
            <strong>Access Control Guard Statement:</strong> Sub-marketers can check metrics, view rewards pipelines, and evaluate their individual portfolios. Global configuration parameters, performance targets, and cash payout trigger buttons are restricted strictly to the designated team **HEAD**.
          </span>
        </div>
      </div>

      {/* NODE PROVISIONING MODAL INTERFACE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
            
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>

            {!createdNodeCreds ? (
              <>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                    Provision New Sub-Marketer Node
                  </h3>
                  <p className="text-xs text-zinc-400 font-light">
                    Expand your core performance cluster network portfolio. This operator inherits your cluster group tracking tag.
                  </p>
                </div>

                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-mono flex items-center space-x-2">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <form onSubmit={handleProvisionSubNode} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                      Full Operator Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      placeholder="e.g. Ifeoluwa Olayinka"
                      className="w-full bg-zinc-50 font-sans text-xs px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#A4143D] focus:bg-white transition-all text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-500 font-medium text-xs transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={modalSubmitting}
                      className="inline-flex items-center space-x-1.5 bg-[#A4143D] hover:bg-[#801030] disabled:bg-zinc-200 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{modalSubmitting ? 'Deploying...' : 'Deploy Node'}</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-4 pt-2 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center space-x-2.5 text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                  <KeyRound className="h-5 w-5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold">Team Activation Successful</h4>
                    <p className="text-[10px] text-emerald-600/80">Operational configuration records written to disk securely.</p>
                  </div>
                </div>

                <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4 space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-semibold">Operator</span>
                    <span className="text-zinc-900 font-sans font-semibold text-sm">{createdNodeCreds.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-zinc-200/60 pt-3">
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-semibold">Tracking Code</span>
                      <span className="text-zinc-900 font-bold tracking-wider">{createdNodeCreds.code}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-semibold">6-Digit Passcode</span>
                      <span className="text-zinc-900 font-bold tracking-widest text-emerald-600">{createdNodeCreds.passcode}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 font-light bg-zinc-50/50 p-2.5 border border-dashed border-zinc-200 rounded-xl">
                  <strong>Security Directive:</strong> Copy these details now. The generated 6-digit pin is encrypted and cannot be displayed again.
                </p>

                <div className="flex items-center space-x-2 w-full pt-1">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2.5 rounded-xl transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied Blueprint!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Node Blueprint</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}