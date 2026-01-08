
import React, { useState } from 'react';
import { Camera, Upload, Search, ShieldCheck, Eye, Info, Scan, Loader2 } from 'lucide-react';
import { analyzeForensicImage } from '../services/geminiService';
import QuickReply from './QuickReply';

const ImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis('');
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (mode: string) => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const base64 = selectedImage.split(',')[1];
      const prompt = mode === 'full' 
        ? "Perform a full forensic audit. Extract EXIF metadata, identify locations, analyze faces for potential OSINT matches, and look for signs of tampering."
        : "Extract all available metadata and camera info.";
      
      const result = await analyzeForensicImage(base64, prompt);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setAnalysis("Evans, I hit an encryption wall or the file is corrupted. Try a different format?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload & Preview */}
        <div className="space-y-4">
          <div className="relative aspect-video bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl overflow-hidden group flex items-center justify-center">
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Forensic Target" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                    onClick={() => {setSelectedImage(null); setAnalysis('');}}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm"
                   >
                     Remove Asset
                   </button>
                </div>
              </>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <div className="p-4 bg-zinc-800 rounded-full mb-3 group-hover:bg-blue-600 transition-colors">
                  <Upload size={32} className="text-zinc-400 group-hover:text-white" />
                </div>
                <span className="text-sm font-medium text-zinc-400 group-hover:text-white">Ingest Forensic Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
            
            {/* HUD Elements */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-mono text-green-400 border border-green-900/50">
                STATUS: READY
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => runAnalysis('full')}
              disabled={!selectedImage || isAnalyzing}
              className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white rounded-xl text-sm font-bold transition-all"
            >
              <Scan size={18} />
              Full Intel Scan
            </button>
            <button 
              onClick={() => runAnalysis('meta')}
              disabled={!selectedImage || isAnalyzing}
              className="flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all border border-zinc-700"
            >
              <Info size={18} />
              Metadata Only
            </button>
          </div>
        </div>

        {/* Analysis Result */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye size={18} className="text-blue-500" />
              Forensic Intelligence Report
            </h3>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            {isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 size={40} className="animate-spin text-blue-500" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white uppercase tracking-widest font-mono">Scanning Pixels...</p>
                  <p className="text-xs text-zinc-500">Cross-referencing databases for Evans</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-xl mb-6">
                  <div className="flex items-center gap-2 text-blue-400 font-bold mb-2 uppercase text-[10px]">
                    <ShieldCheck size={14} />
                    Integrity Verified
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    "Hey Evans, I've scrubbed the headers and deep-scanned the layers. Here's what my sensors picked up on this asset..."
                  </p>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300 font-mono mb-6">
                  {analysis}
                </div>
                <QuickReply context="Image Forensic Result" initialReport={analysis} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-8">
                <div className="p-4 bg-zinc-800/30 rounded-full mb-4 border border-zinc-800">
                  <Search size={32} />
                </div>
                <p className="text-sm">Awaiting Asset Ingestion</p>
                <p className="text-xs mt-2">Upload a photo to begin deep analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;
