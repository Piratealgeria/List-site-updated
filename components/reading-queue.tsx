"use client"

import { useState, useEffect } from "react"
import { BookOpen, Trash2, Clock, WifiOff, Download, Check } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface ReadingQueueItem {
  url: string
  title: string
  excerpt: string
  timestamp: number
  added: string
}

interface ReadingQueueProps {
  isDarkMode: boolean
}

export default function ReadingQueue({ isDarkMode }: ReadingQueueProps) {
  const [queue, setQueue] = useState<ReadingQueueItem[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Load reading queue
    loadReadingQueue()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadReadingQueue = async () => {
    setIsLoading(true)

    try {
      // Check if service worker is active
      if ("caches" in window) {
        const cache = await caches.open("mrcherif-reading-queue-v1.1.0")
        const keys = await cache.keys()

        const queueItems: ReadingQueueItem[] = []

        for (const key of keys) {
          if (key.url.includes("reading-queue-")) {
            const response = await cache.match(key)
            if (response) {
              const data = await response.json()
              queueItems.push(data)
            }
          }
        }

        // Sort by added date (newest first)
        queueItems.sort((a, b) => new Date(b.added).getTime() - new Date(a.added).getTime())
        setQueue(queueItems)
      }
    } catch (error) {
      console.error("Error loading reading queue:", error)
    }

    setIsLoading(false)
  }

  const addToReadingQueue = (article: { url: string; title: string; excerpt: string }) => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const timestamp = Date.now()

      navigator.serviceWorker.controller.postMessage({
        type: "ADD_TO_READING_QUEUE",
        url: article.url,
        title: article.title,
        excerpt: article.excerpt,
        timestamp,
      })

      // Optimistically update UI
      setQueue((prev) => [
        {
          ...article,
          timestamp,
          added: new Date().toISOString(),
        },
        ...prev,
      ])
    }
  }

  const removeFromReadingQueue = (timestamp: number) => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "REMOVE_FROM_READING_QUEUE",
        timestamp,
      })

      // Update UI
      setQueue((prev) => prev.filter((item) => item.timestamp !== timestamp))
    }
  }

  if (isLoading) {
    return (
      <div className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border p-4 my-6`}>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-yellow-500" />
          <h3 className={`font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>Reading Queue</h3>
        </div>
        <div className="flex justify-center py-4">
          <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border p-4 my-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-yellow-500" />
          <h3 className={`font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>Reading Queue</h3>
        </div>

        <div className="flex items-center gap-1 text-xs">
          {isOnline ? (
            <span className="text-green-500 flex items-center gap-1">
              <Check className="h-3 w-3" /> Online
            </span>
          ) : (
            <span className="text-yellow-500 flex items-center gap-1">
              <WifiOff className="h-3 w-3" /> Offline
            </span>
          )}
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">
          <p>Your reading queue is empty.</p>
          <p className="mt-2 text-xs">Save articles to read later, even when offline.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => (
            <div
              key={item.timestamp}
              className={`${isDarkMode ? "bg-[#121212] border-gray-700" : "bg-gray-100 border-gray-300"} border p-3 rounded`}
            >
              <div className="flex justify-between items-start">
                <Link
                  href={item.url}
                  className={`font-bold text-sm mb-1 hover:underline ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}
                >
                  {item.title}
                </Link>

                <button
                  onClick={() => removeFromReadingQueue(item.timestamp)}
                  className={`p-1 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"} rounded`}
                  aria-label="Remove from reading queue"
                >
                  <Trash2 className="h-3 w-3 text-gray-500" />
                </button>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.excerpt}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Added {format(new Date(item.added), "MMM d, yyyy")}</span>
                </div>

                <Link
                  href={item.url}
                  className={`flex items-center gap-1 ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                >
                  <span>Read</span>
                  {!isOnline && <Download className="h-3 w-3" />}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
