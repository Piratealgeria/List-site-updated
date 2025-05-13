"use client"

import { useState } from "react"
import { Copy, Check, Info } from "lucide-react"

export default function GiscusConfig({ isDarkMode }: { isDarkMode: boolean }) {
  const [copied, setCopied] = useState(false)
  const [repo, setRepo] = useState("")
  const [repoId, setRepoId] = useState("")
  const [category, setCategory] = useState("Announcements")
  const [categoryId, setCategoryId] = useState("")

  const handleCopy = () => {
    const code = `<GiscusComments
  repo="${repo}"
  repoId="${repoId}"
  category="${category}"
  categoryId="${categoryId}"
  mapping="pathname"
  reactionsEnabled={true}
  emitMetadata={false}
  inputPosition="top"
  theme={isDarkMode ? "dark" : "light"}
  lang="en"
/>`

    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`${isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-300"} border p-4 my-6`}>
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-yellow-500" />
        <h2 className={`font-bold ${isDarkMode ? "text-yellow-100" : "text-yellow-800"}`}>Giscus Configuration</h2>
      </div>

      <div className="space-y-4 mb-4">
        <p className="text-sm">To set up Giscus comments, you need to:</p>
        <ol className="list-decimal pl-5 text-sm space-y-2">
          <li>
            Install the{" "}
            <a
              href="https://github.com/apps/giscus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Giscus GitHub App
            </a>{" "}
            on your repository
          </li>
          <li>Enable discussions in your repository settings</li>
          <li>Fill in the configuration details below</li>
        </ol>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Repository (username/repo)</label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g., username/comments"
              className={`w-full p-2 ${isDarkMode ? "bg-[#121212] text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"} border`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Repository ID</label>
            <input
              type="text"
              value={repoId}
              onChange={(e) => setRepoId(e.target.value)}
              placeholder="Get from Giscus website"
              className={`w-full p-2 ${isDarkMode ? "bg-[#121212] text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"} border`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Discussion Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full p-2 ${isDarkMode ? "bg-[#121212] text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"} border`}
            >
              <option value="Announcements">Announcements</option>
              <option value="General">General</option>
              <option value="Ideas">Ideas</option>
              <option value="Q&A">Q&A</option>
              <option value="Show and tell">Show and tell</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category ID</label>
            <input
              type="text"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Get from Giscus website"
              className={`w-full p-2 ${isDarkMode ? "bg-[#121212] text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"} border`}
            />
          </div>
        </div>
      </div>

      <div
        className={`${isDarkMode ? "bg-[#121212] border-gray-700" : "bg-gray-100 border-gray-300"} border p-3 rounded-none`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Component Code</span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-1 text-xs ${isDarkMode ? "bg-[#1a1a1a] hover:bg-gray-800 border-gray-700" : "bg-white hover:bg-gray-200 border-gray-300"} border`}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="text-xs overflow-x-auto p-2">
          {`<GiscusComments
  repo="${repo || "username/repo"}"
  repoId="${repoId || "repository_id"}"
  category="${category}"
  categoryId="${categoryId || "category_id"}"
  mapping="pathname"
  reactionsEnabled={true}
  emitMetadata={false}
  inputPosition="top"
  theme={isDarkMode ? "dark" : "light"}
  lang="en"
/>`}
        </pre>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>
          For more configuration options, visit the{" "}
          <a
            href="https://giscus.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Giscus website
          </a>
          .
        </p>
      </div>
    </div>
  )
}
