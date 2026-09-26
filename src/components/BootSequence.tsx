import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BOOT_LINES = [
  "INITIALIZING KERNEL...",
  "LOADING CORE MODULES: OK",
  "MOUNTING VIRTUAL FILESYSTEM: OK",
  "ESTABLISHING SECURE CONNECTION...",
  "BYPASSING MAINFRAME ENCRYPTION: DONE",
  "WAKING UP VIKING OS..."
];

export const BootSequence = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let hasBooted = false;
    try {
      hasBooted = Boolean(sessionStorage.getItem('viking_booted'));
    } catch {
      // In private browsing or restricted iframe
      hasBooted = false;
    }

    if (!hasBooted) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      
      let currentLine = 0;
      let dismissTimeout: NodeJS.Timeout | null = null;
      const interval = setInterval(() => {
        if (currentLine < BOOT_LINES.length) {
          setLines(prev => [...prev, BOOT_LINES[currentLine]]);
          currentLine++;
        } else {
          clearInterval(interval);
          dismissTimeout = setTimeout(() => {
            setIsVisible(false);
            try {
              sessionStorage.setItem('viking_booted', 'true');
            } catch {
              // Ignore storage errors
            }
            document.body.style.overflow = 'auto';
          }, 600);
        }
      }, 150); // fast typing effect

      return () => {
        clearInterval(interval);
        if (dismissTimeout) clearTimeout(dismissTimeout);
        document.body.style.overflow = 'auto';
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] bg-[#030303] flex items-center justify-center p-8 pointer-events-none"
        >
          <div className="w-full max-w-2xl text-emerald-400 font-mono text-sm sm:text-base leading-relaxed flex flex-col items-start justify-center h-full">
            <div className="w-full border border-emerald-500/20 bg-black/50 p-6 rounded-sm shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent animate-scan" />
              
              <div className="flex gap-2 items-center mb-6 pb-4 border-b border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs uppercase tracking-[0.2em] opacity-50">Viking Terminal v2.1.4</span>
              </div>
              
              <div className="space-y-2 min-h-[160px]">
                {lines.map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex"
                  >
                    <span className="opacity-50 mr-4">[{new Date().toISOString().substring(11, 19)}]</span>
                    <span>{line}</span>
                  </motion.div>
                ))}
                {lines.length < BOOT_LINES.length && (
                  <motion.div 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-3 h-5 bg-emerald-400 inline-block mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
