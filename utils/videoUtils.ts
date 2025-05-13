// Regular expressions to identify different video providers
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
const VIMEO_REGEX =
  /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?))/i
const DAILYMOTION_REGEX = /(?:dailymotion\.com\/(?:embed\/)?video\/([a-zA-Z0-9]+))/i
// Add Odysee regex
const ODYSEE_REGEX = /(?:odysee\.com\/(?:\$\/)?@[^:]+:[^/]+\/([^/?]+))/i

/**
 * Extracts the video ID from a video URL
 */
export function extractVideoId(url: string): { id: string; provider: string } | null {
  let match

  // Check for YouTube
  match = url.match(YOUTUBE_REGEX)
  if (match && match[1]) {
    return { id: match[1], provider: "youtube" }
  }

  // Check for Vimeo
  match = url.match(VIMEO_REGEX)
  if (match && match[1]) {
    return { id: match[1], provider: "vimeo" }
  }

  // Check for Dailymotion
  match = url.match(DAILYMOTION_REGEX)
  if (match && match[1]) {
    return { id: match[1], provider: "dailymotion" }
  }

  // Check for Odysee
  match = url.match(ODYSEE_REGEX)
  if (match && match[1]) {
    // Extract the full URL for Odysee as we need it for embedding
    return { id: url, provider: "odysee" }
  }

  return null
}

/**
 * Gets the thumbnail URL for a video
 */
export function getVideoThumbnail(videoData: { id: string; provider: string }): string {
  if (videoData.provider === "youtube") {
    return `https://img.youtube.com/vi/${videoData.id}/maxresdefault.jpg`
  } else if (videoData.provider === "vimeo") {
    // Vimeo doesn't have a direct thumbnail URL, you would need to use their API
    // This is a placeholder
    return `/placeholder.svg?height=480&width=640&text=Vimeo+${videoData.id}`
  } else if (videoData.provider === "dailymotion") {
    return `https://www.dailymotion.com/thumbnail/video/${videoData.id}`
  } else if (videoData.provider === "odysee") {
    // Odysee doesn't have a direct thumbnail URL, use a placeholder
    return `/placeholder.svg?height=480&width=640&text=Odysee+Video`
  }

  return `/placeholder.svg?height=480&width=640&text=Video`
}

/**
 * Gets the embed URL for a video
 */
export function getVideoEmbedUrl(videoData: { id: string; provider: string }): string {
  if (videoData.provider === "youtube") {
    return `https://www.youtube.com/embed/${videoData.id}`
  } else if (videoData.provider === "vimeo") {
    return `https://player.vimeo.com/video/${videoData.id}`
  } else if (videoData.provider === "dailymotion") {
    return `https://www.dailymotion.com/embed/video/${videoData.id}`
  } else if (videoData.provider === "odysee") {
    // For Odysee, we need to construct the embed URL from the original URL
    // The format is: https://odysee.com/$/embed/[video-slug]
    const match = videoData.id.match(ODYSEE_REGEX)
    if (match && match[1]) {
      return `https://odysee.com/$/embed/${match[1]}`
    }
    // If we can't extract the slug, just use the original URL
    return videoData.id
  }

  return ""
}

/**
 * Determines if a URL is a video URL
 */
export function isVideoUrl(url: string): boolean {
  return !!extractVideoId(url)
}
