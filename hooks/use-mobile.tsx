"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  // Initialize with desktop to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Set initial values
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    // Check on mount
    checkDevice()

    // Add listener for resize
    window.addEventListener("resize", checkDevice)

    // Clean up
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop: isClient && !isMobile && !isTablet,
    isClient,
  }
}
