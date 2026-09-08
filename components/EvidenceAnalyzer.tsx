
import React, { useState } from 'react';
import { FileText, AlertTriangle, FileSearch, CheckCircle2, Loader2, Upload, MessageSquare, ShieldCheck, BrainCircuit, ExternalLink } from 'lucide-react';
import { analyzeForensicLogs } from '../services/geminiService';
import { OPEN_SOURCE_TOOLS } from '../lib/openSourceTools';
import QuickReply from './QuickReply';
import ToolRunner from './ToolRunner';

const EvidenceAnalyzer: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeForensicLogs(content);
      setAnalysis(result);
    } catch (err) {
      setAnalysis("Evans, the analysis engine stalled. The log data might be corrupted or malformed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-900/20">
          <BrainCircuit className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Evidence Summarizer</h2>
          <p className="text-zinc-500 text-sm">Automated pattern recognition and behavior surveillance for Evans.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ingestion Area */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Raw Log Buffer</span>
              <label className="flex items-center gap-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[10px] font-bold text-white cursor-pointer transition-colors">
                <Upload size={12} />
                Ingest File
                <input type="file" className="hidden" accept=".txt,.log,.json" onChange={handleFileUpload} />
              </label>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste chat transcripts, server logs, or forensic file lists here..."
              className="w-full h-96 bg-transparent border-none focus:ring-0 text-zinc-300 font-mono text-xs p-6 resize-none"
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content.trim()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <FileSearch size={20} />}
            Run Forensic Scan
          </button>
        </div>

        {/* Insights Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <ToolRunner
            categoryLabel="Evidence Analysis — Real Execution"
            color="blue"
            tools={[
              { id: 'strings', name: 'strings' },
              { id: 'file', name: 'file' },
              { id: 'readelf', name: 'readelf' },
              { id: 'yara', name: 'YARA' },
              { id: 'clamscan', name: 'ClamAV' },
              { id: 'floss', name: 'FLOSS' },
            ]}
          />

          <div className="bg-amber-900/10 border border-amber-900/30 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              Behavioral Warnings
            </h3>
            <p className="text-[10px] text-amber-500/80 leading-relaxed font-mono">
              [SYSTEM]: Evans, the engine is tuned to detect manipulation, threats, and illegal solicitations. Results are processed locally and should be verified for legal compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {analysis && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="px-6 py-4 border-b border-zinc-800 bg-indigo-600/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              Scan Results: Behavioral Audit
            </h3>
            <button className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
              <CheckCircle2 size={14} />
              Export PDF
            </button>
          </div>
          <div className="p-8 prose prose-invert prose-indigo max-w-none text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {analysis}
            <div className="mt-8 border-t border-zinc-800 pt-6">
              <QuickReply context="Log Evidence Analysis" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceAnalyzer;
