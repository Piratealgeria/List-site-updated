import type { Metadata } from "next"
import AboutContent from "../../components/about-content"
import { generateMetadata } from "../../utils/metadata"

export const metadata: Metadata = generateMetadata(
  "About Viking Algeria",
  "Learn more about Viking Algeria, a content creator focusing on anime mixes and videos on Odysee.",
  "/about-og-image.jpg",
  "/about",
)

export default function AboutPage() {
  return <AboutContent />
}
