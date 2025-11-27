import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Trash2, Filter, ChevronRight, ChevronDown, Search, ArrowDown, Skull } from 'lucide-react';

interface ProtocolDetail {
  label: string;
  value?: string;
  children?: ProtocolDetail[];
}

interface Packet {
  id: number;
  no: number;
  time: number;
  source: string;
  dest: string;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'DNS' | 'TLSv1.2' | 'ARP';
  length: number;
  info: string;
  hex: string; // Raw hex string
  ascii: string; // Decoded ascii for the dump
  details: ProtocolDetail[]; // Tree structure for analysis
  colorClass: string; // Wireshark color coding
}

export const PacketSniffer: React.FC = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isSniffing, setIsSniffing] = useState(true);
  const [isSpoofing, setIsSpoofing] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [filterText, setFilterText] = useState('');
  const [packetCount, setPacketCount] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Generate realistic packet data
  useEffect(() => {
    let interval: any;
    if (isSniffing) {
      interval = setInterval(() => {
        
        const timestamp = Date.now() / 1000;
        let currentSeq = packetCount;

        // Simulation Generators
        const generatePacket = (seq: number): Packet => {
          const rand = Math.random();
          
          // 1. DNS Query/Response Flow
          if (rand < 0.25) { // Increased DNS frequency slightly
            const isQuery = Math.random() > 0.5;
            
            // If spoofing is active, bias towards google.com for demonstration
            const domainPool = ['google.com', 'flux-os.net', 'dark-web.onion', 'api.server.io'];
            const domain = (isSpoofing && isQuery && Math.random() > 0.4) ? 'google.com' : domainPool[Math.floor(Math.random() * 4)];
            
            const id = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
            
            return {
              id: Date.now() + Math.random(),
              no: seq,
              time: timestamp,
              source: isQuery ? '192.168.1.105' : '8.8.8.8',
              dest: isQuery ? '8.8.8.8' : '192.168.1.105',
              protocol: 'DNS',
              length: isQuery ? 74 : 90,
              info: isQuery ? `Standard query 0x${id} A ${domain}` : `Standard query response 0x${id} A ${domain} A 142.250.190.46`,
              hex: `0000   00 0e 3b 4a 22 11 08 00 27 c3 89 12 08 00 45 00\n0010   00 3c 1a 2b 00 00 40 11 3c 22 c0 a8 01 69 08 08\n0020   08 08 e3 12 00 35 00 28 4a 11 ${id} 01 00 00 01 00\n0030   00 00 00 00 00 03 77 77 77 06 67 6f 6f 67 6c 65\n0040   03 63 6f 6d 00 00 01 00 01`,
              ascii: `..;J"...'.....E..<.+..@.<".......5.(J................www.google.com.....`,
              colorClass: 'text-blue-300',
              details: [
                { label: 'Frame 1: 74 bytes on wire (592 bits), 74 bytes captured (592 bits)' },
                { label: 'Ethernet II, Src: 08:00:27:c3:89:12, Dst: 00:0e:3b:4a:22:11' },
                { label: 'Internet Protocol Version 4, Src: 192.168.1.105, Dst: 8.8.8.8' },
                { label: 'User Datagram Protocol, Src Port: 58130, Dst Port: 53' },
                { label: 'Domain Name System (query)', children: [
                    { label: `Transaction ID: 0x${id}` },
                    { label: 'Flags: 0x0100 Standard query' },
                    { label: `Queries`, children: [{ label: `${domain}: type A, class IN` }] }
                ]}
              ]
            };
          }

          // 2. HTTP GET/POST
          if (rand < 0.5) {
            const method = Math.random() > 0.7 ? 'POST' : 'GET';
            const path = ['/login', '/api/v1/user', '/index.html', '/payload.exe'][Math.floor(Math.random() * 4)];
            return {
              id: Date.now() + Math.random(),
              no: seq,
              time: timestamp,
              source: '192.168.1.105',
              dest: '104.21.55.2',
              protocol: 'HTTP',
              length: Math.floor(Math.random() * 400) + 200,
              info: `${method} ${path} HTTP/1.1`,
              hex: `0000   00 0e 3b 4a 22 11 08 00 27 c3 89 12 08 00 45 00\n0010   02 14 1a 2c 40 00 40 06 3c 1e c0 a8 01 69 68 15\n0020   37 02 c6 84 00 50 38 af 22 11 00 00 00 00 80 18\n0030   fa f0 3c 22 00 00 01 01 08 0a 04 89 12 34 00 00\n0040   00 00 47 45 54 20 2f 20 48 54 54 50 2f 31 2e 31`,
              ascii: `..;J"...'.....E....,@.@.<....ih.7....P8.".......<"..........4.....${method} ${path} HTTP/1.1`,
              colorClass: 'text-green-300',
              details: [
                { label: `Frame ${seq}: ${Math.floor(Math.random() * 400) + 200} bytes on wire` },
                { label: 'Ethernet II, Src: 08:00:27:c3:89:12, Dst: 00:0e:3b:4a:22:11' },
                { label: 'Internet Protocol Version 4, Src: 192.168.1.105, Dst: 104.21.55.2' },
                { label: 'Transmission Control Protocol, Src Port: 50820, Dst Port: 80' },
                { label: 'Hypertext Transfer Protocol', children: [
                    { label: `${method} ${path} HTTP/1.1\\r\\n` },
                    { label: 'Host: target-server.net\\r\\n' },
                    { label: 'User-Agent: Mozilla/5.0 (X11; Linux x86_64)\\r\\n' },
                    { label: '\\r\\n' }
                ]}
              ]
            };
          }

          // 3. TCP Handshake / Ack
          if (rand < 0.8) {
            const flags = ['SYN', 'SYN, ACK', 'ACK', 'FIN, ACK'][Math.floor(Math.random() * 4)];
            return {
              id: Date.now() + Math.random(),
              no: seq,
              time: timestamp,
              source: flags === 'SYN, ACK' ? '104.21.55.2' : '192.168.1.105',
              dest: flags === 'SYN, ACK' ? '192.168.1.105' : '104.21.55.2',
              protocol: 'TCP',
              length: 66,
              info: `50820 → 443 [${flags}] Seq=${Math.floor(Math.random() * 1000)} Win=64240 Len=0`,
              hex: `0000   00 0e 3b 4a 22 11 08 00 27 c3 89 12 08 00 45 00\n0010   00 34 1a 2d 40 00 40 06 3c 0a c0 a8 01 69 68 15\n0020   37 02 c6 84 01 bb 38 af 22 12 00 00 00 00 a0 02\n0030   fa f0 3c 1e 00 00 02 04 05 b4 04 02 08 0a 04 89`,
              ascii: `..;J"...'.....E..4.-@.@.<....ih.7.....8.".........<.............`,
              colorClass: 'text-purple-300',
              details: [
                { label: `Frame ${seq}: 66 bytes on wire` },
                { label: 'Ethernet II, Src: 08:00:27:c3:89:12, Dst: 00:0e:3b:4a:22:11' },
                { label: 'Internet Protocol Version 4, Src: 192.168.1.105, Dst: 104.21.55.2' },
                { label: 'Transmission Control Protocol, Src Port: 50820, Dst Port: 443', children: [
                    { label: `Flags: 0x002 (${flags})` },
                    { label: 'Window: 64240' },
                    { label: 'Checksum: 0x3c1e' }
                ]}
              ]
            };
          }

          // 4. TLSv1.2
          return {
            id: Date.now() + Math.random(),
            no: seq,
            time: timestamp,
            source: '192.168.1.105',
            dest: '142.250.180.14',
            protocol: 'TLSv1.2',
            length: 140,
            info: 'Client Hello',
            hex: `0000   00 0e 3b 4a 22 11 08 00 27 c3 89 12 08 00 45 00\n0010   00 94 1a 2e 40 00 40 06 3c 9f c0 a8 01 69 8e fa\n0020   b4 0e c6 86 01 bb 38 af 22 13 38 af 22 14 80 18\n0030   00 fd 8b 33 00 00 01 01 08 0a 04 89 12 36 04 89\n0040   12 2c 16 03 01 00 81 01 00 00 7d 03 03 62 65 62`,
            ascii: `..;J"...'.....E.....@.@.<....i........8.".8.".....3.........6...,.......}...beb`,
            colorClass: 'text-pink-300',
            details: [
                { label: `Frame ${seq}: 140 bytes on wire` },
                { label: 'Ethernet II, Src: 08:00:27:c3:89:12, Dst: 00:0e:3b:4a:22:11' },
                { label: 'Internet Protocol Version 4, Src: 192.168.1.105, Dst: 142.250.180.14' },
                { label: 'Transmission Control Protocol, Src Port: 50822, Dst Port: 443' },
                { label: 'Transport Layer Security', children: [
                    { label: 'TLSv1.2 Record Layer: Handshake Protocol: Client Hello', children: [
                        { label: 'Content Type: Handshake (22)' },
                        { label: 'Version: TLS 1.0 (0x0301)' },
                        { label: 'Handshake Protocol: Client Hello' }
                    ]}
                ]}
              ]
          };
        };

        const newPackets: Packet[] = [];
        const mainPacket = generatePacket(currentSeq);
        newPackets.push(mainPacket);
        let nextSeq = currentSeq + 1;

        // --- DNS SPOOFING INJECTION ---
        if (isSpoofing && mainPacket.protocol === 'DNS' && mainPacket.info.includes('Standard query 0x') && mainPacket.info.includes('google.com')) {
            const idMatch = mainPacket.info.match(/0x([0-9a-f]+)/);
            const id = idMatch ? idMatch[1] : '0000';
            
            const spoofPacket: Packet = {
               id: Date.now() + Math.random(),
               no: nextSeq,
               time: timestamp + 0.002,
               source: '192.168.1.105',
               dest: mainPacket.source,
               protocol: 'DNS',
               length: 96,
               info: `Standard query response 0x${id} A google.com A 192.168.1.666 (SPOOFED)`,
               hex: `0000   00 0e 3b 4a 22 11 08 00 27 c3 89 12 08 00 45 00\n0010   00 3c 1a 2b 00 00 40 11 3c 22 c0 a8 01 69 08 08\n0020   ff ff ff ff ff ff 53 50 4f 4f 46 45 44 20 44 4e`,
               ascii: `..............SPOOFED DN..`,
               colorClass: 'text-red-500 font-bold bg-red-900/10',
               details: [
                   { label: `Frame ${nextSeq}: 96 bytes on wire` },
                   { label: 'Ethernet II, Src: 08:00:27:c3:89:12, Dst: 00:0e:3b:4a:22:11' },
                   { label: 'Internet Protocol Version 4, Src: 192.168.1.105, Dst: 192.168.1.105' },
                   { label: 'User Datagram Protocol, Src Port: 53, Dst Port: 58130' },
                   { label: 'Domain Name System (response)', children: [
                       { label: `Transaction ID: 0x${id}` },
                       { label: 'Flags: 0x8180 Standard query response, No error' },
                       { label: `Answers`, children: [
                           { label: `google.com: type A, class IN, addr 192.168.1.666` },
                           { label: `[ALERT] DNS Poisoning Detected` }
                       ]}
                   ]}
               ]
            };
            newPackets.push(spoofPacket);
            nextSeq++;
        }

        setPacketCount(nextSeq);
        setPackets(prev => {
          const next = [...prev, ...newPackets];
          if (next.length > 500) return next.slice(next.length - 500);
          return next;
        });
        
        // Auto-scroll if at bottom and not paused
        if (listRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;
            if (scrollHeight - scrollTop === clientHeight) {
                bottomRef.current?.scrollIntoView({behavior: 'auto'});
            }
        }
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isSniffing, packetCount, isSpoofing]);

  // Filter Logic
  const filteredPackets = packets.filter(p => {
      if (!filterText) return true;
      const term = filterText.toLowerCase();
      return (
          p.protocol.toLowerCase().includes(term) ||
          p.source.includes(term) ||
          p.dest.includes(term) ||
          p.info.toLowerCase().includes(term)
      );
  });

  // Tree Node Component for Details View
  const DetailNode: React.FC<{ detail: ProtocolDetail, depth?: number }> = ({ detail, depth = 0 }) => {
      const [expanded, setExpanded] = useState(true);
      return (
          <div className="font-mono text-[11px] select-text">
              <div 
                className="flex items-center hover:bg-blue-900/20 cursor-pointer select-none"
                style={{ paddingLeft: `${depth * 12}px` }}
                onClick={() => setExpanded(!expanded)}
              >
                  {detail.children ? (
                      expanded ? <ChevronDown size={10} className="mr-1 text-gray-500" /> : <ChevronRight size={10} className="mr-1 text-gray-500" />
                  ) : <div className="w-3.5" />}
                  <span className="text-green-400">{detail.label}</span>
              </div>
              {expanded && detail.children && (
                  <div>
                      {detail.children.map((child, i) => (
                          <DetailNode key={i} detail={child} depth={depth + 1} />
                      ))}
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] font-sans text-xs select-none text-gray-300">
      {/* Toolbar */}
      <div className="h-9 bg-[#2d2d2d] border-b border-gray-700 flex items-center px-2 gap-2 shadow-sm shrink-0">
          <div className="flex gap-0.5 border-r border-gray-600 pr-2">
              <button 
                onClick={() => setIsSniffing(!isSniffing)}
                className={`p-1 rounded-sm ${isSniffing ? 'bg-gray-600 text-white' : 'hover:bg-gray-600 text-blue-400'}`}
                title={isSniffing ? "Stop Capture" : "Start Capture"}
              >
                  {isSniffing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              </button>
              <button 
                onClick={() => { setPackets([]); setPacketCount(1); setSelectedPacket(null); }}
                className="p-1 text-gray-400 hover:bg-gray-600 hover:text-red-400 rounded-sm"
                title="Restart Capture"
              >
                  <Trash2 size={14} />
              </button>
          </div>

          <button 
            onClick={() => setIsSpoofing(!isSpoofing)}
            className={`p-1 rounded-sm flex items-center gap-1 px-2 transition-all ${isSpoofing ? 'bg-red-900/50 text-red-400 border border-red-500 animate-pulse' : 'hover:bg-gray-600 text-gray-400 border border-transparent'}`}
            title="Toggle DNS Spoofing Attack"
          >
            <Skull size={14} />
            <span className="text-[10px] font-bold uppercase hidden sm:inline">DNS Spoof</span>
          </button>
          
          <div className="flex-1 flex items-center gap-2">
              <span className="text-gray-400 font-bold text-[10px] uppercase ml-2">Display Filter:</span>
              <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className={`w-full bg-[#f0f0f0] border border-gray-400 rounded-sm px-2 py-0.5 text-black focus:outline-none focus:border-blue-500 font-mono ${filterText && filteredPackets.length === 0 ? 'bg-red-200' : 'bg-green-100'}`}
                    placeholder="e.g. ip.addr == 192.168.1.105"
                  />
                  {filterText && <button onClick={() => setFilterText('')} className="absolute right-1 top-0.5 text-gray-500 hover:text-black"><ArrowDown size={12} /></button>}
              </div>
          </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex flex-col min-h-0">
          
          {/* Top Pane: Packet List */}
          <div className="flex-1 bg-white overflow-y-auto min-h-[150px] border-b border-gray-400 relative flex flex-col" ref={listRef}>
              <div className="grid grid-cols-[50px_80px_120px_120px_60px_60px_1fr] gap-px bg-gray-200 border-b border-gray-300 text-gray-700 font-medium text-[11px] sticky top-0 z-10 shadow-sm">
                  <div className="px-2 border-r border-white/50">No.</div>
                  <div className="px-2 border-r border-white/50">Time</div>
                  <div className="px-2 border-r border-white/50">Source</div>
                  <div className="px-2 border-r border-white/50">Destination</div>
                  <div className="px-2 border-r border-white/50">Protocol</div>
                  <div className="px-2 border-r border-white/50">Length</div>
                  <div className="px-2">Info</div>
              </div>
              <div className="font-mono text-[11px] leading-tight">
                {filteredPackets.map((p) => (
                    <div 
                        key={p.id} 
                        onClick={() => setSelectedPacket(p)}
                        className={`grid grid-cols-[50px_80px_120px_120px_60px_60px_1fr] cursor-pointer border-b border-gray-100 hover:bg-blue-100 ${selectedPacket?.id === p.id ? 'bg-blue-600 text-white !important' : ''} ${p.colorClass.includes('text-red-500') ? 'bg-red-50 text-red-900' : 
                            p.protocol === 'TCP' ? 'bg-[#e7e6ff] text-black' :
                            p.protocol === 'UDP' ? 'bg-[#daeeff] text-black' :
                            p.protocol === 'HTTP' ? 'bg-[#e4ffc7] text-black' :
                            p.protocol === 'DNS' ? 'bg-[#daeeff] text-black' :
                            p.protocol === 'TLSv1.2' ? 'bg-[#e7e6ff] text-black' : 
                            'bg-white text-black'
                        }`}
                    >
                        <div className="px-2 py-0.5 border-r border-transparent truncate">{p.no}</div>
                        <div className="px-2 py-0.5 border-r border-transparent truncate">{p.time.toFixed(6)}</div>
                        <div className="px-2 py-0.5 border-r border-transparent truncate">{p.source}</div>
                        <div className="px-2 py-0.5 border-r border-transparent truncate">{p.dest}</div>
                        <div className="px-2 py-0.5 border-r border-transparent truncate">{p.protocol}</div>
                        <div className="px-2 py-0.5 border-r border-transparent truncate">{p.length}</div>
                        <div className="px-2 py-0.5 truncate">{p.info}</div>
                    </div>
                ))}
                <div ref={bottomRef} />
              </div>
          </div>

          {/* Middle Pane: Packet Details */}
          <div className="h-1/3 min-h-[150px] bg-white border-b border-gray-400 overflow-y-auto p-1">
              {selectedPacket ? (
                  <div className="space-y-0">
                      {selectedPacket.details.map((detail, i) => (
                          <DetailNode key={i} detail={detail} />
                      ))}
                  </div>
              ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 italic">
                      No packet selected
                  </div>
              )}
          </div>

          {/* Bottom Pane: Hex Dump */}
          <div className="h-1/3 min-h-[150px] bg-white overflow-y-auto p-1 font-mono text-[11px] text-gray-800 selection:bg-blue-200">
             {selectedPacket ? (
                 <div className="grid grid-cols-[50px_1fr_200px] gap-4">
                     <div className="text-blue-800 text-right select-none border-r border-gray-300 pr-2">
                         0000<br/>0010<br/>0020<br/>0030<br/>0040<br/>0050
                     </div>
                     <div className="whitespace-pre-wrap">
                         {selectedPacket.hex}
                     </div>
                     <div className="text-gray-500 border-l border-gray-300 pl-2 whitespace-pre-wrap break-all">
                         {selectedPacket.ascii}
                     </div>
                 </div>
             ) : (
                 <div className="h-full flex items-center justify-center text-gray-400 italic">
                     Bytes
                 </div>
             )}
          </div>

      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-[#f0f0f0] border-t border-gray-400 flex items-center px-2 gap-4 text-[10px] text-gray-600 shrink-0">
          <div className="flex items-center gap-1 border-r border-gray-400 pr-4">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span>Capturing from eth0</span>
          </div>
          <span>Packets: {packetCount}</span>
          <span>Displayed: {filteredPackets.length} ({(filteredPackets.length / packetCount * 100).toFixed(1)}%)</span>
          <span>Profile: Default</span>
          {isSpoofing && <span className="text-red-500 font-bold animate-pulse ml-auto">MITM ACTIVE: DNS SPOOFING</span>}
      </div>
    </div>
  );
};