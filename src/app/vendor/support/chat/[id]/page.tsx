'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Loader2, ShieldCheck, Package, ExternalLink, MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { api } from '@/src/lib/axios';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';

interface Message {
  id?: string;
  tempId?: string;
  content: string;
  senderRole: 'VENDOR' | 'USER';
  createdAt: string;
  conversationId: string;
}

export default function VendorOrderChatPage() {
  const { id: conversationId } = useParams<{ id: string }>();
  const router = useRouter();

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // --- 1. Protocol Initialization ---
  useEffect(() => {
    if (!conversationId) return;
    let isMounted = true;

    const initVendorNode = async () => {
      try {
        const res = await api.get(`/vendor/conversations/${conversationId}`);
        if (!isMounted) return;

        setConversation(res.data);
        setMessages(res.data.messages || []);
        
        // Kill existing socket if re-initializing
        if (socketRef.current) socketRef.current.disconnect();

        const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
          auth: { token: localStorage.getItem('token') },
          transports: ['websocket'],
          reconnection: true
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          if (isMounted) {
            setIsOnline(true);
            socket.emit('joinConversation', conversationId);
          }
        });

        socket.on('disconnect', () => isMounted && setIsOnline(false));

        socket.on('newMessage', (msg: Message) => {
          if (isMounted && msg.conversationId === conversationId) {
            setMessages((prev) => {
              // Deduplicate optimistic messages
              const exists = prev.some(m => m.id === msg.id || (m.tempId && m.tempId === msg.tempId));
              return exists ? prev : [...prev, msg];
            });
          }
        });

      } catch (err) {
        console.error("Registry Access Denied", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initVendorNode();
    
    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 2. Transmission Protocol ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || !isOnline || !socketRef.current) return;

    const tempId = Date.now().toString();
    
    // Optimistic Update: Vendor sees their message immediately
    const optimisticMsg: Message = {
      tempId,
      content,
      senderRole: 'VENDOR',
      createdAt: new Date().toISOString(),
      conversationId: conversationId as string
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setInput('');

    socketRef.current.emit('sendMessage', {
      conversationId,
      content,
      senderRole: 'VENDOR',
      tempId
    });
  };

  if (loading) return <LoadingRegistry />;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] max-w-7xl mx-auto gap-6 p-4 animate-in fade-in duration-500">
      
      {/* MAIN CHAT NODE */}
      <div className="flex-1 flex flex-col bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
        <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-5">
            <button onClick={() => router.back()} className="p-3 bg-gray-50 rounded-2xl hover:bg-[#A4143D] hover:text-white transition-all">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#A4143D]">Client_Inquiry</span>
                {isOnline ? <Wifi size={12} className="text-emerald-500" /> : <WifiOff size={12} className="text-red-500 animate-pulse" />}
              </div>
              <h2 className="font-black italic text-gray-900 text-2xl tracking-tighter uppercase leading-none">
                {conversation?.user?.firstName} {conversation?.user?.lastName}
              </h2>
            </div>
          </div>
          
          <div className="hidden md:block">
             <div className="flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none">Registry_Secure</span>
             </div>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fafafa] scrollbar-hide">
          {messages.map((msg, i) => {
            const isMe = msg.senderRole === 'VENDOR';
            return (
              <div key={msg.id || msg.tempId || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[75%] p-6 rounded-[2.5rem] text-sm font-bold shadow-sm leading-relaxed ${
                  isMe ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  {msg.content}
                  <p className={`text-[8px] font-black mt-3 opacity-40 uppercase tracking-widest ${isMe ? 'text-white' : 'text-gray-400'}`}>
                    {format(new Date(msg.createdAt), 'HH:mm')} • {isMe ? 'Store_Admin' : 'Customer'}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Transmission Input */}
        <footer className="p-8 bg-white border-t border-gray-50">
          <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-gray-50 p-2 rounded-[2.2rem] border border-gray-100 focus-within:border-[#A4143D] transition-all">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isOnline ? "Transmit response..." : "Reconnecting to Registry..."}
              disabled={!isOnline}
              className="flex-1 bg-transparent p-4 outline-none font-bold text-xs uppercase text-gray-700 placeholder:text-gray-300"
            />
            <button 
              type="submit"
              disabled={!isOnline || !input.trim()}
              className="p-4 bg-gray-900 text-white rounded-full hover:bg-[#A4143D] shadow-xl active:scale-90 transition-all disabled:opacity-20"
            >
              <Send size={20} className="-rotate-12" />
            </button>
          </form>
        </footer>
      </div>

      {/* CONTEXT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-80 gap-6">
        <div className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <Package size={18} className="text-[#A4143D]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order_Context</span>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Reference</p>
              <p className="text-[10px] font-black text-gray-900 break-all italic leading-tight uppercase tracking-tighter">
                {conversation?.order?.id || "Syncing..."}
              </p>
            </div>
            
            <div className="p-6 bg-[#A4143D]/5 rounded-[2.5rem] border border-[#A4143D]/10 text-center">
              <p className="text-[9px] font-black text-[#A4143D] uppercase tracking-widest mb-1">Status</p>
              <p className="text-xs font-black text-gray-900 uppercase italic">
                {conversation?.order?.status || "Awaiting_Handshake"}
              </p>
            </div>

            <button 
              onClick={() => conversation?.order?.id && router.push(`/vendor/orders/${conversation.order.id}`)}
              className="w-full py-6 bg-gray-900 text-white rounded-[2rem] text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#A4143D] transition-all shadow-xl"
            >
              Open Order Details
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function LoadingRegistry() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#A4143D]" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Restoring Encrypted Registry...</p>
    </div>
  );
}