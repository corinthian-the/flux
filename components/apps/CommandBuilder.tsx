import React, { useState } from 'react';
import { Terminal, Copy, Cpu, Zap, ChevronRight } from 'lucide-react';
import { streamGeminiResponse } from '../../services/geminiService';

const CMD_GEN_SYSTEM_INSTRUCTION = "You are an expert Command Line Interface (CLI) generator for ethical hacking tools. The user will provide a natural language description of an action. You must output EXACTLY and ONLY the command string required to execute that action. Use common tools like nmap, sqlmap, hydra, aircrack-ng, msfconsole, netcat, or standard linux commands. Do NOT provide explanations, markdown, or code blocks. Just the raw command string.";

export const CommandBuilder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    setOutput('');
    
    let fullResponse = "";
    await streamGeminiResponse(input, (chunk) => {
        fullResponse += chunk;
        // Simple cleanup to ensure no markdown if the model hallucinates it despite instructions
        const clean = fullResponse.replace(/```/g, '').replace(/^bash/g, '').trim();
        setOutput(clean);
    }, CMD_GEN_SYSTEM_INSTRUCTION);
    
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleGenerate();
      }
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] text-green-500 font-mono p-6 select-none">
      <div className="flex items-center gap-4 mb-8 border-b border-green-900 pb-4">
          <div className="p-3 bg-green-900/10 border border-green-500/50 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <Cpu size={28} className="text-green-400" />
          </div>
          <div>
              <h1 className="text-xl font-bold tracking-widest text-white flex items-center gap-2">
                  AI_CMD_GEN <span className="text-[10px] bg-green-900/50 px-1 rounded text-green-300">BETA</span>
              </h1>
              <p className="text-xs text-green-700 mt-1">Natural Language to Shell Code Compiler</p>
          </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
          <div className="space-y-2">
              <label className="text-xs font-bold text-green-600 uppercase flex items-center gap-2">
                  <Terminal size={14} /> Describe Action
              </label>
              <div className="relative group">
                  <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. Scan 192.168.1.5 for open web ports and detect OS version..."
                      className="w-full h-24 bg-black border border-green-800 rounded p-4 text-sm text-green-300 focus:outline-none focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-all resize-none placeholder-green-900/50"
                  />
                  <div className="absolute bottom-2 right-2 text-[10px] text-green-900">
                      CMD + ENTER to Generate
                  </div>
              </div>
          </div>

          <div className="flex justify-center">
              <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !input}
                  className="bg-green-600 text-black px-8 py-2 rounded font-bold flex items-center gap-2 hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isGenerating ? <Zap size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                  {isGenerating ? 'COMPILING...' : 'GENERATE COMMAND'}
              </button>
          </div>

          <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-green-600 uppercase flex items-center gap-2">
                  <Cpu size={14} /> Generated Output
              </label>
              <div className="relative h-full">
                  <div className="w-full h-full min-h-[100px] bg-[#0a0a0a] border border-green-900/50 rounded p-4 font-mono text-sm text-white flex items-center shadow-inner overflow-hidden">
                      {output ? (
                          <span className="break-all">{output}</span>
                      ) : (
                          <span className="text-green-900/40 italic">Waiting for input...</span>
                      )}
                  </div>
                  
                  {output && (
                      <button 
                          onClick={copyToClipboard}
                          className="absolute top-2 right-2 p-2 bg-green-900/20 text-green-500 hover:text-white hover:bg-green-600/50 rounded transition-colors"
                          title="Copy to Clipboard"
                      >
                          <Copy size={16} />
                      </button>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};