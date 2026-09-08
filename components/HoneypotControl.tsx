
import React, { useState } from 'react';
import { Ghost, ShieldAlert, Loader2, Search, Target, Terminal, Activity, Zap, Server, Globe, ExternalLink } from 'lucide-react';
import { deployHoneypot } from '../services/geminiService';
import { OPEN_SOURCE_TOOLS } from '../lib/openSourceTools';
import QuickReply from './QuickReply';

const HoneypotControl: React.FC = () => {
  const [location, setLocation] = useState('DMZ_VLAN_10');
  const [type, setType] = useState('Fake SSH Server');
  const [report, setReport] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const startDeployment = async () => {
    setIsDeploying(true);
    setReport(null);
    try {
      const result = await deployHoneypot(type, location);
      setReport(result);
    } catch (err) {
      setReport("Evans, the honeypot failed to bind to the port. The network firewall might be blocking the decoy service.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-900/20">
          <Ghost className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Deception & Honeypot Control</h2>
          <p className="text-zinc-500 text-sm">Deploy and monitor digital decoys for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Decoy Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 ml-1">DECOY TYPE</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-600 appearance-none font-mono"
                >
                  <option>Fake SSH Server</option>
                  <option>Vulnerable SMB Share</option>
                  <option>Fake Industrial PLC</option>
                  <option>Deceptive Web App</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 ml-1">DEPLOYMENT ZONE</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., DMZ_VLAN_10"
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-600 font-mono"
                />
              </div>
              <button 
                onClick={startDeployment}
                disabled={isDeploying}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {isDeploying ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                {isDeploying ? 'Deploying Decoy...' : 'Initialize Honeypot'}
              </button>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Honeypot Arsenal</h3>
            <div className="space-y-2">
              {OPEN_SOURCE_TOOLS.find(c => c.id === 'honeypot')?.tools.map(tool => (
                <div key={tool.name} className="flex items-center justify-between text-[10px] font-mono p-2 bg-black/20 rounded-lg border border-zinc-800/50">
                  <span className="text-zinc-500">{tool.name}</span>
                  <div className="flex items-center gap-2">
                    {tool.command && (
                      <span className="text-zinc-700 text-[8px]">{tool.command.split(' ')[0]}</span>
                    )}
                    {tool.github && (
                      <a href={`https://github.com/${tool.github}`} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-purple-400 transition-colors">
                        <ExternalLink size={8} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[550px] overflow-hidden shadow-2xl relative">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Decoy Analytics</span>
            <Activity size={14} className="text-purple-500" />
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            {!report && !isDeploying ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Ghost size={48} className="mb-4" />
                <p className="text-xs font-mono uppercase tracking-widest">Decoy Control Offline</p>
              </div>
            ) : isDeploying ? (
              <div className="space-y-4 font-mono text-[11px] text-zinc-500 animate-pulse">
                <p className="text-purple-500">[INIT] Setting up emulated {type}...</p>
                <p>[NET] Binding to shadow interface in {location}...</p>
                <p>[LOG] Configuring low-interaction sensors...</p>
                <p>[READY] Deception trap is live.</p>
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-2xl mb-8 flex gap-4 items-start">
                  <div className="p-2 bg-purple-600/20 rounded-lg text-purple-400">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Deception Intelligence</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, the trap is set. I've designed this to look like a poorly configured SSH server. Any bot or script kiddie will jump on it, giving us their TTPs."</p>
                  </div>
                </div>
                
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-8 border-l-2 border-purple-500/30 pl-6 py-2">
                  {report}
                </div>

                <QuickReply context={`Honeypot Decoy: ${type}`} initialReport={report || ''} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoneypotControl;
