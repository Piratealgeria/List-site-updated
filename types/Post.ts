export interface Post {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  tags: string[]
  content: string
  image?: string
  videoUrl?: string
  readTime: string
}
