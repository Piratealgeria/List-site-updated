"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Calendar, User, Tag, Clock, MessageCircle, Share2 } from "lucide-react"
import dynamic from "next/dynamic"
import type { Post } from "../types/Post"
import OptimizedImage from "./optimized-image"

// Dynamically import the ShareDialog component
const ShareDialog = dynamic(() => import("./share-dialog").then((mod) => ({ default: mod.ShareDialog })), {
  ssr: false,
})

interface BlogPostCardProps {
  post: Post
  isDarkMode: boolean
}

export function BlogPostCard({ post, isDarkMode }: BlogPostCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsShareDialogOpen(true)
  }

  // Generate terminal-like ASCII art for post without image based on category
  const generateAsciiArt = () => {
    // Standard Braille pattern template - exactly the same for all posts
    return `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⠟⠉⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠙⢻⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⣠⣄⠀⢻⣿⣿⣿⣿⣿⣿⡇⠀⣠⣄⠀⠀⢻⣿⣿⣏⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⠀⠀⠀⠀⠰⣿⣿⠀⢸⣿⣿⣿⣿⣿⣿⡇⠀⣿⣿⡇⠀⠀⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⠙⠃⠀⣼⣿⣿⣿⣿⣿⣿⣇⠀⠙⠛⠁⠀⠀⣼⣿⣿⣿⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣷⣤⣄⣀⣠⣤⣾⣿⣿⣿⣿⣽⣿⣿⣿⣦⣄⣀⣀⣤⣾⣿⣿⣿⣿⠃⠀⠀⢀⣀⠀⠀
⠰⡶⠶⠶⠶⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠛⠉⠉⠙⠛⠋⠀
⠀⠀⢀⣀⣠⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠷⠶⠶⠶⢤⣤⣀⠀
⠀⠛⠋⠉⠁⠀⣀⣴⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣤⣀⡀⠀⠀⠀⠀⠘⠃
⠀⠀⢀⣤⡶⠟⠉⠁⠀⠀⠉⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠉⠀⠀⠀⠉⠙⠳⠶⣄⡀⠀⠀
⠀⠀⠙⠁⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`
  }

  return (
    <>
      <div
        className={`block ${
          isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"
        } border rounded-none overflow-hidden transition-transform hover:translate-y-[-2px] h-full flex flex-col`}
        style={{ maxHeight: "400px" }} // Set a max height to prevent stretching
      >
        {/* Post Image (if available) - Make entire image clickable */}
        {post.image && (
          <Link href={`/posts/${post.id}`} className="block h-40 overflow-hidden">
            <OptimizedImage
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </Link>
        )}

        {/* ASCII Art for posts without images - Make entire art clickable */}
        {!post.image && (
          <Link href={`/posts/${post.id}`} className="block h-40 overflow-hidden">
            <div
              className={`h-40 flex items-center justify-center ${isDarkMode ? "bg-[#121212]" : "bg-[#f0f0f0]"} overflow-hidden`}
            >
              <pre
                className={`text-[0.5rem] leading-[0.5rem] ${isDarkMode ? "text-green-500" : "text-green-700"} font-mono`}
              >
                {generateAsciiArt()}
              </pre>
            </div>
          </Link>
        )}

        {/* Post Header */}
        <Link
          href={`/posts/${post.id}`}
          className={`block p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>{post.id})</span>
            <span className="text-[#ff9800] text-sm font-bold">{post.category}</span>
          </div>
          <h2 className={`text-base font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"} mb-1 line-clamp-2`}>
            {post.title}
          </h2>
        </Link>

        {/* Post Content */}
        <div className="p-3 flex-grow overflow-hidden">
          <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 line-clamp-3`}>
            {post.excerpt}
          </p>

          {/* Post Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
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
          <Link href={`/posts/${post.id}#comments`} className="flex items-center gap-1 text-xs">
            <MessageCircle className="h-3 w-3" />
            <span>Comments</span>
          </Link>
          <button onClick={handleShare} className="flex items-center gap-1 text-xs">
            <Share2 className="h-3 w-3" />
            <span>Share</span>
          </button>
          <Link
            href={`/posts/${post.id}`}
            className="flex items-center gap-1 text-xs px-2 py-0.5 bg-green-600 text-white rounded"
          >
            READ
          </Link>
        </div>
      </div>

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
