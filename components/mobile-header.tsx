"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon } from "lucide-react"

interface MobileHeaderProps {
  isDarkMode: boolean
  toggleTheme: () => void
  title?: string
}

export function MobileHeader({ isDarkMode, toggleTheme, title = "MrCherif" }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <header
        className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} 
                  px-2 py-1 flex items-center justify-between sticky top-0 z-50 w-full`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMenu}
            className="p-1 md:hidden rounded-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 text-yellow-500" />
          </button>
          <Link href="/" className="text-yellow-500 text-base font-medium hover:underline whitespace-nowrap">
            {title}
          </Link>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 md:hidden" onClick={toggleMenu}>
          <div
            className={`${isDarkMode ? "bg-[#121212] text-white" : "bg-white text-black"} 
                      h-full w-3/4 max-w-xs p-4 shadow-lg`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-yellow-500 font-bold">Menu</h2>
              <button
                onClick={toggleMenu}
                className="p-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-4">
              <Link
                href="/"
                className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-sm text-sm"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-sm text-sm"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-sm text-sm"
                onClick={toggleMenu}
              >
                Categories
              </Link>
              <Link
                href="/archive"
                className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-sm text-sm"
                onClick={toggleMenu}
              >
                Archive
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
