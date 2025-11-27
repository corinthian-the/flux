import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import type { WindowState } from '../../types';

interface WindowProps {
  windowState: WindowState;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  isDualMonitor: boolean;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  windowState,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  isDualMonitor,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !windowState.isMaximized) {
        // Calculate potential new X
        let newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Constraint Logic
        // If NOT dual monitor, strictly bound to window width
        // If dual monitor, allow going up to 2x window width
        const screenWidth = window.innerWidth;
        const limit = isDualMonitor ? screenWidth * 2 : screenWidth;

        // Simple boundary check to keep header somewhat on screen
        if (newY < 0) return; 
        
        onMove(windowState.id, newX, newY);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
          setIsDragging(false);
          
          // SNAP LOGIC
          if (isDualMonitor) {
              const screenWidth = window.innerWidth;
              const currentX = e.clientX - dragOffset.x;
              const snapThreshold = 100; // Pixels from edge to trigger snap

              // If dragging near the right edge of Monitor 1, snap to Monitor 2
              if (currentX > screenWidth - snapThreshold && currentX < screenWidth + snapThreshold) {
                  onMove(windowState.id, screenWidth + 20, windowState.y);
              }
              // If dragging near the left edge of Monitor 2, snap back to Monitor 1
              else if (currentX < screenWidth && currentX > screenWidth - snapThreshold * 2) {
                   // Optional: Snap back logic if needed, currently free flow is fine
              }
          }
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, windowState.id, windowState.isMaximized, onMove, isDualMonitor, windowState.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus(windowState.id);
    if (windowState.isMaximized) return;
    
    // Only allow dragging from the header
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y,
    });
  };

  if (windowState.isMinimized) return null;

  const style: React.CSSProperties = windowState.isMaximized
    ? {
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 40px)', // Subtract taskbar height
        zIndex: windowState.zIndex,
        position: 'fixed' // Fixed ensures it stays on the specific monitor (viewport) usually, but for dual monitor sim we might want absolute
      }
    : {
        left: windowState.x,
        top: windowState.y,
        width: windowState.width,
        height: windowState.height,
        zIndex: windowState.zIndex,
        position: 'absolute'
      };

  return (
    <div
      ref={windowRef}
      className={`flex flex-col bg-black/95 border shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-colors duration-100 ${
        isActive ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-green-900 opacity-90'
      }`}
      style={style}
      onMouseDown={() => onFocus(windowState.id)}
    >
      {/* Title Bar */}
      <div
        className={`h-8 flex items-center justify-between px-2 select-none cursor-default border-b ${
            isActive ? 'bg-green-900/20 border-green-500' : 'bg-zinc-900 border-green-900'
        }`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(windowState.id)}
      >
        <div className="text-xs font-bold text-green-500 tracking-widest flex items-center gap-2 uppercase">
          <span className="text-green-700">./</span>{windowState.title}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
            className="w-6 h-6 flex items-center justify-center hover:bg-green-500/20 text-green-600 hover:text-green-400 transition-colors"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }}
            className="w-6 h-6 flex items-center justify-center hover:bg-green-500/20 text-green-600 hover:text-green-400 transition-colors"
          >
            {windowState.isMaximized ? <Square size={10} /> : <Maximize2 size={10} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
            className="w-6 h-6 flex items-center justify-center hover:bg-red-900/50 text-red-500 hover:text-red-400 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative text-green-400 bg-black/50">
        {children}
      </div>
    </div>
  );
};