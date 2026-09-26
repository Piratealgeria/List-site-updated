import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor = () => {
  const [isDesktop, setIsDesktop] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false
  );
  const [isWindowHovered, setIsWindowHovered] = useState(true);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsDesktop(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    const updateCursor = (e: MouseEvent) => {
      setIsWindowHovered(true);
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
      
      const target = e.target as Element | null;
      let isClickable = false;
      if (target && target.nodeType === Node.ELEMENT_NODE) {
        try {
          const isButtonOrLink = Boolean(target.closest('a, button, [role="button"], input, select, textarea, label, [tabindex="0"]'));
          const computedCursor = window.getComputedStyle(target)?.cursor;
          isClickable = isButtonOrLink || computedCursor === 'pointer';
        } catch {
          // Graceful fallback
        }
      }
      setIsHovering(isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsWindowHovered(false);
    const handleMouseEnter = () => setIsWindowHovered(true);

    if (mediaQuery.matches) {
      window.addEventListener('mousemove', updateCursor);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleMouseEnter);
      
      // Hide default cursor on body if we are using custom, but keep text cursor for inputs
      document.body.style.cursor = 'none';
      
      const style = document.createElement('style');
      style.id = 'hide-default-cursor';
      style.innerHTML = `
        a, button, [role="button"], label, * {
          cursor: none !important;
        }
        input, textarea, [contenteditable="true"] {
          cursor: text !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = 'auto';
      const style = document.getElementById('hide-default-cursor');
      if (style) style.remove();
    };
  }, [cursorX, cursorY]);

  if (!isDesktop) return null;

  return (
    <div style={{ opacity: isWindowHovered ? 1 : 0, transition: 'opacity 0.2s ease-out' }}>
      {/* Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-[4px] h-[4px] bg-emerald-400 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: 8,
          translateY: 8
        }}
      />
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-5 h-5 border border-emerald-500/50 rounded-sm pointer-events-none z-[9998] flex items-center justify-center mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isClicking ? 0.8 : (isHovering ? 1.5 : 1),
          rotate: isHovering ? 45 : 0,
          borderColor: isHovering ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.4)',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isHovering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-1 h-1 bg-emerald-500/30 rounded-full"
          />
        )}
      </motion.div>
    </div>
  );
};
