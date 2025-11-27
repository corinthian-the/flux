import React, { useState, useEffect, useRef } from 'react';
import { Lock, Power, RefreshCw, Wifi, Battery, Activity } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

// SHA-256 Hashes for default passwords
// root  -> 4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2 (hash of 'root')
// admin -> 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918 (hash of 'admin')
// 1234  -> 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4 (hash of '1234')
const VALID_HASHES = [
  "4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2",
  "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [bootSequence, setBootSequence] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [time, setTime] = useState(new Date());
  const [systemHalted, setSystemHalted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot Sequence
  useEffect(() => {
    const steps = [
      "FLUX_BIOS v2.5.0 Release 12/05/2024",
      "Memory Test: 64GB OK",
      "Detecting Primary Master ... 2TB NVMe SSD",
      "Detecting Primary Slave ... NONE",
      "Loading Kernel Modules ... OK",
      "Mounting Root Filesystem [RO] ... OK",
      "Starting Network Service ... OK",
      "Initializing Crypto Subsystem ... OK",
      "System Ready."
    ];

    let delay = 0;
    steps.forEach((step, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setBootSequence(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setTimeout(() => setShowLogin(true), 500);
        }
      }, delay);
    });
  }, []);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Focus input when login appears
  useEffect(() => {
    if (showLogin && !systemHalted) {
      inputRef.current?.focus();
    }
  }, [showLogin, systemHalted]);

  const hashString = async (text: string) => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !systemHalted) {
      const hash = await hashString(password);
      
      if (VALID_HASHES.includes(hash)) {
        onLogin();
      } else {
        setIsShaking(true);
        setError('ACCESS DENIED. HASH MISMATCH.');
        setPassword('');
        setTimeout(() => {
            setIsShaking(false);
            setError('');
        }, 500);
      }
    }
  };

  const handleShutdown = () => {
      setSystemHalted(true);
      setBootSequence(prev => [...prev, "ACPI: System Halt Signal Received.", "Stopping Services...", "System Halted."]);
      setShowLogin(false);
  };

  const handleRestart = () => {
      window.location.reload();
  };

  if (systemHalted) {
      return (
          <div className="fixed inset-0 bg-black z-[9999] font-mono text-green-900 p-10 flex flex-col items-center justify-center">
              <div className="text-xl tracking-widest animate-pulse">SYSTEM HALTED</div>
              <div className="mt-4 text-xs">It is now safe to turn off your terminal.</div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999] font-mono text-green-500 flex flex-col select-none overflow-hidden">
      
      {/* Top Status Bar (Alive) */}
      <div className="flex justify-between items-center p-4 border-b border-green-900/30 bg-zinc-900/10">
        <div className="flex items-center gap-4 text-xs opacity-70">
             <span className="font-bold">FLUX_OS_SECURE_LOGIN</span>
             <span className="w-px h-3 bg-green-900"></span>
             <div className="flex items-center gap-2">
                <Wifi size={12} className="animate-pulse" />
                <span>192.168.1.X</span>
             </div>
        </div>
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs opacity-70">
                <Activity size={12} />
                <span>LOAD: 0.01</span>
             </div>
             <span className="font-bold text-green-400">{time.toLocaleTimeString([], { hour12: false })}</span>
             <div className="flex items-center gap-2 ml-4">
                 <button onClick={handleRestart} className="hover:text-white transition-colors p-1" title="Reboot">
                    <RefreshCw size={16} />
                 </button>
                 <button onClick={handleShutdown} className="hover:text-red-500 transition-colors p-1" title="Shutdown">
                    <Power size={16} />
                 </button>
             </div>
        </div>
      </div>

      {/* Boot Log / Background */}
      <div className="flex-1 p-10 opacity-80 relative">
        {bootSequence.map((line, i) => (
          <div key={i} className="leading-tight">{line}</div>
        ))}
      </div>

      {/* Login Box */}
      {showLogin && (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full border border-green-900 p-8 bg-black/90 shadow-[0_0_50px_rgba(34,197,94,0.1)] transition-transform ${isShaking ? 'translate-x-[-52%] lg:translate-x-[-51%]' : ''}`} style={isShaking ? { animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' } : {}}>
          
          <style>
            {`
                @keyframes shake {
                  10%, 90% { transform: translate3d(-51%, -50%, 0); }
                  20%, 80% { transform: translate3d(-49%, -50%, 0); }
                  30%, 50%, 70% { transform: translate3d(-52%, -50%, 0); }
                  40%, 60% { transform: translate3d(-48%, -50%, 0); }
                }
            `}
          </style>

          <div className="flex justify-center mb-6 text-green-400">
             <Lock size={40} />
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold tracking-[0.2em] text-green-500 mb-2">RESTRICTED ACCESS</h1>
            <p className="text-xs text-green-800">UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-green-700">login as:</span>
                <span className="text-white font-bold">root</span>
            </div>
            <div className="flex items-center gap-2 relative group">
                <span className="text-green-700">password:</span>
                <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none text-green-500 font-bold w-full"
                    autoFocus
                />
                <div className={`absolute left-[85px] ml-[${password.length}ch] w-2 h-5 bg-green-500 animate-pulse ${password.length > 0 ? 'translate-x-full' : ''}`}></div>
            </div>
          </div>

          {error && (
            <div className="mt-6 text-red-500 font-bold text-center bg-red-900/10 p-2 border border-red-900/50 text-xs uppercase tracking-widest">
              {error}
            </div>
          )}
          
          <div className="mt-8 text-[10px] text-green-900 text-center flex justify-between">
             <span>FluxOS Secure Login Service v2.5</span>
             <span className="animate-pulse text-green-500">ONLINE</span>
          </div>
        </div>
      )}
    </div>
  );
};