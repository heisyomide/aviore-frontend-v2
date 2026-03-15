"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, ShieldCheck, Lock, Globe, 
  UserX, Search, AlertTriangle, Eye, 
  Terminal, Activity, Loader2, RefreshCcw
} from "lucide-react";
import { api } from "@/src/lib/axios";
import { toast } from "sonner";

export default function SecurityCenterPage() {
  const [loading, setLoading] = useState(true);
  const [intel, setIntel] = useState<any>(null);
  const [fraud, setFraud] = useState<any>(null);

  const fetchIntelligence = async () => {
    try {
      const [intelRes, fraudRes] = await Promise.all([
        api.get("/admin/security/intelligence"),
        api.get("/admin/security/fraud-radar")
      ]);
      setIntel(intelRes.data);
      setFraud(fraudRes.data);
    } catch (error) {
      toast.error("SECURITY_SYNC_FAILURE: Failed to fetch threat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  const handleBlockIP = async (ip: string) => {
    try {
      await api.post("/admin/security/block-ip", { ip, reason: "Manual_Admin_Intervention" });
      toast.success(`IP_BLACKHAWK_DEPLOYED: ${ip} restricted.`);
      fetchIntelligence(); // Refresh logs
    } catch {
      toast.error("FIREWALL_OVERRIDE_FAILED");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Syncing_Defense_Grid</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-400 font-sans p-6 lg:p-12 selection:bg-red-500/30">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* HEADER: GLOBAL DEFENSE STATUS */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-900 pb-10 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-500">
              <ShieldAlert size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Defense_Registry_v4.2</span>
            </div>
            <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
              Security <span className="text-zinc-800">Center</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={fetchIntelligence} className="p-4 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white transition-colors">
              <RefreshCcw size={16} />
            </button>
            <div className={`px-8 py-4 rounded-2xl border transition-all ${
              intel?.stats?.threatLevel === 'CRITICAL' ? 'bg-red-500/5 border-red-500/40' : 'bg-emerald-500/5 border-emerald-500/20'
            }`}>
              <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${
                intel?.stats?.threatLevel === 'CRITICAL' ? 'text-red-500' : 'text-emerald-500'
              }`}>System_Risk_Status</p>
              <p className="text-xl font-black text-white italic tracking-tighter uppercase">{intel?.stats?.threatLevel || 'STABLE'}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: THREAT MATRIX & LOGS (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SecurityStat label="FAILED_LOGINS_24H" val={intel?.stats?.failedCount} icon={Lock} color="text-red-500" />
              <SecurityStat label="BLOCKED_IP_NODES" val={intel?.stats?.blockedCount} icon={Globe} color="text-zinc-500" />
              <SecurityStat label="FAILURE_RATE" val={`${intel?.stats?.failureRate}%`} icon={Activity} color={intel?.stats?.failureRate > 20 ? "text-red-500" : "text-emerald-500"} />
            </div>

            <section className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
                <div className="flex items-center gap-3">
                  <Terminal size={16} className="text-red-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Live_Threat_Intelligence</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[8px] font-mono text-zinc-700">FEED_ACTIVE</span>
                </div>
              </div>
              
              <div className="divide-y divide-zinc-900">
                {intel?.threatLogs?.map((log: any) => (
                  <div key={log.id} className="p-6 flex items-center justify-between hover:bg-zinc-900/30 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'FAILED' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'}`} />
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight">
                          {log.email} <span className="text-zinc-700 mx-2">//</span> {log.status}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                          {log.ip} — {new Date(log.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleBlockIP(log.ip)}
                        className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                      >
                        Blacklist IP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: FRAUD & ANOMALY RADAR (4 COLS) */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Search size={16} className="text-indigo-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Fraud_Anomaly_Radar</h3>
              </div>

              {[
                { label: 'High_Value_Anomalies', count: fraud?.anomalies?.highValueOrders?.length || 0, status: 'Level_02' },
                { label: 'Review_Clusters', count: fraud?.anomalies?.suspiciousReviews?.length || 0, status: 'Active' },
                { label: 'Registry_Alerts', count: fraud?.anomalies?.totalAlerts || 0, status: 'Total' }
              ].map((item, i) => (
                <div key={i} className="p-5 bg-black rounded-2xl border border-zinc-900 space-y-3 group hover:border-indigo-500/50 transition-all">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</p>
                    <span className="text-[8px] font-black bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded uppercase">{item.status}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{item.count}</p>
                    <button className="text-[10px] font-black text-indigo-500 uppercase hover:tracking-widest transition-all">Inspect</button>
                  </div>
                </div>
              ))}

              <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[2rem] space-y-4">
                <div className="flex gap-3 text-red-500 items-center">
                  <AlertTriangle size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol_Advisory</span>
                </div>
                <p className="text-[10px] text-zinc-600 leading-relaxed uppercase font-bold italic">
                  Anomalous traffic detected in <span className="text-white">Commercial_Registry</span>. Recommend batch-verifying high-value orders over 500k.
                </p>
              </div>
            </section>
            
            <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500"><Activity size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Firewall_Active</p>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-tighter">Filtering {intel?.stats?.totalLogins} concurrent nodes</p>
                  </div>
                </div>
                <div className="w-12 h-1 bg-zinc-900 rounded-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-8 h-full bg-emerald-500 rounded-full animate-[shimmer_2s_infinite]"/>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SecurityStat({ label, val, icon: Icon, color }: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl flex justify-between items-center group hover:bg-zinc-900/40 transition-all">
      <div className="space-y-1">
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{label}</p>
        <p className={`text-2xl font-black italic ${color}`}>{val ?? 0}</p>
      </div>
      <Icon size={24} className="opacity-10 group-hover:opacity-30 transition-opacity" />
    </div>
  );
}