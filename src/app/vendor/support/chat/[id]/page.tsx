'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Loader2, ShieldCheck, Package, MessageSquare, CreditCard, User, ShoppingBag } from 'lucide-react';
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

  const orderRefRaw = conversation?.order?.id || '';
  const orderRefFormatted = orderRefRaw ? orderRefRaw.slice(-8).toUpperCase() : 'UNKNOWN';

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] max-w-7xl mx-auto gap-4 p-4 animate-fadeIn">
      
      {/* MAIN CHAT NODE */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-50 to-white border border-slate-200 overflow-hidden relative rounded-2xl shadow-sm">
        
        {/* DARK LUXURY HEADER */}
        <header className="px-6 py-5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-between z-20 shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A4143D]">
                Customer
              </p>
              <h2 className="font-bold text-white text-base leading-tight">
                {conversation?.user?.firstName || 'Guest'} {conversation?.user?.lastName || 'Client'}
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Order Support Chat
              </span>
            </div>
          </div>
          
          <div className="hidden md:block">
             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md">
                <ShieldCheck size={14} className="text-[#A4143D]" />
                <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider leading-none">AVIORÈ Security Secured</span>
             </div>
          </div>
        </header>

        {/* CONNECTION BANNER STATE STRIP */}
        <div className={`px-6 py-2 border-b text-xs font-semibold flex items-center gap-2 transition-all duration-300 ${
          isOnline 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {isOnline ? (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connected Securely</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Reconnecting...</span>
            </>
          )}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          
          {/* ORDER IDENTIFIER BADGE */}
          <div className="flex justify-center mb-2">
            <span className="bg-[#A4143D]/10 text-[#A4143D] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              Order #{orderRefFormatted}
            </span>
          </div>

          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400 space-y-2">
              <MessageSquare size={36} className="text-slate-300 animate-pulse" strokeWidth={1.5} />
              <h3 className="text-sm font-bold text-slate-700">No messages yet</h3>
              <p className="text-xs max-w-xs">Start a conversation regarding this order.</p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.senderRole === 'VENDOR';
            return (
              <div key={msg.id || msg.tempId || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slideUp`}>
                <div className="max-w-[75%] space-y-1">
                  
                  {/* MESSAGE METADATA SENDER IDENTITY */}
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span>{isMe ? 'You' : 'Customer'}</span>
                    <span>•</span>
                    <span>{format(new Date(msg.createdAt), 'hh:mm a')}</span>
                  </div>

                  {/* MESSAGE CONTENT CARD CONTAINER */}
                  <div className={`px-5 py-3 shadow-sm text-[14px] leading-relaxed font-normal ${
                    isMe 
                      ? 'bg-gradient-to-r from-[#A4143D] to-[#D81B60] text-white rounded-[24px] rounded-br-[6px]' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-[24px] rounded-bl-[6px]'
                  }`}>
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>

                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Transmission Input Area */}
        <footer className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="flex gap-3 items-center bg-white p-1.5 rounded-2xl border border-slate-200 focus-within:border-slate-300 focus-within:shadow-sm transition-all">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isOnline ? "Type your message here..." : "System offline — waiting for dynamic authorization..."}
              disabled={!isOnline}
              className="flex-1 bg-transparent px-3 py-2 outline-none font-medium text-[13px] text-slate-800 placeholder-slate-400"
            />
            <button 
              type="submit"
              disabled={!isOnline || !input.trim()}
              className="p-3 bg-slate-900 text-white rounded-xl hover:bg-[#A4143D] transition-all disabled:opacity-20 shrink-0 shadow-sm"
            >
              <Send size={14} className="text-white" />
            </button>
          </form>
        </footer>
      </div>

      {/* CONTEXT SIDEBAR UPGRADE */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Package size={16} className="text-[#A4143D]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Order Summary</span>
          </div>

          <div className="space-y-3">
            
            {/* CARD 1: ORDER REFERENCE */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Order Reference</p>
              <p className="text-xs font-mono font-bold text-slate-800 uppercase">
                #{orderRefRaw ? orderRefRaw.toUpperCase() : 'SYNCING'}
              </p>
            </div>
            
            {/* CARD 2: ORDER STATUS */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Order Status</p>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                  {conversation?.order?.status || "Processing"}
                </p>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
            </div>

            {/* CARD 3: CUSTOMER NAME */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-slate-200/60 rounded-lg text-slate-600">
                <User size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Customer Name</p>
                <p className="text-xs font-bold text-slate-800">
                  {conversation?.user?.firstName || 'Guest'} {conversation?.user?.lastName || 'Client'}
                </p>
              </div>
            </div>

            {/* CARD 4: TOTAL AMOUNT */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-slate-200/60 rounded-lg text-slate-600">
                <CreditCard size={14} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Amount</p>
                <p className="text-xs font-bold text-slate-900">
                  {conversation?.order?.totalAmount 
                    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(conversation.order.totalAmount)
                    : '₦0.00'
                  }
                </p>
              </div>
            </div>

            {/* CARD 5: ITEMS PURCHASED */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/40 pb-1">
                <ShoppingBag size={12} />
                <span>Items Purchased</span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {conversation?.order?.items && conversation.order.items.length > 0 ? (
                  conversation.order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start gap-2 text-slate-700">
                      <span className="font-medium line-clamp-1">{item.product?.name || 'Luxury Marketplace Item'}</span>
                      <span className="font-bold text-slate-400 shrink-0">x{item.quantity || 1}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-[11px]">No itemized details attached</p>
                )}
              </div>
            </div>

            <button 
              onClick={() => conversation?.order?.id && router.push(`/vendor/orders/${conversation.order.id}`)}
              className="w-full mt-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold tracking-wide hover:bg-[#A4143D] transition-all shadow-sm active:scale-[0.99]"
            >
              Open Workspace Record
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
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Syncing Secure Vault...</p>
    </div>
  );
}