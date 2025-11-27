import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Bot, 
  FileText, 
  Settings as SettingsIcon, 
  FolderOpen, 
  SquareTerminal,
  Network,
  Lock,
  Hash,
  Activity,
  FileCode,
  Globe,
  Skull,
  Radio,
  Key,
  MapPin,
  ShieldCheck,
  Database,
  Flame,
  Wifi,
  Terminal as TerminalIcon,
  AlertOctagon,
  Monitor,
  Binary,
  Book,
  Image as ImageIcon,
  Cpu,
  Zap,
  Router,
  UserPlus,
  Mic,
  Wallet
} from 'lucide-react';
import { WindowState, AppConfig, AppId, Notification, FSNode } from './types';
import { Window } from './components/os/Window';
import { Taskbar } from './components/os/Taskbar';
import { StartMenu } from './components/os/StartMenu';
import { NotificationPanel } from './components/os/NotificationPanel';
import { LoginScreen } from './components/os/LoginScreen';

// Apps
import { GeminiAssistant } from './components/apps/GeminiAssistant';
import { Notepad } from './components/apps/Notepad';
import { Files } from './components/apps/Files';
import { Settings } from './components/apps/Settings';
import { HashTool } from './components/apps/HashTool';
import { ProcessManager } from './components/apps/ProcessManager';
import { TorBrowser } from './components/apps/TorBrowser';
import { VirusGenerator } from './components/apps/VirusGenerator';
import { PacketSniffer } from './components/apps/PacketSniffer';
import { PasswordCracker } from './components/apps/PasswordCracker';
import { IpTracer } from './components/apps/IpTracer';
import { VirusScanner } from './components/apps/VirusScanner';
import { CommandBuilder } from './components/apps/CommandBuilder';
import { VirusRunner } from './components/apps/VirusRunner';
import { RemoteAccess } from './components/apps/RemoteAccess';
import { CryptoLab } from './components/apps/CryptoLab';
import { DocViewer } from './components/apps/DocViewer';
import { ImageViewer } from './components/apps/ImageViewer';
import { JohnTheRipper } from './components/apps/JohnTheRipper';
import { Hashcat } from './components/apps/Hashcat';
import { NetworkManager } from './components/apps/NetworkManager';
import { RouterExploit } from './components/apps/RouterExploit';
import { PhishingGen } from './components/apps/PhishingGen';
import { DeepFakeStudio } from './components/apps/DeepFakeStudio';
import { WalletDrainer } from './components/apps/WalletDrainer';

