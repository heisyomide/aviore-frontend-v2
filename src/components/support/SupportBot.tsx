"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ArrowLeft, Sparkles, ShieldCheck, AlertCircle } from "lucide-react";

interface SupportOption {
  id: string;
  question: string;
  answer: string;
}

const SUPPORT_DATABASE: SupportOption[] = [
  {
    id: "login_fail",
    question: "🔒 Invalid Credentials / Failed Login",
    answer: "[DIAGNOSTIC]: The authentication layer rejected the submitted payload.\n\n[REMEDY]:\n1. Verify that your email address is spelled correctly (check for accidentally added trailing spaces or typos).\n2. Ensure your password casing matches exactly. Caps Lock should be deactivated.\n3. Note: The system requires exact character synchronization to unlock access hooks."
  },
  {
    id: "no_otp",
    question: "📩 Security Verification & OTP Routing",
    answer: "[SYSTEM NOTICE]: OTP verification pipelines are running diagnostic loops.\n\n[REMEDY]: If your account deployment profile requires a fresh access token sequence, please wait 60–120 seconds for routing nodes to clear, or refresh your registration sequence to request an updated validation string."
  },
  {
    id: "email_taken",
    question: "⚠️ Account Context Conflicts",
    answer: "[DIAGNOSTIC]: This identifier is already registered within our primary database registry.\n\n[REMEDY]: Navigate immediately to the standard Login screen to request account validation. If validation fails repeatedly, re-submit credentials or utilize a different email string."
  },
  {
    id: "vendor_account",
    question: "🏪 Vendor / Merchant Registries",
    answer: "[SYSTEM PROTOCOL]: Vendor status requires active consumer initialization.\n\n[REMEDY]: Create a standard customer platform footprint first. Once authenticated, access your profile control deck and select the Merchant Deployment option to submit an application."
  }
];

export function SupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<SupportOption | null>(null);
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulated AI Typewriter Engine
  useEffect(() => {
    if (!selectedTopic) {
      setDisplayedAnswer("");
      return;
    }

    setIsTyping(true);
    setDisplayedAnswer("");
    let index = 0;
    const fullText = selectedTopic.answer;
    
    const interval = setInterval(() => {
      setDisplayedAnswer((prev) => prev + fullText.charAt(index));
      index++;
      
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 10); // Swift, crisp high-tech typing rhythm

    return () => clearInterval(interval);
  }, [selectedTopic]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedAnswer, isTyping]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased text-zinc-900 selection:bg-[#A4143D]/10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 400 }}
            className="mb-4 w-[330px] sm:w-[350px] h-[450px] bg-white rounded-2xl border border-zinc-200 shadow-xl flex flex-col overflow-hidden"
          >
            {/* Formal Header Section */}
            <header className="bg-zinc-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <ShieldCheck size={13} className="text-[#E4A07A]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight text-zinc-100">Aviore Core Assistant</h3>
                  <p className="text-[9px] text-zinc-400 font-mono tracking-wider uppercase">System Helpdesk // Diagnostic</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsOpen(false); setSelectedTopic(null); }}
                className="text-zinc-400 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-900"
              >
                <X size={15} />
              </button>
            </header>

            {/* Chat Flow Context Window */}
            <div className="grow p-4 overflow-y-auto space-y-4 bg-zinc-50/40">
              {/* Initial Automated Greeting */}
              <div className="flex gap-2 items-start max-w-[90%]">
                <div className="w-5 h-5 rounded bg-zinc-900 text-zinc-100 flex items-center justify-center shrink-0 text-[8px] font-mono font-bold border border-zinc-800">AV</div>
                <div className="bg-white border border-zinc-200/80 p-2.5 rounded-xl rounded-tl-none shadow-xs text-[11px] text-zinc-600 leading-relaxed font-medium">
                  Authentication assistant online. Select the inquiry block that matches your current platform state:
                </div>
              </div>

              {/* Interaction Routing Matrix */}
              {!selectedTopic ? (
                <div className="space-y-1.5 pt-1 pl-7">
                  {SUPPORT_DATABASE.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedTopic(option)}
                      className="w-full text-left bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 px-3 py-2.5 rounded-lg shadow-2xs text-[11px] font-semibold text-zinc-700 transition-all active:scale-[0.99] block"
                    >
                      {option.question}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {/* Selected Inquiry Node */}
                  <div className="flex gap-2 items-start max-w-[90%] ml-auto justify-end">
                    <div className="bg-zinc-900 text-zinc-100 p-2.5 rounded-xl rounded-tr-none shadow-xs text-[11px] font-medium leading-relaxed">
                      {selectedTopic.question}
                    </div>
                  </div>

                  {/* Diagnostic Log Streaming Output */}
                  <div className="flex gap-2 items-start max-w-[90%] pt-1">
                    <div className="w-5 h-5 rounded bg-zinc-900 text-zinc-100 flex items-center justify-center shrink-0 text-[8px] font-mono font-bold border border-zinc-800">AV</div>
                    <div className="bg-white border border-zinc-200/80 p-2.5 rounded-xl rounded-tl-none shadow-xs text-[11px] text-zinc-600 font-mono whitespace-pre-line leading-relaxed min-h-[40px] relative">
                      {displayedAnswer}
                      {isTyping && (
                        <span className="inline-block w-1.5 h-3 ml-1 bg-zinc-400 animate-pulse vertical-middle" />
                      )}
                    </div>
                  </div>
                </>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Formal Footer Actions Panel */}
            <footer className="p-2.5 bg-white border-t border-zinc-200 flex items-center justify-between shrink-0">
              {selectedTopic ? (
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-700 hover:text-zinc-950 transition-colors bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-2.5 py-1.5 rounded-md"
                >
                  <ArrowLeft size={11} />
                  <span>Return to Menu</span>
                </button>
              ) : (
                <div className="text-[9px] text-zinc-400 font-mono tracking-wide pl-1 flex items-center gap-1.5">
                  <AlertCircle size={11} className="text-zinc-300" />
                  <span>Status: Isolated Diagnostic Array</span>
                </div>
              )}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button Core Execution Context */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all border outline-none ${
          isOpen 
            ? "bg-zinc-950 text-white border-zinc-800 shadow-zinc-950/20" 
            : "bg-zinc-900 text-zinc-100 hover:bg-zinc-950 border-zinc-800 hover:shadow-xl"
        }`}
      >
        {isOpen ? <X size={18} /> : <MessageSquare size={18} />}
      </motion.button>
    </div>
  );
}