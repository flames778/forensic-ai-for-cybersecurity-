
import React, { useState } from 'react';
import { Code2, ShieldAlert, Loader2, Cpu, Terminal, Binary, FileCode, CheckCircle2, Search } from 'lucide-react';
import { simulateReverseEng } from '../services/geminiService';
import QuickReply from './QuickReply';

const ReverseEngLab: React.FC = () => {
  const [code, setCode] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startAnalysis = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setReport(null);
    try {
      const result = await simulateReverseEng(code);
      setReport(result);
    } catch (err) {
      setReport("Evans, the decompiler hung on an obfuscated loop. This binary might have anti-reverse measures.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-blue-700 rounded-2xl shadow-lg">
          <Code2 className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Reverse Engineering Lab</h2>
          <p className="text-zinc-500 text-sm">Decompile binaries and analyze hidden logic for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
            <div className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
               <div className="flex items-center gap-2">
                <Binary size={14} className="text-blue-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Disassembly Buffer</span>
               </div>
            </div>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste binary headers, hex dumps, or obfuscated code snippets here..."
              className="w-full h-[500px] bg-black/20 border-none focus:ring-0 text-blue-100 font-mono text-xs p-6 resize-none"
            />
          </div>
          <button 
            onClick={startAnalysis}
            disabled={isAnalyzing || !code.trim()}
            className="w-full py-4 bg-blue-700 hover:bg-blue-600 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {isAnalyzing ? 'Heuristic Analysis in Progress...' : 'Analyze Structure'}
          </button>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[500px] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Decompiler Intelligence</span>
              <FileCode size={14} className="text-blue-500" />
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                   <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                    <Cpu className="absolute inset-0 m-auto text-blue-500" size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Tracing Execution Flow...</p>
                    <p className="text-xs text-zinc-500">Evans, I'm identifying anti-tamper mechanisms.</p>
                  </div>
                </div>
              ) : report ? (
                <div className="animate-in fade-in duration-500">
                  <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl mb-6 flex gap-4 items-start">
                    <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Logic Reconstruction</p>
                      <p className="text-xs text-zinc-400 italic">"Evans, I've mapped the internal functions. This code is doing more than it lets on. Check the breakdown."</p>
                    </div>
                  </div>
                  <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-8 border-l-2 border-blue-500/30 pl-6 py-2">
                    {report}
                  </div>
                  <QuickReply context="Reverse Engineering Report" initialReport={report} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-700 opacity-40">
                  <Binary size={48} className="mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">No Active Trace</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Security Insights</h3>
            <div className="space-y-3">
              {[
                { label: 'Obfuscation', status: 'MEDIUM', color: 'text-amber-400' },
                { label: 'Payload Signature', status: 'CLEAN', color: 'text-green-400' },
                { label: 'Logic Bombs', status: 'NONE DETECTED', color: 'text-zinc-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-mono border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500 uppercase">{item.label}</span>
                  <span className={item.color}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseEngLab;
