"use client"

import { useState } from "react"
import { Bug, X } from "lucide-react"

interface DebugPanelProps {
  data: any
  title?: string
  isDarkMode?: boolean
}

export function DebugPanel({ data, title = "Debug Info", isDarkMode = true }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-16 right-4 p-2 rounded-full shadow-lg z-50
                  ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}
                  focus:outline-none focus:ring-1 focus:ring-yellow-500`}
        aria-label="Debug panel"
      >
        <Bug className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              isDarkMode ? "bg-[#1a1a1a] text-white" : "bg-white text-black"
            } rounded-md shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-sm ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <pre className="text-xs overflow-auto max-h-[70vh]">{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
