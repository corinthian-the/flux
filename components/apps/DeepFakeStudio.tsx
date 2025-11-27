import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Square, Activity, Upload, Music, Volume2, Cpu } from 'lucide-react';

export const DeepFakeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'AUDIO' | 'VIDEO'>('AUDIO');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>(new Array(30).fill(10));
  
  // Animation loop for audio visualizer
  useEffect(() => {
    let interval: any;
    if (isPlaying || isProcessing) {
        interval = setInterval(() => {
            setAudioLevel(prev => prev.map(() => Math.random() * 80 + 10));
        }, 100);
    } else {
        setAudioLevel(new Array(30).fill(5));
    }
    return () => clearInterval(interval);
  }, [isPlaying, isProcessing]);

  const handleGenerate = () => {
      if (!inputText) return;
      setIsProcessing(true);
      setProgress(0);
      setIsPlaying(false);

      const interval = setInterval(() => {
          setProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setIsProcessing(false);
                  return 100;
              }
              return prev + 2;
          });
      }, 100);
  };

  return (
    <div className="h-full flex flex-col bg-[#080808] text-green-500 font-mono select-none">
       {/* Header */}
       <div className="flex items-center justify-between p-4 border-b border-green-900 bg-green-900/5">
           <div className="flex items-center gap-3">
               <div className="p-2 bg-green-900/20 rounded border border-green-700">
                   <Mic size={20} />
               </div>
               <div>
                   <h1 className="text-lg font-bold text-white tracking-widest">DEEPFAKE_STUDIO</h1>
                   <p className="text-[10px] text-green-700">Neural Voice Cloning & Synthesis</p>
               </div>
           </div>
           <div className="flex gap-2">
               <button 
                  onClick={() => setActiveTab('AUDIO')}
                  className={`px-4 py-1 text-xs font-bold border transition-colors ${activeTab === 'AUDIO' ? 'bg-green-600 text-black border-green-600' : 'text-green-600 border-green-800'}`}
               >
                   AUDIO_CLONE
               </button>
               <button 
                  onClick={() => setActiveTab('VIDEO')}
                  className={`px-4 py-1 text-xs font-bold border transition-colors ${activeTab === 'VIDEO' ? 'bg-green-600 text-black border-green-600' : 'text-green-600 border-green-800'}`}
               >
                   VIDEO_SYNC
               </button>
           </div>
       </div>

       <div className="flex-1 flex p-4 gap-6 min-h-0">
           {/* Left Config */}
           <div className="w-1/3 flex flex-col gap-4">
               <div className="p-4 border border-green-900/50 bg-[#0f0f0f] rounded space-y-4">
                   <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                       <Upload size={14} /> Source Sample
                   </label>
                   <div className="h-20 border-2 border-dashed border-green-900/50 rounded flex flex-col items-center justify-center text-green-800 hover:bg-green-900/10 cursor-pointer transition-colors">
                       <Music size={24} className="mb-2 opacity-50" />
                       <span className="text-[10px]">DROP VOICE SAMPLE (.WAV)</span>
                   </div>
                   
                   <div className="flex items-center gap-2 text-[10px] text-green-600 border-t border-green-900/30 pt-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                       <span>Model Loaded: CEO_Voice_V2</span>
                   </div>
               </div>

               <div className="flex-1 flex flex-col">
                   <label className="text-xs font-bold text-gray-500 uppercase mb-2">Target Script</label>
                   <textarea 
                       value={inputText}
                       onChange={(e) => setInputText(e.target.value)}
                       className="flex-1 bg-[#0f0f0f] border border-green-900/50 p-3 text-sm text-white resize-none outline-none focus:border-green-500"
                       placeholder="Enter text to synthesize..."
                   />
               </div>

               <button 
                  onClick={handleGenerate}
                  disabled={isProcessing || !inputText}
                  className="py-3 bg-green-600 hover:bg-green-500 text-black font-bold tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                   <Cpu size={16} /> {isProcessing ? 'SYNTHESIZING...' : 'GENERATE AUDIO'}
               </button>
           </div>

           {/* Right Visualizer */}
           <div className="flex-1 bg-[#0f0f0f] border border-green-900/30 rounded flex flex-col relative overflow-hidden">
               {/* Waveform Visualization */}
               <div className="flex-1 flex items-center justify-center gap-1 px-8">
                   {audioLevel.map((height, i) => (
                       <div 
                         key={i} 
                         className="flex-1 bg-green-500 transition-all duration-100 opacity-80"
                         style={{ 
                             height: `${height}%`,
                             boxShadow: '0 0 10px rgba(34,197,94,0.5)' 
                         }}
                       />
                   ))}
               </div>

               {/* Controls */}
               <div className="h-16 bg-[#0a0a0a] border-t border-green-900/50 flex items-center px-6 gap-4">
                   <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={progress < 100}
                      className="w-10 h-10 rounded-full bg-green-900/20 border border-green-600 flex items-center justify-center text-green-500 hover:bg-green-600 hover:text-black transition-all disabled:opacity-30"
                   >
                       {isPlaying ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                   </button>
                   
                   <div className="flex-1 space-y-1">
                       <div className="flex justify-between text-[10px] text-green-700 font-bold uppercase">
                           <span>Processing</span>
                           <span>{progress}%</span>
                       </div>
                       <div className="h-1.5 bg-green-900/30 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-green-500 transition-all duration-300" 
                              style={{ width: `${progress}%` }}
                           />
                       </div>
                   </div>

                   <div className="flex items-center gap-2 text-green-700">
                       <Volume2 size={16} />
                       <div className="w-20 h-1 bg-green-900/50 rounded-full">
                           <div className="w-3/4 h-full bg-green-700"></div>
                       </div>
                   </div>
               </div>

               {/* Overlay for Video Tab (Simulated) */}
               {activeTab === 'VIDEO' && (
                   <div className="absolute inset-0 bg-black/90 z-10 flex flex-col items-center justify-center text-green-900">
                       <Activity size={64} className="mb-4 opacity-20" />
                       <h2 className="text-xl font-bold">VIDEO SYNC MODULE</h2>
                       <p className="text-xs">Requires GPU Cluster Access</p>
                       <div className="mt-4 px-4 py-1 border border-green-900/50 text-[10px] text-green-700">
                           MODULE_OFFLINE
                       </div>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};