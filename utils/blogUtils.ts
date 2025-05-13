import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Post } from "../types/Post"
// Add import for video utilities
import { extractVideoId, getVideoThumbnail } from "./videoUtils"
import { blogData } from "../blogData"

// Function to get all posts from the posts directory
export function getAllPosts(): Post[] {
  try {
    const postsDirectory = path.join(process.cwd(), "posts")
    let markdownPosts: Post[] = []

    // Check if the directory exists before trying to read it
    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory)

      // Get posts from markdown files
      markdownPosts = fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => {
          // Remove ".md" from file name to get id
          const id = fileName.replace(/\.md$/, "")

          // Read markdown file as string
          const fullPath = path.join(postsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, "utf8")

          // Use gray-matter to parse the post metadata section
          const matterResult = matter(fileContents)

          // Check if there's a video URL in the frontmatter
          const videoUrl = matterResult.data.videoUrl || null
          let image = matterResult.data.image || null

          // If there's a video but no image, use the video thumbnail
          if (videoUrl && !image) {
            const videoData = extractVideoId(videoUrl)
            if (videoData) {
              image = getVideoThumbnail(videoData)
            }
          }

          // Combine the data with the id
          return {
            id,
            title: matterResult.data.title || "Untitled Post",
            excerpt: matterResult.data.excerpt || "No excerpt available",
            author: matterResult.data.author || "Anonymous",
            date: matterResult.data.date || new Date().toISOString(),
            category: matterResult.data.category || "Uncategorized",
            tags: matterResult.data.tags || [],
            content: matterResult.content,
            image: image,
            videoUrl: videoUrl,
            readTime: calculateReadTime(matterResult.content),
            likes: Math.floor(Math.random() * 100), // Add random likes for demo
            comments: Math.floor(Math.random() * 20), // Add random comments for demo
          }
        })
    }

    // Get posts from blogData.ts
    const dataSourcePosts: Post[] = []

    // Process all categories from blogData
    if (blogData) {
      // Process featured posts
      if (blogData.featured && Array.isArray(blogData.featured)) {
        blogData.featured.forEach((post) => {
          dataSourcePosts.push({
            ...post,
            content: post.excerpt || "No content available",
            readTime: post.readTime || "5 min read",
            likes: post.likes || Math.floor(Math.random() * 100),
            comments: post.comments || Math.floor(Math.random() * 20),
          })
        })
      }

      // Process americas posts
      if (blogData.americas && Array.isArray(blogData.americas)) {
        blogData.americas.forEach((post) => {
          dataSourcePosts.push({
            ...post,
            content: post.excerpt || "No content available",
            readTime: post.readTime || "5 min read",
            likes: post.likes || Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20),
          })
        })
      }

      // Process emea posts
      if (blogData.emea && Array.isArray(blogData.emea)) {
        blogData.emea.forEach((post) => {
          dataSourcePosts.push({
            ...post,
            content: post.excerpt || "No content available",
            readTime: post.readTime || "5 min read",
            likes: post.likes || Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20),
          })
        })
      }

      // Process asiaPacific posts
      if (blogData.asiaPacific && Array.isArray(blogData.asiaPacific)) {
        blogData.asiaPacific.forEach((post) => {
          dataSourcePosts.push({
            ...post,
            content: post.excerpt || "No content available",
            readTime: post.readTime || "5 min read",
            likes: post.likes || Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20),
          })
        })
      }
    }

    // Combine both sources of posts
    const allPosts = [...markdownPosts, ...dataSourcePosts]

    // Remove any duplicate posts (based on id)
    const uniquePosts = Array.from(new Map(allPosts.map((post) => [post.id, post])).values())

    // Sort by date (newest first)
    return uniquePosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error reading posts:", error)
    return []
  }
}

export function getPostData(id: string): Post | null {
  try {
    const postsDirectory = path.join(process.cwd(), "posts")
    const fullPath = path.join(postsDirectory, `${id}.md`)

    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const matterResult = matter(fileContents)

      // Check if there's a video URL in the frontmatter
      const videoUrl = matterResult.data.videoUrl || null
      let image = matterResult.data.image || null

      // If there's a video but no image, use the video thumbnail
      if (videoUrl && !image) {
        const videoData = extractVideoId(videoUrl)
        if (videoData) {
          image = getVideoThumbnail(videoData)
        }
      }

      return {
        id,
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt,
        author: matterResult.data.author,
        date: matterResult.data.date,
        category: matterResult.data.category,
        tags: matterResult.data.tags || [],
        content: matterResult.content,
        image: image,
        videoUrl: videoUrl,
        readTime: calculateReadTime(matterResult.content),
      }
    }
  } catch (error) {
    console.error(`Error reading post ${id}:`, error)
  }

  return null
}

export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/g).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

export function getAllCategories(): string[] {
  const allPosts = getAllPosts()
  const categories = new Set<string>()

  allPosts.forEach((post) => {
    if (post.category) {
      categories.add(post.category)
    }
  })

  return Array.from(categories)
}

export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts()

  // If category is "all" or empty, return all posts
  if (!category || category.toLowerCase() === "all") {
    return allPosts
  }

  return allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase())
}

export function searchPosts(query: string): Post[] {
  if (!query) return getAllPosts()

  const allPosts = getAllPosts()
  const lowercaseQuery = query.toLowerCase()

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
