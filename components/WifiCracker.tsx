
import React, { useState } from 'react';
import { Wifi, ShieldAlert, Zap, Loader2, Signal, Terminal, Lock, Unlock, ExternalLink } from 'lucide-react';
import { simulateWifiCrack } from '../services/geminiService';
import { OPEN_SOURCE_TOOLS } from '../lib/openSourceTools';
import QuickReply from './QuickReply';
import ToolRunner from './ToolRunner';

const WifiCracker: React.FC = () => {
  const [ssid, setSsid] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'cracking' | 'done'>('idle');

  const startAudit = async () => {
    if (!ssid.trim()) return;
    
    setStatus('scanning');
    // Simulated delay for "Scanning"
    await new Promise(r => setTimeout(r, 1500));
    
    setStatus('cracking');
    try {
      const result = await simulateWifiCrack(ssid);
      setReport(result);
      setStatus('done');
    } catch (err) {
      setReport("Evans, the signal was lost or the packet injection failed.");
      setStatus('idle');
    } finally {
      // Don't reset status to idle immediately if it's done
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-900/20">
          <Zap className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">WiFi Forensic Audit</h2>
          <p className="text-zinc-500 text-sm">Passphrase recovery and security posture analysis for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Injection Parameters</h3>
            <div className="space-y-4">
              <div className="relative group">
                <Wifi className="absolute left-3 top-3 text-zinc-600 group-focus-within:text-red-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder="Target SSID (WiFi Name)..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-all"
                />
              </div>
              
              <button 
                onClick={startAudit}
                disabled={status === 'scanning' || status === 'cracking'}
                className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20"
              >
                {status === 'scanning' || status === 'cracking' ? <Loader2 className="animate-spin" size={20} /> : <Signal size={20} />}
                {status === 'idle' ? 'Initiate Capture' : status === 'scanning' ? 'Capturing Handshake...' : status === 'cracking' ? 'Injecting Packets...' : 'Restart Audit'}
              </button>
            </div>
          </div>

          <ToolRunner
            categoryLabel="WiFi Tools — Real Execution"
            color="red"
            tools={[
              { id: 'aircrack-ng', name: 'Aircrack-ng', github: 'aircrack-ng/aircrack-ng' },
              { id: 'bettercap', name: 'Bettercap', github: 'bettercap/bettercap' },
            ]}
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[400px] overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Audit Terminal</span>
            {status === 'done' ? <Unlock className="text-green-500" size={14} /> : <Lock className="text-zinc-700" size={14} />}
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            {!report ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <Terminal size={48} className="mb-4" />
                <p className="text-xs font-mono uppercase tracking-widest">Awaiting Handshake Capture</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-600/5 border border-red-500/20 rounded-2xl">
                   <div className="flex items-center gap-2 text-red-400 font-bold mb-2 uppercase text-[10px]">
                    <ShieldAlert size={14} />
                    Encryption Audit Complete
                  </div>
                  <p className="text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {report}
                  </p>
                </div>
                <QuickReply context={`WiFi Audit: ${ssid}`} initialReport={report} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WifiCracker;
