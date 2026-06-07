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
const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
  // 🛡️ AUTHENTICATION
  auth: {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  },

  // 🛡️ RENDER-OPTIMIZED TRANSPORTS
  // Starting with polling is CRITICAL for Render's load balancer handshake
  transports: ['polling', 'websocket'], 
  
  // 🛡️ RECONNECTION STRATEGY
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000, 
  
  // 🛡️ SECURITY & CORS
  withCredentials: true,
  
  // 🛡️ GATEWAY SETTINGS
  // This must match the default NestJS path unless you changed it in main.ts
  path: '/socket.io', 
});
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
    <div className="flex flex-col h-screen bg-[#ECE5DD]">
<header className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
  <button
    onClick={() => router.back()}
    className="text-gray-700"
  >
    <ArrowLeft size={22} />
  </button>

  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
    <Store size={18} />
  </div>

  <div className="flex-1">
    <h2 className="font-semibold text-sm">
      Merchant Support
    </h2>

    <p className="text-xs text-gray-500">
      {vendorOnline ? 'Online' : 'Offline'}
    </p>
  </div>

  {vendorOnline ? (
    <Wifi
      size={18}
      className="text-green-500"
    />
  ) : (
    <WifiOff
      size={18}
      className="text-red-500"
    />
  )}
</header>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {messages.length === 0 && (
<div className="h-full flex items-center justify-center">
  <p className="text-sm text-gray-500">
    Start a conversation
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
  className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
    isMe
      ? 'bg-[#DCF8C6] text-gray-900'
      : 'bg-white text-gray-900'
  }`}
>
                {msg.content}

                <div className="text-[10px] text-right text-gray-500 mt-1">
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

    <footer className="bg-white border-t p-3">
  <form
    onSubmit={sendMessage}
    className="flex items-center gap-2"
  >
    <input
      value={input}
      onChange={(e) =>
        setInput(e.target.value)
      }
      placeholder={
        vendorOnline
          ? 'Type a message...'
          : 'Vendor offline...'
      }
      className="
        flex-1
        border
        border-gray-300
        rounded-full
        px-4
        py-3
        outline-none
        text-sm
        bg-white
      "
    />

    <button
      type="submit"
      disabled={
        !socketConnected ||
        !input.trim()
      }
      className="
        w-12
        h-12
        rounded-full
        bg-green-500
        text-white
        flex
        items-center
        justify-center
        disabled:opacity-40
      "
    >
      <Send size={18} />
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