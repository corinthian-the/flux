import React from 'react';
import { FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Printer } from 'lucide-react';

interface DocViewerProps {
  filePath?: string;
  initialContent?: string;
}

export const DocViewer: React.FC<DocViewerProps> = ({ filePath, initialContent }) => {
  const fileName = filePath?.split('/').pop() || 'Untitled';
  
  return (
    <div className="h-full flex flex-col bg-[#2e2e2e] text-gray-200 font-sans select-none">
       {/* Toolbar */}
       <div className="h-10 bg-[#3c3c3c] border-b border-black flex items-center px-4 justify-between shrink-0">
           <div className="flex items-center gap-4">
               <FileText size={18} className="text-gray-400" />
               <span className="text-sm font-bold text-gray-100">{fileName}</span>
           </div>
           <div className="flex items-center gap-2">
               <button className="p-1 hover:bg-white/10 rounded"><ZoomOut size={16} /></button>
               <span className="text-xs bg-black/30 px-2 py-0.5 rounded">100%</span>
               <button className="p-1 hover:bg-white/10 rounded"><ZoomIn size={16} /></button>
           </div>
           <div className="flex items-center gap-2">
               <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={16} /></button>
               <span className="text-xs text-gray-400">Page 1 of 1</span>
               <button className="p-1 hover:bg-white/10 rounded"><ChevronRight size={16} /></button>
               <div className="w-px h-4 bg-gray-500 mx-2"></div>
               <button className="p-1 hover:bg-white/10 rounded"><Printer size={16} /></button>
           </div>
       </div>

       {/* Document Canvas */}
       <div className="flex-1 overflow-y-auto p-8 bg-[#525659] flex justify-center">
           <div className="bg-white text-black w-full max-w-3xl min-h-[800px] shadow-2xl p-12 font-serif leading-relaxed relative">
               {/* Watermark */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200 text-6xl font-bold -rotate-45 pointer-events-none select-none border-4 border-gray-200 p-4 rounded opacity-50">
                   CONFIDENTIAL
               </div>

               {/* Content */}
               <div className="whitespace-pre-wrap">
                   {initialContent || "Error: Document buffer empty."}
               </div>

               {/* Fake Footer */}
               <div className="absolute bottom-8 left-12 right-12 border-t pt-4 flex justify-between text-[10px] text-gray-500 font-sans">
                   <span>FluxOS Document Render Engine</span>
                   <span>Page 1</span>
               </div>
           </div>
       </div>
    </div>
  );
};