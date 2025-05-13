"use client"

import type React from "react"

import { useEffect, useRef, useCallback } from "react"

interface InfiniteScrollProps {
  loadMore: () => void
  hasMore: boolean
  isLoading: boolean
  loadingComponent?: React.ReactNode
  endMessage?: React.ReactNode
  rootMargin?: string
  threshold?: number
  children: React.ReactNode
}

export function InfiniteScroll({
  loadMore,
  hasMore,
  isLoading,
  loadingComponent = <div>Loading...</div>,
  endMessage = <div>No more items</div>,
  rootMargin = "100px",
  threshold = 0.1,
  children,
}: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return

      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore()
          }
        },
        {
          rootMargin,
          threshold,
        },
      )

      if (node) {
        observerRef.current.observe(node)
      }
    },
    [hasMore, isLoading, loadMore, rootMargin, threshold],
  )

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <div className="infinite-scroll-component">
      {children}

      <div ref={lastElementRef} className="loading-trigger">
        {isLoading && loadingComponent}
        {!isLoading && !hasMore && endMessage}
      </div>
    </div>
  )
}
