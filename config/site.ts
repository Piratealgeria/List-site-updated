// Site-wide configuration
export const siteConfig = {
  name: "Terminal Blog",
  author: "Your Name",
  description: "A personal blog with a terminal-inspired aesthetic",
  url: "https://your-site-url.com",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/yourusername", // Update with your Twitter if you have one
  },
  defaultTheme: "dark", // "dark" or "light"
}

// Enhanced metadata
export const metadataConfig = {
  metadataBase: new URL("https://your-site-url.com"),
  title: {
    default: "Terminal Blog | Personal Thoughts & Ideas",
    template: "%s | Terminal Blog",
  },
  description: "A personal blog with a terminal-inspired aesthetic",
  keywords: ["blog", "terminal", "personal", "thoughts", "ideas"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192" },
      { url: "/icon-512.png", sizes: "512x512" },
    ],
    shortcut: "/shortcut-icon.png",
    apple: [{ url: "/apple-icon.png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-site-url.com",
    siteName: "Terminal Blog",
    title: "Terminal Blog | Personal Thoughts & Ideas",
    description: "A personal blog with a terminal-inspired aesthetic",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Terminal Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terminal Blog | Personal Thoughts & Ideas",
    description: "A personal blog with a terminal-inspired aesthetic",
    images: ["/og-image.jpg"],
    creator: "@yourusername", // Update with your actual Twitter handle if you have one
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Terminal Blog",
  },
  verification: {
    // Remove placeholder verification codes
    google: null,
    yandex: null,
    bing: null,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://your-site-url.com",
  },
}
