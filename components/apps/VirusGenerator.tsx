import React, { useState, useEffect, useRef } from 'react';
import { Skull, Zap, Shield, Bug, Code, FileCode, Terminal, PlayCircle, AlertTriangle } from 'lucide-react';

interface VirusGeneratorProps {
    onSave: (path: string, content: string) => void;
}

export const VirusGenerator: React.FC<VirusGeneratorProps> = ({ onSave }) => {
  const [config, setConfig] = useState({
    type: 'Ransomware',
    encryption: 'AES-256',
    target: 'Windows',
    stealth: true,
    obfuscation: 'Polymorphic'
  });
  const [compiling, setCompiling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [hexDump, setHexDump] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isDryRun, setIsDryRun] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [log, hexDump]);

  const generateHexLine = () => {
    let line = '';
    for (let i = 0; i < 8; i++) {
        line += Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase() + ' ';
    }
    return line.trim();
  };

  const handleCompile = () => {
    setCompiling(true);
    setCompleted(false);
    setIsDryRun(false);
    setLog([]);
    setHexDump([]);
    setProgress(0);

    const logs = [
        `Initializing ${config.type} builder v4.0...`,
        `Loading ${config.encryption} crypto modules...`,
        `Targeting architecture: ${config.target} (x64)...`,
        `Generating entry point instructions...`,
        `Allocating heap memory...`,
        `Obfuscating payload using ${config.obfuscation}...`,
        `Injecting anti-debug routines...`,
        `Resolving dynamic imports...`,
        `Packing executable section .text...`,
        `Packing executable section .data...`,
        `Signing with stolen certificate (Corp_Id_55)...`,
        `Verifying checksum...`,
        `Build Successful.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep >= logs.length) {
            clearInterval(interval);
            setCompiling(false);
            setCompleted(true);
            
            // Save to OS
            const filename = `${config.type.toLowerCase()}_${Date.now().toString().slice(-4)}.exe`;
            // Add metadata so VirusRunner knows what to do with it
            const fakeBinaryContent = `MZ_FLUX_VIRUS_CONTAINER\n\n[PAYLOAD_CONFIG]\nType: ${config.type}\nTarget: ${config.target}\nEnc: ${config.encryption}\nMode: ${config.obfuscation}\nTimestamp: ${Date.now()}`;
            
            onSave(`root/home/user/${filename}`, fakeBinaryContent);
            setLog(prev => [...prev, `[DISK_IO] Saved output to ~/home/user/${filename}`]);
            return;
        }
        
        setLog(prev => [...prev, logs[currentStep]]);
        
        // Add random hex lines
        const newHex = [];
        for(let i=0; i<3; i++) newHex.push(generateHexLine());
        setHexDump(prev => [...prev, ...newHex]);

        setProgress(((currentStep + 1) / logs.length) * 100);
        currentStep++;
    }, 400);
  };

  const handleDryRun = () => {
      setIsDryRun(true);
      setTimeout(() => setIsDryRun(false), 3000); // 3 second glitch effect
  };

  return (
    <div className={`h-full bg-[#050505] text-red-500 font-mono flex flex-col select-none overflow-hidden transition-all duration-100 ${isDryRun ? 'animate-pulse invert' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-red-900/50 bg-red-900/5">
          <div className="p-2 bg-red-900/20 rounded border border-red-900 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
              <Skull size={24} className={compiling ? "animate-spin" : ""} />
          </div>
          <div>
              <h1 className="text-xl font-bold text-red-400 tracking-widest flex items-center gap-2">
                  MALWARE_STUDIO <span className="text-[10px] bg-red-900/50 text-white px-1 rounded">PRO</span>
              </h1>
              <p className="text-xs text-red-800">Advanced Payload Generator v4.5</p>
          </div>
      </div>

      <div className="flex-1 flex min-h-0">
          {/* Left: Configuration */}
          <div className="w-1/3 p-4 border-r border-red-900/30 overflow-y-auto space-y-6">
              <div className="space-y-2">
                  <label className="text-xs text-red-700 font-bold uppercase flex items-center gap-2">
                      <Bug size={14} /> Payload Type
                  </label>
                  <select 
                      className="w-full bg-[#0a0a0a] border border-red-900/50 text-sm text-red-400 p-2 focus:outline-none focus:border-red-500 rounded-sm"
                      value={config.type}
                      onChange={e => setConfig({...config, type: e.target.value})}
                      disabled={compiling}
                  >
                      <option>Ransomware</option>
                      <option>Trojan Horse</option>
                      <option>Worm</option>
                      <option>Spyware</option>
                      <option>Rootkit</option>
                      <option>Botnet Client</option>
                  </select>
              </div>

              <div className="space-y-2">
                  <label className="text-xs text-red-700 font-bold uppercase flex items-center gap-2">
                      <Code size={14} /> Encryption
                  </label>
                  <select 
                      className="w-full bg-[#0a0a0a] border border-red-900/50 text-sm text-red-400 p-2 focus:outline-none focus:border-red-500 rounded-sm"
                      value={config.encryption}
                      onChange={e => setConfig({...config, encryption: e.target.value})}
                      disabled={compiling}
                  >
                      <option>AES-256</option>
                      <option>RSA-4096</option>
                      <option>ChaCha20</option>
                      <option>None (Raw)</option>
                  </select>
              </div>

              <div className="space-y-2">
                  <label className="text-xs text-red-700 font-bold uppercase flex items-center gap-2">
                      <Terminal size={14} /> Target OS
                  </label>
                  <select 
                      className="w-full bg-[#0a0a0a] border border-red-900/50 text-sm text-red-400 p-2 focus:outline-none focus:border-red-500 rounded-sm"
                      value={config.target}
                      onChange={e => setConfig({...config, target: e.target.value})}
                      disabled={compiling}
                  >
                      <option>Windows</option>
                      <option>Linux</option>
                      <option>macOS</option>
                      <option>Android</option>
                      <option>IoT (ARM)</option>
                  </select>
              </div>

              <div className="space-y-2">
                  <label className="text-xs text-red-700 font-bold uppercase flex items-center gap-2">
                      <Shield size={14} /> Evasion
                  </label>
                  <select 
                      className="w-full bg-[#0a0a0a] border border-red-900/50 text-sm text-red-400 p-2 focus:outline-none focus:border-red-500 rounded-sm"
                      value={config.obfuscation}
                      onChange={e => setConfig({...config, obfuscation: e.target.value})}
                      disabled={compiling}
                  >
                      <option>Polymorphic</option>
                      <option>Metamorphic</option>
                      <option>Opaque Predicates</option>
                      <option>None</option>
                  </select>
              </div>

              <div className="pt-4 space-y-2">
                  <button 
                    onClick={handleCompile}
                    disabled={compiling}
                    className="w-full py-3 bg-red-900/20 border border-red-800 hover:bg-red-600 hover:text-black hover:border-red-500 transition-all font-bold tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                      {compiling ? <Zap size={18} className="animate-pulse" /> : <FileCode size={18} />}
                      {compiling ? 'COMPILING...' : 'GENERATE'}
                  </button>
                  
                  {completed && (
                      <button 
                        onClick={handleDryRun}
                        className="w-full py-2 bg-yellow-900/20 border border-yellow-800 hover:bg-yellow-500 hover:text-black transition-all font-bold text-xs flex items-center justify-center gap-2"
                      >
                          <PlayCircle size={14} /> TEST PAYLOAD (DRY RUN)
                      </button>
                  )}
              </div>
          </div>

          {/* Right: Output */}
          <div className="flex-1 flex flex-col bg-black p-2 min-w-0">
             
             {/* Progress Bar */}
             <div className="h-6 bg-red-900/10 border border-red-900/30 mb-2 relative overflow-hidden shrink-0">
                 <div className="absolute inset-0 flex items-center justify-center z-10 text-[10px] font-bold text-red-500">
                     {compiling ? `COMPILING: ${Math.round(progress)}%` : (completed ? 'COMPILATION COMPLETE' : 'READY')}
                 </div>
                 <div 
                    className="h-full bg-red-900/50 transition-all duration-300"
                    style={{width: `${progress}%`}}
                 />
             </div>

             <div className="flex-1 flex flex-col min-h-0 border border-red-900/30 relative">
                 {/* Tabs */}
                 <div className="flex border-b border-red-900/30 bg-[#0a0a0a] text-[10px]">
                     <div className="px-3 py-1 bg-red-900/20 text-red-400 border-r border-red-900/30">Build Log</div>
                     <div className="px-3 py-1 text-red-800 hover:text-red-500 cursor-pointer">Hex Preview</div>
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar p-2 font-mono text-[11px] bg-[#050505]">
                     {isDryRun && (
                         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                             <div className="text-center animate-bounce">
                                 <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-2" />
                                 <h2 className="text-2xl font-bold text-white">PAYLOAD EXECUTING...</h2>
                                 <p className="text-red-500 font-mono">Simulating system damage...</p>
                             </div>
                         </div>
                     )}
                     
                     <div className="grid grid-cols-2 gap-4">
                         {/* Logs */}
                         <div className="space-y-1">
                             {log.length === 0 && <span className="text-red-900/50 italic">Waiting for compiler...</span>}
                             {log.map((line, i) => (
                                 <div key={i} className="flex gap-2">
                                     <span className="text-red-700">{'>'}</span>
                                     <span className={line.includes('Successful') ? 'text-green-500 font-bold' : 'text-red-400'}>{line}</span>
                                 </div>
                             ))}
                             <div ref={bottomRef} />
                         </div>

                         {/* Hex Dump (Visual Only) */}
                         <div className="border-l border-red-900/20 pl-4 opacity-70">
                             {hexDump.map((line, i) => (
                                 <div key={i} className="flex gap-2 text-red-800">
                                     <span className="text-red-900">{`0x${(i * 8).toString(16).padStart(4, '0')}:`}</span>
                                     <span>{line}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};