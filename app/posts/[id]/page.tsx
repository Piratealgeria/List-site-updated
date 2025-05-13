import type { Metadata } from "next"
import { getPostData, getAllPosts } from "../../../utils/blogUtils"
import PostContent from "../../../components/post-content"
import Script from "next/script"
import { blogData } from "../../../blogData"
import type { Post } from "../../../types/post"

// Generate metadata for each post
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPostData(params.id)

  if (!post) {
    return generateMetadata("Post Not Found", "The requested blog post could not be found.")
  }

  return generateMetadata(post.title, post.excerpt, post.image || "/og-image.jpg", `/posts/${params.id}`)
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    id: post.id,
  }))
}

function getPostFromBlogData(id: string): Post | null {
  // Check featured posts
  const featuredPost = blogData.featured?.find((post) => post.id === id)
  if (featuredPost) {
    return {
      ...featuredPost,
      content: featuredPost.excerpt,
      readTime: featuredPost.readTime || "5 min read",
    }
  }

  // Check americas posts
  const americasPost = blogData.americas?.find((post) => post.id === id)
  if (americasPost) {
    return {
      ...americasPost,
      content: americasPost.excerpt,
      readTime: americasPost.readTime || "5 min read",
    }
  }

  // Check emea posts
  const emeaPost = blogData.emea?.find((post) => post.id === id)
  if (emeaPost) {
    return {
      ...emeaPost,
      content: emeaPost.excerpt,
      readTime: emeaPost.readTime || "5 min read",
    }
  }

  // Check asiaPacific posts
  const asiaPacificPost = blogData.asiaPacific?.find((post) => post.id === id)
  if (asiaPacificPost) {
    return {
      ...asiaPacificPost,
      content: asiaPacificPost.excerpt,
      readTime: asiaPacificPost.readTime || "5 min read",
    }
  }

  return null
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = (await getPostData(params.id)) || getPostFromBlogData(params.id)

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <>
      <PostContent post={post} />

      {/* Add structured data for the blog post */}
      <Script
        id="schema-blog-post"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.image || "/og-image.jpg",
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Person",
              name: post.author,
            },
            publisher: {
              "@type": "Organization",
              name: "MrCherif Blog",
              logo: {
                "@type": "ImageObject",
                url: "https://mrcherif.com/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://mrcherif.com/posts/${post.id}`,
            },
            keywords: post.tags.join(", "),
          }),
        }}
      />
    </>
  )
}
