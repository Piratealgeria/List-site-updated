"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedAsciiArtProps {
  frames: string[]
  fps?: number
  className?: string
  title?: string
}

export function AnimatedAsciiArt({ frames, fps = 5, className = "", title }: AnimatedAsciiArtProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Start or stop the animation
    if (frames.length <= 1) return

    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    } else {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length)
      }, 1000 / fps)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, frames, fps])

  // If we have only one frame or empty frames, just display it
  if (frames.length <= 1) {
    return (
      <pre className={`text-xs leading-tight font-mono ${className}`} title={title}>
        {frames[0] || ""}
      </pre>
    )
  }

  return (
    <div className="relative group">
      <pre
        className={`text-xs leading-tight font-mono ${className}`}
        title={title}
        onClick={() => setIsPaused(!isPaused)}
      >
        {frames[currentFrame]}
      </pre>
      <div
        className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? "▶️" : "⏸️"}
      </div>
    </div>
  )
}
