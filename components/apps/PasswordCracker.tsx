import React, { useState, useEffect, useRef } from 'react';
import { Key, Play, Pause, ShieldAlert, Unlock, User, Globe, FileText, Activity, Server, ArrowRight, Terminal } from 'lucide-react';

interface PasswordCrackerProps {
  initialTargetIp?: string;
  initialUsername?: string;
}

export const PasswordCracker: React.FC<PasswordCrackerProps> = ({ initialTargetIp, initialUsername }) => {
  const [targetIp, setTargetIp] = useState(initialTargetIp || '192.168.1.1');
  const [username, setUsername] = useState(initialUsername || 'root');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [foundPassword, setFoundPassword] = useState<string | null>(null);
  const [attackMode, setAttackMode] = useState<'BRUTE' | 'DICT' | 'HYBRID'>('DICT');
  const [wordlist, setWordlist] = useState('rockyou.txt');
  const logRef = useRef<HTMLDivElement>(null);
  
  // Handshake visualizer state
  const [handshakeStep, setHandshakeStep] = useState(0);

  // Mutable refs for loop
  const attemptsRef = useRef(0);

  useEffect(() => {
    let interval: any;
    let handshakeInterval: any;

    if (isRunning) {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome', 'login', 'flux', 'root', 'toor', 'master', 'server', 'access', 'letmein'];
      
      // Packet Animation Loop
      handshakeInterval = setInterval(() => {
          setHandshakeStep(prev => (prev + 1) % 4);
      }, 500);

      interval = setInterval(() => {
        // Update attempts
        const increment = attackMode === 'DICT' ? 1 : (attackMode === 'HYBRID' ? 17 : 142);
        attemptsRef.current += increment;
        setAttempts(attemptsRef.current);
        
        let attempt = "";
        
        if (attackMode === 'DICT') {
            const base = commonPasswords[Math.floor(Math.random() * commonPasswords.length)];
            attempt = Math.random() > 0.5 ? base : base + Math.floor(Math.random() * 100);
        } else if (attackMode === 'HYBRID') {
             const base = commonPasswords[Math.floor(Math.random() * commonPasswords.length)];
             attempt = base + chars.charAt(Math.floor(Math.random() * chars.length)) + Math.floor(Math.random() * 9);
        } else {
            const len = Math.floor(Math.random() * 8) + 4;
            for(let i=0; i<len; i++) attempt += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        setCurrentPassword(attempt);

        // Add log (throttled)
        if (Math.random() > 0.9) {
            setLogs(prev => {
                const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] [ssh] ${username}@${targetIp} password: "${attempt}" -> ACCESS DENIED`];
                if (newLogs.length > 50) return newLogs.slice(newLogs.length - 50);
                return newLogs;
            });
        }

        // Crack Logic
        // We make it "real" by checking the username.
        const targetUser = username.toLowerCase();
        let realPassword = 'password123'; // Default for random users
        
        if (targetUser === 'root') realPassword = 'root';
        if (targetUser === 'admin') realPassword = 'admin';
        if (targetUser === 'guest') realPassword = 'guest';

        const threshold = attackMode === 'DICT' ? 200 : (attackMode === 'HYBRID' ? 1000 : 5000);
        
        // Success Condition
        if (attemptsRef.current > threshold && Math.random() > 0.98) {
            setFoundPassword(realPassword);
            setIsRunning(false);
            setLogs(prev => [...prev, `[+] SUCCESS: Password found for ${username}: ${realPassword}`]);
        }

      }, 40);
    }
    return () => {
        clearInterval(interval);
        clearInterval(handshakeInterval);
    };
  }, [isRunning, attackMode, username, targetIp]);

  // Auto-scroll logs
  useEffect(() => {
    logRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const toggleStart = () => {
    if (isRunning) {
        setIsRunning(false);
        setLogs(prev => [...prev, `[-] Process terminated by user.`]);
    } else {
        setFoundPassword(null);
        setLogs([
            `[*] Hydra v9.1 (c) 2023 by van Hauser/THC`,
            `[*] Target: ssh://${targetIp}:22`,
            `[*] Wordlist: /usr/share/wordlists/${wordlist}`,
            `[*] Threads: 16`,
            `[+] Target ${targetIp} is up`,
            `[*] Attacking service ssh on port 22`
        ]);
        attemptsRef.current = 0;
        setAttempts(0);
        setIsRunning(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-500 font-mono p-4 select-none">
      <div className="flex items-center gap-4 mb-4 border-b border-green-900 pb-2 bg-green-900/10 p-2">
        <div className="p-2 bg-green-900/20 border border-green-700 rounded shadow-[0_0_10px_rgba(34,197,94,0.2)]">
            <Key size={24} />
        </div>
        <div>
            <h1 className="text-lg font-bold tracking-widest text-white">HYDRA_GUI</h1>
            <p className="text-[10px] text-green-700">Network Logon Cracker v9.1</p>
        </div>
        {isRunning && <ShieldAlert size={24} className="ml-auto text-red-500 animate-pulse" />}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-green-700 flex items-center gap-1">
                <Globe size={10} /> Target IP
            </label>
            <input 
                type="text" 
                value={targetIp} 
                onChange={e => setTargetIp(e.target.value)}
                disabled={isRunning}
                className="w-full bg-[#111] border border-green-900 p-2 text-sm text-green-400 focus:outline-none focus:border-green-500 disabled:opacity-50 font-mono"
            />
        </div>
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-green-700 flex items-center gap-1">
                <User size={10} /> Username
            </label>
            <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                disabled={isRunning}
                className="w-full bg-[#111] border border-green-900 p-2 text-sm text-green-400 focus:outline-none focus:border-green-500 disabled:opacity-50 font-mono"
            />
        </div>
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-green-700">Attack Vector</label>
            <select 
                value={attackMode}
                onChange={(e) => setAttackMode(e.target.value as any)}
                disabled={isRunning}
                className="w-full bg-[#111] border border-green-900 p-2 text-sm text-green-400 focus:outline-none focus:border-green-500 disabled:opacity-50"
            >
                <option value="DICT">Dictionary Attack (Fastest)</option>
                <option value="HYBRID">Hybrid (Dict + Rules)</option>
                <option value="BRUTE">Brute Force (All Chars)</option>
            </select>
        </div>
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-green-700 flex items-center gap-1">
                <FileText size={10} /> Wordlist
            </label>
            <select 
                value={wordlist}
                onChange={(e) => setWordlist(e.target.value)}
                disabled={isRunning}
                className="w-full bg-[#111] border border-green-900 p-2 text-sm text-green-400 focus:outline-none focus:border-green-500 disabled:opacity-50"
            >
                <option value="rockyou.txt">rockyou.txt (14MB)</option>
                <option value="common_pass.txt">common_pass.txt (2MB)</option>
                <option value="darkweb_leak.txt">darkweb_leak.txt (5MB)</option>
            </select>
        </div>
      </div>

      {/* Visualizer Area */}
      <div className="flex gap-4 mb-4 h-24">
          {/* Handshake Vis */}
          <div className="w-1/3 bg-[#050505] border border-green-900/50 p-2 flex flex-col relative overflow-hidden">
               <div className="text-[9px] text-green-800 uppercase font-bold mb-2 flex justify-between">
                   <span>LOCALHOST</span>
                   <span>TARGET</span>
               </div>
               <div className="flex-1 flex items-center justify-between px-4 relative">
                   <Terminal size={24} className="text-gray-500" />
                   {isRunning && (
                       <>
                           <div className={`absolute top-1/2 left-10 w-2 h-2 bg-green-500 rounded-full transition-all duration-300 ${handshakeStep === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-32'}`}></div>
                           <div className={`absolute top-1/2 right-10 w-2 h-2 bg-red-500 rounded-full transition-all duration-300 ${handshakeStep === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-32'}`}></div>
                       </>
                   )}
                   <Server size={24} className="text-gray-500" />
               </div>
               <div className="text-[9px] text-center text-green-600 font-mono">
                   {isRunning ? (handshakeStep % 2 === 0 ? 'SYN_SENT >>>' : '<<< ACK_RCVD') : 'DISCONNECTED'}
               </div>
          </div>

          {/* Password Candidate */}
          <div className="flex-1 bg-[#050505] border border-green-900/50 p-4 flex items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-green-500/5 pointer-events-none scanlines"></div>
              <div className="text-center w-full z-10">
                  <div className="text-[9px] text-green-800 uppercase mb-1">Testing Candidate</div>
                  <div className="text-xl font-bold tracking-widest text-white font-mono h-8 flex items-center justify-center">
                      {foundPassword ? <span className="text-green-400 animate-pulse">{foundPassword}</span> : (currentPassword || <span className="opacity-20">WAITING...</span>)}
                  </div>
              </div>
              {isRunning && (
                  <div className="absolute bottom-0 left-0 h-0.5 bg-green-500 animate-[progress_1s_ease-in-out_infinite] w-full opacity-70"></div>
              )}
          </div>
      </div>

      <div className="flex gap-4 mb-4 text-xs font-bold">
          <div className="flex-1 bg-[#111] p-2 border border-green-900/30 flex justify-between">
              <span className="text-green-800">RATE</span>
              <span>{isRunning ? (attackMode === 'BRUTE' ? '12.4 k/s' : '45.1 k/s') : '0 k/s'}</span>
          </div>
          <div className="flex-1 bg-[#111] p-2 border border-green-900/30 flex justify-between">
              <span className="text-green-800">TRIES</span>
              <span>{attempts}</span>
          </div>
      </div>

      {/* Terminal Logs */}
      <div className="flex-1 bg-black border border-green-900/30 p-2 overflow-y-auto custom-scrollbar text-[10px] space-y-1 mb-4 shadow-inner font-mono">
          {logs.length === 0 && <span className="text-green-900 italic text-center block mt-10">System ready. Configure parameters and start attack.</span>}
          {logs.map((log, i) => (
              <div key={i} className={log.includes('SUCCESS') ? 'text-black bg-green-500 font-bold p-1 animate-pulse' : 'text-green-600/80 border-b border-green-900/10 pb-0.5'}>
                  {log}
              </div>
          ))}
          <div ref={logRef} />
      </div>

      <button 
        onClick={toggleStart}
        className={`w-full py-3 font-bold tracking-widest flex items-center justify-center gap-2 transition-all uppercase text-xs ${
            isRunning 
                ? 'bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-900/40' 
                : 'bg-green-900/20 text-green-500 border border-green-900 hover:bg-green-500 hover:text-black'
        }`}
      >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'ABORT ATTACK' : 'START ATTACK'}
      </button>

      {/* Success Popup */}
      {foundPassword && !isRunning && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center animate-in fade-in duration-500 z-20 backdrop-blur-sm">
              <div className="p-6 border border-green-500 bg-black shadow-[0_0_50px_rgba(34,197,94,0.3)] flex flex-col items-center max-w-xs w-full">
                <Unlock size={48} className="text-green-500 mb-4 animate-bounce" />
                <h2 className="text-xl font-bold text-white mb-2 tracking-widest">CRACKED!</h2>
                
                <div className="w-full bg-green-900/20 border border-green-500/50 p-4 text-center mb-4">
                    <div className="text-[10px] text-green-700 uppercase mb-1">Credentials</div>
                    <div className="text-green-400 text-sm">{username}</div>
                    <div className="text-2xl text-white font-mono font-bold">{foundPassword}</div>
                </div>

                <div className="text-[10px] text-green-600 mb-4 text-center">
                    Valid for SSH, FTP, HTTP services.
                </div>

                <button onClick={() => setFoundPassword(null)} className="px-6 py-2 bg-green-600 text-black font-bold text-xs hover:bg-green-500 transition-colors w-full">
                    COPY & CLOSE
                </button>
              </div>
          </div>
      )}
    </div>
  );
};