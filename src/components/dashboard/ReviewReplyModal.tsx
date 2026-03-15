'use client';
import { X, Send, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/src/lib/axios';

export default function ReviewReplyModal({ isOpen, onClose, review, onRefresh }: any) {
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reply.trim()) return;
    
    setIsSubmitting(true);
    try {
      await api.patch(`/vendor/reviews/${review.id}/reply`, { reply });
      onRefresh(); // Refresh the list to show the new reply
      onClose();
      setReply('');
    } catch (e) {
      alert("Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-1">Public Response</p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Reply to Review</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Original Review Context */}
          <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Customer Feedback:</p>
            <p className="text-sm font-medium text-slate-600 italic">"{review.comment}"</p>
          </div>

          {/* Text Area */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Official Reply</label>
            <textarea 
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Thank the customer or address their concerns..."
              className="w-full h-40 p-6 bg-slate-100 border-2 border-transparent focus:border-orange-500 rounded-[2rem] text-sm font-bold text-slate-900 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <AlertCircle size={14} />
            <p className="text-[9px] font-bold uppercase tracking-wider">This reply will be visible to all customers on the product page.</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !reply.trim()}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-orange-600 disabled:bg-slate-200 transition-all shadow-xl shadow-slate-200"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} strokeWidth={3} />}
            Publish Reply
          </button>
        </div>
      </div>
    </div>
  );
}