import React, { useState } from 'react';
import { Hash, ShieldCheck, Copy, RefreshCw } from 'lucide-react';

export const HashTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [matchStatus, setMatchStatus] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);

  const generateHash = async () => {
    if (!input) return;
    setLoading(true);
    
    // Simulate processing time for "hackery" feel
    setTimeout(async () => {
        const msgBuffer = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHash(hashHex);
        setLoading(false);
    }, 500);
  };

  const verifyHash = () => {
    if (!hash || !compareHash) return;
    setMatchStatus(hash === compareHash.trim());
  };

  const copyToClipboard = () => {
    if (hash) navigator.clipboard.writeText(hash);
  };

  return (
    <div className="h-full flex flex-col bg-black font-mono text-green-500 p-4 space-y-6 select-none">
      <div className="border-b border-green-900 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-400 font-bold">
            <Hash size={18} />
            <span>SHA-256 GENERATOR</span>
        </div>
        <div className="text-[10px] text-green-800">CRYPTO_MODULE_V1</div>
      </div>

      {/* Generation Section */}
      <div className="space-y-2">
        <label className="text-xs text-green-700 font-bold uppercase">Input String</label>
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter password or text..."
                className="flex-1 bg-[#0a0a0a] border border-green-900 p-2 text-sm text-white focus:border-green-500 focus:outline-none placeholder-green-900"
            />
            <button 
                onClick={generateHash}
                disabled={loading}
                className="bg-green-900/20 border border-green-700 hover:bg-green-500 hover:text-black px-4 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
                {loading ? <RefreshCw size={12} className="animate-spin" /> : <Hash size={12} />}
                COMPUTE
            </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="space-y-2">
        <label className="text-xs text-green-700 font-bold uppercase">Generated Hash</label>
        <div className="relative group">
            <textarea 
                readOnly
                value={hash}
                className="w-full h-20 bg-[#050505] border border-green-900 p-2 text-xs text-green-400 font-mono resize-none focus:outline-none"
                placeholder="Hash output..."
            />
            {hash && (
                <button 
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-1 text-green-700 hover:text-white bg-black/50 rounded hover:bg-green-900/50"
                    title="Copy"
                >
                    <Copy size={14} />
                </button>
            )}
        </div>
      </div>

      {/* Verification Section */}
      <div className="space-y-2 pt-4 border-t border-green-900/30">
        <label className="text-xs text-green-700 font-bold uppercase flex items-center gap-2">
            <ShieldCheck size={12} /> Verify Integrity
        </label>
        <div className="flex gap-2">
            <input 
                type="text" 
                value={compareHash}
                onChange={(e) => { setCompareHash(e.target.value); setMatchStatus(null); }}
                placeholder="Paste hash to compare..."
                className="flex-1 bg-[#0a0a0a] border border-green-900 p-2 text-[10px] text-green-300 focus:border-green-500 focus:outline-none placeholder-green-900"
            />
            <button 
                onClick={verifyHash}
                className="bg-green-900/20 border border-green-700 hover:bg-green-500 hover:text-black px-3 text-xs font-bold transition-all"
            >
                CHECK
            </button>
        </div>
        
        {matchStatus !== null && (
            <div className={`p-2 border text-center text-xs font-bold tracking-widest ${matchStatus ? 'border-green-500 bg-green-900/20 text-green-400' : 'border-red-500 bg-red-900/20 text-red-500'}`}>
                {matchStatus ? "MATCH CONFIRMED" : "INTEGRITY FAILURE"}
            </div>
        )}
      </div>
    </div>
  );
};