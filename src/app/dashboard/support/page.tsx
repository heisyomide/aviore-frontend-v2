'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, FileText, RefreshCw, HelpCircle, Loader2, X, Send, Inbox } from 'lucide-react';
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
      console.error("Failed to fetch tickets", err);
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
      toast.success("Ticket Submitted", { description: "Your support request has been cataloged successfully." });
    } catch (err) {
      toast.error("Submission Failed", { description: "Could not file support ticket at this time." });
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
      <div className="flex h-96 items-center justify-center animate-in fade-in duration-300">
        <Loader2 className="animate-spin text-[#A4143D]" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* 1. PREMIUM HEADER */}
      <header className="flex flex-col gap-1.5 border-b border-zinc-100 pb-8">
        <div className="flex items-center gap-2 text-[#A4143D]">
          <HelpCircle size={14} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Client Assistance</span>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
          Support <span className="text-zinc-300 font-medium">Center</span>
        </h1>
      </header>

      {/* 2. UNIFORM QUICK ACTIONS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionCard 
          icon={MessageCircle} 
          label="Live Chat" 
          onClick={handleLiveChat} 
        />
        <ActionCard 
          icon={FileText} 
          label="Open Ticket" 
          onClick={() => setIsModalOpen(true)} 
        />
        <ActionCard 
          icon={RefreshCw} 
          label="Returns" 
          onClick={handleReturns} 
        />
        <ActionCard 
          icon={HelpCircle} 
          label="FAQ Database" 
          onClick={handleFAQ} 
        />
      </div>

      {/* 3. SUPPORT REQUESTS LOG */}
      <section className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/30">
          <h3 className="text-sm font-black uppercase tracking-tight text-zinc-900">Recent Support Requests</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {tickets.length} {tickets.length === 1 ? 'Ticket' : 'Tickets'}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-zinc-400 bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-6 py-4 font-bold">Ticket ID</th>
                <th className="px-6 py-4 font-bold">Subject</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Date Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50/30 transition-colors">
                  <td className="px-6 py-5 font-mono text-[11px] text-zinc-400">
                    #{t.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-5 font-bold text-zinc-900 text-sm tracking-tight">{t.subject}</td>
                  <td className="px-6 py-5"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-5 text-xs text-zinc-500 font-medium">
                    {new Date(t.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-zinc-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Inbox size={28} className="text-zinc-300" />
                      <p className="text-xs font-bold uppercase tracking-widest">No Active Logs</p>
                      <p className="text-[10px] italic">You have not posted any technical issue logs yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. REFACTORED MODAL INTERFACE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative border border-zinc-200 shadow-xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute right-6 top-6 p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-50 transition rounded-lg"
            >
              <X size={16} />
            </button>
            
            <div className="mb-6 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#A4143D]">
                <FileText size={12} />
                <span className="text-[9px] font-bold uppercase tracking-wider">New Submission</span>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 leading-none">Describe the Issue</h2>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <input 
                placeholder="SUBJECT (E.G., REFUND VECTOR)" required
                className="w-full px-4 py-3.5 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 text-xs font-bold text-zinc-900 uppercase tracking-tight"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              />
              <textarea 
                placeholder="Detail your request notes..." rows={4} required
                className="w-full p-4 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 text-xs font-medium text-zinc-900 resize-none leading-relaxed"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
              <button className="w-full bg-zinc-900 hover:bg-black text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
                <Send size={12} className="text-zinc-400" /> Dispatch Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- CORE MINI DESIGN MOLECULES ---

function ActionCard({ icon: Icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick} 
      className="bg-white p-6 rounded-2xl border border-zinc-200 text-center group hover:border-zinc-400 transition-all duration-300"
    >
      <div className="w-10 h-10 bg-zinc-50 border border-zinc-200 text-zinc-400 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:text-[#A4143D] transition-colors">
        <Icon size={18} />
      </div>
      <p className="text-xs font-bold text-zinc-900 uppercase tracking-tight">{label}</p>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    RESOLVED: 'bg-white text-emerald-600 border-emerald-200',
    OPEN: 'bg-white text-zinc-900 border-zinc-900',
    IN_PROGRESS: 'bg-white text-amber-600 border-amber-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${styles[status] || styles.OPEN}`}>
      {status.replace('_', ' ')}
    </span>
  );
}