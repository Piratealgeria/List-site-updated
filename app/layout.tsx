import type React from "react"
import "./globals.css"
import { Rubik } from "next/font/google"
import { Analytics } from "../utils/analytics"
import Script from "next/script"
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

        {/* Register Service Worker with improved caching */}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async function() {
                  try {
                    const registration = await navigator.serviceWorker.register('/service-worker.js', {
                      scope: '/'
                    });
                    
                    // Check for updates every hour
                    setInterval(() => {
                      registration.update();
                    }, 60 * 60 * 1000);

                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                          // New content is available, show refresh prompt
                          if (confirm('New content is available! Click OK to refresh.')) {
                            window.location.reload();
                          }
                        }
                      });
                    });

                  } catch (error) {
                    console.error('ServiceWorker registration failed:', error);
                  }
                });
              }
            `,
          }}
        />

        <Analytics />
        <VercelAnalytics />
      </body>
    </html>
  )
}
