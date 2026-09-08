
import React, { useState } from 'react';
import { Video, ShieldAlert, Loader2, Zap, Terminal, Activity, Target, Radio, CameraOff, Monitor, ScanLine, Eye } from 'lucide-react';
import { accessRemoteCamera } from '../services/geminiService';
import QuickReply from './QuickReply';
import ToolRunner from './ToolRunner';

const SurveillanceOps: React.FC = () => {
  const [target, setTarget] = useState('');
  const [method, setMethod] = useState('RTSP Auth Bypass');
  const [sceneDesc, setSceneDesc] = useState('A suspect meeting at a street corner near an abandoned warehouse');
  const [report, setReport] = useState<string | null>(null);
  const [feedImage, setFeedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'probing' | 'streaming' | 'done'>('idle');

  const initiateSurveillance = async () => {
    if (!target.trim()) return;
    setStatus('probing');
    setReport(null);
    setFeedImage(null);
    
    try {
      // Small artificial delay for tactical feel
      await new Promise(r => setTimeout(r, 2000));
      setStatus('streaming');
      
      const result = await accessRemoteCamera(target, method, sceneDesc);
      setReport(result.text);
      setFeedImage(result.imageUrl);
      setStatus('done');
    } catch (err) {
      setReport("Evans, the connection timed out. The target camera might be behind a hardened NAT or using proprietary encryption.");
      setStatus('idle');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-blue-900 border border-blue-500 rounded-2xl shadow-lg shadow-blue-500/20">
          <Video className="text-blue-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white uppercase font-mono tracking-tighter">Tactical Surveillance Interface</h2>
          <p className="text-zinc-500 text-sm">Remote scene visualization and CCTV exploitation for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Exploitation Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Uplink Config</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Target Camera IP / UID</label>
                <div className="relative group">
                  <Target className="absolute left-3 top-3 text-zinc-600 group-focus-within:text-blue-500" size={18} />
                  <input 
                    type="text" 
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g., 172.16.44.12:554"
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Exploit Vector</label>
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-600 appearance-none font-mono"
                >
                  <option>RTSP Auth Bypass</option>
                  <option>ONVIF Default Creds</option>
                  <option>CVE-2021-36260 (Hikvision)</option>
                  <option>P2P Tunnel Hijack</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 ml-1 uppercase">Scene/Incident Context</label>
                <textarea 
                  value={sceneDesc}
                  onChange={(e) => setSceneDesc(e.target.value)}
                  placeholder="Describe what you expect to see..."
                  className="w-full h-24 bg-black/40 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-300 focus:outline-none focus:border-blue-600 font-mono resize-none"
                />
              </div>

              <button 
                onClick={initiateSurveillance}
                disabled={status === 'probing' || status === 'streaming' || !target.trim()}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {status === 'probing' || status === 'streaming' ? <Loader2 className="animate-spin" size={20} /> : <Radio size={20} />}
                {status === 'idle' ? 'Connect to Feed' : status === 'probing' ? 'Scanning Ports...' : status === 'streaming' ? 'Decoding Stream...' : 'Refresh Connection'}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Signal Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">BANDWIDTH</span>
                <span className="text-blue-400">4.2 Mbps</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">LATENCY</span>
                <span className="text-green-400">42ms</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">ENCRYPTION</span>
                <span className="text-amber-400">AES-128 (Bypassed)</span>
              </div>
            </div>
          </div>

          <ToolRunner
            categoryLabel="Surveillance Tools — Real Execution"
            color="red"
            tools={[
              { id: 'nmap', name: 'Nmap' },
              { id: 'masscan', name: 'Masscan' },
              { id: 'whois', name: 'Whois' },
              { id: 'dig', name: 'Dig' },
              { id: 'bettercap', name: 'Bettercap' },
            ]}
          />
        </div>

        {/* Live Feed / Results Hub */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-black border border-zinc-800 rounded-3xl relative overflow-hidden aspect-video shadow-2xl group">
             {/* Surveillance Feed Overlay */}
             <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                   <div className={`w-2 h-2 rounded-full ${status === 'done' ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
                   <span className="text-[10px] font-mono text-white font-bold">REC</span>
                </div>
                <div className="text-[10px] font-mono text-white/70 bg-black/30 px-2 py-1 rounded">
                   CAM_01 // {target || 'OFFLINE'}
                </div>
             </div>

             <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <div className="text-[10px] font-mono text-white/70 bg-black/30 px-2 py-1 rounded">
                   {new Date().toISOString().slice(0, 19).replace('T', ' ')}
                </div>
             </div>

             {/* Scanlines Effect */}
             <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

             {status === 'streaming' || status === 'probing' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 text-zinc-500 space-y-4">
                   <Loader2 size={48} className="animate-spin text-blue-500" />
                   <p className="font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Syncing Frame Buffer...</p>
                </div>
             ) : feedImage ? (
                <img src={feedImage} alt="Surveillance Feed" className="w-full h-full object-cover animate-in fade-in duration-1000" />
             ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-zinc-800 space-y-4">
                   <CameraOff size={64} className="opacity-10" />
                   <p className="font-mono text-xs uppercase tracking-widest opacity-20">NO SIGNAL DETECTED</p>
                </div>
             )}

             {/* Bottom Overlay */}
             <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
                <div className="flex gap-4">
                   <div className="text-[9px] font-mono text-white/40">F: 2.8 // ISO: 800</div>
                   <div className="text-[9px] font-mono text-white/40">1080p // 60fps</div>
                </div>
                <div className="flex gap-2">
                   <Monitor size={12} className="text-white/20" />
                   <ScanLine size={12} className="text-white/20" />
                </div>
             </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[300px] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-blue-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Tactical Analysis Buffer</span>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              {!report ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                  <Terminal size={48} className="mb-4 text-blue-500" />
                  <p className="text-xs font-mono uppercase tracking-widest">Standing By for Feed Data</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex gap-4 items-start border-l-4 border-l-blue-600">
                    <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Surveillance Log: {target}</p>
                      <p className="text-xs text-zinc-400 italic">"Evans, I've got the feed. Visual reconstruction complete. Check the analysis below for suspect activity."</p>
                    </div>
                  </div>
                  <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-8 border-l-2 border-blue-500/30 pl-6 py-2 bg-black/40 rounded-r-2xl p-4">
                    {report}
                  </div>
                  <QuickReply context={`Surveillance Ops: ${target}`} initialReport={report || ''} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveillanceOps;
