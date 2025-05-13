"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  ChevronDown,
  X,
  Maximize2,
  Minus,
  MessageSquare,
  Star,
  Bell,
  HelpCircle,
  ChevronRight,
  Sun,
  Moon,
  ArrowUp,
} from "lucide-react"
import { Sparkline } from "./sparkline"
import { marketData } from "./marketData"
import { useMobile } from "../hooks/use-mobile"
import { MobileHeader } from "./mobile-header"

const fixedColumnClass = "w-[120px] sm:w-[140px] whitespace-nowrap overflow-hidden text-ellipsis"

export default function BloombergTerminal() {
  const [data, setData] = useState(marketData)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>("americas")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { isMobile, currentBreakpoint } = useMobile()

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)

    // Check scroll position for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDarkMode])

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const renderSection = useCallback(
    (title: string, items: any[], sectionNum: string, isDarkMode: boolean) => {
      const isActive = activeSection === title.toLowerCase()

      return (
        <>
          <tr
            className={`${isDarkMode ? "text-white bg-[#1a1a1a]" : "text-black bg-[#e6e6e6]"} cursor-pointer`}
            onClick={() => setActiveSection(isActive ? null : title.toLowerCase())}
            aria-expanded={isActive}
          >
            <th
              className={`sticky left-0 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"} px-2 py-1 text-left ${fixedColumnClass}`}
            >
              {sectionNum} {title}
            </th>
            <th colSpan={9} className="text-right pr-2">
              <ChevronDown className={`h-3 w-3 inline-block transition-transform ${isActive ? "" : "rotate-270"}`} />
            </th>
          </tr>

          {(isActive || !isMobile) &&
            items.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b ${isDarkMode ? "border-terminal-gray-800" : "border-gray-300"} 
                       ${index % 2 === 1 ? (isDarkMode ? "bg-[#141414]" : "bg-[#f5f5f5]") : ""}`}
              >
                <td
                  className={`sticky left-0 ${isDarkMode ? "bg-[#121212]" : "bg-[#f0f0f0]"} px-2 py-1 ${fixedColumnClass}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`${isDarkMode ? "text-gray-500" : "text-gray-600"} text-xs`}>{item.num}</span>
                    <span className="text-[#ff9800] text-xs">{item.id}</span>
                  </div>
                </td>
                <td className={`px-2 py-1 text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>
                  [□]
                </td>
                <td className={`px-2 py-1 w-[100px] ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"}`}>
                  <div className="flex justify-center">
                    <Sparkline
                      data1={[0.5, 0.6, 0.4, 0.7, 0.5, 0.8, 0.6, 0.7]}
                      data2={[0.7, 0.5, 0.8, 0.6, 0.9, 0.7, 1.0, 0.8]}
                      width={80}
                      height={20}
                      color1={isDarkMode ? "#666666" : "#999999"}
                      color2={item.change > 0 ? "#4CAF50" : "#EF4444"}
                    />
                  </div>
                </td>
                <td className={`px-2 py-1 text-right ${isDarkMode ? "text-yellow-100" : "text-yellow-800"} text-xs`}>
                  {item.value.toFixed(2)}
                </td>
                <td className={`px-2 py-1 text-right text-xs ${item.change > 0 ? "text-green-500" : "text-red-500"}`}>
                  {item.change > 0 ? "+" : ""}
                  {item.change.toFixed(2)}
                </td>
                <td
                  className={`px-2 py-1 text-right text-xs ${item.pctChange > 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {item.pctChange > 0 ? "+" : ""}
                  {item.pctChange.toFixed(2)}%
                </td>
                <td
                  className={`px-2 py-1 text-right text-xs ${item.avat > 0 ? "text-green-500" : "text-red-500"} hidden sm:table-cell`}
                >
                  {item.avat.toFixed(2)}%
                </td>
                <td
                  className={`px-2 py-1 text-right ${isDarkMode ? "text-yellow-100" : "text-yellow-800"} text-xs hidden sm:table-cell`}
                >
                  {item.time}
                </td>
                <td
                  className={`px-2 py-1 text-right text-xs ${item.ytd > 0 ? "text-green-500" : "text-red-500"} hidden md:table-cell`}
                >
                  {item.ytd.toFixed(2)}%
                </td>
                <td
                  className={`px-2 py-1 text-right text-xs ${item.ytdCur > 0 ? "text-green-500" : "text-red-500"} hidden md:table-cell`}
                >
                  {item.ytdCur.toFixed(2)}%
                </td>
              </tr>
            ))}
        </>
      )
    },
    [activeSection, isDarkMode, isMobile],
  )

  // Memoize rendered sections for performance
  const renderedSections = useMemo(() => {
    return (
      <>
        {renderSection("Americas", data.americas, "1)", isDarkMode)}
        {renderSection("EMEA", data.emea, "2)", isDarkMode)}
        {renderSection("Asia/Pacific", data.asiaPacific, "3)", isDarkMode)}
      </>
    )
  }, [data, isDarkMode, renderSection])

  return (
    <div className={`min-h-screen font-mono ${isDarkMode ? "bg-[#121212] text-white" : "bg-[#f0f0f0] text-black"}`}>
      {/* Mobile Header for small screens */}
      {isMobile && <MobileHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} title="Bloomberg Terminal" />}

      {/* Bloomberg Header - hide on mobile */}
      <div
        className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-2 py-1 flex items-center justify-between border-b ${isDarkMode ? "border-terminal-gray-800" : "border-gray-300"} ${isMobile ? "hidden" : ""}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-yellow-500 text-xs sm:text-sm">4-BLOOMBERG</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm`}>2-BLOOMBERG</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-yellow-500 px-2 py-0.5 text-black hidden sm:inline-block sm:text-sm">Tabs are here</span>
          <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm`}>= Options</span>
          <div className="flex gap-1">
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </div>
          <button
            onClick={toggleTheme}
            className="ml-2"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-3 w-3 sm:h-4 sm:w-4" /> : <Moon className="h-3 w-3 sm:h-4 sm:w-4" />}
          </button>
        </div>
      </div>

      {/* Function Buttons - optimized for mobile */}
      <div
        className={`flex flex-wrap gap-1 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"} px-2 py-1 text-xxs xs:text-xs sm:text-sm overflow-x-auto`}
      >
        <button className="bg-red-600 px-2 py-0.5 text-white">CANCL</button>
        <button className="bg-green-600 px-2 py-0.5 text-white">NEW</button>
        <button className="bg-green-600 px-2 py-0.5 text-white">BLANC</button>
        <button className="bg-green-600 px-2 py-0.5 text-white">NEWS</button>
        <button className="bg-green-600 px-2 py-0.5 text-white">GMOV</button>
        {!isMobile && (
          <>
            <button className="bg-green-600 px-2 py-0.5 text-white">GVOL</button>
            <button className="bg-green-600 px-2 py-0.5 text-white">RATC</button>
          </>
        )}
      </div>

      {/* Navigation Bar - simplified for mobile */}
      <div
        className={`flex items-center gap-2 border-b ${isDarkMode ? "border-terminal-gray-700 bg-[#1a1a1a]" : "border-gray-300 bg-[#e6e6e6]"} px-2 py-1 text-xxs xs:text-xs sm:text-sm overflow-x-auto`}
      >
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        {isMobile ? (
          <span className="truncate">Terminal Data</span>
        ) : (
          <>
            <span>No Security Loaded</span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>|</span>
            <span>WEI</span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Related Functions Menu</span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Message</span>
          {!isMobile && (
            <>
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            </>
          )}
          <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </div>

      {/* Filter Bar - simplified for mobile */}
      <div
        className={`flex flex-wrap items-center gap-2 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"} px-2 py-1 text-[#ff9800] text-xxs xs:text-xs sm:text-sm overflow-x-auto`}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold">Standard</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>

        {/* Mobile-optimized filters - show fewer on mobile */}
        {isMobile ? (
          <>
            <label className="flex items-center gap-1">
              <input type="checkbox" className="h-3 w-3 accent-gray-500" defaultChecked />
              <span>Δ AVAT</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="bg-[#ff9800] px-2 py-0.5 text-black">%Chg YTD</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </>
        ) : (
          <>
            <label className="flex items-center gap-1">
              <input type="checkbox" className="h-3 w-3 accent-gray-500" />
              <span>Movers</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" className="h-3 w-3 accent-gray-500" />
              <span>Volatility</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" className="h-3 w-3 accent-gray-500" />
              <span>Ratios</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" className="h-3 w-3 accent-gray-500" />
              <span>Futures</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" className="h-3 w-3 accent-gray-500" defaultChecked />
              <span>Δ AVAT</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="bg-[#ff9800] px-2 py-0.5 text-black">10D</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#ff9800] px-2 py-0.5 text-black">%Chg YTD</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#ff9800] px-2 py-0.5 text-black">CAD</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </>
        )}
      </div>

      {/* Main Content - use deferred loading for better performance */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className={`${isDarkMode ? "text-white bg-[#1a1a1a]" : "text-black bg-[#e6e6e6]"} sticky top-0 z-10`}>
              <th
                className={`sticky left-0 ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"} px-2 py-1 text-left ${fixedColumnClass}`}
              >
                Market
              </th>
              <th className="px-2 py-1 text-center">RMI</th>
              <th className={`px-2 py-1 text-center ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#e6e6e6]"}`}>2Day</th>
              <th className="px-2 py-1 text-right">Value</th>
              <th className="px-2 py-1 text-right">Net Chg</th>
              <th className="px-2 py-1 text-right">%Chg</th>
              <th className="px-2 py-1 text-right hidden sm:table-cell">Δ AVAT</th>
              <th className="px-2 py-1 text-right hidden sm:table-cell">Time</th>
              <th className="px-2 py-1 text-right hidden md:table-cell">%Ytd</th>
              <th className="px-2 py-1 text-right hidden md:table-cell">%YtdCur</th>
            </tr>
          </thead>
          <tbody>{renderedSections}</tbody>
        </table>
      </div>

      {/* Scroll to top button - only show when scrolled down */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-4 right-4 p-2 rounded-full shadow-lg 
                     ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}
                     focus:outline-none focus:ring-2 focus:ring-yellow-500`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
