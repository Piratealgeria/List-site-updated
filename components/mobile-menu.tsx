"use client"

import { useState } from "react"
import { Menu, X, Sun, Moon, Home, User, Tag, Archive } from "lucide-react"
import Link from "next/link"

interface MobileMenuProps {
  isDarkMode: boolean
  toggleTheme: () => void
}

export function MobileMenu({ isDarkMode, toggleTheme }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        onClick={toggleMenu}
        className={`p-1 rounded-sm ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-50">
          <div className={`w-4/5 max-w-xs h-full ${isDarkMode ? "bg-[#121212]" : "bg-[#f0f0f0]"} p-4 flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-yellow-500 font-bold">MrCherif</span>
              <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-1">
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  aria-label="Close menu"
                  onClick={toggleMenu}
                  className={`p-1 rounded-sm ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <nav className="flex-1">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>About</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <Tag className="h-4 w-4" />
                    <span>Categories</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/archive"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <Archive className="h-4 w-4" />
                    <span>Archive</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="pt-4 border-t border-gray-700 mt-auto">
              <div className="text-xs text-gray-400">© 2025 MrCherif</div>
            </div>
          </div>

          <div className="flex-1" onClick={toggleMenu} aria-hidden="true"></div>
        </div>
      )}
    </div>
  )
}
