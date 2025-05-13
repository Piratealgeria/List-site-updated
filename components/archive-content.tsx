"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Sun, Moon, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { getAllPosts } from "../utils/blogUtils"
import { format, parseISO } from "date-fns"
import type { Post } from "../types/Post"

export default function ArchiveContent() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Get saved preference or default to true (dark mode)
      const savedTheme = localStorage.getItem("terminal-theme")
      return savedTheme === "light" ? false : true
    }
    return true // Default to dark mode on server
  })
  const [posts, setPosts] = useState<Post[]>([])
  const [yearExpanded, setYearExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Get all posts
    const allPosts = getAllPosts()
    setPosts(allPosts)

    // Initialize all years as expanded
    const years = getYearsFromPosts(allPosts)
    const initialYearState = years.reduce(
      (acc, year) => {
        acc[year] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    setYearExpanded(initialYearState)
  }, [])

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

  const toggleYear = (year: string) => {
    setYearExpanded((prev) => ({
      ...prev,
      [year]: !prev[year],
    }))
  }

  // Group posts by year and month
  const getYearsFromPosts = (posts: Post[]) => {
    const years = new Set<string>()

    posts.forEach((post) => {
      if (post.date) {
        try {
          const date = parseISO(post.date)
          const year = format(date, "yyyy")
          years.add(year)
        } catch (error) {
          console.error(`Error parsing date: ${post.date}`, error)
        }
      }
    })

    return Array.from(years).sort((a, b) => b.localeCompare(a)) // Sort years in descending order
  }

  const getPostsByYearAndMonth = () => {
    const postsByYearAndMonth: Record<string, Record<string, Post[]>> = {}

    posts.forEach((post) => {
      if (post.date) {
        try {
          const date = parseISO(post.date)
          const year = format(date, "yyyy")
          const month = format(date, "MMMM")

          if (!postsByYearAndMonth[year]) {
            postsByYearAndMonth[year] = {}
          }

          if (!postsByYearAndMonth[year][month]) {
            postsByYearAndMonth[year][month] = []
          }

          postsByYearAndMonth[year][month].push(post)
        } catch (error) {
          console.error(`Error parsing date: ${post.date}`, error)
        }
      }
    })

    return postsByYearAndMonth
  }

  const postsByYearAndMonth = getPostsByYearAndMonth()
  const years = Object.keys(postsByYearAndMonth).sort((a, b) => b.localeCompare(a))

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
            Archive
          </Link>
        </div>
        <button onClick={toggleTheme} className="ml-2">
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-3xl mx-auto mt-8 px-4 pb-16 w-full">
        <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
          Post Archive
        </h1>

        <div className={`${isDarkMode ? "bg-[#1a1a1a]" : "bg-white"} rounded-md p-4`}>
          {years.length > 0 ? (
            years.map((year) => (
              <div key={year} className="mb-6">
                <button
                  onClick={() => toggleYear(year)}
                  className="flex items-center justify-between w-full text-left font-bold text-lg mb-2"
                >
                  <span className={isDarkMode ? "text-yellow-100" : "text-yellow-800"}>{year}</span>
                  {yearExpanded[year] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {yearExpanded[year] && (
                  <div className="pl-4 border-l-2 border-gray-700 ml-2">
                    {Object.keys(postsByYearAndMonth[year])
                      .sort((a, b) => {
                        // Sort months in reverse chronological order
                        const monthA = new Date(`${a} 1, 2000`).getMonth()
                        const monthB = new Date(`${b} 1, 2000`).getMonth()
                        return monthB - monthA
                      })
                      .map((month) => (
                        <div key={`${year}-${month}`} className="mb-4">
                          <h3 className="font-bold text-md mb-2 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{month}</span>
                          </h3>

                          <ul className="pl-6 space-y-2">
                            {postsByYearAndMonth[year][month].map((post) => (
                              <li key={post.id} className="list-disc">
                                <Link
                                  href={`/posts/${post.id}`}
                                  className={`hover:underline ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                                >
                                  {post.title}
                                </Link>
                                <span className="text-xs ml-2 text-gray-500">
                                  {format(parseISO(post.date), "MMM d, yyyy")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center py-8">No posts found in the archive.</p>
          )}
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
