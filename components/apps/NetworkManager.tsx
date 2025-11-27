import React, { useState, useEffect, useRef } from 'react';
import { Activity, Shield, Wifi, Globe, XOctagon, RefreshCw } from 'lucide-react';

export const NetworkManager: React.FC = () => {
  const [history, setHistory] = useState<number[]>(new Array(40).fill(10));
  const [connections, setConnections] = useState([
      { id: 1, protocol: 'TCP', local: '192.168.1.105:54322', remote: '142.250.180.14:443', state: 'ESTABLISHED', process: 'chrome', blocked: false },
      { id: 2, protocol: 'TCP', local: '192.168.1.105:44332', remote: '104.21.55.2:80', state: 'CLOSE_WAIT', process: 'curl', blocked: false },
      { id: 3, protocol: 'UDP', local: '0.0.0.0:123', remote: '*:*', state: 'LISTENING', process: 'ntpd', blocked: false },
      { id: 4, protocol: 'TCP', local: '127.0.0.1:631', remote: '*:*', state: 'LISTENING', process: 'cupsd', blocked: false },
      { id: 5, protocol: 'TCP', local: '192.168.1.105:22', remote: '10.0.0.50:55122', state: 'ESTABLISHED', process: 'sshd', blocked: false },
  ]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setHistory(prev => {
            const next = [...prev.slice(1), Math.random() * 80 + 10];
            return next;
        });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Grid
    ctx.strokeStyle = '#14532d'; // green-900
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<canvas.width; i+=40) { ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); }
    for(let i=0; i<canvas.height; i+=20) { ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); }
    ctx.stroke();

    // Draw Graph
    ctx.strokeStyle = '#22c55e'; // green-500
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sliceWidth = canvas.width / (history.length - 1);
    history.forEach((val, i) => {
        const x = i * sliceWidth;
        const y = canvas.height - (val / 100 * canvas.height);
        if (i===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.fill();

  }, [history]);

  const toggleBlock = (id: number) => {
      setConnections(prev => prev.map(c => c.id === id ? { ...c, blocked: !c.blocked } : c));
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-500 font-mono text-xs select-none">
       {/* Header */}
       <div className="flex items-center justify-between p-3 border-b border-green-900 bg-green-900/10">
           <div className="flex items-center gap-2">
               <Activity size={18} />
               <span className="font-bold tracking-widest text-sm">NET_MONITOR_V2</span>
           </div>
           <div className="flex gap-4 text-[10px] text-green-300">
               <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ONLINE</div>
               <div>UP: 45 KB/s</div>
               <div>DOWN: 120 KB/s</div>
           </div>
       </div>

       {/* Graph */}
       <div className="h-32 bg-[#050505] border-b border-green-900 relative">
           <canvas ref={canvasRef} width={400} height={128} className="w-full h-full" />
           <div className="absolute top-1 left-1 text-[9px] bg-black/50 px-1">TRAFFIC HISTORY (60s)</div>
       </div>

       {/* Connection List */}
       <div className="flex-1 overflow-hidden flex flex-col">
           <div className="grid grid-cols-12 gap-2 bg-green-900/20 p-2 font-bold text-[10px] border-b border-green-900/50">
               <div className="col-span-1">PROTO</div>
               <div className="col-span-4">LOCAL ADDR</div>
               <div className="col-span-4">REMOTE ADDR</div>
               <div className="col-span-2">STATE</div>
               <div className="col-span-1 text-center">ACTION</div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
               {connections.map(c => (
                   <div key={c.id} className={`grid grid-cols-12 gap-2 p-2 items-center border-b border-green-900/20 hover:bg-green-900/10 transition-colors ${c.blocked ? 'opacity-50 bg-red-900/10' : ''}`}>
                       <div className="col-span-1 text-green-300">{c.protocol}</div>
                       <div className="col-span-4 truncate text-gray-400">{c.local}</div>
                       <div className="col-span-4 truncate text-white">{c.remote}</div>
                       <div className={`col-span-2 text-[9px] ${c.state === 'ESTABLISHED' ? 'text-green-500' : 'text-yellow-500'}`}>{c.state}</div>
                       <div className="col-span-1 flex justify-center">
                           <button 
                                onClick={() => toggleBlock(c.id)}
                                className={`p-1 rounded hover:bg-white/10 ${c.blocked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                                title={c.blocked ? "Unblock" : "Block Connection"}
                           >
                               {c.blocked ? <Shield size={12} fill="currentColor" /> : <XOctagon size={12} />}
                           </button>
                       </div>
                   </div>
               ))}
           </div>
       </div>

       {/* Footer */}
       <div className="p-2 border-t border-green-900 bg-[#050505] flex gap-4 text-[10px] text-green-700">
           <div className="flex items-center gap-1"><Wifi size={10} /> Interface: eth0</div>
           <div className="flex items-center gap-1"><Globe size={10} /> Public IP: 104.22.15.2</div>
           <div className="ml-auto flex items-center gap-1 cursor-pointer hover:text-green-400"><RefreshCw size={10} /> Flush DNS</div>
       </div>
    </div>
  );
};