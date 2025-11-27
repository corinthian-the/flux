import React from 'react';
import { AppConfig } from '../../types';
import { Search, Power, Cpu } from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  apps: AppConfig[];
  onAppClick: (appId: string) => void;
  onClose: () => void;
  onShutdown: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, apps, onAppClick, onClose, onShutdown }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-12 left-0 w-[350px] bg-black border-t border-r border-green-500 shadow-[0_0_30px_rgba(0,255,0,0.1)] z-40 flex flex-col animate-in slide-in-from-bottom-2 duration-150">
      
      <div className="bg-green-900/20 p-2 border-b border-green-800 flex items-center justify-between">
          <span className="text-xs font-bold text-green-400 tracking-widest">SYSTEM_MENU // V.2.0</span>
          <Cpu size={14} className="text-green-600" />
      </div>

      {/* Search */}
      <div className="p-4 border-b border-green-900/30">
        <div className="relative group">
            <Search className="absolute left-3 top-2 text-green-700 group-focus-within:text-green-400" size={14} />
            <input 
                type="text" 
                placeholder="EXECUTE_COMMAND..." 
                className="w-full bg-black border border-green-800 py-1.5 pl-9 pr-4 text-xs text-green-400 placeholder-green-800 focus:outline-none focus:border-green-500 transition-all font-mono uppercase"
                autoFocus
            />
        </div>
      </div>

      {/* App Grid */}
      <div className="p-4 grid grid-cols-2 gap-2">
        {apps.map(app => (
            <button 
                key={app.id} 
                onClick={() => { onAppClick(app.id); onClose(); }}
                className="flex items-center gap-3 p-2 border border-green-900/30 hover:border-green-500 hover:bg-green-900/10 transition-all group text-left"
            >
                <div className="p-1.5 bg-green-900/10 group-hover:bg-green-500/20 transition-colors">
                    <app.icon size={18} className="text-green-600 group-hover:text-green-400" />
                </div>
                <span className="text-xs text-green-500 font-bold uppercase tracking-wider group-hover:text-white">{app.title}</span>
            </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-green-900/50 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono text-green-600">ADMIN_ACCESS_GRANTED</span>
        </div>
        <button 
            onClick={onShutdown}
            className="p-1.5 hover:bg-red-900/30 hover:text-red-500 text-green-800 transition-colors border border-transparent hover:border-red-900/50"
            title="SYSTEM_HALT"
        >
            <Power size={14} />
        </button>
      </div>
    </div>
  );
};