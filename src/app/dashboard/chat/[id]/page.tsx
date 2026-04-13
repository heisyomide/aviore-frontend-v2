'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Loader2, ShieldCheck, Store, Wifi, WifiOff, MessageSquare } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { io, Socket } from 'socket.io-client';

export default function OrderChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = typeof params?.id === 'string' ? params.id : '';
  const vendorId = searchParams.get('vendorId');

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // --- Initialization Logic ---
  useEffect(() => {
    if (!orderId) return;
    let isMounted = true;

    const initChatNode = async () => {
      try {
        // 1. Fetch Manifest
        const res = await api.get(`/user/support/chat/${orderId}`);
        if (!isMounted) return;

        if (res.data) {
          setConversation(res.data);
          setMessages(res.data.messages || []);
        }

        // 2. Socket Handshake
const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
  auth: { token: localStorage.getItem('token') },
  transports: ['polling', 'websocket'], // 🔄 Added polling as fallback
  withCredentials: true,
});

        socketRef.current = socket;

        socket.on('connect', () => {
          if (!isMounted) return;
          setIsOnline(true);
          // If record exists, join the room immediately
          if (res.data?.id) socket.emit('joinConversation', res.data.id);
        });

        socket.on('newMessage', (msg: any) => {
          if (!isMounted) return;

          // CRITICAL FIX: If this is the first message, capture the new Conversation ID
          // This ensures that if the user reloads, the GET request finds the record.
          if (msg.conversationId && !conversation?.id) {
            setConversation({ id: msg.conversationId });
            // Join the newly created room so future messages work
            socket.emit('joinConversation', msg.conversationId);
          }

          setMessages((prev) => {
            const exists = prev.some(m => m.id === msg.id || (m.tempId && m.tempId === msg.tempId));
            return exists ? prev : [...prev, msg];
          });
        });

        socket.on('disconnect', () => isMounted && setIsOnline(false));

      } catch (err) {
        console.log("Entering Virtual Session...");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initChatNode();
    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [orderId]);

  // --- Send Protocol ---
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || !socketRef.current) return;

    const tempId = Date.now().toString();
    
    // 1. Optimistic Update
    setMessages(prev => [...prev, { 
      tempId, 
      content, 
      senderRole: 'USER', 
      createdAt: new Date().toISOString() 
    }]);
    setInput('');

    // 2. Transmission
    // If conversation.id is null, the backend uses orderId/vendorId to create it.
    socketRef.current.emit('sendMessage', {
      conversationId: conversation?.id || null, 
      orderId, 
      vendorId,
      content,
      senderRole: 'USER',
      tempId
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return <LoaderComponent />;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
      <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-5">
          <button onClick={() => router.back()} className="p-3 bg-gray-50 rounded-2xl hover:bg-[#f26522] hover:text-white transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Store size={14} className="text-[#f26522]" />
              <h2 className="font-black italic text-gray-900 uppercase tracking-tighter text-lg">Merchant Support</h2>
              {isOnline ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-red-500" />}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ref_#{orderId.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none">Avenue_Secure_Node</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fafafa] scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
            <MessageSquare size={48} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Handshake pending first message.</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderRole === 'USER';
          return (
            <div key={msg.id || msg.tempId || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[80%] p-6 rounded-[2.5rem] text-sm font-bold shadow-sm ${isMe ? 'bg-[#f26522] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                {msg.content}
                <div className={`text-[8px] font-black mt-3 opacity-40 uppercase tracking-widest ${isMe ? 'text-white' : 'text-gray-400'}`}>
                   {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

     <footer className="p-8 bg-white border-t border-gray-50">
  <form onSubmit={sendMessage} className="flex gap-4 items-center bg-gray-50 p-2 rounded-[2.2rem] border border-gray-100 focus-within:border-[#f26522] transition-all">
    <input 
      value={input}
      onChange={(e) => setInput(e.target.value)}
      // 🛡️ Remove the disabled={!isOnline} so users can always type
      placeholder="Communicate with merchant..." 
      className="flex-1 bg-transparent p-4 outline-none font-bold text-xs uppercase text-gray-700"
    />
    <button 
      type="submit" 
      // 🛡️ Only disable if there is no text
      disabled={!input.trim()} 
      className="p-4 bg-gray-900 text-white rounded-full hover:bg-[#f26522] shadow-xl disabled:opacity-20 transition-all"
    >
      <Send size={20} className="-rotate-12" />
    </button>
  </form>
</footer>
    </div>
  );
}

function LoaderComponent() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <Loader2 className="animate-spin text-[#f26522]" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Restoring Chat...</p>
    </div>
  );
}