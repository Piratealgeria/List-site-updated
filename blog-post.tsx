"use client"

import type React from "react"

import { Calendar, User, Tag, Clock, ThumbsUp, MessageCircle, Share2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import OptimizedImage from "./optimized-image"

// Dynamically import the share dialog to reduce initial bundle size
const ShareDialog = dynamic(() => import("./share-dialog").then((mod) => ({ default: mod.ShareDialog })), {
  ssr: false,
})

interface BlogPostProps {
  post: {
    id: string
    title: string
    excerpt: string
    author: string
    date: string
    readTime: string
    category: string
    tags: string[]
    likes: number
    comments: number
    image?: string
  }
  isDarkMode: boolean
  priority?: boolean
}

export function BlogPost({ post, isDarkMode, priority = false }: BlogPostProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  // Generate terminal-like ASCII art for post without image
  const generateAsciiArt = () => {
    const patterns = [
      `
┌───────────────────┐
│ ▄▄▄▄▄ █▀█ █▄▄▄▄▄ │
│ █   █ █▄█ █   █ │
│ █▄▄▄█ █▀▄ █▄▄▄█ │
│ █   █ █ █ █   █ │
│ █▄▄▄█ █ █ █▄▄▄█ │
└───────────────────┘
      `,
      `
┌───────────────────┐
│ ▀▄    ▄ ▄▄▄▄▄▄▄ │
│   █  █  █      │
│    █▄█   █▄▄▄▄▄ │
│    █▄█   █      │
│   ▄█  █▄ █▄▄▄▄▄ │
└───────────────────┘
      `,
      `
┌───────────────────┐
│ ▄▄▄▄▄▄  ▄▄▄▄▄▄▄ │
│ █    █  █      │
│ █▄▄▄▄▀  █▄▄▄▄▄ │
│ █    █  █      │
│ █▄▄▄▄▀  █▄▄▄▄▄ │
└───────────────────┘
      `,
    ]

    // Use post id to deterministically select a pattern
    const index = post.id.charCodeAt(0) % patterns.length
    return patterns[index]
  }

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsShareDialogOpen(true)
  }

  return (
    <>
      <article
        className={`${
          isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"
        } border rounded-none overflow-hidden transition-transform hover:translate-y-[-2px] h-full flex flex-col`}
        style={{ maxHeight: "400px" }} // Set a max height to prevent stretching
      >
        {/* Post Image */}
        <Link href={`/posts/${post.id}`} className="block h-40 overflow-hidden">
          {post.image ? (
            <OptimizedImage
              src={post.image}
              alt={post.title}
              width={600}
              height={300}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div
              className={`h-40 flex items-center justify-center ${isDarkMode ? "bg-[#121212]" : "bg-[#f0f0f0]"} overflow-hidden`}
            >
              <pre
                className={`text-[0.5rem] leading-[0.5rem] ${isDarkMode ? "text-green-500" : "text-green-700"} font-mono`}
                aria-label={`ASCII art for ${post.title}`}
              >
                {generateAsciiArt()}
              </pre>
            </div>
          )}
        </Link>

        {/* Post Header */}
        <header className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>{post.id})</span>
            <span className="text-[#ff9800] text-sm font-bold">{post.category}</span>
          </div>
          <h2 className={`text-base font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"} mb-1 line-clamp-2`}>
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
        </header>

        {/* Post Content */}
        <div className="p-3 flex-grow overflow-hidden">
          <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 line-clamp-3`}>
            {post.excerpt}
          </p>

          {/* Post Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" aria-hidden="true" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" aria-hidden="true" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.tags.slice(0, 2).join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Post Actions */}
        <div
          className={`flex items-center justify-between p-3 border-t ${
            isDarkMode ? "border-gray-700 bg-[#121212]" : "border-gray-300 bg-[#f0f0f0]"
          } mt-auto`}
        >
          <button className="flex items-center gap-1 text-xs" aria-label={`Like post (${post.likes} likes)`}>
            <ThumbsUp className="h-3 w-3" aria-hidden="true" />
            <span>{post.likes}</span>
          </button>
          <Link
            href={`/posts/${post.id}#comments`}
            className="flex items-center gap-1 text-xs"
            aria-label={`View ${post.comments} comments`}
          >
            <MessageCircle className="h-3 w-3" aria-hidden="true" />
            <span>{post.comments}</span>
          </Link>
          <button onClick={handleShareClick} className="flex items-center gap-1 text-xs" aria-label="Share post">
            <Share2 className="h-3 w-3" aria-hidden="true" />
            <span>Share</span>
          </button>
          <Link
            href={`/posts/${post.id}`}
            className={`text-xs px-2 py-0.5 ${
              isDarkMode ? "bg-[#1a1a1a] text-green-500" : "bg-white text-green-700"
            } border ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
            aria-label={`Read full post: ${post.title}`}
          >
            READ
          </Link>
        </div>
      </article>

      {/* Share Dialog */}
      {isShareDialogOpen && (
        <ShareDialog
          url={
            typeof window !== "undefined"
              ? `${window.location.origin}/posts/${post.id}`
              : `https://mrcherif.com/posts/${post.id}`
          }
          title={post.title}
          excerpt={post.excerpt}
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  )
}
