"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Calendar, User, Tag, Clock, Share2 } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import type { Post } from "../types/Post"
import OptimizedImage from "./optimized-image"
import GiscusComments from "./giscus-comments"
import { themeConfig } from "../config/theme"
import ImageLightbox from "./image-lightbox"
import { KofiButton } from "./kofi-button"

// Dynamically import components
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  loading: () => <div className="animate-pulse bg-gray-700 h-96 w-full rounded"></div>,
  ssr: true,
})

const ShareDialog = dynamic(() => import("./share-dialog").then((mod) => ({ default: mod.ShareDialog })), {
  ssr: false,
})

const VideoEmbed = dynamic(() => import("./video-embed"), {
  loading: () => <div className="w-full h-64 bg-gray-800 animate-pulse rounded-md"></div>,
  ssr: true,
})

// Dynamically import syntax highlighter
const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter").then((mod) => mod.Prism), { ssr: false })

// Dynamically import the style
const tomorrow = dynamic(() => import("react-syntax-highlighter/dist/cjs/styles/prism").then((mod) => mod.tomorrow), {
  ssr: false,
})

// Dynamically import plugins
const remarkGfm = dynamic(() => import("remark-gfm"), { ssr: false })
const rehypeRaw = dynamic(() => import("rehype-raw"), { ssr: false })
const rehypeSanitize = dynamic(() => import("rehype-sanitize"), { ssr: false })

interface PostContentProps {
  post: Post
}

// Function to check if a string is a video URL (YouTube, Vimeo, etc.)
const isVideoUrl = (url: string): boolean => {
  try {
    new URL(url)
    return (
      url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com") || url.includes("odysee.com")
    )
  } catch (error) {
    return false
  }
}

// Function to parse colored text syntax: [color:#HEX]text[/color]
const parseColoredText = (content: string): string => {
  // Fix the regex to match [color:#HEX]text[/color] format
  const colorRegex = /\[color:(#[0-9A-Fa-f]{3,8})\](.*?)\[\/color\]/g

  // First attempt with the original syntax
  let processedContent = content.replace(colorRegex, (match, color, text) => {
    // Validate the hex color to prevent XSS
    if (/^#[0-9A-Fa-f]{3,8}$/.test(color)) {
      return `<span style="color:${color}">${text}</span>`
    }
    return text // If invalid hex, just return the text
  })

  // Second attempt with the alternative syntax [color:#HEX]text[/color]
  const alternativeColorRegex = /\[color:(#[0-9A-Fa-f]{3,8})\](.*?)\[\/color\]/g
  processedContent = processedContent.replace(alternativeColorRegex, (match, color, text) => {
    // Validate the hex color to prevent XSS
    if (/^#[0-9A-Fa-f]{3,8}$/.test(color)) {
      return `<span style="color:${color}">${text}</span>`
    }
    return text // If invalid hex, just return the text
  })

  return processedContent
}

export default function PostContent({ post }: PostContentProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Get saved preference or default to the theme config
      const savedTheme = localStorage.getItem("terminal-theme")
      return savedTheme ? savedTheme === "dark" : themeConfig.defaultTheme === "dark"
    }
    return themeConfig.defaultTheme === "dark" // Default based on config
  })
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [markdownLoaded, setMarkdownLoaded] = useState(false)
  const [processedContent, setProcessedContent] = useState(post.content)

  useEffect(() => {
    // Process the content to handle colored text
    // Replace regular images with lightbox in post content
    const contentWithLightbox = post.content.replace(
      /<img\s+src="([^"]+)"\s+alt="([^"]*)"\s*(?:width="([^"]*)"\s*)?(?:height="([^"]*)"\s*)?\/>/g,
      (match, src, alt, width, height) => {
        return `<div class="my-4"><ImageLightbox src="${src}" alt="${alt}" ${width ? `width={${width}}` : ""} ${height ? `height={${height}}` : ""} /></div>`
      },
    )
    setProcessedContent(parseColoredText(contentWithLightbox))

    // Set markdown as loaded after component mounts
    setMarkdownLoaded(true)
  }, [post.content])

  const handleShare = () => {
    setIsShareDialogOpen(true)
  }

  const components = {
    ImageLightbox,
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "")
      return !inline && match ? (
        <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    img({ node, ...props }) {
      return (
        <OptimizedImage src={props.src || ""} alt={props.alt || ""} className="max-w-full h-auto my-4 rounded-md" />
      )
    },
    a({ node, ...props }) {
      return (
        <a
          {...props}
          className={`${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
          target="_blank"
          rel="noopener noreferrer"
        />
      )
    },
    table({ node, ...props }) {
      return (
        <div className="overflow-x-auto my-4">
          <table {...props} className="min-w-full divide-y divide-gray-700" />
        </div>
      )
    },
    p({ node, children, ...props }) {
      // Check if the paragraph contains a video URL
      const childArray = Array.isArray(children) ? children : [children]
      if (childArray.length === 1 && typeof childArray[0] === "string" && isVideoUrl(childArray[0].toString())) {
        return <VideoEmbed url={childArray[0].toString()} />
      }
      return <p {...props}>{children}</p>
    },
  }

  return (
    <div
      className={`min-h-screen ${themeConfig.fonts.body} flex flex-col ${isDarkMode ? "bg-[#121212] text-white" : "bg-[#f0f0f0] text-black"}`}
    >
      {/* Header */}
      <div className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-4 py-2 flex items-center`}>
        <Link href="/" className="flex items-center text-[#ff9800]">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
        <Link href="/" className="text-lg font-bold ml-4 truncate hover:underline">
          MrCherif: {post.title}
        </Link>
      </div>

      {/* Post Content with improved container */}
      <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Terminal-style container */}
          <div
            className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border rounded-md shadow-sm p-6`}
          >
            {/* Terminal header bar */}
            <div
              className={`flex items-center justify-between mb-6 pb-2 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>post - {post.id}</div>
            </div>

            <article>
              <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
                {post.title}
              </h1>

              {/* Post Metadata */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.tags.join(", ")}</span>
                </div>
              </div>

              {/* Featured Media (Image or Video) */}
              {post.videoUrl ? (
                <div className="mb-6">
                  <VideoEmbed url={post.videoUrl} title={post.title} />
                </div>
              ) : (
                post.image && (
                  <div className="mb-6">
                    <OptimizedImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-auto rounded-md"
                      priority={true}
                    />
                  </div>
                )
              )}

              {/* Post Content with Enhanced Markdown Support */}
              <div className={`prose ${isDarkMode ? "prose-invert" : ""} max-w-none text-sm leading-relaxed mb-8`}>
                {markdownLoaded ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={components}
                  >
                    {processedContent}
                  </ReactMarkdown>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  </div>
                )}
              </div>

              {/* Comments section with Giscus */}
              <div className="mt-8">
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
                  Comments
                </h2>
                <GiscusComments theme={isDarkMode ? "dark" : "light"} />
              </div>

              {/* Post Actions */}
              <div
                className={`flex items-center justify-between py-4 mt-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
              >
                <button onClick={handleShare} className="flex items-center gap-1 text-sm">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
              {/* Support section */}
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center text-center">
                  <p className="mb-3 text-sm">If you enjoyed this content, consider supporting me:</p>
                  <KofiButton username="pirateyt" isDarkMode={isDarkMode} />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      {isShareDialogOpen && (
        <ShareDialog
          url={typeof window !== "undefined" ? window.location.href : `https://mrcherif.com/posts/${post.id}`}
          title={post.title}
          excerpt={post.excerpt}
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )
}
