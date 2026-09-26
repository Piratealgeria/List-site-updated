import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '../utils';
import { PostMetadata } from '../types';
import { fetchPostContent } from '../api';

export const PostCard = ({ post, index }: { post: PostMetadata; index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Prefetch content when hovering over the card
    fetchPostContent(post.file).catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative h-full"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/post/${post.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
        <motion.div 
          style={{ 
            rotateX: isHovered ? rotateX : 0, 
            rotateY: isHovered ? rotateY : 0,
            transformStyle: "preserve-3d"
          }}
          className="relative h-full aspect-video bg-black border border-white/20 transition-colors duration-300 group-hover:shadow-[8px_8px_0px_#10b981] group-hover:border-emerald-500 overflow-hidden flex flex-col"
        >
          {/* Skeleton / Placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center z-0">
              <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-emerald-500/20" />
            </div>
          )}

          <div className="flex-1 relative w-full h-full min-h-0" style={{ transform: "translateZ(30px)" }}>
            <img
              src={post.thumbnail}
              alt={post.title}
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                setIsLoaded(true);
                const target = e.currentTarget as HTMLImageElement;
                const fallback = `https://picsum.photos/seed/${encodeURIComponent(post.id)}/800/450`;
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out filter md:grayscale md:group-hover:grayscale-0",
                isLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0 scale-110"
              )}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none" />

            <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full z-20" style={{ transform: "translateZ(50px)" }}>
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="inline-block bg-black text-emerald-500 px-2 py-1 text-[10px] font-mono tracking-widest uppercase border border-emerald-500/30 shadow-[2px_2px_0_#10b98140]">
                  {post.id}
                </div>
                {post.tags?.slice(0, 2).map((tag, i) => (
                  <div key={i} className="inline-block bg-white/5 text-white/70 px-2 py-1 text-[10px] font-mono tracking-widest uppercase border border-white/10 backdrop-blur-sm shadow-sm">
                    {tag}
                  </div>
                ))}
              </div>
              <h2 className="text-xl md:text-2xl font-display font-black leading-none uppercase tracking-tighter group-hover:text-emerald-400 transition-colors drop-shadow-md">
                {post.title}
              </h2>
            </div>
            
            <div 
              style={{ transform: "translateZ(40px)" }}
              className="absolute top-0 right-0 bg-emerald-500 text-black px-3 py-1.5 md:px-4 md:py-2 flex items-center font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-y-full group-hover:translate-y-0 z-20"
            >
              OPEN PLAYLIST ►
            </div>
            
            {/* Dynamic highlight reflection */}
            <motion.div 
              className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-300"
              style={{
                backgroundPosition: useTransform(
                  [x, y], 
                  ([latestX, latestY]: [number, number]) => `${latestX * 100}% ${latestY * 100}%`
                ) as any
              }}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
