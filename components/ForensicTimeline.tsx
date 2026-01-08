
import React, { useState } from 'react';
import { Calendar, ShieldAlert, Loader2, Activity, Terminal, Search, Clock, List } from 'lucide-react';
import { generateTimeline } from '../services/geminiService';
import QuickReply from './QuickReply';

const ForensicTimeline: React.FC = () => {
  const [logs, setLogs] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startReconstruction = async () => {
    if (!logs.trim()) return;
    setIsProcessing(true);
    setReport(null);
    try {
      const result = await generateTimeline(logs);
      setReport(result);
    } catch (err) {
      setReport("Evans, the timeline reconstruction failed. The log entropy might be too high.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-violet-600 rounded-2xl shadow-lg shadow-violet-900/20">
          <Calendar className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Forensic Timeline Generator</h2>
          <p className="text-zinc-500 text-sm">Reconstruct attack sequences with millisecond precision for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Log Aggregation</h3>
            <div className="space-y-4">
              <textarea 
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                placeholder="Paste multi-source logs (System, Web, Firewall)..."
                className="w-full h-64 bg-black/40 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-violet-300 placeholder-zinc-700 focus:outline-none focus:border-violet-600 resize-none"
              />
              <button 
                onClick={startReconstruction}
                disabled={isProcessing || !logs.trim()}
                className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-900/20"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Clock size={20} />}
                {isProcessing ? 'Mapping Events...' : 'Sync Timeline'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[500px] overflow-hidden shadow-2xl relative">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sequence Reconstruction</span>
            <List size={14} className="text-violet-500" />
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            {!report && !isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Calendar size={48} className="mb-4" />
                <p className="text-xs font-mono uppercase tracking-widest">Awaiting Log Ingestion</p>
              </div>
            ) : isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 border-4 border-violet-600/10 border-t-violet-600 rounded-full animate-spin" />
                <p className="text-sm font-mono text-zinc-400 italic">Evans, I'm normalizing timestamps across all sources...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-violet-900/10 border border-violet-500/20 rounded-2xl mb-8 flex gap-4 items-start">
                  <div className="p-2 bg-violet-600/20 rounded-lg text-violet-400">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Time-Series Intelligence</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, I've aligned the clocks. The breach started 4 minutes earlier than suspected via an unprotected staging server."</p>
                  </div>
                </div>
                
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-8 border-l-2 border-violet-500/30 pl-6 py-2">
                  {report}
                </div>

                <QuickReply context="Forensic Timeline" initialReport={report || ''} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForensicTimeline;
