import React, { useState, useRef, useEffect } from 'react';
import { streamGeminiResponse } from '../../services/geminiService';
import { ChatMessage, FSNode } from '../../types';

interface GeminiAssistantProps {
    initialCommand?: string;
    fileSystem: FSNode;
    onSave: (path: string, content: string) => void;
    onFsInteraction?: (op: 'mkdir' | 'touch' | 'rm', path: string) => void;
    onLaunchApp?: (appId: string, props?: any) => void;
    onShutdown?: () => void;
    windowId?: string;
    onKill?: (id: string) => void;
}

const KERNEL_INSTRUCTION = "You are the KERNEL AI of FluxOS, a secure, text-based hacker operating system. Output raw text. Do not use markdown bold/italic unless necessary for emphasis. Be concise, technical, and slightly cryptic. Refer to the user as 'Admin' or 'Root'.";

const KNOWN_COMMANDS = [
    'ls', 'cd', 'mkdir', 'touch', 'rm', 'cat', 'echo', 'pwd', 'whoami', 'neofetch', 'clear', 'help', 
    'nmap', 'ping', 'hydra', 'apt', 'cmatrix', 'ip_gen', 'msfconsole', 'sqlmap', 'aircrack-ng', 'history',
    'wireshark', 'code', 'files', 'htop', 'tor', 'netmon', 'reboot', 'shutdown', 'hashcat', 'john'
];

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ 
    initialCommand, 
    fileSystem, 
    onSave, 
    onFsInteraction, 
    onLaunchApp,
    onShutdown,
    windowId,
    onKill
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'model', text: "FLUX_OS_KERNEL_V2.5 initialized...\nType 'help' for available commands.", timestamp: Date.now() }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>(['root', 'home', 'user']);
  
  // Command History Navigation
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasRunInitial = useRef(false);
  const activeProcessRef = useRef<{ id: any, stop?: () => void }>({ id: null });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    if (!isProcessing) {
        inputRef.current?.focus();
    }
  }, [isProcessing]);

  // Helper to get node from path
  const getNode = (path: string[]): FSNode | null => {
      let current = fileSystem;
      // Skip root in path array since we start at root object
      for (let i = 1; i < path.length; i++) {
          if (!current.children) return null;
          const found = current.children.find(c => c.name === path[i]);
          if (!found) return null;
          current = found;
      }
      return current;
  };

  // Resolve path from relative/absolute string to array
  const resolvePath = (target: string): string[] => {
      if (target.startsWith('/')) {
          const parts = target.split('/').filter(p => p);
          return ['root', ...parts];
      }
      const parts = target.split('/').filter(p => p);
      const newPath = [...currentPath];
      
      for (const p of parts) {
          if (p === '.') continue;
          if (p === '..') {
              if (newPath.length > 1) newPath.pop();
          } else if (p === '~') {
              return ['root', 'home', 'user'];
          } else {
              newPath.push(p);
          }
      }
      return newPath;
  };

  const addToHistory = (text: string, role: 'model' | 'user' = 'model', path?: string) => {
      setHistory(prev => [...prev, { role, text, timestamp: Date.now(), path }]);
  };

  const updateLastMessage = (text: string) => {
      setHistory(prev => {
          const last = prev[prev.length - 1];
          const newHistory = [...prev];
          newHistory[prev.length - 1] = { ...last, text };
          return newHistory;
      });
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // --- COMMAND IMPLEMENTATIONS ---

  const runPing = async (target: string) => {
      addToHistory(`PING ${target} (192.168.1.55): 56 data bytes`);
      
      let seq = 1;
      const interval = setInterval(() => {
          const time = (Math.random() * 20 + 10).toFixed(1);
          addToHistory(`64 bytes from 192.168.1.55: icmp_seq=${seq} ttl=64 time=${time} ms`);
          seq++;
      }, 1000);

      activeProcessRef.current = { 
          id: interval,
          stop: () => {
              clearInterval(interval);
              addToHistory(`\n--- ${target} ping statistics ---`);
              addToHistory(`${seq-1} packets transmitted, ${seq-1} packets received, 0% packet loss`);
          }
      };
  };

  const runNmap = async (target: string) => {
      const logs = [
          `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().split('T')[0]}`,
          `Nmap scan report for ${target}`,
          `Host is up (0.0024s latency).`,
          `Not shown: 997 closed ports`,
          `PORT     STATE SERVICE VERSION`,
          `22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu`,
          `80/tcp   open  http    Apache httpd 2.4.41`,
          `443/tcp  open  ssl/http Apache httpd 2.4.41`,
          `MAC Address: 00:11:22:33:44:55 (Virtual)`,
          `Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`,
          `\nNmap done: 1 IP address (1 host up) scanned in 4.12 seconds`
      ];

      for (const log of logs) {
          if (!activeProcessRef.current.id) return;
          addToHistory(log);
          await delay(Math.random() * 500 + 200);
      }
      stopProcess();
  };

  const runApt = async (pkg: string) => {
      addToHistory(`Reading package lists... Done`);
      await delay(300);
      addToHistory(`Building dependency tree... Done`);
      await delay(300);
      addToHistory(`The following NEW packages will be installed: ${pkg}`);
      await delay(500);
      
      const total = 20;
      addToHistory(`Get:1 http://flux-repo.onion/kali/rolling ${pkg} [14.2 MB]`);
      
      addToHistory(`[0%] Fetching...`);
      for (let i = 1; i <= total; i++) {
          if (!activeProcessRef.current.id) return;
          await delay(100);
          const percent = Math.round((i / total) * 100);
          const bar = '='.repeat(i) + ' '.repeat(total - i);
          updateLastMessage(`[${bar}] ${percent}% Fetching...`);
      }
      
      updateLastMessage(`[====================] 100% Fetched.`);
      await delay(300);
      addToHistory(`Selecting previously unselected package ${pkg}.`);
      await delay(200);
      addToHistory(`(Reading database ... 245112 files and directories currently installed.)`);
      addToHistory(`Unpacking ${pkg}...`);
      await delay(800);
      addToHistory(`Setting up ${pkg}...`);
      await delay(200);
      addToHistory(`Done.`);
      stopProcess();
  };

  const runMatrix = async () => {
     const chars = "010101010010111010101ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     const interval = setInterval(() => {
         let line = "";
         for(let i=0; i<40; i++) {
             line += Math.random() > 0.8 ? chars[Math.floor(Math.random()*chars.length)] : " ";
         }
         addToHistory(line);
         setHistory(prev => prev.length > 30 ? prev.slice(1) : prev);
     }, 50);

     activeProcessRef.current = {
         id: interval,
         stop: () => {
             clearInterval(interval);
             setHistory([]); 
         }
     };
  };

  const runHydra = async (target: string) => {
      addToHistory(`Hydra v9.1 (c) 2023 by van Hauser/THC`);
      await delay(500);
      addToHistory(`[DATA] attacking ssh://${target}:22/`);
      await delay(800);
      
      let attempts = 0;
      const interval = setInterval(() => {
          attempts++;
          if (attempts > 5) {
              clearInterval(interval);
              addToHistory(`[22][ssh] host: ${target}   login: admin   password: password123`);
              addToHistory(`1 of 1 target successfully completed, 1 valid password found`);
              stopProcess();
              return;
          }
          addToHistory(`[STATUS] ${attempts * 10}.00 tries/min, ${attempts * 10} tries in 00:01h`);
      }, 1000);
      
      activeProcessRef.current = { id: interval, stop: () => clearInterval(interval) };
  };

  const runIpGen = async () => {
      addToHistory("Initializing IP Generator v1.0...");
      await delay(300);
      
      let count = 0;
      const interval = setInterval(() => {
          if (count >= 10) {
              clearInterval(interval);
              addToHistory("\nScan complete. 10 targets generated.");
              stopProcess();
              return;
          }
          const ip = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
          const status = Math.random() > 0.7 ? "[ALIVE]" : "[DEAD]";
          const port = Math.random() > 0.5 ? "80" : "443";
          const color = status === '[ALIVE]' ? '<span class="text-green-400">' : '<span class="text-red-500">';
          addToHistory(`${color}TARGET: ${ip.padEnd(15)} : ${status} ${status === '[ALIVE]' ? `(Port ${port} Open)` : ''}</span>`);
          count++;
      }, 400);

      activeProcessRef.current = { id: interval, stop: () => clearInterval(interval) };
  };

  const stopProcess = () => {
      if (activeProcessRef.current.stop) activeProcessRef.current.stop();
      if (activeProcessRef.current.id) {
          clearInterval(activeProcessRef.current.id);
          clearTimeout(activeProcessRef.current.id);
      }
      activeProcessRef.current = { id: null };
      setIsProcessing(false);
  };

  const launchExternalApp = (appName: string, appId: string, props?: any) => {
      if (!onLaunchApp) {
          addToHistory(`bash: ${appName}: GUI subsystem not responding.`);
          return;
      }
      const pid = Math.floor(Math.random() * 8000 + 1000);
      addToHistory(`[1] ${pid}`);
      addToHistory(`Starting ${appName}...`);
      onLaunchApp(appId, props);
  };

  const executeCommand = async (cmdStr: string) => {
      const trimmedCmd = cmdStr.trim();
      if (!trimmedCmd) return;

      setCmdHistory(prev => [...prev, trimmedCmd]);
      setHistoryPointer(-1);

      const promptPath = '/' + (currentPath.length === 1 ? '' : currentPath.slice(1).join('/'));
      addToHistory(trimmedCmd, 'user', promptPath);
      setInput('');

      const args = trimmedCmd.split(/\s+/);
      let cmd = args[0].toLowerCase();
      if (cmd === 'sudo') {
          cmd = args[1]?.toLowerCase() || '';
          args.shift();
      }

      // --- APP LAUNCHERS (THE "ALIVE" PART) ---
      switch(cmd) {
          case 'wireshark':
          case 'sniffer':
              launchExternalApp('Wireshark', 'sniffer');
              return;
          case 'code':
          case 'vim':
          case 'nano':
          case 'gedit':
          case 'notepad':
              const editFile = args[1];
              launchExternalApp('Text Editor', 'notepad', editFile ? { filePath: editFile } : undefined);
              return;
          case 'files':
          case 'nautilus':
          case 'explorer':
              launchExternalApp('File Manager', 'files');
              return;
          case 'htop':
          case 'top':
          case 'taskmgr':
              launchExternalApp('Process Manager', 'processes');
              return;
          case 'tor':
          case 'browser':
              launchExternalApp('Tor Browser', 'tor');
              return;
          case 'netmon':
          case 'iftop':
              launchExternalApp('Network Monitor', 'network');
              return;
          case 'hydra':
              // If user types hydra without args, launch GUI
              if (args.length === 1) {
                  launchExternalApp('Hydra GUI', 'cracker');
                  return;
              }
              // If args, run CLI simulation below
              break;
          case 'hashcat':
              launchExternalApp('Hashcat', 'hashcat');
              return;
          case 'john':
              launchExternalApp('John the Ripper', 'john');
              return;
          case 'trace':
          case 'traceroute':
              launchExternalApp('Geo Tracer', 'tracer');
              return;
          case 'scan':
          case 'defender':
          case 'antivirus':
              launchExternalApp('Virus Scanner', 'scanner');
              return;
          case 'virus':
          case 'builder':
              launchExternalApp('Payload Generator', 'virus');
              return;
          case 'settings':
          case 'config':
              launchExternalApp('System Settings', 'settings');
              return;
          case 'hasher':
          case 'sha256sum':
              launchExternalApp('Hash Tool', 'hasher');
              return;
          case 'remote':
          case 'rat':
              launchExternalApp('Remote Access Tool', 'remote');
              return;
          case 'reboot':
              addToHistory("System is rebooting NOW!");
              await delay(1000);
              onShutdown && onShutdown(); // Actually onShutdown triggers the logout animation which acts like a reboot cycle
              return;
          case 'shutdown':
          case 'poweroff':
          case 'halt':
              addToHistory("System halting...");
              await delay(1000);
              onShutdown && onShutdown();
              return;
          case 'exit':
              if (onKill && windowId) onKill(windowId);
              return;
      }

      // --- IMMEDIATE COMMANDS ---
      if (cmd === 'clear' || cmd === 'cls') {
          setHistory([]);
          return;
      }
      if (cmd === 'history') {
          setCmdHistory(prev => {
              const histStr = prev.map((c, i) => `${i + 1}  ${c}`).join('\n');
              addToHistory(histStr || "No history");
              return prev;
          });
          return;
      }
      if (cmd === 'help') {
          const helpText = `FLUX OS KERNEL SHELL v2.5
          
Userland Commands:
  ls, cd, mkdir, touch, rm, cat, echo, pwd, whoami, neofetch, clear, history
  
System Apps:
  wireshark     - Network Protocol Analyzer
  tor           - Onion Routing Browser
  htop          - Process Manager
  files         - File Explorer
  code [file]   - Text Editor
  hydra         - Password Cracker (GUI)
  hashcat       - Hash Cracking Tool
  reboot        - Restart System
  
Hacking Tools (CLI):
  nmap [target]       - Network Scanner
  ping [target]       - ICMP Echo
  apt install [pkg]   - Package Manager
  ip_gen              - IP Generator`;
          addToHistory(helpText);
          return;
      }

      // --- FS COMMANDS (Immediate) ---
      if (['mkdir', 'touch', 'rm'].includes(cmd)) {
          const target = args[1];
          if (!target) addToHistory(`${cmd}: missing operand`);
          else {
              const absPath = resolvePath(target);
              onFsInteraction && onFsInteraction(cmd as any, absPath.join('/'));
          }
          return;
      }
      if (cmd === 'echo') {
          const redirectIdx = args.indexOf('>');
          if (redirectIdx !== -1 && redirectIdx < args.length - 1) {
              const content = args.slice(1, redirectIdx).join(' ').replace(/^"|"$/g, '');
              const target = args[redirectIdx + 1];
              const absPath = resolvePath(target);
              onSave(absPath.join('/'), content);
          } else {
              addToHistory(args.slice(1).join(' ').replace(/^"|"$/g, ''));
          }
          return;
      }
      if (cmd === 'ls') {
          const target = args[1] ? resolvePath(args[1]) : currentPath;
          const node = getNode(target);
          if (node && node.children) {
              const items = node.children.map(c => {
                   if (c.type === 'folder') return `<span class="text-blue-500 font-bold">${c.name}/</span>`;
                   if (c.name.endsWith('.exe') || c.name.endsWith('.sh')) return `<span class="text-green-500 font-bold">${c.name}</span>`;
                   return `<span class="text-gray-300">${c.name}</span>`;
              }).join('  ');
              addToHistory(items || "(empty)");
          } else {
              addToHistory(`ls: cannot access '${args[1] || ''}': No such file or directory`);
          }
          return;
      }
      if (cmd === 'cd') {
          const target = args[1];
          if (!target) return;
          if (target === '/') { setCurrentPath(['root']); return; }
          if (target === '~') { setCurrentPath(['root', 'home', 'user']); return; }
          const newPath = resolvePath(target);
          const node = getNode(newPath);
          if (node && node.type === 'folder') setCurrentPath(newPath);
          else addToHistory(`bash: cd: ${target}: No such file or directory`);
          return;
      }
      if (cmd === 'cat') {
          const target = args[1];
          if (!target) { addToHistory("Usage: cat [filename]"); return; }
          const absPath = resolvePath(target);
          const parentNode = getNode(absPath.slice(0, -1));
          const fileNode = parentNode?.children?.find(c => c.name === absPath[absPath.length - 1] && c.type === 'file');
          if (fileNode) addToHistory(fileNode.content || "");
          else addToHistory(`cat: ${target}: No such file or directory`);
          return;
      }
      if (cmd === 'pwd') {
          addToHistory(promptPath);
          return;
      }
      if (cmd === 'whoami') {
          addToHistory('root');
          return;
      }
      if (cmd === 'neofetch') {
          addToHistory(`
       .---.           root@flux-os
      /     \\          ------------
      \\.@-@./          OS: FluxOS Rolling x86_64
      /\`\\_/\`\\          Host: Virtual Machine
     //  _  \\\\         Kernel: 5.15.0-flux-sec
    | \\     )|_        Uptime: ${Math.floor(performance.now() / 60000)} mins
   /\`\\_\`>  <_/ \\       Packages: 1337 (dpkg)
   \\__/'---'\\__/       Shell: bash 5.1.16
                       CPU: Neural Core v2.5
`);
          return;
      }

      // --- LONG RUNNING COMMANDS ---
      setIsProcessing(true);
      activeProcessRef.current = { id: setTimeout(() => {}, 0) }; 

      if (cmd === 'ping') {
          const target = args[1] || '8.8.8.8';
          runPing(target);
          return;
      }

      if (cmd === 'nmap') {
          const target = args[1] || '192.168.1.1';
          runNmap(target);
          return;
      }

      if (cmd === 'apt' || cmd === 'apt-get') {
          const pkg = args[args.indexOf('install') + 1] || 'package';
          runApt(pkg);
          return;
      }

      if (cmd === 'hydra') {
          const target = args[args.length - 1] || '10.0.0.5';
          runHydra(target);
          return;
      }

      if (cmd === 'cmatrix' || cmd === 'matrix') {
          runMatrix();
          return;
      }

      if (cmd.includes('ip_gen')) {
          runIpGen();
          return;
      }

      // --- FALLBACK AI ---
      let fullResponse = "";
      const responseId = Date.now() + 1;
      setHistory(prev => [...prev, { role: 'model', text: '', timestamp: responseId }]);

      const contextPrompt = `Current directory: /${currentPath.slice(1).join('/')}. User command: ${trimmedCmd}. If it's a known linux command I missed, simulate its output. If it's a question, answer efficiently.`;
      
      try {
        await streamGeminiResponse(contextPrompt, (chunk) => {
            fullResponse += chunk;
            setHistory(prev => prev.map(msg => 
                msg.timestamp === responseId ? { ...msg, text: fullResponse } : msg
            ));
        }, KERNEL_INSTRUCTION);
      } catch (e) {
          updateLastMessage("Error connecting to AI Core.");
      }
      stopProcess();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl+C
    if (e.ctrlKey && e.key === 'c') {
        if (isProcessing) {
            stopProcess();
            addToHistory('^C');
        }
        return;
    }

    // Handle Tab Autocomplete
    if (e.key === 'Tab') {
        e.preventDefault();
        const parts = input.split(' ');
        const lastPart = parts[parts.length - 1];
        
        if (parts.length === 1) {
             const matches = KNOWN_COMMANDS.filter(c => c.startsWith(lastPart));
             if (matches.length === 1) {
                 setInput(matches[0] + ' ');
             }
        } 
        else {
            const node = getNode(currentPath);
            if (node && node.children) {
                const candidates = node.children.map(c => c.name);
                if (currentPath.length > 1) candidates.push('..');
                
                const matches = candidates.filter(c => c.startsWith(lastPart));
                if (matches.length === 1) {
                    const newInput = parts.slice(0, -1).join(' ') + ' ' + matches[0];
                    setInput(newInput);
                }
            }
        }
        return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isProcessing) executeCommand(input);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length > 0) {
            const newIndex = historyPointer === -1 ? cmdHistory.length - 1 : Math.max(0, historyPointer - 1);
            setHistoryPointer(newIndex);
            setInput(cmdHistory[newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyPointer !== -1) {
            const newIndex = historyPointer + 1;
            if (newIndex >= cmdHistory.length) {
                setHistoryPointer(-1);
                setInput('');
            } else {
                setHistoryPointer(newIndex);
                setInput(cmdHistory[newIndex]);
            }
        }
    }
  };

  // Auto-execute initial command
  useEffect(() => {
    if (initialCommand && !hasRunInitial.current) {
        hasRunInitial.current = true;
        setTimeout(() => {
            executeCommand(initialCommand);
        }, 500);
    }
  }, [initialCommand]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-gray-300 font-mono text-sm p-1 cursor-text" onClick={() => !isProcessing && inputRef.current?.focus()}>
      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {history.map((msg, idx) => {
            const isRawHtml = msg.text.includes('<span');
            
            return (
              <div key={idx} className="break-words leading-tight mb-1">
                {msg.role === 'user' ? (
                   <div className="flex flex-wrap gap-2 text-white">
                     <span className="text-green-500 font-bold shrink-0">┌──(root㉿flux-os)-[{msg.path || '~'}]</span>
                     <div className="w-full flex gap-2 items-center -mt-1 pl-2">
                        <span className="text-green-500 font-bold">└─#</span>
                        <span className="font-bold">{msg.text}</span>
                     </div>
                   </div>
                ) : (
                   <div className="pl-0 text-gray-300 whitespace-pre-wrap">
                     {isRawHtml ? (
                         <div dangerouslySetInnerHTML={{__html: msg.text}} />
                     ) : (
                         <span>{msg.text}</span>
                     )}
                   </div>
                )}
              </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Command Input Area */}
      <div className={`px-2 pb-2 bg-[#0a0a0a] flex items-center gap-2 shrink-0 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
         <div className="flex flex-col w-full">
            <span className="text-green-500 font-bold">┌──(root㉿flux-os)-[/{currentPath.length === 1 ? '' : currentPath.slice(1).join('/')}]</span>
            <div className="flex items-center gap-2 pl-2">
                <span className="text-green-500 font-bold">└─#</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-700 font-bold"
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus
                />
            </div>
         </div>
      </div>
    </div>
  );
};