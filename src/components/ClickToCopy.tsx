import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
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

    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        "ml-2 opacity-0 group-hover/copy:opacity-100 transition-opacity shrink-0",
        copied && "opacity-100"
      )}>
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/20" />}
      </span>
    </span>
  );
};
