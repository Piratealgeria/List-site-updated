"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ChevronLeft, Calendar, User, Tag, Clock, ThumbsUp, MessageCircle, Share2 } from "lucide-react"
import { getPostData } from "../../utils/blogUtils"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { ShareDialog } from "../../components/share-dialog"

export default function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState<any>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      const postData = getPostData(id as string)
      setPost(postData)
    }
    fetchPost()
  }, [id])

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)
  }, [isDarkMode])

  const handleShare = () => {
    setIsShareDialogOpen(true)
  }

  if (!post) return null

  return (
    <div className={`min-h-screen font-mono ${isDarkMode ? "bg-[#121212] text-white" : "bg-[#f0f0f0] text-black"}`}>
      {/* Header */}
      <div className={`${isDarkMode ? "bg-black text-white" : "bg-[#e0e0e0] text-black"} px-4 py-2 flex items-center`}>
        <Link href="/" className="flex items-center text-[#ff9800]">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
        <h1 className="text-lg font-bold ml-4">MrCherif: {post.title}</h1>
      </div>

      {/* Post Content */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
          {post.title}
        </h1>

        {/* Post Metadata */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-6">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{post.tags.join(", ")}</span>
          </div>
        </div>

        {/* Post Image */}
        {post.image && (
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-64 object-cover mb-6" />
        )}

        {/* Post Content */}
        <div className={`text-sm leading-relaxed mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Post Actions */}
        <div
          className={`flex items-center justify-between py-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
        >
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm">
              <ThumbsUp className="h-4 w-4" />
              <span>Like</span>
            </button>
            <button className="flex items-center gap-1 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </button>
          </div>
          <button onClick={handleShare} className="flex items-center gap-1 text-sm">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        url={typeof window !== "undefined" ? window.location.href : `https://mrcherif.com/posts/${id}`}
        title={post.title}
        excerpt={post.excerpt}
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}
