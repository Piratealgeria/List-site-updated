"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { X, Maximize2, Minus, MessageSquare, ChevronRight, Sun, Moon, Search } from "lucide-react"
import Link from "next/link"
import type { Post } from "../types/Post"
import dynamic from "next/dynamic"
import { KofiWidget } from "./kofi-widget"

// Dynamically import components
const BlogPostCard = dynamic(() => import("./blog-post-card").then((mod) => ({ default: mod.BlogPostCard })), {
  loading: () => <div className="h-64 bg-gray-800 animate-pulse rounded-md"></div>,
  ssr: true,
})

interface BlogTerminalProps {
  initialPosts?: string
  defaultCategory?: string
}

export default function BlogTerminal({ initialPosts, defaultCategory = "all" }: BlogTerminalProps) {
  // Force "all" as the default category
  const [activeCategory, setActiveCategory] = useState(defaultCategory)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [uptime, setUptime] = useState("0s")
  const [memory, setMemory] = useState("0MB")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const postsPerPage = 9
  const observer = useRef<IntersectionObserver | null>(null)

  // CRITICAL: Load all posts on initial render
  useEffect(() => {
    if (initialPosts) {
      try {
        const parsedPosts = JSON.parse(initialPosts)
        console.log(`Parsed ${parsedPosts.length} posts from initialPosts`)

        // Set all posts
        setAllPosts(parsedPosts)

        // IMMEDIATELY display ALL posts without filtering
        const initialDisplayPosts = parsedPosts.slice(0, postsPerPage)
        setDisplayedPosts(initialDisplayPosts)

        // Explicitly set hasMore based on whether there are more posts than the initial display
        const hasMorePosts = parsedPosts.length > postsPerPage
        console.log(
          `Setting hasMore to ${hasMorePosts}, total posts: ${parsedPosts.length}, displayed: ${initialDisplayPosts.length}`,
        )
        setHasMore(hasMorePosts)

        // Load categories
        import("../utils/blogUtils").then(({ getAllCategories }) => {
          setCategories(getAllCategories())
        })
      } catch (error) {
        console.error("Error parsing initial posts:", error)
        loadPostsClientSide()
      }
    } else {
      loadPostsClientSide()
    }

    // Set initial load time in localStorage if it doesn't exist
    if (typeof window !== "undefined" && !localStorage.getItem("site-initial-load-time")) {
      localStorage.setItem("site-initial-load-time", Date.now().toString())
    }

    // Update uptime every second
    const uptimeInterval = setInterval(() => {
      if (typeof window === "undefined") return

      const initialLoadTime = Number.parseInt(localStorage.getItem("site-initial-load-time") || Date.now().toString())
      const currentTime = Date.now()
      const uptimeMs = currentTime - initialLoadTime

      // Convert to appropriate units
      const seconds = Math.floor(uptimeMs / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) {
        setUptime(`${days}d ${hours % 24}h`)
      } else if (hours > 0) {
        setUptime(`${hours}h ${minutes % 60}m`)
      } else if (minutes > 0) {
        setUptime(`${minutes}m ${seconds % 60}s`)
      } else {
        setUptime(`${seconds}s`)
      }
    }, 1000)

    // Update memory usage if available
    const memoryInterval = setInterval(() => {
      if (typeof window === "undefined") return

      if (window.performance && (performance as any).memory) {
        const memoryInfo = (performance as any).memory
        const memoryMB = Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024))
        setMemory(`${memoryMB}MB`)
      } else {
        // Simulate memory usage if actual data isn't available
        const randomMemory = Math.floor(Math.random() * 50) + 30 // Random between 30-80MB
        setMemory(`${randomMemory}MB`)
      }
    }, 2000)

    return () => {
      clearInterval(uptimeInterval)
      clearInterval(memoryInterval)
    }
  }, [initialPosts, postsPerPage])

  // Client-side loading fallback
  const loadPostsClientSide = useCallback(() => {
    import("../utils/blogUtils").then(({ getAllPosts, getAllCategories }) => {
      const posts = getAllPosts()
      console.log(`Loaded ${posts.length} posts client-side`)

      // Set all posts
      setAllPosts(posts)

      // IMMEDIATELY display ALL posts without filtering
      const initialDisplayPosts = posts.slice(0, postsPerPage)
      setDisplayedPosts(initialDisplayPosts)

      // Explicitly set hasMore based on whether there are more posts than the initial display
      const hasMorePosts = posts.length > postsPerPage
      console.log(
        `Setting hasMore to ${hasMorePosts}, total posts: ${posts.length}, displayed: ${initialDisplayPosts.length}`,
      )
      setHasMore(hasMorePosts)

      // Load categories
      setCategories(getAllCategories())
    })
  }, [postsPerPage])

  // Handle category changes AFTER initial load
  useEffect(() => {
    // Skip on first render - we already loaded all posts
    if (allPosts.length === 0) return

    console.log(`Category changed to: ${activeCategory}`)

    if (activeCategory === "all") {
      // Show all posts
      setDisplayedPosts(allPosts.slice(0, postsPerPage))
      setHasMore(allPosts.length > postsPerPage)
    } else {
      // Filter by category
      const filtered = allPosts.filter(
        (post) => post.category && post.category.toLowerCase() === activeCategory.toLowerCase(),
      )
      setDisplayedPosts(filtered.slice(0, postsPerPage))
      setHasMore(filtered.length > postsPerPage)
    }

    // Reset page number
    setPage(1)
  }, [activeCategory, allPosts, postsPerPage])

  // Handle theme changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("dark", isDarkMode)
      document.body.classList.toggle("light", !isDarkMode)
    }
  }, [isDarkMode])

  const loadMorePosts = useCallback(() => {
    if (isLoading || !hasMore) return

    console.log("Loading more posts, current page:", page)
    setIsLoading(true)

    // Use setTimeout to prevent UI freezing when loading many posts
    setTimeout(() => {
      const nextPage = page + 1
      let filtered = allPosts

      // Apply category filter if not "all"
      if (activeCategory !== "all") {
        filtered = allPosts.filter(
          (post) => post.category && post.category.toLowerCase() === activeCategory.toLowerCase(),
        )
      }

      // Apply search filter if search term exists
      if (searchTerm.trim() !== "") {
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
        )
      }

      const startIndex = (nextPage - 1) * postsPerPage
      const endIndex = startIndex + postsPerPage

      if (startIndex < filtered.length) {
        console.log(`Adding posts from ${startIndex} to ${endIndex}, total available: ${filtered.length}`)
        setDisplayedPosts((prev) => [...prev, ...filtered.slice(startIndex, endIndex)])
        setPage(nextPage)
        setHasMore(endIndex < filtered.length)
      } else {
        setHasMore(false)
      }
      setIsLoading(false)
    }, 300)
  }, [isLoading, hasMore, page, allPosts, activeCategory, searchTerm, postsPerPage])

  // Set up intersection observer for infinite scrolling
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || isLoading) return

      // Always disconnect previous observer before creating a new one
      if (observer.current) {
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            console.log("Intersection detected, loading more posts")
            loadMorePosts()
          }
        },
        {
          rootMargin: "200px", // Increased margin to detect earlier
          threshold: 0.1,
        },
      )

      observer.current.observe(node)
      console.log("Observer attached to last post element")
    },
    [isLoading, hasMore, loadMorePosts],
  )

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    import("../utils/blogUtils").then(({ searchPosts }) => {
      if (searchTerm.trim() === "") {
        // If search is empty, reset to all posts or filtered by category
        if (activeCategory === "all") {
          setDisplayedPosts(allPosts.slice(0, postsPerPage))
          setHasMore(allPosts.length > postsPerPage)
        } else {
          const filtered = allPosts.filter(
            (post) => post.category && post.category.toLowerCase() === activeCategory.toLowerCase(),
          )
          setDisplayedPosts(filtered.slice(0, postsPerPage))
          setHasMore(filtered.length > postsPerPage)
        }
      } else {
        const searchResults = searchPosts(searchTerm)

        // Apply category filter if not "all"
        const filtered =
          activeCategory === "all"
            ? searchResults
            : searchResults.filter(
                (post) => post.category && post.category.toLowerCase() === activeCategory.toLowerCase(),
              )

        setDisplayedPosts(filtered.slice(0, postsPerPage))
        setHasMore(filtered.length > postsPerPage)
      }

      // Reset page number
      setPage(1)
    })
  }

  const handleCategoryChange = (category: string) => {
    console.log(`Category button clicked: ${category}`)
    setActiveCategory(category)

    // Scroll to top when changing categories
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Ensure loadMorePosts is properly memoized with all dependencies
  useEffect(() => {
    // This effect ensures the loadMorePosts callback is updated when dependencies change
  }, [page, allPosts, activeCategory, searchTerm, postsPerPage, isLoading, hasMore])

  return (
    <div
      className={`min-h-screen font-mono flex flex-col ${isDarkMode ? "bg-[#121212] text-white" : "bg-[#f0f0f0] text-black"}`}
    >
      {/* Terminal Header */}
      <div
        className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-2 py-1 flex items-center justify-between border-b ${isDarkMode ? "border-terminal-gray-800" : "border-gray-300"}`}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="text-yellow-500 text-xs sm:text-sm hover:underline">
            MrCherif
          </Link>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm`}>v1.0.0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm cursor-pointer`}
            >
              = Menu
            </button>
            {isMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} ring-1 ring-black ring-opacity-5 z-10`}
              >
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <Link
                    href="/about"
                    className={`block px-4 py-2 text-sm ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
                    role="menuitem"
                  >
                    About
                  </Link>
                  <Link
                    href="/categories"
                    className={`block px-4 py-2 text-sm ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
                    role="menuitem"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/archive"
                    className={`block px-4 py-2 text-sm ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
                    role="menuitem"
                  >
                    Archive
                  </Link>
                  <Link
                    href="/support"
                    className={`block px-4 py-2 text-sm ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
                    role="menuitem"
                  >
                    Support
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <button onClick={toggleTheme} className="ml-2">
            {isDarkMode ? <Sun className="h-3 w-3 sm:h-4 sm:w-4" /> : <Moon className="h-3 w-3 sm:h-4 sm:w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div
        className={`flex items-center gap-2 border-b ${isDarkMode ? "border-terminal-gray-700 bg-[#1a1a1a]" : "border-gray-300 bg-[#e6e6e6]"} px-2 py-1 text-xs sm:text-sm`}
      >
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>TERM://$</span>
        <span className="text-green-500">cd blog</span>
        <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>|</span>
        <span>ls</span>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="https://discord.gg/mhj5XKp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Contact</span>
          </Link>
        </div>
      </div>

      {/* Function Buttons - Make ALL button more prominent */}
      <div
        className={`flex flex-wrap gap-1 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"} px-2 py-1 text-xs sm:text-sm`}
      >
        <button
          className={`px-2 py-0.5 text-white ${
            activeCategory === "all"
              ? "bg-green-600 font-bold text-sm" // Make ALL button larger and bolder when active
              : "bg-red-600"
          }`}
          onClick={() => handleCategoryChange("all")}
        >
          ALL
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`px-2 py-0.5 text-white ${activeCategory === category.toLowerCase() ? "bg-green-600" : "bg-red-600"}`}
            onClick={() => handleCategoryChange(category.toLowerCase())}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className={`flex flex-wrap items-center gap-2 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"} px-2 py-1 text-[#ff9800] text-xs sm:text-sm border-b ${isDarkMode ? "border-terminal-gray-700" : "border-gray-300"}`}
      >
        <div className="flex items-center gap-2 w-full">
          <span className="font-bold">TERM://$</span>
          <span className="text-green-500">grep</span>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search posts..."
              className={`w-full px-2 py-1 ${isDarkMode ? "bg-[#121212] text-white" : "bg-white text-black"} border ${isDarkMode ? "border-gray-700" : "border-gray-300"} rounded`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </form>

      {/* Main Content - Blog Grid with improved container */}
      <div className={`flex-grow ${isDarkMode ? "bg-[#121212]" : "bg-[#f0f0f0]"} py-6 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Terminal-style container for posts */}
          <div
            className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border rounded-md shadow-sm p-4 sm:p-6`}
          >
            {/* Terminal header bar */}
            <div
              className={`flex items-center justify-between mb-4 pb-2 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                posts - {displayedPosts.length} of {allPosts.length}
              </div>
            </div>

            {/* Posts grid with improved spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPosts.map((post, index) => {
                // Check if this is the last post
                const isLastPost = index === displayedPosts.length - 1

                return (
                  <div key={post.id} ref={isLastPost ? lastPostElementRef : null} className="h-full">
                    <BlogPostCard post={post} isDarkMode={isDarkMode} />
                  </div>
                )
              })}
            </div>

            {isLoading && (
              <div className="text-center py-4 mt-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <p className="mt-2 text-sm">Loading more posts...</p>
              </div>
            )}

            {!hasMore && displayedPosts.length > 0 && (
              <p className="text-center py-4 mt-4 text-sm text-gray-500">You've reached the end of the posts</p>
            )}

            {displayedPosts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-lg mb-2">No posts found</p>
                <p className="text-gray-500">Try a different category or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Footer - Fixed at bottom */}
      <div
        className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-2 py-1 flex flex-col sm:flex-row items-center justify-between border-t ${isDarkMode ? "border-terminal-gray-800" : "border-gray-300"} w-full`}
      >
        <div className="flex items-center gap-4">
          <span className="text-yellow-500 text-xs sm:text-sm">Viking Algeria</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm`}>
            © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-4 my-2 sm:my-0">
          <a
            href="https://odysee.com/@VikingAlgeria"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 text-xs sm:text-sm"
          >
            Odysee
          </a>
          <a
            href="https://ko-fi.com/pirateyt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#29abe0] hover:text-[#1a8dbb] text-xs sm:text-sm"
          >
            Ko-fi
          </a>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Server: </span>
          <span className="text-green-500">ONLINE</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>|</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Memory: {memory}</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>|</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Uptime: {uptime}</span>
        </div>
      </div>
      {/* Ko-fi Widget */}
      <KofiWidget username="pirateyt" isDarkMode={isDarkMode} />
    </div>
  )
}
