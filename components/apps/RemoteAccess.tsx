import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Terminal, Wifi, Lock, Eye, RefreshCw, AlertTriangle, Server, Cast, X, Minus, Square, Power, Globe, Search, Download } from 'lucide-react';

interface RemoteAccessProps {
  onSave?: (path: string, content: string) => void;
}

export const RemoteAccess: React.FC<RemoteAccessProps> = ({ onSave }) => {
  const [targetIp, setTargetIp] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED' | 'FAILED'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [targetType, setTargetType] = useState<'WIN' | 'LINUX' | 'CCTV' | null>(null);
  const [downloadMsg, setDownloadMsg] = useState('');
  
  // Interactive State - Linux
  const [linuxInput, setLinuxInput] = useState('');
  const [linuxHistory, setLinuxHistory] = useState<string[]>([]);
  const linuxEndRef = useRef<HTMLDivElement>(null);

  // Interactive State - Windows
  const [winStartOpen, setWinStartOpen] = useState(false);
  const [winOpenWindows, setWinOpenWindows] = useState<string[]>([]);
  
  // CCTV Animation
  const [frame, setFrame] = useState(0);
  useEffect(() => {
      if (status === 'CONNECTED' && targetType === 'CCTV') {
          const interval = setInterval(() => setFrame(f => f + 1), 1000);
          return () => clearInterval(interval);
      }
  }, [status, targetType]);

  // Scroll Linux term to bottom
  useEffect(() => {
      linuxEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [linuxHistory]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleConnect = () => {
      if (!targetIp) return;
      setStatus('CONNECTING');
      setLogs([]);
      setTargetType(null);
      setLinuxHistory([]);
      setWinOpenWindows([]);
      setWinStartOpen(false);
      setDownloadMsg('');

      const sequence = [
          `Resolving host ${targetIp}...`,
          `Ping: 14ms... Alive.`,
          `Scanning common ports...`,
          `Port 445 (SMB) OPEN`,
          `Port 3389 (RDP) OPEN`,
          `Attempting ETERNALBLUE exploit...`,
          `Sending Heap Spray...`,
          `Grooming kernel pool...`,
          `Exploit Successful! Injecting payload...`,
          `Opening reverse shell...`,
          `Establish tunnel [====================] 100%`
      ];

      let i = 0;
      const interval = setInterval(() => {
          if (i >= sequence.length) {
              clearInterval(interval);
              
              if (targetIp.includes('192.168')) {
                  setTargetType('WIN');
                  setStatus('CONNECTED');
                  setWinOpenWindows(['System Error']);
              } else if (targetIp.includes('10.0')) {
                  setTargetType('LINUX');
                  setStatus('CONNECTED');
                  setLinuxHistory(['Welcome to Ubuntu 20.04.6 LTS', 'System load: 0.02', 'Usage of /: 14.2% of 30GB', 'Type "help" for commands']);
              } else if (targetIp.includes('203.0')) {
                  setTargetType('CCTV');
                  setStatus('CONNECTED');
              } else {
                  setStatus('FAILED');
                  addLog('Connection refused by remote host.');
              }
              return;
          }
          addLog(sequence[i]);
          i++;
      }, 600);
  };

  const handleDisconnect = () => {
      setStatus('IDLE');
      setTargetIp('');
      setTargetType(null);
  };

  const performDownload = (filename: string, content: string) => {
      if (onSave) {
          onSave(`root/home/user/Downloads/${filename}`, content);
          setDownloadMsg(`Downloaded ${filename} to local filesystem.`);
          setTimeout(() => setDownloadMsg(''), 3000);
      }
  };

  // --- LINUX LOGIC ---
  const handleLinuxCommand = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          const cmd = linuxInput.trim();
          const newLog = [...linuxHistory, `admin@prod-server:~$ ${cmd}`];

          const args = cmd.split(' ');
          const command = args[0];

          if (command === 'clear') {
              setLinuxHistory([]);
              setLinuxInput('');
              return;
          }
          else if (command === 'ls') {
              newLog.push('Documents  Downloads  server.log  backup.tar.gz  start.sh  passwords.txt');
          }
          else if (command === 'ls -la') {
              newLog.push('drwxr-xr-x 5 admin admin 4096 Mar 10 10:00 .');
              newLog.push('-rw------- 1 admin admin  512 Mar 12 14:22 .bash_history');
              newLog.push('-rwxr-xr-x 1 admin admin 1024 Mar 11 09:30 start.sh');
          }
          else if (command === 'download') {
              const file = args[1];
              if (!file) newLog.push('Usage: download <filename>');
              else if (['server.log', 'backup.tar.gz', 'start.sh', 'passwords.txt'].includes(file)) {
                  newLog.push(`Initiating file transfer: ${file}...`);
                  newLog.push('Transfer complete (100%)');
                  performDownload(file, `[DOWNLOADED FROM ${targetIp}]\n\nFake content for ${file}...`);
              } else {
                  newLog.push(`File not found: ${file}`);
              }
          }
          else if (command === 'cat') {
              const file = args[1];
              if (file === 'passwords.txt') {
                  newLog.push('admin:SuperSecret123');
                  newLog.push('db_user:DatabasePass99');
              } else if (file) {
                   newLog.push(`[Binary content of ${file}]`);
              } else {
                  newLog.push('Usage: cat <filename>');
              }
          }
          else if (command === 'exit') {
              handleDisconnect();
              return;
          }
          else if (command !== '') {
              newLog.push(`bash: ${command}: command not found`);
          }

          setLinuxHistory(newLog);
          setLinuxInput('');
      }
  };

  // --- WINDOWS LOGIC ---
  const toggleWinWindow = (title: string) => {
      if (winOpenWindows.includes(title)) {
          setWinOpenWindows(winOpenWindows.filter(w => w !== title));
      } else {
          setWinOpenWindows([...winOpenWindows, title]);
      }
  };

  return (
    <div className="h-full flex flex-col bg-[#111] font-mono text-green-500 select-none relative">
      {/* Top Bar */}
      <div className="p-3 bg-[#050505] border-b border-green-900 flex items-center gap-4">
          <div className="p-2 bg-green-900/20 border border-green-700 rounded">
              <Cast size={20} />
          </div>
          <div className="flex-1">
              <h1 className="text-sm font-bold tracking-widest text-white">REMOTE_ACCESS_TOOL</h1>
              <div className="flex items-center gap-2 text-[10px]">
                  <span className={`w-2 h-2 rounded-full ${status === 'CONNECTED' ? 'bg-green-500 animate-pulse' : (status === 'FAILED' ? 'bg-red-500' : 'bg-gray-500')}`}></span>
                  <span className={status === 'CONNECTED' ? 'text-green-400' : 'text-gray-500'}>{status}</span>
                  {targetType && <span className="text-gray-400"> // TARGET: {targetType}</span>}
              </div>
          </div>
          <div className="flex gap-2">
              <input 
                type="text" 
                value={targetIp}
                onChange={(e) => setTargetIp(e.target.value)}
                placeholder="Target IP"
                className="bg-black border border-green-800 px-2 text-sm w-40 focus:outline-none focus:border-green-400"
                disabled={status === 'CONNECTED'}
              />
              {status === 'CONNECTED' ? (
                  <button 
                    onClick={handleDisconnect}
                    className="px-3 bg-red-900/50 text-red-400 border border-red-800 font-bold text-xs hover:bg-red-900 hover:text-white"
                  >
                      DISCONNECT
                  </button>
              ) : (
                  <button 
                    onClick={handleConnect}
                    disabled={status === 'CONNECTING'}
                    className="px-3 bg-green-700 text-black font-bold text-xs hover:bg-green-500 disabled:opacity-50"
                  >
                      CONNECT
                  </button>
              )}
          </div>
      </div>

      {/* Download Feedback Toast */}
      {downloadMsg && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-green-600 text-black px-4 py-2 font-bold text-xs rounded shadow-lg z-50 animate-in slide-in-from-top-2 fade-in">
              {downloadMsg}
          </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden bg-black flex flex-col">
          
          {/* Initial / Log State */}
          {status !== 'CONNECTED' && (
              <div className="flex-1 p-4 font-mono text-xs space-y-1 overflow-y-auto">
                  {logs.length === 0 && status === 'IDLE' && (
                      <div className="text-gray-600 text-center mt-20">
                          <Monitor size={48} className="mx-auto mb-4 opacity-20" />
                          <p>Ready to connect.</p>
                          <div className="mt-8 p-4 border border-green-900/30 inline-block text-left bg-green-900/5">
                              <p className="text-green-800 font-bold mb-2">Targets.json Cache:</p>
                              <p className="cursor-pointer hover:text-green-400" onClick={() => setTargetIp('192.168.1.55')}>192.168.1.55 (Windows 10)</p>
                              <p className="cursor-pointer hover:text-green-400" onClick={() => setTargetIp('10.0.0.5')}>10.0.0.5 (Ubuntu Server)</p>
                              <p className="cursor-pointer hover:text-green-400" onClick={() => setTargetIp('203.0.113.4')}>203.0.113.4 (CCTV)</p>
                          </div>
                      </div>
                  )}
                  {logs.map((l, i) => (
                      <div key={i} className="text-green-400">
                          <span className="text-green-800 mr-2">[{new Date().toLocaleTimeString()}]</span>
                          {l}
                      </div>
                  ))}
                  {status === 'FAILED' && (
                      <div className="text-red-500 font-bold mt-4 border border-red-900 p-2 bg-red-900/10 flex items-center gap-2">
                          <AlertTriangle size={16} /> HANDSHAKE FAILED. TARGET SECURED.
                      </div>
                  )}
              </div>
          )}

          {/* Connected State: Windows */}
          {status === 'CONNECTED' && targetType === 'WIN' && (
              <div className="flex-1 bg-[#008080] relative font-sans select-none">
                   {/* Icons */}
                   <div className="absolute inset-0 flex flex-col p-4 gap-6">
                       <div 
                            className="flex flex-col items-center gap-1 w-16 cursor-pointer group"
                            onDoubleClick={() => toggleWinWindow('My Computer')}
                       >
                           <div className="w-10 h-10 bg-blue-200 border border-blue-400 flex items-center justify-center shadow-md group-hover:opacity-80">
                               <div className="w-6 h-6 bg-blue-500"></div>
                           </div>
                           <span className="text-white text-xs drop-shadow-md bg-[#008080] px-1">My Computer</span>
                       </div>
                       <div 
                            className="flex flex-col items-center gap-1 w-16 cursor-pointer group"
                            onDoubleClick={() => toggleWinWindow('Passwords')}
                       >
                           <div className="w-10 h-10 bg-yellow-200 border border-yellow-400 flex items-center justify-center shadow-md group-hover:opacity-80">
                               <div className="w-8 h-6 bg-yellow-500 flex items-center justify-center">
                                   <div className="w-4 h-0.5 bg-black/20"></div>
                               </div>
                           </div>
                           <span className="text-white text-xs drop-shadow-md bg-[#008080] px-1">passwords.txt</span>
                       </div>
                   </div>

                   {/* Window: Passwords */}
                   {winOpenWindows.includes('Passwords') && (
                       <div className="absolute top-24 left-40 w-64 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shadow-xl z-10">
                           <div className="bg-blue-800 text-white px-1 font-bold text-xs flex justify-between items-center py-0.5">
                               <span>Notepad - passwords.txt</span>
                               <button className="bg-[#c0c0c0] text-black w-4 h-4 flex items-center justify-center border border-white border-r-black border-b-black text-[10px]" onClick={() => toggleWinWindow('Passwords')}>X</button>
                           </div>
                           <div className="bg-white h-32 border border-gray-500 m-1 p-1 font-mono text-xs overflow-auto text-black select-text relative">
                               admin: Hunter2<br/>
                               root: toor<br/>
                               wifi: 12345678<br/>
                               
                               <button 
                                onClick={() => performDownload('passwords.txt', 'admin: Hunter2\nroot: toor')}
                                className="absolute bottom-2 right-2 bg-gray-200 border border-black px-2 py-0.5 text-[10px] hover:bg-gray-300 flex items-center gap-1"
                               >
                                   <Download size={10} /> Download
                               </button>
                           </div>
                       </div>
                   )}

                   {/* Fake Error Popup */}
                   {winOpenWindows.includes('System Error') && (
                       <div className="absolute top-1/3 left-1/3 w-64 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shadow-xl z-50">
                           <div className="bg-blue-800 text-white px-1 font-bold text-xs flex justify-between items-center">
                               <span>System Error</span>
                               <button 
                                    className="bg-[#c0c0c0] text-black w-4 h-4 flex items-center justify-center border border-white border-r-black border-b-black text-[10px]"
                                    onClick={() => toggleWinWindow('System Error')}
                               >X</button>
                           </div>
                           <div className="p-4 flex gap-4 items-center">
                               <div className="w-8 h-8 bg-red-600 rounded-full text-white flex items-center justify-center font-serif font-bold border-2 border-red-800">X</div>
                               <div className="text-xs text-black">Windows has detected a critical error in svchost.exe</div>
                           </div>
                           <div className="p-2 flex justify-center">
                               <button 
                                    className="px-4 py-1 border border-white border-r-black border-b-black bg-[#c0c0c0] text-black text-xs active:border-black active:border-r-white active:border-b-white"
                                    onClick={() => toggleWinWindow('System Error')}
                               >OK</button>
                           </div>
                       </div>
                   )}

                   {/* Taskbar */}
                   <div className="h-8 bg-[#c0c0c0] border-t border-white flex items-center px-1 shadow-md absolute bottom-0 w-full z-40">
                       <button 
                            className={`px-2 py-0.5 font-bold italic border-2 flex items-center gap-1 shadow-sm transition-all bg-[#c0c0c0] border-white border-r-black border-b-black`}
                       >
                           <div className="w-4 h-4 bg-black rounded-full grid grid-cols-2 gap-px overflow-hidden opacity-80">
                               <div className="bg-orange-400"></div><div className="bg-green-400"></div><div className="bg-blue-400"></div><div className="bg-yellow-400"></div>
                           </div>
                           <span className="text-black text-sm">Start</span>
                       </button>
                       <div className="w-px h-6 bg-gray-500 mx-2"></div>
                       <div className="bg-[#16a085] border inset px-2 text-white text-xs py-1 border-2 border-gray-500 ml-auto">
                           12:45 PM
                       </div>
                   </div>
              </div>
          )}

          {/* Connected State: Linux Terminal */}
          {status === 'CONNECTED' && targetType === 'LINUX' && (
              <div className="flex-1 bg-black p-4 font-mono text-sm text-white overflow-y-auto" onClick={() => document.getElementById('linux-input')?.focus()}>
                  <div className="mb-4 text-gray-500 select-none">
                      Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-144-generic x86_64)<br/>
                      * Documentation:  https://help.ubuntu.com<br/>
                  </div>
                  
                  {linuxHistory.map((line, i) => (
                      <div key={i} className="whitespace-pre-wrap break-all">{line}</div>
                  ))}
                  
                  <div className="flex gap-2 items-center mt-2">
                      <span className="text-green-500 whitespace-nowrap">admin@prod-server:~$</span>
                      <input 
                        id="linux-input"
                        type="text" 
                        value={linuxInput}
                        onChange={(e) => setLinuxInput(e.target.value)}
                        onKeyDown={handleLinuxCommand}
                        className="bg-transparent border-none outline-none text-white flex-1 focus:ring-0 p-0"
                        autoComplete="off"
                        autoFocus
                      />
                  </div>
                  <div ref={linuxEndRef} />
              </div>
          )}

          {/* Connected State: CCTV */}
          {status === 'CONNECTED' && targetType === 'CCTV' && (
              <div className="flex-1 bg-[#111] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center relative">
                          <div className="w-3/4 h-1/2 bg-zinc-900 border-t-8 border-zinc-700 flex justify-center items-end perspective-1000">
                               <div className="w-20 h-32 bg-black opacity-50 transform -skew-x-12 translate-x-20"></div>
                               <div className="w-10 h-10 bg-red-900/20 rounded-full absolute top-10 right-10 animate-pulse"></div>
                          </div>
                      </div>
                  </div>
                  <div className="absolute top-4 left-4 text-white font-mono text-lg drop-shadow-md font-bold">
                      CAM_04 [LOBBY]
                  </div>
                  <div className="absolute top-4 right-4 text-white font-mono text-lg drop-shadow-md flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div> REC
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};