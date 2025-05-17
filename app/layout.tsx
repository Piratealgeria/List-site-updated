import type React from "react"
import "./globals.css"
import { Rubik } from "next/font/google"
import { Analytics } from "../utils/analytics"
import AccessibilitySettings from "../components/accessibility-settings"
import NewsTicker from "../components/news-ticker"
import { newsItems } from "../config/news"
import { metadataConfig } from "../config/site"
import { themeConfig } from "../config/theme"
import { VercelAnalytics } from "../components/vercel-analytics"
import { Suspense } from "react"

// Initialize Rubik font for Arabic text
const rubik = Rubik({
  subsets: ["latin", "arabic"],
  variable: "--font-rubik",
  display: "swap",
})

// Use the metadata config
export const metadata = metadataConfig

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDarkMode = themeConfig.defaultTheme === "dark" // Using the theme config

  return (
    <html lang="en" className={rubik.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </main>

          {/* News Ticker */}
          <div
            className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} border-t ${isDarkMode ? "border-terminal-gray-800" : "border-gray-300"}`}
          >
            <NewsTicker items={newsItems} isDarkMode={isDarkMode} />
          </div>
        </div>

        <AccessibilitySettings isDarkMode={isDarkMode} />

        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  )
}