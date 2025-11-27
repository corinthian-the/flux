import React, { useState } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Trash2, ShieldCheck, Activity, FileWarning, Lock } from 'lucide-react';
import { FSNode } from '../../types';

interface VirusScannerProps {
  fileSystem: FSNode;
  onSave: (path: string, content: string) => void;
}

interface Threat {
    path: string;
    name: string;
    type: string;
    risk: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const VirusScanner: React.FC<VirusScannerProps> = ({ fileSystem, onSave }) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [threats, setThreats] = useState<Threat[]>([]);
  const [scanFinished, setScanFinished] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  const flattenFS = (node: FSNode, path: string, list: {path: string, node: FSNode}[]) => {
      // Construct path, but ignore 'root' for display purposes if we want, 
      // or keep it to match system logic. Let's keep it simple.
      const currentPath = path ? `${path}/${node.name}` : node.name;
      
      if (node.type === 'file') {
          list.push({ path: currentPath, node });
      }
      if (node.children) {
          node.children.forEach(child => flattenFS(child, currentPath, list));
      }
  }

  const startScan = () => {
      setScanning(true);
      setScanFinished(false);
      setThreats([]);
      setCleaned(false);
      setProgress(0);

      const allFiles: {path: string, node: FSNode}[] = [];
      // Start from the children of root to avoid scanning the root folder object itself as a file
      if (fileSystem.children) {
          fileSystem.children.forEach(child => flattenFS(child, 'root', allFiles));
      }

      let idx = 0;
      // Faster scan simulation
      const interval = setInterval(() => {
          if (idx >= allFiles.length) {
              clearInterval(interval);
              setScanning(false);
              setScanFinished(true);
              setCurrentFile('Scan Complete.');
              setProgress(100);
              return;
          }

          const file = allFiles[idx];
          setCurrentFile(file.path);
          setProgress(Math.round(((idx + 1) / allFiles.length) * 100));

          // Hacker Heuristics
          let threatType = '';
          let risk: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
          
          // Check for known "bad" files or extensions in this specific OS environment
          if (file.node.name.endsWith('.exe') && file.node.name !== 'flux_kernel.exe') {
              threatType = 'Unsigned Binary';
              risk = 'MEDIUM';
          }
          if (file.node.name.includes('virus') || file.node.name.includes('trojan') || file.node.name.includes('malware')) {
              threatType = 'Malware Signature';
              risk = 'HIGH';
          }
          if (file.node.name.includes('payload') || file.node.name.includes('exploit') || file.node.name.includes('attack')) {
              threatType = 'Exploit Script';
              risk = 'HIGH';
          }
          if (file.node.name === 'shadow_hashes.txt' || file.node.name.includes('password')) {
              threatType = 'Sensitive Security Data';
              risk = 'MEDIUM';
          }
          // Check content if available
          if (file.node.content && (file.node.content.includes('buffer overflow') || file.node.content.includes('exploit'))) {
               threatType = 'Malicious Code Pattern';
               risk = 'HIGH';
          }

          if (threatType) {
              setThreats(prev => [...prev, {
                  path: file.path,
                  name: file.node.name,
                  type: threatType,
                  risk
              }]);
          }

          idx++;
      }, 100); 
  };

  const cleanThreats = () => {
      threats.forEach(threat => {
          // Overwrite file content to "quarantine" it
          onSave(threat.path, "QUARANTINED_FILE\n\n[This file has been neutralized by FluxOS Defender]\n\nOriginal content removed for security.");
      });
      setCleaned(true);
      setThreats([]);
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] font-mono text-green-500 p-4 select-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-green-900 pb-4">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-green-900/20 border border-green-700 rounded">
                    <ShieldCheck size={32} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-widest text-white">FLUX_DEFENDER</h1>
                    <p className="text-xs text-green-700">System Integrity Monitor v3.5</p>
                </div>
            </div>
            {scanning && <Activity size={24} className="animate-pulse text-green-400" />}
        </div>

        {/* Main Scan Area */}
        <div className="flex-1 flex flex-col gap-4">
            
