import React, { useState, useEffect } from 'react';
import { AppConfig } from '../../types';
import { Terminal, Bell, Activity, Cpu, Monitor, Smartphone, ArrowUp, ArrowDown, Wifi } from 'lucide-react';

interface TaskbarProps {
  apps: AppConfig[];
  openWindowIds: string[];
  activeWindowId: string | null;
  onAppClick: (appId: string) => void;
  onStartClick: () => void;
  isStartOpen: boolean;
  onToggleNotifications: () => void;
  notificationCount: number;
  isDualMonitor: boolean;
  onToggleDualMonitor: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  apps,
  openWindowIds,
  activeWindowId,
  onAppClick,
  onStartClick,
  isStartOpen,
  onToggleNotifications,
  notificationCount,
  isDualMonitor,
  onToggleDualMonitor
}) => {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({ cpu: 12, mem: 24, up: 12, down: 45 });

  // Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // System Stats Simulation (Alive effect)
  useEffect(() => {
    const interval = setInterval(() => {
      const spike = Math.random() > 0.9;
      setStats({
        cpu: spike ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 20) + 5,
        mem: Math.floor(Math.random() * 10) + 24,
        up: Math.floor(Math.random() * 50) + 5,
        down: Math.floor(Math.random() * 500) + 20
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 bg-[#0a0a0a] border-t border-green-900 fixed bottom-0 w-full flex items-center justify-between px-0 z-50 select-none font-mono text-xs">
      <div className="flex items-center h-full">
        {/* Start Button / Kernel Menu */}
        <button
            onClick={onStartClick}
            className={`px-4 h-full flex items-center justify-center hover:bg-green-900/30 transition-all border-r border-green-900/50 ${isStartOpen ? 'bg-green-900/50 text-white' : 'text-green-600'}`}
        >
            <div className="flex items-center gap-2 font-bold tracking-wider">
                <Terminal size={14} />
                <span>SYS</span>
            </div>
        </button>

        {/* Workspaces / Running Apps */}
        <div className="flex items-center px-2 gap-1 overflow-x-auto hide-scrollbar max-w-[40vw]">
          {apps.map((app) => {
            const isOpen = openWindowIds.some(id => id.startsWith(app.id));
            const isFocused = activeWindowId?.startsWith(app.id);
            
            if (!isOpen && app.id !== 'gemini' && app.id !== 'files') return null; // Only show running apps or pinned

            return (
              <button
                  key={app.id}
                  onClick={() => onAppClick(app.id)}
                  className={`group relative px-3 h-6 flex items-center justify-center transition-all border shrink-0 ${
                    isFocused 
                      ? 'border-green-500 bg-green-900/20 text-green-400' 
                      : 'border-transparent hover:border-green-800 text-green-700'
                  }`}
                  title={app.title}
              >
                 <div className="flex items-center gap-2">
                   <span className="uppercase">{app.id.substring(0, 3)}</span>
                   {isOpen && <div className="w-1 h-1 bg-green-500 rounded-full" />}
                 </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System Status "i3status" style */}
      <div className="flex items-center h-full text-green-600 divide-x divide-green-900/50 bg-[#050505] shrink-0">
        
        {/* Dynamic System Stats */}
        <div className="flex items-center gap-4 px-3 hidden md:flex opacity-90 text-[10px]">
            <div className={`flex items-center gap-2 w-16 ${stats.cpu > 80 ? 'text-red-500 animate-pulse font-bold' : 'text-green-500'}`}>
                <Cpu size={12} />
                <span>{stats.cpu}%</span>
            </div>
            <div className="flex items-center gap-2 w-16 text-green-600">
                <Activity size={12} />
                <span>{stats.mem}%</span>
            </div>
             <div className="flex items-center gap-3 pl-2 border-l border-green-900/30">
                <div className="flex items-center gap-1 text-blue-400" title="Download">
                    <ArrowDown size={10} />
                    <span className="w-14 text-right">{stats.down}K</span>
                </div>
                <div className="flex items-center gap-1 text-orange-400" title="Upload">
                    <ArrowUp size={10} />
                    <span className="w-10 text-right">{stats.up}K</span>
                </div>
            </div>
        </div>
        
        {/* Dual Monitor Toggle */}
        <button 
            onClick={onToggleDualMonitor}
            className={`h-full px-3 flex items-center justify-center hover:bg-green-900/20 transition-colors ${isDualMonitor ? 'text-green-400 bg-green-900/20' : 'text-green-800'}`}
            title={isDualMonitor ? "Disable Dual Monitor" : "Enable Dual Monitor"}
        >
            <div className="flex items-center gap-2">
                {isDualMonitor ? <Monitor size={14} /> : <Smartphone size={14} />}
                <span className="hidden sm:inline">{isDualMonitor ? 'DUAL' : 'SNGL'}</span>
            </div>
        </button>

        {/* Notification Trigger */}
        <button 
            onClick={onToggleNotifications}
            className={`h-full px-4 flex items-center justify-center hover:bg-green-900/20 relative transition-colors ${notificationCount > 0 ? 'text-green-400 bg-green-900/10' : 'text-green-700'}`}
        >
            <div className="flex items-center gap-2">
                <Bell size={12} className={notificationCount > 0 ? "animate-swing" : ""} />
                {notificationCount > 0 && <span>{notificationCount}</span>}
            </div>
        </button>

        {/* Clock */}
        <div className="flex items-center gap-2 px-4 h-full hover:bg-green-900/20 cursor-pointer bg-[#0f0f0f]" onClick={onToggleNotifications}>
             <span className="font-bold text-green-500">{time.toLocaleTimeString([], { hour12: false })}</span>
        </div>
      </div>
    </div>
  );
};