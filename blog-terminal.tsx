"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  X,
  Maximize2,
  Minus,
  MessageSquare,
  Star,
  Bell,
  HelpCircle,
  ChevronRight,
  Sun,
  Moon,
  Search,
  ArrowUp,
} from "lucide-react"
import { BlogPost } from "./blog-post"
import { blogData } from "./blogData"
import { useMobile } from "../hooks/use-mobile"
import { MobileHeader } from "./mobile-header"
import { DeferredContent } from "./deferred-content"
import Head from "next/head"

// Update the component
export default function BlogTerminal() {
  const [data, setData] = useState(blogData)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Get saved preference or default to true (dark mode)
      const savedTheme = localStorage.getItem("terminal-theme")
      return savedTheme === "light" ? false : true
    }
    return true // Default to dark mode on server
  })
  const [activeCategory, setActiveCategory] = useState("all")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { isMobile, isTablet } = useMobile()

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)

    // Check scroll position for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDarkMode])

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const newTheme = !prev
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("terminal-theme", newTheme ? "dark" : "light")
      }
      return newTheme
    })
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      console.log(`Searching for: ${searchTerm}`)
      // Here you would implement the actual search
    },
    [searchTerm],
  )

  // Filter posts based on active category
  const filteredPosts = useMemo(() => {
    return activeCategory === "all"
      ? [...data.featured, ...data.americas, ...data.emea, ...data.asiaPacific]
      : data[activeCategory as keyof typeof data] || []
  }, [data, activeCategory])

  return (
    <div className={`min-h-screen font-mono ${isDarkMode ? "bg-[#121212] text-white" : "bg-[#f0f0f0] text-black"}`}>
      {/* Add structured data for SEO */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "MrCherif Terminal Blog",
              description: "A Bloomberg terminal-inspired blog featuring tech insights, coding tips, and market data",
              url: "https://mrcherif.com",
              author: {
                "@type": "Person",
                name: "MrCherif",
              },
              blogPost: filteredPosts.slice(0, 10).map((post) => ({
                "@type": "BlogPosting",
                headline: post.title,
                description: post.excerpt,
                datePublished: post.date,
                author: {
                  "@type": "Person",
                  name: "MrCherif",
                },
              })),
            }),
          }}
        />
      </Head>

      {/* Mobile Header for small screens */}
      {isMobile && <MobileHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} title="Terminal Blog" />}

      {/* Terminal Header - hide on mobile */}
      <div
        className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-2 py-1 flex items-center justify-between border-b ${isDarkMode ? "border-terminal-gray-800" : "border-gray-300"} ${isMobile ? "hidden" : ""}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-yellow-500 text-xs sm:text-sm">TERM-BLOG</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm`}>v1.0.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-yellow-500 px-2 py-0.5 text-black hidden sm:inline-block sm:text-sm">TERMINAL BLOG</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm`}>= Menu</span>
          <div className="flex gap-1">
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <button
            onClick={toggleTheme}
            className="ml-2"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-3 w-3 sm:h-4 sm:w-4" /> : <Moon className="h-3 w-3 sm:h-4 sm:w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Bar - simplified for mobile */}
      <div
        className={`flex items-center gap-2 border-b ${isDarkMode ? "border-terminal-gray-700 bg-[#1a1a1a]" : "border-gray-300 bg-[#e6e6e6]"} px-2 py-1 text-xxs xs:text-xs sm:text-sm overflow-x-auto ${isMobile ? "hidden" : ""}`}
      >
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        <span>TERM://$</span>
        <span className="text-green-500">cd blog</span>
        <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>|</span>
        <span>ls</span>
        <div className="ml-auto flex items-center gap-2">
          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Contact</span>
          <Star className="h-3 w-3 sm:h-4 sm:w-4" />
          <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </div>

      {/* Function Buttons */}
      <div
        className={`flex flex-wrap gap-1 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"} px-2 py-1 text-xxs xs:text-xs sm:text-sm overflow-x-auto`}
      >
        <button
          className={`px-2 py-0.5 text-white ${activeCategory === "all" ? "bg-green-600" : "bg-red-600"}`}
          onClick={() => setActiveCategory("all")}
        >
          ALL
        </button>
        <button
          className={`px-2 py-0.5 text-white ${activeCategory === "featured" ? "bg-green-600" : "bg-red-600"}`}
          onClick={() => setActiveCategory("featured")}
        >
          FEATURED
        </button>
        <button
          className={`px-2 py-0.5 text-white ${activeCategory === "americas" ? "bg-green-600" : "bg-red-600"}`}
          onClick={() => setActiveCategory("americas")}
        >
          AMERICAS
        </button>
        <button
          className={`px-2 py-0.5 text-white ${activeCategory === "emea" ? "bg-green-600" : "bg-red-600"}`}
          onClick={() => setActiveCategory("emea")}
        >
          EMEA
        </button>
        <button
          className={`px-2 py-0.5 text-white ${activeCategory === "asiaPacific" ? "bg-green-600" : "bg-red-600"}`}
          onClick={() => setActiveCategory("asiaPacific")}
        >
          ASIA
        </button>
      </div>

      {/* Search Bar - optimized for mobile */}
      <form
        onSubmit={handleSearch}
        className={`flex flex-wrap items-center gap-2 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"} px-2 py-1 text-[#ff9800] text-xxs xs:text-xs sm:text-sm border-b ${isDarkMode ? "border-terminal-gray-700" : "border-gray-300"}`}
      >
        <div className="flex items-center gap-2 w-full">
          <span className="font-bold">TERM://$</span>
          <span className="text-green-500">grep</span>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search posts..."
              className={`w-full px-2 py-1 ${isDarkMode ? "bg-[#121212] text-white" : "bg-white text-black"} border ${isDarkMode ? "border-gray-700" : "border-gray-300"} rounded text-xs`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search posts"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label="Submit search"
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </form>

      {/* Main Content - Responsive Blog Grid with performance optimizations */}
      <main className="p-2 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredPosts.map((post, index) => (
            <DeferredContent
              key={post.id}
              delay={100 * (index % 6)} // Stagger loading for better performance
              placeholder={<div className="h-64 bg-gray-800 animate-pulse rounded-md"></div>}
            >
              <BlogPost
                post={post}
                isDarkMode={isDarkMode}
                priority={index < 2} // Use priority loading for first visible posts
              />
            </DeferredContent>
          ))}
        </div>

        {/* Empty state when no posts match */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts found in this category.</p>
          </div>
        )}
      </main>

      {/* Terminal Footer */}
      <footer
        className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-2 py-1 flex items-center justify-between border-t ${isDarkMode ? "border-terminal-gray-800" : "border-gray-300"} mt-auto sticky bottom-0`}
      >
        <div className="flex items-center gap-4">
          <span className="text-yellow-500 text-xs sm:text-sm">TERM-BLOG</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm`}>© 2025</span>
        </div>
        <div className="flex items-center gap-2 text-xxs xs:text-xs">
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Status: </span>
          <span className="text-green-500">ONLINE</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} hidden xs:inline`}>|</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} hidden xs:inline`}>Memory: 64MB</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} hidden xs:inline`}>|</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} hidden xs:inline`}>Uptime: 42d</span>
        </div>
      </footer>

      {/* Scroll to top button - only show when scrolled down */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-16 right-4 p-2 rounded-full shadow-lg 
                    ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}
                    focus:outline-none focus:ring-2 focus:ring-yellow-500 z-50`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
