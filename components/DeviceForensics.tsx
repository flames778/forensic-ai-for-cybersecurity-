
import React, { useState } from 'react';
import { Smartphone, Laptop, Loader2, Cpu, ShieldAlert, Terminal, Lock, Unlock, Database, Activity, MapPin } from 'lucide-react';
import { performDeviceForensics } from '../services/geminiService';
import QuickReply from './QuickReply';

const DeviceForensics: React.FC = () => {
  const [target, setTarget] = useState('');
  const [deviceType, setDeviceType] = useState<'Mobile' | 'Laptop'>('Mobile');
  const [report, setReport] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'probing' | 'extracting' | 'done'>('idle');

  const startForensics = async () => {
    if (!target.trim()) return;
    setStatus('probing');
    
    // Technical stage simulation
    await new Promise(r => setTimeout(r, 2000));
    setStatus('extracting');
    
    try {
      const result = await performDeviceForensics(target, deviceType);
      setReport(result);
      setStatus('done');
    } catch (err) {
      setReport("Evans, the remote uplink was severed. The device might be powered down or using a hardened VPN.");
      setStatus('idle');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-900/20">
            <Smartphone className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Endpoint Intelligence Hub</h2>
            <p className="text-zinc-500 text-sm">Remote forensic acquisition and extraction for Evans.</p>
          </div>
        </div>
        <div className="hidden md:flex gap-3">
          <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] text-purple-400 font-mono flex items-center gap-2">
             <Activity size={10} className="animate-pulse" />
             PROBE: ACTIVE
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Connection Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Target Parameters</h3>
            <div className="space-y-4">
              <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
                <button 
                  onClick={() => setDeviceType('Mobile')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${deviceType === 'Mobile' ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Smartphone size={14} />
                  Mobile
                </button>
                <button 
                  onClick={() => setDeviceType('Laptop')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${deviceType === 'Laptop' ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Laptop size={14} />
                  Laptop
                </button>
              </div>

              <div className="relative group">
                <Terminal className="absolute left-3 top-3 text-zinc-600 group-focus-within:text-purple-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Target IP or Device ID..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-600 transition-all font-mono"
                />
              </div>

              <button 
                onClick={startForensics}
                disabled={status === 'probing' || status === 'extracting' || !target.trim()}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
              >
                {status === 'probing' || status === 'extracting' ? <Loader2 className="animate-spin" size={20} /> : <Cpu size={20} />}
                {status === 'idle' ? 'Deploy Probe' : status === 'probing' ? 'Scanning Ports...' : status === 'extracting' ? 'Extracting NAND...' : 'Re-deploy Probe'}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Vulnerability Scanner</h3>
            <div className="space-y-3">
              {[
                { label: 'CVE-2024-X: Local Escalation', status: 'VULNERABLE', color: 'text-red-400' },
                { label: 'Bluetooth Handshake', status: 'WEAK', color: 'text-amber-400' },
                { label: 'Secure Enclave', status: 'HARDENED', color: 'text-green-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-mono p-2 bg-black/20 rounded-lg border border-zinc-800/50">
                  <span className="text-zinc-500">{item.label}</span>
                  <span className={item.color}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Hub */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[550px] overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === 'extracting' ? 'bg-purple-500 animate-pulse' : status === 'done' ? 'bg-green-500' : 'bg-zinc-700'}`} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Acquisition Terminal: {target || 'Awaiting Target'}
              </span>
            </div>
            <div className="flex gap-2">
               <button className="text-zinc-600 hover:text-white transition-colors"><MapPin size={14}/></button>
               <button className="text-zinc-600 hover:text-white transition-colors"><Database size={14}/></button>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {status === 'probing' || status === 'extracting' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-purple-600/10 border-t-purple-600 rounded-full animate-spin" />
                  <Smartphone className="absolute inset-0 m-auto text-purple-500" size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white font-mono uppercase tracking-widest">Bypassing Authentication...</h4>
                  <div className="flex flex-col gap-1">
                    <p className="text-zinc-500 text-xs">Evans, I'm analyzing the memory dump for encryption keys.</p>
                    <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden mx-auto mt-2">
                      <div className="h-full bg-purple-500 animate-progress" style={{ width: status === 'probing' ? '40%' : '80%' }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : report ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-2xl mb-8 flex gap-4 items-start">
                  <div className="p-2 bg-purple-600/20 rounded-lg text-purple-400">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Forensix Tactical Brief</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, I've breached the secondary partition. The device profile is now mirrored to our local buffer. Check the extracted artifacts below."</p>
                  </div>
                </div>
                
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-8 border-l-2 border-purple-500/30 pl-6 py-2">
                  {report}
                </div>

                <QuickReply context={`Device Forensics: ${target}`} initialReport={report} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-700 space-y-4">
                <div className="p-6 bg-zinc-800/20 rounded-full border border-zinc-800/50">
                   <Smartphone size={48} className="opacity-20" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold uppercase tracking-widest">No Remote Session</p>
                  <p className="text-xs">Enter a target IP or ID to begin forensic probe</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceForensics;
