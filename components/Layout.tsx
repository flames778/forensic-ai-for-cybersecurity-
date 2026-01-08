
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ModuleType } from '../types';
import { Shield, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeModule: ModuleType;
  setModule: (module: ModuleType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeModule, setModule }) => {
  return (
    <div className="flex h-screen w-full bg-[#0a0a0b] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-[#0d0d0f] flex flex-col p-4 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-8 px-2 flex-shrink-0">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Forensix <span className="text-blue-500 text-[10px] align-top">ELITE</span></h1>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="px-2 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tactical Suite</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setModule(item.id as ModuleType)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                activeModule === item.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent'
              }`}
            >
              <span className={activeModule === item.id ? 'text-blue-400' : 'group-hover:text-blue-400 transition-colors'}>
                {item.icon}
              </span>
              <span className="font-semibold text-xs">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-4 border-t border-zinc-800 flex-shrink-0">
          <div className="p-3 bg-zinc-900/50 rounded-xl mb-4 border border-zinc-800/50">
            <p className="text-[9px] font-bold text-zinc-500 mb-1 uppercase tracking-tighter">Authorized Operator</p>
            <p className="text-xs font-bold text-white font-mono">EVANS_01</p>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-600 hover:text-red-400 transition-colors text-xs font-bold">
            <LogOut size={16} />
            SHUTDOWN SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full animate-pulse" />
        
        <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#0a0a0b]/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Link: Active</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-px bg-zinc-800" />
            <span className="text-[10px] font-mono text-zinc-500">{new Date().toLocaleTimeString()} UTC</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
