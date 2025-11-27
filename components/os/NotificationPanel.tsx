import React from 'react';
import { X, Bell, Trash2, AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
  onClear: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, notifications, onClose, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-12 right-2 w-80 bg-black border border-green-500 shadow-[0_0_30px_rgba(0,255,0,0.1)] z-50 flex flex-col max-h-[500px] h-auto min-h-[300px] animate-in slide-in-from-right-10 duration-200">
      <div className="flex items-center justify-between p-2 border-b border-green-800 bg-green-900/20 backdrop-blur-sm">
        <span className="text-xs font-bold text-green-500 tracking-widest flex items-center gap-2">
            <Bell size={14} /> SYSTEM_LOGS
        </span>
        <div className="flex gap-2">
            <button 
                onClick={onClear} 
                className="text-green-700 hover:text-green-400 p-1 hover:bg-green-900/30 transition-colors rounded-sm" 
                title="Clear Logs"
            >
                <Trash2 size={14} />
            </button>
            <button 
                onClick={onClose} 
                className="text-green-700 hover:text-green-400 p-1 hover:bg-green-900/30 transition-colors rounded-sm"
            >
                <X size={14} />
            </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-black/90">
        {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-green-900 text-xs italic gap-2 min-h-[200px]">
                <ShieldAlert size={24} className="opacity-20" />
                <span>[NO_NEW_EVENTS]</span>
            </div>
        ) : (
            notifications.map(n => (
                <div key={n.id} className="border-l-2 border-l-green-600 bg-zinc-900/30 p-2 hover:bg-green-900/10 transition-colors group relative border border-t-0 border-r-0 border-b-green-900/30">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                            {n.type === 'error' && <AlertTriangle size={14} className="text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />}
                            {n.type === 'success' && <CheckCircle size={14} className="text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />}
                            {n.type === 'info' && <Info size={14} className="text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" />}
                            {n.type === 'warning' && <AlertTriangle size={14} className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-green-400 font-mono tracking-tight">{n.title}</span>
                                <span className="text-[9px] text-green-800 font-mono shrink-0 ml-2">{new Date(n.timestamp).toLocaleTimeString([], {hour12: false})}</span>
                            </div>
                            <span className="text-[10px] text-green-600 font-mono mt-1 break-words leading-tight opacity-80">{n.message}</span>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
      
      <div className="p-1 border-t border-green-900 bg-zinc-900/50 text-[9px] text-green-800 font-mono text-center uppercase">
        kernel_events_stream // active
      </div>
    </div>
  );
};