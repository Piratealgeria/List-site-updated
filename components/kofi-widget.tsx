"use client"

import { useState } from "react"
import { Coffee, X } from "lucide-react"
import Link from "next/link"

interface KofiWidgetProps {
  username: string
  isDarkMode: boolean
}

export function KofiWidget({ username, isDarkMode }: KofiWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    setShowTooltip(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!isExpanded) {
      setTimeout(() => {
        setShowTooltip(true)
      }, 500)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowTooltip(false)
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 ${
        isExpanded ? "w-64" : "w-auto"
      } transition-all duration-300 ease-in-out`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip */}
      {showTooltip && !isExpanded && (
        <div
          className={`absolute bottom-full right-0 mb-2 p-2 rounded text-xs ${
            isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
          } shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-300"} whitespace-nowrap`}
        >
          Support on Ko-fi
          <div
            className={`absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
            } border-b border-r`}
          ></div>
        </div>
      )}

      {/* Main Widget */}
      <div
        className={`${
          isDarkMode ? "bg-[#1a1a1a] border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"
        } border rounded-md shadow-md overflow-hidden transition-all duration-300`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-2 ${
            isDarkMode ? "bg-black" : "bg-gray-100"
          } border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"} cursor-pointer`}
          onClick={toggleExpand}
        >
          <div className="flex items-center gap-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {isExpanded && (
              <span className="text-xs font-mono">{isDarkMode ? "$ support.sh" : "C:\\> support.cmd"}</span>
            )}
          </div>
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(false)
              }}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Content */}
        {isExpanded ? (
          <div className="p-3">
            <div className="mb-3 text-center">
              <h3 className="text-sm font-bold mb-1 font-mono">Support Viking Algeria</h3>
              <p className="text-xs mb-2">If you enjoy the content, consider buying me a coffee!</p>
              <div className="flex justify-center">
                <Coffee className={`${isDarkMode ? "text-blue-400" : "text-blue-600"} animate-bounce`} size={24} />
              </div>
            </div>

            {/* Terminal-style output */}
            <div
              className={`font-mono text-xs p-2 mb-3 rounded ${
                isDarkMode ? "bg-black text-green-400" : "bg-gray-100 text-green-700"
              } overflow-hidden`}
            >
              <div className="typing-animation">
                <p>&gt; Initializing support module...</p>
                <p>&gt; Connecting to Ko-fi...</p>
                <p>&gt; Ready to receive donations!</p>
                <p className="blink">_</p>
              </div>
            </div>

            {/* Ko-fi Button */}
            <Link
              href={`https://ko-fi.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded ${
                isDarkMode ? "bg-[#29abe0] hover:bg-[#1a8dbb] text-white" : "bg-[#29abe0] hover:bg-[#1a8dbb] text-white"
              } transition-colors duration-200`}
            >
              <Coffee size={16} />
              <span className="font-medium">Buy me a coffee</span>
            </Link>
          </div>
        ) : (
          <button
            onClick={toggleExpand}
            className={`p-2 ${
              isHovered ? (isDarkMode ? "bg-gray-800" : "bg-gray-100") : isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
            } transition-colors duration-200 flex items-center justify-center`}
            aria-label="Support on Ko-fi"
          >
            <Coffee size={20} className={`${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
          </button>
        )}
      </div>
    </div>
  )
}
