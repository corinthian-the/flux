import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type AppId = 'gemini' | 'notepad' | 'settings' | 'files' | 'calculator' | 'network' | 'hasher' | 'processes' | 'tor' | 'virus' | 'sniffer' | 'cracker' | 'tracer' | 'scanner' | 'cmdbuilder' | 'virus_runner' | 'remote' | 'crypto' | 'doc_viewer' | 'image_viewer' | 'john' | 'hashcat' | 'router_exploit' | 'phishing' | 'deepfake' | 'wallet_drainer';

export interface AppConfig {
  id: AppId;
  title: string;
  icon: LucideIcon;
  component: React.FC<any>; // Relaxed type for dynamic props
  defaultWidth: number;
  defaultHeight: number;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  props?: any; // Allow passing data (like file content) to apps
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  path?: string; // Path context for the prompt
}

// Updated File System Types
export interface FSNode {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  date: string;
  locked?: boolean;
  content?: string; // For editable files
  children?: FSNode[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: 'info' | 'error' | 'warning' | 'success';
}

export interface SystemStats {
  cpu: number;
  mem: number;
  netDown: number;
  netUp: number;
}