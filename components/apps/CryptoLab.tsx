import React, { useState } from 'react';
import { Binary, RefreshCw, Lock } from 'lucide-react';

export const CryptoLab: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'BASE64' | 'BASE32' | 'HEX' | 'ROT13' | 'URL' | 'BINARY'>('BASE64');

  const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const base32Encode = (s: string) => {
    let bits = '';
    for (let i = 0; i < s.length; i++) {
        let val = s.charCodeAt(i);
        bits += val.toString(2).padStart(8, '0');
    }
    let res = '';
    for (let i = 0; i < bits.length; i += 5) {
        let chunk = bits.substring(i, i + 5);
        if (chunk.length < 5) chunk = chunk.padEnd(5, '0');
        res += base32Alphabet[parseInt(chunk, 2)];
    }
    while (res.length % 8 !== 0) res += '=';
    return res;
  };

  const base32Decode = (s: string) => {
    s = s.replace(/=/g, '').toUpperCase();
    let bits = '';
    for (let i = 0; i < s.length; i++) {
        let val = base32Alphabet.indexOf(s[i]);
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }
    let res = '';
    for (let i = 0; i < bits.length; i += 8) {
        let chunk = bits.substring(i, i + 8);
        if (chunk.length === 8) res += String.fromCharCode(parseInt(chunk, 2));
    }
    return res;
  };

  const process = (action: 'ENCODE' | 'DECODE') => {
      try {
          let res = '';
          if (mode === 'BASE64') {
              res = action === 'ENCODE' ? btoa(input) : atob(input);
          } else if (mode === 'BASE32') {
              res = action === 'ENCODE' ? base32Encode(input) : base32Decode(input);
          } else if (mode === 'URL') {
              res = action === 'ENCODE' ? encodeURIComponent(input) : decodeURIComponent(input);
          } else if (mode === 'HEX') {
              if (action === 'ENCODE') {
                  res = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
              } else {
                  res = input.replace(/\s/g, '').match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
              }
          } else if (mode === 'ROT13') {
              res = input.replace(/[a-zA-Z]/g, (char) => {
                  const limit = char <= 'Z' ? 90 : 122;
                  let code = char.charCodeAt(0) + 13;
                  if (code > limit) code -= 26;
                  return String.fromCharCode(code);
              });
          } else if (mode === 'BINARY') {
               if (action === 'ENCODE') {
                   res = input.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
               } else {
                   res = input.replace(/\s/g, '').match(/.{1,8}/g)?.map(byte => String.fromCharCode(parseInt(byte, 2))).join('') || '';
               }
          }
          setOutput(res);
      } catch (e) {
          setOutput("Error: Invalid input for selected operation.");
      }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f0f0f] font-mono text-green-500 p-4 select-none">
       <div className="flex items-center gap-2 mb-4 pb-2 border-b border-green-900">
           <Binary size={24} />
           <div>
               <h1 className="font-bold text-white tracking-widest">CRYPTO_LAB</h1>
               <p className="text-[10px] text-green-700">Encoding & Decoding Suite</p>
           </div>
       </div>

       <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black">
           {['BASE64', 'BASE32', 'HEX', 'ROT13', 'URL', 'BINARY'].map(m => (
               <button 
                key={m}
                onClick={() => setMode(m as any)}
                className={`px-3 py-1 text-xs font-bold border transition-colors shrink-0 ${mode === m ? 'bg-green-600 text-black border-green-500' : 'bg-transparent text-green-600 border-green-900 hover:border-green-600'}`}
               >
                   {m}
               </button>
           ))}
       </div>

       <div className="flex-1 flex flex-col gap-4">
           <div className="flex-1 flex flex-col">
               <label className="text-xs font-bold text-gray-500 mb-1 flex justify-between">
                   <span>INPUT ({mode})</span>
                   <button onClick={() => setInput('')} className="hover:text-white">CLEAR</button>
               </label>
               <textarea 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 className="flex-1 bg-black border border-green-900/50 p-2 text-sm focus:border-green-500 outline-none resize-none text-gray-300 placeholder-green-900/30"
                 placeholder="Paste text here..."
               />
           </div>

           <div className="flex gap-4 justify-center">
               <button 
                onClick={() => process('ENCODE')}
                className="flex-1 bg-green-900/20 border border-green-800 py-2 hover:bg-green-600 hover:text-black transition-colors font-bold text-xs flex items-center justify-center gap-2"
               >
                   <Lock size={14} /> ENCODE
               </button>
               <button 
                onClick={() => process('DECODE')}
                className="flex-1 bg-green-900/20 border border-green-800 py-2 hover:bg-green-600 hover:text-black transition-colors font-bold text-xs flex items-center justify-center gap-2"
               >
                   <RefreshCw size={14} /> DECODE
               </button>
           </div>

           <div className="flex-1 flex flex-col">
               <label className="text-xs font-bold text-gray-500 mb-1 flex justify-between">
                   <span>OUTPUT</span>
                   <button onClick={() => navigator.clipboard.writeText(output)} className="hover:text-white">COPY</button>
               </label>
               <textarea 
                 readOnly
                 value={output}
                 className="flex-1 bg-black border border-green-900/50 p-2 text-sm focus:border-green-500 outline-none resize-none text-green-400"
                 placeholder="Result..."
               />
           </div>
       </div>
    </div>
  );
};