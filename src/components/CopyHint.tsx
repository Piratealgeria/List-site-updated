import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, X } from 'lucide-react';

export const CopyHint = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem('viking_copy_hint_seen_timestamp');
    const now = Date.now();
    const HOURS_24 = 24 * 60 * 60 * 1000;
    
    if (!lastSeen || now - parseInt(lastSeen, 10) > HOURS_24) {
      // Delay showing the hint a bit so they settle into the page
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      const autoDismiss = setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('viking_copy_hint_seen_timestamp', Date.now().toString());
      }, 8000);
      return () => clearTimeout(autoDismiss);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('viking_copy_hint_seen_timestamp', Date.now().toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] max-w-[300px]"
        >
          <div className="bg-black/90 backdrop-blur-xl border border-white/20 p-4 shadow-[4px_4px_0_rgba(16,185,129,0.3)] flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white text-sm font-mono leading-relaxed">
                <span className="font-bold text-emerald-400 uppercase tracking-widest text-[10px] block mb-1">Efficiency Mode</span>
                Tap any snippet on the list to copy it
              </p>
            </div>
            <button 
              onClick={handleDismiss}
              className="text-white/40 hover:text-white transition-colors shrink-0"
              aria-label="Dismiss hint"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
