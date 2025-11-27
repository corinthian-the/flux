import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, Search, Navigation, Radio, Server, Shield, Wifi } from 'lucide-react';

interface Hop {
    id: number;
    ip: string;
    location: string;
    latency: number;
    status: 'success' | 'timeout' | 'pending';
    asn?: string;
    isp?: string;
    coordinates?: { x: number, y: number }; // Percentage 0-100
}

export const IpTracer: React.FC = () => {
  const [targetIp, setTargetIp] = useState('');
  const [tracing, setTracing] = useState(false);
  const [hops, setHops] = useState<Hop[]>([]);
  const [traceComplete, setTraceComplete] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  const startTrace = () => {
    if (!targetIp) return;
    setTracing(true);
    setTraceComplete(false);
    setHops([]);

    const locations = [
        { loc: "Local Gateway", isp: "LAN", asn: "-", x: 20, y: 70 },
        { loc: "New York, USA", isp: "Verizon Fios", asn: "AS701", x: 28, y: 45 },
        { loc: "London, UK", isp: "British Telecom", asn: "AS2856", x: 48, y: 35 },
        { loc: "Frankfurt, DE", isp: "DE-CIX Exchange", asn: "AS6695", x: 52, y: 38 },
        { loc: "Moscow, RU", isp: "Rostelecom", asn: "AS12389", x: 60, y: 30 },
        { loc: "Unknown (Proxy)", isp: "Hidden", asn: "AS????", x: 65, y: 40 }
    ];
    
    let step = 0;
    const maxHops = locations.length;

    const interval = setInterval(() => {
        if (step >= maxHops) {
            clearInterval(interval);
            setTracing(false);
            setTraceComplete(true);
            return;
        }

        const isSuccess = Math.random() > 0.1;
        const currentLoc = locations[step];
        
        const newHop: Hop = {
            id: step + 1,
            ip: step === 0 ? "192.168.1.1" : `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
            location: isSuccess ? currentLoc.loc : "*",
            latency: Math.floor(Math.random() * 50) + (step * 30),
            status: isSuccess ? 'success' : 'timeout',
            asn: isSuccess ? currentLoc.asn : '*',
            isp: isSuccess ? currentLoc.isp : '*',
            coordinates: isSuccess ? { x: currentLoc.x, y: currentLoc.y } : undefined
        };

        setHops(prev => [...prev, newHop]);
        step++;
    }, 1200);
  };

  useEffect(() => {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [hops]);

  return (
    <div className="h-full flex flex-col bg-[#080808] text-green-500 font-mono p-4 select-none overflow-hidden">
       {/* Header */}
       <div className="flex items-center justify-between mb-4 border-b border-green-900 pb-2 bg-green-900/10 p-2 rounded-t">
            <div className="flex items-center gap-2">
                <Globe size={18} className={`text-green-400 ${tracing ? 'animate-spin-slow' : ''}`} />
                <div>
                    <h1 className="font-bold tracking-wider text-sm text-green-300">GEO_TRACE_PRO</h1>
                    <p className="text-[10px] text-green-700">Global IP Geolocation & Route Analysis</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded ${tracing ? 'bg-green-500 text-black animate-pulse' : 'bg-green-900/30 text-green-700'}`}>
                    {tracing ? 'SATELLITE_UPLINK_ACTIVE' : 'READY'}
                </span>
            </div>
       </div>

       {/* Control Bar */}
       <div className="flex gap-2 mb-4">
           <div className="relative flex-1 group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Search size={14} className="text-green-700 group-focus-within:text-green-500" />
               </div>
               <input 
                 type="text" 
                 value={targetIp}
                 onChange={e => setTargetIp(e.target.value)}
                 placeholder="Enter Target IPv4 / Hostname..."
                 className="block w-full pl-10 bg-black border border-green-800 py-2 text-sm focus:outline-none focus:border-green-500 font-mono text-green-100 placeholder-green-900/50 transition-colors"
                 onKeyDown={(e) => e.key === 'Enter' && startTrace()}
               />
           </div>
           <button 
             onClick={startTrace}
             disabled={tracing || !targetIp}
             className="px-6 bg-green-900/20 border border-green-700 hover:bg-green-600 hover:text-black hover:border-green-500 transition-all font-bold text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
           >
               <Navigation size={14} /> <span className="tracking-widest">TRACE</span>
           </button>
       </div>

       {/* Main Visualization Grid */}
       <div className="flex-1 flex gap-4 min-h-0">
           
           {/* Left: Map / Radar View */}
           <div className="w-1/3 flex flex-col gap-4">
               {/* World Map Simulation */}
               <div className="flex-1 bg-black border border-green-900/50 relative overflow-hidden group">
                   {/* Grid Background */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.2)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
                   
                   {/* Radar Sweep */}
                   {tracing && (
                       <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,197,94,0.1)_60deg,rgba(34,197,94,0.4)_360deg)] animate-[spin_2s_linear_infinite] rounded-full opacity-30 scale-150"></div>
                   )}
                   
                   {/* Vector Path Lines */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                       <defs>
                           <filter id="glow">
                               <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                               <feMerge>
                                   <feMergeNode in="coloredBlur"/>
                                   <feMergeNode in="SourceGraphic"/>
                               </feMerge>
                           </filter>
                       </defs>
                       <path 
                           d={hops.filter(h => h.coordinates).map((h, i, arr) => {
                               if (i === 0) return `M ${h.coordinates!.x}% ${h.coordinates!.y}%`;
                               return `L ${h.coordinates!.x}% ${h.coordinates!.y}%`;
                           }).join(" ")}
                           fill="none" 
                           stroke="#22c55e" 
                           strokeWidth="2"
                           strokeDasharray="5,5"
                           className="opacity-50"
                           filter="url(#glow)"
                       />
                   </svg>

                   {/* Center Crosshair */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 z-0">
                       <div className="w-full h-px bg-green-900"></div>
                       <div className="h-full w-px bg-green-900 absolute"></div>
                   </div>

                   {/* Trace Nodes */}
                   {hops.map((hop, i) => (
                       hop.status === 'success' && hop.coordinates && (
                           <div 
                                key={i} 
                                className="absolute w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-ping-slow z-10" 
                                style={{
                                   left: `${hop.coordinates.x}%`,
                                   top: `${hop.coordinates.y}%`
                                }}
                           >
                               <div className="absolute -top-4 left-4 whitespace-nowrap text-[9px] bg-black/80 px-1 border border-green-900 text-green-300">
                                   {hop.location.split(',')[0]}
                               </div>
                           </div>
                       )
                   ))}

                   <div className="absolute top-2 left-2 text-[10px] text-green-600 bg-black/80 px-1 border border-green-900">
                       LAT: 40.7128 N<br/>LON: 74.0060 W
                   </div>
               </div>

               {/* Stats Panel */}
               <div className="h-32 bg-[#0a0a0a] border border-green-900/50 p-2 text-xs font-mono space-y-1">
                   <div className="text-green-700 font-bold uppercase mb-1 flex items-center gap-2">
                       <Radio size={12} /> Signal Telemetry
                   </div>
                   <div className="flex justify-between">
                       <span className="text-gray-500">Packets Sent:</span>
                       <span className="text-green-400">{hops.length * 3}</span>
                   </div>
                   <div className="flex justify-between">
                       <span className="text-gray-500">Loss Rate:</span>
                       <span className="text-green-400">{hops.filter(h => h.status === 'timeout').length > 0 ? '14%' : '0%'}</span>
                   </div>
                   <div className="flex justify-between">
                       <span className="text-gray-500">Avg Latency:</span>
                       <span className="text-green-400">{hops.length > 0 ? Math.round(hops.reduce((a,b) => a + b.latency, 0) / hops.length) : 0}ms</span>
                   </div>
                   <div className="mt-2 pt-2 border-t border-green-900/30 text-[10px] text-green-800 text-center">
                       {tracing ? 'TRIANGULATING SIGNAL...' : (traceComplete ? 'TARGET LOCKED' : 'STANDBY')}
                   </div>
               </div>
           </div>

           {/* Right: Hop List */}
           <div className="flex-1 bg-black border border-green-900/30 flex flex-col min-w-0">
               <div className="grid grid-cols-12 text-[10px] text-green-700 font-bold uppercase p-2 border-b border-green-900/30 bg-green-900/10">
                   <div className="col-span-1">#</div>
                   <div className="col-span-3">IP Address</div>
                   <div className="col-span-2">ASN / ISP</div>
                   <div className="col-span-4">Location</div>
                   <div className="col-span-2 text-right">Time</div>
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                   {hops.map((hop) => (
                       <div key={hop.id} className="grid grid-cols-12 text-xs items-center p-2 hover:bg-green-900/10 border border-transparent hover:border-green-900/30 transition-colors group">
                           <div className="col-span-1 text-green-600 font-bold opacity-50 group-hover:opacity-100">{hop.id}</div>
                           <div className="col-span-3 flex items-center gap-2">
                               <Server size={10} className="text-green-800" />
                               <span className={hop.status === 'timeout' ? 'text-red-500' : 'text-gray-300'}>
                                   {hop.status === 'timeout' ? '* * *' : hop.ip}
                               </span>
                           </div>
                           <div className="col-span-2 text-[10px] text-green-600 truncate">
                               {hop.asn}
                           </div>
                           <div className="col-span-4 flex items-center gap-1 text-gray-400 truncate">
                               {hop.status === 'success' && <MapPin size={10} className="text-green-700" />}
                               <span className={hop.status === 'timeout' ? 'text-red-900' : ''}>
                                   {hop.status === 'timeout' ? 'Request Timed Out' : hop.location}
                               </span>
                           </div>
                           <div className="col-span-2 text-right font-mono text-green-400">
                               {hop.status === 'success' ? `${hop.latency}ms` : ''}
                           </div>
                       </div>
                   ))}
                   
                   {tracing && (
                       <div className="p-2 flex items-center gap-2 text-xs text-green-800 animate-pulse">
                           <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                           Probing next hop...
                       </div>
                   )}
                   <div ref={listEndRef} />
               </div>

               {/* Footer Status */}
               <div className="h-6 bg-[#0a0a0a] border-t border-green-900/30 flex items-center px-2 justify-between text-[10px] text-green-700">
                    <div className="flex items-center gap-2">
                        <Shield size={10} />
                        <span>Protocol: ICMP/UDP</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wifi size={10} />
                        <span>Max Hops: 30</span>
                    </div>
               </div>
           </div>
       </div>
    </div>
  );
};