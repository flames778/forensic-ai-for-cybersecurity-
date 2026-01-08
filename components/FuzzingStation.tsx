
import React, { useState } from 'react';
import { Zap, ShieldAlert, Loader2, Search, Target, Terminal, Activity, Bug } from 'lucide-react';
import { runFuzzingSession } from '../services/geminiService';
import QuickReply from './QuickReply';

const FuzzingStation: React.FC = () => {
  const [target, setTarget] = useState('');
  const [protocol, setProtocol] = useState('HTTP/1.1');
  const [report, setReport] = useState<string | null>(null);
  const [isFuzzing, setIsFuzzing] = useState(false);

  const startFuzzing = async () => {
    if (!target.trim()) return;
    setIsFuzzing(true);
    setReport(null);
    try {
      const result = await runFuzzingSession(target, protocol);
      setReport(result);
    } catch (err) {
      setReport("Evans, the fuzzer process hung. The target service likely crashed or we triggered a watchdog timer.");
    } finally {
      setIsFuzzing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-yellow-600 rounded-2xl shadow-lg shadow-yellow-900/20">
          <Zap className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">AFL-Forensix Fuzzing Station</h2>
          <p className="text-zinc-500 text-sm">Protocol and input mutation testing for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Mutation Target</h3>
            <div className="space-y-4">
              <div className="relative">
                <Target className="absolute left-3 top-3 text-zinc-600" size={18} />
                <input 
                  type="text" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Target (Binary/URL)..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-600 font-mono"
                />
              </div>
              <select 
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-600 appearance-none font-mono"
              >
                <option>HTTP/1.1</option>
                <option>TCP/UDP Raw</option>
                <option>JSON/REST</option>
                <option>Binary Blob</option>
              </select>
              <button 
                onClick={startFuzzing}
                disabled={isFuzzing || !target.trim()}
                className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {isFuzzing ? <Loader2 className="animate-spin" size={20} /> : <Bug size={20} />}
                {isFuzzing ? 'Fuzzing Inputs...' : 'Inject Mutations'}
              </button>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Stability Monitor</h3>
            <div className="space-y-3">
               <div className="flex justify-between text-[10px] font-mono">
                <span className="text-zinc-500">CRASHES FOUND</span>
                <span className={isFuzzing ? 'text-red-500 animate-pulse' : 'text-zinc-600'}>0</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-zinc-500">PATHS EXPLORED</span>
                <span className="text-yellow-400">{isFuzzing ? '1,442' : '0'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[550px] overflow-hidden shadow-2xl relative">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mutation Log</span>
            <Activity size={14} className="text-yellow-500" />
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            {!report && !isFuzzing ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Zap size={48} className="mb-4" />
                <p className="text-xs font-mono uppercase tracking-widest">Awaiting Fuzzing Vectors</p>
              </div>
            ) : isFuzzing ? (
              <div className="space-y-4 font-mono text-[11px] text-zinc-500">
                <p className="text-yellow-500 animate-pulse">[FUZZ] Mutating input for {target}...</p>
                <p>[STRAT] Shifting bit-fields in offset 0x44...</p>
                <p>[NET] Monitoring for heartbeat timeout...</p>
                <p>[CPU] Tracking instruction coverage via instrumentation...</p>
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-2xl mb-8 flex gap-4 items-start">
                  <div className="p-2 bg-yellow-600/20 rounded-lg text-yellow-400">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Fuzzing Intelligence</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, I've found a specific mutation that causes the buffer to overflow. This is a clear RCE candidate if handled right."</p>
                  </div>
                </div>
                
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-8 border-l-2 border-yellow-500/30 pl-6 py-2">
                  {report}
                </div>

                <QuickReply context={`Protocol Fuzzing: ${target}`} initialReport={report || ''} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuzzingStation;
