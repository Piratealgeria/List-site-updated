"use client"

import { useEffect, useState } from "react"
import { commentsConfig } from "../config/comments"

interface GiscusCommentsProps {
  repo?: string
  repoId?: string
  category?: string
  categoryId?: string
  mapping?: string
  reactionsEnabled?: boolean
  emitMetadata?: boolean
  inputPosition?: string
  theme?: string
  lang?: string
}

export default function GiscusComments({
  repo = commentsConfig.giscus.repo,
  repoId = commentsConfig.giscus.repoId,
  category = commentsConfig.giscus.category,
  categoryId = commentsConfig.giscus.categoryId,
  mapping = commentsConfig.giscus.mapping,
  reactionsEnabled = commentsConfig.giscus.reactionsEnabled,
  emitMetadata = commentsConfig.giscus.emitMetadata,
  inputPosition = commentsConfig.giscus.inputPosition,
  theme = "dark",
  lang = commentsConfig.giscus.lang,
}: GiscusCommentsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) {
      setMounted(true)

      // Load Giscus script
      const script = document.createElement("script")
      script.src = "https://giscus.app/client.js"
      script.async = true
      script.crossOrigin = "anonymous"
      script.setAttribute("data-repo", repo)
      script.setAttribute("data-repo-id", repoId)
      script.setAttribute("data-category", category)
      script.setAttribute("data-category-id", categoryId)
      script.setAttribute("data-mapping", mapping)
      script.setAttribute("data-reactions-enabled", reactionsEnabled ? "1" : "0")
      script.setAttribute("data-emit-metadata", emitMetadata ? "1" : "0")
      script.setAttribute("data-input-position", inputPosition)
      script.setAttribute("data-theme", theme)
      script.setAttribute("data-lang", lang)

      const commentsDiv = document.getElementById("giscus-comments")
      if (commentsDiv) {
        // Clear any existing content
        commentsDiv.innerHTML = ""
        // Append the script
        commentsDiv.appendChild(script)
      }
    }
  }, [mounted, repo, repoId, category, categoryId, mapping, reactionsEnabled, emitMetadata, inputPosition, theme, lang])

  return <div id="giscus-comments" className="giscus mt-4" />
}
