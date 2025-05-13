"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, Search } from "lucide-react"
import Link from "next/link"
import { BlogPostCard } from "../../components/blog-post-card"
import { useTheme } from "../../components/theme-provider"
import type { Post } from "../../types/Post"

export default function SearchPage() {
  const { isDarkMode } = useTheme()
  const searchParams = useSearchParams()
  const query = searchParams?.get("q") || ""
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(query)

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        // Import the search function dynamically
        const { searchPosts } = await import("../../utils/blogUtils")
        const searchResults = searchPosts(query)
        setResults(searchResults)
      } catch (error) {
        console.error("Error searching posts:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    if (query) {
      fetchResults()
    } else {
      setResults([])
      setIsLoading(false)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== "undefined") {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div className="min-h-screen font-mono flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="terminal-header bg-black dark:bg-black light:bg-[#e0e0e0] text-white light:text-black">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <h1 className="text-lg font-bold ml-4">Search Results</h1>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="p-4 bg-secondary">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full px-3 py-2 bg-background text-foreground border border-input rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search posts"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label="Submit search"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="flex-grow p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">{query ? `Results for "${query}"` : "Enter a search term"}</h2>

            {query && (
              <p className="mb-4 text-muted-foreground">
                Found {results.length} {results.length === 1 ? "result" : "results"}
              </p>
            )}

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-8">
                <p className="text-lg mb-2">No results found for "{query}"</p>
                <p className="text-muted-foreground">Try different keywords or browse all posts</p>
                <Link href="/" className="btn btn-primary mt-4 inline-block">
                  Browse All Posts
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Enter a search term to find posts</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="terminal-footer bg-black dark:bg-black light:bg-[#e0e0e0] text-white light:text-black">
        <div className="flex items-center gap-4">
          <span className="text-primary text-xs sm:text-sm">MrCherif</span>
          <span className="text-muted-foreground text-xs sm:text-sm">© 2025</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Server: </span>
          <span className="text-accent">ONLINE</span>
        </div>
      </div>
    </div>
  )
}
