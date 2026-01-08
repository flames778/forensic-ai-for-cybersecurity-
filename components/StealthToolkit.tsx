
import React, { useState } from 'react';
import { EyeOff, ShieldCheck, Loader2, ShieldAlert, Zap, Globe, Lock, Terminal, Ghost, Trash2 } from 'lucide-react';
import { performStealthAudit, scrubMetadata } from '../services/geminiService';
import QuickReply from './QuickReply';

const StealthToolkit: React.FC = () => {
  const [ip, setIp] = useState('1.2.3.4');
  const [vpn, setVpn] = useState('None (Direct Link)');
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  
  const [filename, setFilename] = useState('');
  const [scrubReport, setScrubReport] = useState<string | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const handleAudit = async () => {
    setIsAuditing(true);
    setAuditReport(null);
    try {
      const result = await performStealthAudit(ip, vpn);
      setAuditReport(result);
    } catch (err) {
      setAuditReport("Evans, the stealth audit failed. The network sensors are blocked.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleScrub = async () => {
    if (!filename.trim()) return;
    setIsScrubbing(true);
    setScrubReport(null);
    try {
      const result = await scrubMetadata('Evidence File', filename);
      setScrubReport(result);
    } catch (err) {
      setScrubReport("Evans, the scrubbing engine hit a write-protect lock.");
    } finally {
      setIsScrubbing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-800 rounded-2xl shadow-lg border border-zinc-700">
            <EyeOff className="text-zinc-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Ghost Mode / OPSEC Suite</h2>
            <p className="text-zinc-500 text-sm italic">"Become a ghost, Evans. If they can't find you, they can't stop you."</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] text-zinc-400 font-mono flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-pulse" />
             POSTURE: STEALTHY
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stealth Audit Section */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Globe size={80} />
            </div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ShieldCheck size={14} className="text-zinc-400" />
              Network Posture Audit
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 ml-1">EXIT NODE IP</label>
                  <input 
                    type="text" 
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 ml-1">VPN / PROXY PROVIDER</label>
                  <input 
                    type="text" 
                    value={vpn}
                    onChange={(e) => setVpn(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
                  />
                </div>
              </div>
              <button 
                onClick={handleAudit}
                disabled={isAuditing}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 text-zinc-300 rounded-2xl font-bold flex items-center justify-center gap-2 border border-zinc-700 transition-all"
              >
                {isAuditing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                Audit Identity Posture
              </button>
            </div>

            {auditReport && (
              <div className="mt-6 p-4 bg-black/40 border border-zinc-800 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Leak Analysis Report</p>
                <div className="text-xs text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed">
                  {auditReport}
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
             <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Command Injection: MAC Spoofer</h3>
             <div className="p-4 bg-black/40 border border-zinc-800 rounded-2xl">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] text-zinc-600 font-mono">macchanger -r wlan0</span>
                 <button className="text-[10px] text-zinc-400 hover:text-white transition-colors">COPY</button>
               </div>
               <p className="text-[9px] text-zinc-500 italic">Evans, run this before connecting to any untrusted AP to hide your hardware OUI.</p>
             </div>
          </div>
        </div>

        {/* Metadata Scrubbing Section */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Ghost size={80} />
            </div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Trash2 size={14} className="text-zinc-400" />
              Evidence Metadata Scrubber
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 ml-1">FILENAME / PATH TO GHOST</label>
                <input 
                  type="text" 
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="evidence_dump_v1.tar.gz"
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
              <button 
                onClick={handleScrub}
                disabled={isScrubbing || !filename.trim()}
                className="w-full py-4 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 text-black rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {isScrubbing ? <Loader2 className="animate-spin" size={20} /> : <Ghost size={20} />}
                Ghost the Asset
              </button>
            </div>

            {scrubReport && (
              <div className="mt-6 p-4 bg-black/40 border border-zinc-800 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Scrubbing Log: Verified</p>
                <div className="text-xs text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed">
                  {scrubReport}
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Tactical Stealth Advice</h3>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800/20 border border-zinc-800 rounded-2xl flex gap-4">
                <div className="p-2 bg-zinc-700/50 rounded-lg h-fit">
                  <Lock size={16} className="text-zinc-400" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-white uppercase">Encryption Check</p>
                   <p className="text-[11px] text-zinc-500 italic">"Evans, always use Veracrypt for evidence storage. If the hardware is seized, the data remains a mystery."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <QuickReply context="Anonymity & OPSEC" placeholder="Check my footprint, Forensix..." />
      </div>
    </div>
  );
};

export default StealthToolkit;
