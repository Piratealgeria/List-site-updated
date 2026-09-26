import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { copyToClipboard } from '../utils';

export const CopyLinkButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const success = await copyToClipboard(targetUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={handleCopy}
        className="p-3 bg-black border border-white/20 hover:border-emerald-500 hover:shadow-[4px_4px_0_#10b981] transition-all flex items-center justify-center group"
        aria-label={copied ? "Link copied to clipboard" : "Copy link to clipboard"}
      >
        {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />}
      </button>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 whitespace-nowrap drop-shadow-md z-50 pointer-events-none mt-1"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
