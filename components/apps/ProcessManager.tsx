import React, { useState, useEffect } from 'react';
import { Activity, XCircle, AlertTriangle, Cpu } from 'lucide-react';
import { WindowState } from '../../types';

interface ProcessManagerProps {
  windows?: WindowState[];
  onKill?: (id: string) => void;
}

interface Process {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  time: string;
  command: string;
  windowId?: string; // If it maps to a real window
  isSystem?: boolean; // System processes cannot be killed
}

export const ProcessManager: React.FC<ProcessManagerProps> = ({ windows = [], onKill }) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedPid, setSelectedPid] = useState<number | null>(null);

  // Initialize System Processes
  const systemProcesses: Process[] = [
    { pid: 1, user: 'root', cpu: 0.1, mem: 0.5, time: '00:01:23', command: '/sbin/init', isSystem: true },
    { pid: 204, user: 'root', cpu: 0.0, mem: 0.1, time: '00:00:45', command: '[kworker/u2:1]', isSystem: true },
    { pid: 892, user: 'root', cpu: 1.2, mem: 3.4, time: '00:05:32', command: 'gemini-daemon', isSystem: true },
    { pid: 1120, user: 'root', cpu: 0.5, mem: 1.1, time: '00:02:15', command: 'flux-compositor', isSystem: true },
  ];

  // Merge Real Windows into Process List
  useEffect(() => {
    // Map windows to processes
    const windowProcs: Process[] = windows.map((w, i) => ({
        pid: 3000 + i + parseInt(w.id.split('-').pop() || '0') % 1000,
        user: 'user',
        cpu: Math.random() * 5,
        mem: Math.random() * 10 + 5,
        time: '00:00:' + Math.floor(Math.random() * 60).toString().padStart(2, '0'),
        command: w.title,
        windowId: w.id,
        isSystem: false
    }));

    setProcesses([...systemProcesses, ...windowProcs]);
  }, [windows]);

  // Live Update Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: p.windowId ? Math.max(0, p.cpu + (Math.random() - 0.5) * 5) : p.cpu, // Active apps fluctuate more
        mem: p.windowId ? Math.max(0, p.mem + (Math.random() - 0.5) * 1) : p.mem
      })).sort((a, b) => b.cpu - a.cpu));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKill = () => {
      if (!selectedPid || !onKill) return;
      const target = processes.find(p => p.pid === selectedPid);
      if (target && target.windowId) {
          onKill(target.windowId);
          setSelectedPid(null);
      }
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-500 font-mono text-xs select-none p-2">
      <div className="flex justify-between border-b border-green-900 pb-1 mb-2">
        <div className="flex gap-4">
            <span className="font-bold text-white flex items-center gap-2"><Cpu size={14} /> FluxOS Task Manager</span>
            <span className="text-green-700">{processes.length} tasks, {windows.length} active threads</span>
        </div>
        <div className="flex gap-4 text-green-700">
            <span>Load average: 1.42 0.98 0.45</span>
            <span>Uptime: 14 days</span>
        </div>
      </div>

      {/* CPU / MEM Bars */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-[10px]">
         <div className="flex items-center gap-2">
            <span className="w-6 text-green-300">CPU</span>
            <div className="flex-1 h-3 bg-green-900/30 relative">
                <div className="h-full bg-green-500 transition-all duration-500" style={{width: `${Math.min(100, processes.reduce((acc, p) => acc + p.cpu, 0))}%`}}></div>
            </div>
            <span className="w-8 text-right">{Math.min(100, processes.reduce((acc, p) => acc + p.cpu, 0)).toFixed(1)}%</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-6 text-green-300">MEM</span>
            <div className="flex-1 h-3 bg-green-900/30 relative">
                <div className="h-full bg-green-500 transition-all duration-500" style={{width: '42%'}}></div>
            </div>
            <span className="w-8 text-right">42.1%</span>
         </div>
      </div>
      
      <div className="grid grid-cols-12 gap-2 font-bold text-black bg-green-700 px-1 py-0.5 mb-1">
        <div className="col-span-1">PID</div>
        <div className="col-span-2">USER</div>
        <div className="col-span-1">CPU%</div>
        <div className="col-span-1">MEM%</div>
        <div className="col-span-2">TIME+</div>
        <div className="col-span-5">COMMAND</div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {processes.map(p => (
          <div 
            key={p.pid} 
            onClick={() => setSelectedPid(p.pid)}
            className={`grid grid-cols-12 gap-2 px-1 cursor-pointer transition-colors ${selectedPid === p.pid ? 'bg-green-600 text-black font-bold' : 'hover:bg-green-900/20 hover:text-white text-green-500'}`}
          >
            <div className="col-span-1 opacity-80">{p.pid}</div>
            <div className="col-span-2">{p.user}</div>
            <div className="col-span-1">{p.cpu.toFixed(1)}</div>
            <div className="col-span-1">{p.mem.toFixed(1)}</div>
            <div className="col-span-2">{p.time}</div>
            <div className="col-span-5 truncate flex items-center gap-2">
                {p.command} 
                {p.isSystem && <span className="text-[9px] opacity-50">[SYS]</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-green-900 flex justify-between items-center text-[10px] font-bold">
        <div className="flex gap-2 text-black">
            <button className="bg-green-600 px-2 py-0.5 hover:bg-green-500">F1 Help</button>
            <button className="bg-green-600 px-2 py-0.5 hover:bg-green-500">F2 Setup</button>
            <button className="bg-green-600 px-2 py-0.5 hover:bg-green-500">F5 Refresh</button>
        </div>
        
        <button 
            onClick={handleKill}
            disabled={!selectedPid || processes.find(p => p.pid === selectedPid)?.isSystem}
            className={`flex items-center gap-1 px-3 py-0.5 ${!selectedPid ? 'opacity-50 bg-gray-700 text-gray-400' : (processes.find(p => p.pid === selectedPid)?.isSystem ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-red-600 text-black hover:bg-red-500')}`}
        >
            <XCircle size={12} /> F9 KILL
        </button>
      </div>
      
      {selectedPid && processes.find(p => p.pid === selectedPid)?.isSystem && (
          <div className="absolute bottom-10 left-0 right-0 bg-red-900 text-white text-center text-xs py-1 animate-pulse flex items-center justify-center gap-2">
              <AlertTriangle size={12} /> Cannot terminate system critical process
          </div>
      )}
    </div>
  );
};