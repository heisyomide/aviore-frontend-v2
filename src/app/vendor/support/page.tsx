'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, FileText, RefreshCw, Loader2, X, Send, 
  HeadphonesIcon, Wallet, ShieldCheck, 
  MessageSquare, User, History, AlertTriangle, 
  RefreshCcw, Undo2, ArrowRight, Inbox
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import ReturnMediationModal from '@/src/components/vendor/ReturnMediationModal';

interface Conversation {
  id: string;
  order: { id: string; status: string };
  user: { firstName: string; lastName: string };
  messages: { content: string; createdAt: string; senderRole: string }[];
  updatedAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  type: 'SUPPORT' | 'RETURN';
  reason?: string;
  description?: string;
  user: { firstName: string; lastName: string };
  order?: { id: string; totalAmount: number };
}

export default function VendorSupportPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'CHATS'>('CHATS');
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isReturnsPortalOpen, setIsReturnsPortalOpen] = useState(false); 
  const [selectedMediationCase, setSelectedMediationCase] = useState<Ticket | null>(null);
  const [ticketForm, setTicketForm] = useState({ subject: '', category: 'PAYOUT', message: '' });

  const pendingReturns = useMemo(() => 
    tickets.filter(t => (t.type === 'RETURN' || t.category === 'RETURN') && t.status === 'PENDING'), 
  [tickets]);

  const fetchRegistryData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'TICKETS') {
        const res = await api.get('/vendor/returns'); 
        const formattedData = res.data.map((item: any) => ({
            ...item,
            type: item.type || 'RETURN',
            subject: item.subject || `RETURN_REQUEST: #${item.id.slice(-5).toUpperCase()}`
        }));
        setTickets(formattedData);
      } else {
        const res = await api.get('/vendor/conversations');
        setConversations(res.data);
      }
    } catch (err) {
      console.error("Registry Sync Failure", err);
      try {
        const fallback = await api.get('/vendor/tickets');
        setTickets(fallback.data);
      } catch (fallbackErr) {
        console.error("Fallback retrieval failed", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistryData(); }, [activeTab]);

  const handleAdminSync = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/vendor/tickets', ticketForm);
      setIsTicketModalOpen(false);
      fetchRegistryData();
    } catch (err) { console.error("Transmission failed"); }
  };

  if (loading && conversations.length === 0 && tickets.length === 0) return <LoadingView />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-zinc-100 pb-32 animate-in fade-in duration-700">
      
      {/* 🚀 1. DESKTOP/MOBILE BALANCED IDENTITY HEADER */}
      <div className="bg-[#111113] border-b border-zinc-900 px-6 py-6 lg:py-8 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-light text-white uppercase tracking-widest font-sans">
              SUPPORT_CENTER
            </h1>
            <div className="h-[1px] w-12 bg-[#991B1B] mt-2" />
          </div>
          <button onClick={fetchRegistryData} className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
            <RefreshCw size={16} className={loading ? 'animate-spin text-[#ef4444]' : ''} />
          </button>
        </div>
      </div>

      <div className="px-6 lg:px-10 space-y-8 mt-8 max-w-7xl mx-auto">

        {/* 🚀 2. UNIFIED SEGMENT CONTROLS */}
        <div className="flex gap-2 p-1.5 bg-[#111113] rounded-lg border border-zinc-900 max-w-md">
          <button 
            onClick={() => setActiveTab('CHATS')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'CHATS' ? 'bg-[#991B1B] text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <MessageSquare size={13} /> Inquiries
          </button>
          <button 
            onClick={() => setActiveTab('TICKETS')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'TICKETS' ? 'bg-[#991B1B] text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <FileText size={13} /> Mediation
          </button>
        </div>

        {/* 🚀 3. OPERATIONAL ACTION TILES */}
        {activeTab === 'TICKETS' && (
          <div className="grid grid-cols-2 gap-4 max-w-md animate-in slide-in-from-top-2 duration-300">
            <ActionCard 
               icon={Undo2} title="Returns Management" highlight 
               subLabel={`${pendingReturns.length} Pending Audit`}
               onClick={() => { setIsReturnsPortalOpen(true); fetchRegistryData(); }} 
            />
            <ActionCard 
               icon={Wallet} title="Payout Discrepancy" 
               onClick={() => { setIsTicketModalOpen(true); setTicketForm({...ticketForm, category: 'PAYOUT'}); }} 
            />
          </div>
        )}

        {/* 🚀 4. CORE LEDGER REGISTRY */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-mono font-bold text-zinc-500 flex items-center gap-2.5 uppercase text-[9px] tracking-[0.2em]">
              {activeTab === 'TICKETS' ? <History size={13} /> : <MessageCircle size={13} />}
              {activeTab === 'TICKETS' ? 'Active_Mediation_Logs' : 'Open_Communication_Lines'}
            </h3>
          </div>

          <div className="bg-[#111113] rounded-xl border border-zinc-900 shadow-2xl overflow-hidden min-h-[400px]">
            {activeTab === 'CHATS' ? (
              <ConversationList conversations={conversations} router={router} />
            ) : (
              <MediationList tickets={tickets} onMediate={setSelectedMediationCase} />
            )}
          </div>
        </div>

        {/* 🚀 5. SYSTEM CONTEXT ASSISTANCE */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2 max-w-xl">
             <HeadphonesIcon size={20} className="text-[#ef4444]" />
             <h4 className="font-mono font-bold text-sm tracking-wide uppercase text-zinc-200">System_Resolution_Protocols</h4>
             <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide leading-relaxed">
               Core administration protocols are on standby to resolve transactional parameters, logistics disruptions, and luxury merchant asset challenges.
             </p>
          </div>
          <button className="z-10 bg-[#111113] hover:bg-zinc-900 text-zinc-300 border border-zinc-900 px-6 py-3 rounded-lg font-mono font-bold text-[9px] uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap">
            Initialize Security Sync
          </button>
        </div>
      </div>

      {/* --- MODAL SYSTEM BLUEPRINTS --- */}

      {/* MODAL: RETURN SELECTION MATRIX */}
      {isReturnsPortalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#111113] border border-zinc-900 w-full max-w-md rounded-xl flex flex-col max-h-[75vh] shadow-2xl animate-in zoom-in-95">
            <header className="p-5 border-b border-zinc-900 flex justify-between items-center">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">Pending_Return_Blueprints</h2>
              <button onClick={() => setIsReturnsPortalOpen(false)} className="p-1.5 bg-zinc-950 border border-zinc-900 hover:text-[#ef4444] rounded-md transition-colors cursor-pointer"><X size={14}/></button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {pendingReturns.length === 0 ? (
                <p className="text-[9px] font-mono text-zinc-600 uppercase text-center py-8">No returns pending allocation.</p>
              ) : (
                pendingReturns.map(req => (
                  <button 
                    key={req.id} 
                    onClick={() => { setSelectedMediationCase(req); setIsReturnsPortalOpen(false); }}
                    className="w-full p-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 rounded-lg flex items-center justify-between group transition-colors text-left cursor-pointer"
                  >
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-[10px] font-mono font-bold text-zinc-200 uppercase tracking-wide truncate">ID_#{req.id.slice(-6).toUpperCase()}</p>
                      <p className="text-[8px] font-mono text-zinc-500 uppercase mt-1 truncate tracking-wider">{req.reason || req.subject}</p>
                    </div>
                    <ArrowRight size={14} className="text-[#ef4444] group-hover:translate-x-1 transition-transform" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedMediationCase && (
        <ReturnMediationModal 
          request={selectedMediationCase as any} onClose={() => setSelectedMediationCase(null)} onSuccess={fetchRegistryData}
        />
      )}

      {isTicketModalOpen && (
        <AdminTicketModal form={ticketForm} setForm={setTicketForm} onClose={() => setIsTicketModalOpen(false)} onSubmit={handleAdminSync} />
      )}
    </div>
  );
}

/* --- ATOMIC DISPLAY ENGINES --- */

function ActionCard({ icon: Icon, title, onClick, highlight, subLabel }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`p-4 rounded-lg border flex flex-col items-start gap-4 transition-colors w-full text-left shadow-lg cursor-pointer ${
        highlight ? 'bg-[#991B1B] border-[#991B1B] text-white' : 'bg-zinc-950 text-zinc-300 border-zinc-900 hover:bg-zinc-900'
      }`}
    >
      <div className={`p-2 rounded-md ${highlight ? 'bg-black/10 text-white' : 'bg-[#111113] border border-zinc-900 text-zinc-500'}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[9px] font-mono font-bold uppercase tracking-widest">{title}</p>
        {subLabel && <p className="text-[8px] font-mono uppercase mt-1 opacity-60 tracking-wider">{subLabel}</p>}
      </div>
    </button>
  );
}

function ConversationList({ conversations, router }: { conversations: Conversation[], router: any }) {
  if (conversations.length === 0) return <EmptyRegistry label="No active customer inquiries indexed." />;
  return (
    <div className="divide-y divide-zinc-900">
      {conversations.map((c) => (
        <div key={c.id} onClick={() => router.push(`/vendor/support/chat/${c.id}`)} className="p-5 flex items-center justify-between hover:bg-zinc-950 transition-colors cursor-pointer">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-center text-zinc-600 shrink-0">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-mono font-bold text-zinc-200 text-xs uppercase tracking-wide truncate mb-1">{c.user.firstName} {c.user.lastName}</p>
              <p className="text-[9px] font-mono text-zinc-500 uppercase truncate tracking-wide">{c.messages?.[0]?.content || "Channel clear / Waiting..."}</p>
            </div>
          </div>
          <Send size={12} className="text-[#ef4444] -rotate-12 ml-4 shrink-0" />
        </div>
      ))}
    </div>
  );
}

function MediationList({ tickets, onMediate }: { tickets: Ticket[], onMediate: (t: Ticket) => void }) {
  if (tickets.length === 0) return <EmptyRegistry label="No active administrative mediation records." />;
  return (
    <div className="divide-y divide-zinc-900">
      {tickets.map((t) => (
        <div key={t.id} className="p-5 space-y-4 hover:bg-zinc-950/50 transition-colors">
          <div className="flex justify-between items-start gap-4">
             <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-md shrink-0 border ${t.type === 'RETURN' ? 'bg-zinc-950 border-zinc-900 text-[#ef4444]' : 'bg-zinc-950 border-zinc-900 text-zinc-600'}`}>
                   {t.type === 'RETURN' ? <RefreshCcw size={13} /> : <AlertTriangle size={13} />}
                </div>
                <p className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wide truncate">{t.subject}</p>
             </div>
             <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${t.status === 'PENDING' ? 'bg-amber-950/30 border-amber-900 text-amber-400' : 'bg-emerald-950/30 border-emerald-900 text-emerald-400'}`}>
                {t.status}
             </span>
          </div>
          {t.status === 'PENDING' && (
            <button onClick={() => onMediate(t)} className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-200 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer">
              Open Mediation Protocol
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function EmptyRegistry({ label }: { label: string }) {
  return (
    <div className="py-24 text-center text-zinc-700 flex flex-col items-center gap-3 w-full">
      <Inbox size={32} strokeWidth={1} className="text-zinc-800" />
      <p className="font-mono font-bold uppercase text-[9px] tracking-widest text-zinc-500">{label}</p>
    </div>
  );
}

function AdminTicketModal({ form, setForm, onClose, onSubmit }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
      <div className="bg-[#111113] border border-zinc-900 rounded-xl p-6 w-full max-w-md relative shadow-2xl space-y-5 animate-in zoom-in-95">
        <div className="flex justify-between items-center">
           <h2 className="text-xs font-mono font-bold text-zinc-200 tracking-wider uppercase">Administrative_Sync_Channel</h2>
           <button onClick={onClose} className="p-1.5 bg-zinc-950 border border-zinc-900 hover:text-[#ef4444] rounded-md transition-all cursor-pointer"><X size={14} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Dispute Subject</label>
            <input 
              className="w-full p-3.5 bg-zinc-950 border border-zinc-900 rounded-lg font-mono text-xs text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-700 uppercase" 
              placeholder="E.G., CLEAR_PAYOUT_OVERHEAD" 
              value={form.subject} 
              onChange={e => setForm({ ...form, subject: e.target.value })} 
            />
          </div>
          <button className="w-full bg-[#991B1B] hover:bg-[#7f1d1d] text-white py-4 rounded-lg font-mono font-bold text-[9px] uppercase tracking-widest transition-colors shadow-xl cursor-pointer">
            Transmit Log Packet
          </button>
        </form>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="h-screen bg-[#0D0D0D] flex flex-col items-center justify-center gap-5">
      <Loader2 className="animate-spin text-[#991B1B]" size={36} />
      <p className="text-[9px] font-mono font-bold text-zinc-500 tracking-[0.3em] uppercase animate-pulse">Synchronizing_Support_Data_Matrix...</p>
    </div>
  );
}