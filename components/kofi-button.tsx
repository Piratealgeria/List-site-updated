import { Coffee } from "lucide-react"
import Link from "next/link"

interface KofiButtonProps {
  username: string
  text?: string
  isDarkMode: boolean
  size?: "sm" | "md" | "lg"
}

export function KofiButton({ username, text = "Support me on Ko-fi", isDarkMode, size = "md" }: KofiButtonProps) {
  const sizeClasses = {
    sm: "py-1 px-2 text-xs",
    md: "py-2 px-3 text-sm",
    lg: "py-3 px-4 text-base",
  }

  return (
    <Link
      href={`https://ko-fi.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded ${sizeClasses[size]} ${
        isDarkMode ? "bg-[#29abe0] hover:bg-[#1a8dbb] text-white" : "bg-[#29abe0] hover:bg-[#1a8dbb] text-white"
      } transition-colors duration-200 font-medium`}
    >
      <Coffee size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
      <span>{text}</span>
    </Link>
  )
}
