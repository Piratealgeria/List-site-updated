"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface SparklineProps {
  data1?: number[]
  data2?: number[]
  width?: number
  height?: number
  color1?: string
  color2?: string
}

export function Sparkline({
  data1 = [0, 1, 0.5, 0.7, 0.9, 0.8, 1, 0.5],
  data2 = [0.5, 0.6, 0.4, 0.7, 0.5, 0.8, 0.6, 0.7],
  width = 80,
  height = 20,
  color1 = "#666666",
  color2 = "#4CAF50",
}: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Memoize the drawing function to avoid unnecessary recalculations
  const drawSparkline = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      data: number[],
      startX: number,
      endX: number,
      color: string,
      canvasHeight: number,
    ) => {
      if (!data || data.length === 0) return

      const xScale = (endX - startX) / (data.length - 1)
      const yMin = Math.min(...data)
      const yMax = Math.max(...data)
      const yRange = yMax - yMin || 1

      // Scale to leave some padding
      const padding = canvasHeight * 0.1
      const yScale = (canvasHeight - 2 * padding) / yRange

      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1

      data.forEach((value, i) => {
        const x = startX + i * xScale
        const y = canvasHeight - padding - (value - yMin) * yScale

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    },
    [],
  )

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set proper scaling for retina displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Set canvas size in CSS pixels
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw first sparkline (gray)
    drawSparkline(ctx, data1, 0, width / 2, color1, height)

    // Draw second sparkline (colored)
    drawSparkline(ctx, data2, width / 2, width, color2, height)
  }, [data1, data2, width, height, color1, color2, drawSparkline])

  // Set up intersection observer for rendering the canvas only when visible
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      // Fallback for browsers without IntersectionObserver
      setIsVisible(true)
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          if (observerRef.current && canvasRef.current) {
            observerRef.current.unobserve(canvasRef.current)
          }
        }
      },
      { threshold: 0.1 },
    )

    if (canvasRef.current) {
      observerRef.current.observe(canvasRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Render the canvas when it becomes visible or when data changes
  useEffect(() => {
    if (isVisible) {
      renderCanvas()
    }
  }, [isVisible, renderCanvas])

  // Clean up and re-render on resize
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        renderCanvas()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isVisible, renderCanvas])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="inline-block"
      aria-label="Sparkline chart"
      role="img"
    />
  )
}
