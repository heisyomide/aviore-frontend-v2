"use client";

import { useState } from "react";
import { 
  Mail, MessageSquare, Send, Zap, Smartphone, 
  Eye, Loader2, Info, CheckCircle2, Globe, Server
} from "lucide-react";
import { api } from "@/src/lib/axios";
import { toast } from "sonner";

type TargetGroup = "ALL" | "VENDORS" | "CUSTOMERS";
type ChannelType = "email" | "push" | "sms";
type BroadcastStatus = "IDLE" | "SYNCING" | "SUCCESS";

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BroadcastStatus>("IDLE");
  const [form, setForm] = useState({
    title: "",
    message: "",
    target: "ALL" as TargetGroup,
    channels: { email: true, push: true, sms: false }
  });

  const toggleChannel = (id: ChannelType) => {
    setForm(prev => ({
      ...prev,
      channels: { ...prev.channels, [id]: !prev.channels[id] }
    }));
  };

  const handleBroadcast = async () => {
    if (!form.title || !form.message) return toast.error("VALIDATION_ERROR: Missing Payload");
    
    setLoading(true);
    setStatus("SYNCING");
    
    try {
      await api.post("/admin/notifications/broadcast", { 
        ...form, 
        title: form.title.toUpperCase() 
      });
      
      toast.success("BROADCAST_SEQUENCE_COMPLETED");
      setStatus("SUCCESS");

      // SUCCESS GAP: Hold the message on the phone for 4 seconds
      setTimeout(() => {
        setForm(prev => ({ ...prev, title: "", message: "" }));
        setStatus("IDLE");
        setLoading(false);
      }, 4000);

    } catch {
      toast.error("RELAY_FAILURE");
      setLoading(false);
      setStatus("IDLE");
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans p-6 lg:p-12 selection:bg-indigo-500/30">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* HEADER: GLOBAL COMMAND */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-900 pb-10 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-500">
              <Server size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Broadcast_Terminal_v2.1</span>
            </div>
            <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
              Comms <span className="text-zinc-800">Engine</span>
            </h1>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-none">Authorization: Level_01_Admin</p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px] transition-colors duration-500 ${status === 'IDLE' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-indigo-500 shadow-indigo-500/50'}`} />
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                {status === 'IDLE' ? 'System_Link_Active' : 'Transmission_In_Progress'}
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
          
          {/* LEFT: DEPLOYMENT CONTROLS */}
          <div className="lg:col-span-7 flex flex-col">
            <section className="flex-1 bg-[#050505] border border-zinc-900 rounded-[3rem] p-10 space-y-12 shadow-2xl relative overflow-hidden flex flex-col">
              
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">Relay_Node_Pathways</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['email', 'push', 'sms'] as ChannelType[]).map((id) => (
                    <button
                      key={id}
                      disabled={loading}
                      onClick={() => toggleChannel(id)}
                      className={`flex flex-col gap-4 p-6 rounded-[2rem] border transition-all duration-300 ${
                        form.channels[id] 
                        ? "bg-indigo-600/5 border-indigo-500/50 text-white" 
                        : "bg-zinc-950 border-zinc-900 text-zinc-700 opacity-60 grayscale"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        {id === 'email' && <Mail size={18} />}
                        {id === 'push' && <Smartphone size={18} />}
                        {id === 'sms' && <MessageSquare size={18} />}
                        {form.channels[id] && <CheckCircle2 size={14} className="text-indigo-500" />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-left">{id}_Buffer</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">Target_Demographic_Index</label>
                <div className="flex p-1.5 bg-black rounded-2xl border border-zinc-900">
                  {(["ALL", "VENDORS", "CUSTOMERS"] as TargetGroup[]).map((t) => (
                    <button
                      key={t}
                      disabled={loading}
                      onClick={() => setForm(prev => ({ ...prev, target: t }))}
                      className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                        form.target === t ? "bg-white text-black shadow-2xl" : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8 flex-1">
                <div className="relative group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1 block mb-2">Subject_Identity</label>
                  <input 
                    placeholder="ENTER_SIGNAL_HEADER" 
                    value={form.title}
                    disabled={loading}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-transparent border-b border-zinc-900 focus:border-indigo-500 py-4 text-3xl font-black italic text-white uppercase placeholder:text-zinc-900 outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">Signal_Content_Payload</label>
                  <textarea 
                    placeholder="Compile transmission content..." 
                    value={form.message}
                    disabled={loading}
                    onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-black border border-zinc-900 focus:border-indigo-500/50 p-8 rounded-[2.5rem] h-56 text-sm text-zinc-300 outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              <button 
                onClick={handleBroadcast}
                disabled={loading}
                className={`w-full h-24 rounded-[2rem] text-xs font-black uppercase tracking-[0.6em] transition-all duration-500 flex items-center justify-center gap-6 shadow-2xl disabled:opacity-50 group ${status === 'SUCCESS' ? 'bg-emerald-600 text-white' : 'bg-white text-black hover:bg-indigo-600 hover:text-white'}`}
              >
                {status === 'SYNCING' ? <Loader2 className="animate-spin" size={24} /> : 
                 status === 'SUCCESS' ? <><CheckCircle2 size={20} /> Transmission_Logged</> :
                 <><Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" /> Authorize_Execution</>}
              </button>
            </section>
          </div>

          {/* RIGHT: LIVE MONITOR */}
          <div className="lg:col-span-5 flex flex-col space-y-10">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <Eye size={14} className="text-indigo-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Live_Registry_Feed</h3>
              </div>
              <div className="px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter italic">Source: Encrypted_Relay_01</span>
              </div>
            </div>
            
            <div className="relative mx-auto w-full max-w-[360px] aspect-[9/18.5] bg-[#020202] rounded-[4rem] border-[12px] border-zinc-900 shadow-[0_0_80px_rgba(0,0,0,1)] p-8 flex flex-col overflow-hidden ring-1 ring-white/5">
              <div className="w-24 h-6 bg-zinc-900 self-center absolute top-0 rounded-b-[2rem] z-20 border-x border-b border-white/5" />
              
              <div className="flex-1 flex flex-col text-center pt-12 space-y-12">
                <div className="space-y-2 opacity-30">
                  <div className="text-7xl font-thin text-white tracking-tighter">00:23</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em]">Sunday, March 08</div>
                </div>

                <div className={`transition-all duration-700 bg-white/[0.02] backdrop-blur-3xl border p-6 rounded-[2.5rem] text-left shadow-2xl relative overflow-hidden ${status === 'SYNCING' ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-95' : status === 'SUCCESS' ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-white/10'}`}>
                  {status === 'SYNCING' && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-pulse" />}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black italic transition-colors ${status === 'SYNCING' ? 'bg-indigo-500 text-white' : status === 'SUCCESS' ? 'bg-emerald-500 text-white' : 'bg-white text-black'}`}>A</div>
                      <span className="text-[10px] font-black text-zinc-300 tracking-widest uppercase">Aviore</span>
                    </div>
                    <span className="text-[8px] text-zinc-600 font-bold uppercase">
                      {status === 'SYNCING' ? 'Syncing...' : status === 'SUCCESS' ? 'Delivered' : 'Just Now'}
                    </span>
                  </div>

                  <h4 className="text-[15px] font-black text-white uppercase tracking-tight mb-2 truncate">
                    {form.title || (status === 'SYNCING' ? "ESTABLISHING_LINK..." : "SIGNAL_ID_READY")}
                  </h4>
                  <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-4 italic font-medium">
                    {form.message || (status === 'SYNCING' ? "Deploying data packets to Aviore network nodes..." : "Awaiting command sequence from registry...")}
                  </p>
                </div>
              </div>

              <div className="w-32 h-1 bg-zinc-800 self-center absolute bottom-4 rounded-full" />
            </div>
            
            <div className="bg-[#050505] border border-zinc-900 p-8 rounded-[2.5rem] relative group overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                 <Zap size={100} />
               </div>
               <div className="flex gap-4 text-indigo-500 mb-4 items-center">
                  <div className="p-2 bg-indigo-500/10 rounded-lg"><Info size={16} /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Broadcast_Advisory</span>
               </div>
               <p className="text-[11px] text-zinc-600 leading-relaxed uppercase font-bold italic border-l-2 border-indigo-500/30 pl-5">
                 Data packets are distributed via multi-channel relay. Demographic target: <span className="text-zinc-400">"{form.target}"</span>. Authorized by Admin ID: <span className="text-indigo-400">SYS_ADMIN_01</span>.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}