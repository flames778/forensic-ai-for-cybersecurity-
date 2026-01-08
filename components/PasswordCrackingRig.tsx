
import React, { useState } from 'react';
import { Key, ShieldAlert, Loader2, Terminal, Lock, Unlock, Database, Activity, RefreshCw } from 'lucide-react';
import { simulatePasswordCrack } from '../services/geminiService';
import QuickReply from './QuickReply';

const PasswordCrackingRig: React.FC = () => {
  const [hash, setHash] = useState('');
  const [method, setMethod] = useState('Brute Force');
  const [report, setReport] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'cracking' | 'done'>('idle');

  const startCracking = async () => {
    if (!hash.trim()) return;
    setStatus('cracking');
    setReport(null);
    try {
      const result = await simulatePasswordCrack(hash, method);
      setReport(result);
      setStatus('done');
    } catch (err) {
      setReport("Evans, the cracking rig overheated. This hash might be too salted for our current GPU cluster.");
      setStatus('idle');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-zinc-700 rounded-2xl shadow-lg">
          <Key className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Forensix Cracking Rig</h2>
          <p className="text-zinc-500 text-sm">Simulated hash analysis and multi-stage decryption for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Input Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 ml-1">ENCRYPTED HASH</label>
                <div className="relative group">
                  <Terminal className="absolute left-3 top-3 text-zinc-600 group-focus-within:text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    placeholder="e.g., $2a$12$KIXv..."
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 ml-1">CRACKING METHOD</label>
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-500 appearance-none"
                >
                  <option>Brute Force</option>
                  <option>Dictionary Attack</option>
                  <option>Hybrid / Rule-Based</option>
                  <option>Rainbow Table Lookup</option>
                </select>
              </div>

              <button 
                onClick={startCracking}
                disabled={status === 'cracking' || !hash.trim()}
                className="w-full py-4 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {status === 'cracking' ? <RefreshCw className="animate-spin" size={20} /> : <Unlock size={20} />}
                {status === 'cracking' ? 'Crunching Hashes...' : 'Initialize Rig'}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Cluster Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-zinc-500">GPU TEMPERATURE</span>
                <span className={status === 'cracking' ? 'text-red-500' : 'text-green-500'}>{status === 'cracking' ? '82°C' : '34°C'}</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full bg-zinc-500 transition-all duration-[3000ms] ${status === 'cracking' ? 'w-4/5' : 'w-0'}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[450px] overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Decryption Stream</span>
            {status === 'done' ? <Unlock className="text-green-500" size={14} /> : <Lock className="text-zinc-700" size={14} />}
          </div>

          <div className="flex-1 p-8 overflow-y-auto font-mono">
            {status === 'cracking' ? (
               <div className="space-y-2 text-[10px] text-zinc-500">
                <p>Identify hash type: SHA-256...</p>
                <p>Loading wordlist: RockYou.txt...</p>
                <p className="text-zinc-400 animate-pulse">Running iteration 145,200...</p>
                <p className="text-zinc-400 animate-pulse">Running iteration 289,401...</p>
               </div>
            ) : report ? (
              <div className="animate-in fade-in duration-500">
                 <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-2xl mb-6 flex gap-4 items-start">
                   <div className="p-2 bg-zinc-700/20 rounded-lg text-zinc-400">
                    <Database size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Entropy Analysis</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, this one was tough. Here's the analysis of the hash structure and our recovery attempts."</p>
                  </div>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap mb-8">
                  {report}
                </div>
                <QuickReply context="Hash Decryption Result" initialReport={report} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Lock size={48} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Rig Offline</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordCrackingRig;
