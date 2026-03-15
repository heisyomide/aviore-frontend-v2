"use client";

import { useState, useEffect } from "react";
import { 
  LifeBuoy, MessageSquare, Send, CheckCircle2, 
  Clock, XCircle, User, Mail, ShieldCheck, 
  Loader2, ChevronRight, Search, Filter, BookOpen, 
  Activity, ArrowUpRight
} from "lucide-react";
import { api } from "@/src/lib/axios";
import { toast } from "sonner";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/tickets");
      setTickets(res.data);
    } catch {
      toast.error("PROTOCOL_ERROR: Support queue synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdating(true);
    try {
      await api.patch(`/admin/tickets/${id}/status`, { status });
      toast.success(`STATUS_OVERRIDE: Ticket set to ${status}`);
      fetchTickets();
      if (selectedTicket?.id === id) {
        setSelectedTicket(prev => prev ? { ...prev, status: status as any } : null);
      }
    } catch {
      toast.error("COMMAND_ERROR: Authority rejected status change.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#020202] text-zinc-400 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR: Ticket Intelligence Feed */}
      <aside className="w-1/3 border-r border-zinc-900 overflow-y-auto flex flex-col">
        <header className="p-8 border-b border-zinc-900 bg-zinc-950/30 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-indigo-500">
            <Activity size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Support_Matrix</span>
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Global Queue</h1>
          
          <div className="relative pt-2">
            <Search className="absolute left-3 top-5 text-zinc-700" size={14} />
            <input 
              placeholder="Search Subject or User..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 p-3 pl-10 rounded-xl text-[10px] uppercase font-bold tracking-widest outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </header>

        <div className="flex-1 divide-y divide-zinc-900">
          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-zinc-800" /></div>
          ) : tickets.length === 0 ? (
            <div className="p-20 text-center uppercase text-[10px] tracking-widest text-zinc-700 font-black italic">Queue_Clear</div>
          ) : (
            tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`w-full p-8 text-left transition-all hover:bg-zinc-950 flex gap-4 relative group ${
                  selectedTicket?.id === t.id ? "bg-zinc-900/50" : ""
                }`}
              >
                {selectedTicket?.id === t.id && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                )}
                
                <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                  t.status === 'OPEN' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-zinc-800'
                }`} />
                
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-white uppercase tracking-tight line-clamp-1">{t.subject}</span>
                    <span className="text-[9px] font-mono text-zinc-700 uppercase group-hover:text-zinc-500 transition-colors">
                      {new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-600 line-clamp-2 italic font-medium">"{t.message}"</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] font-black uppercase text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                      {t.status}
                    </span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all text-indigo-500" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* RIGHT: Verdict & Communication Console */}
      <main className="flex-1 overflow-y-auto bg-black relative flex flex-col">
        {selectedTicket ? (
          <div className="p-12 max-w-5xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
            
            {/* Ticket Header: Entity Dossier */}
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Inquiry_Node</span>
                <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                  Review <span className="text-zinc-800">Sequence</span>
                </h2>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <User size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{selectedTicket.user.firstName} {selectedTicket.user.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <Mail size={12} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{selectedTicket.user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Asset_UID: {selectedTicket.id.slice(0, 14)}</span>
                 <div className="h-14 w-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 text-indigo-500 shadow-2xl">
                    <LifeBuoy size={28} />
                 </div>
              </div>
            </div>

            {/* Content Display: Transmission */}
            <section className="bg-zinc-950 border border-zinc-900 p-10 rounded-[2.5rem] relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MessageSquare size={120} />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-3 border-b border-zinc-900 pb-6 mb-8">
                 <BookOpen size={14} className="text-indigo-500" /> Transmission_Manifest
               </h3>
               <p className="text-xl text-zinc-300 leading-relaxed font-light italic relative z-10">
                 {selectedTicket.message}
               </p>
            </section>

            {/* Action Console: Response Terminal */}
            <section className="space-y-8 pb-20">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4">Response_Protocol</label>
                <textarea 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Draft outgoing transmission..."
                  className="w-full bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] text-sm text-zinc-300 outline-none focus:border-indigo-500 focus:ring-4 ring-indigo-500/5 transition-all h-56 resize-none shadow-2xl"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                  onClick={() => handleStatusUpdate(selectedTicket.id, 'RESOLVED')}
                  disabled={updating}
                  className="py-5 rounded-2xl bg-zinc-950 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
                >
                  <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" /> 
                  {updating ? "Updating..." : "Authorize Resolution"}
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedTicket.id, 'IN_PROGRESS')}
                  disabled={updating}
                  className="py-5 rounded-2xl bg-zinc-950 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
                >
                  <Clock size={16} className="group-hover:rotate-45 transition-transform" /> 
                  Mark_In_Buffer
                </button>
                <button 
                  className="py-5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95"
                >
                  <Send size={16} /> Deploy Transmission
                </button>
              </div>
            </section>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20">
            <ShieldCheck size={100} strokeWidth={1} className="text-zinc-500" />
            <p className="text-[10px] font-black uppercase tracking-[1.5em] ml-6">Registry_Standby</p>
          </div>
        )}
      </main>
    </div>
  );
}