import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Pause, FileText, Skull, Check } from 'lucide-react';

export const JohnTheRipper: React.FC = () => {
  const [targetHash, setTargetHash] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [mode, setMode] = useState<'WORDLIST' | 'INCREMENTAL'>('WORDLIST');
  const [result, setResult] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Known hashes for simulation
  const KNOWN_HASHES: Record<string, string> = {
      "4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2": "root",
      "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918": "admin",
      "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4": "1234"
  };

  useEffect(() => {
      let interval: any;
      if (isRunning) {
          interval = setInterval(() => {
              // Simulate cracking attempts
              const candidate = Math.random().toString(36).substring(7);
              setLogs(prev => {
                  const newLine = `0g 0:00:00:${Math.floor(Math.random()*60)} 3/3 0g/s 12400p/s 12400c/s 12400C/s ${candidate}..${candidate}123`;
                  if (prev.length > 20) return [...prev.slice(1), newLine];
                  return [...prev, newLine];
              });

              // Random chance to succeed if hash is known, or just run forever
              if (Math.random() > 0.95 && KNOWN_HASHES[targetHash]) {
                  const cracked = KNOWN_HASHES[targetHash];
                  setResult(cracked);
                  setIsRunning(false);
                  setLogs(prev => [...prev, `\nSession completed.`]); 
              }
          }, 100);
      }
      return () => clearInterval(interval);
  }, [isRunning, targetHash]);

  useEffect(() => {
      logRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const toggleRun = () => {
      if (isRunning) {
          setIsRunning(false);
          setLogs(prev => [...prev, "Session aborted"]);
      } else {
          setResult(null);
          if (!targetHash) {
              setLogs(["Error: No target hash specified."]);
              return;
          }
          setLogs([
              `John the Ripper 1.9.0-jumbo-1 OMP [linux-gnu 64-bit AVX2 AC]`,
              `Loaded 1 password hash (SHA256 [SHA256 256/256 AVX2 8x])`,
              `Proceeding with ${mode.toLowerCase()} mode`,
              `Press 'q' or Ctrl-C to abort, almost any other key for status`
          ]);
          setIsRunning(true);
      }
  };

  return (
    <div className="h-full flex flex-col bg-black text-gray-300 font-mono text-sm select-none">
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b border-gray-800 bg-zinc-900/50">
            <Skull size={20} className="text-gray-400" />
            <div>
                <h1 className="font-bold text-white tracking-widest">JOHN THE RIPPER</h1>
                <p className="text-[10px] text-gray-500">Advanced Password Cracker v1.9.0</p>
            </div>
        </div>

        {/* Configuration */}
        <div className="p-4 grid grid-cols-1 gap-4 border-b border-gray-800">
            <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Target Hash (SHA-256)</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={targetHash}
                        onChange={(e) => setTargetHash(e.target.value)}
                        placeholder="Paste hash here..."
                        className="flex-1 bg-[#111] border border-gray-700 p-2 text-xs focus:border-white focus:outline-none font-mono text-green-500"
                    />
                    <button className="px-3 bg-gray-800 border border-gray-600 hover:bg-gray-700 text-xs flex items-center gap-2">
                        <FileText size={14} /> Load File
                    </button>
                </div>
            </div>
            
            <div className="flex gap-4 items-center">
                 <div className="space-y-1 flex-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500">Attack Mode</label>
                    <select 
                        value={mode}
                        onChange={(e) => setMode(e.target.value as any)}
                        className="w-full bg-[#111] border border-gray-700 p-2 text-xs focus:border-white focus:outline-none"
                    >
                        <option value="WORDLIST">--wordlist=rockyou.txt</option>
                        <option value="INCREMENTAL">--incremental (Brute Force)</option>
                        <option value="EXTERNAL">--external (Rules)</option>
                    </select>
                </div>
                <button 
                    onClick={toggleRun}
                    className={`h-9 mt-5 px-6 font-bold text-black flex items-center gap-2 transition-colors ${isRunning ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'}`}
                >
                    {isRunning ? <Pause size={14} /> : <Play size={14} />}
                    {isRunning ? 'STOP' : 'CRACK'}
                </button>
            </div>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 bg-[#0a0a0a] p-4 font-mono text-xs overflow-y-auto custom-scrollbar relative">
            {result && (
                <div className="absolute top-4 right-4 bg-green-500 text-black p-4 shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-in slide-in-from-right fade-in">
                    <div className="flex items-center gap-2 font-bold text-lg mb-1">
                        <Check size={24} /> CRACKED
                    </div>
                    <div className="text-sm bg-black/20 p-2 font-mono">
                        {result}
                    </div>
                </div>
            )}
            
            <div className="space-y-1 text-gray-400">
                {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
                {result && (
                    <div className="text-green-500 mt-4">
                        {targetHash} ({result})<br/>
                        1g 0:00:00:04 DONE 2/3 0.233g/s 3400p/s 3400c/s 3400C/s<br/>
                        Session completed
                    </div>
                )}
                <div ref={logRef} />
            </div>
        </div>
    </div>
  );
};