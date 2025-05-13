"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Sun, Moon, Tag } from "lucide-react"
import Link from "next/link"
import { getAllCategories, getPostsByCategory } from "../utils/blogUtils"
import { BlogPostCard } from "./blog-post-card"
import type { Post } from "../types/Post"

export default function CategoriesContent() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Get saved preference or default to true (dark mode)
      const savedTheme = localStorage.getItem("terminal-theme")
      return savedTheme === "light" ? false : true
    }
    return true // Default to dark mode on server
  })
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([])

  useEffect(() => {
    // Get all categories
    const allCategories = getAllCategories()
    setCategories(allCategories)

    // If a category is selected, get its posts
    if (selectedCategory) {
      const posts = getPostsByCategory(selectedCategory)
      setCategoryPosts(posts)
    } else if (allCategories.length > 0) {
      // Select the first category by default
      setSelectedCategory(allCategories[0])
      setCategoryPosts(getPostsByCategory(allCategories[0]))
    }
  }, [selectedCategory])

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev
      // Save to localStorage
      localStorage.setItem("terminal-theme", newTheme ? "dark" : "light")
      return newTheme
    })
  }

  return (
    <div
      className={`min-h-screen font-mono flex flex-col ${isDarkMode ? "bg-[#121212] text-white" : "bg-[#f0f0f0] text-black"}`}
    >
      {/* Header */}
      <div
        className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-4 py-2 flex items-center justify-between`}
      >
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-[#ff9800]">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <Link href="/" className="text-lg font-bold ml-4 hover:underline">
            Categories
          </Link>
        </div>
        <button onClick={toggleTheme} className="ml-2">
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Categories Sidebar */}
          <div className={`md:w-1/4 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"} p-4 rounded-md`}>
            <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
              All Categories
            </h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? isDarkMode
                          ? "bg-gray-800 text-yellow-500"
                          : "bg-gray-200 text-yellow-700"
                        : isDarkMode
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    <Tag className="h-4 w-4" />
                    <span>{category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Posts Grid */}
          <div className="md:w-3/4">
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
              {selectedCategory} Posts
            </h2>

            {categoryPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} isDarkMode={isDarkMode} />
                ))}
              </div>
            ) : (
              <p className="text-center py-8">No posts found in this category.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-2 py-1 flex items-center justify-between border-t ${isDarkMode ? "border-terminal-gray-800" : "border-gray-300"} mt-auto`}
      >
        <div className="flex items-center gap-4">
          <span className="text-yellow-500 text-xs sm:text-sm">MrCherif</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm`}>© 2025</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Server: </span>
          <span className="text-green-500">ONLINE</span>
        </div>
      </div>
    </div>
  )
}
