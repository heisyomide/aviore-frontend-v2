'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  Send,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Store,
  Wifi,
  WifiOff,
  MessageSquare,
} from 'lucide-react';
import { api } from '@/src/lib/axios';
import { io, Socket } from 'socket.io-client';

type MessageType = {
  id?: string;
  tempId?: string;
  content: string;
  senderRole: 'USER' | 'VENDOR';
  createdAt: string;
  conversationId?: string;
};

export default function OrderChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = typeof params?.id === 'string' ? params.id : '';
  const vendorId = searchParams.get('vendorId');

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  /**
   * SOCKET STATUS
   */
  const [socketConnected, setSocketConnected] = useState(false);

  /**
   * VENDOR STATUS
   */
  const [vendorOnline, setVendorOnline] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const conversationRef = useRef<any>(null);

  /**
   * KEEP REF SYNCED
   */
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  /**
   * CHAT INITIALIZATION
   */
  useEffect(() => {
    if (!orderId) return;

    let mounted = true;

    const initializeChat = async () => {
      try {
        /**
         * FETCH EXISTING CONVERSATION
         */
        const res = await api.get(`/user/support/chat/${orderId}`);

        if (!mounted) return;

        if (res.data) {
          setConversation(res.data);
          setMessages(res.data.messages || []);
        }

        /**
         * SOCKET INIT
         */
        const socket = io(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`,
          {
            auth: {
              token: localStorage.getItem('token'),
            },
            transports: ['websocket'],
          },
        );

        socketRef.current = socket;

        /**
         * SOCKET CONNECT
         */
        socket.on('connect', () => {
          if (!mounted) return;

          setSocketConnected(true);

          /**
           * JOIN ROOM
           */
          if (res.data?.id) {
            socket.emit('joinConversation', res.data.id);
          }

          /**
           * CHECK VENDOR PRESENCE
           */
          if (vendorId) {
            socket.emit('checkVendorStatus', vendorId);
          }
        });

        /**
         * VENDOR STATUS LISTENER
         */
        socket.on('vendorStatus', (data) => {
          if (!mounted) return;
          setVendorOnline(data.online);
        });

        /**
         * NEW MESSAGE
         */
        socket.on('newMessage', (msg: MessageType) => {
          if (!mounted) return;

          /**
           * FIRST MESSAGE CONVERSATION CREATION
           */
          if (
            msg.conversationId &&
            !conversationRef.current?.id
          ) {
            setConversation({
              id: msg.conversationId,
            });

            socket.emit(
              'joinConversation',
              msg.conversationId,
            );
          }

          setMessages((prev) => {
            const exists = prev.some(
              (m) =>
                m.id === msg.id ||
                (m.tempId &&
                  m.tempId === msg.tempId),
            );

            if (exists) return prev;

            return [...prev, msg];
          });
        });

        /**
         * SOCKET DISCONNECT
         */
        socket.on('disconnect', () => {
          if (!mounted) return;

          setSocketConnected(false);
          setVendorOnline(false);
        });
      } catch (error) {
        console.log('Chat initialization failed');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeChat();

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
    };
  }, [orderId, vendorId]);

  /**
   * SEND MESSAGE
   */
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const content = input.trim();

    if (!content || !socketRef.current) return;

    const tempId = Date.now().toString();

    /**
     * OPTIMISTIC UI
     */
    setMessages((prev) => [
      ...prev,
      {
        tempId,
        content,
        senderRole: 'USER',
        createdAt: new Date().toISOString(),
      },
    ]);

    setInput('');

    /**
     * SEND TO SERVER
     */
    socketRef.current.emit('sendMessage', {
      conversationId: conversation?.id || null,
      orderId,
      vendorId,
      content,
      senderRole: 'USER',
      tempId,
    });
  };

  /**
   * AUTO SCROLL
   */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden relative">
      <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="p-3 bg-gray-50 rounded-2xl hover:bg-[#f26522] hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Store
                size={14}
                className="text-[#f26522]"
              />

              <h2 className="font-black italic text-gray-900 uppercase tracking-tighter text-lg">
                Merchant Support
              </h2>

              {vendorOnline ? (
                <Wifi
                  size={14}
                  className="text-emerald-500"
                />
              ) : (
                <WifiOff
                  size={14}
                  className="text-red-500"
                />
              )}
            </div>

            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Ref_#
              {orderId
                .slice(-8)
                .toUpperCase()}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
          <ShieldCheck
            size={16}
            className="text-emerald-600"
          />
          <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none">
            Avenue Secure Chat
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fafafa]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
            <MessageSquare
              size={48}
              strokeWidth={1}
            />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
              Start conversation
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe =
            msg.senderRole === 'USER';

          return (
            <div
              key={
                msg.id ||
                msg.tempId ||
                i
              }
              className={`flex ${
                isMe
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-6 rounded-[2.5rem] text-sm font-bold shadow-sm ${
                  isMe
                    ? 'bg-[#f26522] text-white rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}
              >
                {msg.content}

                <div className="text-[8px] font-black mt-3 opacity-40 uppercase tracking-widest">
                  {new Date(
                    msg.createdAt,
                  ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={scrollRef} />
      </div>

      <footer className="p-8 bg-white border-t border-gray-50">
        <form
          onSubmit={sendMessage}
          className="flex gap-4 items-center bg-gray-50 p-2 rounded-[2.2rem] border border-gray-100"
        >
          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder={
              vendorOnline
                ? 'Merchant is online...'
                : 'Merchant offline — message will be delivered'
            }
            className="flex-1 bg-transparent p-4 outline-none font-bold text-xs uppercase text-gray-700"
          />

          <button
            type="submit"
            disabled={
              !socketConnected ||
              !input.trim()
            }
            className="p-4 bg-gray-900 text-white rounded-full hover:bg-[#f26522] disabled:opacity-20"
          >
            <Send
              size={20}
              className="-rotate-12"
            />
          </button>
        </form>
      </footer>
    </div>
  );
}

function LoaderComponent() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <Loader2
        className="animate-spin text-[#f26522]"
        size={32}
      />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        Restoring Chat...
      </p>
    </div>
  );
}