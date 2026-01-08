
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Loader2, ExternalLink, Paperclip, ShieldAlert } from 'lucide-react';
import { Message, ModuleType } from '../types';
import { chatWithForensix } from '../services/geminiService';

interface ChatInterfaceProps {
  activeModule: ModuleType;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeModule }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Yo Evans! I'm synchronized and ready. What's our primary objective for today? I've got the scanners warmed up and the network sensors on high alert. We're operating in the Hub right now, but I'm ready to pivot to any tactical module when you are.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: (m.role === 'assistant' ? 'model' : 'user') as 'model' | 'user',
        parts: [{ text: m.content }]
      }));

      const result = await chatWithForensix(input, history, activeModule);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text,
        timestamp: new Date(),
        groundingUrls: result.grounding
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: "Evans, I've lost synchronization with the core servers. The uplink is non-responsive. Check your connection or the API key buffer.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto bg-[#0a0a0b]/50 backdrop-blur-sm">
      {/* Active Context Bar */}
      <div className="px-6 py-2 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/20">
        <div className="flex items-center gap-2">
          <ShieldAlert size={12} className="text-blue-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
            OPERATIONAL CONTEXT: <span className="text-blue-400">{activeModule.toUpperCase()}</span>
          </span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-6 space-y-6 overflow-y-auto scroll-smooth custom-scrollbar"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-zinc-900 border border-zinc-800 text-slate-200'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Terminal size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Forensix Intel</span>
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {msg.content}
              </p>
              
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-4 pt-4 border-t border-zinc-800/50">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2 font-mono">Tactical Reference Map:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md text-[11px] text-zinc-300 transition-colors border border-zinc-700/50"
                      >
                        <ExternalLink size={10} />
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <span className="block mt-2 text-[9px] opacity-40 font-mono text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
              <Loader2 className="animate-spin text-blue-500" size={18} />
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Forensix is crunching data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-zinc-800 bg-[#0a0a0b]/80">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
          <div className="relative flex items-center gap-2 bg-[#0d0d0f] border border-zinc-800 rounded-2xl p-2 focus-within:border-blue-600/50 transition-all">
            <button className="p-2 text-zinc-500 hover:text-blue-400 transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Deploy command, Evans..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-700 text-sm font-mono h-10"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-xl transition-all ${
                input.trim() && !isLoading 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500' 
                  : 'text-zinc-600'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-4 font-mono uppercase tracking-widest">
          Secure Tunnel: AES-256 E2EE Link Established
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
