
import React, { useState, useEffect } from 'react';
import { Radar, ShieldAlert, Loader2, Search, Globe, Activity, AlertTriangle, ExternalLink, Database, RefreshCw } from 'lucide-react';
import { performOsintTrace } from '../services/geminiService';
import { OPEN_SOURCE_TOOLS } from '../lib/openSourceTools';
import QuickReply from './QuickReply';

interface ThreatEntry {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'url' | 'email';
  value: string;
  confidence: number;
  source: string;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const MOCK_THREATS: ThreatEntry[] = [
  { id: '1', type: 'ip', value: '185.220.101.45', confidence: 94, source: 'AlienVault OTX', firstSeen: '2026-08-01', lastSeen: '2026-09-07', tags: ['c2', 'tor-exit'], severity: 'critical' },
  { id: '2', type: 'domain', value: 'malware-c2.evil.com', confidence: 87, source: 'MISP', firstSeen: '2026-07-15', lastSeen: '2026-09-06', tags: ['phishing', 'credential-harvest'], severity: 'high' },
  { id: '3', type: 'hash', value: 'a3f2b8c9d4e5f6a7b8c9d0e1f2a3b4c5', confidence: 99, source: 'VirusTotal', firstSeen: '2026-08-20', lastSeen: '2026-09-07', tags: ['ransomware', 'encrypted-payload'], severity: 'critical' },
  { id: '4', type: 'ip', value: '91.215.85.209', confidence: 76, source: 'GreyNoise', firstSeen: '2026-06-10', lastSeen: '2026-09-05', tags: ['scanner', 'mass-exploit'], severity: 'high' },
  { id: '5', type: 'url', value: 'https://phish-login.fake-bank.com/auth', confidence: 92, source: 'PhishTank', firstSeen: '2026-09-01', lastSeen: '2026-09-07', tags: ['phishing', 'financial'], severity: 'high' },
  { id: '6', type: 'email', value: 'admin@malicious-domain.xyz', confidence: 68, source: 'theHarvester', firstSeen: '2026-08-15', lastSeen: '2026-09-04', tags: ['social-eng', 'recon'], severity: 'medium' },
  { id: '7', type: 'hash', value: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', confidence: 85, source: 'Abuse.ch', firstSeen: '2026-07-20', lastSeen: '2026-09-03', tags: ['trojan', 'backdoor'], severity: 'high' },
  { id: '8', type: 'ip', value: '45.77.65.211', confidence: 45, source: 'Shodan', firstSeen: '2026-09-05', lastSeen: '2026-09-07', tags: ['open-ssh', 'brute-force'], severity: 'medium' },
];

const ThreatIntel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [threats, setThreats] = useState<ThreatEntry[]>(MOCK_THREATS);
  const [filteredThreats, setFilteredThreats] = useState<ThreatEntry[]>(MOCK_THREATS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [report, setReport] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<ThreatEntry | null>(null);

  const threatTools = OPEN_SOURCE_TOOLS.find(c => c.id === 'threat');

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredThreats(threats);
    } else {
      setFilteredThreats(threats.filter(t => t.severity === activeFilter));
    }
  }, [activeFilter, threats]);

  const handleLookup = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setReport(null);
    try {
      const result = await performOsintTrace(`Threat intelligence lookup for IOC: ${query}. Cross-reference with MISP, AlienVault OTX, VirusTotal, and GreyNoise feeds.`);
      setReport(result.text || result);
    } catch (err) {
      setReport("Evans, the threat intel feed returned empty. The IOC might not be indexed yet or the API connection dropped.");
    } finally {
      setIsSearching(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ip': return <Globe size={14} />;
      case 'domain': return <Globe size={14} />;
      case 'hash': return <Database size={14} />;
      case 'url': return <ExternalLink size={14} />;
      case 'email': return <ShieldAlert size={14} />;
      default: return <Activity size={14} />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-600 rounded-2xl shadow-lg shadow-cyan-900/20">
            <Radar className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-tighter">Threat Intelligence Center</h2>
            <p className="text-zinc-500 text-sm">Real-time IOC analysis and cross-feed correlation for Evans.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 font-mono flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            FEEDS: {threats.length} ACTIVE
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">IOC Lookup</h3>
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-3 top-3 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="IP, Domain, Hash, URL..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-600 font-mono"
                />
              </div>
              <button 
                onClick={handleLookup}
                disabled={isSearching || !query.trim()}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/20"
              >
                {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Radar size={18} />}
                Cross-Reference IOC
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Severity Filter</h3>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'critical', 'high', 'medium', 'low'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                    activeFilter === filter 
                      ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400' 
                      : 'bg-black/20 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Integrated Feeds</h3>
            <div className="space-y-2">
              {['AlienVault OTX', 'MISP', 'VirusTotal', 'Abuse.ch', 'GreyNoise', 'Shodan'].map(feed => (
                <div key={feed} className="flex items-center justify-between text-[10px] font-mono p-2 bg-black/20 rounded-lg">
                  <span className="text-zinc-500">{feed}</span>
                  <span className="text-green-400">LIVE</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Open Source Tools</h3>
            <div className="space-y-2">
              {threatTools?.tools.slice(0, 5).map(tool => (
                <div key={tool.name} className="flex items-center justify-between text-[10px] font-mono p-2 bg-black/20 rounded-lg border border-zinc-800/50">
                  <span className="text-zinc-400">{tool.name}</span>
                  {tool.github && (
                    <a href={`https://github.com/${tool.github}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Threat Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  LIVE THREAT FEED ({filteredThreats.length} indicators)
                </span>
              </div>
              <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="divide-y divide-zinc-800/50 max-h-[500px] overflow-y-auto">
              {filteredThreats.map(threat => (
                <div 
                  key={threat.id}
                  onClick={() => setSelectedThreat(selectedThreat?.id === threat.id ? null : threat)}
                  className={`px-6 py-4 cursor-pointer transition-colors hover:bg-zinc-800/30 ${
                    selectedThreat?.id === threat.id ? 'bg-zinc-800/50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(threat.severity)}`}>
                        {getTypeIcon(threat.type)}
                      </div>
                      <div>
                        <p className="text-sm font-mono text-white font-bold">{threat.value}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {threat.source} &middot; Last seen: {threat.lastSeen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {threat.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-zinc-800 rounded text-[8px] text-zinc-400 font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getSeverityColor(threat.severity)}`}>
                        {threat.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedThreat && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 animate-in slide-in-from-bottom duration-300">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">IOC Detail: {selectedThreat.value}</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 uppercase mb-1">Type</p>
                  <p className="text-xs text-white font-mono">{selectedThreat.type.toUpperCase()}</p>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 uppercase mb-1">First Seen</p>
                  <p className="text-xs text-white font-mono">{selectedThreat.firstSeen}</p>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 uppercase mb-1">Confidence</p>
                  <p className="text-xs text-cyan-400 font-mono">{selectedThreat.confidence}%</p>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                {selectedThreat.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-cyan-600/10 border border-cyan-600/20 rounded-lg text-[10px] text-cyan-400 font-mono">
                    {tag}
                  </span>
                ))}
              </div>
              <QuickReply context={`Threat Intel: ${selectedThreat.value}`} />
            </div>
          )}

          {report && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-cyan-500" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Intelligence Report</h3>
              </div>
              <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono border-l-2 border-cyan-500/30 pl-6 py-2">
                {report}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatIntel;
