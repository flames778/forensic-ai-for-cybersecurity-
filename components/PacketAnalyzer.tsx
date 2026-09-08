
import React, { useState, useRef, useEffect } from 'react';
import { Radio, ShieldAlert, Loader2, Terminal, Download, Filter, Search, Activity, Pause, Play } from 'lucide-react';
import { OPEN_SOURCE_TOOLS } from '../lib/openSourceTools';

interface PacketEntry {
  no: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  color: string;
}

const MOCK_PACKETS: PacketEntry[] = [
  { no: 1, time: '00:00:00.000', source: '192.168.1.105', destination: '93.184.216.34', protocol: 'TCP', length: 66, info: 'SYN -> [SYN, ACK] Seq=0 Ack=1 Win=65535', color: '#3b82f6' },
  { no: 2, time: '00:00:00.003', source: '93.184.216.34', destination: '192.168.1.105', protocol: 'TCP', length: 66, info: '[SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0', color: '#10b981' },
  { no: 3, time: '00:00:00.006', source: '192.168.1.105', destination: '93.184.216.34', protocol: 'TLSv1.3', length: 312, info: 'Client Hello, SNI=example.com', color: '#8b5cf6' },
  { no: 4, time: '00:00:00.050', source: '93.184.216.34', destination: '192.168.1.105', protocol: 'TLSv1.3', length: 1420, info: 'Server Hello, Certificate, Server Key Exchange', color: '#8b5cf6' },
  { no: 5, time: '00:00:00.055', source: '192.168.1.105', destination: '93.184.216.34', protocol: 'HTTP', length: 256, info: 'GET /index.html HTTP/1.1 Host: example.com', color: '#f59e0b' },
  { no: 6, time: '00:00:00.120', source: '93.184.216.34', destination: '192.168.1.105', protocol: 'HTTP', length: 1420, info: 'HTTP/1.1 200 OK (text/html)', color: '#f59e0b' },
  { no: 7, time: '00:00:00.180', source: '192.168.1.105', destination: '185.220.101.45', protocol: 'DNS', length: 78, info: 'Standard query A suspicious-domain.xyz', color: '#ef4444' },
  { no: 8, time: '00:00:00.185', source: '185.220.101.45', destination: '192.168.1.105', protocol: 'DNS', length: 94, info: 'Standard query response A 91.215.85.209', color: '#ef4444' },
  { no: 9, time: '00:00:00.190', source: '192.168.1.105', destination: '91.215.85.209', protocol: 'TCP', length: 66, info: 'SYN -> Port 4444 (SUSPICIOUS)', color: '#ef4444' },
  { no: 10, time: '00:00:00.200', source: '91.215.85.209', destination: '192.168.1.105', protocol: 'TCP', length: 66, info: '[SYN, ACK] Port 4444 - Reverse Shell Possible', color: '#ef4444' },
  { no: 11, time: '00:00:00.250', source: '192.168.1.105', destination: '10.0.0.1', protocol: 'ICMP', length: 98, info: 'Echo (ping) request', color: '#6366f1' },
  { no: 12, time: '00:00:00.255', source: '10.0.0.1', destination: '192.168.1.105', protocol: 'ICMP', length: 98, info: 'Echo (ping) reply', color: '#6366f1' },
];