// --- INITIAL FILE SYSTEM STATE ---
const INITIAL_FS: FSNode = {
  name: 'root',
  type: 'folder',
  date: '1970-01-01',
  children: [
    {
      name: 'v$$',
      type: 'folder',
      date: '2024-03-20',
      children: [
        {
          name: 'README.txt',
          type: 'file',
          size: '1 KB',
          date: '2024-03-20',
          content: "WARNING: THESE FILES ARE LIVE MALWARE SAMPLES.\nALL FILES ARE ENCRYPTED FOR SAFETY.\nDO NOT EXECUTE UNLESS YOU HAVE THE KEY.\n\nKeys hint:\nmemz -> nyan\nwannacry -> bitcoin\niloveyou -> secret\nhydra -> hail\npetya -> skull\nbonzi -> purple"
        },
        {
          name: 'memz.exe',
          type: 'file',
          size: '4 MB',
          date: '2024-03-20',
          content: "ENCRYPTED_CONTAINER_V2"
        },
        {
          name: 'wannacry.exe',
          type: 'file',
          size: '8 MB',
          date: '2024-03-20',
          content: "ENCRYPTED_CONTAINER_V2"
        },
        {
          name: 'iloveyou.vbs',
          type: 'file',
          size: '12 KB',
          date: '2024-03-20',
          content: "ENCRYPTED_CONTAINER_V2"
        },
        {
          name: 'hydra.exe',
          type: 'file',
          size: '2 MB',
          date: '2024-03-20',
          content: "ENCRYPTED_CONTAINER_V2"
        },
        {
          name: 'petya.exe',
          type: 'file',
          size: '5 MB',
          date: '2024-03-21',
          content: "ENCRYPTED_CONTAINER_V2"
        },
        {
          name: 'bonzi.exe',
          type: 'file',
          size: '15 MB',
          date: '2024-03-21',
          content: "ENCRYPTED_CONTAINER_V2"
        }
      ]
    },
    {
      name: '###',
      type: 'folder',
      date: '2024-01-01',
      children: [
        {
            name: 'hasher.exe',
            type: 'file',
            size: '4 MB',
            date: '2024-03-15',
            content: "BINARY_DATA_CANNOT_BE_READ_IN_EDITOR"
        },
        {
            name: 'john.exe',
            type: 'file',
            size: '12 MB',
            date: '2024-03-22',
            content: "BINARY_DATA_CANNOT_BE_READ_IN_EDITOR"
        },
        {
            name: 'hashcat.exe',
            type: 'file',
            size: '40 MB',
            date: '2024-03-22',
            content: "BINARY_DATA_CANNOT_BE_READ_IN_EDITOR"
        },
        {
            name: 'dark_web_links.txt',
            type: 'file',
            size: '1 KB',
            date: '2024-03-16',
            content: "== ONION LINKS DIRECTORY ==\n\n[CAUTION: FLUX KERNEL DOES NOT LOG THESE ACCESSES]\n\nflux://home           - Torch Search Engine\nhttp://hiddenwiki.onion - The Hidden Wiki\nhttp://market.onion     - ZeroDay Bazaar (Exploits Market)\nhttp://forum.onion      - BlackHat Talk\n"
        },
        {
            name: 'security_tutorial.txt',
            type: 'file',
            size: '2KB',
            date: '2024-03-15',
            content: "== FLUX OS SECURITY PRIMER ==\n\n[TOP SECRET // EYES ONLY]\n\nThe system login mechanism has been upgraded to use SHA-256 hashing.\nPlain text passwords are no longer stored.\n\nUSAGE:\n1. Open 'hasher.exe' to access the cryptographic tool.\n2. Enter a string to generate its SHA-256 hash.\n3. Compare hashes to verify file integrity or password matches.\n\nCURRENT HASHES:\nroot:  4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2\nadmin: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918\n\nNote: Encrypt sensitive data before transmission.\n\n-- END OF TRANSMISSION --"
        },
        { 
            name: 'payload_generator.sh', 
            type: 'file', 
            size: '12 KB', 
            date: '2024-03-12',
            content: "#!/bin/bash\n\necho 'Generating Payload...'\n# Simulating buffer overflow\nfor i in {1..1000}; do\n  echo -n '\\x90'\ndone\necho 'Payload Ready.'" 
        },
        {
            name: 'sql_inject.sh',
            type: 'file',
            size: '8 KB',
            date: '2024-03-18',
            content: "#!/bin/bash\nsqlmap -u http://target.com/id=1 --dbs"
        },
        {
            name: 'msf_start.sh',
            type: 'file',
            size: '24 KB',
            date: '2024-03-18',
            content: "#!/bin/bash\nmsfconsole"
        },
        {
            name: 'wifi_crack.sh',
            type: 'file',
            size: '4 KB',
            date: '2024-03-18',
            content: "#!/bin/bash\naircrack-ng -w /root/rockyou.txt wlan0"
        },
        {
            name: 'ip_gen.sh',
            type: 'file',
            size: '2 KB',
            date: '2024-03-21',
            content: "#!/bin/bash\n# FluxOS IP Generator\n./ip_gen"
        },
        {
            name: 'hydra_brute.sh',
            type: 'file',
            size: '2 KB',
            date: '2024-03-21',
            content: "#!/bin/bash\n# Hydra Bruteforce\nhydra -l admin -P /root/passwords.txt ssh://10.0.0.5"
        },
        {
            name: 'worm_deploy.sh',
            type: 'file',
            size: '3 KB',
            date: '2024-03-23',
            content: "#!/bin/bash\n# Spreads malware via router UPnP vulnerabilities\nrouter_sploit --target 192.168.1.1 --payload wannacry.exe"
        },
        {
            name: 'targets.json',
            type: 'file',
            size: '2 KB',
            date: '2024-03-12',
            content: "{\n  \"targets\": [\n    { \"ip\": \"192.168.1.55\", \"type\": \"Windows 10\", \"vuln\": \"SMB-EternalBlue\" },\n    { \"ip\": \"10.0.0.5\", \"type\": \"Ubuntu Server\", \"vuln\": \"SSH-Brute\" },\n    { \"ip\": \"203.0.113.4\", \"type\": \"CCTV Camera\", \"vuln\": \"Default Creds\" }\n  ]\n}"
        },
        {
            name: 'exploit_notes.txt',
            type: 'file',
            size: '5 KB',
            date: '2024-03-12',
            content: "ENTRY POINT FOUND: Port 8080\nService: Apache Tomcat (Outdated)\nVector: Remote Code Execution via JSP upload."
        }
      ]
    },
    {
      name: 'home',
      type: 'folder',
      date: '2023-01-01',
      children: [
        {
          name: 'user',
          type: 'folder',
          date: '2023-01-01',
          children: [
             {
                 name: 'Downloads',
                 type: 'folder',
                 date: '2024-03-22',
                 children: []
             },
             {
                name: 'todo.txt',
                type: 'file',
                size: '1KB',
                date: '2024-03-14',
                content: "- Crack the shadow file\n- Update kernel modules\n- Clear system logs"
             },
             {
                 name: 'pentest_guide.pdf',
                 type: 'file',
                 size: '1.2 MB',
                 date: '2024-01-10',
                 content: "FLUX OS PENTESTING GUIDE v1.0\n\n1. Reconnaissance\n   Use 'nmap' to scan networks.\n\n2. Vulnerability Analysis\n   Use 'sqlmap' for web apps.\n   Use 'hydra' for brute forcing.\n\n3. Exploitation\n   Use 'msfconsole' for complex attacks.\n   Use 'Payload Generator' for custom malware.\n\n4. Post-Exploitation\n   Establish persistence.\n   Clear logs."
             },
             {
                 name: 'kali_logo.png',
                 type: 'file',
                 size: '240 KB',
                 date: '2024-01-01',
                 content: "kali_logo_data"
             }
          ]
        }
      ]
    },
    {
      name: 'var',
      type: 'folder',
      date: '1970-01-01',
      children: [
        {
          name: 'log',
          type: 'folder',
          date: '2024-03-01',
          children: [
            { name: 'syslog', type: 'file', size: '128 MB', date: '2024-03-01', content: "Mar 10 12:01:01 flux-os systemd[1]: Started Session 1 of user root.\nMar 10 12:05:22 flux-os kernel: [  12.3432] Buffer I/O error on dev sda1\nMar 10 12:10:00 flux-os sshd[204]: Failed password for invalid user admin from 192.168.1.20" },
          ]
        }
      ]
    },
    {
      name: 'usr',
      type: 'folder',
      date: '2023-01-01',
      children: [
          {
              name: 'share',
              type: 'folder',
              date: '2023-01-01',
              children: [
                  {
                      name: 'man',
                      type: 'folder',
                      date: '2023-01-01',
                      children: [
                          {
                              name: 'nmap.man',
                              type: 'file',
                              size: '10 KB',
                              date: '2023-01-01',
                              content: "NAME\n       nmap - Network exploration tool and security / port scanner\n\nSYNOPSIS\n       nmap [Scan Type...] [Options] {target specification}\n\nDESCRIPTION\n       Nmap ('Network Mapper') is an open source tool for network exploration and security auditing."
                          }
                      ]
                  }
              ]
          }
      ]
    }
  ]
};

