"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import GiscusConfig from "../../../components/giscus-config"

export default function CommentsSetupPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Load theme preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("terminal-theme")
      setIsDarkMode(savedTheme === "light" ? false : true)
    }
  }, [])

  // Apply theme
  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)
  }, [isDarkMode])

  return (
    <div className={`min-h-screen font-mono ${isDarkMode ? "bg-[#121212] text-white" : "bg-[#f0f0f0] text-black"}`}>
      {/* Header */}
      <div className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-4 py-2 flex items-center`}>
        <Link href="/" className="flex items-center text-[#ff9800]">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
        <h1 className="text-lg font-bold ml-4">Giscus Comments Setup</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto mt-8 px-4 pb-16">
        <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
          Set Up Giscus Comments
        </h1>

        <div className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border p-6 mb-6`}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
            What is Giscus?
          </h2>

          <p className="mb-4">
            Giscus is a comments system powered by GitHub Discussions. It allows visitors to leave comments and
            reactions on your website via GitHub.
          </p>

          <h2 className={`text-xl font-bold mb-4 mt-6 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
            Setup Instructions
          </h2>

          <ol className="list-decimal pl-5 space-y-4 mb-6">
            <li>
              <strong>Install the Giscus GitHub App</strong>
              <p className="mt-1">
                First, install the{" "}
                <a
                  href="https://github.com/apps/giscus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Giscus GitHub App
                </a>{" "}
                on the repository you want to use for comments.
              </p>
            </li>

            <li>
              <strong>Enable Discussions</strong>
              <p className="mt-1">Make sure Discussions are enabled in your repository settings.</p>
            </li>

            <li>
              <strong>Get Configuration Details</strong>
              <p className="mt-1">
                Visit{" "}
                <a
                  href="https://giscus.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  giscus.app
                </a>{" "}
                to generate your configuration. You'll need:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Repository name (username/repo)</li>
                <li>Repository ID</li>
                <li>Discussion category</li>
                <li>Category ID</li>
              </ul>
            </li>

            <li>
              <strong>Configure Your Site</strong>
              <p className="mt-1">Use the configuration tool below to generate the code for your site.</p>
            </li>
          </ol>
        </div>

        <GiscusConfig isDarkMode={isDarkMode} />
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
