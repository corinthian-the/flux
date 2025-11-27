import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Shield, Globe, Lock, Search, AlertTriangle, ShoppingCart, MessageSquare } from 'lucide-react';

export const TorBrowser: React.FC = () => {
  const [url, setUrl] = useState('flux://home');
  const [inputValue, setInputValue] = useState('flux://home');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionLog, setConnectionLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['flux://home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate Tor Bootstrap
  useEffect(() => {
    const steps = [
      "Establishing encrypted circuit...",
      "Handshaking with Relay node [Germany]...",
      "Handshaking with Relay node [Russia]...",
      "Handshaking with Exit node [Panama]...",
      "Verifying cryptographic keys...",
      "Circuit established. Anonymity verified."
    ];
    
    let delay = 0;
    steps.forEach((step, i) => {
      delay += 800;
      setTimeout(() => {
        setConnectionLog(prev => [...prev, step]);
        if (i === steps.length - 1) setIsConnected(true);
      }, delay);
    });
  }, []);

  const navigate = (newUrl: string) => {
    setLoading(true);
    setInputValue(newUrl);
    setSearchQuery(''); // Reset search on nav
    
    // Simulate network latency
    setTimeout(() => {
        setUrl(newUrl);
        setLoading(false);
        if (newUrl !== history[historyIndex]) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newUrl);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    }, 1500);
  };

  const handleBack = () => {
      if (historyIndex > 0) {
          const prev = history[historyIndex - 1];
          setHistoryIndex(historyIndex - 1);
          setUrl(prev);
          setInputValue(prev);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      navigate(inputValue);
  };

  const fakeLinks = [
      { url: 'http://hiddenwiki.onion', title: 'The Hidden Wiki', desc: 'Directory of .onion sites', icon: Globe, color: 'text-purple-500' },
      { url: 'http://market.onion', title: 'ZeroDay Bazaar', desc: 'Exploits & Credentials', icon: ShoppingCart, color: 'text-green-500' },
      { url: 'http://forum.onion', title: 'BlackHat Talk', desc: 'Anonymous Forum', icon: MessageSquare, color: 'text-blue-500' },
      { url: 'http://docs.onion', title: 'Leaked Docs', desc: 'Classified blue-prints', icon: Lock, color: 'text-red-500' },
      { url: 'http://mixer.onion', title: 'CoinMixer', desc: 'Anonymous crypto laundry', icon: RefreshCw, color: 'text-yellow-500' }
  ];

  const filteredLinks = fakeLinks.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isConnected) {
      return (
          <div className="h-full bg-[#1a1a1a] text-gray-300 font-mono flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="mb-8 text-center z-10">
                  <Globe size={64} className="text-purple-500 mx-auto mb-4 animate-pulse" />
                  <h1 className="text-2xl font-bold text-purple-400 tracking-widest">ONION_ROUTER</h1>
                  <p className="text-xs text-gray-500 mt-2">Randomizing network path...</p>
              </div>
              <div className="w-full max-w-md bg-black border border-purple-900/50 p-4 rounded h-48 overflow-y-auto custom-scrollbar z-10">
                  {connectionLog.map((log, i) => (
                      <div key={i} className="text-xs text-purple-300 mb-1 font-mono">
                          <span className="text-purple-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                          {log}
                      </div>
                  ))}
                  <div className="animate-pulse text-purple-500">_</div>
              </div>
              {/* Background Map Effect */}
              <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-12 grid-rows-12">
                   {Array.from({length: 144}).map((_, i) => (
                       <div key={i} className="border border-purple-500/20"></div>
                   ))}
              </div>
          </div>
      );
  }

  const renderContent = () => {
      if (loading) {
          return (
              <div className="flex-1 flex items-center justify-center bg-[#121212]">
                  <div className="flex flex-col items-center gap-4">
                      <RefreshCw size={32} className="animate-spin text-purple-500" />
                      <span className="text-purple-400 font-mono text-xs animate-pulse">Resolving .onion descriptor...</span>
                  </div>
              </div>
          );
      }

      switch (url) {
          case 'flux://home':
              return (
                  <div className="flex-1 bg-[#121212] p-8 flex flex-col items-center text-gray-300 overflow-y-auto">
                      <div className="mt-10 mb-8 text-center">
                          <h1 className="text-4xl font-bold text-purple-500 tracking-tighter mb-2">TORCH</h1>
                          <p className="text-sm text-gray-600">The Dark Web Search Engine</p>
                      </div>
                      <div className="w-full max-w-xl relative">
                          <input 
                            type="text" 
                            placeholder="Search hidden services..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-purple-900/50 rounded-full py-3 px-12 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" 
                          />
                          <Search className="absolute left-4 top-3.5 text-gray-600" size={18} />
                      </div>
                      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                          {filteredLinks.map((link, i) => (
                              <button key={i} onClick={() => navigate(link.url)} className="bg-[#1a1a1a] p-4 rounded border border-gray-800 hover:border-purple-500 transition-all text-left group">
                                  <link.icon className={`${link.color} mb-2 group-hover:scale-110 transition-transform`} />
                                  <h3 className="font-bold text-gray-200">{link.title}</h3>
                                  <p className="text-xs text-gray-500 mt-1">{link.desc}</p>
                              </button>
                          ))}
                          {filteredLinks.length === 0 && (
                              <div className="col-span-3 text-center text-gray-600 py-10">No hidden services found.</div>
                          )}
                      </div>
                  </div>
              );
          case 'http://hiddenwiki.onion':
              return (
                  <div className="flex-1 bg-white text-black p-8 overflow-y-auto font-serif">
                      <h1 className="text-3xl font-bold border-b border-black pb-2 mb-4">The Hidden Wiki</h1>
                      <div className="bg-yellow-100 border border-yellow-300 p-4 mb-6 text-sm">
                          <span className="font-bold">WARNING:</span> Many links on this page are scams or law enforcement honeypots. Browse at your own risk.
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                          <div>
                              <h2 className="font-bold text-xl mb-2 bg-black text-white px-1">Financial Services</h2>
                              <ul className="list-disc pl-5 space-y-1 text-blue-800 underline text-sm cursor-pointer">
                                  <li onClick={() => navigate('http://market.onion')}>CcPal - CC Dumps & CVV</li>
                                  <li>EasyCoin - Bitcoin Mixer</li>
                                  <li>PayPal Accounts (Hacked)</li>
                              </ul>
                          </div>
                          <div>
                              <h2 className="font-bold text-xl mb-2 bg-black text-white px-1">Commercial Services</h2>
                              <ul className="list-disc pl-5 space-y-1 text-blue-800 underline text-sm cursor-pointer">
                                  <li>Rent-A-Hacker</li>
                                  <li>Fake ID Generator</li>
                                  <li>Apple Store (Stolen Goods)</li>
                              </ul>
                          </div>
                      </div>
                  </div>
              );
          case 'http://market.onion':
              return (
                  <div className="flex-1 bg-[#0f0f0f] text-green-500 font-mono p-4 overflow-y-auto">
                      <div className="border-b border-green-700 pb-4 mb-4 flex justify-between items-end">
                          <h1 className="text-2xl font-bold">ZeroDay Bazaar</h1>
                          <span className="text-xs bg-green-900/20 p-1">BTC: $64,231.50</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                          {[
                              { name: "Windows 11 Remote Code Exec", price: "2.5 BTC", vendor: "RussianBear" },
                              { name: "Facebook User Database (500M)", price: "0.8 BTC", vendor: "DataBroker" },
                              { name: "Corporate VPN Access (Fortune 500)", price: "5.0 BTC", vendor: "AccessKing" },
                              { name: "Verified Twitter/X Accounts", price: "0.1 BTC", vendor: "SocialEng" }
                          ].map((item, i) => (
                              <div key={i} className="border border-green-800 p-4 flex justify-between items-center hover:bg-green-900/10">
                                  <div>
                                      <h3 className="font-bold text-lg">{item.name}</h3>
                                      <p className="text-xs text-green-700">Vendor: {item.vendor} | Trust: 98%</p>
                                  </div>
                                  <button className="bg-green-700 text-black px-4 py-2 font-bold hover:bg-green-600">BUY {item.price}</button>
                              </div>
                          ))}
                      </div>
                  </div>
              );
           case 'http://forum.onion':
              return (
                  <div className="flex-1 bg-slate-900 text-slate-300 p-4 font-sans">
                      <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
                          <Shield size={32} className="text-red-500" />
                          <h1 className="text-2xl font-bold text-white">BlackHat Talk</h1>
                      </div>
                      <div className="space-y-4">
                          {[
                              { title: "How to bypass new WAF rules?", author: "script_kiddie", replies: 12 },
                              { title: "Looking for reliable bulletproof hosting", author: "hostmaster", replies: 45 },
                              { title: "[TUTORIAL] SQL Injection in 2024", author: "sql_ninja", replies: 128 },
                              { title: "Is NSA monitoring this node?", author: "paranoid_android", replies: 9001 }
                          ].map((thread, i) => (
                              <div key={i} className="bg-slate-800 p-3 rounded border border-slate-700 hover:border-slate-500 cursor-pointer">
                                  <h3 className="text-blue-400 font-bold">{thread.title}</h3>
                                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                                      <span>Posted by {thread.author}</span>
                                      <span>{thread.replies} replies</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          default:
              return (
                  <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] text-center p-8">
                      <AlertTriangle size={48} className="text-red-500 mb-4" />
                      <h2 className="text-xl font-bold text-red-400 mb-2">Connection Refused</h2>
                      <p className="text-gray-500 text-sm">The hidden service at {url} could not be reached.</p>
                      <p className="text-gray-600 text-xs mt-4">Onion routing error 0xF3: Node unresponsive.</p>
                      <button onClick={() => navigate('flux://home')} className="mt-8 px-6 py-2 bg-purple-900/30 text-purple-400 border border-purple-800 rounded hover:bg-purple-900/50">
                          Return Home
                      </button>
                  </div>
              );
      }
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] overflow-hidden">
      {/* Browser Toolbar */}
      <div className="h-10 bg-[#2a2a2a] flex items-center px-2 gap-2 border-b border-black shadow-md shrink-0">
        <div className="flex items-center gap-1">
            <button onClick={handleBack} className="p-1.5 text-gray-400 hover:bg-white/10 rounded-full hover:text-white disabled:opacity-30"><ArrowLeft size={14} /></button>
            <button className="p-1.5 text-gray-400 hover:bg-white/10 rounded-full hover:text-white disabled:opacity-30"><ArrowRight size={14} /></button>
            <button onClick={() => navigate(url)} className="p-1.5 text-gray-400 hover:bg-white/10 rounded-full hover:text-white"><RefreshCw size={14} /></button>
        </div>
        
        <div className="flex-1 bg-[#1a1a1a] rounded-md flex items-center px-2 py-1 border border-[#3a3a3a] focus-within:border-purple-500 transition-colors">
            <Lock size={12} className="text-green-500 mr-2" />
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="w-full bg-transparent text-xs text-gray-300 focus:outline-none font-mono"
            />
        </div>

        <button className="p-1.5 bg-purple-900/20 rounded border border-purple-500/30 text-purple-400 hover:bg-purple-900/40 hover:text-purple-300 transition-all" title="New Identity">
            <Shield size={14} />
        </button>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};