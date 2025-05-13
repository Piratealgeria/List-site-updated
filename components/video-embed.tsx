"use client"

import { useState, useEffect } from "react"
import { extractVideoId, getVideoEmbedUrl } from "../utils/videoUtils"

interface VideoEmbedProps {
  url: string
  title?: string
}

export default function VideoEmbed({ url, title = "Video" }: VideoEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const videoData = extractVideoId(url)

    if (videoData) {
      const embed = getVideoEmbedUrl(videoData)
      setEmbedUrl(embed)
    } else {
      setError("Unsupported video URL")
    }

    setLoading(false)
  }, [url])

  if (loading) {
    return <div className="w-full h-64 bg-gray-800 animate-pulse rounded-md"></div>
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-900 text-white rounded-md">
        <p>Error: {error}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
          Watch video on original site
        </a>
      </div>
    )
  }

  return (
    <div className="w-full aspect-w-16 aspect-h-9 mb-4">
      <iframe
        src={embedUrl || ""}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-md"
      ></iframe>
    </div>
  )
}
