import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Volume1, ListMusic } from 'lucide-react';
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
  
  const Player = ReactPlayer as any;
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
  
  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    // Note: cast is safe here as this event comes from the slider input
    const fraction = parseFloat((e.target as HTMLInputElement).value);
    if (playerRef.current) {
      playerRef.current.currentTime = fraction * duration;
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
  const title = "Ambient Synth / Relaxing Track";
  const artist = "Background Music";

  return (
    <>
      {/* Hidden Player */}
      <Player
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
            setPlayed(duration > 0 ? e.target.currentTime / duration : 0);
          }
        }}
        style={{ display: 'none' }}
      />

      {/* Fixed Bottom Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 h-24 px-4 md:px-6 flex items-center justify-between shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
        
        {/* Left: Track Info */}
        <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
          <div className="relative group w-14 h-14 bg-white/5 border border-white/10 shrink-0 overflow-hidden shadow-[2px_2px_0_#10b981]">
            <img 
              src={thumbnailUrl} 
              alt="Track Artwork" 
              className={cn(
                "w-full h-full object-cover transition-all duration-700",
                isPlaying ? "" : "grayscale"
              )}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-mono text-sm uppercase tracking-wider font-bold truncate hover:text-emerald-400 cursor-pointer transition-colors">
              {title}
            </span>
            <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest mt-1 truncate">
              {artist}
            </span>
          </div>
        </div>

        {/* Center: Playback Controls & Progress */}
        <div className="flex flex-col items-center justify-center max-w-[500px] w-full px-4 gap-2">
          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handleRestart}
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Restart song"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              disabled={!ready}
              className="w-10 h-10 bg-white hover:bg-emerald-400 hover:scale-105 active:scale-95 text-black flex items-center justify-center rounded-full transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-white"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-[2px]" />
              )}
            </button>
            <button
              className="text-white/40 hover:text-white transition-colors opacity-50 cursor-not-allowed"
              aria-label="Playlist disabled"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center w-full gap-3">
            <span className="text-[10px] font-mono text-white/40 w-10 text-right">
              {formatTime(played * duration)}
            </span>
            <div className="relative flex-1 h-3 flex items-center group">
              {/* Custom input range slider styled */}
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={played}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onContextMenu={e => e.preventDefault()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-1 bg-white/10 overflow-hidden relative rounded-full">
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-white group-hover:bg-emerald-400 transition-colors"
                  style={{ width: `${played * 100}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] font-mono text-white/40 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume & Extras */}
        <div className="hidden md:flex items-center justify-end w-1/3 gap-3 pr-2">
          <button 
            onClick={toggleMute}
            className="text-white/40 hover:text-white transition-colors"
          >
            <VolumeIcon className="w-4 h-4" />
          </button>
          <div className="relative w-24 h-3 flex items-center group">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-1 bg-white/10 overflow-hidden rounded-full relative">
              <div 
                className="absolute top-0 left-0 bottom-0 bg-white group-hover:bg-emerald-400 transition-colors"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