const PacketAnalyzer: React.FC = () => {
  const [packets, setPackets] = useState<PacketEntry[]>(MOCK_PACKETS);
  const [filteredPackets, setFilteredPackets] = useState<PacketEntry[]>(MOCK_PACKETS);
  const [filter, setFilter] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('all');
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<PacketEntry | null>(null);
  const [captureStats, setCaptureStats] = useState({ total: 12, tcp: 6, http: 2, dns: 2, tls: 2, icmp: 2, suspicious: 2 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const packetTools = OPEN_SOURCE_TOOLS.find(c => c.id === 'packet');

  useEffect(() => {
    let filtered = packets;
    if (protocolFilter !== 'all') {
      filtered = filtered.filter(p => p.protocol.toLowerCase().includes(protocolFilter.toLowerCase()));
    }
    if (filter) {
      const lower = filter.toLowerCase();
      filtered = filtered.filter(p =>
        p.source.includes(lower) ||
        p.destination.includes(lower) ||
        p.info.toLowerCase().includes(lower) ||
        p.protocol.toLowerCase().includes(lower)
      );
    }
    setFilteredPackets(filtered);
  }, [filter, protocolFilter, packets]);

  const toggleCapture = () => {
    setIsCapturing(!isCapturing);
  };

  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case 'TCP': return 'text-blue-400';
      case 'HTTP': return 'text-amber-400';
      case 'TLSv1.3': case 'TLSv1.2': return 'text-purple-400';
      case 'DNS': return 'text-red-400';
      case 'ICMP': return 'text-indigo-400';
      case 'UDP': return 'text-green-400';
      case 'ARP': return 'text-pink-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-900/20">
            <Radio className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-tighter">Packet Capture Analyzer</h2>
            <p className="text-zinc-500 text-sm">Deep packet inspection and traffic analysis for Evans.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className={`px-3 py-1 rounded-full text-[10px] font-mono flex items-center gap-2 ${
            isCapturing ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isCapturing ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            {isCapturing ? 'CAPTURING' : 'IDLE'}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Capture Control</h3>
            <div className="space-y-4">
              <button 
                onClick={toggleCapture}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isCapturing 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                }`}
              >
                {isCapturing ? <Pause size={20} /> : <Play size={20} />}
                {isCapturing ? 'Stop Capture' : 'Start Capture'}
              </button>
              
              <div className="relative group">
                <Filter className="absolute left-3 top-3 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter packets..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Protocol Filter</h3>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'tcp', 'http', 'dns', 'tls', 'icmp'].map(proto => (
                <button 
                  key={proto}
                  onClick={() => setProtocolFilter(proto)}
                  className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                    protocolFilter === proto 
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' 
                      : 'bg-black/20 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                  }`}
                >
                  {proto}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Capture Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Packets', val: captureStats.total, color: 'text-white' },
                { label: 'TCP', val: captureStats.tcp, color: 'text-blue-400' },
                { label: 'HTTP', val: captureStats.http, color: 'text-amber-400' },
                { label: 'DNS', val: captureStats.dns, color: 'text-red-400' },
                { label: 'TLS', val: captureStats.tls, color: 'text-purple-400' },
                { label: 'Suspicious', val: captureStats.suspicious, color: 'text-red-500' },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-[10px] font-mono border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">{item.label}</span>
                  <span className={item.color}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Analysis Tools</h3>
            <div className="space-y-2">
              {packetTools?.tools.slice(0, 6).map(tool => (
                <div key={tool.name} className="flex items-center justify-between text-[10px] font-mono p-2 bg-black/20 rounded-lg border border-zinc-800/50">
                  <span className="text-zinc-400">{tool.name}</span>
                  {tool.command && (
                    <button className="text-emerald-400 hover:text-emerald-300 text-[8px]">
                      COPY
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Packet List */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  PACKET LIST ({filteredPackets.length} packets)
                </span>
              </div>
              <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                <Download size={14} />
              </button>
            </div>

            {/* Table Header */}
            <div className="px-6 py-2 border-b border-zinc-800 bg-zinc-900/30 grid grid-cols-12 gap-4 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
              <div className="col-span-1">No.</div>
              <div className="col-span-2">Time</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2">Destination</div>
              <div className="col-span-1">Proto</div>
              <div className="col-span-1">Len</div>
              <div className="col-span-3">Info</div>
            </div>

            {/* Packet Rows */}
            <div ref={scrollRef} className="max-h-[500px] overflow-y-auto divide-y divide-zinc-800/30">
              {filteredPackets.map(packet => (
                <div 
                  key={packet.no}
                  onClick={() => setSelectedPacket(selectedPacket?.no === packet.no ? null : packet)}
                  className={`px-6 py-3 grid grid-cols-12 gap-4 text-[11px] font-mono cursor-pointer transition-colors hover:bg-zinc-800/30 ${
                    selectedPacket?.no === packet.no ? 'bg-zinc-800/50' : ''
                  } ${packet.info.includes('SUSPICIOUS') || packet.info.includes('Reverse Shell') ? 'bg-red-900/10' : ''}`}
                >
                  <div className="col-span-1 text-zinc-500">{packet.no}</div>
                  <div className="col-span-2 text-zinc-400">{packet.time}</div>
                  <div className="col-span-2 text-zinc-300 truncate">{packet.source}</div>
                  <div className="col-span-2 text-zinc-300 truncate">{packet.destination}</div>
                  <div className={`col-span-1 font-bold ${getProtocolColor(packet.protocol)}`}>{packet.protocol}</div>
                  <div className="col-span-1 text-zinc-500">{packet.length}</div>
                  <div className="col-span-3 text-zinc-400 truncate">
                    {packet.info.includes('SUSPICIOUS') || packet.info.includes('Reverse Shell') ? (
                      <span className="text-red-400">{packet.info}</span>
                    ) : packet.info}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packet Detail */}
          {selectedPacket && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Packet #{selectedPacket.no} Detail</h3>
                {(selectedPacket.info.includes('SUSPICIOUS') || selectedPacket.info.includes('Reverse Shell')) && (
                  <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-400 font-bold">
                    THREAT DETECTED
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 uppercase mb-1">Source</p>
                  <p className="text-xs text-white font-mono">{selectedPacket.source}</p>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 uppercase mb-1">Destination</p>
                  <p className="text-xs text-white font-mono">{selectedPacket.destination}</p>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 uppercase mb-1">Protocol</p>
                  <p className={`text-xs font-mono font-bold ${getProtocolColor(selectedPacket.protocol)}`}>{selectedPacket.protocol}</p>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <p className="text-[9px] text-zinc-600 uppercase mb-1">Length</p>
                  <p className="text-xs text-white font-mono">{selectedPacket.length} bytes</p>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 mb-4">
                <p className="text-[9px] text-zinc-600 uppercase mb-2">Info</p>
                <p className="text-sm text-zinc-300 font-mono">{selectedPacket.info}</p>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800">
                <p className="text-[9px] text-zinc-600 uppercase mb-2">Hex Dump (Simulated)</p>
                <pre className="text-[10px] text-zinc-500 font-mono overflow-x-auto">
{`0000  ${Array.from({length: 32}, (_, i) => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ')}
0020  ${Array.from({length: 32}, (_, i) => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ')}
0040  ${Array.from({length: 20}, (_, i) => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ')}
                `.trim()}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacketAnalyzer;
