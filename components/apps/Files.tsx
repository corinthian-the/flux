import React, { useState, useEffect } from 'react';
import { Folder, FileText, HardDrive, Terminal, ArrowLeft, Lock, FileCode, Image as ImageIcon, Binary, ShieldAlert, Eye, Cpu, Key } from 'lucide-react';
import { FSNode } from '../../types';

interface FilesProps {
  fileSystem: FSNode;
  onOpenFile: (path: string, content: string) => void;
  onSave?: (path: string, content: string) => void;
}

export const Files: React.FC<FilesProps> = ({ fileSystem, onOpenFile, onSave }) => {
  const [path, setPath] = useState<string[]>(['root', 'home', 'user']);
  const [currentNode, setCurrentNode] = useState<FSNode>(fileSystem);
  const [selectedItem, setSelectedItem] = useState<FSNode | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  // Sync current node when path or filesystem changes
  useEffect(() => {
    let current = fileSystem;
    // Traverse
    for (let i = 1; i < path.length; i++) {
      const nextNode = current.children?.find(c => c.name === path[i]);
      if (nextNode) {
        current = nextNode;
      } else {
        break;
      }
    }
    setCurrentNode(current);
    setSelectedItem(null); // Deselect on nav
  }, [path, fileSystem]);

  const handleNavigate = (folderName: string) => {
    setPath([...path, folderName]);
  };

  const handleUp = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
    }
  };

  const jumpTo = (newPath: string[]) => {
    setPath(newPath);
  };

  const handleItemClick = (item: FSNode) => {
    setSelectedItem(item);
  };

  const handleItemDoubleClick = (item: FSNode) => {
    if (item.type === 'folder') {
        handleNavigate(item.name);
    } else {
        if (item.locked) return;
        const fullPath = path.join('/') + '/' + item.name;
        onOpenFile(fullPath, item.content || "");
    }
  };

  const handleEncrypt = async () => {
      if (!selectedItem || selectedItem.type !== 'file' || !onSave) return;
      
      const password = prompt("Enter password for AES-256 Encryption:");
      if (!password) return;

      setStatusMsg("Encrypting...");
      
      try {
          const enc = new TextEncoder();
          const keyMaterial = await window.crypto.subtle.importKey(
            "raw", 
            enc.encode(password), 
            { name: "PBKDF2" }, 
            false, 
            ["deriveKey"]
          );
          
          const key = await window.crypto.subtle.deriveKey(
            {
              name: "PBKDF2",
              salt: enc.encode("flux_os_salt"),
              iterations: 100000,
              hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt"]
          );

          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          const encodedContent = enc.encode(selectedItem.content || "");
          
          const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encodedContent
          );

          // Convert to Base64 storage format: IV::CIPHERTEXT
          const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
          const cipherArray = new Uint8Array(encryptedBuffer);
          const cipherBase64 = btoa(String.fromCharCode(...cipherArray));
          
          const finalContent = `AES256::${ivHex}::${cipherBase64}`;
          const fullPath = path.join('/') + '/' + selectedItem.name;
          
          onSave(fullPath, finalContent);
          setStatusMsg("Encryption Successful.");
          setTimeout(() => setStatusMsg(''), 2000);

      } catch (e) {
          console.error(e);
          setStatusMsg("Encryption Failed.");
      }
  };

  const getFileIcon = (fileName: string, type: 'file' | 'folder', content?: string) => {
    if (type === 'folder') {
        if (fileName === '###') return ShieldAlert;
        return Folder;
    }
    if (content && content.startsWith('AES256::')) return Lock;
    if (fileName.endsWith('.exe')) return Cpu;
    if (fileName.endsWith('.json') || fileName.endsWith('.js') || fileName.endsWith('.py') || fileName.endsWith('.sh')) return FileCode;
    if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) return ImageIcon;
    if (fileName === 'shadow' || fileName.includes('hash')) return Lock;
    if (fileName.includes('nmap') || fileName.includes('crack') || fileName.includes('sploit') || fileName.endsWith('.bin')) return Binary;
    return FileText;
  };

  return (
    <div className="flex h-full bg-black text-green-500 font-mono select-none">
      {/* Sidebar */}
      <div className="w-40 border-r border-green-900/30 flex flex-col gap-0 text-xs shrink-0 bg-[#080808]">
        <div className="px-3 py-2 font-bold text-green-700 uppercase tracking-widest border-b border-green-900/30 text-[10px]">Mounts</div>
        
        <button onClick={() => jumpTo(['root'])} className={`flex items-center gap-2 px-3 py-2 hover:bg-green-900/20 transition-colors text-left ${path.length === 1 ? 'bg-green-900/20 text-white' : 'text-green-400'}`}>
            <HardDrive size={14} className="text-green-600" />
            <span>/</span>
        </button>

        <button onClick={() => jumpTo(['root', 'home', 'user'])} className={`flex items-center gap-2 px-3 py-2 hover:bg-green-900/20 transition-colors text-left ${path.includes('user') ? 'bg-green-900/20 text-white' : 'text-green-400'}`}>
            <Folder size={14} className="text-green-600" />
            <span>~</span>
        </button>
        
        <button onClick={() => jumpTo(['root', '###'])} className={`flex items-center gap-2 px-3 py-2 hover:bg-green-900/20 transition-colors text-left ${path.includes('###') ? 'bg-green-900/20 text-white' : 'text-green-400'}`}>
            <ShieldAlert size={14} className="text-red-600" />
            <span className="text-red-500 font-bold">/###</span>
        </button>

        <button onClick={() => jumpTo(['root', 'var', 'log'])} className={`flex items-center gap-2 px-3 py-2 hover:bg-green-900/20 transition-colors text-left ${path.includes('log') ? 'bg-green-900/20 text-white' : 'text-green-400'}`}>
            <FileText size={14} className="text-green-600" />
            <span>/log</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-black/50 min-w-0">
        {/* Address Bar */}
        <div className="h-9 border-b border-green-900/30 flex items-center px-2 gap-2 bg-zinc-900/50 shrink-0">
            <button 
                onClick={handleUp}
                disabled={path.length <= 1}
                className="p-1 hover:bg-green-500/20 disabled:opacity-30 disabled:hover:bg-transparent rounded text-green-500"
            >
                <ArrowLeft size={14} />
            </button>
            <div className="flex-1 flex items-center gap-1 text-xs text-green-400 bg-black/40 px-2 py-1 border border-green-900/30 rounded-sm font-mono">
                <span className="text-green-600">root@flux:</span>
                <span className="text-green-300">
                    {path.map((p, i) => (
                        <span key={i} className="cursor-pointer hover:underline" onClick={() => jumpTo(path.slice(0, i + 1))}>
                            {p === 'root' ? '' : `/${p}`}
                        </span>
                    ))}
                    {path.length === 1 && '/'}
                </span>
            </div>
            {statusMsg && <span className="text-[10px] text-green-400 animate-pulse">{statusMsg}</span>}
        </div>

        {/* File Grid */}
        <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 overflow-y-auto content-start h-full" onClick={() => setSelectedItem(null)}>
            {path.length > 1 && (
                <div 
                    onClick={(e) => { e.stopPropagation(); handleUp(); }}
                    className="flex items-center gap-2 p-2 hover:bg-green-900/20 cursor-pointer group select-none"
                >
                    <Folder size={16} className="text-green-700" />
                    <span className="text-xs text-green-400">..</span>
                </div>
            )}

            {currentNode.children && currentNode.children.length > 0 ? (
                currentNode.children.map((item, i) => {
                    const Icon = getFileIcon(item.name, item.type, item.content);
                    const isSelected = selectedItem?.name === item.name;
                    return (
                        <div 
                            key={i} 
                            onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                            onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(item); }}
                            className={`group flex items-center gap-3 p-2 border cursor-pointer transition-all ${
                                isSelected 
                                ? 'bg-green-900/40 border-green-500/50' 
                                : 'border-transparent hover:border-green-500/30 hover:bg-green-900/10'
                            }`}
                        >
                            <div className="relative shrink-0">
                                <Icon size={18} className={
                                    item.name === '###' ? "text-red-600" : 
                                    (item.content?.startsWith('AES256::') ? "text-yellow-500" :
                                    (item.type === 'folder' ? "text-green-600 group-hover:text-green-400" : "text-green-800 group-hover:text-green-500"))
                                } />
                            </div>
                            <div className="flex flex-col overflow-hidden min-w-0">
                                <span className={`text-xs truncate w-full font-medium ${
                                    item.name === '###' ? 'text-red-500 font-bold' : 
                                    (item.content?.startsWith('AES256::') ? 'text-yellow-500' : 'text-green-400')
                                }`}>{item.name}</span>
                                <div className="flex gap-2 text-[9px] text-green-800 font-mono">
                                    <span>{item.locked || item.content?.startsWith('AES256::') ? 'r--' : 'rw-'}</span>
                                    <span>{item.size || '4KB'}</span>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="col-span-full text-center py-10 text-green-900/50 italic text-xs">
                    [EMPTY_BUFFER]
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="h-8 border-t border-green-900/30 bg-[#050505] flex items-center px-3 text-[10px] text-green-700 gap-4 uppercase shrink-0 justify-between">
            <div className="flex gap-4 items-center">
                <span>{currentNode.children?.length || 0} objects</span>
                <span className="font-mono">Free: 12%</span>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={handleEncrypt}
                    disabled={!selectedItem || selectedItem.type !== 'file'}
                    className="flex items-center gap-1 hover:text-green-400 disabled:opacity-30 disabled:hover:text-green-700 transition-colors"
                >
                    <Lock size={10} /> ENCRYPT
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};