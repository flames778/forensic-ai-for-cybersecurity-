
import React, { useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Terminal, Download, Maximize2, RefreshCcw, Share2, ZoomIn, ExternalLink, Play, CheckCircle, XCircle } from 'lucide-react';
import { getNetworkInsights } from '../services/geminiService';
import { OPEN_SOURCE_TOOLS } from '../lib/openSourceTools';
import { runRealTool, checkToolsAvailability } from '../services/realToolsService';
import ToolRunner from './ToolRunner';

const NetworkMapper: React.FC = () => {
  const [data, setData] = useState<{ nodes: any[], links: any[] }>({
    nodes: [
      { id: 'Evans', label: 'Investigator', type: 'user' },
      { id: 'Suspect_01', label: 'Primary Target', type: 'user' },
      { id: '192.168.4.12', label: 'Node: Entrance', type: 'ip' },
      { id: 'twitter_target', label: '@target_osint', type: 'domain' }
    ],
    links: [
      { source: 'Evans', target: 'Suspect_01', label: 'Investigating' },
      { source: 'Suspect_01', target: '192.168.4.12', label: 'Login Origin' },
      { source: 'Suspect_01', target: 'twitter_target', label: 'Identified Alias' }
    ]
  });
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toolOutput, setToolOutput] = useState<string>('');
  const [toolStatus, setToolStatus] = useState<Record<string, boolean>>({});
  const [toolTarget, setToolTarget] = useState('');
  const [runningTool, setRunningTool] = useState<string | null>(null);

  const loadToolStatus = async () => {
    try {
      const status = await checkToolsAvailability();
      setToolStatus(status);
    } catch (err) {
      console.error('Failed to check tools:', err);
    }
  };

  React.useEffect(() => { loadToolStatus(); }, []);

  const executeTool = async (tool: string, options?: any) => {
    if (!toolTarget) { setToolOutput('Error: Enter a target IP or hostname first'); return; }
    setRunningTool(tool);
    setToolOutput(`Executing ${tool} against ${toolTarget}...\n`);
    try {
      const result = await runRealTool(tool, toolTarget, options);
      setToolOutput(`[${tool.toUpperCase()}] Command: ${result.command}\nStatus: ${result.status}\nDuration: ${result.duration}ms\n\n${result.output}${result.stderr ? '\n\nSTDERR:\n' + result.stderr : ''}`);
    } catch (err: any) {
      setToolOutput(`Error: ${err.message}`);
    } finally {
      setRunningTool(null);
    }
  };

  const processData = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const result = await getNetworkInsights(input);
      setData(result);
      setInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const nodeColor = (type: string) => {
    switch (type) {
      case 'user': return '#3b82f6';
      case 'ip': return '#10b981';
      case 'domain': return '#f59e0b';
      case 'server': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6 animate-in fade-in duration-700">
       <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Share2 className="text-emerald-500" />
            Digital Footprint Mapper
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Evans, map connections between IPs, aliases, and identities.</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Input Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Terminal size={14} className="text-emerald-500" />
              Ingest Relation Logs
            </h3>
            <textarea
              className="w-full h-48 bg-black/40 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-emerald-300 placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors mb-4"
              placeholder="Evans, paste WHOIS, trace results, or chat connection snippets here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              onClick={processData}
              disabled={isProcessing}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 rounded-2xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              {isProcessing ? <RefreshCcw size={16} className="animate-spin" /> : <ZoomIn size={16} />}
              Render Relationships
            </button>
          </div>

          <ToolRunner
            categoryLabel="Network Tools — Real Execution"
            color="emerald"
            tools={[
              { id: 'nmap', name: 'Nmap', github: 'nmap/nmap' },
              { id: 'masscan', name: 'Masscan', github: 'robertdavidgraham/masscan' },
              { id: 'tcpdump', name: 'Tcpdump' },
              { id: 'nc', name: 'Netcat' },
              { id: 'zmap', name: 'Zmap', github: 'zmap/zmap' },
              { id: 'hping3', name: 'Hping3' },
              { id: 'ncat', name: 'Ncat' },
            ]}
          />
        </div>

        {/* Graph Panel */}
        <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button className="p-2.5 bg-zinc-900/90 rounded-xl text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-700">
              <Download size={18} />
            </button>
            <button className="p-2.5 bg-zinc-900/90 rounded-xl text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-700">
              <Maximize2 size={18} />
            </button>
          </div>
          
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

          <ForceGraph2D
            graphData={data}
            nodeLabel="label"
            nodeColor={node => nodeColor((node as any).type)}
            linkColor={() => '#3f3f46'}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            linkWidth={1.5}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.label;
              const fontSize = 14 / globalScale;
              ctx.font = `${fontSize}px Fira Code`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

              // Shadow/Glow
              ctx.shadowColor = nodeColor(node.type);
              ctx.shadowBlur = 10 / globalScale;

              // Background Label
              ctx.fillStyle = 'rgba(10, 10, 11, 0.95)';
              ctx.beginPath();
              ctx.roundRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 - 12, bckgDimensions[0], bckgDimensions[1], 4 / globalScale);
              ctx.fill();
              ctx.strokeStyle = nodeColor(node.type);
              ctx.lineWidth = 1 / globalScale;
              ctx.stroke();

              // Text
              ctx.shadowBlur = 0;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#ffffff';
              ctx.fillText(label, node.x, node.y - 12);

              // Node Circle
              ctx.beginPath();
              ctx.arc(node.x, node.y, 6 / globalScale, 0, 2 * Math.PI, false);
              ctx.fillStyle = nodeColor(node.type);
              ctx.fill();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NetworkMapper;
