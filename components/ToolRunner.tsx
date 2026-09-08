import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertTriangle, Loader2, Terminal, ExternalLink, Copy } from 'lucide-react';
import { checkToolsAvailability, runRealTool } from '../services/realToolsService';

interface ToolInfo {
  id: string;
  name: string;
  github?: string;
  category?: string;
  paramHint?: string;
}

interface ToolRunnerProps {
  tools: ToolInfo[];
  target?: string;
  color?: string;
  categoryLabel?: string;
  defaultTarget?: string;
}

const ToolRunner: React.FC<ToolRunnerProps> = ({ tools, target: externalTarget, color = 'emerald', categoryLabel = 'Tools', defaultTarget = '' }) => {
  const [target, setTarget] = useState(defaultTarget);
  const [toolStatus, setToolStatus] = useState<Record<string, boolean>>({});
  const [running, setRunning] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const [outputTitle, setOutputTitle] = useState<string>('');
  const [statusChecked, setStatusChecked] = useState(false);

  const checkAll = async () => {
    try {
      const s = await checkToolsAvailability();
      setToolStatus(s);
      setStatusChecked(true);
    } catch {}
  };

  React.useEffect(() => { checkAll(); }, []);

  const execute = async (tool: string) => {
    const t = externalTarget || target;
    if (!t && !['tcpdump', 'tshark', 'dumpcap', 'cowrie', 'conpot', 'opencanary', 'set', 'gophish', 'zphisher', 'radamsa', 'crunch', 'tor', 'empire'].includes(tool)) {
      setOutput(`Error: Enter a target first`);
      return;
    }
    setRunning(tool);
    setOutputTitle(`Running ${tool}...`);
    setOutput('');
    try {
      const result = await runRealTool(tool, t);
      let statusIcon = '';
      if (result.status === 'success') statusIcon = '✅';
      else if (result.status === 'not_installed') statusIcon = '❌ NOT INSTALLED';
      else if (result.status === 'gui_only') statusIcon = '🖥️ GUI ONLY';
      else if (result.status === 'requires_hardware') statusIcon = '⚠️ REQUIRES HARDWARE';
      else statusIcon = '⚠️ ERROR';

      let out = `${statusIcon} | ${result.tool} | ${result.duration}ms\n`;
      out += `Command: ${result.command || 'N/A'}\n`;
      out += `─`.repeat(60) + '\n';
      out += result.output || '';
      if (result.stderr) out += `\n\nSTDERR:\n${result.stderr}`;
      if (result.installHint) out += `\n\n📦 Install: ${result.installHint}`;

      setOutputTitle(`${tool} — ${result.status}`);
      setOutput(out);
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
      setOutputTitle(`${tool} — error`);
    } finally {
      setRunning(null);
    }
  };

  const copyCommand = (tool: string) => {
    const t = externalTarget || target;
    navigator.clipboard.writeText(`${tool} ${t || '<target>'}`);
  };

  const colorMap: Record<string, string> = {
    emerald: 'emerald', orange: 'orange', blue: 'blue', red: 'red', purple: 'purple', yellow: 'yellow', cyan: 'cyan', zinc: 'zinc', indigo: 'indigo', pink: 'pink',
  };
  const c = colorMap[color] || 'emerald';

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-3xl p-6`}>
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Terminal size={14} className={`text-${c}-500`} />
        {categoryLabel}
        {statusChecked && (
          <span className="ml-auto text-[8px] text-zinc-600">
            {tools.filter(t => toolStatus[t.id]).length}/{tools.length} installed
          </span>
        )}
      </h3>

      {!externalTarget && (
        <div className="mb-4">
          <input
            className="w-full bg-black/40 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Target IP, URL, or file path..."
            value={target}
            onChange={e => setTarget(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-1.5 max-h-60 overflow-y-auto mb-3">
        {tools.map(tool => {
          const installed = toolStatus[tool.id];
          return (
            <div key={tool.id} className="flex items-center justify-between text-[10px] font-mono py-1 px-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                {installed ? <CheckCircle size={10} className="text-emerald-500 flex-shrink-0" /> : <XCircle size={10} className="text-zinc-600 flex-shrink-0" />}
                <span className={`${installed ? 'text-zinc-300' : 'text-zinc-600'} truncate`}>{tool.name}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => copyCommand(tool.name.toLowerCase())} className="text-zinc-600 hover:text-zinc-400 transition-colors" title="Copy command">
                  <Copy size={8} />
                </button>
                {tool.github && (
                  <a href={`https://github.com/${tool.github}`} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400 transition-colors">
                    <ExternalLink size={8} />
                  </a>
                )}
                <button
                  onClick={() => execute(tool.id)}
                  disabled={running === tool.id}
                  className={`flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded transition-colors ${
                    running === tool.id
                      ? 'text-zinc-600 bg-zinc-800'
                      : installed
                        ? `text-${c}-400 hover:bg-${c}-900/30`
                        : 'text-zinc-600 hover:bg-zinc-800'
                  }`}
                >
                  {running === tool.id ? <Loader2 size={8} className="animate-spin" /> : <Play size={8} />}
                  {running === tool.id ? '...' : 'RUN'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {output && (
        <div className="bg-black/60 border border-zinc-800 rounded-xl p-3 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-zinc-400">{outputTitle}</span>
            <button onClick={() => setOutput('')} className="text-zinc-600 hover:text-zinc-400 text-[8px]">CLEAR</button>
          </div>
          <pre className="text-[10px] font-mono text-emerald-300 whitespace-pre-wrap break-words">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default ToolRunner;
