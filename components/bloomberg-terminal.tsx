"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useDebounce } from "use-debounce"

import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { WebLinksAddon } from "xterm-addon-web-links"
import { Unicode11Addon } from "xterm-addon-unicode11"
import { SearchAddon } from "xterm-addon-search"
import { LigaturesAddon } from "xterm-addon-ligatures"
import { AttachAddon } from "xterm-addon-attach"

import "xterm/css/xterm.css"

const BloombergTerminal = () => {
  const terminalRef = useRef(null)
  const xtermRef = useRef(null)
  const fitAddon = useRef(null)
  const webLinksAddon = useRef(null)
  const unicode11Addon = useRef(null)
  const searchAddon = useRef(null)
  const ligaturesAddon = useRef(null)
  const attachAddon = useRef(null)

  const [isTerminalReady, setIsTerminalReady] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [fontFamily, setFontFamily] = useState(
    'ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  )
  const [cursorStyle, setCursorStyle] = useState("block")
  const [cursorBlink, setCursorBlink] = useState(true)
  const [lineHeight, setLineHeight] = useState(1)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [themeType, setThemeType] = useState("dark")
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      // Get saved preference or default to true (dark mode)
      const savedTheme = localStorage.getItem("terminal-theme")
      return savedTheme === "light" ? false : true
    }
    return true // Default to dark mode on server
  })
  const [termTheme, setTermTheme] = useState({
    background: isDarkMode ? "#000000" : "#FFFFFF",
    foreground: isDarkMode ? "#F8F8F8" : "#333333",
    cursor: isDarkMode ? "#F8F8F8" : "#333333",
    cursorAccent: isDarkMode ? "#000000" : "#FFFFFF",
    selectionBackground: "rgba(255,255,255,0.3)",
    black: "#000000",
    red: "#C83A3A",
    green: "#5F854F",
    yellow: "#E5E510",
    blue: "#399BCB",
    magenta: "#C63EC6",
    cyan: "#399BCB",
    white: "#FFFFFF",
    brightBlack: "#666666",
    brightRed: "#FF0000",
    brightGreen: "#00FF00",
    brightYellow: "#FFFF00",
    brightBlue: "#0000FF",
    brightMagenta: "#FF00FF",
    brightCyan: "#00FFFF",
    brightWhite: "#FFFFFF",
  })

  const [debouncedFontSize] = useDebounce(fontSize, 500)
  const [debouncedFontFamily] = useDebounce(fontFamily, 500)
  const [debouncedCursorStyle] = useDebounce(cursorStyle, 500)
  const [debouncedCursorBlink] = useDebounce(cursorBlink, 500)
  const [debouncedLineHeight] = useDebounce(lineHeight, 500)
  const [debouncedLetterSpacing] = useDebounce(letterSpacing, 500)

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const newTheme = !prev
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("terminal-theme", newTheme ? "dark" : "light")
      }
      return newTheme
    })
  }, [])

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev)
  }, [])

  const handleFontSizeChange = useCallback((e) => {
    setFontSize(Number.parseInt(e.target.value))
  }, [])

  const handleFontFamilyChange = useCallback((e) => {
    setFontFamily(e.target.value)
  }, [])

  const handleCursorStyleChange = useCallback((e) => {
    setCursorStyle(e.target.value)
  }, [])

  const handleCursorBlinkChange = useCallback((e) => {
    setCursorBlink(e.target.checked)
  }, [])

  const handleLineHeightChange = useCallback((e) => {
    setLineHeight(Number.parseFloat(e.target.value))
  }, [])

  const handleLetterSpacingChange = useCallback((e) => {
    setLetterSpacing(Number.parseFloat(e.target.value))
  }, [])

  useEffect(() => {
    setTermTheme({
      background: isDarkMode ? "#000000" : "#FFFFFF",
      foreground: isDarkMode ? "#F8F8F8" : "#333333",
      cursor: isDarkMode ? "#F8F8F8" : "#333333",
      cursorAccent: isDarkMode ? "#000000" : "#FFFFFF",
      selectionBackground: "rgba(255,255,255,0.3)",
      black: "#000000",
      red: "#C83A3A",
      green: "#5F854F",
      yellow: "#E5E510",
      blue: "#399BCB",
      magenta: "#C63EC6",
      cyan: "#399BCB",
      white: "#FFFFFF",
      brightBlack: "#666666",
      brightRed: "#FF0000",
      brightGreen: "#00FF00",
      brightYellow: "#FFFF00",
      brightBlue: "#0000FF",
      brightMagenta: "#FF00FF",
      brightCyan: "#00FFFF",
      brightWhite: "#FFFFFF",
    })
  }, [isDarkMode])

  useEffect(() => {
    const terminal = xtermRef.current
    if (!terminal) {
      const term = new Terminal({
        cursorBlink: cursorBlink,
        cursorStyle: cursorStyle,
        fontFamily: fontFamily,
        fontSize: fontSize,
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
        theme: termTheme,
      })

      xtermRef.current = term

      fitAddon.current = new FitAddon()
      webLinksAddon.current = new WebLinksAddon()
      unicode11Addon.current = new Unicode11Addon()
      searchAddon.current = new SearchAddon()
      ligaturesAddon.current = new LigaturesAddon()
      attachAddon.current = new AttachAddon()

      term.loadAddon(fitAddon.current)
      term.loadAddon(webLinksAddon.current)
      term.loadAddon(unicode11Addon.current)
      term.loadAddon(searchAddon.current)
      term.loadAddon(ligaturesAddon.current)
      // term.loadAddon(attachAddon.current)

      term.open(terminalRef.current)

      fitAddon.current.fit()

      setIsTerminalReady(true)

      // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
      term.write("Connecting to server...\r\n")
      term.write("Connected!\r\n")
      term.write("Welcome to the Bloomberg Terminal!\r\n")
      term.write('Type "help" to get started.\r\n')
      term.write(">")
    }

    const resizeObserver = new ResizeObserver(() => {
      fitAddon?.current?.fit()
    })

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current)
    }

    return () => {
      resizeObserver.disconnect()
      terminal?.dispose()
    }
  }, [])

  useEffect(() => {
    if (isTerminalReady) {
      xtermRef.current.setOption("fontSize", debouncedFontSize)
    }
  }, [debouncedFontSize, isTerminalReady])

  useEffect(() => {
    if (isTerminalReady) {
      xtermRef.current.setOption("fontFamily", debouncedFontFamily)
    }
  }, [debouncedFontFamily, isTerminalReady])

  useEffect(() => {
    if (isTerminalReady) {
      xtermRef.current.setOption("cursorStyle", debouncedCursorStyle)
    }
  }, [debouncedCursorStyle, isTerminalReady])

  useEffect(() => {
    if (isTerminalReady) {
      xtermRef.current.setOption("cursorBlink", debouncedCursorBlink)
    }
  }, [debouncedCursorBlink, isTerminalReady])

  useEffect(() => {
    if (isTerminalReady) {
      xtermRef.current.setOption("lineHeight", debouncedLineHeight)
    }
  }, [debouncedLineHeight, isTerminalReady])

  useEffect(() => {
    if (isTerminalReady) {
      xtermRef.current.setOption("letterSpacing", debouncedLetterSpacing)
    }
  }, [debouncedLetterSpacing, isTerminalReady])

  useEffect(() => {
    if (isTerminalReady) {
      xtermRef.current.setOption("theme", termTheme)
    }
  }, [termTheme, isTerminalReady])

  useHotkeys("ctrl+`", toggleSettings)

  return (
    <div className="relative flex flex-col h-full w-full">
      <div className="flex justify-between items-center p-2 bg-gray-800 text-white">
        <div className="font-bold">Bloomberg Terminal</div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="hover:text-gray-300">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={toggleSettings} className="hover:text-gray-300">
            Settings
          </button>
        </div>
      </div>

      <div className="terminal-container flex-grow relative" ref={terminalRef}></div>

      {isSettingsOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-700 p-4 rounded-md shadow-lg w-96">
            <h2 className="text-white font-bold mb-4">Terminal Settings</h2>

            <div className="mb-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">Font Size:</label>
              <input
                type="number"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">Font Family:</label>
              <input
                type="text"
                value={fontFamily}
                onChange={handleFontFamilyChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">Cursor Style:</label>
              <select
                value={cursorStyle}
                onChange={handleCursorStyleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="block">Block</option>
                <option value="underline">Underline</option>
                <option value="bar">Bar</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">Cursor Blink:</label>
              <input
                type="checkbox"
                checked={cursorBlink}
                onChange={handleCursorBlinkChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">Line Height:</label>
              <input
                type="number"
                step="0.1"
                value={lineHeight}
                onChange={handleLineHeightChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-2">
              <label className="block text-gray-300 text-sm font-bold mb-2">Letter Spacing:</label>
              <input
                type="number"
                step="0.1"
                value={letterSpacing}
                onChange={handleLetterSpacingChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={toggleSettings}
                className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BloombergTerminal
