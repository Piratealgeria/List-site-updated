import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../utils';
import { PostMetadata } from '../types';

export const PostCard = ({ post, index }: { post: PostMetadata; index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative h-full"
    >
      <Link to={`/post/${post.id}`} className="block h-full">
        <div className="relative h-full aspect-video bg-black border border-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[8px_8px_0px_#10b981] group-hover:border-emerald-500 overflow-hidden flex flex-col">
          {/* Skeleton / Placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center z-0">
              <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-emerald-500/20" />
            </div>
          )}

          <div className="flex-1 relative w-full h-full min-h-0">
            <img
              src={post.thumbnail}
              alt={post.title}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out filter md:grayscale md:group-hover:grayscale-0",
                isLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0 scale-110"
              )}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none" />

            <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full z-20">
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="inline-block bg-black text-emerald-500 px-2 py-1 text-[10px] font-mono tracking-widest uppercase border border-emerald-500/30">
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
            
            <div className="absolute top-0 right-0 bg-emerald-500 text-black px-3 py-1.5 md:px-4 md:py-2 flex items-center font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform -translate-y-full group-hover:translate-y-0 z-20">
              OPEN PLAYLIST ►
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
