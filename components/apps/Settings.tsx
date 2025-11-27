import React, { useState, useEffect } from 'react';
import { Terminal, Globe, Shield, Cpu, Monitor, Info, Activity, HardDrive, Lock, Plus, Trash2, AlertTriangle, Scan, CheckCircle, XCircle } from 'lucide-react';

interface FirewallRule {
    id: number;
    action: 'ALLOW' | 'BLOCK';
    protocol: 'TCP' | 'UDP' | 'ICMP';
    port: string;
    ip: string;
}

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'net' | 'sec' | 'display' | 'info' | 'firewall'>('info');
  const [stats, setStats] = useState({ cpu: 12, mem: 24, storage: 45 });
  const [uptime, setUptime] = useState(124032); // Seconds

  // Firewall State
  const [rules, setRules] = useState<FirewallRule[]>([
      { id: 1, action: 'ALLOW', protocol: 'TCP', port: '22', ip: '192.168.1.0/24' },
      { id: 2, action: 'BLOCK', protocol: 'TCP', port: '80', ip: '0.0.0.0/0' },
      { id: 3, action: 'ALLOW', protocol: 'UDP', port: '1194', ip: '10.8.0.0/24' }
  ]);
  const [newRule, setNewRule] = useState<Partial<FirewallRule>>({ action: 'BLOCK', protocol: 'TCP', port: '', ip: '' });
  const [panicMode, setPanicMode] = useState(false);

  // Security Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<string[]>([]);

  // Live Stats Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 40) + 10, // 10-50%
        mem: Math.min(100, Math.floor(Math.random() * 10) + 30), // 30-40%
        storage: 45 // Static
      });
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const addRule = () => {
      if (!newRule.port || !newRule.ip) return;
      setRules([...rules, { ...newRule, id: Date.now() } as FirewallRule]);
      setNewRule({ action: 'BLOCK', protocol: 'TCP', port: '', ip: '' });
  };

  const deleteRule = (id: number) => {
      setRules(rules.filter(r => r.id !== id));
  };

  const runSecurityScan = () => {
      if (isScanning) return;
      setIsScanning(true);
      setScanProgress(0);
      setScanResults([]);

      const steps = [
          "Checking file integrity...",
          "Scanning for rootkits...",
          "Verifying kernel signatures...",
          "Auditing user permissions...",
          "Checking open ports...",
          "Analyzing process heuristics..."
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
          if (currentStep >= steps.length) {
              clearInterval(interval);
              setIsScanning(false);
              setScanResults([
                  "RESULT: SYSTEM SECURE",
                  "0 Rootkits found",
                  "1 Weak permission (fixed)",
                  "Integrity Check: PASSED"
              ]);
              return;
          }
          setScanProgress(((currentStep + 1) / steps.length) * 100);
          currentStep++;
      }, 800);
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-2 w-full text-left transition-all ${
        activeTab === id 
          ? 'bg-green-500 text-black font-bold' 
          : 'text-green-600 hover:bg-green-900/20 hover:text-green-400'
      }`}
    >
      <Icon size={16} />
      <span className="uppercase tracking-wider text-xs">{label}</span>
    </button>
  );

  const Toggle = ({ label, checked, onClick }: { label: string, checked?: boolean, onClick?: () => void }) => (
    <div 
        onClick={onClick}
        className="flex items-center justify-between p-2 border border-green-900/30 hover:bg-green-900/10 cursor-pointer group transition-colors"
    >
      <span className="text-green-400 text-xs group-hover:text-white font-mono">{label}</span>
      <div className={`w-8 h-4 border ${checked ? 'border-green-500 bg-green-500/20' : 'border-green-900 bg-black'} flex items-center px-0.5`}>
        <div className={`w-2.5 h-2.5 bg-green-500 transition-all shadow-[0_0_5px_rgba(34,197,94,0.5)] ${checked ? 'ml-auto' : ''}`} />
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, color = 'bg-green-500' }: { label: string, value: number, color?: string }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-green-400 uppercase font-bold">
            <span>{label}</span>
            <span>{Math.round(value)}%</span>
        </div>
        <div className="h-2 bg-green-900/20 border border-green-900/50 overflow-hidden">
            <div 
                className={`h-full ${color} transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]`} 
                style={{ width: `${value}%` }} 
            />
        </div>
    </div>
  );

  return (
    <div className="h-full flex bg-black font-mono select-none">
      {/* Sidebar */}
      <div className="w-48 border-r border-green-900 bg-[#050505] flex flex-col py-2">
        <div className="px-4 py-2 mb-4 border-b border-green-900/50">
            <span className="text-green-500 font-bold text-sm tracking-widest flex items-center gap-2">
                <Terminal size={14} /> CONFIG_TOOL
            </span>
        </div>
        <TabButton id="info" label="System Info" icon={Info} />
        <TabButton id="system" label="Kernel" icon={Cpu} />
        <TabButton id="net" label="Network" icon={Globe} />
        <TabButton id="firewall" label="Firewall" icon={Shield} />
        <TabButton id="sec" label="Security" icon={Lock} />
        <TabButton id="display" label="Display" icon={Monitor} />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-black/80 custom-scrollbar">
        
        {activeTab === 'info' && (
             <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-start gap-4 p-4 border border-green-500/30 bg-green-900/10">
                    <div className="p-3 bg-black border border-green-500 rounded-sm">
                        <Terminal size={32} className="text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-green-400 tracking-widest">FLUX_OS</h2>
                        <p className="text-xs text-green-700 font-bold">v2.5.0-nightly [HARDENED]</p>
                        <p className="text-[10px] text-green-800 mt-1">BUILD: 20240315_RELEASE</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-green-900 p-4 space-y-4">
                         <div className="flex items-center gap-2 text-green-500 border-b border-green-900/50 pb-2 mb-2">
                             <Activity size={14} />
                             <span className="text-xs font-bold uppercase">Resources</span>
                         </div>
                         <ProgressBar label="CPU Usage" value={stats.cpu} />
                         <ProgressBar label="Memory Allocation" value={stats.mem} />
                         <ProgressBar label="Swap Usage" value={2} color="bg-yellow-600" />
                    </div>

                    <div className="border border-green-900 p-4 space-y-2">
                         <div className="flex items-center gap-2 text-green-500 border-b border-green-900/50 pb-2 mb-2">
                             <HardDrive size={14} />
                             <span className="text-xs font-bold uppercase">Storage</span>
                         </div>
                         <div className="flex justify-between text-xs text-green-600">
                             <span>/dev/sda1 (Root)</span>
                             <span>45% Used</span>
                         </div>
                         <div className="h-1.5 w-full bg-green-900/20">
                             <div className="h-full bg-green-600 w-[45%]"></div>
                         </div>
                         
                         <div className="mt-4 pt-2 border-t border-green-900/30 space-y-1 text-xs">
                             <div className="flex justify-between text-green-400">
                                 <span>Uptime:</span>
                                 <span className="font-bold">{formatUptime(uptime)}</span>
                             </div>
                             <div className="flex justify-between text-green-700">
                                 <span>Kernel:</span>
                                 <span>5.15.0-flux-sec</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'system' && (
            <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border border-green-900 p-4 relative">
                    <span className="absolute -top-2.5 left-2 bg-black px-2 text-green-500 text-xs font-bold">KERNEL_PARAMS</span>
                    <div className="space-y-2 pt-2">
                        <Toggle label="Safe Mode Boot" />
                        <Toggle label="Verbose Logging" checked />
                        <Toggle label="Hardware Acceleration" checked />
                        <Toggle label="Overclock CPU" />
                        <Toggle label="Disable ASLR (DANGEROUS)" />
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'net' && (
             <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border border-green-900 p-4 relative">
                    <span className="absolute -top-2.5 left-2 bg-black px-2 text-green-500 text-xs font-bold">INTERFACES</span>
                    <div className="space-y-2 pt-2">
                        <Toggle label="eth0 [UP]" checked />
                        <Toggle label="wlan0 [DOWN]" />
                        <Toggle label="tun0 (VPN) [UP]" checked />
                        <Toggle label="mon0 (Monitor Mode)" checked />
                    </div>
                </div>
                <div className="border border-green-900 p-4 relative">
                    <span className="absolute -top-2.5 left-2 bg-black px-2 text-green-500 text-xs font-bold">DNS_CONFIG</span>
                     <div className="space-y-2 pt-2 text-xs text-green-400">
                        <div className="flex justify-between border-b border-green-900/30 pb-1">
                            <span>Primary</span>
                            <span className="text-white">1.1.1.1 (Cloudflare)</span>
                        </div>
                        <div className="flex justify-between border-b border-green-900/30 pb-1">
                            <span>Secondary</span>
                            <span className="text-white">8.8.8.8 (Google)</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'sec' && (
             <div className="space-y-6 animate-in fade-in duration-200">
                 <div className="border border-green-900 p-4 relative">
                    <span className="absolute -top-2.5 left-2 bg-black px-2 text-green-500 text-xs font-bold flex items-center gap-2">
                        <Scan size={12} /> SECURITY_AUDIT
                    </span>
                    <div className="space-y-4 pt-2">
                        <button 
                            onClick={runSecurityScan}
                            disabled={isScanning}
                            className="w-full bg-green-900/20 border border-green-700 text-green-400 hover:bg-green-900/40 hover:text-white py-2 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isScanning ? <Activity size={14} className="animate-spin" /> : <Scan size={14} />}
                            {isScanning ? 'SCANNING SYSTEM...' : 'START SYSTEM AUDIT'}
                        </button>
                        
                        {isScanning && <ProgressBar label="Audit Progress" value={scanProgress} />}

                        {scanResults.length > 0 && (
                            <div className="bg-green-900/10 border border-green-900/50 p-3 space-y-1">
                                {scanResults.map((res, i) => (
                                    <div key={i} className="text-[10px] font-mono flex items-center gap-2">
                                        <CheckCircle size={10} className="text-green-500" />
                                        <span className={i === 0 ? "font-bold text-green-400 uppercase" : "text-green-600"}>{res}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                 <div className="border border-green-900 p-4 relative">
                     <span className="absolute -top-2.5 left-2 bg-black px-2 text-green-500 text-xs font-bold">FIREWALL_RULES</span>
                    <div className="space-y-2 pt-2">
                        <Toggle label="Block Incoming PING" checked />
                        <Toggle label="Log Suspicious Packets" checked />
                    </div>
                </div>

                <div className="border border-green-900 p-4 relative">
                    <span className="absolute -top-2.5 left-2 bg-black px-2 text-green-500 text-xs font-bold flex items-center gap-1">
                        <Lock size={10} /> FILESYSTEM_HARDENING
                    </span>
                    <div className="space-y-2 pt-2">
                        <Toggle label="Filesystem Encryption (LUKS)" checked />
                        <Toggle label="Secure Boot Enforcement" checked />
                        <Toggle label="Automated IPS (Intrusion Prevention)" />
                    </div>
                </div>
            </div>
        )}
        
        {activeTab === 'firewall' && (
             <div className="space-y-6 animate-in fade-in duration-200">
                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-green-400">
                         <Shield size={20} />
                         <span className="font-bold">IPTABLES_MANAGER</span>
                     </div>
                     <span className="text-[10px] text-green-700 uppercase">Policy: Default DROP</span>
                 </div>

                 {/* Panic Mode */}
                 <div 
                    onClick={() => setPanicMode(!panicMode)}
                    className={`border p-3 flex items-center justify-between cursor-pointer transition-all ${panicMode ? 'bg-red-900/20 border-red-500 animate-pulse' : 'bg-[#0a0a0a] border-green-900 hover:border-red-900/50'}`}
                 >
                     <div className="flex items-center gap-3">
                         <div className={`p-2 rounded ${panicMode ? 'bg-red-500 text-black' : 'bg-green-900/20 text-red-500'}`}>
                             <AlertTriangle size={20} />
                         </div>
                         <div>
                             <h3 className={`font-bold text-sm ${panicMode ? 'text-red-400' : 'text-gray-400'}`}>PANIC MODE</h3>
                             <p className="text-[10px] text-gray-600">IMMEDIATELY BLOCK ALL INBOUND/OUTBOUND TRAFFIC</p>
                         </div>
                     </div>
                     <div className={`w-12 h-6 rounded-full p-1 transition-colors ${panicMode ? 'bg-red-500' : 'bg-gray-800'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full transition-transform ${panicMode ? 'translate-x-6' : ''}`} />
                     </div>
                 </div>

                 {/* Add Rule Form */}
                 <div className={`bg-[#0a0a0a] border border-green-900/50 p-4 grid grid-cols-12 gap-2 items-end transition-opacity ${panicMode ? 'opacity-50 pointer-events-none' : ''}`}>
                     <div className="col-span-2">
                         <label className="text-[10px] text-green-700 font-bold block mb-1">ACTION</label>
                         <select 
                            value={newRule.action}
                            onChange={(e) => setNewRule({...newRule, action: e.target.value as any})}
                            className="w-full bg-black border border-green-900 text-xs text-green-400 p-1 focus:outline-none focus:border-green-500"
                         >
                             <option value="ALLOW">ALLOW</option>
                             <option value="BLOCK">BLOCK</option>
                         </select>
                     </div>
                     <div className="col-span-2">
                         <label className="text-[10px] text-green-700 font-bold block mb-1">PROTO</label>
                         <select 
                             value={newRule.protocol}
                             onChange={(e) => setNewRule({...newRule, protocol: e.target.value as any})}
                             className="w-full bg-black border border-green-900 text-xs text-green-400 p-1 focus:outline-none focus:border-green-500"
                         >
                             <option value="TCP">TCP</option>
                             <option value="UDP">UDP</option>
                             <option value="ICMP">ICMP</option>
                         </select>
                     </div>
                     <div className="col-span-2">
                         <label className="text-[10px] text-green-700 font-bold block mb-1">PORT</label>
                         <input 
                            type="text" 
                            placeholder="e.g. 80"
                            value={newRule.port}
                            onChange={(e) => setNewRule({...newRule, port: e.target.value})}
                            className="w-full bg-black border border-green-900 text-xs text-green-400 p-1 focus:outline-none focus:border-green-500"
                         />
                     </div>
                     <div className="col-span-4">
                         <label className="text-[10px] text-green-700 font-bold block mb-1">SOURCE IP / CIDR</label>
                         <input 
                            type="text" 
                            placeholder="e.g. 192.168.1.0/24"
                            value={newRule.ip}
                            onChange={(e) => setNewRule({...newRule, ip: e.target.value})}
                            className="w-full bg-black border border-green-900 text-xs text-green-400 p-1 focus:outline-none focus:border-green-500"
                         />
                     </div>
                     <div className="col-span-2">
                         <button onClick={addRule} className="w-full bg-green-900/30 border border-green-700 hover:bg-green-500 hover:text-black text-xs font-bold py-1 transition-colors flex items-center justify-center gap-1">
                             <Plus size={12} /> ADD
                         </button>
                     </div>
                 </div>

                 {/* Rules Table */}
                 <div className={`border border-green-900/50 ${panicMode ? 'opacity-50' : ''}`}>
                     <div className="grid grid-cols-12 bg-green-900/20 p-2 text-[10px] font-bold text-green-600 border-b border-green-900/50">
                         <div className="col-span-2">ACTION</div>
                         <div className="col-span-2">PROTO</div>
                         <div className="col-span-2">PORT</div>
                         <div className="col-span-5">SOURCE</div>
                         <div className="col-span-1"></div>
                     </div>
                     
                     {panicMode && (
                        <div className="p-4 text-center text-red-500 font-bold tracking-widest bg-red-900/10 border-b border-green-900/10 animate-pulse">
                            !!! TRAFFIC SUSPENDED !!!
                        </div>
                     )}

                     {rules.map(rule => (
                         <div key={rule.id} className="grid grid-cols-12 p-2 text-xs border-b border-green-900/10 items-center hover:bg-green-900/5">
                             <div className={`col-span-2 font-bold ${rule.action === 'BLOCK' ? 'text-red-500' : 'text-green-500'}`}>
                                 {rule.action}
                             </div>
                             <div className="col-span-2 text-green-300">{rule.protocol}</div>
                             <div className="col-span-2 text-white">{rule.port}</div>
                             <div className="col-span-5 text-gray-400 font-mono">{rule.ip}</div>
                             <div className="col-span-1 text-right">
                                 <button onClick={() => deleteRule(rule.id)} className="text-red-500 hover:text-red-300 transition-colors">
                                     <Trash2 size={12} />
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        )}
        
        {activeTab === 'display' && (
             <div className="space-y-6 animate-in fade-in duration-200">
                 <div className="border border-green-900 p-4 relative">
                    <span className="absolute -top-2.5 left-2 bg-black px-2 text-green-500 text-xs font-bold">TERMINAL_RENDERER</span>
                    <div className="space-y-2 pt-2">
                        <Toggle label="CRT Scanlines" checked />
                        <Toggle label="Phosphor Glow" checked />
                        <Toggle label="Hardware Sync" checked />
                        <Toggle label="Amber Monochrome Mode" />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};