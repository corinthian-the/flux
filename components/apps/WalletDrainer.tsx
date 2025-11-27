import React, { useState, useEffect, useRef } from 'react';
import { Bitcoin, Wallet, RefreshCw, ArrowRight, DollarSign, Lock, Unlock, AlertTriangle } from 'lucide-react';

export const WalletDrainer: React.FC = () => {
  const [chain, setChain] = useState<'BTC' | 'ETH' | 'SOL'>('BTC');
  const [isRunning, setIsRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [foundWallet, setFoundWallet] = useState<{ address: string, balance: number, privateKey: string } | null>(null);
  const [drained, setDrained] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isRunning && !foundWallet) {
        interval = setInterval(() => {
            setAttempts(prev => prev + Math.floor(Math.random() * 1500) + 500);
            
            // Randomly generate fake keys for visual effect
            const fakeKey = Array.from({length: chain === 'BTC' ? 52 : 64}, () => 
                "abcdef0123456789"[Math.floor(Math.random() * 16)]
            ).join('');
            
            setLogs(prev => {
                const newLogs = [...prev, `[${chain}] CHECKING: ${fakeKey.substring(0, 20)}... -> 0.00`];
                if (newLogs.length > 20) return newLogs.slice(newLogs.length - 20);
                return newLogs;
            });

            // Random "Success" chance
            if (Math.random() > 0.995) {
                const found = {
                    address: chain === 'BTC' ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' : 
                             chain === 'ETH' ? '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' :
                             '5U3bKWc56yMHGJp2CEmRy75e9535263526252',
                    balance: parseFloat((Math.random() * 5).toFixed(4)),
                    privateKey: fakeKey
                };
                setFoundWallet(found);
                setIsRunning(false);
                setLogs(prev => [...prev, `[+] HIT! Wallet found: ${found.address}`]);
            }

        }, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning, foundWallet, chain]);

  useEffect(() => {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleDrain = () => {
      if (!foundWallet) return;
      setLogs(prev => [...prev, `[!] INITIATING TRANSACTION...`, `[!] BROADCASTING TO MEMPOOL...`]);
      setTimeout(() => {
          setDrained(true);
          setLogs(prev => [...prev, `[+] CONFIRMED. ${foundWallet.balance} ${chain} transferred to local wallet.`]);
      }, 2000);
  };

  const reset = () => {
      setIsRunning(false);
      setFoundWallet(null);
      setDrained(false);
      setAttempts(0);
      setLogs([]);
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] text-yellow-500 font-mono select-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-900/50 bg-yellow-900/10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-900/20 border border-yellow-700 rounded shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    <Bitcoin size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-widest text-white">CRYPTO_DRAINER</h1>
                    <p className="text-xs text-yellow-700">Private Key Brute Force Tool v2.1</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1">
                    <RefreshCw size={14} className={isRunning ? "animate-spin" : ""} />
                    <span>{attempts.toLocaleString()} KEYS CHECKED</span>
                </div>
            </div>
        </div>

        <div className="flex-1 flex min-h-0">
            {/* Sidebar Config */}
            <div className="w-64 border-r border-yellow-900/30 p-4 flex flex-col gap-6 bg-[#0a0a0a]">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Target Blockchain</label>
                    <div className="flex flex-col gap-2">
                        {['BTC', 'ETH', 'SOL'].map(c => (
                            <button 
                                key={c}
                                onClick={() => { setChain(c as any); reset(); }}
                                className={`px-4 py-3 border text-left font-bold text-sm flex items-center justify-between transition-all ${chain === c ? 'bg-yellow-600 text-black border-yellow-500' : 'bg-transparent text-yellow-600 border-yellow-900/50 hover:bg-yellow-900/20'}`}
                            >
                                {c} Network
                                {chain === c && <Lock size={14} />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto space-y-2">
                    {!foundWallet ? (
                        <button 
                            onClick={() => setIsRunning(!isRunning)}
                            className={`w-full py-3 font-bold text-black transition-all ${isRunning ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'}`}
                        >
                            {isRunning ? 'STOP ATTACK' : 'START BRUTE FORCE'}
                        </button>
                    ) : (
                        <button 
                            onClick={handleDrain}
                            disabled={drained}
                            className="w-full py-3 bg-red-600 text-black font-bold animate-pulse hover:bg-red-500 disabled:animate-none disabled:opacity-50 disabled:bg-gray-600"
                        >
                            {drained ? 'ASSETS DRAINED' : 'DRAIN WALLET NOW'}
                        </button>
                    )}
                    
                    <button onClick={reset} className="w-full py-2 border border-yellow-900/50 text-yellow-700 text-xs hover:text-yellow-500">
                        RESET SESSION
                    </button>
                </div>
            </div>

            {/* Main Visualizer */}
            <div className="flex-1 flex flex-col bg-black relative">
                
                {/* Found Wallet Overlay */}
                {foundWallet && (
                    <div className="absolute inset-x-0 top-0 bg-yellow-900/20 border-b border-yellow-600 p-6 flex items-center justify-between animate-in slide-in-from-top-10 z-10 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500 rounded-full text-black">
                                <Unlock size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">WALLET CRACKED!</h2>
                                <p className="font-mono text-sm text-yellow-400">{foundWallet.address}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase font-bold">Balance Found</div>
                            <div className="text-4xl font-mono text-green-500 font-bold flex items-center gap-2">
                                {foundWallet.balance} <span className="text-xl">{chain}</span>
                            </div>
                            <div className="text-xs text-gray-500">~${(foundWallet.balance * (chain === 'BTC' ? 64000 : chain === 'ETH' ? 3500 : 150)).toLocaleString()} USD</div>
                        </div>
                    </div>
                )}

                {/* Matrix/Log View */}
                <div className="flex-1 overflow-hidden relative p-4 flex flex-col justify-end">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(234, 179, 8, .3) 25%, rgba(234, 179, 8, .3) 26%, transparent 27%, transparent 74%, rgba(234, 179, 8, .3) 75%, rgba(234, 179, 8, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(234, 179, 8, .3) 25%, rgba(234, 179, 8, .3) 26%, transparent 27%, transparent 74%, rgba(234, 179, 8, .3) 75%, rgba(234, 179, 8, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}}></div>
                    
                    <div className="font-mono text-xs space-y-1 z-0 opacity-80">
                        {logs.length === 0 && <div className="text-center text-yellow-900 mt-20">Initializing cryptographic engine...<br/>Ready to crack.</div>}
                        {logs.map((log, i) => (
                            <div key={i} className={`${log.includes('HIT!') ? 'text-green-400 font-bold bg-green-900/20' : (log.includes('DRAIN') ? 'text-red-400 font-bold' : 'text-yellow-700')}`}>
                                {log}
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>

                {/* Drained State */}
                {drained && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 animate-in fade-in duration-1000">
                        <DollarSign size={80} className="text-green-500 mb-6 animate-bounce" />
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-widest">TRANSFER COMPLETE</h1>
                        <p className="text-green-600 font-mono mb-8">Funds successfully moved to mixing service.</p>
                        
                        <div className="w-full max-w-md bg-zinc-900 border border-green-800 p-4 rounded text-xs font-mono">
                            <div className="flex justify-between mb-2 border-b border-gray-700 pb-2">
                                <span className="text-gray-500">TXID</span>
                                <span className="text-green-500">0x{Math.random().toString(16).slice(2)}...</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Amount</span>
                                <span className="text-white">{foundWallet?.balance} {chain}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className="text-green-500 font-bold">CONFIRMED (12/12)</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};