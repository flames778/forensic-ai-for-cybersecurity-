
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Loader2, User, Cpu, ExternalLink } from 'lucide-react';
import { chatWithForensix } from '../services/geminiService';

interface QuickReplyProps {
  context: string;
  initialReport?: string;
  placeholder?: string;
}

interface MiniMessage {
  role: 'user' | 'model';
  text: string;
  groundingUrls?: Array<{ title: string; uri: string }>;
}

const QuickReply: React.FC<QuickReplyProps> = ({ context, initialReport, placeholder = "Command Forensix..." }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MiniMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userText = input;
    const newMessages: MiniMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setIsProcessing(true);

    try {
      // Build history for the API call
      // We prepend the initial report as context so the AI knows what we are talking about
      const history = [
        { 
          role: 'user' as const, 
          parts: [{ text: `CONTEXT FOR INVESTIGATION: ${context}. PREVIOUS ANALYSIS REPORT: ${initialReport || 'No report yet'}.` }] 
        },
        {
          role: 'model' as const,
          parts: [{ text: "Acknowledged, Evans. Context synchronized. Standing by for commands." }]
        },
        ...newMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      ];

      const result = await chatWithForensix(userText, history.slice(0, -1)); // send current text + previous history
      setMessages(prev => [...prev, { role: 'model', text: result.text, groundingUrls: result.grounding }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Evans, I lost the uplink. Mainframe is non-responsive. Check your connection." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3 bg-black/40 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Mini Chat Header */}
      <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-blue-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sub-Terminal: {context}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse" />
        </div>
      </div>

      {/* Mini Chat Messages */}
      <div 
        ref={scrollRef}
        className="max-h-60 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.length === 0 && !isProcessing && (
          <p className="text-[10px] text-zinc-600 font-mono italic text-center py-2">
            No active sub-commands. Awaiting Evans' input...
          </p>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-1.5 mb-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'user' ? <User size={10} className="text-zinc-500" /> : <Cpu size={10} className="text-blue-500" />}
              <span className="text-[8px] font-bold uppercase tracking-tighter text-zinc-600">
                {msg.role === 'user' ? 'Evans' : 'Forensix'}
              </span>
            </div>
            <div className={`px-3 py-2 rounded-2xl text-[11px] font-mono leading-relaxed max-w-[90%] ${
              msg.role === 'user' 
                ? 'bg-blue-600/20 text-blue-100 border border-blue-600/30' 
                : 'bg-zinc-800/50 text-zinc-300 border border-zinc-700/50'
            }`}>
              {msg.text}

              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-zinc-700/50">
                  <div className="flex flex-wrap gap-1">
                    {msg.groundingUrls.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-700 rounded text-[8px] text-zinc-300 hover:bg-zinc-600 transition-colors"
                      >
                        <ExternalLink size={8} className="text-blue-400" />
                        {link.title.length > 15 ? link.title.substring(0, 15) + '...' : link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex flex-col items-start animate-pulse">
             <div className="flex items-center gap-1.5 mb-1">
              <Cpu size={10} className="text-blue-500" />
              <span className="text-[8px] font-bold uppercase tracking-tighter text-zinc-600">Forensix</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin text-blue-500" />
              <span className="text-[10px] font-mono text-zinc-500">Processing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-zinc-900/30 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 bg-black/40 border border-zinc-800 rounded-xl px-3 py-1.5 group focus-within:border-blue-500/50 transition-all">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isProcessing}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] font-mono text-zinc-200 placeholder-zinc-700 h-7"
          />
          <button 
            onClick={handleSend}
            disabled={isProcessing || !input.trim()}
            className="p-1.5 text-zinc-500 hover:text-blue-400 disabled:opacity-30 transition-all"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickReply;
