'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, FileText, RefreshCw, HelpCircle, 
  Loader2, X, Send, AlertCircle, HeadphonesIcon, 
  Wallet, ShieldCheck, MessageSquare, User, History,
  AlertTriangle, ShieldAlert, RefreshCcw, Undo2, ArrowRight,
  Inbox
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import ReturnMediationModal from '@/src/components/vendor/ReturnMediationModal';

// --- Registry Interfaces ---
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

  // --- FIX 1: Accurate Analytics Filtering ---
  // We explicitly check for tickets where type is 'RETURN'
  const pendingReturns = useMemo(() => 
    tickets.filter(t => (t.type === 'RETURN' || t.category === 'RETURN') && t.status === 'PENDING'), 
  [tickets]);

  // --- FIX 2: Dynamic Synchronization Protocol ---
  const fetchRegistryData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'TICKETS') {
        // We call the specific returns endpoint to ensure we get the full data objects
        const res = await api.get('/vendor/returns'); 
        // Map the results to ensure they have the 'RETURN' type for the UI logic
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
      // Fallback to standard tickets if specific returns endpoint fails
      const fallback = await api.get('/vendor/tickets');
      setTickets(fallback.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistryData();
  }, [activeTab]);

  const handleAdminSync = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/vendor/tickets', ticketForm);
      setIsTicketModalOpen(false);
      fetchRegistryData();
    } catch (err) { console.error("Transmission failed"); }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
      
      {/* 1. BRANDING & NAVIGATION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#A4143D]">
             <ShieldAlert size={14} />
             <span className="text-[10px] font-black uppercase tracking-[0.5em]">Registry_v2_Active</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Support_Hub</h1>
        </div>

        <nav className="bg-gray-100 p-2 rounded-[2rem] flex gap-2 shadow-inner">
          <TabButton active={activeTab === 'CHATS'} onClick={() => setActiveTab('CHATS')} icon={MessageSquare} label="Inquiries" />
          <TabButton active={activeTab === 'TICKETS'} onClick={() => setActiveTab('TICKETS')} icon={FileText} label="Mediation" />
        </nav>
      </header>

      {/* 2. COMMAND ACTION GRID */}
      {activeTab === 'TICKETS' && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-6 duration-500">
          <ActionCard 
            icon={Undo2} 
            title="Returns" 
            highlight 
            onClick={() => {
                setIsReturnsPortalOpen(true);
                fetchRegistryData(); // Force fetch on click
            }} 
            subLabel={`${pendingReturns.length} Pending`}
          />
          <ActionCard icon={Wallet} title="Payouts" onClick={() => { setIsTicketModalOpen(true); setTicketForm({...ticketForm, category: 'PAYOUT'}); }} />
          <ActionCard icon={ShieldCheck} title="Verify" onClick={() => { setIsTicketModalOpen(true); setTicketForm({...ticketForm, category: 'KYC'}); }} />
          <ActionCard icon={AlertCircle} title="Fraud" onClick={() => { setIsTicketModalOpen(true); setTicketForm({...ticketForm, category: 'DISPUTE'}); }} />
        </section>
      )}

      {/* 3. PRIMARY DISPLAY NODE */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-4">
            <h3 className="font-black text-gray-400 flex items-center gap-3 uppercase text-[10px] tracking-[0.4em]">
              {activeTab === 'TICKETS' ? <History size={16} /> : <MessageCircle size={16} />}
              {activeTab === 'TICKETS' ? 'Protocol_Logs' : 'Active_Channels'}
            </h3>
            <button onClick={fetchRegistryData} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <RefreshCw size={14} className={loading ? 'animate-spin text-[#A4143D]' : 'text-gray-300'} />
            </button>
          </div>

          <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden min-h-[500px]">
            {loading ? (
              <LoadingView />
            ) : activeTab === 'CHATS' ? (
              <ConversationList conversations={conversations} router={router} />
            ) : (
              <MediationList tickets={tickets} onMediate={setSelectedMediationCase} />
            )}
          </div>
        </div>

        <aside className="bg-gray-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#A4143D]/20 blur-[100px] -mr-24 -mt-24 transition-all" />
          <HeadphonesIcon size={32} className="text-[#A4143D] mb-8" />
          <h4 className="font-black text-3xl mb-4 tracking-tighter uppercase italic leading-none">Registry_Help</h4>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 font-medium opacity-70">
            Administrative success nodes are available for mediation regarding order disputes.
          </p>
          <button className="w-full bg-white text-gray-900 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#A4143D] hover:text-white transition-all shadow-xl">
            Initiate_Sync
          </button>
        </aside>
      </section>

      {/* --- OVERLAYS --- */}

      {/* MODAL 1: RETURN PORTAL (Selection Bridge) */}
      {isReturnsPortalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] flex flex-col max-h-[80vh] shadow-2xl animate-in zoom-in-95">
            <header className="p-10 border-b border-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#A4143D]/5 text-[#A4143D] rounded-2xl"><Undo2 size={24}/></div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Return_Requests</h2>
              </div>
              <button onClick={() => setIsReturnsPortalOpen(false)} className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all"><X size={24}/></button>
            </header>
            <div className="flex-1 overflow-y-auto p-10 space-y-4">
              {pendingReturns.length > 0 ? (
                pendingReturns.map(req => (
                  <button 
                    key={req.id} 
                    onClick={() => { setSelectedMediationCase(req); setIsReturnsPortalOpen(false); }}
                    className="w-full p-8 bg-gray-50 rounded-[3rem] border border-gray-100 flex items-center justify-between hover:bg-white hover:border-[#A4143D]/20 transition-all text-left group"
                  >
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{req.user?.firstName} {req.user?.lastName}</p>
                      <h4 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">Ref_#{req.id.slice(-6).toUpperCase()}</h4>
                      <p className="text-xs font-bold text-gray-500 mt-1 truncate max-w-[300px]">{req.reason || req.subject}</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#A4143D] group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </button>
                ))
              ) : (
                <EmptyRegistry label="Zero Pending Returns" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FINAL MEDIATION ACTION */}
      {selectedMediationCase && (
        <ReturnMediationModal 
          request={selectedMediationCase as any}
          onClose={() => setSelectedMediationCase(null)}
          onSuccess={fetchRegistryData}
        />
      )}

      {isTicketModalOpen && (
        <AdminTicketModal form={ticketForm} setForm={setTicketForm} onClose={() => setIsTicketModalOpen(false)} onSubmit={handleAdminSync} />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ActionCard({ icon: Icon, title, onClick, highlight, subLabel }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`p-8 rounded-[3rem] border flex flex-col items-center gap-4 transition-all hover:shadow-2xl group active:scale-95 shadow-sm w-full ${
        highlight ? 'bg-[#A4143D] text-white border-transparent' : 'bg-white text-gray-900 border-gray-100 hover:border-[#A4143D]/30'
      }`}
    >
      <div className={`p-5 rounded-2xl transition-all shadow-inner ${
        highlight ? 'bg-white/10 text-white group-hover:bg-white/20' : 'bg-gray-50 text-gray-400 group-hover:text-[#A4143D]'
      }`}>
        <Icon size={24} />
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest leading-none">{title}</p>
        {subLabel && <p className="text-[8px] font-black uppercase tracking-widest mt-1.5 opacity-40">{subLabel}</p>}
      </div>
    </button>
  );
}

function MediationList({ tickets, onMediate }: { tickets: Ticket[], onMediate: (t: Ticket) => void }) {
  if (tickets.length === 0) return <EmptyRegistry label="No mediation records found." />;
  return (
    <div className="divide-y divide-gray-50">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="p-10 flex items-center justify-between group hover:bg-gray-50/50 transition-all border-l-4 border-transparent hover:border-[#A4143D]">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-gray-50 rounded-[1.8rem] flex items-center justify-center text-[#A4143D] group-hover:bg-[#A4143D] group-hover:text-white transition-all shadow-inner">
              {ticket.type === 'RETURN' ? <RefreshCcw size={24} /> : <AlertTriangle size={24} />}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ticket.type} Protocol</span>
                <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${ticket.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {ticket.status}
                </span>
              </div>
              <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">{ticket.subject}</h4>
            </div>
          </div>
          {ticket.status === 'PENDING' && (
            <button onClick={() => onMediate(ticket)} className="px-8 py-4 bg-gray-900 text-white rounded-[1.4rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 shadow-xl active:scale-95 transition-all">
              Mediate_Case
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function ConversationList({ conversations, router }: { conversations: Conversation[], router: any }) {
  if (conversations.length === 0) return <EmptyRegistry label="No inquiries found." />;
  return (
    <div className="divide-y divide-gray-50">
      {conversations.map((c) => (
        <div key={c.id} onClick={() => router.push(`/vendor/support/chat/${c.id}`)} className="group p-10 flex items-center justify-between hover:bg-gray-50/50 transition-all cursor-pointer border-l-[6px] border-transparent hover:border-[#A4143D]">
          <div className="flex items-center gap-8">
            <div className="w-18 h-18 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-400 transition-colors shadow-inner shadow-gray-100">
              <User size={32} />
            </div>
            <div className="space-y-1.5">
              <p className="font-black text-gray-900 text-xl tracking-tight leading-none">{c.user.firstName} {c.user.lastName}</p>
              <p className="text-sm font-bold text-gray-500 italic truncate max-w-xs">{c.messages?.[0]?.content || "Sync pending..."}</p>
            </div>
          </div>
          <div className="bg-gray-100 text-gray-400 w-14 h-14 rounded-[1.4rem] flex items-center justify-center group-hover:bg-[#A4143D] group-hover:text-white transition-all shadow-sm">
            <Send size={20} className="-rotate-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button onClick={onClick} className={`px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${active ? 'bg-white shadow-2xl text-[#A4143D]' : 'text-gray-400 hover:text-gray-600'}`}>
      <Icon size={16} /> {label}
    </button>
  );
}

function LoadingView() {
  return (
    <div className="py-48 flex flex-col items-center gap-6">
      <Loader2 className="animate-spin text-[#A4143D]" size={48} />
      <p className="text-[11px] font-black text-gray-400 tracking-[0.5em] uppercase">Synchronizing_Registry</p>
    </div>
  );
}

function EmptyRegistry({ label }: { label: string }) {
  return (
    <div className="py-48 flex flex-col items-center justify-center text-gray-200 gap-6 w-full">
      <Inbox size={48} strokeWidth={1} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">{label}</p>
    </div>
  );
}

function AdminTicketModal({ form, setForm, onClose, onSubmit }: any) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[150] p-4">
      <div className="bg-white rounded-[4rem] p-16 w-full max-w-xl relative shadow-2xl animate-in zoom-in-95">
        <button onClick={onClose} className="absolute right-12 top-12 p-4 bg-gray-50 rounded-2xl transition-all"><X size={24} /></button>
        <div className="mb-12"><h2 className="text-4xl font-black mb-2 text-gray-900 tracking-tighter italic uppercase leading-none">Admin_Sync</h2></div>
        <form onSubmit={onSubmit} className="space-y-6">
          <input className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-[2rem] font-bold text-sm outline-none focus:bg-white focus:border-[#A4143D]/10 transition-all uppercase" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          <button className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-[#A4143D] transition-all">Transmit_Case</button>
        </form>
      </div>
    </div>
  );
}