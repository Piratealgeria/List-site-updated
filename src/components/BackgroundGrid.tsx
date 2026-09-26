import React, { useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';

export const BackgroundGrid = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <div className="fixed -inset-[4rem] bg-grid-pattern pointer-events-none z-0 opacity-20 mix-blend-screen" />
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.08), transparent 80%)`,
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
    </>
  );
};
