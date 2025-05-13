export interface NewsItem {
  id: string
  text: string
  url?: string
}

export const newsItems: NewsItem[] = [
  {
    id: "news1",
    text: "New blog post: My thoughts on recent events",
    url: "/posts/recent-events",
  },
  {
    id: "news2",
    text: "Updated the photo gallery with new images",
    url: "/gallery",
  },
  {
    id: "news3",
    text: "Added a new section about my hobbies",
    url: "/about",
  },
  {
    id: "news4",
    text: "Check out my latest travel journal entry",
    url: "/posts/travel-journal",
  },
  {
    id: "news5",
    text: "Site updates: New dark mode and accessibility features",
    url: "/posts/site-updates",
  },
]
