'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, FileText, RefreshCw, HelpCircle, Loader2, X, Send } from 'lucide-react';
import { api } from '@/src/lib/axios';

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
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets");
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
      alert("Ticket submitted successfully!");
    } catch (err) {
      alert("Failed to submit ticket");
    }
  };

  // --- Backend Linked Actions ---

  const handleLiveChat = () => {
    // Marketplace logic: Chat is order-based. 
    // We send them to orders to pick a vendor to chat with.
    router.push('/dashboard/orders?intent=chat');
  };

  const handleReturns = () => {
    // Redirects to orders where they can select a 'Delivered' item to return
    router.push('/dashboard/orders?intent=return');
  };

  const handleFAQ = async () => {
    // If you have a dedicated FAQ page:
    router.push('/dashboard/support/faq');
    
    // OR if you want to just fetch them:
    // const res = await api.get('/user/support/faqs');
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="max-w-4xl space-y-10 p-4 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Support Center</h1>
        <p className="text-gray-500 mt-1 font-medium">How can we help you today?</p>
      </header>

      {/* Quick Actions Grid - NOW LINKED */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionCard 
          icon={MessageCircle} 
          label="Live Chat" 
          color="text-blue-500" 
          onClick={handleLiveChat} 
        />
        <ActionCard 
          icon={FileText} 
          label="Open Ticket" 
          color="text-orange-500" 
          onClick={() => setIsModalOpen(true)} 
        />
        <ActionCard 
          icon={RefreshCw} 
          label="Returns" 
          color="text-emerald-500" 
          onClick={handleReturns} 
        />
        <ActionCard 
          icon={HelpCircle} 
          label="FAQ" 
          color="text-purple-500" 
          onClick={handleFAQ} 
        />
      </div>

      {/* Ticket History */}
      <section className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-bold text-gray-900">Recent Support Requests</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {tickets.length} Tickets
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50/50">
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Subject</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5 font-mono text-[10px] text-gray-400">
                    {t.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-900 text-sm">{t.subject}</td>
                  <td className="px-6 py-5"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-5 text-xs text-gray-500 font-medium">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic text-sm">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal for Opening Ticket */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
              <X size={20} className="text-gray-400" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Describe the Issue</h2>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <input 
                placeholder="Subject (e.g., Refund Request)" required
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              />
              <textarea 
                placeholder="How can we help you?" rows={4} required
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium resize-none"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
              <button className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition shadow-lg shadow-orange-100">
                <Send size={18} /> Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Internal UI Components ---

function ActionCard({ icon: Icon, label, color, onClick }: any) {
  return (
    <button 
      onClick={onClick} 
      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-orange-500 hover:shadow-xl hover:shadow-orange-50/50 transition-all text-center group"
    >
      <div className={`w-12 h-12 ${color} bg-current/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <p className="text-sm font-bold text-gray-900 tracking-tight">{label}</p>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    RESOLVED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    OPEN: 'bg-blue-50 text-blue-600 border-blue-100',
    IN_PROGRESS: 'bg-orange-50 text-orange-600 border-orange-100',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${styles[status] || styles.OPEN}`}>
      {status.replace('_', ' ')}
    </span>
  );
}