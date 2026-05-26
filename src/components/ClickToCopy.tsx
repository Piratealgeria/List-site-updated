import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

export const ClickToCopy = ({ text, children, className }: { text: string, children: React.ReactNode, className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    // If clicking a link, don't copy
    if ((e.target as HTMLElement).closest('a')) return;
    
    e.stopPropagation();
    if (!text) return;
    
    // Clean text: remove leading/trailing whitespace and multiple spaces
    const cleanText = text.trim();
    if (!cleanText) return;

    navigator.clipboard.writeText(cleanText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <span 
      onClick={handleCopy}
      className={cn(
        "cursor-pointer transition-colors relative group/copy inline-flex items-center w-full break-words", 
        className
      )}
    >
      <span className="flex-1 break-words">{children}</span>
      <span className={cn(
        "relative ml-2 opacity-0 group-hover/copy:opacity-100 transition-opacity shrink-0 flex items-center justify-center",
        copied && "opacity-100"
      )}>
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/20" />}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -10 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-full text-[10px] right-0 font-mono font-bold uppercase tracking-widest text-emerald-400 whitespace-nowrap drop-shadow-md z-[60] pointer-events-none mb-1"
            >
              Copied!
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </span>
  );
};
