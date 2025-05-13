"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import type { NewsItem } from "../data/news-items"

interface NewsTickerProps {
  items: NewsItem[]
  speed?: number // pixels per second
  className?: string
  isDarkMode?: boolean
}

export default function NewsTicker({ items, speed = 50, className = "", isDarkMode = true }: NewsTickerProps) {
  const [isPaused, setIsPaused] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const [tickerWidth, setTickerWidth] = useState(0)
  const [position, setPosition] = useState(0)

  // Measure the width of the ticker and content
  useEffect(() => {
    if (tickerRef.current && contentRef.current) {
      const tickerRect = tickerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      setTickerWidth(tickerRect.width)
      setContentWidth(contentRect.width)

      // Start the animation from the right edge
      setPosition(tickerWidth)
    }
  }, [items])

  // Animation loop
  useEffect(() => {
    if (isPaused || contentWidth === 0 || tickerWidth === 0) return

    let animationFrameId: number
    let lastTimestamp: number

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp
      const elapsed = timestamp - lastTimestamp

      // Calculate how far to move based on elapsed time and speed
      const pixelsToMove = (elapsed / 1000) * speed

      // Update position
      setPosition((prevPosition) => {
        // If the content has moved completely off screen to the left
        if (prevPosition < -contentWidth) {
          // Reset to start from the right edge again
          return tickerWidth
        }
        // Otherwise continue moving left
        return prevPosition - pixelsToMove
      })

      lastTimestamp = timestamp
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isPaused, contentWidth, tickerWidth, speed])

  return (
    <div
      ref={tickerRef}
      className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} h-6 overflow-hidden relative font-mono ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={contentRef}
        className="whitespace-nowrap inline-block px-2 text-xs"
        style={{ transform: `translateX(${position}px)` }}
      >
        {items.map((item, index) => (
          <span key={item.id} className="mr-8">
            {item.url ? (
              <Link href={item.url} className={`hover:underline ${isDarkMode ? "text-yellow-400" : "text-blue-600"}`}>
                {item.text}
              </Link>
            ) : (
              <span>{item.text}</span>
            )}
            {index < items.length - 1 && <span className="mx-2 text-gray-500">•</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
