import React, { useState, useEffect } from 'react';
import { Save, Type, FileCode } from 'lucide-react';

interface NotepadProps {
  initialContent?: string;
  filePath?: string;
  onSave?: (path: string, content: string) => void;
}

export const Notepad: React.FC<NotepadProps> = ({ initialContent, filePath, onSave }) => {
  const [text, setText] = useState(initialContent || "// Buffer empty...");
  const [isDirty, setIsDirty] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Update text if initialContent changes (e.g. reopening window)
  useEffect(() => {
    if (initialContent) setText(initialContent);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (filePath && onSave) {
        onSave(filePath, text);
        setIsDirty(false);
        setStatusMsg("WROTE " + text.length + "L");
        setTimeout(() => setStatusMsg(""), 2000);
    } else {
        setStatusMsg("NO_WRITE_PERM");
        setTimeout(() => setStatusMsg(""), 2000);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#050505] text-green-400 font-mono">
      {/* Vim-like Status Bar Top */}
      <div className="flex gap-4 px-2 py-1 bg-[#111] text-[10px] text-green-600 border-b border-green-900/30 uppercase tracking-wider items-center">
        <div className="flex items-center gap-2">
            <FileCode size={12} />
            <span className="text-green-500">{filePath ? filePath : '[NO_NAME]'}</span>
            {isDirty && <span className="text-yellow-500">[+]</span>}
        </div>
        <div className="ml-auto flex gap-2">
            <button onClick={handleSave} className="hover:text-white flex items-center gap-1 hover:bg-green-900/30 px-2 rounded">
                <Save size={10} /> WRITE
            </button>
        </div>
      </div>

      <textarea
        className="flex-1 w-full h-full bg-[#050505] text-green-400 p-4 resize-none focus:outline-none font-mono text-sm selection:bg-green-500 selection:text-black leading-relaxed"
        value={text}
        onChange={handleChange}
        spellCheck={false}
      />

      {/* Vim-like Status Bar Bottom */}
      <div className="px-2 py-1 bg-[#111] border-t border-green-900/30 text-[10px] text-green-600 flex justify-between font-mono">
         <div className="flex gap-4">
            <span className="font-bold text-green-500">NORMAL</span>
            <span>{statusMsg || "VISUAL BLOCK"}</span>
         </div>
         <div className="flex gap-4">
            <span>utf-8</span>
            <span>{text.split('\n').length}L, {text.length}C</span>
         </div>
      </div>
    </div>
  );
};