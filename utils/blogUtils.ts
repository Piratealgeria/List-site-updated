import type { Post } from "../types/Post"
import { extractVideoId, getVideoThumbnail } from "./videoUtils"
import { blogData } from "../blogData"

// Function to get all posts
export function getAllPosts(): Post[] {
  try {
    // Return only blogData posts when running on the client side
    if (typeof window !== 'undefined') {
      const dataSourcePosts: Post[] = []

      // Process all categories from blogData
      if (blogData) {
        // Process featured posts
        if (blogData.featured && Array.isArray(blogData.featured)) {
          blogData.featured.forEach((post) => {
            if (post && post.id) {
              dataSourcePosts.push({
                ...post,
                content: post.excerpt || "No content available",
                readTime: post.readTime || "5 min read",
                likes: post.likes || Math.floor(Math.random() * 100),
                comments: post.comments || Math.floor(Math.random() * 20),
              })
            }
          })
        }

        // Process americas posts
        if (blogData.americas && Array.isArray(blogData.americas)) {
          blogData.americas.forEach((post) => {
            if (post && post.id) {
              dataSourcePosts.push({
                ...post,
                content: post.excerpt || "No content available",
                readTime: post.readTime || "5 min read",
                likes: post.likes || Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 20),
              })
            }
          })
        }

        // Process emea posts
        if (blogData.emea && Array.isArray(blogData.emea)) {
          blogData.emea.forEach((post) => {
            if (post && post.id) {
              dataSourcePosts.push({
                ...post,
                content: post.excerpt || "No content available",
                readTime: post.readTime || "5 min read",
                likes: post.likes || Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 20),
              })
            }
          })
        }

        // Process asiaPacific posts
        if (blogData.asiaPacific && Array.isArray(blogData.asiaPacific)) {
          blogData.asiaPacific.forEach((post) => {
            if (post && post.id) {
              dataSourcePosts.push({
                ...post,
                content: post.excerpt || "No content available",
                readTime: post.readTime || "5 min read",
                likes: post.likes || Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 20),
              })
            }
          })
        }
      }

      // Sort by date (newest first) and return
      return dataSourcePosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    // Server-side code will be handled by the server component
    return []
  } catch (error) {
    console.error("Error reading posts:", error)
    return []
  }
}

export async function getPostData(id?: string): Promise<Post | null> {
  try {
    if (!id) return null

    const allPosts = getAllPosts()
    return allPosts.find(post => post.id === id) || null
  } catch (error) {
    console.error(`Error getting post data for ${id}:`, error)
    return null
  }
}

export function calculateReadTime(content: string): string {
  try {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/g).length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  } catch (error) {
    console.error("Error calculating read time:", error)
    return "1 min read"
  }
}

export function getAllCategories(): string[] {
  try {
    const allPosts = getAllPosts()
    const categories = new Set<string>()

    allPosts.forEach((post) => {
      if (post.category) {
        categories.add(post.category)
      }
    })

    return Array.from(categories)
  } catch (error) {
    console.error("Error getting all categories:", error)
    return []
  }
}

export function getPostsByCategory(category?: string): Post[] {
  try {
    const allPosts = getAllPosts()

    // If category is "all" or empty, return all posts
    if (!category || category.toLowerCase() === "all") {
      return allPosts
    }

    return allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase())
  } catch (error) {
    console.error(`Error getting posts by category ${category}:`, error)
    return []
  }
}

export function searchPosts(query?: string): Post[] {
  try {
    if (!query) return getAllPosts()

    const allPosts = getAllPosts()
    const lowercaseQuery = query.toLowerCase()

    return allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  } catch (error) {
    console.error(`Error searching posts for query ${query}:`, error)
    return []
  }
}