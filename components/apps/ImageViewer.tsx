import React from 'react';
import { Image as ImageIcon, ZoomIn, ZoomOut, RotateCw, Trash2 } from 'lucide-react';

interface ImageViewerProps {
    filePath?: string;
    initialContent?: string; // For simulation, this might be a text description or base64 placeholder
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ filePath, initialContent }) => {
    const fileName = filePath?.split('/').pop() || 'image.png';

    // Determining content to show based on filename for simulation
    const getSimulatedImage = () => {
        if (fileName.includes('kali')) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-green-500">
                    <img src="https://www.kali.org/images/kali-dragon-icon.svg" className="w-64 h-64 opacity-80" alt="Kali" />
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ImageIcon size={64} className="mb-4" />
                <p className="font-mono text-xs border border-gray-700 p-2 text-center">
                    [BINARY IMAGE DATA]<br/>
                    {initialContent || "No preview available"}
                </p>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-[#111] text-gray-200 font-sans select-none">
            <div className="h-10 bg-[#222] flex items-center justify-between px-4 border-b border-[#333]">
                <span className="font-bold text-sm">{fileName}</span>
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-white/10 rounded"><ZoomOut size={14} /></button>
                    <button className="p-1.5 hover:bg-white/10 rounded"><ZoomIn size={14} /></button>
                    <button className="p-1.5 hover:bg-white/10 rounded"><RotateCw size={14} /></button>
                    <button className="p-1.5 hover:bg-red-900/50 text-red-400 rounded"><Trash2 size={14} /></button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/checkerboard-crosshairs.png')]">
                {getSimulatedImage()}
            </div>
            <div className="h-6 bg-[#222] border-t border-[#333] flex items-center px-4 text-[10px] text-gray-500 gap-4">
                <span>1920 x 1080</span>
                <span>24 Bit Depth</span>
                <span>PNG Image</span>
                <span className="ml-auto">100%</span>
            </div>
        </div>
    );
};