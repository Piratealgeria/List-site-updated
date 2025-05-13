"use client"

import { useState, useEffect } from "react"
import { Copy, X, Share2, MessageCircle, Twitter } from "lucide-react"

interface ShareDialogProps {
  url: string
  title: string
  excerpt?: string
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
}

export function ShareDialog({ url, title, excerpt, isOpen, onClose, isDarkMode }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(twitterUrl, "_blank")
  }

  const shareToDiscord = () => {
    const discordUrl = `https://discord.com/channels/@me?content=${encodeURIComponent(`${title}\n${url}`)}`
    window.open(discordUrl, "_blank")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className={`${
          isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"
        } border rounded-none w-full max-w-md font-mono`}
      >
        {/* Dialog Header */}
        <div
          className={`flex items-center justify-between p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
        >
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className={`font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>SHARE</span>
          </div>
          <button
            onClick={onClose}
            className={`${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"} p-1 rounded-sm`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-4">
          <div className="mb-4">
            <h3 className={`text-sm font-bold mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              TERM://$
              <span className="text-green-500 ml-1">share</span>
              <span className="text-yellow-500 ml-1">"{title}"</span>
            </h3>
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={url}
                readOnly
                className={`flex-grow px-2 py-1 text-xs ${
                  isDarkMode ? "bg-[#121212] text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"
                } border rounded-none`}
              />
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1 px-2 py-1 text-xs ${
                  isDarkMode
                    ? "bg-[#121212] text-white border-gray-700 hover:bg-gray-800"
                    : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
                } border rounded-none`}
              >
                {copied ? "Copied!" : "Copy"}
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={shareToTwitter}
              className={`flex items-center justify-center gap-2 p-2 text-xs ${
                isDarkMode
                  ? "bg-[#121212] text-white border-gray-700 hover:bg-gray-800"
                  : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
              } border rounded-none`}
            >
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
            </button>

            <button
              onClick={shareToDiscord}
              className={`flex items-center justify-center gap-2 p-2 text-xs ${
                isDarkMode
                  ? "bg-[#121212] text-white border-gray-700 hover:bg-gray-800"
                  : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
              } border rounded-none`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Discord</span>
            </button>
          </div>

          {/* Native Share API Button (for mobile) */}
          {navigator.share && (
            <button
              onClick={() => {
                navigator
                  .share({
                    title: title,
                    text: excerpt || title,
                    url: url,
                  })
                  .catch((err) => console.error("Error sharing:", err))
              }}
              className={`w-full mt-3 flex items-center justify-center gap-2 p-2 text-xs ${
                isDarkMode ? "bg-green-700 text-white hover:bg-green-800" : "bg-green-600 text-white hover:bg-green-700"
              } rounded-none`}
            >
              <Share2 className="h-4 w-4" />
              <span>Share via Device</span>
            </button>
          )}
        </div>

        {/* Dialog Footer */}
        <div className={`p-3 border-t ${isDarkMode ? "border-gray-700 bg-[#121212]" : "border-gray-300 bg-[#f0f0f0]"}`}>
          <div className="flex items-center justify-between text-xs">
            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              TERM://$
              <span className="text-green-500 ml-1">echo</span>
              <span className="ml-1">"Thanks for sharing!"</span>
            </span>
            <button
              onClick={onClose}
              className={`px-2 py-1 ${
                isDarkMode
                  ? "bg-[#1a1a1a] text-white border-gray-700 hover:bg-gray-800"
                  : "bg-white text-black border-gray-300 hover:bg-gray-200"
              } border rounded-none`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
