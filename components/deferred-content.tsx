"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface DeferredContentProps {
  children: React.ReactNode
  delay?: number
  placeholder?: React.ReactNode
}

export function DeferredContent({ children, delay = 0, placeholder }: DeferredContentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set up intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // When element is visible, start the delay timer
          setTimeout(() => {
            setIsVisible(true)
            observer.disconnect()
          }, delay)
        }
      },
      {
        rootMargin: "200px", // Load when within 200px of viewport
        threshold: 0.01,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  // After the element becomes visible, render the actual content
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
    }
  }, [isVisible])

  return (
    <div ref={ref} className="transition-opacity duration-300" style={{ opacity: shouldRender ? 1 : 0 }}>
      {shouldRender ? children : placeholder || <div className="h-64 bg-gray-800 animate-pulse rounded-md"></div>}
    </div>
  )
}
