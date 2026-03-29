'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, FileText, RefreshCw, Loader2, X, Send, 
  AlertCircle, HeadphonesIcon, Wallet, ShieldCheck, 
  MessageSquare, User, History, AlertTriangle, 
  RefreshCcw, Undo2, ArrowRight, Inbox, Bell
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import ReturnMediationModal from '@/src/components/vendor/ReturnMediationModal';

// --- Registry Interfaces (PRESERVED) ---
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
            subject: item.subject || `Return Request: #${item.id.slice(-5)}`
        }));
        setTickets(formattedData);
      } else {
        const res = await api.get('/vendor/conversations');
        setConversations(res.data);
      }
    } catch (err) {
      console.error("Registry Sync Failure", err);
      const fallback = await api.get('/vendor/tickets');
      setTickets(fallback.data);
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
    <div className="min-h-screen bg-white lg:bg-[#FAFAFA] pb-32 animate-in fade-in duration-700">
      
      {/* 🚀 1. STICKY MOBILE IDENTITY NODE (Matching Marketing Structure) */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-8 flex justify-between items-center border-b border-slate-50">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Support
          </h1>
          <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
        </div>
        <button onClick={fetchRegistryData} className="p-2 text-slate-400 active:rotate-180 transition-all duration-500">
          <RefreshCw size={22} className={loading ? 'animate-spin text-blue-600' : ''} />
        </button>
      </div>

      <div className="px-6 lg:px-10 space-y-10 mt-6 max-w-7xl mx-auto">

        {/* 🚀 2. NAVIGATION TABS (Mobile Unified Control) */}
        <div className="flex gap-4 p-2 bg-slate-50 rounded-[2rem] shadow-inner">
          <button 
            onClick={() => setActiveTab('CHATS')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'CHATS' ? 'bg-white shadow-xl text-blue-600' : 'text-slate-400'}`}
          >
            <MessageSquare size={16} /> Inquiries
          </button>
          <button 
            onClick={() => setActiveTab('TICKETS')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'TICKETS' ? 'bg-white shadow-xl text-blue-600' : 'text-slate-400'}`}
          >
            <FileText size={16} /> Mediation
          </button>
        </div>

        {/* 🚀 3. COMMAND ACTION GRID (Visible only in Mediation/Tickets) */}
        {activeTab === 'TICKETS' && (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
            <ActionCard 
               icon={Undo2} title="Returns" highlight 
               subLabel={`${pendingReturns.length} Pending`}
               onClick={() => { setIsReturnsPortalOpen(true); fetchRegistryData(); }} 
            />
            <ActionCard 
               icon={Wallet} title="Payouts" 
               onClick={() => { setIsTicketModalOpen(true); setTicketForm({...ticketForm, category: 'PAYOUT'}); }} 
            />
          </div>
        )}

        {/* 🚀 4. PRIMARY DATA REGISTRY */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-slate-400 flex items-center gap-3 uppercase text-[10px] tracking-[0.4em]">
              {activeTab === 'TICKETS' ? <History size={16} /> : <MessageCircle size={16} />}
              {activeTab === 'TICKETS' ? 'Protocol_Logs' : 'Active_Channels'}
            </h3>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            {activeTab === 'CHATS' ? (
              <ConversationList conversations={conversations} router={router} />
            ) : (
              <MediationList tickets={tickets} onMediate={setSelectedMediationCase} />
            )}
          </div>
        </div>

        {/* 🚀 5. REGISTRY HELP ASIDE (Full Width Mobile) */}
        <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
          <div className="relative z-10 space-y-5">
             <HeadphonesIcon size={32} className="text-blue-500" />
             <h4 className="font-black text-2xl tracking-tighter uppercase italic leading-none">Registry_Help</h4>
             <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-relaxed italic">
               Administrative success nodes are available for mediation regarding order disputes.
             </p>
             <button className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">
               Initiate_Sync
             </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -mr-16 -mt-16" />
        </div>
      </div>

      {/* --- OVERLAYS (Preserved Logic) --- */}

      {/* MODAL: RETURN SELECTION PORTAL */}
      {isReturnsPortalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] flex flex-col max-h-[80vh] shadow-2xl animate-in zoom-in-95">
            <header className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Return_Requests</h2>
              <button onClick={() => setIsReturnsPortalOpen(false)} className="p-2 bg-slate-50 rounded-xl"><X size={20}/></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {pendingReturns.map(req => (
                <button 
                  key={req.id} 
                  onClick={() => { setSelectedMediationCase(req); setIsReturnsPortalOpen(false); }}
                  className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group active:bg-white transition-all"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="text-[10px] font-black text-slate-900 italic truncate">Ref_#{req.id.slice(-6).toUpperCase()}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 truncate">{req.reason || req.subject}</p>
                  </div>
                  <ArrowRight size={16} className="text-blue-600 group-active:translate-x-1 transition-transform" />
                </button>
              ))}
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

/* 🎨 SUB-COMPONENTS (PRESERVED) */

function ActionCard({ icon: Icon, title, onClick, highlight, subLabel }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`p-6 rounded-[2.2rem] border flex flex-col items-center gap-3 transition-all active:scale-95 shadow-sm w-full ${
        highlight ? 'bg-blue-600 text-white border-blue-600 shadow-blue-100' : 'bg-white text-slate-900 border-slate-100'
      }`}
    >
      <div className={`p-4 rounded-xl ${highlight ? 'bg-white/10' : 'bg-slate-50 text-slate-400'}`}>
        <Icon size={20} />
      </div>
      <div className="text-center">
        <p className="text-[9px] font-black uppercase tracking-widest">{title}</p>
        {subLabel && <p className="text-[7px] font-bold uppercase mt-1 opacity-60">{subLabel}</p>}
      </div>
    </button>
  );
}

