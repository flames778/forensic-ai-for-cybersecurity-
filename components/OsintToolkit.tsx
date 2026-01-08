
import React, { useState } from 'react';
import { Search, Globe, ShieldAlert, Cpu, Database, User, Mail, Activity, Loader2, ChevronRight, ExternalLink } from 'lucide-react';
import { performOsintTrace } from '../services/geminiService';
import QuickReply from './QuickReply';

const OsintToolkit: React.FC = () => {
  const [query, setQuery] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [grounding, setGrounding] = useState<Array<{ title: string; uri: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrace = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setReport(null);
    setGrounding([]);
    try {
      // Updated call to performOsintTrace which now returns { text, grounding }
      const result = await performOsintTrace(query);
      setReport(result.text);
      setGrounding(result.grounding);
    } catch (err) {
      setReport("Evans, the trace failed. The target might be behind a hardened firewall or I lost connection to the OSINT nodes.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Globe className="text-blue-500" />
            OSINT Trace Engine
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Real-time footprint scraping and breach cross-referencing for Evans.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 font-mono">
            SCRAPERS: ACTIVE
          </div>
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-mono">
            VPN: TUNNELLED
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Target Parameters</h3>
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-3 top-3 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Email, Username, or Phone..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'breach', label: 'Breach DB', icon: <Database size={14}/> },
                  { id: 'social', label: 'Socials', icon: <User size={14}/> },
                  { id: 'dns', label: 'DNS/WHOIS', icon: <Globe size={14}/> },
                  { id: 'dark', label: 'Dark Web', icon: <Activity size={14}/> },
                ].map(tool => (
                  <button key={tool.id} className="flex items-center gap-2 p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl text-[10px] text-zinc-400 font-bold transition-colors border border-transparent hover:border-zinc-700">
                    {tool.icon}
                    {tool.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleTrace}
                disabled={isSearching || !query.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
              >
                {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Cpu size={18} />}
                Initiate Deep Trace
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Live Threat Feed</h3>
            <div className="space-y-3">
              {[
                { time: '12:04', msg: 'DNS Leak detected at 1.2.3.4', level: 'high' },
                { time: '11:58', msg: 'Tor Node synchronized', level: 'info' },
                { time: '11:42', msg: 'Scanning breach archives...', level: 'warn' },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-[10px] font-mono">
                  <span className="text-zinc-600">{log.time}</span>
                  <span className={log.level === 'high' ? 'text-red-400' : log.level === 'warn' ? 'text-amber-400' : 'text-blue-400'}>
                    [{log.level.toUpperCase()}] {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[500px] overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isSearching ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Intelligence Report: {query || 'Waiting...'}</span>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            {isSearching ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <Globe className="absolute inset-0 m-auto text-blue-500" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Aggregating Open Source Intel</h4>
                  <p className="text-zinc-500 text-xs">Pinging breach databases and social caches for Evans...</p>
                </div>
              </div>
            ) : report ? (
              <div className="prose prose-invert prose-blue max-w-none">
                <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-2xl mb-6 flex gap-4 items-start">
                  <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">Analyst Note</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, I've pulled every relevant scrap from the clearnet and indexed leaks. Tread carefully with this data."</p>
                  </div>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-6">
                  {report}
                </div>
                
                {/* Display grounding URLs as required by @google/genai guidelines when using googleSearch tool */}
                {grounding && grounding.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-zinc-800/50">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-3 font-mono">Search Grounding References:</p>
                    <div className="flex flex-wrap gap-2">
                      {grounding.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300 transition-colors border border-zinc-700/50"
                        >
                          <ExternalLink size={12} className="text-blue-500" />
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <QuickReply context={`OSINT: ${query}`} />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600">
                <Globe size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">No Active Trace</p>
                <p className="text-xs mt-1">Input target data in the control panel to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OsintToolkit;
