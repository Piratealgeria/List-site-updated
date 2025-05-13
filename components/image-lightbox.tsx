"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface ImageLightboxProps {
  src: string
  alt: string
  width?: number
  height?: number
}

export default function ImageLightbox({ src, alt, width, height }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { isMobile } = useMobile()

  // Close lightbox when pressing escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <div className="relative group">
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="max-w-full rounded-md cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setIsOpen(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm">Click to enlarge</div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          >
            <X size={24} />
          </button>

          <div className="max-w-[90vw] max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={src || "/placeholder.svg"} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
          </div>

          {isMobile && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
              Pinch to zoom • Tap outside to close
            </div>
          )}
        </div>
      )}
    </>
  )
}
