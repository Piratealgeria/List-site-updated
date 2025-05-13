"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Sun, Moon } from "lucide-react"
import Link from "next/link"
import ChannelShowcase from "./channel-showcase"

export default function AboutContent() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Get saved preference or default to true (dark mode)
      const savedTheme = localStorage.getItem("terminal-theme")
      return savedTheme === "light" ? false : true
    }
    return true // Default to dark mode on server
  })

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
            About MrCherif
          </Link>
        </div>
        <button onClick={toggleTheme} className="ml-2">
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-3xl mx-auto mt-8 px-4 pb-16">
        <article className="prose dark:prose-invert max-w-none">
          <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
            About MrCherif
          </h1>

          <div className="mb-8">
            <ChannelShowcase />
          </div>

          <div className="mb-8">
            <div className="w-full max-w-2xl mx-auto mb-6 overflow-hidden">
              <img
                src="https://i.pinimg.com/originals/ed/23/9d/ed239ddc0e23afd424de14db792c6bf8.gif"
                alt="Terminal Animation"
                className="w-full h-auto rounded-md border-2 border-gray-700"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-center mb-4">
              <img
                src="/placeholder.svg?height=300&width=300"
                alt="MrCherif"
                className="w-24 h-24 rounded-full border-2 border-gray-700"
              />
            </div>
            <p className="text-center text-sm italic">Terminal enthusiast, code craftsman, and digital explorer</p>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4">Who Am I?</h2>
          <p>
            Hello! I'm MrCherif, a software developer with a passion for terminal-based interfaces and efficient coding
            practices. With over 10 years of experience in the tech industry, I've worked on everything from low-level
            systems programming to modern web applications.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">My Journey</h2>
          <p>
            My journey in technology began when I was just 12 years old, tinkering with my first computer. What started
            as curiosity quickly evolved into a lifelong passion. I studied Computer Science at MIT, where I developed a
            deep appreciation for elegant algorithms and efficient code.
          </p>
          <p>
            After graduation, I worked at several tech companies, including Google and Microsoft, before deciding to
            venture out on my own as an independent consultant and educator.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Why This Blog?</h2>
          <p>
            This blog is my way of sharing knowledge, insights, and experiences with the wider developer community. I
            believe in the power of terminal-based tools and interfaces for their efficiency, speed, and flexibility.
            Through this platform, I hope to inspire others to embrace the command line and discover the joy of working
            with text-based interfaces.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Beyond Coding</h2>
          <p>
            When I'm not in front of a computer, you can find me hiking in the mountains, practicing photography, or
            exploring new cuisines. I'm also an avid reader and enjoy science fiction, philosophy, and technical
            literature.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Connect With Me</h2>
          <p>
            I'm always open to connecting with fellow developers and technology enthusiasts. Feel free to reach out
            through any of the following channels:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>
              Email:{" "}
              <a href="mailto:contact@mrcherif.com" className="text-blue-500 hover:underline">
                contact@mrcherif.com
              </a>
            </li>
            <li>
              Twitter:{" "}
              <a
                href="https://twitter.com/mrcherif"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                @mrcherif
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/mrcherif"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                mrcherif
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a
                href="https://linkedin.com/in/mrcherif"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                MrCherif
              </a>
            </li>
          </ul>
        </article>
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