            {!scanning && !scanFinished && (
                <div className="flex-1 flex flex-col items-center justify-center border border-green-900/30 bg-green-900/5 rounded-lg">
                    <Shield size={64} className="text-green-800 mb-4 opacity-50" />
                    <h2 className="text-lg text-green-600 font-bold mb-2">SYSTEM IDLE</h2>
                    <p className="text-xs text-green-800 mb-8 text-center max-w-xs">
                        Last scan performed: Unknown.<br/>
                        Root filesystem mounted RW.<br/>
                        Heuristic engine active.
                    </p>
                    <button 
                        onClick={startScan}
                        className="px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-bold tracking-widest transition-all rounded shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2"
                    >
                        <Search size={18} /> INITIATE SCAN
                    </button>
                </div>
            )}

            {scanning && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-64 h-64 border-2 border-green-900 rounded-full relative flex items-center justify-center mb-8 overflow-hidden">
                        <div className="absolute inset-0 bg-green-500/10 animate-pulse rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 animate-[scan_2s_linear_infinite] shadow-[0_0_15px_rgba(34,197,94,0.8)]"></div>
                        <div className="text-4xl font-bold text-white">{progress}%</div>
                    </div>
                    <div className="w-full max-w-lg space-y-2">
                        <div className="flex justify-between text-xs text-green-400 font-bold">
                            <span>SCANNING...</span>
                            <span>{threats.length} THREATS FOUND</span>
                        </div>
                        <div className="h-2 bg-green-900/30 w-full rounded overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-100" style={{width: `${progress}%`}}></div>
                        </div>
                        <div className="text-[10px] text-green-700 truncate font-mono h-4">
                            {currentFile}
                        </div>
                    </div>
                </div>
            )}

            {scanFinished && (
                <div className="flex-1 flex flex-col">
                    <div className={`p-4 border-l-4 mb-4 flex justify-between items-center ${threats.length > 0 ? 'border-red-500 bg-red-900/10' : 'border-green-500 bg-green-900/10'}`}>
                        <div>
                            <h3 className={`font-bold text-lg ${threats.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {threats.length > 0 ? 'THREATS DETECTED' : 'SYSTEM CLEAN'}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {threats.length > 0 
                                    ? `${threats.length} malicious objects found in filesystem.` 
                                    : 'No integrity violations found.'
                                }
                            </p>
                        </div>
                        {threats.length === 0 && <CheckCircle size={32} className="text-green-500" />}
                        {threats.length > 0 && <AlertTriangle size={32} className="text-red-500 animate-pulse" />}
                    </div>

                    {/* Threat List */}
                    {threats.length > 0 && (
                        <div className="flex-1 border border-red-900/30 bg-black overflow-y-auto custom-scrollbar p-2 space-y-2 mb-4">
                            {threats.map((t, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 bg-red-900/10 border border-red-900/20 hover:bg-red-900/20">
                                    <FileWarning size={20} className="text-red-500 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between">
                                            <span className="text-red-400 font-bold text-xs">{t.name}</span>
                                            <span className="text-[10px] bg-red-900/50 text-red-200 px-1 rounded">{t.risk}</span>
                                        </div>
                                        <div className="text-[10px] text-red-700 truncate">{t.path}</div>
                                        <div className="text-[10px] text-red-600">{t.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4 mt-auto">
                        <button 
                            onClick={startScan}
                            className="flex-1 py-3 border border-green-700 text-green-500 hover:bg-green-900/30 font-bold text-xs"
                        >
                            RESCAN
                        </button>
                        {threats.length > 0 && (
                            <button 
                                onClick={cleanThreats}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-black font-bold text-xs flex items-center justify-center gap-2"
                            >
                                <Trash2 size={14} /> QUARANTINE ALL
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            {cleaned && scanFinished && threats.length === 0 && (
                <div className="absolute inset-0 bg-black/90 z-10 flex flex-col items-center justify-center animate-in fade-in">
                    <ShieldCheck size={64} className="text-green-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">THREATS NEUTRALIZED</h2>
                    <p className="text-green-600 text-sm mb-6">All detected malicious entities have been quarantined.</p>
                    <button onClick={() => setCleaned(false)} className="px-6 py-2 border border-green-500 text-green-400 hover:bg-green-900/30 text-xs">
                        RETURN TO DASHBOARD
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};