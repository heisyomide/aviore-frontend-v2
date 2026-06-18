'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, FileText, RefreshCw, HelpCircle, Loader2, X, Send, ShieldAlert, Check } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
}

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/user/tickets');
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Telemetry Link Failure:", err);
      toast.error("Failed to sync structural communications network");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/user/tickets', form);
      setIsModalOpen(false);
      setForm({ subject: '', message: '' });
      fetchTickets();
      toast.success("Support ledger payload entry created");
    } catch (err) {
      toast.error("Host rejected connection handshake package");
    }
  };

  const handleLiveChat = () => {
    router.push('/dashboard/orders?intent=chat');
  };

  const handleReturns = () => {
    router.push('/dashboard/orders?intent=return');
  };

  const handleFAQ = () => {
    router.push('/dashboard/support/faq');
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 bg-[#0D0D0D] min-h-[50vh]">
        <Loader2 className="animate-spin text-[#991B1B]" size={24} />
        <p className="text-[8px] font-mono font-bold tracking-[0.3em] text-zinc-600 uppercase">Indexing_Network_Communications...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 text-zinc-100">
      
      {/* 1. ARCHITECTURAL LAYER HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-900/60 pb-6">
        <div className="flex items-center gap-2 text-[#991B1B]">
          <ShieldAlert size={13} className="animate-pulse" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.3em]">Communication_Control_Matrix</span>
        </div>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-wider text-white">
          Support <span className="text-zinc-600 font-normal font-sans tracking-normal">Center</span>
        </h1>
      </header>

      {/* 2. OPERATIONAL ACTION INTERFACES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionCard 
          icon={MessageCircle} 
          label="Live Chat Interface" 
          description="Order-bound peer pipelines"
          onClick={handleLiveChat} 
        />
        <ActionCard 
          icon={FileText} 
          label="Open Matrix Ticket" 
          description="File encrypted system event"
          onClick={() => setIsModalOpen(true)} 
        />
        <ActionCard 
          icon={RefreshCw} 
          label="Logistics Returns" 
          description="Reverse transit allocation"
          onClick={handleReturns} 
        />
        <ActionCard 
          icon={HelpCircle} 
          label="Knowledge Base" 
          description="System architecture parameters"
          onClick={handleFAQ} 
        />
      </div>

      {/* 3. INCIDENT LEDGER TIMELINE */}
      <section className="bg-[#111113] rounded-lg border border-zinc-900 overflow-hidden">
        <div className="p-6 border-b border-zinc-900/60 flex justify-between items-center bg-zinc-950/20">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wide text-white">Historical Support Records</h3>
          <span className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">
            {tickets.length.toString().padStart(2, '0')} Incidents Recorded
          </span>
        </div>
        
        <div className="divide-y divide-zinc-900/40">
          {tickets.map((t) => (
            <div key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950/10 hover:bg-zinc-950/30 transition-colors group">
              <div className="flex items-start gap-4 min-w-0">
                <div className="font-mono text-[9px] font-bold text-zinc-600 bg-zinc-950 border border-zinc-900 px-2 py-1 rounded shrink-0">
                  #{t.id.slice(-6).toUpperCase()}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-mono font-bold text-white uppercase tracking-wide truncate pr-4">{t.subject}</p>
                  <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                    Timestamp: {new Date(t.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center">
                <StatusBadge status={t.status} />
              </div>
            </div>
          ))}
          
          {tickets.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <p className="text-zinc-600 text-[9px] font-mono font-bold uppercase tracking-[0.2em]">No diagnostic log files discovered</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. MODAL LAYER FOR ENCRYPTED TICKET SUBMISSION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative m-auto w-full max-w-lg overflow-hidden rounded-lg bg-[#111113] p-6 shadow-2xl border border-zinc-900 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-start mb-6 border-b border-zinc-900 pb-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[#991B1B]">
                  <FileText size={11} />
                  <span className="text-[8px] font-mono font-bold uppercase tracking-[0.25em]">Manifest_Incident_Payload</span>
                </div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white truncate pr-2">Describe Operational Fault</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-800 transition-all shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4 overflow-y-auto no-scrollbar">
              <div className="space-y-1">
                <label className="text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500 ml-0.5">Payload Header</label>
                <input 
                  placeholder="SUBJECT ENVELOPE (E.G., REVERSE TRANSLATION COMPLIANCE)" required
                  className="w-full p-3 bg-zinc-950 border border-zinc-900 rounded outline-none focus:border-zinc-700 text-xs font-mono font-bold text-white uppercase tracking-wider placeholder:text-zinc-700"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-500 ml-0.5">Diagnostic Log Narrative</label>
                <textarea 
                  placeholder="SPECIFY UNRESOLVED DISCREPANCIES..." rows={4} required
                  className="w-full p-3 bg-zinc-950 border border-zinc-900 rounded outline-none focus:border-zinc-700 text-xs font-mono font-bold text-white uppercase tracking-wide placeholder:text-zinc-700 resize-none leading-relaxed"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-3.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
                <Send size={11} /> Commit Pipeline Ticket
              </button>
            </form>

          </div>
        </div>
      )}
      
      <p className="text-center text-[7px] font-mono font-bold text-zinc-700 uppercase tracking-[0.4em]">
        AVIORÈ_PIPELINE_SUPP_v1.02
      </p>
    </div>
  );
}

// --- INTERNAL INTERFACE BLOCKS ---

function ActionCard({ icon: Icon, label, description, onClick }: { icon: any, label: string, description: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className="bg-[#111113] p-5 rounded-lg border border-zinc-900 hover:border-zinc-800 transition-all text-left flex flex-col justify-between h-36 group active:scale-[0.98]"
    >
      <div className="bg-zinc-950 border border-zinc-900 p-3 rounded text-zinc-600 transition-colors group-hover:text-[#991B1B] group-hover:border-[#991B1B]/30 shrink-0 self-start">
        <Icon size={16} />
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-mono font-bold text-white uppercase tracking-wide">{label}</p>
        <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-tight leading-tight">{description}</p>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    RESOLVED: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60',
    OPEN: 'bg-blue-950/40 text-blue-400 border-blue-900/60',
    IN_PROGRESS: 'bg-amber-950/40 text-amber-400 border-amber-900/60',
  };

  const activeStyle = styles[status] || styles.OPEN;

  return (
    <span className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold uppercase tracking-widest border ${activeStyle}`}>
      {status.replace('_', ' ')}
    </span>
  );
}