import type { Metadata } from "next"

// Base metadata configuration
export const baseMetadata: Metadata = {
  metadataBase: new URL("https://mrcherif.com"),
  title: {
    default: "MrCherif Blog | Terminal-Style Tech Blog",
    template: "%s | MrCherif Blog",
  },
  description: "A terminal-style blog featuring tech insights, coding tips, and developer experiences",
  keywords: ["blog", "terminal", "tech", "coding", "developer", "programming"],
  authors: [{ name: "MrCherif" }],
  creator: "MrCherif",
  publisher: "MrCherif",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mrcherif.com",
    siteName: "MrCherif Blog",
    title: "MrCherif Blog | Terminal-Style Tech Blog",
    description: "A terminal-style blog featuring tech insights, coding tips, and developer experiences",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MrCherif Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MrCherif Blog | Terminal-Style Tech Blog",
    description: "A terminal-style blog featuring tech insights, coding tips, and developer experiences",
    images: ["/og-image.jpg"],
    creator: "@mrcherif",
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
    canonical: "https://mrcherif.com",
  },
  verification: {
    google: "google-site-verification-code", // Replace with your actual verification code
  },
}

// Helper function to generate page-specific metadata
export function generateMetadata(title: string, description?: string, image?: string, path?: string): Metadata {
  const url = path ? `https://mrcherif.com${path}` : "https://mrcherif.com"

  return {
    ...baseMetadata,
    title,
    description: description || baseMetadata.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description: description || (baseMetadata.description as string),
      url,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : baseMetadata.openGraph?.images,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description: description || (baseMetadata.description as string),
      images: image ? [image] : baseMetadata.twitter?.images,
    },
  }
}
