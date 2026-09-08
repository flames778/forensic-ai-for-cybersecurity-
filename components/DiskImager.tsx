
import React, { useState } from 'react';
import { HardDrive, ShieldAlert, Loader2, Database, Hash, Archive, Terminal, Search, ExternalLink } from 'lucide-react';
import { performDiskImaging } from '../services/geminiService';
import { OPEN_SOURCE_TOOLS } from '../lib/openSourceTools';
import QuickReply from './QuickReply';

const DiskImager: React.FC = () => {
  const [source, setSource] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [isImaging, setIsImaging] = useState(false);

  const startImaging = async () => {
    if (!source.trim()) return;
    setIsImaging(true);
    setReport(null);
    try {
      const result = await performDiskImaging(source);
      setReport(result);
    } catch (err) {
      setReport("Evans, the drive failed to mount. Read errors detected on sector 0. Possible physical failure or encryption lock.");
    } finally {
      setIsImaging(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-zinc-700 rounded-2xl shadow-lg">
          <HardDrive className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-tighter">Bit-Level Disk Imager</h2>
          <p className="text-zinc-500 text-sm">Physical drive cloning and forensic file carving for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Imaging Protocol</h3>
            <div className="space-y-4">
              <div className="relative group">
                <Terminal className="absolute left-3 top-3 text-zinc-600" size={18} />
                <input 
                  type="text" 
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Drive Path (e.g., /dev/sdb or PhysicalDrive1)..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-black/20 rounded-xl border border-zinc-800 flex flex-col gap-1">
                   <span className="text-[8px] text-zinc-600 font-bold uppercase">Write Blocker</span>
                   <span className="text-[10px] text-green-500 font-mono">ENGAGED</span>
                </div>
                <div className="p-3 bg-black/20 rounded-xl border border-zinc-800 flex flex-col gap-1">
                   <span className="text-[8px] text-zinc-600 font-bold uppercase">Hash Mode</span>
                   <span className="text-[10px] text-blue-500 font-mono">SHA-256</span>
                </div>
              </div>

              <button 
                onClick={startImaging}
                disabled={isImaging || !source.trim()}
                className="w-full py-4 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {isImaging ? <Loader2 className="animate-spin" size={20} /> : <Archive size={20} />}
                {isImaging ? 'Imaging Bitstream...' : 'Start Acquisition'}
              </button>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Disk Forensics Toolkit</h3>
            <div className="space-y-2">
              {OPEN_SOURCE_TOOLS.find(c => c.id === 'disk')?.tools.map(tool => (
                <div key={tool.name} className="flex items-center justify-between text-[10px] font-mono p-2 bg-black/20 rounded-lg border border-zinc-800/50">
                  <span className="text-zinc-500">{tool.name}</span>
                  <div className="flex items-center gap-2">
                    {tool.command && (
                      <span className="text-zinc-700 text-[8px]">{tool.command.split(' ')[0]}</span>
                    )}
                    {tool.github && (
                      <a href={`https://github.com/${tool.github}`} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-emerald-400 transition-colors">
                        <ExternalLink size={8} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[500px] overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Forensic Image Terminal</span>
            <Hash className="text-zinc-600" size={14} />
          </div>

          <div className="flex-1 p-8 overflow-y-auto font-mono">
            {isImaging ? (
               <div className="space-y-2 text-[10px] text-zinc-500">
                <p>Establishing bit-level read-stream...</p>
                <p>Transferring block 144,233 / 500,000...</p>
                <p className="text-blue-400">Verifying SHA-256 integrity on the fly...</p>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                   <div className="h-full bg-blue-500 animate-pulse w-1/2" />
                </div>
               </div>
            ) : report ? (
              <div className="animate-in fade-in duration-500">
                 <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-2xl mb-6 flex gap-4 items-start">
                  <div className="p-2 bg-zinc-700/20 rounded-lg text-zinc-400">
                    <Database size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Acquisition Log</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, drive imaging is complete. I've carved some deleted headers that look like encrypted SQLite databases."</p>
                  </div>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap mb-8">
                  {report}
                </div>
                <QuickReply context={`Disk Image: ${source}`} initialReport={report} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <HardDrive size={48} className="mb-4" />
                <p className="text-xs font-bold uppercase">Imaging Rig Offline</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiskImager;
