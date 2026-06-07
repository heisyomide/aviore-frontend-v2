'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Loader2, ShieldCheck, Package, MessageSquare, Wifi, WifiOff } from 'lucide-react';
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
        
        if (socketRef.current) socketRef.current.disconnect();

        const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
          auth: { token: localStorage.getItem('token') },
          transports: ['polling', 'websocket'],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
          withCredentials: true,
          path: '/socket.io',
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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] max-w-7xl mx-auto gap-4 p-4 animate-fadeIn">
      
      {/* MAIN CHAT NODE */}
      <div className="flex-1 flex flex-col bg-[#F4F7F9] border border-gray-100 overflow-hidden relative rounded-2xl">
        <header className="px-6 py-4 border-b border-gray-200/60 flex items-center justify-between bg-white z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A4143D]">Client Inquiry</span>
                {isOnline ? <Wifi size={12} className="text-emerald-500" /> : <WifiOff size={12} className="text-red-500 animate-pulse" />}
              </div>
              <h2 className="font-bold text-gray-800 text-base leading-tight">
                {conversation?.user?.firstName} {conversation?.user?.lastName}
              </h2>
            </div>
          </div>
          
          <div className="hidden md:block">
             <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider leading-none">Secure Channel</span>
             </div>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#F4F7F9]">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-2">
              <MessageSquare size={36} strokeWidth={1.5} />
              <p className="text-xs font-bold uppercase tracking-wider">Awaiting dynamic transmission</p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.senderRole === 'VENDOR';
            return (
              <div key={msg.id || msg.tempId || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slideUp`}>
                <div className={`max-w-[75%] px-4 py-2.5 shadow-sm text-[14px] leading-relaxed font-normal ${
                  isMe ? 'bg-gray-900 text-white rounded-2xl rounded-tr-sm text-right' : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm text-left border border-gray-200/70'
                }`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                    {format(new Date(msg.createdAt), 'HH:mm')} • {isMe ? 'You' : 'Client'}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Transmission Input */}
        <footer className="p-3 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center bg-[#F4F7F9] px-3 py-1.5 rounded-full border border-gray-200/50 focus-within:border-gray-300 transition-all">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isOnline ? "Type a response..." : "Reconnecting to network registry..."}
              disabled={!isOnline}
              className="flex-1 bg-transparent px-2 py-1.5 outline-none font-medium text-[13px] text-gray-800 placeholder-gray-400"
            />
            <button 
              type="submit"
              disabled={!isOnline || !input.trim()}
              className="p-2.5 bg-gray-900 text-white rounded-full hover:bg-[#A4143D] transition-all disabled:opacity-20 shrink-0"
            >
              <Send size={15} className="text-white" />
            </button>
          </form>
        </footer>
      </div>

      {/* CONTEXT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Package size={16} className="text-[#A4143D]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Order context</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-[#F4F7F9] rounded-xl border border-gray-200/40">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Order Reference</p>
              <p className="text-[11px] font-mono font-bold text-gray-800 break-all leading-tight uppercase">
                #{conversation?.order?.id ? conversation.order.id.slice(-12).toUpperCase() : "SYNCING"}
              </p>
            </div>
            
            <div className="p-4 bg-[#A4143D]/5 rounded-xl border border-[#A4143D]/10 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-[#A4143D] uppercase tracking-wider mb-0.5">Status</p>
                <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                  {conversation?.order?.status || "Processing"}
                </p>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#A4143D]" />
            </div>

            <button 
              onClick={() => conversation?.order?.id && router.push(`/vendor/orders/${conversation.order.id}`)}
              className="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-bold tracking-wide hover:bg-[#A4143D] transition-all shadow-md active:scale-[0.98]"
            >
              View Order Profile
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function LoadingRegistry() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-[#A4143D]" size={32} />
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Syncing Secure Vault...</p>
    </div>
  );
}