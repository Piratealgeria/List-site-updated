import type { Metadata } from "next"
import CategoriesContent from "../../components/categories-content"
import { generateMetadata } from "../../utils/metadata"

export const metadata: Metadata = generateMetadata(
  "Blog Categories",
  "Browse all categories of articles on MrCherif's terminal-style tech blog.",
  "/categories-og-image.jpg",
  "/categories",
)

export default function CategoriesPage() {
  return <CategoriesContent />
}
