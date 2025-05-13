"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Clock, ChevronRight, Edit, Trash2, Reply } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  author: {
    name: string
    image?: string
  }
  createdAt: string
  replies?: Comment[]
  isEditing?: boolean
}

interface TerminalCommentsProps {
  postId: string
  initialComments?: Comment[]
  isDarkMode: boolean
}

export default function TerminalComments({ postId, initialComments = [], isDarkMode }: TerminalCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState<string>("")
  const commentInputRef = useRef<HTMLInputElement>(null)

  // Load username from localStorage if available
  useEffect(() => {
    const savedName = localStorage.getItem("comment_user_name")
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

  // Focus the input when component mounts
  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }, [])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isLoading) return

    setIsLoading(true)

    // Save username to localStorage if provided
    if (userName.trim()) {
      localStorage.setItem("comment_user_name", userName)
    }

    // Simulate API call
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: {
          name: userName.trim() || "Anonymous",
        },
        createdAt: new Date().toISOString(),
      }

      setComments([...comments, newCommentObj])
      setNewComment("")
      setIsLoading(false)
    }, 500)
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || isLoading) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newReply: Comment = {
        id: Date.now().toString(),
        content: replyContent,
        author: {
          name: userName.trim() || "Anonymous",
        },
        createdAt: new Date().toISOString(),
      }

      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          }
        }
        return comment
      })

      setComments(updatedComments)
      setReplyContent("")
      setReplyingTo(null)
      setIsLoading(false)
    }, 500)
  }

  const handleEditComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, isEditing: true }
        }
        return comment
      }),
    )
  }

  const handleUpdateComment = (commentId: string, newContent: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, content: newContent, isEditing: false }
        }
        return comment
      }),
    )
  }

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((comment) => comment.id !== commentId))
  }

  const isCommentOwner = (authorName: string) => {
    return authorName === userName
  }

  const renderComment = (comment: Comment, isReply = false) => {
    return (
      <div
        key={comment.id}
        className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border p-3 mb-3 ${isReply ? "ml-6" : ""}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3 text-green-500" />
            <span className="text-green-500 text-xs">user@blog:~$</span>
            <span className={`text-xs ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
              {comment.author.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {comment.isEditing ? (
          <div className="mb-2">
            <input
              type="text"
              defaultValue={comment.content}
              className={`w-full p-2 ${isDarkMode ? "bg-[#121212] text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"} border rounded`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateComment(comment.id, e.currentTarget.value)
                } else if (e.key === "Escape") {
                  setComments(
                    comments.map((c) => {
                      if (c.id === comment.id) {
                        return { ...c, isEditing: false }
                      }
                      return c
                    }),
                  )
                }
              }}
              autoFocus
            />
            <div className="text-xs mt-1 text-gray-500">Press Enter to save, Escape to cancel</div>
          </div>
        ) : (
          <div
            className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} text-sm mb-2 whitespace-pre-wrap font-mono`}
          >
            {comment.content}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className={`flex items-center gap-1 text-xs px-2 py-1 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"} rounded`}
            >
              <Reply className="h-3 w-3" />
              <span>{replyingTo === comment.id ? "Cancel" : "Reply"}</span>
            </button>
          )}

          {isCommentOwner(comment.author.name) && (
            <>
              <button
                onClick={() => handleEditComment(comment.id)}
                className={`flex items-center gap-1 text-xs px-2 py-1 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"} rounded`}
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className={`flex items-center gap-1 text-xs px-2 py-1 ${isDarkMode ? "hover:bg-gray-800 text-red-400" : "hover:bg-gray-200 text-red-600"} rounded`}
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>

        {replyingTo === comment.id && (
          <div
            className={`mt-3 p-2 ${isDarkMode ? "bg-[#121212] border-gray-700" : "bg-gray-100 border-gray-300"} border rounded`}
          >
            <div className="flex items-center gap-2 mb-2">
              <ChevronRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500 text-xs">reply@blog:~$</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply..."
                className={`flex-grow p-2 ${isDarkMode ? "bg-[#1a1a1a] text-white border-gray-700" : "bg-white text-black border-gray-300"} border rounded text-sm`}
                autoFocus
              />
              <button
                onClick={() => handleSubmitReply(comment.id)}
                disabled={!replyContent.trim() || isLoading}
                className={`flex items-center gap-1 px-3 py-1 ${isDarkMode ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-500"} text-white rounded disabled:opacity-50`}
              >
                <Send className="h-3 w-3" />
                <span className="text-xs">Send</span>
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">{comment.replies.map((reply) => renderComment(reply, true))}</div>
        )}
      </div>
    )
  }

  return (
    <div className={`mt-8 ${isDarkMode ? "text-white" : "text-black"}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>
        Comments ({comments.length})
      </h2>

      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border p-3`}>
          <div className="flex items-center gap-2 mb-2">
            <ChevronRight className="h-3 w-3 text-green-500" />
            <span className="text-green-500 text-xs">comment@blog:~$</span>

            {/* Username input */}
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className={`px-2 py-1 text-xs ${isDarkMode ? "bg-[#121212] text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"} border rounded w-32`}
            />
          </div>
          <div className="flex gap-2">
            <input
              ref={commentInputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your comment..."
              className={`flex-grow p-2 ${isDarkMode ? "bg-[#121212] text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"} border rounded text-sm`}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isLoading}
              className={`flex items-center gap-1 px-3 py-1 ${isDarkMode ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-500"} text-white rounded disabled:opacity-50`}
            >
              <Send className="h-3 w-3" />
              <span className="text-xs">Send</span>
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">Enter your name to save it with your comments</div>
        </div>
      </form>

      {/* Comments list */}
      <div>
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <div
            className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border p-4 text-center`}
          >
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
