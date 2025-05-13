"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
  storageKey?: string
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
}

const initialState: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
  isDarkMode: true,
}

const ThemeContext = createContext<ThemeContextType>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme-preference",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (enableSystem) {
      setTheme("system")
    }
  }, [enableSystem, storageKey])

  useEffect(() => {
    const applyTheme = (newTheme: Theme) => {
      const root = document.documentElement
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      const resolvedTheme = newTheme === "system" ? systemTheme : newTheme

      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)
      document.body.classList.remove("light", "dark")
      document.body.classList.add(resolvedTheme)

      setIsDarkMode(resolvedTheme === "dark")
    }

    applyTheme(theme)

    // Listen for system theme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        applyTheme("system")
      }
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  return <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
