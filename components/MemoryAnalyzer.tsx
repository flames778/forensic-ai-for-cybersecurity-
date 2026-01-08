
import React, { useState } from 'react';
import { Cpu, ShieldAlert, Loader2, Activity, Terminal, Search, Zap, ListFilter } from 'lucide-react';
import { analyzeMemoryDump } from '../services/geminiService';
import QuickReply from './QuickReply';

const MemoryAnalyzer: React.FC = () => {
  const [dumpInfo, setDumpInfo] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startAnalysis = async () => {
    if (!dumpInfo.trim()) return;
    setIsAnalyzing(true);
    setReport(null);
    try {
      const result = await analyzeMemoryDump(dumpInfo);
      setReport(result);
    } catch (err) {
      setReport("Evans, the Volatility engine crashed. The dump might be corrupted or the OS profile is unknown.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-900/20">
          <Cpu className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-tighter">Memory Forensic Engine</h2>
          <p className="text-zinc-500 text-sm">Analyze RAM dumps for rootkits, injections, and artifacts for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Ingestion Parameters</h3>
            <div className="space-y-4">
              <textarea 
                value={dumpInfo}
                onChange={(e) => setDumpInfo(e.target.value)}
                placeholder="Paste Dump Metadata, PSList output, or memory offsets..."
                className="w-full h-48 bg-black/40 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-indigo-300 placeholder-zinc-700 focus:outline-none focus:border-indigo-600 resize-none"
              />
              <button 
                onClick={startAnalysis}
                disabled={isAnalyzing || !dumpInfo.trim()}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                {isAnalyzing ? 'Mapping VAD Nodes...' : 'Parse Dump'}
              </button>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Active Plugins</h3>
            <div className="space-y-2">
              {['windows.pslist', 'linux.check_syscall', 'mac.lsof', 'windows.malfind'].map(plugin => (
                <div key={plugin} className="flex items-center justify-between text-[10px] font-mono p-2 bg-black/20 rounded-lg">
                  <span className="text-zinc-500">{plugin}</span>
                  <span className="text-indigo-400">LOADED</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[500px] overflow-hidden shadow-2xl relative">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Volatility Terminal</span>
            <Activity size={14} className="text-indigo-500" />
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            {!report && !isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <Cpu size={48} className="mb-4" />
                <p className="text-xs font-mono uppercase">Awaiting Volatility Hook</p>
              </div>
            ) : isAnalyzing ? (
              <div className="space-y-4 font-mono text-[11px] text-zinc-500 animate-pulse">
                <p>[INIT] Loading OS Symbol tables...</p>
                <p>[PSLIST] Enumerating active process tree...</p>
                <p>[MALFIND] Scanning for executable page protections (PAGE_EXECUTE_READWRITE)...</p>
                <p className="text-indigo-400">[HINT] Evans, I see some suspicious threads in svchost.exe (PID 442)...</p>
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl flex gap-4 items-start">
                  <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-500">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Volatile Intelligence</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, memory doesn't lie. I've uncovered a hidden process that wasn't in the disk logs. The code injection is clear as day at 0x004A..."</p>
                  </div>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-8 border-l-2 border-indigo-500/30 pl-6 py-2">
                  {report}
                </div>
                <QuickReply context="Memory Forensic Analysis" initialReport={report || ''} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryAnalyzer;
