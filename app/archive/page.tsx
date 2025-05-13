import type { Metadata } from "next"
import ArchiveContent from "../../components/archive-content"
import { generateMetadata } from "../../utils/metadata"

export const metadata: Metadata = generateMetadata(
  "Blog Archive",
  "Browse all articles by date on MrCherif's terminal-style tech blog.",
  "/archive-og-image.jpg",
  "/archive",
)

export default function ArchivePage() {
  return <ArchiveContent />
}
