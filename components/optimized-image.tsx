"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  loading?: "eager" | "lazy"
  quality?: number
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 450,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px",
  loading = "lazy",
  quality = 75,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set up intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.01,
      },
    )

    if (imageRef.current && !priority) {
      observer.observe(imageRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  // Handle missing or placeholder images
  if (!src || src.includes("/placeholder.svg")) {
    return (
      <div
        ref={imageRef}
        className={`${className} bg-gray-200 dark:bg-gray-800 flex items-center justify-center`}
        style={{ aspectRatio: `${width}/${height}` }}
        role="img"
        aria-label={alt || "Placeholder image"}
      >
        <span className="text-gray-400 dark:text-gray-600 text-sm">{alt || "Image"}</span>
      </div>
    )
  }

  // Check if the image is an external URL
  const isExternal = src.startsWith("http") || src.startsWith("//")

  return (
    <div
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {(priority || isVisible) && (
        <>
          {isLoading && <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />}

          {isExternal ? (
            <img
              src={src || "/placeholder.svg"}
              alt={alt}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isLoading ? "scale-105 blur-sm" : "scale-100 blur-0"
              }`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
                setError(true)
              }}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={width}
              height={height}
              quality={quality}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isLoading ? "scale-105 blur-sm" : "scale-100 blur-0"
              }`}
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
                setError(true)
              }}
              priority={priority}
              loading={loading}
              sizes={sizes}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><filter id="b" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="20"/></filter><rect width="100%" height="100%" fill="#aaaaaa"/></svg>`,
              ).toString("base64")}`}
            />
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
              <span className="text-red-500 text-sm">Failed to load image</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
