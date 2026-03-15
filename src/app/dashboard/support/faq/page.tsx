'use client';
import { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, Search, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { useRouter } from 'next/navigation';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/user/support/faqs');
        setFaqs(res.data);
      } catch (err) {
        console.error("Failed to fetch FAQs");
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 animate-in fade-in duration-500">


      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto text-orange-600">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-gray-500">Find quick answers to common questions about Aviorè.</p>
      </header>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Search by keyword or category..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div 
            key={faq.id} 
            className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden transition-all"
          >
            <button 
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50/50"
            >
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{faq.category}</span>
                <p className="font-bold text-gray-900 mt-1">{faq.question}</p>
              </div>
              <ChevronDown 
                className={`text-gray-400 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="p-6 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-50 bg-gray-50/20">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-gray-400 font-medium italic">
            No matching questions found. Try a different keyword.
          </div>
        )}
      </div>
    </div>
  );
}