import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Volume1, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [ready, setReady] = useState(false);
  
  // Progress states
  const [played, setPlayed] = useState(0);       // Range 0 - 1
  const [duration, setDuration] = useState(0);   // In seconds
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };
    window.addEventListener('toggle-music-player', handleToggle);
    return () => window.removeEventListener('toggle-music-player', handleToggle);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [isOpen]);
  
  const playerRef = useRef<any>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  
  const handleRestart = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
    }
    if (!isPlaying) setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    if (parseFloat(e.target.value) > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fraction = parseFloat(e.target.value);
    setPlayed(fraction);
  };
  
  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    // Note: cast is safe here as this event comes from the slider input
    const fraction = parseFloat((e.target as HTMLInputElement).value);
    if (playerRef.current) {
      if (typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(fraction, 'fraction');
      } else {
        playerRef.current.currentTime = fraction * duration;
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const VolumeIcon = isMuted || volume === 0 
    ? VolumeX 
    : volume < 0.5 
      ? Volume1 
      : Volume2;

  // The youtube thumbnail
  const thumbnailUrl = "https://img.youtube.com/vi/qtp0qyvCC9A/maxresdefault.jpg";
  const title = "Peace and Tranquility";
  const artist = "VA Outro";

  return (
    <>
      {/* Hidden Player */}
      <ReactPlayer
        ref={playerRef}
        src="https://youtu.be/qtp0qyvCC9A"
        playing={isPlaying}
        volume={volume}
        muted={isMuted}
        loop={true}
        width="0"
        height="0"
        onReady={() => setReady(true)}
        onDurationChange={(e: any) => {
          if (e.target && e.target.duration) {
            setDuration(e.target.duration);
          }
        }}
        onTimeUpdate={(e: any) => {
          if (e.target && e.target.currentTime) {
            const current = e.target.currentTime;
            const currentDuration = e.target.duration || duration;
            if (currentDuration > 0) {
              setPlayed(current / currentDuration);
            }
          }
        }}
        style={{ display: 'none' }}
        config={({
          youtube: {
            playerVars: { 
              autoplay: 0, 
              controls: 0,
              modestbranding: 1
            }
          }
        }) as any}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[460px] z-[100]"
          >
            <div className="bg-black/95 backdrop-blur-2xl border border-white/10 p-4 md:p-5 flex flex-col gap-4 relative group shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-xl md:rounded-2xl">
              
              {/* Decorative Glow */}
              {isPlaying && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none animate-pulse" />
              )}
              
              {/* Top Row: Art, Titles, Controls */}
              <div className="flex items-center gap-3 md:gap-4 relative z-10 w-full">
                
                {/* Vinyl Record Artwork */}
                <div className={cn(
                  "relative w-12 h-12 md:w-16 md:h-16 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
                  isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
                )}>
                  <img 
                    src={thumbnailUrl} 
                    alt="Track Artwork" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay rounded-full" />
                  {/* Record Center Hole */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-black rounded-full border border-white/20 shadow-inner flex items-center justify-center">
                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                  </div>
                </div>
                
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                  <span className="text-white font-display uppercase font-bold text-sm md:text-base truncate tracking-tight pr-4">
                    {title}
                  </span>
                  <span className="text-emerald-500 font-mono text-[10px] md:text-xs uppercase tracking-widest mt-0.5 truncate">
                    {artist}
                  </span>
                </div>

                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                  <button
                    onClick={handleRestart}
                    className="w-8 h-8 hidden md:flex items-center justify-center text-white/40 hover:text-emerald-400 transition-colors"
                    aria-label="Restart song"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    disabled={!ready}
                    className="w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-emerald-400 border border-transparent hover:border-emerald-300 text-black rounded-full flex items-center justify-center transition-all disabled:opacity-50 shadow-md group/play ml-1 md:ml-0"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 md:w-5 md:h-5 fill-current translate-x-[2px]" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsPlaying(false);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors shrink-0 ml-1 md:ml-2"
                    aria-label="Close music player"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Bottom Row: Progress & Volume */}
              <div className="flex items-center gap-3 relative z-10 w-full">
                
                {/* Progress */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-white/40 w-8 md:w-10 text-right shrink-0">
                    {formatTime(played * duration)}
                  </span>
                  <div className="relative h-1.5 md:h-2 w-full flex items-center group/slider cursor-pointer flex-1 rounded-full">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step="any"
                      value={played}
                      onChange={handleSeekChange}
                      onMouseUp={handleSeekMouseUp}
                      onTouchEnd={handleSeekMouseUp}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-full bg-white/10 overflow-hidden relative rounded-full">
                      <div 
                        className="absolute top-0 left-0 bottom-0 bg-emerald-500 group-hover/slider:bg-emerald-400 transition-colors rounded-full"
                        style={{ width: `${played * 100}%` }}
                      >
                        {/* Playhead thumb */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full shadow-sm opacity-0 group-hover/slider:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-white/40 w-8 md:w-10 shrink-0">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Volume Divider */}
                <div className="hidden md:block w-px h-3 bg-white/20 mx-1" />

                {/* Volume */}
                <div className="hidden md:flex items-center gap-2 group/vol w-24 shrink-0">
                  <button
                    onClick={toggleMute}
                    className="flex items-center justify-center text-white/40 hover:text-white transition-colors shrink-0"
                  >
                    <VolumeIcon className="w-3 h-3" />
                  </button>
                  <div className="relative flex-1 h-1 flex items-center opacity-50 group-hover/vol:opacity-100 transition-opacity rounded-full">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-full bg-white/10 overflow-hidden relative rounded-full">
                      <div 
                        className="absolute top-0 left-0 bottom-0 bg-white transition-colors rounded-full"
                        style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