function ConversationList({ conversations, router }: { conversations: Conversation[], router: any }) {
  if (conversations.length === 0) return <EmptyRegistry label="No inquiries found." />;
  return (
    <div className="divide-y divide-slate-50">
      {conversations.map((c) => (
        <div key={c.id} onClick={() => router.push(`/vendor/support/chat/${c.id}`)} className="p-6 flex items-center justify-between active:bg-slate-50 transition-all cursor-pointer">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
              <User size={24} />
            </div>
            <div className="min-w-0">
              <p className="font-black text-slate-900 text-sm uppercase italic truncate leading-none mb-2">{c.user.firstName} {c.user.lastName}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase italic truncate">{c.messages?.[0]?.content || "Sync pending..."}</p>
            </div>
          </div>
          <Send size={16} className="text-blue-600 -rotate-12 ml-4" />
        </div>
      ))}
    </div>
  );
}

function MediationList({ tickets, onMediate }: { tickets: Ticket[], onMediate: (t: Ticket) => void }) {
  if (tickets.length === 0) return <EmptyRegistry label="No mediation records." />;
  return (
    <div className="divide-y divide-slate-50">
      {tickets.map((t) => (
        <div key={t.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${t.type === 'RETURN' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                   {t.type === 'RETURN' ? <RefreshCcw size={14} /> : <AlertTriangle size={14} />}
                </div>
                <p className="text-[10px] font-black text-slate-900 uppercase italic truncate max-w-[150px]">{t.subject}</p>
             </div>
             <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${t.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {t.status}
             </span>
          </div>
          {t.status === 'PENDING' && (
            <button onClick={() => onMediate(t)} className="w-full py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95">
              Mediate_Case
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function EmptyRegistry({ label }: { label: string }) {
  return (
    <div className="py-24 text-center text-slate-200 flex flex-col items-center gap-4 w-full">
      <Inbox size={48} strokeWidth={1} />
      <p className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-300">{label}</p>
    </div>
  );
}

function AdminTicketModal({ form, setForm, onClose, onSubmit }: any) {
  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xl flex items-center justify-center z-[150] p-6">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md relative shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Admin_Sync</h2>
           <button onClick={onClose} className="p-2 bg-slate-50 rounded-xl transition-all active:scale-90"><X size={20} /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/5 transition-all uppercase" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl">Transmit_Case</button>
        </form>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-6">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">Synchronizing_Support_Registry</p>
    </div>
  );
}