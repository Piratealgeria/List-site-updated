"use client"

import { useState, useEffect } from "react"
import { Settings, Eye, Type, ZoomIn, Contrast, Check, X } from "lucide-react"

interface AccessibilitySettingsProps {
  isDarkMode: boolean
}

export default function AccessibilitySettings({ isDarkMode }: AccessibilitySettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100) // percentage
  const [contrast, setContrast] = useState("default")
  const [reducedMotion, setReducedMotion] = useState(false)
  const [dyslexicFont, setDyslexicFont] = useState(false)

  // Load saved settings
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedSettings = localStorage.getItem("accessibility_settings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setFontSize(settings.fontSize || 100)
        setContrast(settings.contrast || "default")
        setReducedMotion(settings.reducedMotion || false)
        setDyslexicFont(settings.dyslexicFont || false)

        // Apply settings immediately on load
        applySettings(settings)
      } catch (error) {
        console.error("Error parsing accessibility settings:", error)
      }
    }
  }, [])

  const applySettings = (settings: any) => {
    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize || 100}%`

    // Apply contrast
    document.body.classList.remove("high-contrast", "low-contrast")
    if (settings.contrast === "high") {
      document.body.classList.add("high-contrast")
    } else if (settings.contrast === "low") {
      document.body.classList.add("low-contrast")
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.body.classList.add("reduce-motion")
    } else {
      document.body.classList.remove("reduce-motion")
    }

    // Apply dyslexic font
    if (settings.dyslexicFont) {
      document.body.classList.add("dyslexic-font")
    } else {
      document.body.classList.remove("dyslexic-font")
    }
  }

  const saveSettings = () => {
    const settings = {
      fontSize,
      contrast,
      reducedMotion,
      dyslexicFont,
    }

    localStorage.setItem("accessibility_settings", JSON.stringify(settings))
    applySettings(settings)
    setIsOpen(false)
  }

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 100,
      contrast: "default",
      reducedMotion: false,
      dyslexicFont: false,
    }

    setFontSize(defaultSettings.fontSize)
    setContrast(defaultSettings.contrast)
    setReducedMotion(defaultSettings.reducedMotion)
    setDyslexicFont(defaultSettings.dyslexicFont)

    localStorage.setItem("accessibility_settings", JSON.stringify(defaultSettings))
    applySettings(defaultSettings)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 left-4 p-2 rounded-none shadow-lg z-50
                  ${isDarkMode ? "bg-[#1a1a1a] text-white border border-gray-700" : "bg-white text-black border border-gray-300"}
                  focus:outline-none focus:ring-1 focus:ring-yellow-500 hover:bg-opacity-90`}
        aria-label="Accessibility settings"
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${isDarkMode ? "bg-[#1a1a1a] text-white border-gray-700" : "bg-white text-black border-gray-300"} 
                      border rounded-none shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto font-mono`}
            role="dialog"
            aria-labelledby="accessibility-title"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 id="accessibility-title" className="text-lg font-bold flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span className={isDarkMode ? "text-yellow-100" : "text-yellow-800"}>Accessibility Settings</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-none ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                aria-label="Close accessibility settings"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Font Size */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ZoomIn className="h-4 w-4" />
                  <h3 className={`font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>Text Size</h3>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setFontSize(Math.max(70, fontSize - 10))}
                    className={`px-3 py-1 ${isDarkMode ? "bg-[#121212] border-gray-700" : "bg-gray-100 border-gray-300"} border rounded-none text-sm`}
                    aria-label="Decrease text size"
                  >
                    A-
                  </button>
                  <div className="flex-grow">
                    <input
                      type="range"
                      min="70"
                      max="200"
                      step="10"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className={`w-full ${isDarkMode ? "accent-yellow-500" : "accent-yellow-600"}`}
                      aria-label="Text size"
                    />
                  </div>
                  <button
                    onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                    className={`px-3 py-1 ${isDarkMode ? "bg-[#121212] border-gray-700" : "bg-gray-100 border-gray-300"} border rounded-none text-sm`}
                    aria-label="Increase text size"
                  >
                    A+
                  </button>
                </div>
                <div className="text-center text-sm mt-1">{fontSize}%</div>
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Contrast className="h-4 w-4" />
                  <h3 className={`font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>Contrast</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setContrast("default")}
                    className={`px-3 py-2 rounded-none text-sm flex items-center justify-center gap-1 border
                              ${
                                contrast === "default"
                                  ? isDarkMode
                                    ? "bg-green-700 text-white border-green-600"
                                    : "bg-green-600 text-white border-green-500"
                                  : isDarkMode
                                    ? "bg-[#121212] border-gray-700"
                                    : "bg-gray-100 border-gray-300"
                              }`}
                  >
                    {contrast === "default" && <Check className="h-3 w-3" />}
                    Default
                  </button>
                  <button
                    onClick={() => setContrast("high")}
                    className={`px-3 py-2 rounded-none text-sm flex items-center justify-center gap-1 border
                              ${
                                contrast === "high"
                                  ? isDarkMode
                                    ? "bg-green-700 text-white border-green-600"
                                    : "bg-green-600 text-white border-green-500"
                                  : isDarkMode
                                    ? "bg-[#121212] border-gray-700"
                                    : "bg-gray-100 border-gray-300"
                              }`}
                  >
                    {contrast === "high" && <Check className="h-3 w-3" />}
                    High
                  </button>
                  <button
                    onClick={() => setContrast("low")}
                    className={`px-3 py-2 rounded-none text-sm flex items-center justify-center gap-1 border
                              ${
                                contrast === "low"
                                  ? isDarkMode
                                    ? "bg-green-700 text-white border-green-600"
                                    : "bg-green-600 text-white border-green-500"
                                  : isDarkMode
                                    ? "bg-[#121212] border-gray-700"
                                    : "bg-gray-100 border-gray-300"
                              }`}
                  >
                    {contrast === "low" && <Check className="h-3 w-3" />}
                    Low
                  </button>
                </div>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>Reduce Motion</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={() => setReducedMotion(!reducedMotion)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 ${
                      isDarkMode ? "bg-[#121212] border-gray-700" : "bg-gray-100 border-gray-300"
                    } border peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:${
                      isDarkMode ? "bg-green-700" : "bg-green-600"
                    }`}
                  ></div>
                </label>
              </div>

              {/* Dyslexic Font */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <h3 className={`font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
                    Dyslexia-friendly Font
                  </h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dyslexicFont}
                    onChange={() => setDyslexicFont(!dyslexicFont)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 ${
                      isDarkMode ? "bg-[#121212] border-gray-700" : "bg-gray-100 border-gray-300"
                    } border peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:${
                      isDarkMode ? "bg-green-700" : "bg-green-600"
                    }`}
                  ></div>
                </label>
              </div>
            </div>

            <div className="flex justify-between p-4 border-t border-gray-700">
              <button
                onClick={resetSettings}
                className={`px-4 py-2 ${
                  isDarkMode
                    ? "bg-[#121212] hover:bg-gray-800 border-gray-700"
                    : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                } border rounded-none`}
              >
                Reset
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 ${
                    isDarkMode
                      ? "bg-[#121212] hover:bg-gray-800 border-gray-700"
                      : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                  } border rounded-none`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className={`px-4 py-2 ${
                    isDarkMode ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-700"
                  } text-white border border-green-600 rounded-none`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
