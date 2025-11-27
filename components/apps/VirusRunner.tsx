import React, { useState, useEffect } from 'react';
import { Lock, Unlock, AlertTriangle, Skull, XCircle, Heart, MessageCircle } from 'lucide-react';

interface VirusRunnerProps {
  filePath?: string;
  onClose?: () => void;
}

// Passwords for viruses
const VIRUS_DB: Record<string, { pass: string, name: string }> = {
  'memz.exe': { pass: 'nyan', name: 'MEMZ Trojan' },
  'wannacry.exe': { pass: 'bitcoin', name: 'WannaCry Ransomware' },
  'iloveyou.vbs': { pass: 'secret', name: 'ILOVEYOU Worm' },
  'hydra.exe': { pass: 'hail', name: 'Hydra Network' },
  'petya.exe': { pass: 'skull', name: 'Petya Ransomware' },
  'bonzi.exe': { pass: 'purple', name: 'BonziBuddy Adware' }
};

export const VirusRunner: React.FC<VirusRunnerProps> = ({ filePath, onClose }) => {
  const fileName = filePath?.split('/').pop() || '';
  const virusConfig = VIRUS_DB[fileName];
  
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [payloadActive, setPayloadActive] = useState(false);

  // Payload States
  const [wcTimer, setWcTimer] = useState(172800); // 48 hours
  const [memzGlitch, setMemzGlitch] = useState(0);
  const [petyaProgress, setPetyaProgress] = useState(0);
  const [bonziQuotes, setBonziQuotes] = useState<string[]>([]);

  useEffect(() => {
    let interval: any;
    if (payloadActive && fileName === 'memz.exe') {
        interval = setInterval(() => {
            setMemzGlitch(Math.random());
        }, 100);
    }
    return () => clearInterval(interval);
  }, [payloadActive, fileName]);

  useEffect(() => {
      let interval: any;
      if (payloadActive && fileName === 'wannacry.exe') {
          interval = setInterval(() => setWcTimer(p => p - 1), 1000);
      }
      return () => clearInterval(interval);
  }, [payloadActive, fileName]);

  useEffect(() => {
      if (payloadActive && fileName === 'petya.exe' && petyaProgress < 100) {
          const interval = setInterval(() => {
              setPetyaProgress(p => (p >= 100 ? 100 : p + 1));
          }, 100);
          return () => clearInterval(interval);
      }
  }, [payloadActive, fileName, petyaProgress]);

  useEffect(() => {
      if (payloadActive && fileName === 'bonzi.exe') {
          const quotes = [
              "Nice to meet you, Expand Dong!",
              "I can help you browse the internet!",
              "Have you checked your email today?",
              "Warning: Spyware detected (It's me!)",
              "Let's sing a song!",
              "Give me your credit card details!",
              "Hello there!",
              "I'm lonely..."
          ];
          const interval = setInterval(() => {
             setBonziQuotes(prev => [...prev, quotes[Math.floor(Math.random() * quotes.length)]]);
          }, 2000);
          return () => clearInterval(interval);
      }
  }, [payloadActive, fileName]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (virusConfig && password === virusConfig.pass) {
        setIsLocked(false);
        setTimeout(() => setPayloadActive(true), 1000);
    } else {
        setError('DECRYPTION FAILED: INVALID KEY');
        setPassword('');
        setTimeout(() => setError(''), 2000);
    }
  };

  const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- LOCK SCREEN ---
  if (isLocked) {
      return (
          <div className="h-full bg-zinc-900 flex flex-col items-center justify-center p-8 font-mono relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              
              <div className="z-10 bg-black border-2 border-red-600 p-8 shadow-[0_0_50px_rgba(220,38,38,0.5)] max-w-sm w-full text-center">
                  <Skull size={48} className="text-red-600 mx-auto mb-4 animate-pulse" />
                  <h1 className="text-2xl font-bold text-red-500 mb-2">DANGER: MALWARE DETECTED</h1>
                  <p className="text-xs text-red-300 mb-6">
                      The file <span className="text-white font-bold">{fileName}</span> is encrypted container.
                      Execution requires a decryption key.
                  </p>

                  <form onSubmit={handleUnlock} className="space-y-4">
                      <div className="relative">
                          <Lock className="absolute left-3 top-2.5 text-red-700" size={16} />
                          <input 
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-red-900/10 border border-red-800 py-2 pl-10 pr-4 text-red-400 focus:outline-none focus:border-red-500 placeholder-red-900/50"
                              placeholder="Enter Decryption Key"
                              autoFocus
                          />
                      </div>
                      <button className="w-full bg-red-700 text-black font-bold py-2 hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                          <Unlock size={16} /> UNLOCK PAYLOAD
                      </button>
                  </form>

                  {error && (
                      <div className="mt-4 p-2 bg-red-500 text-black font-bold text-xs animate-pulse">
                          {error}
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // --- PAYLOADS ---

  // 1. MEMZ
  if (fileName === 'memz.exe') {
      return (
          <div className="h-full w-full bg-black relative overflow-hidden" style={{ filter: `invert(${memzGlitch > 0.8 ? 1 : 0})` }}>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <h1 className="text-6xl font-black text-white animate-bounce" style={{ transform: `rotate(${memzGlitch * 360}deg)` }}>
                      MEMZ
                  </h1>
              </div>
              {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute bg-white text-black p-2 font-bold text-xs border-2 border-black"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        transform: `scale(${Math.random() * 2})`
                    }}
                  >
                      YOUR PC IS TRASHED
                  </div>
              ))}
               <div className="absolute bottom-10 left-10 text-white font-mono bg-blue-600 p-2">
                   Deleting System32... [████████░░] 80%
               </div>
          </div>
      );
  }

  // 2. WannaCry
  if (fileName === 'wannacry.exe') {
      return (
          <div className="h-full bg-red-700 p-4 font-sans text-white flex flex-col relative">
              <div className="flex gap-4 h-full">
                  <div className="w-1/3 flex flex-col gap-4">
                      <div className="border-4 border-white p-4 text-center">
                          <h2 className="text-xl font-bold mb-2">Payment will be raised on</h2>
                          <div className="text-xs">3/22/2024 14:00:00</div>
                          <div className="text-2xl font-bold mt-2 text-yellow-300">Time Left</div>
                          <div className="text-3xl font-mono">{formatTime(wcTimer)}</div>
                      </div>
                      <div className="border-4 border-white p-4 text-center bg-red-800">
                          <h2 className="text-xl font-bold mb-2">Your files will be lost on</h2>
                          <div className="text-xs">3/25/2024 14:00:00</div>
                          <div className="text-2xl font-bold mt-2 text-yellow-300">Time Left</div>
                          <div className="text-3xl font-mono">{formatTime(wcTimer + 100000)}</div>
                      </div>
                  </div>
                  <div className="flex-1 bg-white text-black p-6 overflow-y-auto">
                      <h1 className="text-3xl font-bold text-red-600 mb-4 text-center border-b-4 border-red-600 pb-2">Ooops, your files have been encrypted!</h1>
                      <div className="space-y-4 font-medium">
                          <p><b>What Happened to My Computer?</b><br/>Your important files are encrypted. Many of your documents, photos, videos, databases and other files are no longer accessible because they have been encrypted.</p>
                          <p><b>Can I Recover My Files?</b><br/>Sure. We guarantee that you can recover all your files safely and easily. But you have not so enough time.</p>
                          <div className="bg-yellow-100 p-4 border border-yellow-400 text-center">
                              <p className="font-bold">Send $300 worth of bitcoin to this address:</p>
                              <div className="bg-white border border-black p-2 mt-2 font-mono text-sm select-all">115p7UMMngoj1pMvkpHijcRdfJNXj6LrLn</div>
                          </div>
                          <button className="w-full bg-blue-600 text-white font-bold py-3 mt-4 hover:bg-blue-500">Check Payment</button>
                          <button className="w-full bg-transparent text-blue-600 underline font-bold py-2 text-sm">Decrypt</button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // 3. ILOVEYOU
  if (fileName === 'iloveyou.vbs') {
      return (
          <div className="h-full bg-[#ECE9D8] text-black font-sans p-1 flex flex-col">
              <div className="bg-blue-800 text-white px-2 py-1 flex justify-between items-center text-sm font-bold">
                  <span>Visual Basic Script Host</span>
                  <XCircle size={16} />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <Heart size={64} className="text-pink-600 mb-4 animate-bounce" />
                  <h2 className="text-lg font-bold mb-4">ILOVEYOU</h2>
                  <div className="w-full max-w-sm bg-white border border-gray-400 h-48 overflow-y-auto p-2 text-left font-mono text-xs mb-4">
                      {Array.from({length: 50}).map((_, i) => (
                          <div key={i} className="text-green-700">
                              Sending LOVE-LETTER-FOR-YOU.TXT.vbs to contact_{i}@flux-mail.com ... SENT
                          </div>
                      ))}
                  </div>
                  <p className="text-sm">Kindly check the attached LOVELETTER coming from me.</p>
                  <button className="mt-6 px-6 py-1 border-2 border-black bg-[#ECE9D8] shadow-[2px_2px_0_black] active:translate-y-0.5 active:shadow-none">
                      OK
                  </button>
              </div>
          </div>
      );
  }

  // 5. Petya
  if (fileName === 'petya.exe') {
      return (
          <div className="h-full bg-red-600 flex flex-col items-center justify-center p-8 text-white font-mono select-none">
             {petyaProgress < 100 ? (
                 <div className="text-center">
                     <div className="text-xl mb-4">Repairing file system on C:</div>
                     <div className="w-64 h-4 border-2 border-white p-0.5 mb-2 mx-auto">
                         <div className="h-full bg-white" style={{width: `${petyaProgress}%`}}></div>
                     </div>
                     <div>One of your disks contains errors and needs to be repaired.</div>
                     <div>Do not turn off your PC! If you abort this process, you could destroy all of your data!</div>
                 </div>
             ) : (
                 <div className="text-center animate-pulse">
                     <pre className="text-[10px] leading-none mb-4 font-bold">
{`
      .                                                      .
        .n                   .                 .                  n.
  .   .dP                  dP                   9b                 9b.    .
 4    qXb         .       dX                     Xb       .        dXp     t
dX.    9Xb      .dXb    __                     __    dXb.     dXP     .Xb
9XXb._       _.dXXXXb dXXXXbo.               .odXXXXb dXXXXb._       _.dXXP
 9XXXXXXXXXXXXXXXXXXXVXXXXXXXXOo.           .oOXXXXXXXXVXXXXXXXXXXXXXXXXXXXP
  \`9XXXXXXXXXXXXXXXXXXXXX'~   ~'OOO8b   d8OOO'~   ~'XXXXXXXXXXXXXXXXXXXXXP'
    \`9XXXXXXXXXXXP' \`9XX'   DIE    \`98v8P'  HUMAN   \`XXP' \`9XXXXXXXXXXXP'
        ~~~~~~~       9X.          .db|db.          .XP       ~~~~~~~
                        )b.  .dbo.dP'\`v'\`9b.odb.  .dX(
                      ,dXXXXXXXXXXXb     dXXXXXXXXXXXb.
                     dXXXXXXXXXXXP'   .   \`9XXXXXXXXXXXb
                    dXXXXXXXXXXXXb   d|b   dXXXXXXXXXXXXb
                    9XXb'   \`XXXXXb.dX|Xb.dXXXXX'   \`dXXP
                     \`'      9XXXXXX(   )XXXXXXP      \`'
                              XXXX X.\`v'.X XXXX
                              XP^X'\`b   d'\`X^XX
                              X. 9  \`   '  P )X
                              \`b  \`       '  d'
`}
                     </pre>
                     <h1 className="text-4xl font-bold bg-white text-red-600 inline-block px-2">YOU BECAME VICTIM OF THE PETYA RANSOMWARE!</h1>
                     <p className="mt-8 text-sm max-w-lg mx-auto border border-white p-4">
                         The harddisks of your computer have been encrypted with an military grade encryption algorithm. There is no way to restore your data without a special key. You can purchase this key on the darknet page shown in step 2.
                     </p>
                 </div>
             )}
          </div>
      );
  }

  // 6. BonziBuddy
  if (fileName === 'bonzi.exe') {
      return (
          <div className="h-full bg-purple-100 relative overflow-hidden font-sans">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-900 opacity-20">
                  <h1 className="text-6xl font-bold">BonziBUDDY</h1>
                  <p>Your best friend on the internet!</p>
              </div>

              {/* The "Monkey" */}
              <div className="absolute bottom-0 right-0 p-8 flex flex-col items-end">
                  <div className="bg-yellow-100 border-2 border-black p-4 rounded-lg mb-4 relative max-w-xs shadow-lg animate-bounce">
                      <p className="text-sm font-bold">
                          {bonziQuotes[bonziQuotes.length - 1] || "Hello! I'm Bonzi!"}
                      </p>
                      <div className="absolute bottom-0 right-4 w-4 h-4 bg-yellow-100 border-b-2 border-r-2 border-black transform rotate-45 translate-y-2"></div>
                  </div>
                  <div className="w-32 h-32 bg-purple-600 rounded-full border-4 border-purple-800 flex items-center justify-center relative shadow-2xl">
                       <div className="absolute top-8 left-8 w-4 h-4 bg-white rounded-full"><div className="w-1 h-1 bg-black rounded-full mt-1 ml-1"></div></div>
                       <div className="absolute top-8 right-8 w-4 h-4 bg-white rounded-full"><div className="w-1 h-1 bg-black rounded-full mt-1 ml-1"></div></div>
                       <div className="absolute bottom-8 w-16 h-8 bg-yellow-200 rounded-full border-2 border-purple-900"></div>
                  </div>
              </div>

              {/* Spam Popups */}
              {bonziQuotes.map((q, i) => (
                  <div 
                    key={i}
                    className="absolute bg-white border-2 border-blue-600 shadow-xl w-64"
                    style={{
                        top: `${Math.random() * 80}%`,
                        left: `${Math.random() * 80}%`,
                        zIndex: i
                    }}
                  >
                      <div className="bg-blue-600 text-white px-1 py-0.5 text-xs font-bold flex justify-between">
                          <span>Message from Bonzi</span>
                          <XCircle size={12} />
                      </div>
                      <div className="p-4 flex gap-2 items-center">
                          <AlertTriangle size={24} className="text-yellow-500" />
                          <span className="text-xs text-black">{q}</span>
                      </div>
                      <div className="p-2 flex justify-center bg-gray-100">
                          <button className="px-4 py-0.5 border border-black text-xs bg-gray-300 active:bg-gray-400">OK</button>
                      </div>
                  </div>
              ))}
          </div>
      );
  }

  // 4. Default / Other
  return (
      <div className="h-full bg-black flex items-center justify-center">
          <div className="text-green-500 font-mono text-center">
              <h1 className="text-2xl font-bold mb-4">PAYLOAD EXECUTED</h1>
              <p>Target: {fileName}</p>
              <div className="mt-4 animate-pulse">Running kernel exploit...</div>
          </div>
      </div>
  );
};