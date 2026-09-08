
import React, { useState } from 'react';
import { Cloud, ShieldAlert, Loader2, Database, Key, Server, Search, ExternalLink } from 'lucide-react';
import { auditCloudInfra } from '../services/geminiService';
import { OPEN_SOURCE_TOOLS } from '../lib/openSourceTools';
import QuickReply from './QuickReply';

const CloudAuditor: React.FC = () => {
  const [config, setConfig] = useState('');
  const [provider, setProvider] = useState('AWS');
  const [report, setReport] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const startAudit = async () => {
    if (!config.trim()) return;
    setIsAuditing(true);
    setReport(null);
    try {
      const result = await auditCloudInfra(config, provider);
      setReport(result);
    } catch (err) {
      setReport("Evans, the cloud audit failed. The configuration snippet might be too large or malformed.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-cyan-600 rounded-2xl shadow-lg shadow-cyan-900/20">
          <Cloud className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Cloud Security Auditor</h2>
          <p className="text-zinc-500 text-sm">Analyze cloud configurations for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Uplink Parameters</h3>
            <div className="space-y-4">
              <select 
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-600 appearance-none"
              >
                <option>AWS</option>
                <option>Azure</option>
                <option>GCP</option>
              </select>
              <textarea 
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                placeholder="Paste Terraform, CloudFormation, or JSON policy export here..."
                className="w-full h-48 bg-black/40 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-cyan-300 placeholder-zinc-700 focus:outline-none focus:border-cyan-600 resize-none"
              />
              <button 
                onClick={startAudit}
                disabled={isAuditing || !config.trim()}
                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {isAuditing ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                {isAuditing ? 'Auditing IAM Policies...' : 'Initiate Audit'}
              </button>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Cloud Security Tools</h3>
            <div className="space-y-2">
              {OPEN_SOURCE_TOOLS.find(c => c.id === 'cloud')?.tools.map(tool => (
                <div key={tool.name} className="flex items-center justify-between text-[10px] font-mono p-2 bg-black/20 rounded-lg">
                  <span className="text-zinc-500">{tool.name}</span>
                  <div className="flex items-center gap-2">
                    {tool.command && (
                      <span className="text-zinc-700 text-[8px]">{tool.command.split(' ')[0]}</span>
                    )}
                    {tool.github && (
                      <a href={`https://github.com/${tool.github}`} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-cyan-400 transition-colors">
                        <ExternalLink size={8} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[500px] overflow-hidden shadow-2xl relative">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Compliance Report</span>
            <ShieldAlert size={14} className="text-cyan-500" />
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            {!report && !isAuditing ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <Cloud size={48} className="mb-4" />
                <p className="text-xs font-mono uppercase">Awaiting Configuration Data</p>
              </div>
            ) : isAuditing ? (
              <div className="space-y-4 font-mono text-[11px] text-zinc-500 animate-pulse">
                <p>[INFRA] Fetching resource dependency tree...</p>
                <p>[IAM] Analyzing cross-account trust relationships...</p>
                <p>[STORAGE] Checking S3 bucket public access blocks...</p>
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl flex gap-4 items-start">
                  <div className="p-2 bg-cyan-600/20 rounded-lg text-cyan-500">
                    <Database size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Cloud Posture Intelligence</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, I found some significant gaps in the permission sets. This could lead to a massive data leak if not patched."</p>
                  </div>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-8 border-l-2 border-cyan-500/30 pl-6 py-2">
                  {report}
                </div>
                <QuickReply context="Cloud Security Audit" initialReport={report || ''} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudAuditor;
