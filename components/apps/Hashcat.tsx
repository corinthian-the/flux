import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, Flame, Play, Square, Settings, FileText, FileCode, Layers } from 'lucide-react';

export const Hashcat: React.FC = () => {
  const [target, setTarget] = useState('');
  const [hashType, setHashType] = useState('1400'); // SHA-256
  const [attackMode, setAttackMode] = useState('0'); // Straight
  const [wordlist, setWordlist] = useState('rockyou.txt');
  const [ruleFile, setRuleFile] = useState('best64.rule');
  
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'CRACKED'>('IDLE');
  
  // Simulation State
  const [gpuTemp, setGpuTemp] = useState(45);
  const [fanSpeed, setFanSpeed] = useState(30);
  const [hashRate, setHashRate] = useState(0);
  const [progress, setProgress] = useState(0);
  const [crackedResult, setCrackedResult] = useState('password123');

  useEffect(() => {
    let interval: any;
    if (status === 'RUNNING') {
        interval = setInterval(() => {
            // Fluctuate stats
            setGpuTemp(prev => Math.min(92, Math.max(70, prev + (Math.random() - 0.4) * 5)));
            setFanSpeed(prev => Math.min(100, Math.max(60, prev + (Math.random() - 0.4) * 10)));
            setHashRate(prev => Math.max(15000, prev + (Math.random() - 0.5) * 5000));
            
            setProgress(prev => {
                if (prev >= 100) {
                    setStatus('CRACKED');
                    setHashRate(0);
                    setFanSpeed(40);
                    
                    // Simple logic to mock result based on target
                    if (target.startsWith('$') || target.length > 20) setCrackedResult('admin123');
                    else setCrackedResult('password');
                    
                    return 100;
                }
                return prev + 0.5; // Speed up a bit for UX
            });

        }, 500);
    } else if (status === 'IDLE' || status === 'CRACKED') {
        // Cool down
        if (gpuTemp > 45) {
             const cool = setInterval(() => {
                 setGpuTemp(prev => Math.max(45, prev - 2));
                 setFanSpeed(prev => Math.max(30, prev - 2));
             }, 200);
             return () => clearInterval(cool);
        }
    }
    return () => clearInterval(interval);
  }, [status, gpuTemp, target]);

  const toggleStart = () => {
      if (status === 'RUNNING') {
          setStatus('IDLE');
          setHashRate(0);
          setProgress(0);
      } else {
          if (!target) return;
          setStatus('RUNNING');
          setProgress(0);
          setGpuTemp(60);
          setHashRate(15000);
      }
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] text-gray-300 font-mono select-none">
      {/* Header */}
      <div className="bg-[#252525] p-3 border-b border-gray-600 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white italic">hc</div>
             <h1 className="text-lg font-bold text-white tracking-tighter">hashcat <span className="text-xs text-gray-400 font-normal">v6.2.6</span></h1>
          </div>
          <div className="flex gap-2 text-[10px]">
              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded border border-gray-700">
                  <Cpu size={12} className="text-blue-400" />
                  <span>NVIDIA RTX 4090</span>
              </div>
          </div>
      </div>

      <div className="flex-1 flex min-h-0">
          {/* Sidebar Config */}
          <div className="w-72 bg-[#202020] border-r border-gray-700 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
               <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">Target Hash / File</label>
                   <textarea 
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                        className="w-full h-20 bg-[#111] border border-gray-600 p-2 text-xs focus:border-red-500 outline-none text-white resize-none font-mono"
                        placeholder="Paste hash..."
                   />
               </div>

               <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Settings size={10} /> Hash Type (-m)</label>
                   <select 
                        value={hashType}
                        onChange={e => setHashType(e.target.value)}
                        className="w-full bg-[#111] border border-gray-600 p-2 text-xs text-white outline-none"
                   >
                       <option value="0">MD5 (0)</option>
                       <option value="100">SHA1 (100)</option>
                       <option value="1400">SHA-256 (1400)</option>
                       <option value="1700">SHA-512 (1700)</option>
                       <option value="1000">NTLM (1000)</option>
                       <option value="2500">WPA-EAPOL-PBKDF2 (2500)</option>
                   </select>
               </div>

               <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Layers size={10} /> Attack Mode (-a)</label>
                   <select 
                        value={attackMode}
                        onChange={e => setAttackMode(e.target.value)}
                        className="w-full bg-[#111] border border-gray-600 p-2 text-xs text-white outline-none"
                   >
                       <option value="0">Straight (Wordlist)</option>
                       <option value="1">Combination</option>
                       <option value="3">Brute-Force</option>
                       <option value="6">Hybrid Dict + Mask</option>
                   </select>
               </div>
               
               {attackMode === '0' && (
                   <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><FileText size={10} /> Wordlist</label>
                       <select 
                            value={wordlist}
                            onChange={e => setWordlist(e.target.value)}
                            className="w-full bg-[#111] border border-gray-600 p-2 text-xs text-white outline-none"
                       >
                           <option value="rockyou.txt">rockyou.txt (14.3 GB)</option>
                           <option value="hashkiller.dict">hashkiller.dict (2.1 GB)</option>
                           <option value="crackstation.txt">crackstation.txt (190 GB)</option>
                           <option value="top10k.txt">top10k.txt (80 KB)</option>
                       </select>
                   </div>
               )}
               
               {attackMode === '0' && (
                   <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><FileCode size={10} /> Rules</label>
                       <select 
                            value={ruleFile}
                            onChange={e => setRuleFile(e.target.value)}
                            className="w-full bg-[#111] border border-gray-600 p-2 text-xs text-white outline-none"
                       >
                           <option value="best64.rule">best64.rule</option>
                           <option value="dive.rule">dive.rule</option>
                           <option value="combinator.rule">combinator.rule</option>
                       </select>
                   </div>
               )}

               <button 
                    onClick={toggleStart}
                    className={`mt-auto py-3 font-bold flex items-center justify-center gap-2 transition-all ${status === 'RUNNING' ? 'bg-red-900/50 text-red-400 border border-red-500' : 'bg-green-600 hover:bg-green-500 text-black'}`}
               >
                   {status === 'RUNNING' ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                   {status === 'RUNNING' ? 'ABORT' : 'START CRACKING'}
               </button>
          </div>

          {/* Main Dashboard */}
          <div className="flex-1 p-6 flex flex-col gap-6 bg-[#151515] relative overflow-hidden min-w-0">
               {/* Status Cards */}
               <div className="grid grid-cols-3 gap-4 relative z-10">
                   <div className="bg-[#222] border border-gray-700 p-4 rounded shadow-lg">
                       <div className="flex justify-between items-start mb-2">
                           <span className="text-xs text-gray-500 font-bold uppercase">Status</span>
                           <Activity size={16} className={status === 'RUNNING' ? 'text-green-500 animate-pulse' : 'text-gray-600'} />
                       </div>
                       <div className={`text-2xl font-bold ${status === 'RUNNING' ? 'text-white' : (status === 'CRACKED' ? 'text-green-500' : 'text-gray-500')}`}>
                           {status}
                       </div>
                   </div>

                   <div className="bg-[#222] border border-gray-700 p-4 rounded shadow-lg">
                       <div className="flex justify-between items-start mb-2">
                           <span className="text-xs text-gray-500 font-bold uppercase">Speed</span>
                           <Zap size={16} className={status === 'RUNNING' ? 'text-yellow-500' : 'text-gray-600'} />
                       </div>
                       <div className="text-2xl font-bold text-white font-mono">
                           {(hashRate / 1000).toFixed(1)} kH/s
                       </div>
                   </div>

                   <div className="bg-[#222] border border-gray-700 p-4 rounded shadow-lg">
                       <div className="flex justify-between items-start mb-2">
                           <span className="text-xs text-gray-500 font-bold uppercase">GPU Temp</span>
                           <Flame size={16} className={gpuTemp > 80 ? 'text-red-500 animate-pulse' : 'text-orange-500'} />
                       </div>
                       <div className="text-2xl font-bold text-white font-mono flex items-end gap-1">
                           {Math.round(gpuTemp)}°c <span className="text-xs text-gray-500 mb-1">/ {Math.round(fanSpeed)}% Fan</span>
                       </div>
                   </div>
               </div>

               {/* Progress Area */}
               <div className="flex-1 bg-black border border-gray-800 rounded p-4 font-mono text-xs relative z-10 overflow-hidden">
                   {status === 'IDLE' && <div className="text-gray-600 text-center mt-20">Device Ready. Select hash and wordlist.</div>}
                   {status === 'RUNNING' && (
                       <div className="space-y-1">
                           <div className="text-yellow-500">Session..........: hashcat</div>
                           <div className="text-gray-300">Status...........: Running</div>
                           <div className="text-gray-300">Hash.Name........: SHA256</div>
                           <div className="text-gray-300">Hash.Target......: {target.substring(0, 16)}...</div>
                           <div className="text-gray-300">Input.Wordlist...: {wordlist}</div>
                           <div className="text-gray-300">Input.Rules......: {ruleFile}</div>
                           <div className="text-gray-300">Time.Started.....: {new Date().toLocaleTimeString()}</div>
                           <div className="text-gray-300">Recovered........: {Math.floor((progress / 100) * 14000)}/1458231 ({(progress).toFixed(2)}%) Digests</div>
                           <div className="mt-4">
                               <div className="flex justify-between text-gray-500 mb-1">
                                   <span>Progress</span>
                                   <span>{progress.toFixed(2)}%</span>
                               </div>
                               <div className="h-2 bg-gray-800 rounded overflow-hidden">
                                   <div className="h-full bg-green-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
                               </div>
                           </div>
                           <div className="mt-4 text-green-500">
                               [s]tatus [p]ause [b]ypass [c]heckpoint [q]uit
                           </div>
                       </div>
                   )}
                   {status === 'CRACKED' && (
                       <div className="flex flex-col items-center justify-center h-full text-green-500 gap-4">
                           <div className="text-4xl font-bold border-4 border-green-500 p-4 rounded animate-bounce">
                               CRACKED
                           </div>
                           <div className="text-center">
                               <p className="text-white mb-2">Target Hash:</p>
                               <p className="text-gray-500 mb-4 break-all max-w-md">{target}</p>
                               <p className="text-white mb-2">Plaintext:</p>
                               <p className="text-xl font-bold bg-green-900/20 px-4 py-2 border border-green-500 select-text">{crackedResult}</p>
                           </div>
                       </div>
                   )}
               </div>

               {/* Background visual flair */}
               <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #222 25%, #222 75%, #000 75%, #000)`}}></div>
          </div>
      </div>
    </div>
  );
};