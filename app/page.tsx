import type { Metadata } from "next"
import { getAllPosts } from "../utils/blogUtils"
import BlogTerminal from "../components/blog-terminal"
import { baseMetadata } from "../utils/metadata"
import Script from "next/script"

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Viking Algeria | Video Archive & Resources",
  description: "Archive of videos, music lists, and anime references used in Viking Algeria YouTube and Odysee content",
  alternates: {
    canonical: "https://mrcherif.party",
  },
}

export default function Home() {
  // Get ALL posts without any filtering
  const allPosts = getAllPosts()

  // Log the number of posts for debugging
  console.log(`Total posts loaded at build time: ${allPosts.length}`)

  // Serialize ALL posts to pass to the client component
  const serializedPosts = JSON.stringify(allPosts)

  return (
    <>
      {/* Pass ALL posts to BlogTerminal */}
      <BlogTerminal initialPosts={serializedPosts} defaultCategory="all" />

      {/* Add structured data for blog and YouTube channel */}
      <Script
        id="schema-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Viking Algeria Blog",
            description:
              "Archive of videos, music lists, and anime references used in Viking Algeria YouTube and Odysee content",
            url: "https://mrcherif.party",
            author: {
              "@type": "Person",
              name: "Viking Algeria",
              sameAs: [
                "https://youtube.com/@VikingAlgeria",
                "https://odysee.com/@VikingAlgeria",
                "https://ko-fi.com/pirateyt",
              ],
            },
            publisher: {
              "@type": "Organization",
              name: "Viking Algeria",
              logo: {
                "@type": "ImageObject",
                url: "https://mrcherif.party/logo.png",
              },
            },
            blogPost: allPosts.slice(0, 10).map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: {
                "@type": "Person",
                name: post.author,
              },
              url: `https://mrcherif.party/posts/${post.id}`,
            })),
          }),
        }}
      />

      {/* Add YouTube channel structured data */}
      <Script
        id="schema-youtube"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "Viking Algeria YouTube Channel",
            description: "Viking Algeria creates anime mixes and content on YouTube and Odysee",
            thumbnailUrl: "https://mrcherif.party/thumbnail.jpg",
            uploadDate: "2023-01-01T08:00:00+08:00",
            contentUrl: "https://youtube.com/@VikingAlgeria",
            embedUrl: "https://youtube.com/@VikingAlgeria",
            interactionStatistic: {
              "@type": "InteractionCounter",
              interactionType: { "@type": "WatchAction" },
              userInteractionCount: 136000,
            },
            author: {
              "@type": "Person",
              name: "Viking Algeria",
              sameAs: [
                "https://youtube.com/@VikingAlgeria",
                "https://odysee.com/@VikingAlgeria",
                "https://ko-fi.com/pirateyt",
              ],
            },
          }),
        }}
      />
    </>
  )
}
