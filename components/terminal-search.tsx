"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, X, Calendar, User, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface TerminalSearchProps {
  isDarkMode: boolean
  categories: string[]
  tags: string[]
}

export default function TerminalSearch({ isDarkMode, categories, tags }: TerminalSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState(searchParams?.get("q") || "")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [category, setCategory] = useState(searchParams?.get("category") || "")
  const [tag, setTag] = useState(searchParams?.get("tag") || "")
  const [author, setAuthor] = useState(searchParams?.get("author") || "")
  const [dateFrom, setDateFrom] = useState(searchParams?.get("from") || "")
  const [dateTo, setDateTo] = useState(searchParams?.get("to") || "")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [historyItemToUse, setHistoryItemToUse] = useState<string | null>(null)

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("search_history")
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (historyItemToUse) {
      setQuery(historyItemToUse)
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
      setHistoryItemToUse(null) // Reset the state
    }
  }, [historyItemToUse])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Build query string
    const params = new URLSearchParams()
    if (query) {
      params.set("q", query)

      // Add to search history
      if (!searchHistory.includes(query)) {
        const newHistory = [query, ...searchHistory].slice(0, 10)
        setSearchHistory(newHistory)
        localStorage.setItem("search_history", JSON.stringify(newHistory))
      }
    }
    if (category) params.set("category", category)
    if (tag) params.set("tag", tag)
    if (author) params.set("author", author)
    if (dateFrom) params.set("from", dateFrom)
    if (dateTo) params.set("to", dateTo)

    router.push(`/search?${params.toString()}`)
  }

  const clearSearch = () => {
    setQuery("")
    setCategory("")
    setTag("")
    setAuthor("")
    setDateFrom("")
    setDateTo("")
    router.push("/search")
  }

  const useHistoryItem = (item: string) => {
    setHistoryItemToUse(item)
  }

  return (
    <div className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border p-4 mb-6`}>
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 text-green-500">
            <span className="font-bold">TERM://$</span>
            <span>grep</span>
          </div>

          <div className="relative flex-grow">
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search with regex support..."
              className={`w-full px-3 py-2 ${isDarkMode ? "bg-[#121212] text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"} border rounded pl-8`}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 px-2 py-1 ${isDarkMode ? "bg-[#121212] border-gray-700 hover:bg-gray-800" : "bg-gray-100 border-gray-300 hover:bg-gray-200"} border rounded`}
          >
            <Filter className="h-4 w-4" />
            <span className="text-xs">Filters</span>
            {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          <button
            type="submit"
            className={`px-3 py-1 ${isDarkMode ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-500"} text-white rounded text-sm`}
          >
            Search
          </button>
        </div>

        {showAdvanced && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-3 mb-4 ${isDarkMode ? "bg-[#121212] border-gray-700" : "bg-gray-100 border-gray-300"} border rounded`}
          >
            <div>
              <label className="block text-xs mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-2 py-1 text-sm ${isDarkMode ? "bg-[#1a1a1a] text-white border-gray-700" : "bg-white text-black border-gray-300"} border rounded`}
              >
                <option value="">Any category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs mb-1">Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className={`w-full px-2 py-1 text-sm ${isDarkMode ? "bg-[#1a1a1a] text-white border-gray-700" : "bg-white text-black border-gray-300"} border rounded`}
              >
                <option value="">Any tag</option>
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs mb-1">Author</label>
              <div className="relative">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className={`w-full px-2 py-1 pl-7 text-sm ${isDarkMode ? "bg-[#1a1a1a] text-white border-gray-700" : "bg-white text-black border-gray-300"} border rounded`}
                />
                <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">From</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className={`w-full px-2 py-1 pl-7 text-sm ${isDarkMode ? "bg-[#1a1a1a] text-white border-gray-700" : "bg-white text-black border-gray-300"} border rounded`}
                  />
                  <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1">To</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className={`w-full px-2 py-1 pl-7 text-sm ${isDarkMode ? "bg-[#1a1a1a] text-white border-gray-700" : "bg-white text-black border-gray-300"} border rounded`}
                  />
                  <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={clearSearch}
                className={`text-xs ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"}`}
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {searchHistory.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Recent searches:</div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => useHistoryItem(item)}
                  className={`text-xs px-2 py-1 ${isDarkMode ? "bg-[#121212] border-gray-700 hover:bg-gray-800" : "bg-gray-100 border-gray-300 hover:bg-gray-200"} border rounded`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
