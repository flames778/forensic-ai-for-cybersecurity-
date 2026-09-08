
import React, { useState } from 'react';
import { UserCheck, ShieldAlert, Loader2, Brain, MessageCircle, AlertCircle, FileText, Send, ExternalLink } from 'lucide-react';
import { simulateSocialEng } from '../services/geminiService';
import { OPEN_SOURCE_TOOLS } from '../lib/openSourceTools';
import QuickReply from './QuickReply';
import ToolRunner from './ToolRunner';

const SocialEngLab: React.FC = () => {
  const [scenario, setScenario] = useState('');
  const [report, setReport] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async () => {
    if (!scenario.trim()) return;
    setIsSimulating(true);
    setReport(null);
    try {
      const result = await simulateSocialEng(scenario);
      setReport(result);
    } catch (err) {
      setReport("Evans, the psychological model failed to compile. The scenario might be too complex for our current simulation buffer.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-amber-600 rounded-2xl shadow-lg shadow-amber-900/20">
          <UserCheck className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Social Engineering Lab</h2>
          <p className="text-zinc-500 text-sm">Analyze psychological triggers and phishing vectors for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Scenario Designer</h3>
            <div className="space-y-4">
              <textarea 
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Describe the attack scenario (e.g., Phishing email to HR claiming to be a payroll update, or Vishing call to IT support)..."
                className="w-full h-48 bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-amber-600 transition-all resize-none font-mono"
              />
              <button 
                onClick={runSimulation}
                disabled={isSimulating || !scenario.trim()}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                {isSimulating ? <Loader2 className="animate-spin" size={20} /> : <Brain size={20} />}
                {isSimulating ? 'Simulating Human Response...' : 'Run Psych-Test'}
              </button>
            </div>
          </div>

          <ToolRunner
            categoryLabel="Social Engineering — Real Execution"
            color="orange"
            tools={[
              { id: 'set', name: 'SET', github: 'trustedsec/social-engineer-toolkit' },
              { id: 'gophish', name: 'GoPhish', github: 'gophish/gophish' },
              { id: 'zphisher', name: 'Zphisher', github: 'htr-tech/zphisher' },
            ]}
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col min-h-[500px] overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vector Analysis Report</span>
            <MessageCircle size={14} className="text-amber-500" />
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto">
            {isSimulating ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 border-4 border-amber-600/10 border-t-amber-600 rounded-full animate-spin" />
                <p className="text-sm font-mono text-zinc-400">Evans, I'm mapping the victim's likely cognitive biases...</p>
              </div>
            ) : report ? (
              <div className="animate-in fade-in duration-500">
                <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-2xl mb-6 flex gap-4 items-start">
                   <div className="p-2 bg-amber-600/20 rounded-lg text-amber-500">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Human Vulnerability Audit</p>
                    <p className="text-xs text-zinc-400 italic">"Evans, people are always the weakest link. I've broken down why this scenario works and how to patch the 'human firewall'."</p>
                  </div>
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-mono mb-8 border-l-2 border-amber-500/30 pl-6 py-2">
                  {report}
                </div>
                <QuickReply context="Social Engineering Audit" initialReport={report} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-700 opacity-40">
                <FileText size={48} className="mb-4" />
                <p className="text-xs uppercase font-bold">Awaiting Vector Ingestion</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialEngLab;