const DESKTOP_HASH_CONTENT = `root:$6$G/1QW2.d$s8s7.1:18722:0:99999:7:::\nadmin:$6$kL9.s8a$:18722:0:99999:7:::\nguest:*:18722:0:99999:7:::`;

// Define Apps Registry
const APPS: AppConfig[] = [
  { 
    id: 'gemini', 
    title: 'TERMINAL', 
    icon: SquareTerminal, 
    component: GeminiAssistant, 
    defaultWidth: 700, 
    defaultHeight: 500 
  },
  {
    id: 'cmdbuilder',
    title: 'AI_CMD',
    icon: TerminalIcon,
    component: CommandBuilder,
    defaultWidth: 500, 
    defaultHeight: 450
  },
  {
    id: 'phishing',
    title: 'SOCIAL_ENG',
    icon: UserPlus,
    component: PhishingGen,
    defaultWidth: 650,
    defaultHeight: 500
  },
  {
    id: 'deepfake',
    title: 'DEEPFAKE',
    icon: Mic,
    component: DeepFakeStudio,
    defaultWidth: 700,
    defaultHeight: 500
  },
  {
    id: 'remote',
    title: 'REMOTE',
    icon: Monitor,
    component: RemoteAccess,
    defaultWidth: 640,
    defaultHeight: 480
  },
  {
    id: 'crypto',
    title: 'DECODER',
    icon: Binary,
    component: CryptoLab,
    defaultWidth: 500,
    defaultHeight: 400
  },
  {
    id: 'processes',
    title: 'HTOP',
    icon: Activity,
    component: ProcessManager,
    defaultWidth: 600, 
    defaultHeight: 450
  },
  { 
    id: 'notepad', 
    title: 'EDITOR', 
    icon: FileText, 
    component: Notepad, 
    defaultWidth: 600, 
    defaultHeight: 400 
  },
  { 
    id: 'files', 
    title: 'FILES', 
    icon: FolderOpen, 
    component: Files, 
    defaultWidth: 700, 
    defaultHeight: 500 
  },
  {
    id: 'doc_viewer',
    title: 'DOC_VIEW',
    icon: Book,
    component: DocViewer,
    defaultWidth: 600,
    defaultHeight: 700
  },
  {
    id: 'image_viewer',
    title: 'IMG_VIEW',
    icon: ImageIcon,
    component: ImageViewer,
    defaultWidth: 600,
    defaultHeight: 500
  },
  {
    id: 'virus_runner',
    title: 'VIRUS_HOST',
    icon: AlertOctagon,
    component: VirusRunner,
    defaultWidth: 600,
    defaultHeight: 500
  },
  {
    id: 'network',
    title: 'NET_MON',
    icon: Network,
    component: NetworkManager,
    defaultWidth: 400,
    defaultHeight: 300
  },
  {
    id: 'settings',
    title: 'CONFIG',
    icon: SettingsIcon,
    component: Settings,
    defaultWidth: 600, 
    defaultHeight: 450
  },
  {
    id: 'hasher',
    title: 'SHA256',
    icon: Hash,
    component: HashTool,
    defaultWidth: 500, 
    defaultHeight: 400
  },
  {
    id: 'john',
    title: 'JOHN',
    icon: Skull,
    component: JohnTheRipper,
    defaultWidth: 600,
    defaultHeight: 450
  },
  {
    id: 'hashcat',
    title: 'HASHCAT',
    icon: Zap,
    component: Hashcat,
    defaultWidth: 700,
    defaultHeight: 500
  },
  {
    id: 'tor',
    title: 'ONION_NET',
    icon: Globe,
    component: TorBrowser,
    defaultWidth: 800,
    defaultHeight: 600
  },
  {
    id: 'virus',
    title: 'MALWARE',
    icon: Skull,
    component: VirusGenerator,
    defaultWidth: 600,
    defaultHeight: 500
  },
  {
    id: 'sniffer',
    title: 'WIRESHARK',
    icon: Radio,
    component: PacketSniffer,
    defaultWidth: 700,
    defaultHeight: 500
  },
  {
    id: 'cracker',
    title: 'HYDRA',
    icon: Key,
    component: PasswordCracker,
    defaultWidth: 500,
    defaultHeight: 400
  },
  {
    id: 'tracer',
    title: 'TRACE',
    icon: MapPin,
    component: IpTracer,
    defaultWidth: 600,
    defaultHeight: 450
  },
  {
    id: 'scanner',
    title: 'DEFENDER',
    icon: ShieldCheck,
    component: VirusScanner,
    defaultWidth: 600,
    defaultHeight: 500
  },
  {
    id: 'router_exploit',
    title: 'NET_SPREADER',
    icon: Router,
    component: RouterExploit,
    defaultWidth: 700,
    defaultHeight: 550
  },
  {
    id: 'wallet_drainer',
    title: 'DRAINER',
    icon: Wallet,
    component: WalletDrainer,
    defaultWidth: 600,
    defaultHeight: 500
  }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [isDualMonitor, setIsDualMonitor] = useState(false);
  
  // Global FS State
  const [fileSystem, setFileSystem] = useState<FSNode>(INITIAL_FS);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'KERNEL', message: 'FluxOS Kernel v2.5 loaded successfully.', timestamp: Date.now() - 3600000, type: 'success' },
    { id: '2', title: 'NET_GUARD', message: 'Port 22 (SSH) listening on 0.0.0.0', timestamp: Date.now() - 1800000, type: 'info' }
  ]);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper to find node in FS tree and update content (Simple DFS)
  const updateFileContent = (root: FSNode, path: string, content: string): FSNode => {
      const parts = path.split('/').filter(p => p);
      const updateNode = (node: FSNode, currentDepth: number): FSNode => {
          if (currentDepth === parts.length - 1) {
              if (node.children) {
                  // Check if file exists to update, else add new
                  const exists = node.children.find(c => c.name === parts[currentDepth]);
                  if (exists) {
                      return {
                          ...node,
                          children: node.children.map(child => 
                              child.name === parts[currentDepth] ? { ...child, content } : child
                          )
                      };
                  } else {
                      // Create new file
                      const newFile: FSNode = {
                          name: parts[currentDepth],
                          type: 'file',
                          date: new Date().toISOString().split('T')[0],
                          size: '1KB',
                          content: content
                      };
                      return { ...node, children: [...node.children, newFile] };
                  }
              }
              return node;
          }

          if (node.children) {
               const nextDirName = parts[currentDepth];
               const updatedChildren = node.children.map(child => {
                   if (child.name === nextDirName) {
                       return updateNode(child, currentDepth + 1);
                   }
                   return child;
               });
               return { ...node, children: updatedChildren };
          }
          return node;
      };
      
      const pathPartsToUse = parts[0] === 'root' ? parts.slice(1) : parts;
      if (pathPartsToUse.length === 0) return root;
      
      return updateNode(root, 0);
  };

  const handleFileSave = (path: string, content: string) => {
      setFileSystem(prev => updateFileContent(prev, path, content));
      setNotifications(prev => [{
          id: Date.now().toString(),
          title: 'IO_SYS',
          message: `Write successful to ${path.split('/').pop()}`,
          type: 'success',
          timestamp: Date.now()
      }, ...prev]);
  };

  const handleFsCommand = (op: 'mkdir' | 'touch' | 'rm', path: string) => {
      setFileSystem(prev => {
          const clone = JSON.parse(JSON.stringify(prev));
          const parts = path.split('/').filter(p => p);
          
          if (parts.length < 1) return prev;

          const targetName = parts.pop();
          const parentPath = parts;

          if (!targetName) return prev;

          let current: FSNode | undefined = clone;
          if (parentPath.length > 0 && parentPath[0] === 'root') {
               for (let i = 1; i < parentPath.length; i++) {
                   current = current?.children?.find(c => c.name === parentPath[i]);
               }
          } else {
               return prev;
          }

          if (!current || !current.children) return prev;

          if (op === 'rm') {
              current.children = current.children.filter(c => c.name !== targetName);
          } else if (op === 'mkdir') {
              if (!current.children.find(c => c.name === targetName)) {
                  current.children.push({
                      name: targetName,
                      type: 'folder',
                      date: new Date().toISOString().split('T')[0],
                      children: []
                  });
              }
          } else if (op === 'touch') {
               if (!current.children.find(c => c.name === targetName)) {
                  current.children.push({
                      name: targetName,
                      type: 'file',
                      size: '0 B',
                      date: new Date().toISOString().split('T')[0],
                      content: ''
                  });
              }
          }

          return clone;
      });
  };

  const handleShutdown = () => {
      setNotifications(prev => [{
          id: Date.now().toString(),
          title: 'SYSTEM',
          message: 'ACPI Shutdown Signal Sent...',
          type: 'warning',
          timestamp: Date.now()
      }, ...prev]);
      
      setTimeout(() => {
          setIsLoggedIn(false);
          setWindows([]);
          setStartMenuOpen(false);
          setNotificationPanelOpen(false);
          setIsDualMonitor(false);
      }, 1500);
  };

  const toggleDualMonitor = () => {
      const newState = !isDualMonitor;
      setIsDualMonitor(newState);
      
      if (newState) {
          setNotifications(prev => [{
              id: Date.now().toString(),
              title: 'DISPLAY',
              message: 'Secondary Virtual Display Attached (Signal OK).',
              type: 'success',
              timestamp: Date.now()
          }, ...prev]);
      } else {
          const screenWidth = window.innerWidth;
          setWindows(prev => prev.map(w => {
              if (w.x > screenWidth) {
                  return { ...w, x: 50, y: 50 };
              }
              return w;
          }));
          setNotifications(prev => [{
              id: Date.now().toString(),
              title: 'DISPLAY',
              message: 'Secondary Virtual Display Detached.',
              type: 'info',
              timestamp: Date.now()
          }, ...prev]);
      }
  };

  // Background Animation
  useEffect(() => {
    if (!isLoggedIn) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
        canvas.width = isDualMonitor ? window.innerWidth * 2 : window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();

    let width = canvas.width;
    let height = canvas.height;

    const columns = Math.floor(width / 20);
    const drops: number[] = new Array(columns).fill(1);
    
    const chars = "010101001011100101XYZABC";

    const draw = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      ctx.fillStyle = '#0f0'; 
      ctx.font = '14px JetBrains Mono';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() > 0.9 ? 1.0 : 0.3;
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
        
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
        updateCanvasSize();
        width = canvas.width;
        height = canvas.height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isLoggedIn, isDualMonitor]);

  const openWindow = useCallback((appId: AppId, props?: any) => {
    const app = APPS.find(a => a.id === appId);
    if (!app) return;

    const newWindowId = `${appId}-${Date.now()}`;
    const offset = windows.length * 30; 
    
    const newWindow: WindowState = {
      id: newWindowId,
      appId: app.id,
      title: app.title,
      x: 50 + (offset % 200),
      y: 50 + (offset % 200),
      width: app.defaultWidth,
      height: app.defaultHeight,
      zIndex: nextZIndex,
      isMinimized: false,
      isMaximized: false,
      props: props
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
    setActiveWindowId(newWindowId);
    setStartMenuOpen(false);
    setNotificationPanelOpen(false);
  }, [windows.length, nextZIndex]);

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    if (activeWindowId === id) return;
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(prev => prev + 1);
  };

  const toggleMinimize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
    const win = windows.find(w => w.id === id);
    if (win && win.isMinimized) focusWindow(id);
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
     if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'CANVAS') {
         setStartMenuOpen(false);
         setNotificationPanelOpen(false);
     }
  };

  const handleOpenFile = (path: string, content: string) => {
    const fileName = path.split('/').pop() || "";
    const isGeneratedMalware = fileName.startsWith('ransomware') || fileName.startsWith('trojan') || fileName.startsWith('worm');
    
    if ((path.includes('v$$') || isGeneratedMalware) && (fileName.endsWith('.exe') || fileName.endsWith('.vbs'))) {
        openWindow('virus_runner', { filePath: path });
        return;
    }

    if (fileName.endsWith('.pdf') || fileName.endsWith('.man')) {
        openWindow('doc_viewer', { filePath: path, initialContent: content });
        return;
    }

    if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) {
        openWindow('image_viewer', { filePath: path, initialContent: content });
        return;
    }

    if (path.endsWith('.exe')) {
      if (path.includes('hasher')) {
        openWindow('hasher');
      } else if (path.includes('john')) {
        openWindow('john');
      } else if (path.includes('hashcat')) {
        openWindow('hashcat');
      } else {
         setNotifications(prev => [{
          id: Date.now().toString(),
          title: 'EXEC_FAIL',
          message: `Unknown executable format: ${fileName}`,
          type: 'error',
          timestamp: Date.now()
         }, ...prev]);
      }
    } else if (path.endsWith('.sh')) {
        let cmd = "sh " + fileName;
        if (path.includes('hydra')) {
            openWindow('cracker', { initialTargetIp: '10.0.0.5', initialUsername: 'admin' });
            return;
        }
        if (path.includes('nmap')) cmd = "nmap -sV -p- 192.168.1.1";
        else if (path.includes('sql')) cmd = "sqlmap -u http://target.com/id=1 --batch --dbs";
        else if (path.includes('msf')) cmd = "msfconsole";
        else if (path.includes('wifi')) cmd = "aircrack-ng -w rockyou.txt capture.cap";
        else if (path.includes('payload')) cmd = "./payload_generator.sh";
        else if (path.includes('ip_gen')) cmd = "./ip_gen.sh";
        else if (path.includes('worm') || path.includes('deploy')) {
            openWindow('router_exploit');
            return;
        }
        
        openWindow('gemini', { initialCommand: cmd });
    } else {
      openWindow('notepad', { initialContent: content, filePath: path });
    }
  };

  const launchApp = (appId: string, props?: any) => {
      openWindow(appId as AppId, props);
  };

  if (!isLoggedIn) {
      return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div 
        className="w-screen h-screen overflow-x-auto overflow-y-hidden relative bg-black selection:bg-green-500/30 hide-scrollbar"
        onClick={handleDesktopClick}
    >
      <div 
        className="h-full relative transition-all duration-300 ease-in-out" 
        style={{ width: isDualMonitor ? '200vw' : '100vw' }}
      >
          {/* Background */}
          <div 
            className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none"
            style={{ 
                backgroundImage: 'radial-gradient(circle at center, rgba(0,20,0,0.5) 0%, #000 70%)' 
            }}
          >
              <img 
                src="https://www.kali.org/images/kali-dragon-icon.svg" 
                alt="Kali Dragon" 
                className="w-[40%] h-[40%] object-contain opacity-50 drop-shadow-[0_0_20px_rgba(50,50,50,0.5)] grayscale brightness-75 contrast-125"
              />
          </div>

          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

          {isDualMonitor && (
              <div className="absolute left-1/2 top-0 bottom-8 w-[2px] bg-green-900/50 z-0 border-r border-dashed border-green-500/20">
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 bg-black border border-green-500 text-[10px] text-green-500 px-1 py-2 font-mono writing-vertical-rl rotate-180">
                      DISPLAY_BRIDGE_LINK
                  </div>
              </div>
          )}

          {isDualMonitor && (
              <div className="absolute top-0 right-0 w-[50%] h-full pointer-events-none border-l border-green-500/20 bg-green-900/5 flex items-center justify-center">
                   <div className="text-green-900/10 font-bold text-9xl tracking-widest select-none">DISPLAY:2</div>
              </div>
          )}

          {/* Desktop Icons */}
          <div className="absolute top-4 left-4 flex flex-col flex-wrap h-[90%] content-start gap-6 pointer-events-none z-10">
             {APPS.map(app => (
                 <button 
                    key={app.id}
                    onDoubleClick={() => openWindow(app.id)}
                    className="group pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 border border-transparent hover:border-green-500/30 hover:bg-green-900/10 transition-all focus:bg-green-900/20 focus:border-green-500/50 focus:outline-none rounded-sm"
                 >
                     <div className="text-green-600 group-hover:text-green-400 group-focus:text-green-400 transition-colors drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                        <app.icon size={32} strokeWidth={1.5} />
                     </div>
                     <span className="text-green-600 font-mono text-[10px] font-bold tracking-wide text-center group-hover:text-white bg-black/70 px-1 rounded-sm">{app.title}</span>
                 </button>
             ))}

             <button 
                onDoubleClick={() => openWindow('notepad', { initialContent: DESKTOP_HASH_CONTENT, filePath: '~/Desktop/shadow_hashes.txt' })}
                className="group pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 border border-transparent hover:border-green-500/30 hover:bg-green-900/10 transition-all focus:bg-green-900/20 focus:border-green-500/50 focus:outline-none rounded-sm"
             >
                 <div className="text-red-600 group-hover:text-red-400 transition-colors drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]">
                    <Lock size={32} strokeWidth={1.5} />
                 </div>
                 <span className="text-red-500 font-mono text-[10px] font-bold tracking-wide text-center group-hover:text-white bg-black/70 px-1 rounded-sm">shadow_hashes</span>
             </button>

             {/* Scripts */}
             <button onDoubleClick={() => handleOpenFile('ip_gen.sh', '')} className="group pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 border border-transparent hover:border-green-500/30 hover:bg-green-900/10 transition-all focus:bg-green-900/20 focus:border-green-500/50 focus:outline-none rounded-sm">
                 <div className="text-orange-500 group-hover:text-orange-400 transition-colors drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]"><FileCode size={32} strokeWidth={1.5} /></div>
                 <span className="text-orange-500 font-mono text-[10px] font-bold tracking-wide text-center group-hover:text-white bg-black/70 px-1 rounded-sm">ip_gen.sh</span>
             </button>
             <button onDoubleClick={() => handleOpenFile('nmap_scan.sh', '')} className="group pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 border border-transparent hover:border-green-500/30 hover:bg-green-900/10 transition-all focus:bg-green-900/20 focus:border-green-500/50 focus:outline-none rounded-sm">
                 <div className="text-blue-500 group-hover:text-blue-400 transition-colors drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"><FileCode size={32} strokeWidth={1.5} /></div>
                 <span className="text-blue-500 font-mono text-[10px] font-bold tracking-wide text-center group-hover:text-white bg-black/70 px-1 rounded-sm">nmap_scan.sh</span>
             </button>
             <button onDoubleClick={() => handleOpenFile('hydra_brute.sh', '')} className="group pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 border border-transparent hover:border-green-500/30 hover:bg-green-900/10 transition-all focus:bg-green-900/20 focus:border-green-500/50 focus:outline-none rounded-sm">
                 <div className="text-purple-500 group-hover:text-purple-400 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]"><FileCode size={32} strokeWidth={1.5} /></div>
                 <span className="text-purple-500 font-mono text-[10px] font-bold tracking-wide text-center group-hover:text-white bg-black/70 px-1 rounded-sm">hydra_brute.sh</span>
             </button>
             <button onDoubleClick={() => handleOpenFile('sql_inject.sh', '')} className="group pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 border border-transparent hover:border-green-500/30 hover:bg-green-900/10 transition-all focus:bg-green-900/20 focus:border-green-500/50 focus:outline-none rounded-sm">
                 <div className="text-yellow-500 group-hover:text-yellow-400 transition-colors drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]"><Database size={32} strokeWidth={1.5} /></div>
                 <span className="text-yellow-500 font-mono text-[10px] font-bold tracking-wide text-center group-hover:text-white bg-black/70 px-1 rounded-sm">sql_inject.sh</span>
             </button>
             <button onDoubleClick={() => handleOpenFile('msf_start.sh', '')} className="group pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 border border-transparent hover:border-green-500/30 hover:bg-green-900/10 transition-all focus:bg-green-900/20 focus:border-green-500/50 focus:outline-none rounded-sm">
                 <div className="text-red-500 group-hover:text-red-400 transition-colors drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]"><Flame size={32} strokeWidth={1.5} /></div>
                 <span className="text-red-500 font-mono text-[10px] font-bold tracking-wide text-center group-hover:text-white bg-black/70 px-1 rounded-sm">msf_start.sh</span>
             </button>
             <button onDoubleClick={() => handleOpenFile('wifi_crack.sh', '')} className="group pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 border border-transparent hover:border-green-500/30 hover:bg-green-900/10 transition-all focus:bg-green-900/20 focus:border-green-500/50 focus:outline-none rounded-sm">
                 <div className="text-cyan-500 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"><Wifi size={32} strokeWidth={1.5} /></div>
                 <span className="text-cyan-500 font-mono text-[10px] font-bold tracking-wide text-center group-hover:text-white bg-black/70 px-1 rounded-sm">wifi_crack.sh</span>
             </button>
             <button onDoubleClick={() => handleOpenFile('worm_deploy.sh', '')} className="group pointer-events-auto flex flex-col items-center gap-1 w-24 p-2 border border-transparent hover:border-green-500/30 hover:bg-green-900/10 transition-all focus:bg-green-900/20 focus:border-green-500/50 focus:outline-none rounded-sm">
                 <div className="text-red-600 group-hover:text-red-500 transition-colors drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]"><Router size={32} strokeWidth={1.5} /></div>
                 <span className="text-red-500 font-mono text-[10px] font-bold tracking-wide text-center group-hover:text-white bg-black/70 px-1 rounded-sm">worm_deploy.sh</span>
             </button>
          </div>

          {/* Windows */}
          {windows.map(win => {
            const app = APPS.find(a => a.id === win.appId);
            if (!app) return null;
            const AppComp = app.component;

            return (
              <Window
                key={win.id}
                windowState={win}
                isActive={activeWindowId === win.id}
                onClose={closeWindow}
                onMinimize={toggleMinimize}
                onMaximize={toggleMaximize}
                onFocus={focusWindow}
                onMove={moveWindow}
                isDualMonitor={isDualMonitor}
              >
                <AppComp 
                    windowId={win.id} 
                    fileSystem={fileSystem}
                    onOpenFile={handleOpenFile}
                    initialContent={win.props?.initialContent}
                    filePath={win.props?.filePath}
                    initialCommand={win.props?.initialCommand}
                    initialTargetIp={win.props?.initialTargetIp}
                    initialUsername={win.props?.initialUsername}
                    onSave={handleFileSave}
                    onFsInteraction={handleFsCommand}
                    windows={windows} // For ProcessManager
                    onKill={closeWindow} // For ProcessManager
                    onLaunchApp={launchApp} // Allow apps to spawn other apps (The "Live" feature)
                    onShutdown={handleShutdown}
                />
              </Window>
            );
          })}
      </div>

      <StartMenu 
        isOpen={startMenuOpen} 
        apps={APPS}
        onAppClick={openWindow}
        onClose={() => setStartMenuOpen(false)}
        onShutdown={handleShutdown}
      />

      <NotificationPanel 
        isOpen={notificationPanelOpen}
        notifications={notifications}
        onClose={() => setNotificationPanelOpen(false)}
        onClear={() => setNotifications([])}
      />

      <Taskbar
        apps={APPS}
        openWindowIds={windows.map(w => w.id)}
        activeWindowId={activeWindowId}
        onAppClick={(appId) => {
            const existing = windows.filter(w => w.appId === appId).sort((a,b) => b.zIndex - a.zIndex)[0];
            if (existing) {
                if (existing.isMinimized) toggleMinimize(existing.id);
                focusWindow(existing.id);
            } else {
                openWindow(appId as AppId);
            }
        }}
        onStartClick={() => {
            setStartMenuOpen(!startMenuOpen);
            setNotificationPanelOpen(false);
        }}
        isStartOpen={startMenuOpen}
        onToggleNotifications={() => {
            setNotificationPanelOpen(!notificationPanelOpen);
            setStartMenuOpen(false);
        }}
        notificationCount={notifications.length}
        isDualMonitor={isDualMonitor}
        onToggleDualMonitor={toggleDualMonitor}
      />
    </div>
  );
}